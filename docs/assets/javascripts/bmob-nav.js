/**
 * 左侧导航：竖线高亮当前页菜单（按 URL/点击定位，不随正文滚动 tracking 变化）
 */
(function () {
  "use strict";

  var resizeObserver = null;
  var toggleHandlers = [];
  var pinnedLink = null;
  var ctx = null;

  var LIST_SELECTOR =
    ".md-sidebar--primary .md-nav--lifted > .md-nav__list > .md-nav__item--active > .md-nav[data-md-level='1'] > .md-nav__list";

  function isVisible(el) {
    return !!(el && el.offsetParent !== null && el.getClientRects().length);
  }

  function normalizePath(href) {
    try {
      var path = new URL(href, window.location.href).pathname;
      return path.replace(/\/index\.html$/, "/").replace(/\/$/, "") || "/";
    } catch (e) {
      return href;
    }
  }

  function currentPath() {
    return normalizePath(window.location.pathname);
  }

  function isNavPageLink(link, list) {
    if (!list.contains(link)) return false;
    if (link.closest(".md-nav--secondary")) return false;
    var href = link.getAttribute("href");
    return href && href.charAt(0) !== "#";
  }

  function findPageLink(list) {
    var current = currentPath();
    var matches = [];

    list.querySelectorAll("a.md-nav__link[href]").forEach(function (link) {
      if (!isNavPageLink(link, list)) return;
      if (normalizePath(link.getAttribute("href")) !== current) return;
      matches.push(link);
    });

    var visible = matches.filter(isVisible);
    if (visible.length) return visible[visible.length - 1];
    return matches.length ? matches[matches.length - 1] : null;
  }

  /** 竖线对齐可见菜单行（li），避免 hidden 的重复 a/label 导致偏移 */
  function getMarkerRow(link, list) {
    var item = link.closest(".md-nav__item");
    if (!item || !list.contains(item)) return link;

    var label = item.querySelector("label.md-nav__link");
    var anchor = item.querySelector("a.md-nav__link[href]");

    if (isVisible(label)) return item;
    if (isVisible(anchor)) return item;
    return item;
  }

  function offsetTopWithin(child, parent) {
    var childRect = child.getBoundingClientRect();
    var parentRect = parent.getBoundingClientRect();
    return childRect.top - parentRect.top + parent.scrollTop;
  }

  function resolveLink(list) {
    if (pinnedLink && list.contains(pinnedLink) && isNavPageLink(pinnedLink, list)) {
      return pinnedLink;
    }
    pinnedLink = findPageLink(list);
    return pinnedLink;
  }

  function setup(sidebar) {
    var list = sidebar.querySelector(LIST_SELECTOR);
    if (!list) return null;

    var indicator = list.querySelector(".bmob-nav-indicator");
    if (!indicator) {
      indicator = document.createElement("span");
      indicator.className = "bmob-nav-indicator";
      indicator.setAttribute("aria-hidden", "true");
      list.prepend(indicator);
    }

    pinnedLink = findPageLink(list);

    function update() {
      var link = resolveLink(list);
      if (!link) {
        indicator.style.opacity = "0";
        return;
      }

      var row = getMarkerRow(link, list);
      var top = offsetTopWithin(row, list);
      indicator.style.opacity = "1";
      indicator.style.top = top + "px";
      indicator.style.height = Math.max(row.offsetHeight, 18) + "px";
    }

    function onNavClick(event) {
      var link = event.target.closest("a.md-nav__link");
      if (!link || !isNavPageLink(link, list)) return;
      pinnedLink = link;
      requestAnimationFrame(function () {
        requestAnimationFrame(update);
      });
    }

    list.addEventListener("click", onNavClick);

    return {
      list: list,
      update: update,
      destroy: function () {
        list.removeEventListener("click", onNavClick);
      },
    };
  }

  function teardown() {
    if (ctx && ctx.destroy) {
      ctx.destroy();
    }
    ctx = null;
    pinnedLink = null;

    if (resizeObserver) {
      resizeObserver.disconnect();
      resizeObserver = null;
    }
    toggleHandlers.forEach(function (pair) {
      pair[0].removeEventListener("change", pair[1]);
    });
    toggleHandlers = [];
  }

  function init() {
    teardown();

    var sidebar = document.querySelector(
      ".md-sidebar--primary[data-md-type='navigation']"
    );
    if (!sidebar) return;

    ctx = setup(sidebar);
    if (!ctx) return;

    var update = function () {
      requestAnimationFrame(ctx.update);
    };

    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(update);
      resizeObserver.observe(ctx.list);
    }

    sidebar.querySelectorAll(".md-nav__toggle").forEach(function (toggle) {
      toggleHandlers.push([toggle, update]);
      toggle.addEventListener("change", update);
    });

    requestAnimationFrame(update);
  }

  function boot() {
    init();
    window.addEventListener("hashchange", init);
    window.addEventListener("popstate", init);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
