import os
import logging
from pprint import pprint
from timeit import default_timer as timer
from datetime import datetime, timedelta

from mkdocs import utils as mkdocs_utils
from mkdocs.config import config_options, Config
from mkdocs.plugins import BasePlugin

from git import Repo, Commit
import requests, json
from requests.exceptions import HTTPError
import time
import re

from mkdocs_git_committers_plugin_2.exclude import exclude

LOG = logging.getLogger("mkdocs.plugins." + __name__)

class GitCommittersPlugin(BasePlugin):

    config_scheme = (
        ('enterprise_hostname', config_options.Type(str, default='')),
        ('gitlab_hostname', config_options.Type(str, default='')),
        ('repository', config_options.Type(str, default='')),           # For GitHub: owner/repo
        ('gitlab_repository', config_options.Type(int, default=0)),     # For GitLab: project_id
        ('api_version', config_options.Type(str, default=None)),
        ('branch', config_options.Type(str, default='master')),
        ('docs_path', config_options.Type(str, default='docs/')),
        ('enabled', config_options.Type(bool, default=True)),
        ('cache_dir', config_options.Type(str, default='.cache/plugin/git-committers')),
        ("exclude", config_options.Type(list, default=[])),
        ("exclude_committers", config_options.Type(list, default=[])),
        ('token', config_options.Type(str, default='')),
    )

    def __init__(self):
        self.total_time = 0
        self.branch = 'master'
        self.enabled = True
        self.authors = dict()
        self.cache_page_authors = dict()
        self.exclude = list()
        self.exclude_committers = list()
        self.cache_date = ''
        self.last_request_return_code = 0
        self.githuburl = "https://api.github.com"
        self.gitlaburl = "https://gitlab.com/api/v4"
        self.gitlabauthors_cache = dict()
        self.should_save_cache = False

    def on_config(self, config):
        self.enabled = self.config['enabled']
        if not self.enabled:
            LOG.info("git-committers plugin DISABLED")
            return config

        LOG.info("git-committers plugin ENABLED")
        if not self.config['token'] and 'MKDOCS_GIT_COMMITTERS_APIKEY' in os.environ:
            self.config['token'] = os.environ['MKDOCS_GIT_COMMITTERS_APIKEY']

        if not self.config['repository'] and not self.config['gitlab_repository']:
            LOG.error("git-committers plugin: repository not specified")
            return config
        if self.config['enterprise_hostname'] and self.config['enterprise_hostname'] != '':
            if not self.config.get('api_version'):
                self.githuburl = "https://" + self.config['enterprise_hostname'] + "/api"
            else:
                self.githuburl = "https://" + self.config['enterprise_hostname'] + "/api/" + self.config['api_version']
        if self.config['gitlab_hostname'] and self.config['gitlab_hostname'] != '':
            if not self.config.get('api_version'):
                self.gitlaburl = "https://" + self.config['gitlab_hostname'] + "/api/v4"
            else:
                self.gitlaburl = "https://" + self.config['gitlab_hostname'] + "/api/" + self.config['api_version']
            # gitlab_repository must be set
            if not self.config['gitlab_repository']:
                LOG.error("git-committers plugin: gitlab_repository must be set, with the GitLab project ID")
        if self.config['token'] and self.config['token'] != '':
            if self.config['gitlab_repository']:
                self.auth_header = {'PRIVATE-TOKEN': self.config['token'] }
            else:
                self.auth_header = {'Authorization': 'token ' + self.config['token'] }
        else:
            self.auth_header = None
            if self.config['gitlab_repository']:
                LOG.error("git-committers plugin: GitLab API requires a token. Set it under 'token' mkdocs.yml config or MKDOCS_GIT_COMMITTERS_APIKEY environment variable.")
            else:
                LOG.warning("git-committers plugin may require a GitHub token if you exceed the API rate limit or for private repositories. Set it under 'token' mkdocs.yml config or MKDOCS_GIT_COMMITTERS_APIKEY environment variable.")
        self.localrepo = Repo(".", search_parent_directories=True)
        self.branch = self.config['branch']
        self.excluded_pages = self.config['exclude']
        self.exclude_committers = self.config['exclude_committers']
        return config

    # Get unique contributors for a given path
    def get_contributors_to_file(self, path, submodule_repo=None):
            # We already got a 401 (unauthorized) or 403 (rate limit) error, so we don't try again
            if self.last_request_return_code == 403 or self.last_request_return_code == 401:
                return []
            if self.config['gitlab_repository']:
                # REST endpoint is in the form https://gitlab.com/api/v4/projects/[project ID]/repository/commits?path=[uri-encoded-path]&ref_name=[branch]
                url = self.gitlaburl + "/projects/" + str(self.config['gitlab_repository']) + "/repository/commits?path=" +  requests.utils.quote(path) + "&ref_name=" + self.branch
            else:
                # Check git submodule
                repository = submodule_repo or self.config['repository']
                # REST endpoint is in the form https://api.github.com/repos/[repository]/commits?path=[uri-encoded-path]&sha=[branch]&per_page=100
                url = self.githuburl + "/repos/" + repository + "/commits?path=" +  requests.utils.quote(path) + "&sha=" + self.branch + "&per_page=100"
            authors = []
            LOG.info("git-committers: fetching contributors for " + path)
            r = requests.get(url=url, headers=self.auth_header)
            self.last_request_return_code = r.status_code
            if r.status_code == 200:
                # Get login, url and avatar for each author. Ensure no duplicates.
                res = r.json()
                github_coauthors_exist = False
                for commit in res:
                    if not self.config['gitlab_repository']:
                        # GitHub
                        if commit['author'] and commit['author']['login'] and commit['author']['login'] not in [author['login'] for author in authors]:
                            authors.append({'login': commit['author']['login'],
                                            'name': commit['author']['login'],
                                            'url': commit['author']['html_url'],
                                            'avatar': commit['author']['avatar_url'] if commit['author']['avatar_url'] is not None else ''
                                            })
                        if commit['committer'] and commit['committer']['login'] and commit['committer']['login'] not in [author['login'] for author in authors]:
                            authors.append({'login': commit['committer']['login'],
                                            'name': commit['committer']['login'],
                                            'url': commit['committer']['html_url'],
                                            'avatar': commit['committer']['avatar_url'] if commit['committer']['avatar_url'] is not None else ''
                                            })
                        if commit['commit'] and commit['commit']['message'] and '\nCo-authored-by:' in commit['commit']['message']:
                            github_coauthors_exist = True
                    else:
                        # GitLab
                        if commit['author_name']:
                            # If author is not already in the list of authors
                            if commit['author_name'] not in [author['name'] for author in authors]:
                                # Look for GitLab author in our cache self.gitlabauthors. If not found fetch it from GitLab API and save it in cache.
                                if commit['author_name'] in self.gitlabauthors_cache:
                                    authors.append({'login': self.gitlabauthors_cache[commit['author_name']]['username'],
                                                    'name': commit['author_name'],
                                                    'url': self.gitlabauthors_cache[commit['author_name']]['web_url'],
                                                    'avatar': self.gitlabauthors_cache[commit['author_name']]['avatar_url'] if self.gitlabauthors_cache[commit['author_name']]['avatar_url'] is not None else ''
                                                    })
                                else:
                                    # Fetch author from GitLab API
                                    url = self.gitlaburl + "/users?search=" + requests.utils.quote(commit['author_name'])
                                    r = requests.get(url=url, headers=self.auth_header)
                                    if r.status_code == 200:
                                        res = r.json()
                                        if len(res) > 0:
                                            # Go through all users until we find the one with the same name
                                            for user in res:
                                                if user['name'] == commit['author_name']:
                                                    # Save it in cache
                                                    self.gitlabauthors_cache[commit['author_name']] = user
                                                    authors.append({'login': user['username'],
                                                                    'name': user['name'],
                                                                    'url': user['web_url'],
                                                                    'avatar': user['avatar_url'] if user['avatar_url'] is not None else ''
                                                                    })
                                                    break
                                    else:
                                        LOG.error("git-committers:   " + str(r.status_code) + " " + r.reason)
                if github_coauthors_exist:
                    github_coauthors_count = 0
                    # Get co-authors info through the GraphQL API, which is not available in the REST API
                    if self.auth_header is None:
                        LOG.warning("git-committers: Co-authors exist in commit messages but will not be added, since no GitHub token is provided. Set it under 'token' mkdocs.yml config or MKDOCS_GIT_COMMITTERS_APIKEY environment variable.")
                    else:
                        LOG.info("git-committers: fetching contributors for " + path + " using GraphQL API")
                        # Query GraphQL API, and get a list of unique authors
                        url = self.githuburl + "/graphql"
                        query = {
                                "query": """
                                {
                                  repository(owner: "%s", name: "%s") {
                                    object(expression: "%s") {
                                      ... on Commit {
                                        history(first: 100, path: "%s") {
                                          nodes {
                                            authors(first: 100) {
                                              nodes {
                                                user {
                                                  login
                                                  name
                                                  url
                                                  avatarUrl
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                                """ % (self.config['repository'].split('/')[0], self.config['repository'].split('/')[1], self.branch, path)
                        }
                        r = requests.post(url=url, json=query, headers=self.auth_header)
                        res = r.json()
                        if r.status_code == 200:
                            if res.get('data'):
                                if res['data']['repository']['object']['history']['nodes']:
                                    for history_node in res['data']['repository']['object']['history']['nodes']:
                                        for author_node in history_node['authors']['nodes']:
                                            # If user is not None (GitHub user was deleted)
                                            if author_node['user']:
                                                if author_node['user']['login'] not in [author['login'] for author in authors]:
                                                    authors.append({'login': author_node['user']['login'],
                                                                    'name': author_node['user']['name'],
                                                                    'url': author_node['user']['url'],
                                                                    'avatar': author_node['user']['avatarUrl']})
                                                    github_coauthors_count += 1
                            else:
                                LOG.warning("git-committers: Error from GitHub GraphQL call: " + res['errors'][0]['message'])
                    LOG.info(f"git-committers: added {github_coauthors_count} co-authors")
                return authors
            else:
                LOG.error("git-committers: error fetching contributors for " + path)
                if r.status_code == 403 or r.status_code == 401:
                    LOG.error("git-committers:   " + str(r.status_code) + " " + r.reason + " - You may have exceeded the API rate limit or need to be authorized. You can set a token under 'token' mkdocs.yml config or MKDOCS_GIT_COMMITTERS_APIKEY environment variable.")
                else:
                    LOG.error("git-committers:   " + str(r.status_code) + " " + r.reason)
                return []
            return []
        
    def list_contributors(self, path):
        last_commit_date = ""
        path = path.replace("\\", "/")
        for c in Commit.iter_items(self.localrepo, self.localrepo.head, path):
            if not last_commit_date:
                # Use the last commit and get the date
                last_commit_date = time.strftime("%Y-%m-%d", time.gmtime(c.authored_date))

        # Check if the file is in a git submodule on GitHub
        submodule_repo, path_in_submodule = None, None
        if last_commit_date == "" and not self.config['gitlab_repository']:
            for submodule in self.localrepo.submodules:
                if submodule_repo:
                    break
                if not path.startswith(submodule.path):
                    continue
                match = re.match(r"https:\/\/github\.com\/([^\/]+\/[^\/.]+)", submodule.url)
                if not match:
                    LOG.warning("git-committers: Submodule matched but will not be queried, since it isn't a GitHub repo.")
                    continue
                path_in_submodule = path[len(submodule.path)+1:]
                for c in Commit.iter_items(submodule.module(), submodule.module().head, path_in_submodule):
                    if not last_commit_date:
                        # Use the last commit and get the date
                        submodule_repo = match.group(1)
                        last_commit_date = time.strftime("%Y-%m-%d", time.gmtime(c.authored_date))

        # File not committed yet
        if last_commit_date == "":
            last_commit_date = datetime.now().strftime("%Y-%m-%d")
            return [], last_commit_date

        # Use the cache if present if cache date is newer than last commit date
        if path in self.cache_page_authors:
            if self.cache_date and time.strptime(last_commit_date, "%Y-%m-%d") < time.strptime(self.cache_date, "%Y-%m-%d"):
                # If page_autors in cache is not empty, return it
                if self.cache_page_authors[path]['authors']:
                    return self.cache_page_authors[path]['authors'], self.cache_page_authors[path]['last_commit_date']

        authors=[]
        if not submodule_repo:
            authors = self.get_contributors_to_file(path)
        else:
            LOG.info("git-committers: fetching submodule info for " + path + " from repository " + submodule_repo + " with path " + path_in_submodule)
            authors = self.get_contributors_to_file(path_in_submodule, submodule_repo=submodule_repo)

        for exclude_committer in set(self.exclude_committers):
            for author in tuple(authors):
                if author["login"] == exclude_committer:
                    authors.remove(author)
                    break

        if path not in self.cache_page_authors or self.cache_page_authors[path] != {'last_commit_date': last_commit_date, 'authors': authors}:
            self.should_save_cache = True
            self.cache_page_authors[path] = {'last_commit_date': last_commit_date, 'authors': authors}

        return authors, last_commit_date

    def on_page_context(self, context, page, config, nav):
        context['committers'] = []
        if not self.enabled:
            return context
        if exclude(page.file.src_path, self.excluded_pages):
            LOG.info("git-committers: " + page.file.src_path + " is excluded")
            return context
        start = timer()
        git_path = self.config['docs_path'] + page.file.src_path
        authors, last_commit_date = self.list_contributors(git_path)
        if authors:
            context['committers'] = authors
        if last_commit_date:
            context['last_commit_date'] = last_commit_date
        if not self.config['gitlab_repository']:
            context['committers_source'] = 'github'
        else:
            context['committers_source'] = 'gitlab'
        end = timer()
        self.total_time += (end - start)

        return context

    def on_post_build(self, config):
        if not self.should_save_cache:
            return
        LOG.info("git-committers: saving page authors cache file")
        json_data = json.dumps({'cache_date': datetime.now().strftime("%Y-%m-%d"), 'page_authors': self.cache_page_authors})
        os.makedirs(self.config['cache_dir'], exist_ok=True)
        f = open(self.config['cache_dir'] + "/page-authors.json", "w")
        f.write(json_data)
        f.close()

    def on_pre_build(self, config):
        if os.path.exists(self.config['cache_dir'] + "/page-authors.json"):
            LOG.info("git-committers: found page authors cache file - loading it")
            f = open(self.config['cache_dir'] + "/page-authors.json", "r")
            cache = json.loads(f.read())
            self.cache_date = cache['cache_date']
            self.cache_page_authors = cache['page_authors']
            f.close()
