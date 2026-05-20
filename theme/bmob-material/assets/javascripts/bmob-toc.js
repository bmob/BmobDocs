/**
 * 右侧 TOC：在唯一竖线轨道上显示当前滚动位置的高亮段（支持任意嵌套层级）
 */
(function () {
  "use strict";

  var observer = null;
  var scrollHandler = null;
  var resizeObserver = null;
  var contentObserver = null;
  var initTimer = null;

  function offsetTopWithin(child, parent) {
    return (
      child.getBoundingClientRect().top -
      parent.getBoundingClientRect().top +
      parent.scrollTop
    );
  }

  function setup(sidebar) {
    var list =
      sidebar.querySelector(
        ".md-nav--secondary > .md-nav__list[data-md-component='toc']"
      ) || sidebar.querySelector(".md-nav--secondary > .md-nav__list");
    if (!list) return null;

    var indicator = list.querySelector(".bmob-toc-indicator");
    if (!indicator) {
      indicator = document.createElement("span");
      indicator.className = "bmob-toc-indicator";
      indicator.setAttribute("aria-hidden", "true");
      list.prepend(indicator);
    }

    function update() {
      var active = sidebar.querySelector(".md-nav__link--active");
      if (!active) {
        indicator.style.opacity = "0";
        return;
      }
      var top = offsetTopWithin(active, list);
      indicator.style.opacity = "1";
      indicator.style.top = top + "px";
      indicator.style.height = Math.max(active.offsetHeight, 18) + "px";
    }

    return { sidebar: sidebar, list: list, update: update };
  }

  function teardown() {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
    if (scrollHandler) {
      window.removeEventListener("scroll", scrollHandler);
      scrollHandler = null;
    }
    if (resizeObserver) {
      resizeObserver.disconnect();
      resizeObserver = null;
    }
    if (contentObserver) {
      contentObserver.disconnect();
      contentObserver = null;
    }
    if (initTimer) {
      clearTimeout(initTimer);
      initTimer = null;
    }
  }

  function init() {
    teardown();

    var sidebar = document.querySelector(
      ".md-sidebar--secondary[data-md-type='toc']"
    );
    if (!sidebar) return;

    var ctx = setup(sidebar);
    if (!ctx) return;

    var update = function () {
      requestAnimationFrame(ctx.update);
    };

    scrollHandler = update;
    window.addEventListener("scroll", scrollHandler, { passive: true });

    observer = new MutationObserver(update);
    sidebar.querySelectorAll(".md-nav__link").forEach(function (link) {
      observer.observe(link, {
        attributes: true,
        attributeFilter: ["class"],
      });
    });

    var scrollwrap = sidebar.querySelector(".md-sidebar__scrollwrap");
    if (scrollwrap) {
      scrollwrap.addEventListener("scroll", update, { passive: true });
    }

    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(update);
      resizeObserver.observe(ctx.list);
      resizeObserver.observe(sidebar);
    }

    var content = document.querySelector("[data-md-component='content']");
    if (content) {
      contentObserver = new MutationObserver(function () {
        clearTimeout(initTimer);
        initTimer = setTimeout(init, 80);
      });
      contentObserver.observe(content, { childList: true });
    }

    update();
  }

  function boot() {
    init();
    window.addEventListener("hashchange", init);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
