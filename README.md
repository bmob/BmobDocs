# Bmob 文档中心

[Bmob 后端云](https://www.bmobapp.com/) 官方开发文档站点源码仓库。文档使用 [MkDocs](https://www.mkdocs.org/) 与 [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/) 构建，并基于 `theme/bmob-material` 做了品牌定制。

- **在线文档**：[http://doc.bmobapp.com](http://doc.bmobapp.com)
- **源码仓库**：[https://github.com/bmob/bmobdocs](https://github.com/bmob/bmobdocs)

## 文档内容

站点涵盖 Bmob 后端云各产品与多平台 SDK 的开发说明，主要包括：

| 模块 | 说明 |
|------|------|
| 数据服务 | Android、iOS、鸿蒙、REST API、小程序、Flutter、Python 等 |
| 云函数 | Web 端云函数、数据钩子、支付、定时任务及各端 SDK |
| 短信服务 | 各平台短信验证码与模板相关接口 |
| AI 人工智能 | Android、iOS、小程序/HTML5、REST API、Python |
| 其他 | 域名管理、常见问题、错误码、数据安全、BQL 等 |

导航结构在 `mkdocs.yml` 的 `nav` 中维护；正文 Markdown 位于 `mds/` 目录。

## 项目结构

```
BmobDocs/
├── mds/                  # 文档源文件（Markdown）
├── docs/                 # 构建产物（静态站点，由 mkdocs build 生成）
├── theme/bmob-material/  # Bmob 定制主题（样式、模板、脚本）
├── mkdocs.yml            # MkDocs 站点配置
├── requirements.txt      # Python 依赖
└── README.md
```

## 环境要求

- Python 3.8+
- 建议使用虚拟环境（`venv`）

## 本地开发

### 1. 克隆仓库

```bash
git clone https://github.com/bmob/bmobdocs.git
cd bmobdocs
```

### 2. 创建虚拟环境并安装依赖

```bash
python3 -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
pip install mkdocs-material
```

### 3. 启动本地预览

```bash
mkdocs serve
```

浏览器访问 [http://127.0.0.1:8000](http://127.0.0.1:8000)。修改 `mds/` 下的 Markdown 后保存即可热重载预览。

如需局域网访问（例如手机调试），可使用：

```bash
mkdocs serve --dev-addr=0.0.0.0:8000
```

## 构建与发布

生成静态站点到 `docs/` 目录：

```bash
mkdocs build
```

构建完成后，将 `docs/` 目录部署到 Web 服务器或静态托管（如 Nginx、GitHub Pages、对象存储等）即可对外提供访问。

若使用 GitHub Pages，也可执行：

```bash
mkdocs gh-deploy
```

（需已配置仓库 Pages 与相应权限。）

## 编写与修改文档

1. 在 `mds/` 下按现有目录结构新增或编辑 `.md` 文件。
2. 若需出现在侧边栏，在 `mkdocs.yml` 的 `nav` 中增加对应条目。
3. 本地执行 `mkdocs serve` 检查排版、链接与搜索是否正常。
4. 确认无误后提交 Pull Request 或按团队流程合并发布。

首页为定制落地页，源文件为 `mds/index.md`，样式与脚本见 `theme/bmob-material/`。

## 主题与配置说明

- **站点名称、导航、插件**：`mkdocs.yml`
- **界面语言**：`zh`（简体中文）
- **主题**：Material，自定义目录 `theme/bmob-material`
- **源文档目录**：`mds`（`docs_dir`）
- **输出目录**：`docs`（`site_dir`）

主题相关资源（CSS、页脚、导航脚本等）修改后，重新 `mkdocs serve` 或 `mkdocs build` 即可看到效果。

## 参与贡献

欢迎通过 Issue 或 Pull Request 修正文档错误、补充示例或更新过时说明。提交前请：

- 在本地完成 `mkdocs build`，确保无构建错误；
- 检查新增页面的 `nav` 配置与站内链接；
- 保持与现有文档一致的术语与代码风格。

## 相关链接

- [Bmob 官网](https://www.bmobapp.com/)
- [Bmob 控制台](https://www.bmobapp.com/login)
- [在线文档](http://doc.bmobapp.com)

## 许可证

本项目文档站点基于 MkDocs Material 技术栈搭建。Material for MkDocs 遵循 [MIT License](LICENSE)。

文档内容由 Bmob 维护，版权归 Bmob 所有。
