"use strict";
(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __objRest = (source, exclude) => {
    var target = {};
    for (var prop in source)
      if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
        target[prop] = source[prop];
    if (source != null && __getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(source)) {
        if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
          target[prop] = source[prop];
      }
    return target;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from2, except, desc) => {
    if (from2 && typeof from2 === "object" || typeof from2 === "function") {
      for (let key of __getOwnPropNames(from2))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from2[key], enumerable: !(desc = __getOwnPropDesc(from2, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve4, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve4(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };

  // node_modules/focus-visible/dist/focus-visible.js
  var require_focus_visible = __commonJS({
    "node_modules/focus-visible/dist/focus-visible.js"(exports, module) {
      (function(global, factory) {
        typeof exports === "object" && typeof module !== "undefined" ? factory() : typeof define === "function" && define.amd ? define(factory) : factory();
      })(exports, (function() {
        "use strict";
        function applyFocusVisiblePolyfill(scope) {
          var hadKeyboardEvent = true;
          var hadFocusVisibleRecently = false;
          var hadFocusVisibleRecentlyTimeout = null;
          var inputTypesAllowlist = {
            text: true,
            search: true,
            url: true,
            tel: true,
            email: true,
            password: true,
            number: true,
            date: true,
            month: true,
            week: true,
            time: true,
            datetime: true,
            "datetime-local": true
          };
          function isValidFocusTarget(el) {
            if (el && el !== document && el.nodeName !== "HTML" && el.nodeName !== "BODY" && "classList" in el && "contains" in el.classList) {
              return true;
            }
            return false;
          }
          function focusTriggersKeyboardModality(el) {
            var type = el.type;
            var tagName = el.tagName;
            if (tagName === "INPUT" && inputTypesAllowlist[type] && !el.readOnly) {
              return true;
            }
            if (tagName === "TEXTAREA" && !el.readOnly) {
              return true;
            }
            if (el.isContentEditable) {
              return true;
            }
            return false;
          }
          function addFocusVisibleClass(el) {
            if (el.classList.contains("focus-visible")) {
              return;
            }
            el.classList.add("focus-visible");
            el.setAttribute("data-focus-visible-added", "");
          }
          function removeFocusVisibleClass(el) {
            if (!el.hasAttribute("data-focus-visible-added")) {
              return;
            }
            el.classList.remove("focus-visible");
            el.removeAttribute("data-focus-visible-added");
          }
          function onKeyDown(e) {
            if (e.metaKey || e.altKey || e.ctrlKey) {
              return;
            }
            if (isValidFocusTarget(scope.activeElement)) {
              addFocusVisibleClass(scope.activeElement);
            }
            hadKeyboardEvent = true;
          }
          function onPointerDown(e) {
            hadKeyboardEvent = false;
          }
          function onFocus(e) {
            if (!isValidFocusTarget(e.target)) {
              return;
            }
            if (hadKeyboardEvent || focusTriggersKeyboardModality(e.target)) {
              addFocusVisibleClass(e.target);
            }
          }
          function onBlur(e) {
            if (!isValidFocusTarget(e.target)) {
              return;
            }
            if (e.target.classList.contains("focus-visible") || e.target.hasAttribute("data-focus-visible-added")) {
              hadFocusVisibleRecently = true;
              window.clearTimeout(hadFocusVisibleRecentlyTimeout);
              hadFocusVisibleRecentlyTimeout = window.setTimeout(function() {
                hadFocusVisibleRecently = false;
              }, 100);
              removeFocusVisibleClass(e.target);
            }
          }
          function onVisibilityChange(e) {
            if (document.visibilityState === "hidden") {
              if (hadFocusVisibleRecently) {
                hadKeyboardEvent = true;
              }
              addInitialPointerMoveListeners();
            }
          }
          function addInitialPointerMoveListeners() {
            document.addEventListener("mousemove", onInitialPointerMove);
            document.addEventListener("mousedown", onInitialPointerMove);
            document.addEventListener("mouseup", onInitialPointerMove);
            document.addEventListener("pointermove", onInitialPointerMove);
            document.addEventListener("pointerdown", onInitialPointerMove);
            document.addEventListener("pointerup", onInitialPointerMove);
            document.addEventListener("touchmove", onInitialPointerMove);
            document.addEventListener("touchstart", onInitialPointerMove);
            document.addEventListener("touchend", onInitialPointerMove);
          }
          function removeInitialPointerMoveListeners() {
            document.removeEventListener("mousemove", onInitialPointerMove);
            document.removeEventListener("mousedown", onInitialPointerMove);
            document.removeEventListener("mouseup", onInitialPointerMove);
            document.removeEventListener("pointermove", onInitialPointerMove);
            document.removeEventListener("pointerdown", onInitialPointerMove);
            document.removeEventListener("pointerup", onInitialPointerMove);
            document.removeEventListener("touchmove", onInitialPointerMove);
            document.removeEventListener("touchstart", onInitialPointerMove);
            document.removeEventListener("touchend", onInitialPointerMove);
          }
          function onInitialPointerMove(e) {
            if (e.target.nodeName && e.target.nodeName.toLowerCase() === "html") {
              return;
            }
            hadKeyboardEvent = false;
            removeInitialPointerMoveListeners();
          }
          document.addEventListener("keydown", onKeyDown, true);
          document.addEventListener("mousedown", onPointerDown, true);
          document.addEventListener("pointerdown", onPointerDown, true);
          document.addEventListener("touchstart", onPointerDown, true);
          document.addEventListener("visibilitychange", onVisibilityChange, true);
          addInitialPointerMoveListeners();
          scope.addEventListener("focus", onFocus, true);
          scope.addEventListener("blur", onBlur, true);
          if (scope.nodeType === Node.DOCUMENT_FRAGMENT_NODE && scope.host) {
            scope.host.setAttribute("data-js-focus-visible", "");
          } else if (scope.nodeType === Node.DOCUMENT_NODE) {
            document.documentElement.classList.add("js-focus-visible");
            document.documentElement.setAttribute("data-js-focus-visible", "");
          }
        }
        if (typeof window !== "undefined" && typeof document !== "undefined") {
          window.applyFocusVisiblePolyfill = applyFocusVisiblePolyfill;
          var event;
          try {
            event = new CustomEvent("focus-visible-polyfill-ready");
          } catch (error) {
            event = document.createEvent("CustomEvent");
            event.initCustomEvent("focus-visible-polyfill-ready", false, false, {});
          }
          window.dispatchEvent(event);
        }
        if (typeof document !== "undefined") {
          applyFocusVisiblePolyfill(document);
        }
      }));
    }
  });

  // node_modules/escape-html/index.js
  var require_escape_html = __commonJS({
    "node_modules/escape-html/index.js"(exports, module) {
      "use strict";
      /*!
       * escape-html
       * Copyright(c) 2012-2013 TJ Holowaychuk
       * Copyright(c) 2015 Andreas Lubbe
       * Copyright(c) 2015 Tiancheng "Timothy" Gu
       * MIT Licensed
       */
      var matchHtmlRegExp = /["'&<>]/;
      module.exports = escapeHtml;
      function escapeHtml(string) {
        var str = "" + string;
        var match = matchHtmlRegExp.exec(str);
        if (!match) {
          return str;
        }
        var escape;
        var html = "";
        var index = 0;
        var lastIndex = 0;
        for (index = match.index; index < str.length; index++) {
          switch (str.charCodeAt(index)) {
            case 34:
              escape = "&quot;";
              break;
            case 38:
              escape = "&amp;";
              break;
            case 39:
              escape = "&#39;";
              break;
            case 60:
              escape = "&lt;";
              break;
            case 62:
              escape = "&gt;";
              break;
            default:
              continue;
          }
          if (lastIndex !== index) {
            html += str.substring(lastIndex, index);
          }
          lastIndex = index + 1;
          html += escape;
        }
        return lastIndex !== index ? html + str.substring(lastIndex, index) : html;
      }
    }
  });

  // node_modules/clipboard/dist/clipboard.js
  var require_clipboard = __commonJS({
    "node_modules/clipboard/dist/clipboard.js"(exports, module) {
      /*!
       * clipboard.js v2.0.11
       * https://clipboardjs.com/
       *
       * Licensed MIT © Zeno Rocha
       */
      (function webpackUniversalModuleDefinition(root, factory) {
        if (typeof exports === "object" && typeof module === "object")
          module.exports = factory();
        else if (typeof define === "function" && define.amd)
          define([], factory);
        else if (typeof exports === "object")
          exports["ClipboardJS"] = factory();
        else
          root["ClipboardJS"] = factory();
      })(exports, function() {
        return (
          /******/
          (function() {
            var __webpack_modules__ = {
              /***/
              686: (
                /***/
                (function(__unused_webpack_module, __webpack_exports__, __webpack_require__2) {
                  "use strict";
                  __webpack_require__2.d(__webpack_exports__, {
                    "default": function() {
                      return (
                        /* binding */
                        clipboard
                      );
                    }
                  });
                  var tiny_emitter = __webpack_require__2(279);
                  var tiny_emitter_default = /* @__PURE__ */ __webpack_require__2.n(tiny_emitter);
                  var listen = __webpack_require__2(370);
                  var listen_default = /* @__PURE__ */ __webpack_require__2.n(listen);
                  var src_select = __webpack_require__2(817);
                  var select_default = /* @__PURE__ */ __webpack_require__2.n(src_select);
                  ;
                  function command(type) {
                    try {
                      return document.execCommand(type);
                    } catch (err) {
                      return false;
                    }
                  }
                  ;
                  var ClipboardActionCut = function ClipboardActionCut2(target) {
                    var selectedText = select_default()(target);
                    command("cut");
                    return selectedText;
                  };
                  var actions_cut = ClipboardActionCut;
                  ;
                  function createFakeElement(value) {
                    var isRTL = document.documentElement.getAttribute("dir") === "rtl";
                    var fakeElement = document.createElement("textarea");
                    fakeElement.style.fontSize = "12pt";
                    fakeElement.style.border = "0";
                    fakeElement.style.padding = "0";
                    fakeElement.style.margin = "0";
                    fakeElement.style.position = "absolute";
                    fakeElement.style[isRTL ? "right" : "left"] = "-9999px";
                    var yPosition = window.pageYOffset || document.documentElement.scrollTop;
                    fakeElement.style.top = "".concat(yPosition, "px");
                    fakeElement.setAttribute("readonly", "");
                    fakeElement.value = value;
                    return fakeElement;
                  }
                  ;
                  var fakeCopyAction = function fakeCopyAction2(value, options) {
                    var fakeElement = createFakeElement(value);
                    options.container.appendChild(fakeElement);
                    var selectedText = select_default()(fakeElement);
                    command("copy");
                    fakeElement.remove();
                    return selectedText;
                  };
                  var ClipboardActionCopy = function ClipboardActionCopy2(target) {
                    var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {
                      container: document.body
                    };
                    var selectedText = "";
                    if (typeof target === "string") {
                      selectedText = fakeCopyAction(target, options);
                    } else if (target instanceof HTMLInputElement && !["text", "search", "url", "tel", "password"].includes(target === null || target === void 0 ? void 0 : target.type)) {
                      selectedText = fakeCopyAction(target.value, options);
                    } else {
                      selectedText = select_default()(target);
                      command("copy");
                    }
                    return selectedText;
                  };
                  var actions_copy = ClipboardActionCopy;
                  ;
                  function _typeof(obj) {
                    "@babel/helpers - typeof";
                    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
                      _typeof = function _typeof2(obj2) {
                        return typeof obj2;
                      };
                    } else {
                      _typeof = function _typeof2(obj2) {
                        return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
                      };
                    }
                    return _typeof(obj);
                  }
                  var ClipboardActionDefault = function ClipboardActionDefault2() {
                    var options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
                    var _options$action = options.action, action = _options$action === void 0 ? "copy" : _options$action, container = options.container, target = options.target, text = options.text;
                    if (action !== "copy" && action !== "cut") {
                      throw new Error('Invalid "action" value, use either "copy" or "cut"');
                    }
                    if (target !== void 0) {
                      if (target && _typeof(target) === "object" && target.nodeType === 1) {
                        if (action === "copy" && target.hasAttribute("disabled")) {
                          throw new Error('Invalid "target" attribute. Please use "readonly" instead of "disabled" attribute');
                        }
                        if (action === "cut" && (target.hasAttribute("readonly") || target.hasAttribute("disabled"))) {
                          throw new Error(`Invalid "target" attribute. You can't cut text from elements with "readonly" or "disabled" attributes`);
                        }
                      } else {
                        throw new Error('Invalid "target" value, use a valid Element');
                      }
                    }
                    if (text) {
                      return actions_copy(text, {
                        container
                      });
                    }
                    if (target) {
                      return action === "cut" ? actions_cut(target) : actions_copy(target, {
                        container
                      });
                    }
                  };
                  var actions_default = ClipboardActionDefault;
                  ;
                  function clipboard_typeof(obj) {
                    "@babel/helpers - typeof";
                    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
                      clipboard_typeof = function _typeof2(obj2) {
                        return typeof obj2;
                      };
                    } else {
                      clipboard_typeof = function _typeof2(obj2) {
                        return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
                      };
                    }
                    return clipboard_typeof(obj);
                  }
                  function _classCallCheck(instance, Constructor) {
                    if (!(instance instanceof Constructor)) {
                      throw new TypeError("Cannot call a class as a function");
                    }
                  }
                  function _defineProperties(target, props) {
                    for (var i = 0; i < props.length; i++) {
                      var descriptor = props[i];
                      descriptor.enumerable = descriptor.enumerable || false;
                      descriptor.configurable = true;
                      if ("value" in descriptor) descriptor.writable = true;
                      Object.defineProperty(target, descriptor.key, descriptor);
                    }
                  }
                  function _createClass(Constructor, protoProps, staticProps) {
                    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
                    if (staticProps) _defineProperties(Constructor, staticProps);
                    return Constructor;
                  }
                  function _inherits(subClass, superClass) {
                    if (typeof superClass !== "function" && superClass !== null) {
                      throw new TypeError("Super expression must either be null or a function");
                    }
                    subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });
                    if (superClass) _setPrototypeOf(subClass, superClass);
                  }
                  function _setPrototypeOf(o, p) {
                    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf2(o2, p2) {
                      o2.__proto__ = p2;
                      return o2;
                    };
                    return _setPrototypeOf(o, p);
                  }
                  function _createSuper(Derived) {
                    var hasNativeReflectConstruct = _isNativeReflectConstruct();
                    return function _createSuperInternal() {
                      var Super = _getPrototypeOf(Derived), result;
                      if (hasNativeReflectConstruct) {
                        var NewTarget = _getPrototypeOf(this).constructor;
                        result = Reflect.construct(Super, arguments, NewTarget);
                      } else {
                        result = Super.apply(this, arguments);
                      }
                      return _possibleConstructorReturn(this, result);
                    };
                  }
                  function _possibleConstructorReturn(self, call) {
                    if (call && (clipboard_typeof(call) === "object" || typeof call === "function")) {
                      return call;
                    }
                    return _assertThisInitialized(self);
                  }
                  function _assertThisInitialized(self) {
                    if (self === void 0) {
                      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                    }
                    return self;
                  }
                  function _isNativeReflectConstruct() {
                    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
                    if (Reflect.construct.sham) return false;
                    if (typeof Proxy === "function") return true;
                    try {
                      Date.prototype.toString.call(Reflect.construct(Date, [], function() {
                      }));
                      return true;
                    } catch (e) {
                      return false;
                    }
                  }
                  function _getPrototypeOf(o) {
                    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf2(o2) {
                      return o2.__proto__ || Object.getPrototypeOf(o2);
                    };
                    return _getPrototypeOf(o);
                  }
                  function getAttributeValue(suffix, element) {
                    var attribute = "data-clipboard-".concat(suffix);
                    if (!element.hasAttribute(attribute)) {
                      return;
                    }
                    return element.getAttribute(attribute);
                  }
                  var Clipboard = /* @__PURE__ */ (function(_Emitter) {
                    _inherits(Clipboard2, _Emitter);
                    var _super = _createSuper(Clipboard2);
                    function Clipboard2(trigger, options) {
                      var _this;
                      _classCallCheck(this, Clipboard2);
                      _this = _super.call(this);
                      _this.resolveOptions(options);
                      _this.listenClick(trigger);
                      return _this;
                    }
                    _createClass(Clipboard2, [{
                      key: "resolveOptions",
                      value: function resolveOptions() {
                        var options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
                        this.action = typeof options.action === "function" ? options.action : this.defaultAction;
                        this.target = typeof options.target === "function" ? options.target : this.defaultTarget;
                        this.text = typeof options.text === "function" ? options.text : this.defaultText;
                        this.container = clipboard_typeof(options.container) === "object" ? options.container : document.body;
                      }
                      /**
                       * Adds a click event listener to the passed trigger.
                       * @param {String|HTMLElement|HTMLCollection|NodeList} trigger
                       */
                    }, {
                      key: "listenClick",
                      value: function listenClick(trigger) {
                        var _this2 = this;
                        this.listener = listen_default()(trigger, "click", function(e) {
                          return _this2.onClick(e);
                        });
                      }
                      /**
                       * Defines a new `ClipboardAction` on each click event.
                       * @param {Event} e
                       */
                    }, {
                      key: "onClick",
                      value: function onClick(e) {
                        var trigger = e.delegateTarget || e.currentTarget;
                        var action = this.action(trigger) || "copy";
                        var text = actions_default({
                          action,
                          container: this.container,
                          target: this.target(trigger),
                          text: this.text(trigger)
                        });
                        this.emit(text ? "success" : "error", {
                          action,
                          text,
                          trigger,
                          clearSelection: function clearSelection() {
                            if (trigger) {
                              trigger.focus();
                            }
                            window.getSelection().removeAllRanges();
                          }
                        });
                      }
                      /**
                       * Default `action` lookup function.
                       * @param {Element} trigger
                       */
                    }, {
                      key: "defaultAction",
                      value: function defaultAction(trigger) {
                        return getAttributeValue("action", trigger);
                      }
                      /**
                       * Default `target` lookup function.
                       * @param {Element} trigger
                       */
                    }, {
                      key: "defaultTarget",
                      value: function defaultTarget(trigger) {
                        var selector = getAttributeValue("target", trigger);
                        if (selector) {
                          return document.querySelector(selector);
                        }
                      }
                      /**
                       * Allow fire programmatically a copy action
                       * @param {String|HTMLElement} target
                       * @param {Object} options
                       * @returns Text copied.
                       */
                    }, {
                      key: "defaultText",
                      /**
                       * Default `text` lookup function.
                       * @param {Element} trigger
                       */
                      value: function defaultText(trigger) {
                        return getAttributeValue("text", trigger);
                      }
                      /**
                       * Destroy lifecycle.
                       */
                    }, {
                      key: "destroy",
                      value: function destroy() {
                        this.listener.destroy();
                      }
                    }], [{
                      key: "copy",
                      value: function copy(target) {
                        var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {
                          container: document.body
                        };
                        return actions_copy(target, options);
                      }
                      /**
                       * Allow fire programmatically a cut action
                       * @param {String|HTMLElement} target
                       * @returns Text cutted.
                       */
                    }, {
                      key: "cut",
                      value: function cut(target) {
                        return actions_cut(target);
                      }
                      /**
                       * Returns the support of the given action, or all actions if no action is
                       * given.
                       * @param {String} [action]
                       */
                    }, {
                      key: "isSupported",
                      value: function isSupported() {
                        var action = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : ["copy", "cut"];
                        var actions = typeof action === "string" ? [action] : action;
                        var support = !!document.queryCommandSupported;
                        actions.forEach(function(action2) {
                          support = support && !!document.queryCommandSupported(action2);
                        });
                        return support;
                      }
                    }]);
                    return Clipboard2;
                  })(tiny_emitter_default());
                  var clipboard = Clipboard;
                })
              ),
              /***/
              828: (
                /***/
                (function(module2) {
                  var DOCUMENT_NODE_TYPE = 9;
                  if (typeof Element !== "undefined" && !Element.prototype.matches) {
                    var proto = Element.prototype;
                    proto.matches = proto.matchesSelector || proto.mozMatchesSelector || proto.msMatchesSelector || proto.oMatchesSelector || proto.webkitMatchesSelector;
                  }
                  function closest(element, selector) {
                    while (element && element.nodeType !== DOCUMENT_NODE_TYPE) {
                      if (typeof element.matches === "function" && element.matches(selector)) {
                        return element;
                      }
                      element = element.parentNode;
                    }
                  }
                  module2.exports = closest;
                })
              ),
              /***/
              438: (
                /***/
                (function(module2, __unused_webpack_exports, __webpack_require__2) {
                  var closest = __webpack_require__2(828);
                  function _delegate(element, selector, type, callback, useCapture) {
                    var listenerFn = listener.apply(this, arguments);
                    element.addEventListener(type, listenerFn, useCapture);
                    return {
                      destroy: function() {
                        element.removeEventListener(type, listenerFn, useCapture);
                      }
                    };
                  }
                  function delegate(elements, selector, type, callback, useCapture) {
                    if (typeof elements.addEventListener === "function") {
                      return _delegate.apply(null, arguments);
                    }
                    if (typeof type === "function") {
                      return _delegate.bind(null, document).apply(null, arguments);
                    }
                    if (typeof elements === "string") {
                      elements = document.querySelectorAll(elements);
                    }
                    return Array.prototype.map.call(elements, function(element) {
                      return _delegate(element, selector, type, callback, useCapture);
                    });
                  }
                  function listener(element, selector, type, callback) {
                    return function(e) {
                      e.delegateTarget = closest(e.target, selector);
                      if (e.delegateTarget) {
                        callback.call(element, e);
                      }
                    };
                  }
                  module2.exports = delegate;
                })
              ),
              /***/
              879: (
                /***/
                (function(__unused_webpack_module, exports2) {
                  exports2.node = function(value) {
                    return value !== void 0 && value instanceof HTMLElement && value.nodeType === 1;
                  };
                  exports2.nodeList = function(value) {
                    var type = Object.prototype.toString.call(value);
                    return value !== void 0 && (type === "[object NodeList]" || type === "[object HTMLCollection]") && "length" in value && (value.length === 0 || exports2.node(value[0]));
                  };
                  exports2.string = function(value) {
                    return typeof value === "string" || value instanceof String;
                  };
                  exports2.fn = function(value) {
                    var type = Object.prototype.toString.call(value);
                    return type === "[object Function]";
                  };
                })
              ),
              /***/
              370: (
                /***/
                (function(module2, __unused_webpack_exports, __webpack_require__2) {
                  var is = __webpack_require__2(879);
                  var delegate = __webpack_require__2(438);
                  function listen(target, type, callback) {
                    if (!target && !type && !callback) {
                      throw new Error("Missing required arguments");
                    }
                    if (!is.string(type)) {
                      throw new TypeError("Second argument must be a String");
                    }
                    if (!is.fn(callback)) {
                      throw new TypeError("Third argument must be a Function");
                    }
                    if (is.node(target)) {
                      return listenNode(target, type, callback);
                    } else if (is.nodeList(target)) {
                      return listenNodeList(target, type, callback);
                    } else if (is.string(target)) {
                      return listenSelector(target, type, callback);
                    } else {
                      throw new TypeError("First argument must be a String, HTMLElement, HTMLCollection, or NodeList");
                    }
                  }
                  function listenNode(node, type, callback) {
                    node.addEventListener(type, callback);
                    return {
                      destroy: function() {
                        node.removeEventListener(type, callback);
                      }
                    };
                  }
                  function listenNodeList(nodeList, type, callback) {
                    Array.prototype.forEach.call(nodeList, function(node) {
                      node.addEventListener(type, callback);
                    });
                    return {
                      destroy: function() {
                        Array.prototype.forEach.call(nodeList, function(node) {
                          node.removeEventListener(type, callback);
                        });
                      }
                    };
                  }
                  function listenSelector(selector, type, callback) {
                    return delegate(document.body, selector, type, callback);
                  }
                  module2.exports = listen;
                })
              ),
              /***/
              817: (
                /***/
                (function(module2) {
                  function select(element) {
                    var selectedText;
                    if (element.nodeName === "SELECT") {
                      element.focus();
                      selectedText = element.value;
                    } else if (element.nodeName === "INPUT" || element.nodeName === "TEXTAREA") {
                      var isReadOnly = element.hasAttribute("readonly");
                      if (!isReadOnly) {
                        element.setAttribute("readonly", "");
                      }
                      element.select();
                      element.setSelectionRange(0, element.value.length);
                      if (!isReadOnly) {
                        element.removeAttribute("readonly");
                      }
                      selectedText = element.value;
                    } else {
                      if (element.hasAttribute("contenteditable")) {
                        element.focus();
                      }
                      var selection = window.getSelection();
                      var range = document.createRange();
                      range.selectNodeContents(element);
                      selection.removeAllRanges();
                      selection.addRange(range);
                      selectedText = selection.toString();
                    }
                    return selectedText;
                  }
                  module2.exports = select;
                })
              ),
              /***/
              279: (
                /***/
                (function(module2) {
                  function E() {
                  }
                  E.prototype = {
                    on: function(name, callback, ctx) {
                      var e = this.e || (this.e = {});
                      (e[name] || (e[name] = [])).push({
                        fn: callback,
                        ctx
                      });
                      return this;
                    },
                    once: function(name, callback, ctx) {
                      var self = this;
                      function listener() {
                        self.off(name, listener);
                        callback.apply(ctx, arguments);
                      }
                      ;
                      listener._ = callback;
                      return this.on(name, listener, ctx);
                    },
                    emit: function(name) {
                      var data = [].slice.call(arguments, 1);
                      var evtArr = ((this.e || (this.e = {}))[name] || []).slice();
                      var i = 0;
                      var len = evtArr.length;
                      for (i; i < len; i++) {
                        evtArr[i].fn.apply(evtArr[i].ctx, data);
                      }
                      return this;
                    },
                    off: function(name, callback) {
                      var e = this.e || (this.e = {});
                      var evts = e[name];
                      var liveEvents = [];
                      if (evts && callback) {
                        for (var i = 0, len = evts.length; i < len; i++) {
                          if (evts[i].fn !== callback && evts[i].fn._ !== callback)
                            liveEvents.push(evts[i]);
                        }
                      }
                      liveEvents.length ? e[name] = liveEvents : delete e[name];
                      return this;
                    }
                  };
                  module2.exports = E;
                  module2.exports.TinyEmitter = E;
                })
              )
              /******/
            };
            var __webpack_module_cache__ = {};
            function __webpack_require__(moduleId) {
              if (__webpack_module_cache__[moduleId]) {
                return __webpack_module_cache__[moduleId].exports;
              }
              var module2 = __webpack_module_cache__[moduleId] = {
                /******/
                // no module.id needed
                /******/
                // no module.loaded needed
                /******/
                exports: {}
                /******/
              };
              __webpack_modules__[moduleId](module2, module2.exports, __webpack_require__);
              return module2.exports;
            }
            !(function() {
              __webpack_require__.n = function(module2) {
                var getter = module2 && module2.__esModule ? (
                  /******/
                  function() {
                    return module2["default"];
                  }
                ) : (
                  /******/
                  function() {
                    return module2;
                  }
                );
                __webpack_require__.d(getter, { a: getter });
                return getter;
              };
            })();
            !(function() {
              __webpack_require__.d = function(exports2, definition) {
                for (var key in definition) {
                  if (__webpack_require__.o(definition, key) && !__webpack_require__.o(exports2, key)) {
                    Object.defineProperty(exports2, key, { enumerable: true, get: definition[key] });
                  }
                }
              };
            })();
            !(function() {
              __webpack_require__.o = function(obj, prop) {
                return Object.prototype.hasOwnProperty.call(obj, prop);
              };
            })();
            return __webpack_require__(686);
          })().default
        );
      });
    }
  });

  // src/templates/assets/javascripts/bundle.ts
  var import_focus_visible = __toESM(require_focus_visible());

  // node_modules/tslib/tslib.es6.mjs
  var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
      d2.__proto__ = b2;
    } || function(d2, b2) {
      for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
    };
    return extendStatics(d, b);
  };
  function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
      throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  }
  function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve4) {
        resolve4(value);
      });
    }
    return new (P || (P = Promise))(function(resolve4, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve4(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  }
  function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() {
      if (t[0] & 1) throw t[1];
      return t[1];
    }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() {
      return this;
    }), g;
    function verb(n) {
      return function(v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while (g && (g = 0, op[0] && (_ = 0)), _) try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];
        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;
          case 4:
            _.label++;
            return { value: op[1], done: false };
          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;
          case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;
          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }
            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            if (t[2]) _.ops.pop();
            _.trys.pop();
            continue;
        }
        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  }
  function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
      next: function() {
        if (o && i >= o.length) o = void 0;
        return { value: o && o[i++], done: !o };
      }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
  }
  function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    } catch (error) {
      e = { error };
    } finally {
      try {
        if (r && !r.done && (m = i["return"])) m.call(i);
      } finally {
        if (e) throw e.error;
      }
    }
    return ar;
  }
  function __spreadArray(to, from2, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from2.length, ar; i < l; i++) {
      if (ar || !(i in from2)) {
        if (!ar) ar = Array.prototype.slice.call(from2, 0, i);
        ar[i] = from2[i];
      }
    }
    return to.concat(ar || Array.prototype.slice.call(from2));
  }
  function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
  }
  function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = Object.create((typeof AsyncIterator === "function" ? AsyncIterator : Object).prototype), verb("next"), verb("throw"), verb("return", awaitReturn), i[Symbol.asyncIterator] = function() {
      return this;
    }, i;
    function awaitReturn(f) {
      return function(v) {
        return Promise.resolve(v).then(f, reject);
      };
    }
    function verb(n, f) {
      if (g[n]) {
        i[n] = function(v) {
          return new Promise(function(a, b) {
            q.push([n, v, a, b]) > 1 || resume(n, v);
          });
        };
        if (f) i[n] = f(i[n]);
      }
    }
    function resume(n, v) {
      try {
        step(g[n](v));
      } catch (e) {
        settle(q[0][3], e);
      }
    }
    function step(r) {
      r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);
    }
    function fulfill(value) {
      resume("next", value);
    }
    function reject(value) {
      resume("throw", value);
    }
    function settle(f, v) {
      if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]);
    }
  }
  function __asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
      return this;
    }, i);
    function verb(n) {
      i[n] = o[n] && function(v) {
        return new Promise(function(resolve4, reject) {
          v = o[n](v), settle(resolve4, reject, v.done, v.value);
        });
      };
    }
    function settle(resolve4, reject, d, v) {
      Promise.resolve(v).then(function(v2) {
        resolve4({ value: v2, done: d });
      }, reject);
    }
  }

  // node_modules/rxjs/dist/esm5/internal/util/isFunction.js
  function isFunction(value) {
    return typeof value === "function";
  }

  // node_modules/rxjs/dist/esm5/internal/util/createErrorClass.js
  function createErrorClass(createImpl) {
    var _super = function(instance) {
      Error.call(instance);
      instance.stack = new Error().stack;
    };
    var ctorFunc = createImpl(_super);
    ctorFunc.prototype = Object.create(Error.prototype);
    ctorFunc.prototype.constructor = ctorFunc;
    return ctorFunc;
  }

  // node_modules/rxjs/dist/esm5/internal/util/UnsubscriptionError.js
  var UnsubscriptionError = createErrorClass(function(_super) {
    return function UnsubscriptionErrorImpl(errors) {
      _super(this);
      this.message = errors ? errors.length + " errors occurred during unsubscription:\n" + errors.map(function(err, i) {
        return i + 1 + ") " + err.toString();
      }).join("\n  ") : "";
      this.name = "UnsubscriptionError";
      this.errors = errors;
    };
  });

  // node_modules/rxjs/dist/esm5/internal/util/arrRemove.js
  function arrRemove(arr, item) {
    if (arr) {
      var index = arr.indexOf(item);
      0 <= index && arr.splice(index, 1);
    }
  }

  // node_modules/rxjs/dist/esm5/internal/Subscription.js
  var Subscription = (function() {
    function Subscription2(initialTeardown) {
      this.initialTeardown = initialTeardown;
      this.closed = false;
      this._parentage = null;
      this._finalizers = null;
    }
    Subscription2.prototype.unsubscribe = function() {
      var e_1, _a2, e_2, _b;
      var errors;
      if (!this.closed) {
        this.closed = true;
        var _parentage = this._parentage;
        if (_parentage) {
          this._parentage = null;
          if (Array.isArray(_parentage)) {
            try {
              for (var _parentage_1 = __values(_parentage), _parentage_1_1 = _parentage_1.next(); !_parentage_1_1.done; _parentage_1_1 = _parentage_1.next()) {
                var parent_1 = _parentage_1_1.value;
                parent_1.remove(this);
              }
            } catch (e_1_1) {
              e_1 = { error: e_1_1 };
            } finally {
              try {
                if (_parentage_1_1 && !_parentage_1_1.done && (_a2 = _parentage_1.return)) _a2.call(_parentage_1);
              } finally {
                if (e_1) throw e_1.error;
              }
            }
          } else {
            _parentage.remove(this);
          }
        }
        var initialFinalizer = this.initialTeardown;
        if (isFunction(initialFinalizer)) {
          try {
            initialFinalizer();
          } catch (e) {
            errors = e instanceof UnsubscriptionError ? e.errors : [e];
          }
        }
        var _finalizers = this._finalizers;
        if (_finalizers) {
          this._finalizers = null;
          try {
            for (var _finalizers_1 = __values(_finalizers), _finalizers_1_1 = _finalizers_1.next(); !_finalizers_1_1.done; _finalizers_1_1 = _finalizers_1.next()) {
              var finalizer = _finalizers_1_1.value;
              try {
                execFinalizer(finalizer);
              } catch (err) {
                errors = errors !== null && errors !== void 0 ? errors : [];
                if (err instanceof UnsubscriptionError) {
                  errors = __spreadArray(__spreadArray([], __read(errors)), __read(err.errors));
                } else {
                  errors.push(err);
                }
              }
            }
          } catch (e_2_1) {
            e_2 = { error: e_2_1 };
          } finally {
            try {
              if (_finalizers_1_1 && !_finalizers_1_1.done && (_b = _finalizers_1.return)) _b.call(_finalizers_1);
            } finally {
              if (e_2) throw e_2.error;
            }
          }
        }
        if (errors) {
          throw new UnsubscriptionError(errors);
        }
      }
    };
    Subscription2.prototype.add = function(teardown) {
      var _a2;
      if (teardown && teardown !== this) {
        if (this.closed) {
          execFinalizer(teardown);
        } else {
          if (teardown instanceof Subscription2) {
            if (teardown.closed || teardown._hasParent(this)) {
              return;
            }
            teardown._addParent(this);
          }
          (this._finalizers = (_a2 = this._finalizers) !== null && _a2 !== void 0 ? _a2 : []).push(teardown);
        }
      }
    };
    Subscription2.prototype._hasParent = function(parent) {
      var _parentage = this._parentage;
      return _parentage === parent || Array.isArray(_parentage) && _parentage.includes(parent);
    };
    Subscription2.prototype._addParent = function(parent) {
      var _parentage = this._parentage;
      this._parentage = Array.isArray(_parentage) ? (_parentage.push(parent), _parentage) : _parentage ? [_parentage, parent] : parent;
    };
    Subscription2.prototype._removeParent = function(parent) {
      var _parentage = this._parentage;
      if (_parentage === parent) {
        this._parentage = null;
      } else if (Array.isArray(_parentage)) {
        arrRemove(_parentage, parent);
      }
    };
    Subscription2.prototype.remove = function(teardown) {
      var _finalizers = this._finalizers;
      _finalizers && arrRemove(_finalizers, teardown);
      if (teardown instanceof Subscription2) {
        teardown._removeParent(this);
      }
    };
    Subscription2.EMPTY = (function() {
      var empty = new Subscription2();
      empty.closed = true;
      return empty;
    })();
    return Subscription2;
  })();
  var EMPTY_SUBSCRIPTION = Subscription.EMPTY;
  function isSubscription(value) {
    return value instanceof Subscription || value && "closed" in value && isFunction(value.remove) && isFunction(value.add) && isFunction(value.unsubscribe);
  }
  function execFinalizer(finalizer) {
    if (isFunction(finalizer)) {
      finalizer();
    } else {
      finalizer.unsubscribe();
    }
  }

  // node_modules/rxjs/dist/esm5/internal/config.js
  var config = {
    onUnhandledError: null,
    onStoppedNotification: null,
    Promise: void 0,
    useDeprecatedSynchronousErrorHandling: false,
    useDeprecatedNextContext: false
  };

  // node_modules/rxjs/dist/esm5/internal/scheduler/timeoutProvider.js
  var timeoutProvider = {
    setTimeout: function(handler, timeout) {
      var args = [];
      for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
      }
      var delegate = timeoutProvider.delegate;
      if (delegate === null || delegate === void 0 ? void 0 : delegate.setTimeout) {
        return delegate.setTimeout.apply(delegate, __spreadArray([handler, timeout], __read(args)));
      }
      return setTimeout.apply(void 0, __spreadArray([handler, timeout], __read(args)));
    },
    clearTimeout: function(handle2) {
      var delegate = timeoutProvider.delegate;
      return ((delegate === null || delegate === void 0 ? void 0 : delegate.clearTimeout) || clearTimeout)(handle2);
    },
    delegate: void 0
  };

  // node_modules/rxjs/dist/esm5/internal/util/reportUnhandledError.js
  function reportUnhandledError(err) {
    timeoutProvider.setTimeout(function() {
      var onUnhandledError = config.onUnhandledError;
      if (onUnhandledError) {
        onUnhandledError(err);
      } else {
        throw err;
      }
    });
  }

  // node_modules/rxjs/dist/esm5/internal/util/noop.js
  function noop() {
  }

  // node_modules/rxjs/dist/esm5/internal/NotificationFactories.js
  var COMPLETE_NOTIFICATION = (function() {
    return createNotification("C", void 0, void 0);
  })();
  function errorNotification(error) {
    return createNotification("E", void 0, error);
  }
  function nextNotification(value) {
    return createNotification("N", value, void 0);
  }
  function createNotification(kind, value, error) {
    return {
      kind,
      value,
      error
    };
  }

  // node_modules/rxjs/dist/esm5/internal/util/errorContext.js
  var context = null;
  function errorContext(cb) {
    if (config.useDeprecatedSynchronousErrorHandling) {
      var isRoot = !context;
      if (isRoot) {
        context = { errorThrown: false, error: null };
      }
      cb();
      if (isRoot) {
        var _a2 = context, errorThrown = _a2.errorThrown, error = _a2.error;
        context = null;
        if (errorThrown) {
          throw error;
        }
      }
    } else {
      cb();
    }
  }
  function captureError(err) {
    if (config.useDeprecatedSynchronousErrorHandling && context) {
      context.errorThrown = true;
      context.error = err;
    }
  }

  // node_modules/rxjs/dist/esm5/internal/Subscriber.js
  var Subscriber = (function(_super) {
    __extends(Subscriber2, _super);
    function Subscriber2(destination) {
      var _this = _super.call(this) || this;
      _this.isStopped = false;
      if (destination) {
        _this.destination = destination;
        if (isSubscription(destination)) {
          destination.add(_this);
        }
      } else {
        _this.destination = EMPTY_OBSERVER;
      }
      return _this;
    }
    Subscriber2.create = function(next, error, complete) {
      return new SafeSubscriber(next, error, complete);
    };
    Subscriber2.prototype.next = function(value) {
      if (this.isStopped) {
        handleStoppedNotification(nextNotification(value), this);
      } else {
        this._next(value);
      }
    };
    Subscriber2.prototype.error = function(err) {
      if (this.isStopped) {
        handleStoppedNotification(errorNotification(err), this);
      } else {
        this.isStopped = true;
        this._error(err);
      }
    };
    Subscriber2.prototype.complete = function() {
      if (this.isStopped) {
        handleStoppedNotification(COMPLETE_NOTIFICATION, this);
      } else {
        this.isStopped = true;
        this._complete();
      }
    };
    Subscriber2.prototype.unsubscribe = function() {
      if (!this.closed) {
        this.isStopped = true;
        _super.prototype.unsubscribe.call(this);
        this.destination = null;
      }
    };
    Subscriber2.prototype._next = function(value) {
      this.destination.next(value);
    };
    Subscriber2.prototype._error = function(err) {
      try {
        this.destination.error(err);
      } finally {
        this.unsubscribe();
      }
    };
    Subscriber2.prototype._complete = function() {
      try {
        this.destination.complete();
      } finally {
        this.unsubscribe();
      }
    };
    return Subscriber2;
  })(Subscription);
  var _bind = Function.prototype.bind;
  function bind(fn, thisArg) {
    return _bind.call(fn, thisArg);
  }
  var ConsumerObserver = (function() {
    function ConsumerObserver2(partialObserver) {
      this.partialObserver = partialObserver;
    }
    ConsumerObserver2.prototype.next = function(value) {
      var partialObserver = this.partialObserver;
      if (partialObserver.next) {
        try {
          partialObserver.next(value);
        } catch (error) {
          handleUnhandledError(error);
        }
      }
    };
    ConsumerObserver2.prototype.error = function(err) {
      var partialObserver = this.partialObserver;
      if (partialObserver.error) {
        try {
          partialObserver.error(err);
        } catch (error) {
          handleUnhandledError(error);
        }
      } else {
        handleUnhandledError(err);
      }
    };
    ConsumerObserver2.prototype.complete = function() {
      var partialObserver = this.partialObserver;
      if (partialObserver.complete) {
        try {
          partialObserver.complete();
        } catch (error) {
          handleUnhandledError(error);
        }
      }
    };
    return ConsumerObserver2;
  })();
  var SafeSubscriber = (function(_super) {
    __extends(SafeSubscriber2, _super);
    function SafeSubscriber2(observerOrNext, error, complete) {
      var _this = _super.call(this) || this;
      var partialObserver;
      if (isFunction(observerOrNext) || !observerOrNext) {
        partialObserver = {
          next: observerOrNext !== null && observerOrNext !== void 0 ? observerOrNext : void 0,
          error: error !== null && error !== void 0 ? error : void 0,
          complete: complete !== null && complete !== void 0 ? complete : void 0
        };
      } else {
        var context_1;
        if (_this && config.useDeprecatedNextContext) {
          context_1 = Object.create(observerOrNext);
          context_1.unsubscribe = function() {
            return _this.unsubscribe();
          };
          partialObserver = {
            next: observerOrNext.next && bind(observerOrNext.next, context_1),
            error: observerOrNext.error && bind(observerOrNext.error, context_1),
            complete: observerOrNext.complete && bind(observerOrNext.complete, context_1)
          };
        } else {
          partialObserver = observerOrNext;
        }
      }
      _this.destination = new ConsumerObserver(partialObserver);
      return _this;
    }
    return SafeSubscriber2;
  })(Subscriber);
  function handleUnhandledError(error) {
    if (config.useDeprecatedSynchronousErrorHandling) {
      captureError(error);
    } else {
      reportUnhandledError(error);
    }
  }
  function defaultErrorHandler(err) {
    throw err;
  }
  function handleStoppedNotification(notification, subscriber) {
    var onStoppedNotification = config.onStoppedNotification;
    onStoppedNotification && timeoutProvider.setTimeout(function() {
      return onStoppedNotification(notification, subscriber);
    });
  }
  var EMPTY_OBSERVER = {
    closed: true,
    next: noop,
    error: defaultErrorHandler,
    complete: noop
  };

  // node_modules/rxjs/dist/esm5/internal/symbol/observable.js
  var observable = (function() {
    return typeof Symbol === "function" && Symbol.observable || "@@observable";
  })();

  // node_modules/rxjs/dist/esm5/internal/util/identity.js
  function identity(x) {
    return x;
  }

  // node_modules/rxjs/dist/esm5/internal/util/pipe.js
  function pipe() {
    var fns = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      fns[_i] = arguments[_i];
    }
    return pipeFromArray(fns);
  }
  function pipeFromArray(fns) {
    if (fns.length === 0) {
      return identity;
    }
    if (fns.length === 1) {
      return fns[0];
    }
    return function piped(input) {
      return fns.reduce(function(prev, fn) {
        return fn(prev);
      }, input);
    };
  }

  // node_modules/rxjs/dist/esm5/internal/Observable.js
  var Observable = (function() {
    function Observable56(subscribe) {
      if (subscribe) {
        this._subscribe = subscribe;
      }
    }
    Observable56.prototype.lift = function(operator) {
      var observable2 = new Observable56();
      observable2.source = this;
      observable2.operator = operator;
      return observable2;
    };
    Observable56.prototype.subscribe = function(observerOrNext, error, complete) {
      var _this = this;
      var subscriber = isSubscriber(observerOrNext) ? observerOrNext : new SafeSubscriber(observerOrNext, error, complete);
      errorContext(function() {
        var _a2 = _this, operator = _a2.operator, source = _a2.source;
        subscriber.add(operator ? operator.call(subscriber, source) : source ? _this._subscribe(subscriber) : _this._trySubscribe(subscriber));
      });
      return subscriber;
    };
    Observable56.prototype._trySubscribe = function(sink) {
      try {
        return this._subscribe(sink);
      } catch (err) {
        sink.error(err);
      }
    };
    Observable56.prototype.forEach = function(next, promiseCtor) {
      var _this = this;
      promiseCtor = getPromiseCtor(promiseCtor);
      return new promiseCtor(function(resolve4, reject) {
        var subscriber = new SafeSubscriber({
          next: function(value) {
            try {
              next(value);
            } catch (err) {
              reject(err);
              subscriber.unsubscribe();
            }
          },
          error: reject,
          complete: resolve4
        });
        _this.subscribe(subscriber);
      });
    };
    Observable56.prototype._subscribe = function(subscriber) {
      var _a2;
      return (_a2 = this.source) === null || _a2 === void 0 ? void 0 : _a2.subscribe(subscriber);
    };
    Observable56.prototype[observable] = function() {
      return this;
    };
    Observable56.prototype.pipe = function() {
      var operations = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        operations[_i] = arguments[_i];
      }
      return pipeFromArray(operations)(this);
    };
    Observable56.prototype.toPromise = function(promiseCtor) {
      var _this = this;
      promiseCtor = getPromiseCtor(promiseCtor);
      return new promiseCtor(function(resolve4, reject) {
        var value;
        _this.subscribe(function(x) {
          return value = x;
        }, function(err) {
          return reject(err);
        }, function() {
          return resolve4(value);
        });
      });
    };
    Observable56.create = function(subscribe) {
      return new Observable56(subscribe);
    };
    return Observable56;
  })();
  function getPromiseCtor(promiseCtor) {
    var _a2;
    return (_a2 = promiseCtor !== null && promiseCtor !== void 0 ? promiseCtor : config.Promise) !== null && _a2 !== void 0 ? _a2 : Promise;
  }
  function isObserver(value) {
    return value && isFunction(value.next) && isFunction(value.error) && isFunction(value.complete);
  }
  function isSubscriber(value) {
    return value && value instanceof Subscriber || isObserver(value) && isSubscription(value);
  }

  // node_modules/rxjs/dist/esm5/internal/util/lift.js
  function hasLift(source) {
    return isFunction(source === null || source === void 0 ? void 0 : source.lift);
  }
  function operate(init) {
    return function(source) {
      if (hasLift(source)) {
        return source.lift(function(liftedSource) {
          try {
            return init(liftedSource, this);
          } catch (err) {
            this.error(err);
          }
        });
      }
      throw new TypeError("Unable to lift unknown Observable type");
    };
  }

  // node_modules/rxjs/dist/esm5/internal/operators/OperatorSubscriber.js
  function createOperatorSubscriber(destination, onNext, onComplete, onError, onFinalize) {
    return new OperatorSubscriber(destination, onNext, onComplete, onError, onFinalize);
  }
  var OperatorSubscriber = (function(_super) {
    __extends(OperatorSubscriber2, _super);
    function OperatorSubscriber2(destination, onNext, onComplete, onError, onFinalize, shouldUnsubscribe) {
      var _this = _super.call(this, destination) || this;
      _this.onFinalize = onFinalize;
      _this.shouldUnsubscribe = shouldUnsubscribe;
      _this._next = onNext ? function(value) {
        try {
          onNext(value);
        } catch (err) {
          destination.error(err);
        }
      } : _super.prototype._next;
      _this._error = onError ? function(err) {
        try {
          onError(err);
        } catch (err2) {
          destination.error(err2);
        } finally {
          this.unsubscribe();
        }
      } : _super.prototype._error;
      _this._complete = onComplete ? function() {
        try {
          onComplete();
        } catch (err) {
          destination.error(err);
        } finally {
          this.unsubscribe();
        }
      } : _super.prototype._complete;
      return _this;
    }
    OperatorSubscriber2.prototype.unsubscribe = function() {
      var _a2;
      if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
        var closed_1 = this.closed;
        _super.prototype.unsubscribe.call(this);
        !closed_1 && ((_a2 = this.onFinalize) === null || _a2 === void 0 ? void 0 : _a2.call(this));
      }
    };
    return OperatorSubscriber2;
  })(Subscriber);

  // node_modules/rxjs/dist/esm5/internal/scheduler/animationFrameProvider.js
  var animationFrameProvider = {
    schedule: function(callback) {
      var request2 = requestAnimationFrame;
      var cancel = cancelAnimationFrame;
      var delegate = animationFrameProvider.delegate;
      if (delegate) {
        request2 = delegate.requestAnimationFrame;
        cancel = delegate.cancelAnimationFrame;
      }
      var handle2 = request2(function(timestamp) {
        cancel = void 0;
        callback(timestamp);
      });
      return new Subscription(function() {
        return cancel === null || cancel === void 0 ? void 0 : cancel(handle2);
      });
    },
    requestAnimationFrame: function() {
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }
      var delegate = animationFrameProvider.delegate;
      return ((delegate === null || delegate === void 0 ? void 0 : delegate.requestAnimationFrame) || requestAnimationFrame).apply(void 0, __spreadArray([], __read(args)));
    },
    cancelAnimationFrame: function() {
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }
      var delegate = animationFrameProvider.delegate;
      return ((delegate === null || delegate === void 0 ? void 0 : delegate.cancelAnimationFrame) || cancelAnimationFrame).apply(void 0, __spreadArray([], __read(args)));
    },
    delegate: void 0
  };

  // node_modules/rxjs/dist/esm5/internal/util/ObjectUnsubscribedError.js
  var ObjectUnsubscribedError = createErrorClass(function(_super) {
    return function ObjectUnsubscribedErrorImpl() {
      _super(this);
      this.name = "ObjectUnsubscribedError";
      this.message = "object unsubscribed";
    };
  });

  // node_modules/rxjs/dist/esm5/internal/Subject.js
  var Subject = (function(_super) {
    __extends(Subject8, _super);
    function Subject8() {
      var _this = _super.call(this) || this;
      _this.closed = false;
      _this.currentObservers = null;
      _this.observers = [];
      _this.isStopped = false;
      _this.hasError = false;
      _this.thrownError = null;
      return _this;
    }
    Subject8.prototype.lift = function(operator) {
      var subject = new AnonymousSubject(this, this);
      subject.operator = operator;
      return subject;
    };
    Subject8.prototype._throwIfClosed = function() {
      if (this.closed) {
        throw new ObjectUnsubscribedError();
      }
    };
    Subject8.prototype.next = function(value) {
      var _this = this;
      errorContext(function() {
        var e_1, _a2;
        _this._throwIfClosed();
        if (!_this.isStopped) {
          if (!_this.currentObservers) {
            _this.currentObservers = Array.from(_this.observers);
          }
          try {
            for (var _b = __values(_this.currentObservers), _c = _b.next(); !_c.done; _c = _b.next()) {
              var observer = _c.value;
              observer.next(value);
            }
          } catch (e_1_1) {
            e_1 = { error: e_1_1 };
          } finally {
            try {
              if (_c && !_c.done && (_a2 = _b.return)) _a2.call(_b);
            } finally {
              if (e_1) throw e_1.error;
            }
          }
        }
      });
    };
    Subject8.prototype.error = function(err) {
      var _this = this;
      errorContext(function() {
        _this._throwIfClosed();
        if (!_this.isStopped) {
          _this.hasError = _this.isStopped = true;
          _this.thrownError = err;
          var observers = _this.observers;
          while (observers.length) {
            observers.shift().error(err);
          }
        }
      });
    };
    Subject8.prototype.complete = function() {
      var _this = this;
      errorContext(function() {
        _this._throwIfClosed();
        if (!_this.isStopped) {
          _this.isStopped = true;
          var observers = _this.observers;
          while (observers.length) {
            observers.shift().complete();
          }
        }
      });
    };
    Subject8.prototype.unsubscribe = function() {
      this.isStopped = this.closed = true;
      this.observers = this.currentObservers = null;
    };
    Object.defineProperty(Subject8.prototype, "observed", {
      get: function() {
        var _a2;
        return ((_a2 = this.observers) === null || _a2 === void 0 ? void 0 : _a2.length) > 0;
      },
      enumerable: false,
      configurable: true
    });
    Subject8.prototype._trySubscribe = function(subscriber) {
      this._throwIfClosed();
      return _super.prototype._trySubscribe.call(this, subscriber);
    };
    Subject8.prototype._subscribe = function(subscriber) {
      this._throwIfClosed();
      this._checkFinalizedStatuses(subscriber);
      return this._innerSubscribe(subscriber);
    };
    Subject8.prototype._innerSubscribe = function(subscriber) {
      var _this = this;
      var _a2 = this, hasError = _a2.hasError, isStopped = _a2.isStopped, observers = _a2.observers;
      if (hasError || isStopped) {
        return EMPTY_SUBSCRIPTION;
      }
      this.currentObservers = null;
      observers.push(subscriber);
      return new Subscription(function() {
        _this.currentObservers = null;
        arrRemove(observers, subscriber);
      });
    };
    Subject8.prototype._checkFinalizedStatuses = function(subscriber) {
      var _a2 = this, hasError = _a2.hasError, thrownError = _a2.thrownError, isStopped = _a2.isStopped;
      if (hasError) {
        subscriber.error(thrownError);
      } else if (isStopped) {
        subscriber.complete();
      }
    };
    Subject8.prototype.asObservable = function() {
      var observable2 = new Observable();
      observable2.source = this;
      return observable2;
    };
    Subject8.create = function(destination, source) {
      return new AnonymousSubject(destination, source);
    };
    return Subject8;
  })(Observable);
  var AnonymousSubject = (function(_super) {
    __extends(AnonymousSubject2, _super);
    function AnonymousSubject2(destination, source) {
      var _this = _super.call(this) || this;
      _this.destination = destination;
      _this.source = source;
      return _this;
    }
    AnonymousSubject2.prototype.next = function(value) {
      var _a2, _b;
      (_b = (_a2 = this.destination) === null || _a2 === void 0 ? void 0 : _a2.next) === null || _b === void 0 ? void 0 : _b.call(_a2, value);
    };
    AnonymousSubject2.prototype.error = function(err) {
      var _a2, _b;
      (_b = (_a2 = this.destination) === null || _a2 === void 0 ? void 0 : _a2.error) === null || _b === void 0 ? void 0 : _b.call(_a2, err);
    };
    AnonymousSubject2.prototype.complete = function() {
      var _a2, _b;
      (_b = (_a2 = this.destination) === null || _a2 === void 0 ? void 0 : _a2.complete) === null || _b === void 0 ? void 0 : _b.call(_a2);
    };
    AnonymousSubject2.prototype._subscribe = function(subscriber) {
      var _a2, _b;
      return (_b = (_a2 = this.source) === null || _a2 === void 0 ? void 0 : _a2.subscribe(subscriber)) !== null && _b !== void 0 ? _b : EMPTY_SUBSCRIPTION;
    };
    return AnonymousSubject2;
  })(Subject);

  // node_modules/rxjs/dist/esm5/internal/BehaviorSubject.js
  var BehaviorSubject = (function(_super) {
    __extends(BehaviorSubject2, _super);
    function BehaviorSubject2(_value) {
      var _this = _super.call(this) || this;
      _this._value = _value;
      return _this;
    }
    Object.defineProperty(BehaviorSubject2.prototype, "value", {
      get: function() {
        return this.getValue();
      },
      enumerable: false,
      configurable: true
    });
    BehaviorSubject2.prototype._subscribe = function(subscriber) {
      var subscription = _super.prototype._subscribe.call(this, subscriber);
      !subscription.closed && subscriber.next(this._value);
      return subscription;
    };
    BehaviorSubject2.prototype.getValue = function() {
      var _a2 = this, hasError = _a2.hasError, thrownError = _a2.thrownError, _value = _a2._value;
      if (hasError) {
        throw thrownError;
      }
      this._throwIfClosed();
      return _value;
    };
    BehaviorSubject2.prototype.next = function(value) {
      _super.prototype.next.call(this, this._value = value);
    };
    return BehaviorSubject2;
  })(Subject);

  // node_modules/rxjs/dist/esm5/internal/scheduler/dateTimestampProvider.js
  var dateTimestampProvider = {
    now: function() {
      return (dateTimestampProvider.delegate || Date).now();
    },
    delegate: void 0
  };

  // node_modules/rxjs/dist/esm5/internal/ReplaySubject.js
  var ReplaySubject = (function(_super) {
    __extends(ReplaySubject2, _super);
    function ReplaySubject2(_bufferSize, _windowTime, _timestampProvider) {
      if (_bufferSize === void 0) {
        _bufferSize = Infinity;
      }
      if (_windowTime === void 0) {
        _windowTime = Infinity;
      }
      if (_timestampProvider === void 0) {
        _timestampProvider = dateTimestampProvider;
      }
      var _this = _super.call(this) || this;
      _this._bufferSize = _bufferSize;
      _this._windowTime = _windowTime;
      _this._timestampProvider = _timestampProvider;
      _this._buffer = [];
      _this._infiniteTimeWindow = true;
      _this._infiniteTimeWindow = _windowTime === Infinity;
      _this._bufferSize = Math.max(1, _bufferSize);
      _this._windowTime = Math.max(1, _windowTime);
      return _this;
    }
    ReplaySubject2.prototype.next = function(value) {
      var _a2 = this, isStopped = _a2.isStopped, _buffer = _a2._buffer, _infiniteTimeWindow = _a2._infiniteTimeWindow, _timestampProvider = _a2._timestampProvider, _windowTime = _a2._windowTime;
      if (!isStopped) {
        _buffer.push(value);
        !_infiniteTimeWindow && _buffer.push(_timestampProvider.now() + _windowTime);
      }
      this._trimBuffer();
      _super.prototype.next.call(this, value);
    };
    ReplaySubject2.prototype._subscribe = function(subscriber) {
      this._throwIfClosed();
      this._trimBuffer();
      var subscription = this._innerSubscribe(subscriber);
      var _a2 = this, _infiniteTimeWindow = _a2._infiniteTimeWindow, _buffer = _a2._buffer;
      var copy = _buffer.slice();
      for (var i = 0; i < copy.length && !subscriber.closed; i += _infiniteTimeWindow ? 1 : 2) {
        subscriber.next(copy[i]);
      }
      this._checkFinalizedStatuses(subscriber);
      return subscription;
    };
    ReplaySubject2.prototype._trimBuffer = function() {
      var _a2 = this, _bufferSize = _a2._bufferSize, _timestampProvider = _a2._timestampProvider, _buffer = _a2._buffer, _infiniteTimeWindow = _a2._infiniteTimeWindow;
      var adjustedBufferSize = (_infiniteTimeWindow ? 1 : 2) * _bufferSize;
      _bufferSize < Infinity && adjustedBufferSize < _buffer.length && _buffer.splice(0, _buffer.length - adjustedBufferSize);
      if (!_infiniteTimeWindow) {
        var now = _timestampProvider.now();
        var last2 = 0;
        for (var i = 1; i < _buffer.length && _buffer[i] <= now; i += 2) {
          last2 = i;
        }
        last2 && _buffer.splice(0, last2 + 1);
      }
    };
    return ReplaySubject2;
  })(Subject);

  // node_modules/rxjs/dist/esm5/internal/scheduler/Action.js
  var Action = (function(_super) {
    __extends(Action2, _super);
    function Action2(scheduler, work) {
      return _super.call(this) || this;
    }
    Action2.prototype.schedule = function(state, delay2) {
      if (delay2 === void 0) {
        delay2 = 0;
      }
      return this;
    };
    return Action2;
  })(Subscription);

  // node_modules/rxjs/dist/esm5/internal/scheduler/intervalProvider.js
  var intervalProvider = {
    setInterval: function(handler, timeout) {
      var args = [];
      for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
      }
      var delegate = intervalProvider.delegate;
      if (delegate === null || delegate === void 0 ? void 0 : delegate.setInterval) {
        return delegate.setInterval.apply(delegate, __spreadArray([handler, timeout], __read(args)));
      }
      return setInterval.apply(void 0, __spreadArray([handler, timeout], __read(args)));
    },
    clearInterval: function(handle2) {
      var delegate = intervalProvider.delegate;
      return ((delegate === null || delegate === void 0 ? void 0 : delegate.clearInterval) || clearInterval)(handle2);
    },
    delegate: void 0
  };

  // node_modules/rxjs/dist/esm5/internal/scheduler/AsyncAction.js
  var AsyncAction = (function(_super) {
    __extends(AsyncAction2, _super);
    function AsyncAction2(scheduler, work) {
      var _this = _super.call(this, scheduler, work) || this;
      _this.scheduler = scheduler;
      _this.work = work;
      _this.pending = false;
      return _this;
    }
    AsyncAction2.prototype.schedule = function(state, delay2) {
      var _a2;
      if (delay2 === void 0) {
        delay2 = 0;
      }
      if (this.closed) {
        return this;
      }
      this.state = state;
      var id = this.id;
      var scheduler = this.scheduler;
      if (id != null) {
        this.id = this.recycleAsyncId(scheduler, id, delay2);
      }
      this.pending = true;
      this.delay = delay2;
      this.id = (_a2 = this.id) !== null && _a2 !== void 0 ? _a2 : this.requestAsyncId(scheduler, this.id, delay2);
      return this;
    };
    AsyncAction2.prototype.requestAsyncId = function(scheduler, _id, delay2) {
      if (delay2 === void 0) {
        delay2 = 0;
      }
      return intervalProvider.setInterval(scheduler.flush.bind(scheduler, this), delay2);
    };
    AsyncAction2.prototype.recycleAsyncId = function(_scheduler, id, delay2) {
      if (delay2 === void 0) {
        delay2 = 0;
      }
      if (delay2 != null && this.delay === delay2 && this.pending === false) {
        return id;
      }
      if (id != null) {
        intervalProvider.clearInterval(id);
      }
      return void 0;
    };
    AsyncAction2.prototype.execute = function(state, delay2) {
      if (this.closed) {
        return new Error("executing a cancelled action");
      }
      this.pending = false;
      var error = this._execute(state, delay2);
      if (error) {
        return error;
      } else if (this.pending === false && this.id != null) {
        this.id = this.recycleAsyncId(this.scheduler, this.id, null);
      }
    };
    AsyncAction2.prototype._execute = function(state, _delay) {
      var errored = false;
      var errorValue;
      try {
        this.work(state);
      } catch (e) {
        errored = true;
        errorValue = e ? e : new Error("Scheduled action threw falsy error");
      }
      if (errored) {
        this.unsubscribe();
        return errorValue;
      }
    };
    AsyncAction2.prototype.unsubscribe = function() {
      if (!this.closed) {
        var _a2 = this, id = _a2.id, scheduler = _a2.scheduler;
        var actions = scheduler.actions;
        this.work = this.state = this.scheduler = null;
        this.pending = false;
        arrRemove(actions, this);
        if (id != null) {
          this.id = this.recycleAsyncId(scheduler, id, null);
        }
        this.delay = null;
        _super.prototype.unsubscribe.call(this);
      }
    };
    return AsyncAction2;
  })(Action);

  // node_modules/rxjs/dist/esm5/internal/Scheduler.js
  var Scheduler = (function() {
    function Scheduler2(schedulerActionCtor, now) {
      if (now === void 0) {
        now = Scheduler2.now;
      }
      this.schedulerActionCtor = schedulerActionCtor;
      this.now = now;
    }
    Scheduler2.prototype.schedule = function(work, delay2, state) {
      if (delay2 === void 0) {
        delay2 = 0;
      }
      return new this.schedulerActionCtor(this, work).schedule(state, delay2);
    };
    Scheduler2.now = dateTimestampProvider.now;
    return Scheduler2;
  })();

  // node_modules/rxjs/dist/esm5/internal/scheduler/AsyncScheduler.js
  var AsyncScheduler = (function(_super) {
    __extends(AsyncScheduler2, _super);
    function AsyncScheduler2(SchedulerAction, now) {
      if (now === void 0) {
        now = Scheduler.now;
      }
      var _this = _super.call(this, SchedulerAction, now) || this;
      _this.actions = [];
      _this._active = false;
      return _this;
    }
    AsyncScheduler2.prototype.flush = function(action) {
      var actions = this.actions;
      if (this._active) {
        actions.push(action);
        return;
      }
      var error;
      this._active = true;
      do {
        if (error = action.execute(action.state, action.delay)) {
          break;
        }
      } while (action = actions.shift());
      this._active = false;
      if (error) {
        while (action = actions.shift()) {
          action.unsubscribe();
        }
        throw error;
      }
    };
    return AsyncScheduler2;
  })(Scheduler);

  // node_modules/rxjs/dist/esm5/internal/scheduler/async.js
  var asyncScheduler = new AsyncScheduler(AsyncAction);
  var async = asyncScheduler;

  // node_modules/rxjs/dist/esm5/internal/scheduler/QueueAction.js
  var QueueAction = (function(_super) {
    __extends(QueueAction2, _super);
    function QueueAction2(scheduler, work) {
      var _this = _super.call(this, scheduler, work) || this;
      _this.scheduler = scheduler;
      _this.work = work;
      return _this;
    }
    QueueAction2.prototype.schedule = function(state, delay2) {
      if (delay2 === void 0) {
        delay2 = 0;
      }
      if (delay2 > 0) {
        return _super.prototype.schedule.call(this, state, delay2);
      }
      this.delay = delay2;
      this.state = state;
      this.scheduler.flush(this);
      return this;
    };
    QueueAction2.prototype.execute = function(state, delay2) {
      return delay2 > 0 || this.closed ? _super.prototype.execute.call(this, state, delay2) : this._execute(state, delay2);
    };
    QueueAction2.prototype.requestAsyncId = function(scheduler, id, delay2) {
      if (delay2 === void 0) {
        delay2 = 0;
      }
      if (delay2 != null && delay2 > 0 || delay2 == null && this.delay > 0) {
        return _super.prototype.requestAsyncId.call(this, scheduler, id, delay2);
      }
      scheduler.flush(this);
      return 0;
    };
    return QueueAction2;
  })(AsyncAction);

  // node_modules/rxjs/dist/esm5/internal/scheduler/QueueScheduler.js
  var QueueScheduler = (function(_super) {
    __extends(QueueScheduler2, _super);
    function QueueScheduler2() {
      return _super !== null && _super.apply(this, arguments) || this;
    }
    return QueueScheduler2;
  })(AsyncScheduler);

  // node_modules/rxjs/dist/esm5/internal/scheduler/queue.js
  var queueScheduler = new QueueScheduler(QueueAction);

  // node_modules/rxjs/dist/esm5/internal/scheduler/AnimationFrameAction.js
  var AnimationFrameAction = (function(_super) {
    __extends(AnimationFrameAction2, _super);
    function AnimationFrameAction2(scheduler, work) {
      var _this = _super.call(this, scheduler, work) || this;
      _this.scheduler = scheduler;
      _this.work = work;
      return _this;
    }
    AnimationFrameAction2.prototype.requestAsyncId = function(scheduler, id, delay2) {
      if (delay2 === void 0) {
        delay2 = 0;
      }
      if (delay2 !== null && delay2 > 0) {
        return _super.prototype.requestAsyncId.call(this, scheduler, id, delay2);
      }
      scheduler.actions.push(this);
      return scheduler._scheduled || (scheduler._scheduled = animationFrameProvider.requestAnimationFrame(function() {
        return scheduler.flush(void 0);
      }));
    };
    AnimationFrameAction2.prototype.recycleAsyncId = function(scheduler, id, delay2) {
      var _a2;
      if (delay2 === void 0) {
        delay2 = 0;
      }
      if (delay2 != null ? delay2 > 0 : this.delay > 0) {
        return _super.prototype.recycleAsyncId.call(this, scheduler, id, delay2);
      }
      var actions = scheduler.actions;
      if (id != null && id === scheduler._scheduled && ((_a2 = actions[actions.length - 1]) === null || _a2 === void 0 ? void 0 : _a2.id) !== id) {
        animationFrameProvider.cancelAnimationFrame(id);
        scheduler._scheduled = void 0;
      }
      return void 0;
    };
    return AnimationFrameAction2;
  })(AsyncAction);

  // node_modules/rxjs/dist/esm5/internal/scheduler/AnimationFrameScheduler.js
  var AnimationFrameScheduler = (function(_super) {
    __extends(AnimationFrameScheduler2, _super);
    function AnimationFrameScheduler2() {
      return _super !== null && _super.apply(this, arguments) || this;
    }
    AnimationFrameScheduler2.prototype.flush = function(action) {
      this._active = true;
      var flushId;
      if (action) {
        flushId = action.id;
      } else {
        flushId = this._scheduled;
        this._scheduled = void 0;
      }
      var actions = this.actions;
      var error;
      action = action || actions.shift();
      do {
        if (error = action.execute(action.state, action.delay)) {
          break;
        }
      } while ((action = actions[0]) && action.id === flushId && actions.shift());
      this._active = false;
      if (error) {
        while ((action = actions[0]) && action.id === flushId && actions.shift()) {
          action.unsubscribe();
        }
        throw error;
      }
    };
    return AnimationFrameScheduler2;
  })(AsyncScheduler);

  // node_modules/rxjs/dist/esm5/internal/scheduler/animationFrame.js
  var animationFrameScheduler = new AnimationFrameScheduler(AnimationFrameAction);

  // node_modules/rxjs/dist/esm5/internal/observable/empty.js
  var EMPTY = new Observable(function(subscriber) {
    return subscriber.complete();
  });

  // node_modules/rxjs/dist/esm5/internal/util/isScheduler.js
  function isScheduler(value) {
    return value && isFunction(value.schedule);
  }

  // node_modules/rxjs/dist/esm5/internal/util/args.js
  function last(arr) {
    return arr[arr.length - 1];
  }
  function popResultSelector(args) {
    return isFunction(last(args)) ? args.pop() : void 0;
  }
  function popScheduler(args) {
    return isScheduler(last(args)) ? args.pop() : void 0;
  }
  function popNumber(args, defaultValue) {
    return typeof last(args) === "number" ? args.pop() : defaultValue;
  }

  // node_modules/rxjs/dist/esm5/internal/util/isArrayLike.js
  var isArrayLike = (function(x) {
    return x && typeof x.length === "number" && typeof x !== "function";
  });

  // node_modules/rxjs/dist/esm5/internal/util/isPromise.js
  function isPromise(value) {
    return isFunction(value === null || value === void 0 ? void 0 : value.then);
  }

  // node_modules/rxjs/dist/esm5/internal/util/isInteropObservable.js
  function isInteropObservable(input) {
    return isFunction(input[observable]);
  }

  // node_modules/rxjs/dist/esm5/internal/util/isAsyncIterable.js
  function isAsyncIterable(obj) {
    return Symbol.asyncIterator && isFunction(obj === null || obj === void 0 ? void 0 : obj[Symbol.asyncIterator]);
  }

  // node_modules/rxjs/dist/esm5/internal/util/throwUnobservableError.js
  function createInvalidObservableTypeError(input) {
    return new TypeError("You provided " + (input !== null && typeof input === "object" ? "an invalid object" : "'" + input + "'") + " where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.");
  }

  // node_modules/rxjs/dist/esm5/internal/symbol/iterator.js
  function getSymbolIterator() {
    if (typeof Symbol !== "function" || !Symbol.iterator) {
      return "@@iterator";
    }
    return Symbol.iterator;
  }
  var iterator = getSymbolIterator();

  // node_modules/rxjs/dist/esm5/internal/util/isIterable.js
  function isIterable(input) {
    return isFunction(input === null || input === void 0 ? void 0 : input[iterator]);
  }

  // node_modules/rxjs/dist/esm5/internal/util/isReadableStreamLike.js
  function readableStreamLikeToAsyncGenerator(readableStream) {
    return __asyncGenerator(this, arguments, function readableStreamLikeToAsyncGenerator_1() {
      var reader, _a2, value, done;
      return __generator(this, function(_b) {
        switch (_b.label) {
          case 0:
            reader = readableStream.getReader();
            _b.label = 1;
          case 1:
            _b.trys.push([1, , 9, 10]);
            _b.label = 2;
          case 2:
            if (false) return [3, 8];
            return [4, __await(reader.read())];
          case 3:
            _a2 = _b.sent(), value = _a2.value, done = _a2.done;
            if (!done) return [3, 5];
            return [4, __await(void 0)];
          case 4:
            return [2, _b.sent()];
          case 5:
            return [4, __await(value)];
          case 6:
            return [4, _b.sent()];
          case 7:
            _b.sent();
            return [3, 2];
          case 8:
            return [3, 10];
          case 9:
            reader.releaseLock();
            return [7];
          case 10:
            return [2];
        }
      });
    });
  }
  function isReadableStreamLike(obj) {
    return isFunction(obj === null || obj === void 0 ? void 0 : obj.getReader);
  }

  // node_modules/rxjs/dist/esm5/internal/observable/innerFrom.js
  function innerFrom(input) {
    if (input instanceof Observable) {
      return input;
    }
    if (input != null) {
      if (isInteropObservable(input)) {
        return fromInteropObservable(input);
      }
      if (isArrayLike(input)) {
        return fromArrayLike(input);
      }
      if (isPromise(input)) {
        return fromPromise(input);
      }
      if (isAsyncIterable(input)) {
        return fromAsyncIterable(input);
      }
      if (isIterable(input)) {
        return fromIterable(input);
      }
      if (isReadableStreamLike(input)) {
        return fromReadableStreamLike(input);
      }
    }
    throw createInvalidObservableTypeError(input);
  }
  function fromInteropObservable(obj) {
    return new Observable(function(subscriber) {
      var obs = obj[observable]();
      if (isFunction(obs.subscribe)) {
        return obs.subscribe(subscriber);
      }
      throw new TypeError("Provided object does not correctly implement Symbol.observable");
    });
  }
  function fromArrayLike(array) {
    return new Observable(function(subscriber) {
      for (var i = 0; i < array.length && !subscriber.closed; i++) {
        subscriber.next(array[i]);
      }
      subscriber.complete();
    });
  }
  function fromPromise(promise) {
    return new Observable(function(subscriber) {
      promise.then(function(value) {
        if (!subscriber.closed) {
          subscriber.next(value);
          subscriber.complete();
        }
      }, function(err) {
        return subscriber.error(err);
      }).then(null, reportUnhandledError);
    });
  }
  function fromIterable(iterable) {
    return new Observable(function(subscriber) {
      var e_1, _a2;
      try {
        for (var iterable_1 = __values(iterable), iterable_1_1 = iterable_1.next(); !iterable_1_1.done; iterable_1_1 = iterable_1.next()) {
          var value = iterable_1_1.value;
          subscriber.next(value);
          if (subscriber.closed) {
            return;
          }
        }
      } catch (e_1_1) {
        e_1 = { error: e_1_1 };
      } finally {
        try {
          if (iterable_1_1 && !iterable_1_1.done && (_a2 = iterable_1.return)) _a2.call(iterable_1);
        } finally {
          if (e_1) throw e_1.error;
        }
      }
      subscriber.complete();
    });
  }
  function fromAsyncIterable(asyncIterable) {
    return new Observable(function(subscriber) {
      process(asyncIterable, subscriber).catch(function(err) {
        return subscriber.error(err);
      });
    });
  }
  function fromReadableStreamLike(readableStream) {
    return fromAsyncIterable(readableStreamLikeToAsyncGenerator(readableStream));
  }
  function process(asyncIterable, subscriber) {
    var asyncIterable_1, asyncIterable_1_1;
    var e_2, _a2;
    return __awaiter(this, void 0, void 0, function() {
      var value, e_2_1;
      return __generator(this, function(_b) {
        switch (_b.label) {
          case 0:
            _b.trys.push([0, 5, 6, 11]);
            asyncIterable_1 = __asyncValues(asyncIterable);
            _b.label = 1;
          case 1:
            return [4, asyncIterable_1.next()];
          case 2:
            if (!(asyncIterable_1_1 = _b.sent(), !asyncIterable_1_1.done)) return [3, 4];
            value = asyncIterable_1_1.value;
            subscriber.next(value);
            if (subscriber.closed) {
              return [2];
            }
            _b.label = 3;
          case 3:
            return [3, 1];
          case 4:
            return [3, 11];
          case 5:
            e_2_1 = _b.sent();
            e_2 = { error: e_2_1 };
            return [3, 11];
          case 6:
            _b.trys.push([6, , 9, 10]);
            if (!(asyncIterable_1_1 && !asyncIterable_1_1.done && (_a2 = asyncIterable_1.return))) return [3, 8];
            return [4, _a2.call(asyncIterable_1)];
          case 7:
            _b.sent();
            _b.label = 8;
          case 8:
            return [3, 10];
          case 9:
            if (e_2) throw e_2.error;
            return [7];
          case 10:
            return [7];
          case 11:
            subscriber.complete();
            return [2];
        }
      });
    });
  }

  // node_modules/rxjs/dist/esm5/internal/util/executeSchedule.js
  function executeSchedule(parentSubscription, scheduler, work, delay2, repeat2) {
    if (delay2 === void 0) {
      delay2 = 0;
    }
    if (repeat2 === void 0) {
      repeat2 = false;
    }
    var scheduleSubscription = scheduler.schedule(function() {
      work();
      if (repeat2) {
        parentSubscription.add(this.schedule(null, delay2));
      } else {
        this.unsubscribe();
      }
    }, delay2);
    parentSubscription.add(scheduleSubscription);
    if (!repeat2) {
      return scheduleSubscription;
    }
  }

  // node_modules/rxjs/dist/esm5/internal/operators/observeOn.js
  function observeOn(scheduler, delay2) {
    if (delay2 === void 0) {
      delay2 = 0;
    }
    return operate(function(source, subscriber) {
      source.subscribe(createOperatorSubscriber(subscriber, function(value) {
        return executeSchedule(subscriber, scheduler, function() {
          return subscriber.next(value);
        }, delay2);
      }, function() {
        return executeSchedule(subscriber, scheduler, function() {
          return subscriber.complete();
        }, delay2);
      }, function(err) {
        return executeSchedule(subscriber, scheduler, function() {
          return subscriber.error(err);
        }, delay2);
      }));
    });
  }

  // node_modules/rxjs/dist/esm5/internal/operators/subscribeOn.js
  function subscribeOn(scheduler, delay2) {
    if (delay2 === void 0) {
      delay2 = 0;
    }
    return operate(function(source, subscriber) {
      subscriber.add(scheduler.schedule(function() {
        return source.subscribe(subscriber);
      }, delay2));
    });
  }

  // node_modules/rxjs/dist/esm5/internal/scheduled/scheduleObservable.js
  function scheduleObservable(input, scheduler) {
    return innerFrom(input).pipe(subscribeOn(scheduler), observeOn(scheduler));
  }

  // node_modules/rxjs/dist/esm5/internal/scheduled/schedulePromise.js
  function schedulePromise(input, scheduler) {
    return innerFrom(input).pipe(subscribeOn(scheduler), observeOn(scheduler));
  }

  // node_modules/rxjs/dist/esm5/internal/scheduled/scheduleArray.js
  function scheduleArray(input, scheduler) {
    return new Observable(function(subscriber) {
      var i = 0;
      return scheduler.schedule(function() {
        if (i === input.length) {
          subscriber.complete();
        } else {
          subscriber.next(input[i++]);
          if (!subscriber.closed) {
            this.schedule();
          }
        }
      });
    });
  }

  // node_modules/rxjs/dist/esm5/internal/scheduled/scheduleIterable.js
  function scheduleIterable(input, scheduler) {
    return new Observable(function(subscriber) {
      var iterator2;
      executeSchedule(subscriber, scheduler, function() {
        iterator2 = input[iterator]();
        executeSchedule(subscriber, scheduler, function() {
          var _a2;
          var value;
          var done;
          try {
            _a2 = iterator2.next(), value = _a2.value, done = _a2.done;
          } catch (err) {
            subscriber.error(err);
            return;
          }
          if (done) {
            subscriber.complete();
          } else {
            subscriber.next(value);
          }
        }, 0, true);
      });
      return function() {
        return isFunction(iterator2 === null || iterator2 === void 0 ? void 0 : iterator2.return) && iterator2.return();
      };
    });
  }

  // node_modules/rxjs/dist/esm5/internal/scheduled/scheduleAsyncIterable.js
  function scheduleAsyncIterable(input, scheduler) {
    if (!input) {
      throw new Error("Iterable cannot be null");
    }
    return new Observable(function(subscriber) {
      executeSchedule(subscriber, scheduler, function() {
        var iterator2 = input[Symbol.asyncIterator]();
        executeSchedule(subscriber, scheduler, function() {
          iterator2.next().then(function(result) {
            if (result.done) {
              subscriber.complete();
            } else {
              subscriber.next(result.value);
            }
          });
        }, 0, true);
      });
    });
  }

  // node_modules/rxjs/dist/esm5/internal/scheduled/scheduleReadableStreamLike.js
  function scheduleReadableStreamLike(input, scheduler) {
    return scheduleAsyncIterable(readableStreamLikeToAsyncGenerator(input), scheduler);
  }

  // node_modules/rxjs/dist/esm5/internal/scheduled/scheduled.js
  function scheduled(input, scheduler) {
    if (input != null) {
      if (isInteropObservable(input)) {
        return scheduleObservable(input, scheduler);
      }
      if (isArrayLike(input)) {
        return scheduleArray(input, scheduler);
      }
      if (isPromise(input)) {
        return schedulePromise(input, scheduler);
      }
      if (isAsyncIterable(input)) {
        return scheduleAsyncIterable(input, scheduler);
      }
      if (isIterable(input)) {
        return scheduleIterable(input, scheduler);
      }
      if (isReadableStreamLike(input)) {
        return scheduleReadableStreamLike(input, scheduler);
      }
    }
    throw createInvalidObservableTypeError(input);
  }

  // node_modules/rxjs/dist/esm5/internal/observable/from.js
  function from(input, scheduler) {
    return scheduler ? scheduled(input, scheduler) : innerFrom(input);
  }

  // node_modules/rxjs/dist/esm5/internal/observable/of.js
  function of() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }
    var scheduler = popScheduler(args);
    return from(args, scheduler);
  }

  // node_modules/rxjs/dist/esm5/internal/observable/throwError.js
  function throwError(errorOrErrorFactory, scheduler) {
    var errorFactory = isFunction(errorOrErrorFactory) ? errorOrErrorFactory : function() {
      return errorOrErrorFactory;
    };
    var init = function(subscriber) {
      return subscriber.error(errorFactory());
    };
    return new Observable(scheduler ? function(subscriber) {
      return scheduler.schedule(init, 0, subscriber);
    } : init);
  }

  // node_modules/rxjs/dist/esm5/internal/util/EmptyError.js
  var EmptyError = createErrorClass(function(_super) {
    return function EmptyErrorImpl() {
      _super(this);
      this.name = "EmptyError";
      this.message = "no elements in sequence";
    };
  });

  // node_modules/rxjs/dist/esm5/internal/util/isDate.js
  function isValidDate(value) {
    return value instanceof Date && !isNaN(value);
  }

  // node_modules/rxjs/dist/esm5/internal/operators/map.js
  function map(project, thisArg) {
    return operate(function(source, subscriber) {
      var index = 0;
      source.subscribe(createOperatorSubscriber(subscriber, function(value) {
        subscriber.next(project.call(thisArg, value, index++));
      }));
    });
  }

  // node_modules/rxjs/dist/esm5/internal/util/mapOneOrManyArgs.js
  var isArray = Array.isArray;
  function callOrApply(fn, args) {
    return isArray(args) ? fn.apply(void 0, __spreadArray([], __read(args))) : fn(args);
  }
  function mapOneOrManyArgs(fn) {
    return map(function(args) {
      return callOrApply(fn, args);
    });
  }

  // node_modules/rxjs/dist/esm5/internal/util/argsArgArrayOrObject.js
  var isArray2 = Array.isArray;
  var getPrototypeOf = Object.getPrototypeOf;
  var objectProto = Object.prototype;
  var getKeys = Object.keys;
  function argsArgArrayOrObject(args) {
    if (args.length === 1) {
      var first_1 = args[0];
      if (isArray2(first_1)) {
        return { args: first_1, keys: null };
      }
      if (isPOJO(first_1)) {
        var keys = getKeys(first_1);
        return {
          args: keys.map(function(key) {
            return first_1[key];
          }),
          keys
        };
      }
    }
    return { args, keys: null };
  }
  function isPOJO(obj) {
    return obj && typeof obj === "object" && getPrototypeOf(obj) === objectProto;
  }

  // node_modules/rxjs/dist/esm5/internal/util/createObject.js
  function createObject(keys, values) {
    return keys.reduce(function(result, key, i) {
      return result[key] = values[i], result;
    }, {});
  }

  // node_modules/rxjs/dist/esm5/internal/observable/combineLatest.js
  function combineLatest() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }
    var scheduler = popScheduler(args);
    var resultSelector = popResultSelector(args);
    var _a2 = argsArgArrayOrObject(args), observables = _a2.args, keys = _a2.keys;
    if (observables.length === 0) {
      return from([], scheduler);
    }
    var result = new Observable(combineLatestInit(observables, scheduler, keys ? function(values) {
      return createObject(keys, values);
    } : identity));
    return resultSelector ? result.pipe(mapOneOrManyArgs(resultSelector)) : result;
  }
  function combineLatestInit(observables, scheduler, valueTransform) {
    if (valueTransform === void 0) {
      valueTransform = identity;
    }
    return function(subscriber) {
      maybeSchedule(scheduler, function() {
        var length = observables.length;
        var values = new Array(length);
        var active = length;
        var remainingFirstValues = length;
        var _loop_1 = function(i2) {
          maybeSchedule(scheduler, function() {
            var source = from(observables[i2], scheduler);
            var hasFirstValue = false;
            source.subscribe(createOperatorSubscriber(subscriber, function(value) {
              values[i2] = value;
              if (!hasFirstValue) {
                hasFirstValue = true;
                remainingFirstValues--;
              }
              if (!remainingFirstValues) {
                subscriber.next(valueTransform(values.slice()));
              }
            }, function() {
              if (!--active) {
                subscriber.complete();
              }
            }));
          }, subscriber);
        };
        for (var i = 0; i < length; i++) {
          _loop_1(i);
        }
      }, subscriber);
    };
  }
  function maybeSchedule(scheduler, execute, subscription) {
    if (scheduler) {
      executeSchedule(subscription, scheduler, execute);
    } else {
      execute();
    }
  }

  // node_modules/rxjs/dist/esm5/internal/operators/mergeInternals.js
  function mergeInternals(source, subscriber, project, concurrent, onBeforeNext, expand, innerSubScheduler, additionalFinalizer) {
    var buffer = [];
    var active = 0;
    var index = 0;
    var isComplete = false;
    var checkComplete = function() {
      if (isComplete && !buffer.length && !active) {
        subscriber.complete();
      }
    };
    var outerNext = function(value) {
      return active < concurrent ? doInnerSub(value) : buffer.push(value);
    };
    var doInnerSub = function(value) {
      expand && subscriber.next(value);
      active++;
      var innerComplete = false;
      innerFrom(project(value, index++)).subscribe(createOperatorSubscriber(subscriber, function(innerValue) {
        onBeforeNext === null || onBeforeNext === void 0 ? void 0 : onBeforeNext(innerValue);
        if (expand) {
          outerNext(innerValue);
        } else {
          subscriber.next(innerValue);
        }
      }, function() {
        innerComplete = true;
      }, void 0, function() {
        if (innerComplete) {
          try {
            active--;
            var _loop_1 = function() {
              var bufferedValue = buffer.shift();
              if (innerSubScheduler) {
                executeSchedule(subscriber, innerSubScheduler, function() {
                  return doInnerSub(bufferedValue);
                });
              } else {
                doInnerSub(bufferedValue);
              }
            };
            while (buffer.length && active < concurrent) {
              _loop_1();
            }
            checkComplete();
          } catch (err) {
            subscriber.error(err);
          }
        }
      }));
    };
    source.subscribe(createOperatorSubscriber(subscriber, outerNext, function() {
      isComplete = true;
      checkComplete();
    }));
    return function() {
      additionalFinalizer === null || additionalFinalizer === void 0 ? void 0 : additionalFinalizer();
    };
  }

  // node_modules/rxjs/dist/esm5/internal/operators/mergeMap.js
  function mergeMap(project, resultSelector, concurrent) {
    if (concurrent === void 0) {
      concurrent = Infinity;
    }
    if (isFunction(resultSelector)) {
      return mergeMap(function(a, i) {
        return map(function(b, ii) {
          return resultSelector(a, b, i, ii);
        })(innerFrom(project(a, i)));
      }, concurrent);
    } else if (typeof resultSelector === "number") {
      concurrent = resultSelector;
    }
    return operate(function(source, subscriber) {
      return mergeInternals(source, subscriber, project, concurrent);
    });
  }

  // node_modules/rxjs/dist/esm5/internal/operators/mergeAll.js
  function mergeAll(concurrent) {
    if (concurrent === void 0) {
      concurrent = Infinity;
    }
    return mergeMap(identity, concurrent);
  }

  // node_modules/rxjs/dist/esm5/internal/operators/concatAll.js
  function concatAll() {
    return mergeAll(1);
  }

  // node_modules/rxjs/dist/esm5/internal/observable/concat.js
  function concat() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }
    return concatAll()(from(args, popScheduler(args)));
  }

  // node_modules/rxjs/dist/esm5/internal/observable/defer.js
  function defer(observableFactory) {
    return new Observable(function(subscriber) {
      innerFrom(observableFactory()).subscribe(subscriber);
    });
  }

  // node_modules/rxjs/dist/esm5/internal/observable/fromEvent.js
  var nodeEventEmitterMethods = ["addListener", "removeListener"];
  var eventTargetMethods = ["addEventListener", "removeEventListener"];
  var jqueryMethods = ["on", "off"];
  function fromEvent(target, eventName, options, resultSelector) {
    if (isFunction(options)) {
      resultSelector = options;
      options = void 0;
    }
    if (resultSelector) {
      return fromEvent(target, eventName, options).pipe(mapOneOrManyArgs(resultSelector));
    }
    var _a2 = __read(isEventTarget(target) ? eventTargetMethods.map(function(methodName) {
      return function(handler) {
        return target[methodName](eventName, handler, options);
      };
    }) : isNodeStyleEventEmitter(target) ? nodeEventEmitterMethods.map(toCommonHandlerRegistry(target, eventName)) : isJQueryStyleEventEmitter(target) ? jqueryMethods.map(toCommonHandlerRegistry(target, eventName)) : [], 2), add = _a2[0], remove = _a2[1];
    if (!add) {
      if (isArrayLike(target)) {
        return mergeMap(function(subTarget) {
          return fromEvent(subTarget, eventName, options);
        })(innerFrom(target));
      }
    }
    if (!add) {
      throw new TypeError("Invalid event target");
    }
    return new Observable(function(subscriber) {
      var handler = function() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
        }
        return subscriber.next(1 < args.length ? args : args[0]);
      };
      add(handler);
      return function() {
        return remove(handler);
      };
    });
  }
  function toCommonHandlerRegistry(target, eventName) {
    return function(methodName) {
      return function(handler) {
        return target[methodName](eventName, handler);
      };
    };
  }
  function isNodeStyleEventEmitter(target) {
    return isFunction(target.addListener) && isFunction(target.removeListener);
  }
  function isJQueryStyleEventEmitter(target) {
    return isFunction(target.on) && isFunction(target.off);
  }
  function isEventTarget(target) {
    return isFunction(target.addEventListener) && isFunction(target.removeEventListener);
  }

  // node_modules/rxjs/dist/esm5/internal/observable/fromEventPattern.js
  function fromEventPattern(addHandler, removeHandler, resultSelector) {
    if (resultSelector) {
      return fromEventPattern(addHandler, removeHandler).pipe(mapOneOrManyArgs(resultSelector));
    }
    return new Observable(function(subscriber) {
      var handler = function() {
        var e = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          e[_i] = arguments[_i];
        }
        return subscriber.next(e.length === 1 ? e[0] : e);
      };
      var retValue = addHandler(handler);
      return isFunction(removeHandler) ? function() {
        return removeHandler(handler, retValue);
      } : void 0;
    });
  }

  // node_modules/rxjs/dist/esm5/internal/observable/timer.js
  function timer(dueTime, intervalOrScheduler, scheduler) {
    if (dueTime === void 0) {
      dueTime = 0;
    }
    if (scheduler === void 0) {
      scheduler = async;
    }
    var intervalDuration = -1;
    if (intervalOrScheduler != null) {
      if (isScheduler(intervalOrScheduler)) {
        scheduler = intervalOrScheduler;
      } else {
        intervalDuration = intervalOrScheduler;
      }
    }
    return new Observable(function(subscriber) {
      var due = isValidDate(dueTime) ? +dueTime - scheduler.now() : dueTime;
      if (due < 0) {
        due = 0;
      }
      var n = 0;
      return scheduler.schedule(function() {
        if (!subscriber.closed) {
          subscriber.next(n++);
          if (0 <= intervalDuration) {
            this.schedule(void 0, intervalDuration);
          } else {
            subscriber.complete();
          }
        }
      }, due);
    });
  }

  // node_modules/rxjs/dist/esm5/internal/observable/merge.js
  function merge() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }
    var scheduler = popScheduler(args);
    var concurrent = popNumber(args, Infinity);
    var sources = args;
    return !sources.length ? EMPTY : sources.length === 1 ? innerFrom(sources[0]) : mergeAll(concurrent)(from(sources, scheduler));
  }

  // node_modules/rxjs/dist/esm5/internal/observable/never.js
  var NEVER = new Observable(noop);

  // node_modules/rxjs/dist/esm5/internal/util/argsOrArgArray.js
  var isArray3 = Array.isArray;
  function argsOrArgArray(args) {
    return args.length === 1 && isArray3(args[0]) ? args[0] : args;
  }

  // node_modules/rxjs/dist/esm5/internal/operators/filter.js
  function filter(predicate, thisArg) {
    return operate(function(source, subscriber) {
      var index = 0;
      source.subscribe(createOperatorSubscriber(subscriber, function(value) {
        return predicate.call(thisArg, value, index++) && subscriber.next(value);
      }));
    });
  }

  // node_modules/rxjs/dist/esm5/internal/observable/zip.js
  function zip() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }
    var resultSelector = popResultSelector(args);
    var sources = argsOrArgArray(args);
    return sources.length ? new Observable(function(subscriber) {
      var buffers = sources.map(function() {
        return [];
      });
      var completed = sources.map(function() {
        return false;
      });
      subscriber.add(function() {
        buffers = completed = null;
      });
      var _loop_1 = function(sourceIndex2) {
        innerFrom(sources[sourceIndex2]).subscribe(createOperatorSubscriber(subscriber, function(value) {
          buffers[sourceIndex2].push(value);
          if (buffers.every(function(buffer) {
            return buffer.length;
          })) {
            var result = buffers.map(function(buffer) {
              return buffer.shift();
            });
            subscriber.next(resultSelector ? resultSelector.apply(void 0, __spreadArray([], __read(result))) : result);
            if (buffers.some(function(buffer, i) {
              return !buffer.length && completed[i];
            })) {
              subscriber.complete();
            }
          }
        }, function() {
          completed[sourceIndex2] = true;
          !buffers[sourceIndex2].length && subscriber.complete();
        }));
      };
      for (var sourceIndex = 0; !subscriber.closed && sourceIndex < sources.length; sourceIndex++) {
        _loop_1(sourceIndex);
      }
      return function() {
        buffers = completed = null;
      };
    }) : EMPTY;
  }

  // node_modules/rxjs/dist/esm5/internal/operators/audit.js
  function audit(durationSelector) {
    return operate(function(source, subscriber) {
      var hasValue = false;
      var lastValue = null;
      var durationSubscriber = null;
      var isComplete = false;
      var endDuration = function() {
        durationSubscriber === null || durationSubscriber === void 0 ? void 0 : durationSubscriber.unsubscribe();
        durationSubscriber = null;
        if (hasValue) {
          hasValue = false;
          var value = lastValue;
          lastValue = null;
          subscriber.next(value);
        }
        isComplete && subscriber.complete();
      };
      var cleanupDuration = function() {
        durationSubscriber = null;
        isComplete && subscriber.complete();
      };
      source.subscribe(createOperatorSubscriber(subscriber, function(value) {
        hasValue = true;
        lastValue = value;
        if (!durationSubscriber) {
          innerFrom(durationSelector(value)).subscribe(durationSubscriber = createOperatorSubscriber(subscriber, endDuration, cleanupDuration));
        }
      }, function() {
        isComplete = true;
        (!hasValue || !durationSubscriber || durationSubscriber.closed) && subscriber.complete();
      }));
    });
  }

  // node_modules/rxjs/dist/esm5/internal/operators/auditTime.js
  function auditTime(duration, scheduler) {
    if (scheduler === void 0) {
      scheduler = asyncScheduler;
    }
    return audit(function() {
      return timer(duration, scheduler);
    });
  }

  // node_modules/rxjs/dist/esm5/internal/operators/bufferCount.js
  function bufferCount(bufferSize, startBufferEvery) {
    if (startBufferEvery === void 0) {
      startBufferEvery = null;
    }
    startBufferEvery = startBufferEvery !== null && startBufferEvery !== void 0 ? startBufferEvery : bufferSize;
    return operate(function(source, subscriber) {
      var buffers = [];
      var count = 0;
      source.subscribe(createOperatorSubscriber(subscriber, function(value) {
        var e_1, _a2, e_2, _b;
        var toEmit = null;
        if (count++ % startBufferEvery === 0) {
          buffers.push([]);
        }
        try {
          for (var buffers_1 = __values(buffers), buffers_1_1 = buffers_1.next(); !buffers_1_1.done; buffers_1_1 = buffers_1.next()) {
            var buffer = buffers_1_1.value;
            buffer.push(value);
            if (bufferSize <= buffer.length) {
              toEmit = toEmit !== null && toEmit !== void 0 ? toEmit : [];
              toEmit.push(buffer);
            }
          }
        } catch (e_1_1) {
          e_1 = { error: e_1_1 };
        } finally {
          try {
            if (buffers_1_1 && !buffers_1_1.done && (_a2 = buffers_1.return)) _a2.call(buffers_1);
          } finally {
            if (e_1) throw e_1.error;
          }
        }
        if (toEmit) {
          try {
            for (var toEmit_1 = __values(toEmit), toEmit_1_1 = toEmit_1.next(); !toEmit_1_1.done; toEmit_1_1 = toEmit_1.next()) {
              var buffer = toEmit_1_1.value;
              arrRemove(buffers, buffer);
              subscriber.next(buffer);
            }
          } catch (e_2_1) {
            e_2 = { error: e_2_1 };
          } finally {
            try {
              if (toEmit_1_1 && !toEmit_1_1.done && (_b = toEmit_1.return)) _b.call(toEmit_1);
            } finally {
              if (e_2) throw e_2.error;
            }
          }
        }
      }, function() {
        var e_3, _a2;
        try {
          for (var buffers_2 = __values(buffers), buffers_2_1 = buffers_2.next(); !buffers_2_1.done; buffers_2_1 = buffers_2.next()) {
            var buffer = buffers_2_1.value;
            subscriber.next(buffer);
          }
        } catch (e_3_1) {
          e_3 = { error: e_3_1 };
        } finally {
          try {
            if (buffers_2_1 && !buffers_2_1.done && (_a2 = buffers_2.return)) _a2.call(buffers_2);
          } finally {
            if (e_3) throw e_3.error;
          }
        }
        subscriber.complete();
      }, void 0, function() {
        buffers = null;
      }));
    });
  }

  // node_modules/rxjs/dist/esm5/internal/operators/catchError.js
  function catchError(selector) {
    return operate(function(source, subscriber) {
      var innerSub = null;
      var syncUnsub = false;
      var handledResult;
      innerSub = source.subscribe(createOperatorSubscriber(subscriber, void 0, void 0, function(err) {
        handledResult = innerFrom(selector(err, catchError(selector)(source)));
        if (innerSub) {
          innerSub.unsubscribe();
          innerSub = null;
          handledResult.subscribe(subscriber);
        } else {
          syncUnsub = true;
        }
      }));
      if (syncUnsub) {
        innerSub.unsubscribe();
        innerSub = null;
        handledResult.subscribe(subscriber);
      }
    });
  }

  // node_modules/rxjs/dist/esm5/internal/operators/scanInternals.js
  function scanInternals(accumulator, seed, hasSeed, emitOnNext, emitBeforeComplete) {
    return function(source, subscriber) {
      var hasState = hasSeed;
      var state = seed;
      var index = 0;
      source.subscribe(createOperatorSubscriber(subscriber, function(value) {
        var i = index++;
        state = hasState ? accumulator(state, value, i) : (hasState = true, value);
        emitOnNext && subscriber.next(state);
      }, emitBeforeComplete && (function() {
        hasState && subscriber.next(state);
        subscriber.complete();
      })));
    };
  }

  // node_modules/rxjs/dist/esm5/internal/operators/combineLatest.js
  function combineLatest2() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }
    var resultSelector = popResultSelector(args);
    return resultSelector ? pipe(combineLatest2.apply(void 0, __spreadArray([], __read(args))), mapOneOrManyArgs(resultSelector)) : operate(function(source, subscriber) {
      combineLatestInit(__spreadArray([source], __read(argsOrArgArray(args))))(subscriber);
    });
  }

  // node_modules/rxjs/dist/esm5/internal/operators/combineLatestWith.js
  function combineLatestWith() {
    var otherSources = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      otherSources[_i] = arguments[_i];
    }
    return combineLatest2.apply(void 0, __spreadArray([], __read(otherSources)));
  }

  // node_modules/rxjs/dist/esm5/internal/operators/debounce.js
  function debounce(durationSelector) {
    return operate(function(source, subscriber) {
      var hasValue = false;
      var lastValue = null;
      var durationSubscriber = null;
      var emit = function() {
        durationSubscriber === null || durationSubscriber === void 0 ? void 0 : durationSubscriber.unsubscribe();
        durationSubscriber = null;
        if (hasValue) {
          hasValue = false;
          var value = lastValue;
          lastValue = null;
          subscriber.next(value);
        }
      };
      source.subscribe(createOperatorSubscriber(subscriber, function(value) {
        durationSubscriber === null || durationSubscriber === void 0 ? void 0 : durationSubscriber.unsubscribe();
        hasValue = true;
        lastValue = value;
        durationSubscriber = createOperatorSubscriber(subscriber, emit, noop);
        innerFrom(durationSelector(value)).subscribe(durationSubscriber);
      }, function() {
        emit();
        subscriber.complete();
      }, void 0, function() {
        lastValue = durationSubscriber = null;
      }));
    });
  }

  // node_modules/rxjs/dist/esm5/internal/operators/debounceTime.js
  function debounceTime(dueTime, scheduler) {
    if (scheduler === void 0) {
      scheduler = asyncScheduler;
    }
    return operate(function(source, subscriber) {
      var activeTask = null;
      var lastValue = null;
      var lastTime = null;
      var emit = function() {
        if (activeTask) {
          activeTask.unsubscribe();
          activeTask = null;
          var value = lastValue;
          lastValue = null;
          subscriber.next(value);
        }
      };
      function emitWhenIdle() {
        var targetTime = lastTime + dueTime;
        var now = scheduler.now();
        if (now < targetTime) {
          activeTask = this.schedule(void 0, targetTime - now);
          subscriber.add(activeTask);
          return;
        }
        emit();
      }
      source.subscribe(createOperatorSubscriber(subscriber, function(value) {
        lastValue = value;
        lastTime = scheduler.now();
        if (!activeTask) {
          activeTask = scheduler.schedule(emitWhenIdle, dueTime);
          subscriber.add(activeTask);
        }
      }, function() {
        emit();
        subscriber.complete();
      }, void 0, function() {
        lastValue = activeTask = null;
      }));
    });
  }

  // node_modules/rxjs/dist/esm5/internal/operators/defaultIfEmpty.js
  function defaultIfEmpty(defaultValue) {
    return operate(function(source, subscriber) {
      var hasValue = false;
      source.subscribe(createOperatorSubscriber(subscriber, function(value) {
        hasValue = true;
        subscriber.next(value);
      }, function() {
        if (!hasValue) {
          subscriber.next(defaultValue);
        }
        subscriber.complete();
      }));
    });
  }

  // node_modules/rxjs/dist/esm5/internal/operators/take.js
  function take(count) {
    return count <= 0 ? function() {
      return EMPTY;
    } : operate(function(source, subscriber) {
      var seen = 0;
      source.subscribe(createOperatorSubscriber(subscriber, function(value) {
        if (++seen <= count) {
          subscriber.next(value);
          if (count <= seen) {
            subscriber.complete();
          }
        }
      }));
    });
  }

  // node_modules/rxjs/dist/esm5/internal/operators/ignoreElements.js
  function ignoreElements() {
    return operate(function(source, subscriber) {
      source.subscribe(createOperatorSubscriber(subscriber, noop));
    });
  }

  // node_modules/rxjs/dist/esm5/internal/operators/mapTo.js
  function mapTo(value) {
    return map(function() {
      return value;
    });
  }

  // node_modules/rxjs/dist/esm5/internal/operators/delayWhen.js
  function delayWhen(delayDurationSelector, subscriptionDelay) {
    if (subscriptionDelay) {
      return function(source) {
        return concat(subscriptionDelay.pipe(take(1), ignoreElements()), source.pipe(delayWhen(delayDurationSelector)));
      };
    }
    return mergeMap(function(value, index) {
      return innerFrom(delayDurationSelector(value, index)).pipe(take(1), mapTo(value));
    });
  }

  // node_modules/rxjs/dist/esm5/internal/operators/delay.js
  function delay(due, scheduler) {
    if (scheduler === void 0) {
      scheduler = asyncScheduler;
    }
    var duration = timer(due, scheduler);
    return delayWhen(function() {
      return duration;
    });
  }

  // node_modules/rxjs/dist/esm5/internal/operators/distinct.js
  function distinct(keySelector, flushes) {
    return operate(function(source, subscriber) {
      var distinctKeys = /* @__PURE__ */ new Set();
      source.subscribe(createOperatorSubscriber(subscriber, function(value) {
        var key = keySelector ? keySelector(value) : value;
        if (!distinctKeys.has(key)) {
          distinctKeys.add(key);
          subscriber.next(value);
        }
      }));
      flushes && innerFrom(flushes).subscribe(createOperatorSubscriber(subscriber, function() {
        return distinctKeys.clear();
      }, noop));
    });
  }

  // node_modules/rxjs/dist/esm5/internal/operators/distinctUntilChanged.js
  function distinctUntilChanged(comparator, keySelector) {
    if (keySelector === void 0) {
      keySelector = identity;
    }
    comparator = comparator !== null && comparator !== void 0 ? comparator : defaultCompare;
    return operate(function(source, subscriber) {
      var previousKey;
      var first2 = true;
      source.subscribe(createOperatorSubscriber(subscriber, function(value) {
        var currentKey = keySelector(value);
        if (first2 || !comparator(previousKey, currentKey)) {
          first2 = false;
          previousKey = currentKey;
          subscriber.next(value);
        }
      }));
    });
  }
  function defaultCompare(a, b) {
    return a === b;
  }

  // node_modules/rxjs/dist/esm5/internal/operators/distinctUntilKeyChanged.js
  function distinctUntilKeyChanged(key, compare) {
    return distinctUntilChanged(function(x, y) {
      return compare ? compare(x[key], y[key]) : x[key] === y[key];
    });
  }

  // node_modules/rxjs/dist/esm5/internal/operators/throwIfEmpty.js
  function throwIfEmpty(errorFactory) {
    if (errorFactory === void 0) {
      errorFactory = defaultErrorFactory;
    }
    return operate(function(source, subscriber) {
      var hasValue = false;
      source.subscribe(createOperatorSubscriber(subscriber, function(value) {
        hasValue = true;
        subscriber.next(value);
      }, function() {
        return hasValue ? subscriber.complete() : subscriber.error(errorFactory());
      }));
    });
  }
  function defaultErrorFactory() {
    return new EmptyError();
  }

  // node_modules/rxjs/dist/esm5/internal/operators/endWith.js
  function endWith() {
    var values = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      values[_i] = arguments[_i];
    }
    return function(source) {
      return concat(source, of.apply(void 0, __spreadArray([], __read(values))));
    };
  }

  // node_modules/rxjs/dist/esm5/internal/operators/exhaustMap.js
  function exhaustMap(project, resultSelector) {
    if (resultSelector) {
      return function(source) {
        return source.pipe(exhaustMap(function(a, i) {
          return innerFrom(project(a, i)).pipe(map(function(b, ii) {
            return resultSelector(a, b, i, ii);
          }));
        }));
      };
    }
    return operate(function(source, subscriber) {
      var index = 0;
      var innerSub = null;
      var isComplete = false;
      source.subscribe(createOperatorSubscriber(subscriber, function(outerValue) {
        if (!innerSub) {
          innerSub = createOperatorSubscriber(subscriber, void 0, function() {
            innerSub = null;
            isComplete && subscriber.complete();
          });
          innerFrom(project(outerValue, index++)).subscribe(innerSub);
        }
      }, function() {
        isComplete = true;
        !innerSub && subscriber.complete();
      }));
    });
  }

  // node_modules/rxjs/dist/esm5/internal/operators/finalize.js
  function finalize(callback) {
    return operate(function(source, subscriber) {
      try {
        source.subscribe(subscriber);
      } finally {
        subscriber.add(callback);
      }
    });
  }

  // node_modules/rxjs/dist/esm5/internal/operators/first.js
  function first(predicate, defaultValue) {
    var hasDefaultValue = arguments.length >= 2;
    return function(source) {
      return source.pipe(predicate ? filter(function(v, i) {
        return predicate(v, i, source);
      }) : identity, take(1), hasDefaultValue ? defaultIfEmpty(defaultValue) : throwIfEmpty(function() {
        return new EmptyError();
      }));
    };
  }

  // node_modules/rxjs/dist/esm5/internal/operators/takeLast.js
  function takeLast(count) {
    return count <= 0 ? function() {
      return EMPTY;
    } : operate(function(source, subscriber) {
      var buffer = [];
      source.subscribe(createOperatorSubscriber(subscriber, function(value) {
        buffer.push(value);
        count < buffer.length && buffer.shift();
      }, function() {
        var e_1, _a2;
        try {
          for (var buffer_1 = __values(buffer), buffer_1_1 = buffer_1.next(); !buffer_1_1.done; buffer_1_1 = buffer_1.next()) {
            var value = buffer_1_1.value;
            subscriber.next(value);
          }
        } catch (e_1_1) {
          e_1 = { error: e_1_1 };
        } finally {
          try {
            if (buffer_1_1 && !buffer_1_1.done && (_a2 = buffer_1.return)) _a2.call(buffer_1);
          } finally {
            if (e_1) throw e_1.error;
          }
        }
        subscriber.complete();
      }, void 0, function() {
        buffer = null;
      }));
    });
  }

  // node_modules/rxjs/dist/esm5/internal/operators/merge.js
  function merge2() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }
    var scheduler = popScheduler(args);
    var concurrent = popNumber(args, Infinity);
    return operate(function(source, subscriber) {
      mergeAll(concurrent)(from(__spreadArray([source], __read(args)), scheduler)).subscribe(subscriber);
    });
  }

  // node_modules/rxjs/dist/esm5/internal/operators/mergeWith.js
  function mergeWith() {
    var otherSources = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      otherSources[_i] = arguments[_i];
    }
    return merge2.apply(void 0, __spreadArray([], __read(otherSources)));
  }

  // node_modules/rxjs/dist/esm5/internal/operators/repeat.js
  function repeat(countOrConfig) {
    var _a2;
    var count = Infinity;
    var delay2;
    if (countOrConfig != null) {
      if (typeof countOrConfig === "object") {
        _a2 = countOrConfig.count, count = _a2 === void 0 ? Infinity : _a2, delay2 = countOrConfig.delay;
      } else {
        count = countOrConfig;
      }
    }
    return count <= 0 ? function() {
      return EMPTY;
    } : operate(function(source, subscriber) {
      var soFar = 0;
      var sourceSub;
      var resubscribe = function() {
        sourceSub === null || sourceSub === void 0 ? void 0 : sourceSub.unsubscribe();
        sourceSub = null;
        if (delay2 != null) {
          var notifier = typeof delay2 === "number" ? timer(delay2) : innerFrom(delay2(soFar));
          var notifierSubscriber_1 = createOperatorSubscriber(subscriber, function() {
            notifierSubscriber_1.unsubscribe();
            subscribeToSource();
          });
          notifier.subscribe(notifierSubscriber_1);
        } else {
          subscribeToSource();
        }
      };
      var subscribeToSource = function() {
        var syncUnsub = false;
        sourceSub = source.subscribe(createOperatorSubscriber(subscriber, void 0, function() {
          if (++soFar < count) {
            if (sourceSub) {
              resubscribe();
            } else {
              syncUnsub = true;
            }
          } else {
            subscriber.complete();
          }
        }));
        if (syncUnsub) {
          resubscribe();
        }
      };
      subscribeToSource();
    });
  }

  // node_modules/rxjs/dist/esm5/internal/operators/scan.js
  function scan(accumulator, seed) {
    return operate(scanInternals(accumulator, seed, arguments.length >= 2, true));
  }

  // node_modules/rxjs/dist/esm5/internal/operators/share.js
  function share(options) {
    if (options === void 0) {
      options = {};
    }
    var _a2 = options.connector, connector = _a2 === void 0 ? function() {
      return new Subject();
    } : _a2, _b = options.resetOnError, resetOnError = _b === void 0 ? true : _b, _c = options.resetOnComplete, resetOnComplete = _c === void 0 ? true : _c, _d = options.resetOnRefCountZero, resetOnRefCountZero = _d === void 0 ? true : _d;
    return function(wrapperSource) {
      var connection;
      var resetConnection;
      var subject;
      var refCount = 0;
      var hasCompleted = false;
      var hasErrored = false;
      var cancelReset = function() {
        resetConnection === null || resetConnection === void 0 ? void 0 : resetConnection.unsubscribe();
        resetConnection = void 0;
      };
      var reset = function() {
        cancelReset();
        connection = subject = void 0;
        hasCompleted = hasErrored = false;
      };
      var resetAndUnsubscribe = function() {
        var conn = connection;
        reset();
        conn === null || conn === void 0 ? void 0 : conn.unsubscribe();
      };
      return operate(function(source, subscriber) {
        refCount++;
        if (!hasErrored && !hasCompleted) {
          cancelReset();
        }
        var dest = subject = subject !== null && subject !== void 0 ? subject : connector();
        subscriber.add(function() {
          refCount--;
          if (refCount === 0 && !hasErrored && !hasCompleted) {
            resetConnection = handleReset(resetAndUnsubscribe, resetOnRefCountZero);
          }
        });
        dest.subscribe(subscriber);
        if (!connection && refCount > 0) {
          connection = new SafeSubscriber({
            next: function(value) {
              return dest.next(value);
            },
            error: function(err) {
              hasErrored = true;
              cancelReset();
              resetConnection = handleReset(reset, resetOnError, err);
              dest.error(err);
            },
            complete: function() {
              hasCompleted = true;
              cancelReset();
              resetConnection = handleReset(reset, resetOnComplete);
              dest.complete();
            }
          });
          innerFrom(source).subscribe(connection);
        }
      })(wrapperSource);
    };
  }
  function handleReset(reset, on) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
      args[_i - 2] = arguments[_i];
    }
    if (on === true) {
      reset();
      return;
    }
    if (on === false) {
      return;
    }
    var onSubscriber = new SafeSubscriber({
      next: function() {
        onSubscriber.unsubscribe();
        reset();
      }
    });
    return innerFrom(on.apply(void 0, __spreadArray([], __read(args)))).subscribe(onSubscriber);
  }

  // node_modules/rxjs/dist/esm5/internal/operators/shareReplay.js
  function shareReplay(configOrBufferSize, windowTime, scheduler) {
    var _a2, _b, _c;
    var bufferSize;
    var refCount = false;
    if (configOrBufferSize && typeof configOrBufferSize === "object") {
      _a2 = configOrBufferSize.bufferSize, bufferSize = _a2 === void 0 ? Infinity : _a2, _b = configOrBufferSize.windowTime, windowTime = _b === void 0 ? Infinity : _b, _c = configOrBufferSize.refCount, refCount = _c === void 0 ? false : _c, scheduler = configOrBufferSize.scheduler;
    } else {
      bufferSize = configOrBufferSize !== null && configOrBufferSize !== void 0 ? configOrBufferSize : Infinity;
    }
    return share({
      connector: function() {
        return new ReplaySubject(bufferSize, windowTime, scheduler);
      },
      resetOnError: true,
      resetOnComplete: false,
      resetOnRefCountZero: refCount
    });
  }

  // node_modules/rxjs/dist/esm5/internal/operators/skip.js
  function skip(count) {
    return filter(function(_, index) {
      return count <= index;
    });
  }

  // node_modules/rxjs/dist/esm5/internal/operators/skipUntil.js
  function skipUntil(notifier) {
    return operate(function(source, subscriber) {
      var taking = false;
      var skipSubscriber = createOperatorSubscriber(subscriber, function() {
        skipSubscriber === null || skipSubscriber === void 0 ? void 0 : skipSubscriber.unsubscribe();
        taking = true;
      }, noop);
      innerFrom(notifier).subscribe(skipSubscriber);
      source.subscribe(createOperatorSubscriber(subscriber, function(value) {
        return taking && subscriber.next(value);
      }));
    });
  }

  // node_modules/rxjs/dist/esm5/internal/operators/startWith.js
  function startWith() {
    var values = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      values[_i] = arguments[_i];
    }
    var scheduler = popScheduler(values);
    return operate(function(source, subscriber) {
      (scheduler ? concat(values, source, scheduler) : concat(values, source)).subscribe(subscriber);
    });
  }

  // node_modules/rxjs/dist/esm5/internal/operators/switchMap.js
  function switchMap(project, resultSelector) {
    return operate(function(source, subscriber) {
      var innerSubscriber = null;
      var index = 0;
      var isComplete = false;
      var checkComplete = function() {
        return isComplete && !innerSubscriber && subscriber.complete();
      };
      source.subscribe(createOperatorSubscriber(subscriber, function(value) {
        innerSubscriber === null || innerSubscriber === void 0 ? void 0 : innerSubscriber.unsubscribe();
        var innerIndex = 0;
        var outerIndex = index++;
        innerFrom(project(value, outerIndex)).subscribe(innerSubscriber = createOperatorSubscriber(subscriber, function(innerValue) {
          return subscriber.next(resultSelector ? resultSelector(value, innerValue, outerIndex, innerIndex++) : innerValue);
        }, function() {
          innerSubscriber = null;
          checkComplete();
        }));
      }, function() {
        isComplete = true;
        checkComplete();
      }));
    });
  }

  // node_modules/rxjs/dist/esm5/internal/operators/takeUntil.js
  function takeUntil(notifier) {
    return operate(function(source, subscriber) {
      innerFrom(notifier).subscribe(createOperatorSubscriber(subscriber, function() {
        return subscriber.complete();
      }, noop));
      !subscriber.closed && source.subscribe(subscriber);
    });
  }

  // node_modules/rxjs/dist/esm5/internal/operators/takeWhile.js
  function takeWhile(predicate, inclusive) {
    if (inclusive === void 0) {
      inclusive = false;
    }
    return operate(function(source, subscriber) {
      var index = 0;
      source.subscribe(createOperatorSubscriber(subscriber, function(value) {
        var result = predicate(value, index++);
        (result || inclusive) && subscriber.next(value);
        !result && subscriber.complete();
      }));
    });
  }

  // node_modules/rxjs/dist/esm5/internal/operators/tap.js
  function tap(observerOrNext, error, complete) {
    var tapObserver = isFunction(observerOrNext) || error || complete ? { next: observerOrNext, error, complete } : observerOrNext;
    return tapObserver ? operate(function(source, subscriber) {
      var _a2;
      (_a2 = tapObserver.subscribe) === null || _a2 === void 0 ? void 0 : _a2.call(tapObserver);
      var isUnsub = true;
      source.subscribe(createOperatorSubscriber(subscriber, function(value) {
        var _a3;
        (_a3 = tapObserver.next) === null || _a3 === void 0 ? void 0 : _a3.call(tapObserver, value);
        subscriber.next(value);
      }, function() {
        var _a3;
        isUnsub = false;
        (_a3 = tapObserver.complete) === null || _a3 === void 0 ? void 0 : _a3.call(tapObserver);
        subscriber.complete();
      }, function(err) {
        var _a3;
        isUnsub = false;
        (_a3 = tapObserver.error) === null || _a3 === void 0 ? void 0 : _a3.call(tapObserver, err);
        subscriber.error(err);
      }, function() {
        var _a3, _b;
        if (isUnsub) {
          (_a3 = tapObserver.unsubscribe) === null || _a3 === void 0 ? void 0 : _a3.call(tapObserver);
        }
        (_b = tapObserver.finalize) === null || _b === void 0 ? void 0 : _b.call(tapObserver);
      }));
    }) : identity;
  }

  // node_modules/rxjs/dist/esm5/internal/operators/throttle.js
  function throttle(durationSelector, config4) {
    return operate(function(source, subscriber) {
      var _a2 = config4 !== null && config4 !== void 0 ? config4 : {}, _b = _a2.leading, leading = _b === void 0 ? true : _b, _c = _a2.trailing, trailing = _c === void 0 ? false : _c;
      var hasValue = false;
      var sendValue = null;
      var throttled = null;
      var isComplete = false;
      var endThrottling = function() {
        throttled === null || throttled === void 0 ? void 0 : throttled.unsubscribe();
        throttled = null;
        if (trailing) {
          send2();
          isComplete && subscriber.complete();
        }
      };
      var cleanupThrottling = function() {
        throttled = null;
        isComplete && subscriber.complete();
      };
      var startThrottle = function(value) {
        return throttled = innerFrom(durationSelector(value)).subscribe(createOperatorSubscriber(subscriber, endThrottling, cleanupThrottling));
      };
      var send2 = function() {
        if (hasValue) {
          hasValue = false;
          var value = sendValue;
          sendValue = null;
          subscriber.next(value);
          !isComplete && startThrottle(value);
        }
      };
      source.subscribe(createOperatorSubscriber(subscriber, function(value) {
        hasValue = true;
        sendValue = value;
        !(throttled && !throttled.closed) && (leading ? send2() : startThrottle(value));
      }, function() {
        isComplete = true;
        !(trailing && hasValue && throttled && !throttled.closed) && subscriber.complete();
      }));
    });
  }

  // node_modules/rxjs/dist/esm5/internal/operators/throttleTime.js
  function throttleTime(duration, scheduler, config4) {
    if (scheduler === void 0) {
      scheduler = asyncScheduler;
    }
    var duration$ = timer(duration, scheduler);
    return throttle(function() {
      return duration$;
    }, config4);
  }

  // node_modules/rxjs/dist/esm5/internal/operators/withLatestFrom.js
  function withLatestFrom() {
    var inputs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      inputs[_i] = arguments[_i];
    }
    var project = popResultSelector(inputs);
    return operate(function(source, subscriber) {
      var len = inputs.length;
      var otherValues = new Array(len);
      var hasValue = inputs.map(function() {
        return false;
      });
      var ready = false;
      var _loop_1 = function(i2) {
        innerFrom(inputs[i2]).subscribe(createOperatorSubscriber(subscriber, function(value) {
          otherValues[i2] = value;
          if (!ready && !hasValue[i2]) {
            hasValue[i2] = true;
            (ready = hasValue.every(identity)) && (hasValue = null);
          }
        }, noop));
      };
      for (var i = 0; i < len; i++) {
        _loop_1(i);
      }
      source.subscribe(createOperatorSubscriber(subscriber, function(value) {
        if (ready) {
          var values = __spreadArray([value], __read(otherValues));
          subscriber.next(project ? project.apply(void 0, __spreadArray([], __read(values))) : values);
        }
      }));
    });
  }

  // node_modules/rxjs/dist/esm5/internal/operators/zip.js
  function zip2() {
    var sources = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      sources[_i] = arguments[_i];
    }
    return operate(function(source, subscriber) {
      zip.apply(void 0, __spreadArray([source], __read(sources))).subscribe(subscriber);
    });
  }

  // node_modules/rxjs/dist/esm5/internal/operators/zipWith.js
  function zipWith() {
    var otherInputs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      otherInputs[_i] = arguments[_i];
    }
    return zip2.apply(void 0, __spreadArray([], __read(otherInputs)));
  }

  // src/templates/assets/javascripts/browser/document/index.ts
  function watchDocument() {
    const document$2 = new ReplaySubject(1);
    fromEvent(document, "DOMContentLoaded", { once: true }).subscribe(() => document$2.next(document));
    return document$2;
  }

  // src/templates/assets/javascripts/browser/element/_/index.ts
  function getElements(selector, node = document) {
    return Array.from(node.querySelectorAll(selector));
  }
  function getElement(selector, node = document) {
    const el = getOptionalElement(selector, node);
    if (typeof el === "undefined")
      throw new ReferenceError(
        `Missing element: expected "${selector}" to be present`
      );
    return el;
  }
  function getOptionalElement(selector, node = document) {
    return node.querySelector(selector) || void 0;
  }
  function getActiveElement() {
    var _a2, _b, _c, _d;
    return (_d = (_c = (_b = (_a2 = document.activeElement) == null ? void 0 : _a2.shadowRoot) == null ? void 0 : _b.activeElement) != null ? _c : document.activeElement) != null ? _d : void 0;
  }

  // src/templates/assets/javascripts/browser/element/focus/index.ts
  var observer$ = merge(
    fromEvent(document.body, "focusin"),
    fromEvent(document.body, "focusout")
  ).pipe(
    debounceTime(1),
    startWith(void 0),
    map(() => getActiveElement() || document.body),
    shareReplay(1)
  );
  function watchElementFocus(el) {
    return observer$.pipe(
      map((active) => el.contains(active)),
      distinctUntilChanged()
    );
  }

  // src/templates/assets/javascripts/browser/element/hover/index.ts
  function watchElementHover(el, timeout) {
    return defer(
      () => merge(
        fromEvent(el, "mouseenter").pipe(map(() => true)),
        fromEvent(el, "mouseleave").pipe(map(() => false))
      ).pipe(
        timeout ? debounce((active) => timer(+!active * timeout)) : identity,
        startWith(el.matches(":hover"))
      )
    );
  }

  // src/templates/assets/javascripts/utilities/h/index.ts
  function appendChild(el, child) {
    if (typeof child === "string" || typeof child === "number") {
      el.innerHTML += child.toString();
    } else if (child instanceof Node) {
      el.appendChild(child);
    } else if (Array.isArray(child)) {
      for (const node of child)
        appendChild(el, node);
    }
  }
  function h(tag, attributes, ...children) {
    const el = document.createElement(tag);
    if (attributes)
      for (const attr of Object.keys(attributes)) {
        if (typeof attributes[attr] === "undefined")
          continue;
        if (typeof attributes[attr] !== "boolean")
          el.setAttribute(attr, attributes[attr]);
        else
          el.setAttribute(attr, "");
      }
    for (const child of children)
      appendChild(el, child);
    return el;
  }

  // src/templates/assets/javascripts/utilities/round/index.ts
  function round(value) {
    if (value > 999) {
      const digits = +((value - 950) % 1e3 > 99);
      return `${((value + 1e-6) / 1e3).toFixed(digits)}k`;
    } else {
      return value.toString();
    }
  }

  // src/templates/assets/javascripts/browser/script/index.ts
  function watchScript(src) {
    const script2 = h("script", { src });
    return defer(() => {
      document.head.appendChild(script2);
      return merge(
        fromEvent(script2, "load"),
        fromEvent(script2, "error").pipe(
          switchMap(() => throwError(() => new ReferenceError(`Invalid script: ${src}`)))
        )
      ).pipe(
        map(() => void 0),
        finalize(() => document.head.removeChild(script2)),
        take(1)
      );
    });
  }

  // src/templates/assets/javascripts/browser/element/size/_/index.ts
  var entry$ = new Subject();
  var observer$2 = defer(() => typeof ResizeObserver === "undefined" ? watchScript("https://unpkg.com/resize-observer-polyfill") : of(void 0)).pipe(
    map(() => new ResizeObserver((entries) => entries.forEach((entry) => entry$.next(entry)))),
    switchMap((observer) => merge(NEVER, of(observer)).pipe(
      finalize(() => observer.disconnect())
    )),
    shareReplay(1)
  );
  function getElementSize(el) {
    return {
      width: el.offsetWidth,
      height: el.offsetHeight
    };
  }
  function watchElementSize(el) {
    let target = el;
    while (target.clientWidth === 0)
      if (target.parentElement)
        target = target.parentElement;
      else
        break;
    return observer$2.pipe(
      tap((observer) => observer.observe(target)),
      switchMap((observer) => entry$.pipe(
        filter((entry) => entry.target === target),
        finalize(() => observer.unobserve(target))
      )),
      map(() => getElementSize(el)),
      startWith(getElementSize(el))
    );
  }

  // src/templates/assets/javascripts/browser/element/size/content/index.ts
  function getElementContentSize(el) {
    return {
      width: el.scrollWidth,
      height: el.scrollHeight
    };
  }
  function getElementContainer(el) {
    let parent = el.parentElement;
    while (parent)
      if (el.scrollWidth <= parent.scrollWidth && el.scrollHeight <= parent.scrollHeight)
        parent = (el = parent).parentElement;
      else
        break;
    return parent ? el : void 0;
  }
  function getElementContainers(el) {
    const containers = [];
    let parent = el.parentElement;
    while (parent) {
      if (el.clientWidth > parent.clientWidth || el.clientHeight > parent.clientHeight)
        containers.push(parent);
      parent = (el = parent).parentElement;
    }
    if (containers.length === 0)
      containers.push(document.documentElement);
    return containers;
  }

  // src/templates/assets/javascripts/browser/element/offset/_/index.ts
  function getElementOffset(el) {
    return {
      x: el.offsetLeft,
      y: el.offsetTop
    };
  }
  function getElementOffsetAbsolute(el) {
    const rect = el.getBoundingClientRect();
    return {
      x: rect.x + window.scrollX,
      y: rect.y + window.scrollY
    };
  }
  function watchElementOffset(el) {
    return merge(
      fromEvent(window, "load"),
      fromEvent(window, "resize")
    ).pipe(
      auditTime(0, animationFrameScheduler),
      map(() => getElementOffset(el)),
      startWith(getElementOffset(el))
    );
  }

  // src/templates/assets/javascripts/browser/element/offset/content/index.ts
  function getElementContentOffset(el) {
    return {
      x: el.scrollLeft,
      y: el.scrollTop
    };
  }
  function watchElementContentOffset(el) {
    return merge(
      fromEvent(el, "scroll"),
      fromEvent(window, "scroll"),
      fromEvent(window, "resize")
    ).pipe(
      auditTime(0, animationFrameScheduler),
      map(() => getElementContentOffset(el)),
      startWith(getElementContentOffset(el))
    );
  }

  // src/templates/assets/javascripts/browser/element/visibility/index.ts
  var entry$2 = new Subject();
  var observer$3 = defer(() => of(
    new IntersectionObserver((entries) => {
      for (const entry of entries)
        entry$2.next(entry);
    }, {
      threshold: 0
    })
  )).pipe(
    switchMap(
      (observer) => merge(NEVER, of(observer)).pipe(
        finalize(() => observer.disconnect())
      )
    ),
    shareReplay(1)
  );
  function watchElementVisibility(el) {
    return observer$3.pipe(
      tap((observer) => observer.observe(el)),
      switchMap(
        (observer) => entry$2.pipe(
          filter(({ target }) => target === el),
          finalize(() => observer.unobserve(el)),
          map(({ isIntersecting }) => isIntersecting)
        )
      )
    );
  }
  function watchElementBoundary(el, threshold = 16) {
    return watchElementContentOffset(el).pipe(
      map(({ y }) => {
        const visible = getElementSize(el);
        const content = getElementContentSize(el);
        return y >= content.height - visible.height - threshold;
      }),
      distinctUntilChanged()
    );
  }

  // src/templates/assets/javascripts/browser/toggle/index.ts
  var toggles = {
    drawer: getElement("[data-md-toggle=drawer]"),
    search: getElement("[data-md-toggle=search]")
  };
  function getToggle(name) {
    return toggles[name].checked;
  }
  function setToggle(name, value) {
    if (toggles[name].checked !== value)
      toggles[name].click();
  }
  function watchToggle(name) {
    const el = toggles[name];
    return fromEvent(el, "change").pipe(
      map(() => el.checked),
      startWith(el.checked)
    );
  }

  // src/templates/assets/javascripts/browser/keyboard/index.ts
  function isSusceptibleToKeyboard(el, type) {
    switch (el.constructor) {
      /* Input elements */
      case HTMLInputElement:
        if (el.type === "radio")
          return /^Arrow/.test(type);
        else
          return true;
      /* Select element and textarea */
      case HTMLSelectElement:
      case HTMLTextAreaElement:
        return true;
      /* Everything else */
      default:
        return el.isContentEditable;
    }
  }
  function watchComposition() {
    return merge(
      fromEvent(window, "compositionstart").pipe(map(() => true)),
      fromEvent(window, "compositionend").pipe(map(() => false))
    ).pipe(
      startWith(false)
    );
  }
  function watchKeyboard() {
    const keyboard$2 = fromEvent(window, "keydown").pipe(
      filter((ev) => !(ev.metaKey || ev.ctrlKey)),
      map((ev) => ({
        mode: getToggle("search") ? "search" : "global",
        type: ev.key,
        claim() {
          ev.preventDefault();
          ev.stopPropagation();
        }
      })),
      filter(({ mode, type }) => {
        if (mode === "global") {
          const active = getActiveElement();
          if (typeof active !== "undefined")
            return !isSusceptibleToKeyboard(active, type);
        }
        return true;
      }),
      share()
    );
    return watchComposition().pipe(
      switchMap((active) => !active ? keyboard$2 : EMPTY)
    );
  }

  // src/templates/assets/javascripts/browser/location/_/index.ts
  function getLocation() {
    return new URL(location.href);
  }
  function setLocation(url, navigate = false) {
    if (feature("navigation.instant") && !navigate) {
      const el = h("a", { href: url.href });
      document.body.appendChild(el);
      el.click();
      el.remove();
    } else {
      location.href = url.href;
    }
  }
  function watchLocation() {
    return new Subject();
  }

  // src/templates/assets/javascripts/browser/location/hash/index.ts
  function getLocationHash() {
    return location.hash.slice(1);
  }
  function setLocationHash(hash) {
    const el = h("a", { href: hash });
    el.addEventListener("click", (ev) => ev.stopPropagation());
    el.click();
  }
  function watchLocationHash(location$2) {
    return merge(
      fromEvent(window, "hashchange"),
      location$2
    ).pipe(
      map(getLocationHash),
      startWith(getLocationHash()),
      filter((hash) => hash.length > 0),
      shareReplay(1)
    );
  }
  function watchLocationTarget(location$2) {
    return watchLocationHash(location$2).pipe(
      map((id) => getOptionalElement(`[id="${id}"]`)),
      filter((el) => typeof el !== "undefined")
    );
  }

  // src/templates/assets/javascripts/browser/media/index.ts
  function watchMedia(query) {
    const media = matchMedia(query);
    return fromEventPattern((next) => media.addListener(() => next(media.matches))).pipe(
      startWith(media.matches)
    );
  }
  function watchPrint() {
    const media = matchMedia("print");
    return merge(
      fromEvent(window, "beforeprint").pipe(map(() => true)),
      fromEvent(window, "afterprint").pipe(map(() => false))
    ).pipe(
      startWith(media.matches)
    );
  }
  function at(query$, factory) {
    return query$.pipe(
      switchMap((active) => active ? factory() : EMPTY)
    );
  }

  // src/templates/assets/javascripts/browser/request/index.ts
  function request(url, options) {
    return new Observable((observer) => {
      const req = new XMLHttpRequest();
      req.open("GET", `${url}`);
      req.responseType = "blob";
      req.addEventListener("load", () => {
        if (req.status >= 200 && req.status < 300) {
          observer.next(req.response);
          observer.complete();
        } else {
          observer.error(new Error(req.statusText));
        }
      });
      req.addEventListener("error", () => {
        observer.error(new Error("Network error"));
      });
      req.addEventListener("abort", () => {
        observer.complete();
      });
      if (typeof (options == null ? void 0 : options.progress$) !== "undefined") {
        req.addEventListener("progress", (event) => {
          var _a2;
          if (event.lengthComputable) {
            options.progress$.next(event.loaded / event.total * 100);
          } else {
            const length = (_a2 = req.getResponseHeader("Content-Length")) != null ? _a2 : 0;
            options.progress$.next(event.loaded / +length * 100);
          }
        });
        options.progress$.next(5);
      }
      req.send();
      return () => req.abort();
    });
  }
  function requestJSON(url, options) {
    return request(url, options).pipe(
      switchMap((res) => res.text()),
      map((body) => JSON.parse(body)),
      shareReplay(1)
    );
  }
  function requestHTML(url, options) {
    const dom = new DOMParser();
    return request(url, options).pipe(
      switchMap((res) => res.text()),
      map((res) => dom.parseFromString(res, "text/html")),
      shareReplay(1)
    );
  }
  function requestXML(url, options) {
    const dom = new DOMParser();
    return request(url, options).pipe(
      switchMap((res) => res.text()),
      map((res) => dom.parseFromString(res, "text/xml")),
      shareReplay(1)
    );
  }

  // src/templates/assets/javascripts/browser/viewport/offset/index.ts
  function getViewportOffset() {
    return {
      x: Math.max(0, scrollX),
      y: Math.max(0, scrollY)
    };
  }
  function watchViewportOffset() {
    return merge(
      fromEvent(window, "scroll", { passive: true }),
      fromEvent(window, "resize", { passive: true })
    ).pipe(
      map(getViewportOffset),
      startWith(getViewportOffset())
    );
  }

  // src/templates/assets/javascripts/browser/viewport/size/index.ts
  function getViewportSize() {
    return {
      width: innerWidth,
      height: innerHeight
    };
  }
  function watchViewportSize() {
    return fromEvent(window, "resize", { passive: true }).pipe(
      map(getViewportSize),
      startWith(getViewportSize())
    );
  }

  // src/templates/assets/javascripts/browser/viewport/_/index.ts
  function watchViewport() {
    return combineLatest([
      watchViewportOffset(),
      watchViewportSize()
    ]).pipe(
      map(([offset, size]) => ({ offset, size })),
      shareReplay(1)
    );
  }

  // src/templates/assets/javascripts/browser/viewport/at/index.ts
  function watchViewportAt(el, { viewport$: viewport$3, header$: header$2 }) {
    const size$ = viewport$3.pipe(
      distinctUntilKeyChanged("size")
    );
    const offset$ = combineLatest([size$, header$2]).pipe(
      map(() => getElementOffset(el))
    );
    return combineLatest([header$2, viewport$3, offset$]).pipe(
      map(([{ height }, { offset, size }, { x, y }]) => ({
        offset: {
          x: offset.x - x,
          y: offset.y - y + height
        },
        size
      }))
    );
  }

  // src/templates/assets/javascripts/browser/worker/index.ts
  function recv(worker) {
    return fromEvent(worker, "message", (ev) => ev.data);
  }
  function send(worker) {
    const send$ = new Subject();
    send$.subscribe((data) => worker.postMessage(data));
    return send$;
  }
  function watchWorker(url, worker = new Worker(url)) {
    const recv$ = recv(worker);
    const send$ = send(worker);
    const worker$ = new Subject();
    worker$.subscribe(send$);
    const done$ = send$.pipe(ignoreElements(), endWith(true));
    return worker$.pipe(
      ignoreElements(),
      mergeWith(recv$.pipe(takeUntil(done$))),
      share()
    );
  }

  // src/templates/assets/javascripts/_/index.ts
  var script = getElement("#__config");
  var config2 = JSON.parse(script.textContent);
  config2.base = `${new URL(config2.base, getLocation())}`;
  function configuration() {
    return config2;
  }
  function feature(flag) {
    return config2.features.includes(flag);
  }
  function translation(key, value) {
    return typeof value !== "undefined" ? config2.translations[key].replace("#", value.toString()) : config2.translations[key];
  }

  // src/templates/assets/javascripts/components/_/index.ts
  function getComponentElement(type, node = document) {
    return getElement(`[data-md-component=${type}]`, node);
  }
  function getComponentElements(type, node = document) {
    return getElements(`[data-md-component=${type}]`, node);
  }

  // src/templates/assets/javascripts/components/announce/index.ts
  function watchAnnounce(el) {
    const button = getElement(".md-typeset > :first-child", el);
    return fromEvent(button, "click", { once: true }).pipe(
      map(() => getElement(".md-typeset", el)),
      map((content) => ({ hash: __md_hash(content.innerHTML) }))
    );
  }
  function mountAnnounce(el) {
    if (!feature("announce.dismiss") || !el.childElementCount)
      return EMPTY;
    if (!el.hidden) {
      const content = getElement(".md-typeset", el);
      if (__md_hash(content.innerHTML) === __md_get("__announce"))
        el.hidden = true;
    }
    return defer(() => {
      const push$ = new Subject();
      push$.subscribe(({ hash }) => {
        el.hidden = true;
        __md_set("__announce", hash);
      });
      return watchAnnounce(el).pipe(
        tap((state) => push$.next(state)),
        finalize(() => push$.complete()),
        map((state) => __spreadValues({ ref: el }, state))
      );
    });
  }

  // src/templates/assets/javascripts/components/consent/index.ts
  function watchConsent(el, { target$: target$2 }) {
    return target$2.pipe(
      map((target) => ({ hidden: target !== el }))
    );
  }
  function mountConsent(el, options) {
    const internal$ = new Subject();
    internal$.subscribe(({ hidden }) => {
      el.hidden = hidden;
    });
    return watchConsent(el, options).pipe(
      tap((state) => internal$.next(state)),
      finalize(() => internal$.complete()),
      map((state) => __spreadValues({ ref: el }, state))
    );
  }

  // src/templates/assets/javascripts/templates/tooltip/index.tsx
  function renderTooltip(id, style) {
    if (style === "inline") {
      return /* @__PURE__ */ h("div", { class: "md-tooltip md-tooltip--inline", id, role: "tooltip" }, /* @__PURE__ */ h("div", { class: "md-tooltip__inner md-typeset" }));
    } else {
      return /* @__PURE__ */ h("div", { class: "md-tooltip", id, role: "tooltip" }, /* @__PURE__ */ h("div", { class: "md-tooltip__inner md-typeset" }));
    }
  }
  function renderTooltip2(...children) {
    return /* @__PURE__ */ h("div", { class: "md-tooltip2", role: "dialog" }, /* @__PURE__ */ h("div", { class: "md-tooltip2__inner md-typeset" }, children));
  }
  function renderInlineTooltip2(...children) {
    return /* @__PURE__ */ h("div", { class: "md-tooltip2", role: "tooltip" }, /* @__PURE__ */ h("div", { class: "md-tooltip2__inner md-typeset" }, children));
  }

  // src/templates/assets/javascripts/templates/annotation/index.tsx
  function renderAnnotation(id, prefix) {
    prefix = prefix ? `${prefix}_annotation_${id}` : void 0;
    if (prefix) {
      const anchor = prefix ? `#${prefix}` : void 0;
      return /* @__PURE__ */ h("aside", { class: "md-annotation", tabIndex: 0 }, renderTooltip(prefix), /* @__PURE__ */ h("a", { href: anchor, class: "md-annotation__index", tabIndex: -1 }, /* @__PURE__ */ h("span", { "data-md-annotation-id": id })));
    } else {
      return /* @__PURE__ */ h("aside", { class: "md-annotation", tabIndex: 0 }, renderTooltip(prefix), /* @__PURE__ */ h("span", { class: "md-annotation__index", tabIndex: -1 }, /* @__PURE__ */ h("span", { "data-md-annotation-id": id })));
    }
  }

  // src/templates/assets/javascripts/templates/clipboard/index.tsx
  function renderClipboardButton(id) {
    return /* @__PURE__ */ h(
      "button",
      {
        class: "md-code__button",
        title: translation("clipboard.copy"),
        "data-clipboard-target": `#${id} > code`,
        "data-md-type": "copy"
      }
    );
  }
  function renderSelectionButton() {
    return /* @__PURE__ */ h(
      "button",
      {
        class: "md-code__button",
        title: "Toggle line selection",
        "data-md-type": "select"
      }
    );
  }
  function renderCodeBlockNavigation() {
    return /* @__PURE__ */ h("nav", { class: "md-code__nav" });
  }

  // src/templates/assets/javascripts/templates/search/index.tsx
  var import_escape_html = __toESM(require_escape_html());
  function renderSearchDocument(document2, flag) {
    const parent = flag & 2 /* PARENT */;
    const teaser = flag & 1 /* TEASER */;
    const missing = Object.keys(document2.terms).filter((key) => !document2.terms[key]).reduce((list, key) => [
      ...list,
      /* @__PURE__ */ h("del", null, (0, import_escape_html.default)(key)),
      " "
    ], []).slice(0, -1);
    const config4 = configuration();
    const url = new URL(document2.location, config4.base);
    if (feature("search.highlight"))
      url.searchParams.set(
        "h",
        Object.entries(document2.terms).filter(([, match]) => match).reduce((highlight2, [value]) => `${highlight2} ${value}`.trim(), "")
      );
    const { tags } = configuration();
    return /* @__PURE__ */ h("a", { href: `${url}`, class: "md-search-result__link", tabIndex: -1 }, /* @__PURE__ */ h(
      "article",
      {
        class: "md-search-result__article md-typeset",
        "data-md-score": document2.score.toFixed(2)
      },
      parent > 0 && /* @__PURE__ */ h("div", { class: "md-search-result__icon md-icon" }),
      parent > 0 && /* @__PURE__ */ h("h1", null, document2.title),
      parent <= 0 && /* @__PURE__ */ h("h2", null, document2.title),
      teaser > 0 && document2.text.length > 0 && document2.text,
      document2.tags && /* @__PURE__ */ h("nav", { class: "md-tags" }, document2.tags.map((tag) => {
        const type = tags ? tag in tags ? `md-tag-icon md-tag--${tags[tag]}` : "md-tag-icon" : "";
        return /* @__PURE__ */ h("span", { class: `md-tag ${type}` }, tag);
      })),
      teaser > 0 && missing.length > 0 && /* @__PURE__ */ h("p", { class: "md-search-result__terms" }, translation("search.result.term.missing"), ": ", ...missing)
    ));
  }
  function renderSearchResultItem(result) {
    const threshold = result[0].score;
    const docs = [...result];
    const config4 = configuration();
    const parent = docs.findIndex((doc) => {
      const l = `${new URL(doc.location, config4.base)}`;
      return !l.includes("#");
    });
    const [article] = docs.splice(parent, 1);
    let index = docs.findIndex((doc) => doc.score < threshold);
    if (index === -1)
      index = docs.length;
    const best = docs.slice(0, index);
    const more = docs.slice(index);
    const children = [
      renderSearchDocument(article, 2 /* PARENT */ | +(!parent && index === 0)),
      ...best.map((section) => renderSearchDocument(section, 1 /* TEASER */)),
      ...more.length ? [
        /* @__PURE__ */ h("details", { class: "md-search-result__more" }, /* @__PURE__ */ h("summary", { tabIndex: -1 }, /* @__PURE__ */ h("div", null, more.length > 0 && more.length === 1 ? translation("search.result.more.one") : translation("search.result.more.other", more.length))), ...more.map((section) => renderSearchDocument(section, 1 /* TEASER */)))
      ] : []
    ];
    return /* @__PURE__ */ h("li", { class: "md-search-result__item" }, children);
  }

  // src/templates/assets/javascripts/templates/source/index.tsx
  function renderSourceFacts(facts) {
    return /* @__PURE__ */ h("ul", { class: "md-source__facts" }, Object.entries(facts).map(([key, value]) => /* @__PURE__ */ h("li", { class: `md-source__fact md-source__fact--${key}` }, typeof value === "number" ? round(value) : value)));
  }

  // src/templates/assets/javascripts/templates/tabbed/index.tsx
  function renderTabbedControl(type) {
    const classes = `tabbed-control tabbed-control--${type}`;
    return /* @__PURE__ */ h("div", { class: classes, hidden: true }, /* @__PURE__ */ h("button", { class: "tabbed-button", tabIndex: -1, "aria-hidden": "true" }));
  }

  // src/templates/assets/javascripts/templates/table/index.tsx
  function renderTable(table) {
    return /* @__PURE__ */ h("div", { class: "md-typeset__scrollwrap" }, /* @__PURE__ */ h("div", { class: "md-typeset__table" }, table));
  }

  // src/templates/assets/javascripts/templates/version/index.tsx
  function renderVersion(version) {
    var _a2;
    const config4 = configuration();
    const url = new URL(`../${version.version}/`, config4.base);
    return /* @__PURE__ */ h("li", { class: "md-version__item" }, /* @__PURE__ */ h("a", { href: `${url}`, class: "md-version__link" }, version.title, ((_a2 = config4.version) == null ? void 0 : _a2.alias) && version.aliases.length > 0 && /* @__PURE__ */ h("span", { class: "md-version__alias" }, version.aliases[0])));
  }
  function renderVersionSelector(versions, active) {
    var _a2;
    const config4 = configuration();
    versions = versions.filter((version) => {
      var _a3;
      return !((_a3 = version.properties) == null ? void 0 : _a3.hidden);
    });
    return /* @__PURE__ */ h("div", { class: "md-version" }, /* @__PURE__ */ h(
      "button",
      {
        class: "md-version__current",
        "aria-label": translation("select.version")
      },
      active.title,
      ((_a2 = config4.version) == null ? void 0 : _a2.alias) && active.aliases.length > 0 && /* @__PURE__ */ h("span", { class: "md-version__alias" }, active.aliases[0])
    ), /* @__PURE__ */ h("ul", { class: "md-version__list" }, versions.map(renderVersion)));
  }

  // src/templates/assets/javascripts/components/tooltip2/index.ts
  var sequence = 0;
  function watchTooltip2(el, timeout = 250) {
    const active$ = combineLatest([
      watchElementFocus(el),
      watchElementHover(el, timeout)
    ]).pipe(
      map(([focus, hover]) => focus || hover),
      distinctUntilChanged()
    );
    const offset$ = defer(() => getElementContainers(el)).pipe(
      mergeMap(watchElementContentOffset),
      throttleTime(1),
      // Note that we need to poll the value again if the active state changes,
      // as otherwise the tooltip might be misplaced. This particularly happens
      // when using third-party integrations like tablesort that change the
      // position of elements – see https://t.ly/Y-V7X
      combineLatestWith(active$),
      map(() => getElementOffsetAbsolute(el))
    );
    return active$.pipe(
      first((active) => active),
      switchMap(() => combineLatest([active$, offset$])),
      map(([active, offset]) => ({ active, offset })),
      share()
    );
  }
  function mountTooltip2(el, dependencies, timeout = 250) {
    const { content$: content$2, viewport$: viewport$3 } = dependencies;
    const id = `__tooltip2_${sequence++}`;
    return defer(() => {
      const push$ = new Subject();
      const show$ = new BehaviorSubject(false);
      push$.pipe(ignoreElements(), endWith(false)).subscribe(show$);
      const node$ = show$.pipe(
        debounce((active) => timer(+!active * 250, queueScheduler)),
        distinctUntilChanged(),
        switchMap((active) => active ? content$2 : EMPTY),
        tap((node) => node.id = id),
        share()
      );
      combineLatest([
        push$.pipe(map(({ active }) => active)),
        node$.pipe(
          switchMap((node) => watchElementHover(node, 250)),
          startWith(false)
        )
      ]).pipe(map((states) => states.some((active) => active))).subscribe(show$);
      const origin$ = show$.pipe(
        filter((active) => active),
        withLatestFrom(node$, viewport$3),
        map(([_, node, { size }]) => {
          const host = el.getBoundingClientRect();
          const x = host.width / 2;
          if (node.role === "tooltip") {
            return { x, y: 8 + host.height };
          } else if (host.y >= size.height / 2) {
            const { height } = getElementSize(node);
            return { x, y: -16 - height };
          } else {
            return { x, y: 16 + host.height };
          }
        })
      );
      combineLatest([node$, push$, origin$]).subscribe(([node, { offset }, origin]) => {
        node.style.setProperty("--md-tooltip-host-x", `${offset.x}px`);
        node.style.setProperty("--md-tooltip-host-y", `${offset.y}px`);
        node.style.setProperty("--md-tooltip-x", `${origin.x}px`);
        node.style.setProperty("--md-tooltip-y", `${origin.y}px`);
        node.classList.toggle("md-tooltip2--top", origin.y < 0);
        node.classList.toggle("md-tooltip2--bottom", origin.y >= 0);
      });
      show$.pipe(
        filter((active) => active),
        withLatestFrom(node$, (_, node) => node),
        filter((node) => node.role === "tooltip")
      ).subscribe((node) => {
        const size = getElementSize(getElement(":scope > *", node));
        node.style.setProperty("--md-tooltip-width", `${size.width}px`);
        node.style.setProperty("--md-tooltip-tail", `${0}px`);
      });
      show$.pipe(
        distinctUntilChanged(),
        observeOn(animationFrameScheduler),
        withLatestFrom(node$)
      ).subscribe(([active, node]) => {
        node.classList.toggle("md-tooltip2--active", active);
      });
      combineLatest([
        show$.pipe(filter((active) => active)),
        node$
      ]).subscribe(([_, node]) => {
        if (node.role === "dialog") {
          el.setAttribute("aria-controls", id);
          el.setAttribute("aria-haspopup", "dialog");
        } else {
          el.setAttribute("aria-describedby", id);
        }
      });
      show$.pipe(filter((active) => !active)).subscribe(() => {
        el.removeAttribute("aria-controls");
        el.removeAttribute("aria-describedby");
        el.removeAttribute("aria-haspopup");
      });
      return watchTooltip2(el, timeout).pipe(
        tap((state) => push$.next(state)),
        finalize(() => push$.complete()),
        map((state) => __spreadValues({ ref: el }, state))
      );
    });
  }
  function mountInlineTooltip2(el, { viewport$: viewport$3 }, container = document.body) {
    return mountTooltip2(el, {
      content$: new Observable((observer) => {
        const title = el.title;
        const node = renderInlineTooltip2(title);
        observer.next(node);
        el.removeAttribute("title");
        container.append(node);
        return () => {
          node.remove();
          el.setAttribute("title", title);
        };
      }),
      viewport$: viewport$3
    }, 0);
  }

  // src/templates/assets/javascripts/components/content/annotation/_/index.ts
  function watchAnnotation(el, container) {
    const offset$ = defer(() => combineLatest([
      watchElementOffset(el),
      watchElementContentOffset(container)
    ])).pipe(
      map(([{ x, y }, scroll]) => {
        const { width, height } = getElementSize(el);
        return {
          x: x - scroll.x + width / 2,
          y: y - scroll.y + height / 2
        };
      })
    );
    return watchElementFocus(el).pipe(
      switchMap(
        (active) => offset$.pipe(
          map((offset) => ({ active, offset })),
          take(+!active || Infinity)
        )
      )
    );
  }
  function mountAnnotation(el, container, { target$: target$2 }) {
    const [tooltip, index] = Array.from(el.children);
    return defer(() => {
      const push$ = new Subject();
      const done$ = push$.pipe(ignoreElements(), endWith(true));
      push$.subscribe({
        /* Handle emission */
        next({ offset }) {
          el.style.setProperty("--md-tooltip-x", `${offset.x}px`);
          el.style.setProperty("--md-tooltip-y", `${offset.y}px`);
        },
        /* Handle complete */
        complete() {
          el.style.removeProperty("--md-tooltip-x");
          el.style.removeProperty("--md-tooltip-y");
        }
      });
      watchElementVisibility(el).pipe(
        takeUntil(done$)
      ).subscribe((visible) => {
        el.toggleAttribute("data-md-visible", visible);
      });
      merge(
        push$.pipe(filter(({ active }) => active)),
        push$.pipe(debounceTime(250), filter(({ active }) => !active))
      ).subscribe({
        /* Handle emission */
        next({ active }) {
          if (active)
            el.prepend(tooltip);
          else
            tooltip.remove();
        },
        /* Handle complete */
        complete() {
          el.prepend(tooltip);
        }
      });
      push$.pipe(
        auditTime(16, animationFrameScheduler)
      ).subscribe(({ active }) => {
        tooltip.classList.toggle("md-tooltip--active", active);
      });
      push$.pipe(
        throttleTime(125, animationFrameScheduler),
        filter(() => !!el.offsetParent),
        map(() => el.offsetParent.getBoundingClientRect()),
        map(({ x }) => x)
      ).subscribe({
        /* Handle emission */
        next(origin) {
          if (origin)
            el.style.setProperty("--md-tooltip-0", `${-origin}px`);
          else
            el.style.removeProperty("--md-tooltip-0");
        },
        /* Handle complete */
        complete() {
          el.style.removeProperty("--md-tooltip-0");
        }
      });
      fromEvent(index, "click").pipe(
        takeUntil(done$),
        filter((ev) => !(ev.metaKey || ev.ctrlKey))
      ).subscribe((ev) => {
        ev.stopPropagation();
        ev.preventDefault();
      });
      fromEvent(index, "mousedown").pipe(
        takeUntil(done$),
        withLatestFrom(push$)
      ).subscribe(([ev, { active }]) => {
        var _a2;
        if (ev.button !== 0 || ev.metaKey || ev.ctrlKey) {
          ev.preventDefault();
        } else if (active) {
          ev.preventDefault();
          const parent = el.parentElement.closest(".md-annotation");
          if (parent instanceof HTMLElement)
            parent.focus();
          else
            (_a2 = getActiveElement()) == null ? void 0 : _a2.blur();
        }
      });
      target$2.pipe(
        takeUntil(done$),
        filter((target) => target === tooltip),
        delay(125)
      ).subscribe(() => el.focus());
      return watchAnnotation(el, container).pipe(
        tap((state) => push$.next(state)),
        finalize(() => push$.complete()),
        map((state) => __spreadValues({ ref: el }, state))
      );
    });
  }

  // src/templates/assets/javascripts/components/content/annotation/list/index.ts
  function findHosts(container) {
    const config4 = configuration();
    if (container.tagName !== "CODE")
      return [container];
    const selectors = [".c", ".c1", ".cm"];
    if (config4.annotate && typeof config4.annotate === "object") {
      const host = container.closest("[class|=language]");
      if (host) {
        for (const value of Array.from(host.classList)) {
          if (!value.startsWith("language-"))
            continue;
          const [, language] = value.split("-");
          if (language in config4.annotate)
            selectors.push(...config4.annotate[language]);
        }
      }
    }
    return getElements(selectors.join(", "), container);
  }
  function findMarkers(container) {
    const markers = [];
    for (const el of findHosts(container)) {
      const nodes = [];
      const it = document.createNodeIterator(el, NodeFilter.SHOW_TEXT);
      for (let node = it.nextNode(); node; node = it.nextNode())
        nodes.push(node);
      for (let text of nodes) {
        let match;
        while (match = /(\(\d+\))(!)?/.exec(text.textContent)) {
          const [, id, force] = match;
          if (typeof force === "undefined") {
            const marker = text.splitText(match.index);
            text = marker.splitText(id.length);
            markers.push(marker);
          } else {
            text.textContent = id;
            markers.push(text);
            break;
          }
        }
      }
    }
    return markers;
  }
  function swap(source, target) {
    target.append(...Array.from(source.childNodes));
  }
  function mountAnnotationList(el, container, { target$: target$2, print$: print$2 }) {
    const parent = container.closest("[id]");
    const prefix = parent == null ? void 0 : parent.id;
    const annotations = /* @__PURE__ */ new Map();
    for (const marker of findMarkers(container)) {
      const [, id] = marker.textContent.match(/\((\d+)\)/);
      if (getOptionalElement(`:scope > li:nth-child(${id})`, el)) {
        annotations.set(id, renderAnnotation(id, prefix));
        marker.replaceWith(annotations.get(id));
      }
    }
    if (annotations.size === 0)
      return EMPTY;
    return defer(() => {
      const push$ = new Subject();
      const done$ = push$.pipe(ignoreElements(), endWith(true));
      const pairs = [];
      for (const [id, annotation] of annotations)
        pairs.push([
          getElement(".md-typeset", annotation),
          getElement(`:scope > li:nth-child(${id})`, el)
        ]);
      print$2.pipe(takeUntil(done$)).subscribe((active) => {
        el.hidden = !active;
        el.classList.toggle("md-annotation-list", active);
        for (const [inner, child] of pairs)
          if (!active)
            swap(child, inner);
          else
            swap(inner, child);
      });
      return merge(
        ...[...annotations].map(([, annotation]) => mountAnnotation(annotation, container, { target$: target$2 }))
      ).pipe(
        finalize(() => push$.complete()),
        share()
      );
    });
  }

  // src/templates/assets/javascripts/components/content/annotation/block/index.ts
  function findList(el) {
    if (el.nextElementSibling) {
      const sibling = el.nextElementSibling;
      if (sibling.tagName === "OL")
        return sibling;
      else if (sibling.tagName === "P" && !sibling.children.length)
        return findList(sibling);
    }
    return void 0;
  }
  function mountAnnotationBlock(el, options) {
    return defer(() => {
      const list = findList(el);
      return typeof list !== "undefined" ? mountAnnotationList(list, el, options) : EMPTY;
    });
  }

  // src/templates/assets/javascripts/components/content/code/_/index.ts
  var import_clipboard = __toESM(require_clipboard());
  var sequence2 = 0;
  var shift$ = merge(
    fromEvent(window, "keydown").pipe(map(() => true)),
    merge(
      fromEvent(window, "keyup"),
      fromEvent(window, "contextmenu")
    ).pipe(map(() => false))
  ).pipe(
    startWith(false),
    shareReplay(1)
  );
  function findList2(el) {
    if (el.nextElementSibling) {
      const sibling = el.nextElementSibling;
      if (sibling.tagName === "OL")
        return sibling;
      else if (sibling.tagName === "P" && !sibling.children.length)
        return findList2(sibling);
    }
    return void 0;
  }
  function watchCodeBlock(el) {
    return watchElementSize(el).pipe(
      map(({ width }) => {
        const content = getElementContentSize(el);
        return {
          scrollable: content.width > width
        };
      }),
      distinctUntilKeyChanged("scrollable")
    );
  }
  function mountCodeBlock(el, options) {
    const { matches: hover } = matchMedia("(hover)");
    const factory$ = defer(() => {
      const push$ = new Subject();
      const done$ = push$.pipe(takeLast(1));
      push$.subscribe(({ scrollable }) => {
        if (scrollable && hover)
          el.setAttribute("tabindex", "0");
        else
          el.removeAttribute("tabindex");
      });
      const buttons = [];
      const parent = el.closest("pre");
      const unique = parent.closest("[id]");
      const id = unique ? unique.id : sequence2++;
      parent.id = `__code_${id}`;
      const content$2 = [];
      const container = el.closest(".highlight");
      if (container instanceof HTMLElement) {
        const list = findList2(container);
        if (typeof list !== "undefined" && (container.classList.contains("annotate") || feature("content.code.annotate"))) {
          const annotations$ = mountAnnotationList(list, el, options);
          content$2.push(
            watchElementSize(container).pipe(
              takeUntil(done$),
              map(({ width, height }) => width && height),
              distinctUntilChanged(),
              switchMap((active) => active ? annotations$ : EMPTY)
            )
          );
        }
      }
      const spans = getElements(":scope > span[id]", el);
      if (spans.length) {
        el.classList.add("md-code__content");
        if (el.closest(".select") || feature("content.code.select") && !el.closest(".no-select")) {
          const base = +spans[0].id.split("-").pop();
          const button = renderSelectionButton();
          buttons.push(button);
          if (feature("content.tooltips"))
            content$2.push(mountInlineTooltip2(button, { viewport$ }));
          const select$ = fromEvent(button, "click").pipe(
            scan((active) => !active, false),
            tap(() => button.blur()),
            share()
          );
          select$.subscribe((active) => {
            button.classList.toggle("md-code__button--active", active);
          });
          const hover$ = from(spans).pipe(
            mergeMap(
              (span) => watchElementHover(span).pipe(
                map((active) => [span, active])
              )
            )
          );
          select$.pipe(
            switchMap((active) => active ? hover$ : EMPTY)
          ).subscribe(([span, active]) => {
            const highlight2 = getOptionalElement(".hll.select", span);
            if (highlight2 && !active) {
              highlight2.replaceWith(...Array.from(highlight2.childNodes));
            } else if (!highlight2 && active) {
              const hll = document.createElement("span");
              hll.className = "hll select";
              hll.append(...Array.from(span.childNodes).slice(1));
              span.append(hll);
            }
          });
          const click$ = from(spans).pipe(
            mergeMap(
              (span) => fromEvent(span, "mousedown").pipe(
                tap((ev) => ev.preventDefault()),
                map(() => span)
              )
            )
          );
          const range$ = select$.pipe(
            switchMap((active) => active ? click$ : EMPTY),
            withLatestFrom(shift$),
            map(([span, shift]) => {
              var _a2;
              const active = spans.indexOf(span) + base;
              if (shift === false) {
                return [active, active];
              } else {
                const range = getElements(".hll", el).map((line) => spans.indexOf(line.parentElement) + base);
                (_a2 = window.getSelection()) == null ? void 0 : _a2.removeAllRanges();
                return [
                  Math.min(active, ...range),
                  Math.max(active, ...range)
                ];
              }
            })
          );
          const hash$ = watchLocationHash(EMPTY).pipe(
            // @todo: make more resilient
            filter((hash) => hash.startsWith(`__codelineno-${id}-`))
          );
          hash$.subscribe((hash) => {
            const [, , line] = hash.split("-");
            const range = line.split(":").map((value) => +value - base + 1);
            if (range.length === 1)
              range.push(range[0]);
            for (const span of getElements(".hll:not(.select)", el)) {
              span.replaceWith(...Array.from(span.childNodes));
            }
            const selection = spans.slice(range[0] - 1, range[1]);
            for (const span of selection) {
              const hll = document.createElement("span");
              hll.className = "hll";
              hll.append(...Array.from(span.childNodes).slice(1));
              span.append(hll);
            }
          });
          hash$.pipe(take(1), observeOn(asyncScheduler)).subscribe((hash) => {
            if (hash.includes(":")) {
              const anchor = document.getElementById(hash.split(":")[0]);
              if (anchor) {
                setTimeout(() => {
                  let tmp = anchor;
                  let top = -(48 + 16);
                  while (tmp !== document.body) {
                    top += tmp.offsetTop;
                    tmp = tmp.offsetParent;
                  }
                  window.scrollTo({ top });
                }, 1);
              }
            }
          });
          const jump$ = from(
            getElements('a[href^="#__codelineno"]', container)
          ).pipe(
            mergeMap(
              (anchor) => fromEvent(anchor, "click").pipe(
                tap((ev) => ev.preventDefault()),
                map(() => anchor)
              )
            )
          );
          const next$ = jump$.pipe(
            takeUntil(done$),
            withLatestFrom(shift$),
            map(([anchor, shift]) => {
              const target = getElement(`[id="${anchor.hash.slice(1)}"]`);
              const active = +target.parentElement.id.split("-").pop();
              if (shift === false) {
                return [active, active];
              } else {
                const range = getElements(".hll", el).map((line) => +line.parentElement.id.split("-").pop());
                return [
                  Math.min(active, ...range),
                  Math.max(active, ...range)
                ];
              }
            })
          );
          merge(range$, next$).subscribe((range) => {
            let hash = `#__codelineno-${id}-`;
            if (range[0] === range[1]) {
              hash += range[0];
            } else {
              hash += `${range[0]}:${range[1]}`;
            }
            history.replaceState({}, "", hash);
            window.dispatchEvent(new HashChangeEvent("hashchange", {
              newURL: window.location.origin + window.location.pathname + hash,
              oldURL: window.location.href
            }));
          });
        }
      }
      if (import_clipboard.default.isSupported()) {
        if (el.closest(".copy") || feature("content.code.copy") && !el.closest(".no-copy")) {
          const button = renderClipboardButton(parent.id);
          buttons.push(button);
          if (feature("content.tooltips"))
            content$2.push(mountInlineTooltip2(button, { viewport$ }));
        }
      }
      if (buttons.length) {
        const nav = renderCodeBlockNavigation();
        nav.append(...buttons);
        parent.insertBefore(nav, el);
      }
      return watchCodeBlock(el).pipe(
        tap((state) => push$.next(state)),
        finalize(() => push$.complete()),
        map((state) => __spreadValues({ ref: el }, state)),
        mergeWith(merge(...content$2).pipe(
          takeUntil(done$)
        ))
      );
    });
    if (feature("content.lazy"))
      return watchElementVisibility(el).pipe(
        filter((visible) => visible),
        take(1),
        switchMap(() => factory$)
      );
    return factory$;
  }

  // src/templates/assets/javascripts/components/content/details/index.ts
  function watchDetails(el, { target$: target$2, print$: print$2 }) {
    let open = true;
    return merge(
      /* Open and focus details on location target */
      target$2.pipe(
        map((target) => target.closest("details:not([open])")),
        filter((details) => el === details),
        map(() => ({
          action: "open",
          reveal: true
        }))
      ),
      /* Open details on print and close afterwards */
      print$2.pipe(
        filter((active) => active || !open),
        tap(() => open = el.open),
        map((active) => ({
          action: active ? "open" : "close"
        }))
      )
    );
  }
  function mountDetails(el, options) {
    return defer(() => {
      const push$ = new Subject();
      push$.subscribe(({ action, reveal }) => {
        el.toggleAttribute("open", action === "open");
        if (reveal)
          el.scrollIntoView();
      });
      return watchDetails(el, options).pipe(
        tap((state) => push$.next(state)),
        finalize(() => push$.complete()),
        map((state) => __spreadValues({ ref: el }, state))
      );
    });
  }

  // src/templates/assets/javascripts/components/content/link/index.ts
  var sequence3 = 0;
  function extract(headline) {
    const newHeading = document.createElement("h3");
    newHeading.innerHTML = headline.innerHTML;
    const els = [newHeading];
    let nextElement = headline.nextElementSibling;
    while (nextElement && !(nextElement instanceof HTMLHeadingElement)) {
      els.push(nextElement);
      nextElement = nextElement.nextElementSibling;
    }
    return els;
  }
  function resolve(document2, base) {
    for (const el of getElements("[href], [src]", document2))
      for (const key of ["href", "src"]) {
        const value = el.getAttribute(key);
        if (value && !/^(?:[a-z]+:)?\/\//i.test(value)) {
          el[key] = new URL(el.getAttribute(key), base).toString();
          break;
        }
      }
    for (const el of getElements("[name^=__], [for]", document2))
      for (const key of ["id", "for", "name"]) {
        const value = el.getAttribute(key);
        if (value) {
          el.setAttribute(key, `${value}$preview_${sequence3}`);
        }
      }
    sequence3++;
    return of(document2);
  }
  function mountLink(el, dependencies) {
    const { sitemap$: sitemap$2 } = dependencies;
    if (!(el instanceof HTMLAnchorElement))
      return EMPTY;
    if (!(feature("navigation.instant.preview") || el.hasAttribute("data-preview")))
      return EMPTY;
    el.removeAttribute("title");
    const active$ = combineLatest([
      watchElementFocus(el),
      watchElementHover(el)
    ]).pipe(
      map(([focus, hover]) => focus || hover),
      distinctUntilChanged(),
      filter((active) => active)
    );
    const elements$ = zip([sitemap$2, active$]).pipe(
      switchMap(([sitemap]) => {
        const url = new URL(el.href);
        url.search = url.hash = "";
        if (!sitemap.has(`${url}`))
          return EMPTY;
        return of(url);
      }),
      switchMap((url) => requestHTML(url).pipe(
        switchMap((doc) => resolve(doc, url))
      )),
      switchMap((doc) => {
        const selector = el.hash ? `article [id="${el.hash.slice(1)}"]` : "article h1";
        const target = getOptionalElement(selector, doc);
        if (typeof target === "undefined")
          return EMPTY;
        return of(extract(target));
      })
    );
    return elements$.pipe(
      switchMap((els) => {
        const content$2 = new Observable((observer) => {
          const node = renderTooltip2(...els);
          observer.next(node);
          document.body.append(node);
          return () => node.remove();
        });
        return mountTooltip2(el, __spreadValues({ content$: content$2 }, dependencies));
      })
    );
  }

  // src/templates/assets/javascripts/components/content/mermaid/index.css
  var mermaid_default = ".node circle,.node ellipse,.node path,.node polygon,.node rect{fill:var(--md-mermaid-node-bg-color);stroke:var(--md-mermaid-node-fg-color)}marker{fill:var(--md-mermaid-edge-color)!important}.edgeLabel .label rect{fill:#0000}.flowchartTitleText{fill:var(--md-mermaid-label-fg-color)}.label{color:var(--md-mermaid-label-fg-color);font-family:var(--md-mermaid-font-family)}.label foreignObject{line-height:normal;overflow:visible}.label div .edgeLabel{color:var(--md-mermaid-label-fg-color)}.edgeLabel,.edgeLabel p,.label div .edgeLabel{background-color:var(--md-mermaid-label-bg-color)}.edgeLabel,.edgeLabel p{fill:var(--md-mermaid-label-bg-color);color:var(--md-mermaid-edge-color)}.edgePath .path,.flowchart-link{stroke:var(--md-mermaid-edge-color)}.edgePath .arrowheadPath{fill:var(--md-mermaid-edge-color);stroke:none}.cluster rect{fill:var(--md-default-fg-color--lightest);stroke:var(--md-default-fg-color--lighter)}.cluster span{color:var(--md-mermaid-label-fg-color);font-family:var(--md-mermaid-font-family)}g #flowchart-circleEnd,g #flowchart-circleStart,g #flowchart-crossEnd,g #flowchart-crossStart,g #flowchart-pointEnd,g #flowchart-pointStart{stroke:none}.classDiagramTitleText{fill:var(--md-mermaid-label-fg-color)}g.classGroup line,g.classGroup rect{fill:var(--md-mermaid-node-bg-color);stroke:var(--md-mermaid-node-fg-color)}g.classGroup text{fill:var(--md-mermaid-label-fg-color);font-family:var(--md-mermaid-font-family)}.classLabel .box{fill:var(--md-mermaid-label-bg-color);background-color:var(--md-mermaid-label-bg-color);opacity:1}.classLabel .label{fill:var(--md-mermaid-label-fg-color);font-family:var(--md-mermaid-font-family)}.node .divider{stroke:var(--md-mermaid-node-fg-color)}.relation{stroke:var(--md-mermaid-edge-color)}.cardinality{fill:var(--md-mermaid-label-fg-color);font-family:var(--md-mermaid-font-family)}.cardinality text{fill:inherit!important}defs marker.marker.composition.class path,defs marker.marker.dependency.class path,defs marker.marker.extension.class path{fill:var(--md-mermaid-edge-color)!important;stroke:var(--md-mermaid-edge-color)!important}defs marker.marker.aggregation.class path{fill:var(--md-mermaid-label-bg-color)!important;stroke:var(--md-mermaid-edge-color)!important}.statediagramTitleText{fill:var(--md-mermaid-label-fg-color)}g.stateGroup rect{fill:var(--md-mermaid-node-bg-color);stroke:var(--md-mermaid-node-fg-color)}g.stateGroup .state-title{fill:var(--md-mermaid-label-fg-color)!important;font-family:var(--md-mermaid-font-family)}g.stateGroup .composit{fill:var(--md-mermaid-label-bg-color)}.nodeLabel,.nodeLabel p{color:var(--md-mermaid-label-fg-color);font-family:var(--md-mermaid-font-family)}a .nodeLabel{text-decoration:underline}.node circle.state-end,.node circle.state-start,.start-state{fill:var(--md-mermaid-edge-color);stroke:none}.end-state-inner,.end-state-outer{fill:var(--md-mermaid-edge-color)}.end-state-inner,.node circle.state-end{stroke:var(--md-mermaid-label-bg-color)}.transition{stroke:var(--md-mermaid-edge-color)}[id^=state-fork] rect,[id^=state-join] rect{fill:var(--md-mermaid-edge-color)!important;stroke:none!important}.statediagram-cluster.statediagram-cluster .inner{fill:var(--md-default-bg-color)}.statediagram-cluster rect{fill:var(--md-mermaid-node-bg-color);stroke:var(--md-mermaid-node-fg-color)}.statediagram-state rect.divider{fill:var(--md-default-fg-color--lightest);stroke:var(--md-default-fg-color--lighter)}defs #statediagram-barbEnd{stroke:var(--md-mermaid-edge-color)}[id^=entity] path,[id^=entity] rect{fill:var(--md-default-bg-color)}.relationshipLine{stroke:var(--md-mermaid-edge-color)}defs .marker.oneOrMore.er *,defs .marker.onlyOne.er *,defs .marker.zeroOrMore.er *,defs .marker.zeroOrOne.er *{stroke:var(--md-mermaid-edge-color)!important}text:not([class]):last-child{fill:var(--md-mermaid-label-fg-color)}.actor{fill:var(--md-mermaid-sequence-actor-bg-color);stroke:var(--md-mermaid-sequence-actor-border-color)}text.actor>tspan{fill:var(--md-mermaid-sequence-actor-fg-color);font-family:var(--md-mermaid-font-family)}line{stroke:var(--md-mermaid-sequence-actor-line-color)}.actor-man circle,.actor-man line{fill:var(--md-mermaid-sequence-actorman-bg-color);stroke:var(--md-mermaid-sequence-actorman-line-color)}.messageLine0,.messageLine1{stroke:var(--md-mermaid-sequence-message-line-color)}.note{fill:var(--md-mermaid-sequence-note-bg-color);stroke:var(--md-mermaid-sequence-note-border-color)}.loopText,.loopText>tspan,.messageText,.noteText>tspan{stroke:none;font-family:var(--md-mermaid-font-family)!important}.messageText{fill:var(--md-mermaid-sequence-message-fg-color)}.loopText,.loopText>tspan{fill:var(--md-mermaid-sequence-loop-fg-color)}.noteText>tspan{fill:var(--md-mermaid-sequence-note-fg-color)}#arrowhead path{fill:var(--md-mermaid-sequence-message-line-color);stroke:none}.loopLine{fill:var(--md-mermaid-sequence-loop-bg-color);stroke:var(--md-mermaid-sequence-loop-border-color)}.labelBox{fill:var(--md-mermaid-sequence-label-bg-color);stroke:none}.labelText,.labelText>span{fill:var(--md-mermaid-sequence-label-fg-color);font-family:var(--md-mermaid-font-family)}.sequenceNumber{fill:var(--md-mermaid-sequence-number-fg-color)}rect.rect{fill:var(--md-mermaid-sequence-box-bg-color);stroke:none}rect.rect+text.text{fill:var(--md-mermaid-sequence-box-fg-color)}defs #sequencenumber{fill:var(--md-mermaid-sequence-number-bg-color)!important}";

  // src/templates/assets/javascripts/components/content/mermaid/index.ts
  var mermaid$;
  var sequence4 = 0;
  function fetchScripts() {
    return typeof mermaid === "undefined" || mermaid instanceof Element ? watchScript("https://unpkg.com/mermaid@11/dist/mermaid.min.js") : of(void 0);
  }
  function mountMermaid(el) {
    el.classList.remove("mermaid");
    mermaid$ || (mermaid$ = fetchScripts().pipe(
      tap(() => mermaid.initialize({
        startOnLoad: false,
        themeCSS: mermaid_default,
        sequence: {
          actorFontSize: "16px",
          // Hack: mitigate https://bit.ly/3y0NEi3
          messageFontSize: "16px",
          noteFontSize: "16px"
        }
      })),
      map(() => void 0),
      shareReplay(1)
    ));
    mermaid$.subscribe(() => __async(null, null, function* () {
      el.classList.add("mermaid");
      const id = `__mermaid_${sequence4++}`;
      const host = h("div", { class: "mermaid" });
      const text = el.textContent;
      const { svg, fn } = yield mermaid.render(id, text);
      const shadow = host.attachShadow({ mode: "closed" });
      shadow.innerHTML = svg;
      el.replaceWith(host);
      fn == null ? void 0 : fn(shadow);
    }));
    return mermaid$.pipe(
      map(() => ({ ref: el }))
    );
  }

  // src/templates/assets/javascripts/components/content/table/index.ts
  var sentinel = h("table");
  function mountDataTable(el) {
    el.replaceWith(sentinel);
    sentinel.replaceWith(renderTable(el));
    return of({ ref: el });
  }

  // src/templates/assets/javascripts/components/content/tabs/index.ts
  function watchContentTabs(inputs) {
    const initial = inputs.find((input) => input.checked) || inputs[0];
    return merge(...inputs.map(
      (input) => fromEvent(input, "change").pipe(
        map(() => getElement(`label[for="${input.id}"]`))
      )
    )).pipe(
      startWith(getElement(`label[for="${initial.id}"]`)),
      map((active) => ({ active }))
    );
  }
  function mountContentTabs(el, { viewport$: viewport$3, target$: target$2 }) {
    const container = getElement(".tabbed-labels", el);
    const inputs = getElements(":scope > input", el);
    const prev = renderTabbedControl("prev");
    el.append(prev);
    const next = renderTabbedControl("next");
    el.append(next);
    return defer(() => {
      const push$ = new Subject();
      const done$ = push$.pipe(ignoreElements(), endWith(true));
      combineLatest([push$, watchElementSize(el), watchElementVisibility(el)]).pipe(
        takeUntil(done$),
        auditTime(1, animationFrameScheduler)
      ).subscribe({
        /* Handle emission */
        next([{ active }, size]) {
          const offset = getElementOffset(active);
          const { width } = getElementSize(active);
          el.style.setProperty("--md-indicator-x", `${offset.x}px`);
          el.style.setProperty("--md-indicator-width", `${width}px`);
          const content = getElementContentOffset(container);
          if (offset.x < content.x || offset.x + width > content.x + size.width)
            container.scrollTo({
              left: Math.max(0, offset.x - 16),
              behavior: "smooth"
            });
        },
        /* Handle complete */
        complete() {
          el.style.removeProperty("--md-indicator-x");
          el.style.removeProperty("--md-indicator-width");
        }
      });
      combineLatest([
        watchElementContentOffset(container),
        watchElementSize(container)
      ]).pipe(
        takeUntil(done$)
      ).subscribe(([offset, size]) => {
        const content = getElementContentSize(container);
        prev.hidden = offset.x < 16;
        next.hidden = offset.x > content.width - size.width - 16;
      });
      merge(
        fromEvent(prev, "click").pipe(map(() => -1)),
        fromEvent(next, "click").pipe(map(() => 1))
      ).pipe(
        takeUntil(done$)
      ).subscribe((direction) => {
        const { width } = getElementSize(container);
        container.scrollBy({
          left: width * direction,
          behavior: "smooth"
        });
      });
      target$2.pipe(
        takeUntil(done$),
        filter((input) => inputs.includes(input))
      ).subscribe((input) => input.click());
      container.classList.add("tabbed-labels--linked");
      for (const input of inputs) {
        const label = getElement(`label[for="${input.id}"]`);
        label.replaceChildren(h("a", {
          href: `#${label.htmlFor}`,
          tabIndex: -1
        }, ...Array.from(label.childNodes)));
        fromEvent(label.firstElementChild, "click").pipe(
          takeUntil(done$),
          filter((ev) => !(ev.metaKey || ev.ctrlKey)),
          tap((ev) => {
            ev.preventDefault();
            ev.stopPropagation();
          })
        ).subscribe(() => {
          history.replaceState({}, "", `#${label.htmlFor}`);
          label.click();
        });
      }
      if (feature("content.tabs.link"))
        push$.pipe(
          skip(1),
          withLatestFrom(viewport$3)
        ).subscribe(([{ active }, { offset }]) => {
          const tab = active.innerText.trim();
          if (active.hasAttribute("data-md-switching")) {
            active.removeAttribute("data-md-switching");
          } else {
            const y = el.offsetTop - offset.y;
            for (const set of getElements("[data-tabs]"))
              for (const input of getElements(
                ":scope > input",
                set
              )) {
                const label = getElement(`label[for="${input.id}"]`);
                if (label !== active && label.innerText.trim() === tab) {
                  label.setAttribute("data-md-switching", "");
                  input.click();
                  break;
                }
              }
            window.scrollTo({
              top: el.offsetTop - y
            });
            const tabs = __md_get("__tabs") || [];
            __md_set("__tabs", [.../* @__PURE__ */ new Set([tab, ...tabs])]);
          }
        });
      push$.pipe(takeUntil(done$)).subscribe(() => {
        for (const media of getElements("audio, video", el)) {
          if (media.offsetWidth && media.autoplay) {
            media.play().catch(() => {
            });
          } else {
            media.pause();
          }
        }
      });
      return watchContentTabs(inputs).pipe(
        tap((state) => push$.next(state)),
        finalize(() => push$.complete()),
        map((state) => __spreadValues({ ref: el }, state))
      );
    }).pipe(
      subscribeOn(asyncScheduler)
    );
  }

  // src/templates/assets/javascripts/components/content/_/index.ts
  function mountContent(el, dependencies) {
    const { viewport$: viewport$3, target$: target$2, print$: print$2 } = dependencies;
    return merge(
      ...getElements(".annotate:not(.highlight)", el).map((child) => mountAnnotationBlock(child, { target$: target$2, print$: print$2 })),
      ...getElements("pre:not(.mermaid) > code", el).map((child) => mountCodeBlock(child, { target$: target$2, print$: print$2 })),
      ...getElements("a", el).map((child) => mountLink(child, dependencies)),
      ...getElements("pre.mermaid", el).map((child) => mountMermaid(child)),
      ...getElements("table:not([class])", el).map((child) => mountDataTable(child)),
      ...getElements("details", el).map((child) => mountDetails(child, { target$: target$2, print$: print$2 })),
      ...getElements("[data-tabs]", el).map((child) => mountContentTabs(child, { viewport$: viewport$3, target$: target$2 })),
      ...getElements("[title]:not([data-preview])", el).filter(() => feature("content.tooltips")).map((child) => mountInlineTooltip2(child, { viewport$: viewport$3 })),
      ...getElements(".footnote-ref", el).filter(() => feature("content.footnote.tooltips")).map((child) => mountTooltip2(child, {
        content$: new Observable((observer) => {
          const hash = new URL(child.href).hash.slice(1);
          const arr = Array.from(document.getElementById(hash).cloneNode(true).children);
          const node = renderTooltip2(...arr);
          observer.next(node);
          document.body.append(node);
          return () => node.remove();
        }),
        viewport$: viewport$3
      }))
    );
  }

  // src/templates/assets/javascripts/components/dialog/index.ts
  function watchDialog(_el, { alert$: alert$2 }) {
    return alert$2.pipe(
      switchMap(
        (message) => merge(
          of(true),
          of(false).pipe(delay(2e3))
        ).pipe(
          map((active) => ({ message, active }))
        )
      )
    );
  }
  function mountDialog(el, options) {
    const inner = getElement(".md-typeset", el);
    return defer(() => {
      const push$ = new Subject();
      push$.subscribe(({ message, active }) => {
        el.classList.toggle("md-dialog--active", active);
        inner.textContent = message;
      });
      return watchDialog(el, options).pipe(
        tap((state) => push$.next(state)),
        finalize(() => push$.complete()),
        map((state) => __spreadValues({ ref: el }, state))
      );
    });
  }

  // src/templates/assets/javascripts/components/tooltip/index.ts
  var sequence5 = 0;
  function watchTooltip(el, host) {
    document.body.append(el);
    const { width } = getElementSize(el);
    el.style.setProperty("--md-tooltip-width", `${width}px`);
    el.remove();
    const container = getElementContainer(host);
    const scroll$ = typeof container !== "undefined" ? watchElementContentOffset(container) : of({ x: 0, y: 0 });
    const active$ = merge(
      watchElementFocus(host),
      watchElementHover(host)
    ).pipe(
      distinctUntilChanged()
    );
    return combineLatest([active$, scroll$]).pipe(
      map(([active, scroll]) => {
        let { x, y } = getElementOffset(host);
        const size = getElementSize(host);
        const table = host.closest("table");
        if (table && host.parentElement) {
          x += table.offsetLeft + host.parentElement.offsetLeft;
          y += table.offsetTop + host.parentElement.offsetTop;
        }
        return {
          active,
          offset: {
            x: x - scroll.x + size.width / 2 - width / 2,
            y: y - scroll.y + size.height + 8
          }
        };
      })
    );
  }
  function mountTooltip(el) {
    const title = el.title;
    if (!title.length)
      return EMPTY;
    const id = `__tooltip_${sequence5++}`;
    const tooltip = renderTooltip(id, "inline");
    const typeset = getElement(".md-typeset", tooltip);
    typeset.innerHTML = title;
    return defer(() => {
      const push$ = new Subject();
      push$.subscribe({
        /* Handle emission */
        next({ offset }) {
          tooltip.style.setProperty("--md-tooltip-x", `${offset.x}px`);
          tooltip.style.setProperty("--md-tooltip-y", `${offset.y}px`);
        },
        /* Handle complete */
        complete() {
          tooltip.style.removeProperty("--md-tooltip-x");
          tooltip.style.removeProperty("--md-tooltip-y");
        }
      });
      merge(
        push$.pipe(filter(({ active }) => active)),
        push$.pipe(debounceTime(250), filter(({ active }) => !active))
      ).subscribe({
        /* Handle emission */
        next({ active }) {
          if (active) {
            el.insertAdjacentElement("afterend", tooltip);
            el.setAttribute("aria-describedby", id);
            el.removeAttribute("title");
          } else {
            tooltip.remove();
            el.removeAttribute("aria-describedby");
            el.setAttribute("title", title);
          }
        },
        /* Handle complete */
        complete() {
          tooltip.remove();
          el.removeAttribute("aria-describedby");
          el.setAttribute("title", title);
        }
      });
      push$.pipe(
        auditTime(16, animationFrameScheduler)
      ).subscribe(({ active }) => {
        tooltip.classList.toggle("md-tooltip--active", active);
      });
      push$.pipe(
        throttleTime(125, animationFrameScheduler),
        filter(() => !!el.offsetParent),
        map(() => el.offsetParent.getBoundingClientRect()),
        map(({ x }) => x)
      ).subscribe({
        /* Handle emission */
        next(origin) {
          if (origin)
            tooltip.style.setProperty("--md-tooltip-0", `${-origin}px`);
          else
            tooltip.style.removeProperty("--md-tooltip-0");
        },
        /* Handle complete */
        complete() {
          tooltip.style.removeProperty("--md-tooltip-0");
        }
      });
      return watchTooltip(tooltip, el).pipe(
        tap((state) => push$.next(state)),
        finalize(() => push$.complete()),
        map((state) => __spreadValues({ ref: el }, state))
      );
    }).pipe(
      subscribeOn(asyncScheduler)
    );
  }

  // src/templates/assets/javascripts/components/header/_/index.ts
  function isHidden({ viewport$: viewport$3 }) {
    if (!feature("header.autohide"))
      return of(false);
    const direction$ = viewport$3.pipe(
      map(({ offset: { y } }) => y),
      bufferCount(2, 1),
      map(([a, b]) => [a < b, b]),
      distinctUntilKeyChanged(0)
    );
    const hidden$ = combineLatest([viewport$3, direction$]).pipe(
      filter(([{ offset }, [, y]]) => Math.abs(y - offset.y) > 100),
      map(([, [direction]]) => direction),
      distinctUntilChanged()
    );
    const search$ = watchToggle("search");
    return combineLatest([viewport$3, search$]).pipe(
      map(([{ offset }, search]) => offset.y > 400 && !search),
      distinctUntilChanged(),
      switchMap((active) => active ? hidden$ : of(false)),
      startWith(false)
    );
  }
  function watchHeader(el, dependencies) {
    return defer(() => combineLatest([
      watchElementSize(el),
      isHidden(dependencies)
    ])).pipe(
      map(([{ height }, hidden]) => ({
        height,
        hidden
      })),
      distinctUntilChanged((a, b) => a.height === b.height && a.hidden === b.hidden),
      shareReplay(1)
    );
  }
  function mountHeader(el, { header$: header$2, main$: main$2 }) {
    return defer(() => {
      const push$ = new Subject();
      const done$ = push$.pipe(ignoreElements(), endWith(true));
      push$.pipe(
        distinctUntilKeyChanged("active"),
        combineLatestWith(header$2)
      ).subscribe(([{ active }, { hidden }]) => {
        el.classList.toggle("md-header--shadow", active && !hidden);
        el.hidden = hidden;
      });
      const tooltips = from(getElements("[title]", el)).pipe(
        filter(() => feature("content.tooltips")),
        mergeMap((child) => mountTooltip(child))
      );
      main$2.subscribe(push$);
      return header$2.pipe(
        takeUntil(done$),
        map((state) => __spreadValues({ ref: el }, state)),
        mergeWith(tooltips.pipe(takeUntil(done$)))
      );
    });
  }

  // src/templates/assets/javascripts/components/header/title/index.ts
  function watchHeaderTitle(el, { viewport$: viewport$3, header$: header$2 }) {
    return watchViewportAt(el, { viewport$: viewport$3, header$: header$2 }).pipe(
      map(({ offset: { y } }) => {
        const { height } = getElementSize(el);
        return {
          active: height > 0 && y >= height
        };
      }),
      distinctUntilKeyChanged("active")
    );
  }
  function mountHeaderTitle(el, options) {
    return defer(() => {
      const push$ = new Subject();
      push$.subscribe({
        /* Handle emission */
        next({ active }) {
          el.classList.toggle("md-header__title--active", active);
        },
        /* Handle complete */
        complete() {
          el.classList.remove("md-header__title--active");
        }
      });
      const heading = getOptionalElement(".md-content h1");
      if (typeof heading === "undefined")
        return EMPTY;
      return watchHeaderTitle(heading, options).pipe(
        tap((state) => push$.next(state)),
        finalize(() => push$.complete()),
        map((state) => __spreadValues({ ref: el }, state))
      );
    });
  }

  // src/templates/assets/javascripts/components/main/index.ts
  function watchMain(el, { viewport$: viewport$3, header$: header$2 }) {
    const adjust$ = header$2.pipe(
      map(({ height }) => height),
      distinctUntilChanged()
    );
    const border$ = adjust$.pipe(
      switchMap(
        () => watchElementSize(el).pipe(
          map(({ height }) => ({
            top: el.offsetTop,
            bottom: el.offsetTop + height
          })),
          distinctUntilKeyChanged("bottom")
        )
      )
    );
    return combineLatest([adjust$, border$, viewport$3]).pipe(
      map(([header, { top, bottom }, { offset: { y }, size: { height } }]) => {
        height = Math.max(
          0,
          height - Math.max(0, top - y, header) - Math.max(0, height + y - bottom)
        );
        return {
          offset: top - header,
          height,
          active: top - header <= y
        };
      }),
      distinctUntilChanged((a, b) => a.offset === b.offset && a.height === b.height && a.active === b.active)
    );
  }

  // src/templates/assets/javascripts/components/palette/index.ts
  function watchPalette(inputs) {
    const current = __md_get("__palette") || {
      index: inputs.findIndex((input) => matchMedia(
        input.getAttribute("data-md-color-media")
      ).matches)
    };
    const index = Math.max(0, Math.min(current.index, inputs.length - 1));
    return of(...inputs).pipe(
      mergeMap((input) => fromEvent(input, "change").pipe(map(() => input))),
      startWith(inputs[index]),
      map((input) => ({
        index: inputs.indexOf(input),
        color: {
          media: input.getAttribute("data-md-color-media"),
          scheme: input.getAttribute("data-md-color-scheme"),
          primary: input.getAttribute("data-md-color-primary"),
          accent: input.getAttribute("data-md-color-accent")
        }
      })),
      shareReplay(1)
    );
  }
  function mountPalette(el) {
    const inputs = getElements("input", el);
    const meta = h("meta", { name: "theme-color" });
    document.head.appendChild(meta);
    const scheme = h("meta", { name: "color-scheme" });
    document.head.appendChild(scheme);
    const media$ = watchMedia("(prefers-color-scheme: light)");
    return defer(() => {
      const push$ = new Subject();
      push$.subscribe((palette) => {
        document.body.setAttribute("data-md-color-switching", "");
        if (palette.color.media === "(prefers-color-scheme)") {
          const media = matchMedia("(prefers-color-scheme: light)");
          const input = document.querySelector(
            media.matches ? "[data-md-color-media='(prefers-color-scheme: light)']" : "[data-md-color-media='(prefers-color-scheme: dark)']"
          );
          palette.color.scheme = input.getAttribute("data-md-color-scheme");
          palette.color.primary = input.getAttribute("data-md-color-primary");
          palette.color.accent = input.getAttribute("data-md-color-accent");
        }
        for (const [key, value] of Object.entries(palette.color))
          document.body.setAttribute(`data-md-color-${key}`, value);
        for (let index = 0; index < inputs.length; index++) {
          const label = inputs[index].nextElementSibling;
          if (label instanceof HTMLElement)
            label.hidden = palette.index !== index;
        }
        __md_set("__palette", palette);
      });
      fromEvent(el, "keydown").pipe(
        filter((ev) => ev.key === "Enter"),
        withLatestFrom(push$, (_, palette) => palette)
      ).subscribe(({ index }) => {
        index = (index + 1) % inputs.length;
        inputs[index].click();
        inputs[index].focus();
      });
      push$.pipe(
        map(() => {
          const header = getComponentElement("header");
          const style = window.getComputedStyle(header);
          scheme.content = style.colorScheme;
          return style.backgroundColor.match(/\d+/g).map((value) => (+value).toString(16).padStart(2, "0")).join("");
        })
      ).subscribe((color) => meta.content = `#${color}`);
      push$.pipe(observeOn(asyncScheduler)).subscribe(() => {
        document.body.removeAttribute("data-md-color-switching");
      });
      return watchPalette(inputs).pipe(
        takeUntil(media$.pipe(skip(1))),
        repeat(),
        tap((state) => push$.next(state)),
        finalize(() => push$.complete()),
        map((state) => __spreadValues({ ref: el }, state))
      );
    });
  }

  // src/templates/assets/javascripts/components/progress/index.ts
  function mountProgress(el, { progress$: progress$2 }) {
    return defer(() => {
      const push$ = new Subject();
      push$.subscribe(({ value }) => {
        el.style.setProperty("--md-progress-value", `${value}`);
      });
      return progress$2.pipe(
        tap((value) => push$.next({ value })),
        finalize(() => push$.complete()),
        map((value) => ({ ref: el, value }))
      );
    });
  }

  // src/templates/assets/javascripts/integrations/sitemap/index.ts
  function resolve2(url, base) {
    url.protocol = base.protocol;
    url.hostname = base.hostname;
    return url;
  }
  function extract2(document2, base) {
    const sitemap = /* @__PURE__ */ new Map();
    for (const el of getElements("url", document2)) {
      const url = getElement("loc", el);
      const links = [resolve2(new URL(url.textContent), base)];
      sitemap.set(`${links[0]}`, links);
      for (const link of getElements("[rel=alternate]", el)) {
        const href = link.getAttribute("href");
        if (href != null)
          links.push(resolve2(new URL(href), base));
      }
    }
    return sitemap;
  }
  function fetchSitemap(base) {
    return requestXML(new URL("sitemap.xml", base)).pipe(
      map((document2) => extract2(document2, new URL(base))),
      catchError(() => of(/* @__PURE__ */ new Map())),
      share()
    );
  }

  // src/templates/assets/javascripts/integrations/alternate/index.ts
  function setupAlternate({ document$: document$2 }) {
    const alternate = /* @__PURE__ */ new Map();
    document$2.pipe(
      switchMap(() => getElements("link[rel=alternate]")),
      map((el) => new URL(el.href)),
      filter((url) => !alternate.has(url.toString())),
      mergeMap(
        (url) => fetchSitemap(url).pipe(
          map((sitemap) => [url, sitemap]),
          catchError(() => EMPTY)
        )
      )
    ).subscribe(([url, sitemap]) => {
      alternate.set(url.toString().replace(/\/$/, ""), sitemap);
    });
    fromEvent(document.body, "click").pipe(
      filter((ev) => !ev.metaKey && !ev.ctrlKey),
      switchMap((ev) => {
        if (ev.target instanceof Element) {
          const el = ev.target.closest("a");
          if (el && !el.target) {
            const result = [...alternate].find(([url2]) => el.href.startsWith(`${url2}/`));
            if (typeof result === "undefined")
              return EMPTY;
            const [url, sitemap] = result;
            const location2 = getLocation();
            if (location2.href.startsWith(url))
              return EMPTY;
            const config4 = configuration();
            let path = location2.href.replace(config4.base, "");
            path = `${url}/${path}`;
            const target = sitemap.has(path.split("#")[0]) ? new URL(path, config4.base) : new URL(url);
            ev.preventDefault();
            return of(target);
          }
        }
        return EMPTY;
      })
    ).subscribe((url) => setLocation(url, true));
  }

  // src/templates/assets/javascripts/integrations/clipboard/index.ts
  var import_clipboard2 = __toESM(require_clipboard());
  function extract3(el) {
    el.setAttribute("data-md-copying", "");
    const copy = el.closest("[data-copy]");
    const text = copy ? copy.getAttribute("data-copy") : el.innerText;
    el.removeAttribute("data-md-copying");
    return text.trimEnd();
  }
  function setupClipboardJS({ alert$: alert$2 }) {
    if (import_clipboard2.default.isSupported()) {
      new Observable((subscriber) => {
        new import_clipboard2.default("[data-clipboard-target], [data-clipboard-text]", {
          text: (el) => el.getAttribute("data-clipboard-text") || extract3(getElement(
            el.getAttribute("data-clipboard-target")
          ))
        }).on("success", (ev) => subscriber.next(ev));
      }).pipe(
        tap((ev) => {
          const trigger = ev.trigger;
          trigger.focus();
        }),
        map(() => translation("clipboard.copied"))
      ).subscribe(alert$2);
    }
  }

  // src/templates/assets/javascripts/integrations/instant/index.ts
  function handle(ev, sitemap) {
    if (!(ev.target instanceof Element))
      return EMPTY;
    const el = ev.target.closest("a");
    if (el === null)
      return EMPTY;
    if (el.target || ev.metaKey || ev.ctrlKey)
      return EMPTY;
    const url = new URL(el.href);
    url.search = url.hash = "";
    if (!sitemap.has(`${url}`))
      return EMPTY;
    ev.preventDefault();
    return of(el);
  }
  function head(document2) {
    const tags = /* @__PURE__ */ new Map();
    for (const el of getElements(":scope > *", document2.head))
      tags.set(el.outerHTML, el);
    return tags;
  }
  function resolve3(document2) {
    for (const el of getElements("[href], [src]", document2))
      for (const key of ["href", "src"]) {
        const value = el.getAttribute(key);
        if (value && !/^(?:[a-z]+:)?\/\//i.test(value)) {
          el[key] = el[key];
          break;
        }
      }
    return of(document2);
  }
  function inject(next) {
    for (const selector of [
      "[data-md-component=announce]",
      "[data-md-component=container]",
      "[data-md-component=header-topic]",
      "[data-md-component=outdated]",
      "[data-md-component=logo]",
      "[data-md-component=skip]",
      ...feature("navigation.tabs.sticky") ? ["[data-md-component=tabs]"] : []
    ]) {
      const source = getOptionalElement(selector);
      const target = getOptionalElement(selector, next);
      if (typeof source !== "undefined" && typeof target !== "undefined") {
        source.replaceWith(target);
      }
    }
    const tags = head(document);
    for (const [html, el] of head(next))
      if (tags.has(html))
        tags.delete(html);
      else
        document.head.appendChild(el);
    for (const el of tags.values()) {
      const name = el.getAttribute("name");
      if (name !== "theme-color" && name !== "color-scheme")
        el.remove();
    }
    const container = getComponentElement("container");
    return concat(getElements("script", container)).pipe(
      switchMap((el) => {
        const script2 = next.createElement("script");
        if (el.src) {
          for (const name of el.getAttributeNames())
            script2.setAttribute(name, el.getAttribute(name));
          el.replaceWith(script2);
          return new Observable((observer) => {
            script2.onload = () => observer.complete();
          });
        } else {
          script2.textContent = el.textContent;
          el.replaceWith(script2);
          return EMPTY;
        }
      }),
      ignoreElements(),
      endWith(document)
    );
  }
  function setupInstantNavigation({ sitemap$: sitemap$2, location$: location$2, viewport$: viewport$3, progress$: progress$2 }) {
    if (location.protocol === "file:")
      return EMPTY;
    of(document).subscribe(resolve3);
    const instant$ = fromEvent(document.body, "click").pipe(
      combineLatestWith(sitemap$2),
      switchMap(([ev, sitemap]) => handle(ev, sitemap)),
      map(({ href }) => new URL(href)),
      share()
    );
    const history$ = fromEvent(window, "popstate").pipe(
      map(getLocation),
      share()
    );
    instant$.pipe(withLatestFrom(viewport$3)).subscribe(([url, { offset }]) => {
      history.replaceState(offset, "");
      history.pushState(null, "", url);
    });
    merge(instant$, history$).subscribe(location$2);
    const document$2 = location$2.pipe(
      distinctUntilKeyChanged("pathname"),
      switchMap(
        (url) => requestHTML(url, { progress$: progress$2 }).pipe(
          catchError(() => {
            setLocation(url, true);
            return EMPTY;
          })
        )
      ),
      // The document was successfully fetched and parsed, so we can inject its
      // contents into the currently active document
      switchMap(resolve3),
      switchMap(inject),
      share()
    );
    merge(
      document$2.pipe(withLatestFrom(location$2, (_, url) => url)),
      // Handle instant navigation events that are triggered by the user clicking
      // on an anchor link with a hash fragment different from the current one, as
      // well as from popstate events, which are emitted when the user navigates
      // back and forth between pages.
      document$2.pipe(
        switchMap(() => location$2),
        distinctUntilKeyChanged("hash")
      ),
      // Handle instant navigation events that are triggered by the user clicking
      // on an anchor link with the same hash fragment as the current one in the
      // URL. It is essential that we only intercept those from instant navigation
      // events and not from history change events, or we'll end up in and endless
      // loop. The top-level history entry must be removed, as it will be replaced
      // with a new one, which would otherwise lead to a duplicate entry.
      location$2.pipe(
        distinctUntilChanged((a, b) => a.pathname === b.pathname && a.hash === b.hash),
        switchMap(() => instant$),
        tap(() => history.back())
      )
    ).subscribe((url) => {
      var _a2, _b;
      if (history.state !== null || !url.hash) {
        window.scrollTo(0, (_b = (_a2 = history.state) == null ? void 0 : _a2.y) != null ? _b : 0);
      } else {
        history.scrollRestoration = "auto";
        setLocationHash(url.hash);
        history.scrollRestoration = "manual";
      }
    });
    location$2.subscribe(() => {
      history.scrollRestoration = "manual";
    });
    fromEvent(window, "beforeunload").subscribe(() => {
      history.scrollRestoration = "auto";
    });
    viewport$3.pipe(
      distinctUntilKeyChanged("offset"),
      debounceTime(100)
    ).subscribe(({ offset }) => {
      history.replaceState(offset, "");
    });
    if (feature("navigation.instant.prefetch"))
      merge(
        fromEvent(document.body, "mousemove"),
        fromEvent(document.body, "focusin")
      ).pipe(
        combineLatestWith(sitemap$2),
        switchMap(([ev, sitemap]) => handle(ev, sitemap)),
        debounceTime(25),
        distinct(({ href }) => href),
        exhaustMap((href) => {
          const link = document.createElement("link");
          link.rel = "prefetch";
          link.href = href.toString();
          document.head.appendChild(link);
          return fromEvent(link, "load").pipe(
            map(() => link),
            take(1)
          );
        })
      ).subscribe((link) => link.remove());
    return document$2;
  }

  // src/templates/assets/javascripts/integrations/search/highlighter/index.ts
  var import_escape_html2 = __toESM(require_escape_html());
  function setupSearchHighlighter(config4) {
    const regex = config4.separator.split("|").map((term) => {
      const temp = term.replace(/(\(\?[!=<][^)]+\))/g, "");
      return temp.length === 0 ? "\uFFFD" : term;
    }).join("|");
    const separator = new RegExp(regex, "img");
    const highlight2 = (_, data, term) => {
      return `${data}<mark data-md-highlight>${term}</mark>`;
    };
    return (query) => {
      query = query.replace(/[\s*+\-:~^]+/g, " ").replace(/&/g, "&amp;").trim();
      const match = new RegExp(`(^|${config4.separator}|)(${query.replace(/[|\\{}()[\]^$+*?.-]/g, "\\$&").replace(separator, "|")})`, "img");
      return (value) => (0, import_escape_html2.default)(value).replace(match, highlight2).replace(/<\/mark>(\s+)<mark[^>]*>/img, "$1");
    };
  }

  // src/templates/assets/javascripts/integrations/search/worker/message/index.ts
  function isSearchReadyMessage(message) {
    return message.type === 1 /* READY */;
  }
  function isSearchResultMessage(message) {
    return message.type === 3 /* RESULT */;
  }

  // src/templates/assets/javascripts/integrations/search/worker/_/index.ts
  function setupSearchWorker(url, index$2) {
    const worker$ = watchWorker(url);
    merge(
      of(location.protocol !== "file:"),
      watchToggle("search")
    ).pipe(
      first((active) => active),
      switchMap(() => index$2)
    ).subscribe(({ config: config4, docs }) => worker$.next({
      type: 0 /* SETUP */,
      data: {
        config: config4,
        docs,
        options: {
          suggest: feature("search.suggest")
        }
      }
    }));
    return worker$;
  }

  // src/templates/assets/javascripts/integrations/version/findurl/index.ts
  function selectedVersionCorrespondingURL(params) {
    var _a2;
    const {
      selectedVersionSitemap,
      selectedVersionBaseURL,
      currentLocation,
      currentBaseURL
    } = params;
    const current_path = (_a2 = safeURLParse(currentBaseURL)) == null ? void 0 : _a2.pathname;
    if (current_path === void 0) {
      return;
    }
    const currentRelativePath = stripPrefix(currentLocation.pathname, current_path);
    if (currentRelativePath === void 0) {
      return;
    }
    const sitemapCommonPrefix = shortestCommonPrefix(selectedVersionSitemap.keys());
    if (!selectedVersionSitemap.has(sitemapCommonPrefix)) {
      return;
    }
    const potentialSitemapURL = safeURLParse(currentRelativePath, sitemapCommonPrefix);
    if (!potentialSitemapURL || !selectedVersionSitemap.has(potentialSitemapURL.href)) {
      return;
    }
    const result = safeURLParse(currentRelativePath, selectedVersionBaseURL);
    if (!result) {
      return;
    }
    result.hash = currentLocation.hash;
    result.search = currentLocation.search;
    return result;
  }
  function safeURLParse(url, base) {
    try {
      return new URL(url, base);
    } catch (e) {
      return;
    }
  }
  function stripPrefix(s, prefix) {
    if (s.startsWith(prefix)) {
      return s.slice(prefix.length);
    }
    return void 0;
  }
  function commonPrefixLen(s1, s2) {
    const max = Math.min(s1.length, s2.length);
    let result;
    for (result = 0; result < max; ++result) {
      if (s1[result] !== s2[result]) {
        break;
      }
    }
    return result;
  }
  function shortestCommonPrefix(strs) {
    let result;
    for (const s of strs) {
      if (result === void 0) {
        result = s;
      } else {
        result = result.slice(0, commonPrefixLen(result, s));
      }
    }
    return result != null ? result : "";
  }

  // src/templates/assets/javascripts/integrations/version/index.ts
  function setupVersionSelector({ document$: document$2 }) {
    const config4 = configuration();
    const versions$ = requestJSON(
      new URL("../versions.json", config4.base)
    ).pipe(
      catchError(() => EMPTY)
      // @todo refactor instant loading
    );
    const current$ = versions$.pipe(
      map((versions) => {
        const [, current] = config4.base.match(/([^/]+)\/?$/);
        return versions.find(({ version, aliases }) => version === current || aliases.includes(current)) || versions[0];
      })
    );
    versions$.pipe(
      map((versions) => new Map(versions.map((version) => [
        `${new URL(`../${version.version}/`, config4.base)}`,
        version
      ]))),
      switchMap(
        (urls) => fromEvent(document.body, "click").pipe(
          filter((ev) => !ev.metaKey && !ev.ctrlKey),
          withLatestFrom(current$),
          switchMap(([ev, current]) => {
            if (ev.target instanceof Element) {
              const el = ev.target.closest("a");
              if (el && !el.target && urls.has(el.href)) {
                const url = el.href;
                if (!ev.target.closest(".md-version")) {
                  const version = urls.get(url);
                  if (version === current)
                    return EMPTY;
                }
                ev.preventDefault();
                return of(new URL(url));
              }
            }
            return EMPTY;
          }),
          switchMap((selectedVersionBaseURL) => {
            return fetchSitemap(selectedVersionBaseURL).pipe(
              map(
                (sitemap) => {
                  var _a2;
                  return (_a2 = selectedVersionCorrespondingURL({
                    selectedVersionSitemap: sitemap,
                    selectedVersionBaseURL,
                    currentLocation: getLocation(),
                    currentBaseURL: config4.base
                  })) != null ? _a2 : selectedVersionBaseURL;
                }
              )
            );
          })
        )
      )
    ).subscribe((url) => setLocation(url, true));
    combineLatest([versions$, current$]).subscribe(([versions, current]) => {
      const topic = getElement(".md-header__topic");
      topic.appendChild(renderVersionSelector(versions, current));
    });
    document$2.pipe(switchMap(() => current$)).subscribe((current) => {
      var _a2;
      const base = new URL(config4.base);
      let outdated = __md_get("__outdated", sessionStorage, base);
      if (outdated === null) {
        outdated = true;
        let ignored = ((_a2 = config4.version) == null ? void 0 : _a2.default) || "latest";
        if (!Array.isArray(ignored))
          ignored = [ignored];
        main: for (const ignore of ignored)
          for (const version of current.aliases.concat(current.version))
            if (new RegExp(ignore, "i").test(version)) {
              outdated = false;
              break main;
            }
        __md_set("__outdated", outdated, sessionStorage, base);
      }
      if (outdated)
        for (const warning of getComponentElements("outdated"))
          warning.hidden = false;
    });
  }

  // src/templates/assets/javascripts/components/search/query/index.ts
  function watchSearchQuery(el, { worker$ }) {
    const { searchParams } = getLocation();
    if (searchParams.has("q")) {
      setToggle("search", true);
      el.value = searchParams.get("q");
      el.focus();
      watchToggle("search").pipe(
        first((active) => !active)
      ).subscribe(() => {
        const url = getLocation();
        url.searchParams.delete("q");
        history.replaceState({}, "", `${url}`);
      });
    }
    const focus$ = watchElementFocus(el);
    const value$ = merge(
      worker$.pipe(first(isSearchReadyMessage)),
      fromEvent(el, "keyup"),
      focus$
    ).pipe(
      map(() => el.value),
      distinctUntilChanged()
    );
    return combineLatest([value$, focus$]).pipe(
      map(([value, focus]) => ({ value, focus })),
      shareReplay(1)
    );
  }
  function mountSearchQuery(el, { worker$ }) {
    const push$ = new Subject();
    const done$ = push$.pipe(ignoreElements(), endWith(true));
    combineLatest([
      worker$.pipe(first(isSearchReadyMessage)),
      push$
    ], (_, query) => query).pipe(
      distinctUntilKeyChanged("value")
    ).subscribe(({ value }) => worker$.next({
      type: 2 /* QUERY */,
      data: value
    }));
    push$.pipe(
      distinctUntilKeyChanged("focus")
    ).subscribe(({ focus }) => {
      if (focus)
        setToggle("search", focus);
    });
    fromEvent(el.form, "reset").pipe(
      takeUntil(done$)
    ).subscribe(() => el.focus());
    const label = getElement("header [for=__search]");
    fromEvent(label, "click").subscribe(() => el.focus());
    return watchSearchQuery(el, { worker$ }).pipe(
      tap((state) => push$.next(state)),
      finalize(() => push$.complete()),
      map((state) => __spreadValues({ ref: el }, state)),
      shareReplay(1)
    );
  }

  // src/templates/assets/javascripts/components/search/result/index.ts
  function mountSearchResult(el, { worker$, query$ }) {
    const push$ = new Subject();
    const boundary$ = watchElementBoundary(el.parentElement).pipe(
      filter(Boolean)
    );
    const container = el.parentElement;
    const meta = getElement(":scope > :first-child", el);
    const list = getElement(":scope > :last-child", el);
    watchToggle("search").subscribe((active) => {
      list.setAttribute("role", active ? "list" : "presentation");
      list.hidden = !active;
    });
    push$.pipe(
      withLatestFrom(query$),
      skipUntil(worker$.pipe(first(isSearchReadyMessage)))
    ).subscribe(([{ items }, { value }]) => {
      switch (items.length) {
        /* No results */
        case 0:
          meta.textContent = value.length ? translation("search.result.none") : translation("search.result.placeholder");
          break;
        /* One result */
        case 1:
          meta.textContent = translation("search.result.one");
          break;
        /* Multiple result */
        default:
          const count = round(items.length);
          meta.textContent = translation("search.result.other", count);
      }
    });
    const render$ = push$.pipe(
      tap(() => list.innerHTML = ""),
      switchMap(({ items }) => merge(
        of(...items.slice(0, 10)),
        of(...items.slice(10)).pipe(
          bufferCount(4),
          zipWith(boundary$),
          switchMap(([chunk]) => chunk)
        )
      )),
      map(renderSearchResultItem),
      share()
    );
    render$.subscribe((item) => list.appendChild(item));
    render$.pipe(
      mergeMap((item) => {
        const details = getOptionalElement("details", item);
        if (typeof details === "undefined")
          return EMPTY;
        return fromEvent(details, "toggle").pipe(
          takeUntil(push$),
          map(() => details)
        );
      })
    ).subscribe((details) => {
      if (details.open === false && details.offsetTop <= container.scrollTop)
        container.scrollTo({ top: details.offsetTop });
    });
    const result$ = worker$.pipe(
      filter(isSearchResultMessage),
      map(({ data }) => data)
    );
    return result$.pipe(
      tap((state) => push$.next(state)),
      finalize(() => push$.complete()),
      map((state) => __spreadValues({ ref: el }, state))
    );
  }

  // src/templates/assets/javascripts/components/search/share/index.ts
  function watchSearchShare(_el, { query$ }) {
    return query$.pipe(
      map(({ value }) => {
        const url = getLocation();
        url.hash = "";
        value = value.replace(/\s+/g, "+").replace(/&/g, "%26").replace(/=/g, "%3D");
        url.search = `q=${value}`;
        return { url };
      })
    );
  }
  function mountSearchShare(el, options) {
    const push$ = new Subject();
    const done$ = push$.pipe(ignoreElements(), endWith(true));
    push$.subscribe(({ url }) => {
      el.setAttribute("data-clipboard-text", el.href);
      el.href = `${url}`;
    });
    fromEvent(el, "click").pipe(
      takeUntil(done$)
    ).subscribe((ev) => ev.preventDefault());
    return watchSearchShare(el, options).pipe(
      tap((state) => push$.next(state)),
      finalize(() => push$.complete()),
      map((state) => __spreadValues({ ref: el }, state))
    );
  }

  // src/templates/assets/javascripts/components/search/suggest/index.ts
  function mountSearchSuggest(el, { worker$, keyboard$: keyboard$2 }) {
    const push$ = new Subject();
    const query = getComponentElement("search-query");
    const query$ = merge(
      fromEvent(query, "keydown"),
      fromEvent(query, "focus")
    ).pipe(
      observeOn(asyncScheduler),
      map(() => query.value),
      distinctUntilChanged()
    );
    push$.pipe(
      combineLatestWith(query$),
      map(([{ suggest }, value]) => {
        const words = value.split(/([\s-]+)/);
        if ((suggest == null ? void 0 : suggest.length) && words[words.length - 1]) {
          const last2 = suggest[suggest.length - 1];
          if (last2.startsWith(words[words.length - 1]))
            words[words.length - 1] = last2;
        } else {
          words.length = 0;
        }
        return words;
      })
    ).subscribe(
      (words) => el.innerHTML = words.join("").replace(/\s/g, "&nbsp;")
    );
    keyboard$2.pipe(
      filter(({ mode }) => mode === "search")
    ).subscribe((key) => {
      switch (key.type) {
        /* Right arrow: accept current suggestion */
        case "ArrowRight":
          if (el.innerText.length && query.selectionStart === query.value.length)
            query.value = el.innerText;
          break;
      }
    });
    const result$ = worker$.pipe(
      filter(isSearchResultMessage),
      map(({ data }) => data)
    );
    return result$.pipe(
      tap((state) => push$.next(state)),
      finalize(() => push$.complete()),
      map(() => ({ ref: el }))
    );
  }

  // src/templates/assets/javascripts/components/search/_/index.ts
  function mountSearch(el, { index$: index$2, keyboard$: keyboard$2 }) {
    const config4 = configuration();
    try {
      const worker$ = setupSearchWorker(config4.search, index$2);
      const query = getComponentElement("search-query", el);
      const result = getComponentElement("search-result", el);
      fromEvent(el, "click").pipe(
        filter(({ target }) => target instanceof Element && !!target.closest("a"))
      ).subscribe(() => setToggle("search", false));
      keyboard$2.pipe(
        filter(({ mode }) => mode === "search")
      ).subscribe((key) => {
        const active = getActiveElement();
        switch (key.type) {
          /* Enter: go to first (best) result */
          case "Enter":
            if (active === query) {
              const anchors = /* @__PURE__ */ new Map();
              for (const anchor of getElements(
                ":first-child [href]",
                result
              )) {
                const article = anchor.firstElementChild;
                anchors.set(anchor, parseFloat(
                  article.getAttribute("data-md-score")
                ));
              }
              if (anchors.size) {
                const [[best]] = [...anchors].sort(([, a], [, b]) => b - a);
                best.click();
              }
              key.claim();
            }
            break;
          /* Escape or Tab: close search */
          case "Escape":
          case "Tab":
            setToggle("search", false);
            query.blur();
            break;
          /* Vertical arrows: select previous or next search result */
          case "ArrowUp":
          case "ArrowDown":
            if (typeof active === "undefined") {
              query.focus();
            } else {
              const els = [query, ...getElements(
                ":not(details) > [href], summary, details[open] [href]",
                result
              )];
              const i = Math.max(0, (Math.max(0, els.indexOf(active)) + els.length + (key.type === "ArrowUp" ? -1 : 1)) % els.length);
              els[i].focus();
            }
            key.claim();
            break;
          /* All other keys: hand to search query */
          default:
            if (query !== getActiveElement())
              query.focus();
        }
      });
      keyboard$2.pipe(
        filter(({ mode }) => mode === "global")
      ).subscribe((key) => {
        switch (key.type) {
          /* Open search and select query */
          case "f":
          case "s":
          case "/":
            query.focus();
            query.select();
            key.claim();
            break;
        }
      });
      const query$ = mountSearchQuery(query, { worker$ });
      return merge(
        query$,
        mountSearchResult(result, { worker$, query$ })
      ).pipe(
        mergeWith(
          ...getComponentElements("search-share", el).map((child) => mountSearchShare(child, { query$ })),
          ...getComponentElements("search-suggest", el).map((child) => mountSearchSuggest(child, { worker$, keyboard$: keyboard$2 }))
        )
      );
    } catch (err) {
      el.hidden = true;
      return NEVER;
    }
  }

  // src/templates/assets/javascripts/components/search/highlight/index.ts
  function mountSearchHiglight(el, { index$: index$2, location$: location$2 }) {
    return combineLatest([
      index$2,
      location$2.pipe(
        startWith(getLocation()),
        filter((url) => !!url.searchParams.get("h"))
      )
    ]).pipe(
      map(([index, url]) => setupSearchHighlighter(index.config)(
        url.searchParams.get("h")
      )),
      map((fn) => {
        var _a2;
        const nodes = /* @__PURE__ */ new Map();
        const it = document.createNodeIterator(el, NodeFilter.SHOW_TEXT);
        for (let node = it.nextNode(); node; node = it.nextNode()) {
          if ((_a2 = node.parentElement) == null ? void 0 : _a2.offsetHeight) {
            const original = node.textContent;
            const replaced = fn(original);
            if (replaced.length > original.length)
              nodes.set(node, replaced);
          }
        }
        for (const [node, text] of nodes) {
          const { childNodes } = h("span", null, text);
          node.replaceWith(...Array.from(childNodes));
        }
        return { ref: el, nodes };
      })
    );
  }

  // src/templates/assets/javascripts/components/sidebar/index.ts
  function watchSidebar(el, { viewport$: viewport$3, main$: main$2 }) {
    const parent = el.closest(".md-grid");
    const adjust = parent.offsetTop - parent.parentElement.offsetTop;
    return combineLatest([main$2, viewport$3]).pipe(
      map(([{ offset, height }, { offset: { y } }]) => {
        height = height + Math.min(adjust, Math.max(0, y - offset)) - adjust;
        return {
          height,
          locked: y >= offset + adjust
        };
      }),
      distinctUntilChanged((a, b) => a.height === b.height && a.locked === b.locked)
    );
  }
  function mountSidebar(el, _a2) {
    var _b = _a2, { header$: header$2 } = _b, options = __objRest(_b, ["header$"]);
    const inner = getElement(".md-sidebar__scrollwrap", el);
    const { y } = getElementOffset(inner);
    return defer(() => {
      const push$ = new Subject();
      const done$ = push$.pipe(ignoreElements(), endWith(true));
      const next$ = push$.pipe(
        auditTime(0, animationFrameScheduler)
      );
      next$.pipe(withLatestFrom(header$2)).subscribe({
        /* Handle emission */
        next([{ height }, { height: offset }]) {
          inner.style.height = `${height - 2 * y}px`;
          el.style.top = `${offset}px`;
        },
        /* Handle complete */
        complete() {
          inner.style.height = "";
          el.style.top = "";
        }
      });
      next$.pipe(first()).subscribe(() => {
        for (const item of getElements(".md-nav__link--active[href]", el)) {
          if (!item.clientHeight)
            continue;
          const container = item.closest(".md-sidebar__scrollwrap");
          if (typeof container !== "undefined") {
            const offset = item.offsetTop - container.offsetTop;
            const { height } = getElementSize(container);
            container.scrollTo({
              top: offset - height / 2
            });
          }
        }
      });
      from(getElements("label[tabindex]", el)).pipe(
        mergeMap(
          (label) => fromEvent(label, "click").pipe(
            observeOn(asyncScheduler),
            map(() => label),
            takeUntil(done$)
          )
        )
      ).subscribe((label) => {
        const input = getElement(`[id="${label.htmlFor}"]`);
        const nav = getElement(`[aria-labelledby="${label.id}"]`);
        nav.setAttribute("aria-expanded", `${input.checked}`);
      });
      if (feature("content.tooltips"))
        from(getElements("abbr[title]", el)).pipe(
          mergeMap((child) => mountInlineTooltip2(child, { viewport$ })),
          takeUntil(done$)
        ).subscribe();
      return watchSidebar(el, options).pipe(
        tap((state) => push$.next(state)),
        finalize(() => push$.complete()),
        map((state) => __spreadValues({ ref: el }, state))
      );
    });
  }

  // src/templates/assets/javascripts/components/source/facts/github/index.ts
  function fetchSourceFactsFromGitHub(user, repo) {
    if (typeof repo !== "undefined") {
      const url = `https://api.github.com/repos/${user}/${repo}`;
      return zip(
        /* Fetch version */
        requestJSON(`${url}/releases/latest`).pipe(
          catchError(() => EMPTY),
          // @todo refactor instant loading
          map((release) => ({
            version: release.tag_name
          })),
          defaultIfEmpty({})
        ),
        /* Fetch stars and forks */
        requestJSON(url).pipe(
          catchError(() => EMPTY),
          // @todo refactor instant loading
          map((info) => ({
            stars: info.stargazers_count,
            forks: info.forks_count
          })),
          defaultIfEmpty({})
        )
      ).pipe(
        map(([release, info]) => __spreadValues(__spreadValues({}, release), info))
      );
    } else {
      const url = `https://api.github.com/users/${user}`;
      return requestJSON(url).pipe(
        map((info) => ({
          repositories: info.public_repos
        })),
        defaultIfEmpty({})
      );
    }
  }

  // src/templates/assets/javascripts/components/source/facts/gitlab/index.ts
  function fetchSourceFactsFromGitLab(base, project) {
    const url = `https://${base}/api/v4/projects/${encodeURIComponent(project)}`;
    return zip(
      /* Fetch version */
      requestJSON(`${url}/releases/permalink/latest`).pipe(
        catchError(() => EMPTY),
        // @todo refactor instant loading
        map(({ tag_name }) => ({
          version: tag_name
        })),
        defaultIfEmpty({})
      ),
      /* Fetch stars and forks */
      requestJSON(url).pipe(
        catchError(() => EMPTY),
        // @todo refactor instant loading
        map(({ star_count, forks_count }) => ({
          stars: star_count,
          forks: forks_count
        })),
        defaultIfEmpty({})
      )
    ).pipe(
      map(([release, info]) => __spreadValues(__spreadValues({}, release), info))
    );
  }

  // src/templates/assets/javascripts/components/source/facts/_/index.ts
  function fetchSourceFacts(url) {
    let match = url.match(/^.+github\.com\/([^/]+)\/?([^/]+)?/i);
    if (match) {
      const [, user, repo] = match;
      return fetchSourceFactsFromGitHub(user, repo);
    }
    match = url.match(/^.+?([^/]*gitlab[^/]+)\/(.+?)\/?$/i);
    if (match) {
      const [, base, slug] = match;
      return fetchSourceFactsFromGitLab(base, slug);
    }
    return EMPTY;
  }

  // src/templates/assets/javascripts/components/source/_/index.ts
  var fetch$;
  function watchSource(el) {
    return fetch$ || (fetch$ = defer(() => {
      const cached = __md_get("__source", sessionStorage);
      if (cached) {
        return of(cached);
      } else {
        const els = getComponentElements("consent");
        if (els.length) {
          const consent = __md_get("__consent");
          if (!(consent && consent.github))
            return EMPTY;
        }
        return fetchSourceFacts(el.href).pipe(
          tap((facts) => __md_set("__source", facts, sessionStorage))
        );
      }
    }).pipe(
      catchError(() => EMPTY),
      filter((facts) => Object.keys(facts).length > 0),
      map((facts) => ({ facts })),
      shareReplay(1)
    ));
  }
  function mountSource(el) {
    const inner = getElement(":scope > :last-child", el);
    return defer(() => {
      const push$ = new Subject();
      push$.subscribe(({ facts }) => {
        inner.appendChild(renderSourceFacts(facts));
        inner.classList.add("md-source__repository--active");
      });
      return watchSource(el).pipe(
        tap((state) => push$.next(state)),
        finalize(() => push$.complete()),
        map((state) => __spreadValues({ ref: el }, state))
      );
    });
  }

  // src/templates/assets/javascripts/components/tabs/index.ts
  function watchTabs(el, { viewport$: viewport$3, header$: header$2 }) {
    return watchElementSize(document.body).pipe(
      switchMap(() => watchViewportAt(el, { header$: header$2, viewport$: viewport$3 })),
      map(({ offset: { y } }) => {
        return {
          hidden: y >= 10
        };
      }),
      distinctUntilKeyChanged("hidden")
    );
  }
  function mountTabs(el, options) {
    return defer(() => {
      const push$ = new Subject();
      push$.subscribe({
        /* Handle emission */
        next({ hidden }) {
          el.hidden = hidden;
        },
        /* Handle complete */
        complete() {
          el.hidden = false;
        }
      });
      return (feature("navigation.tabs.sticky") ? of({ hidden: false }) : watchTabs(el, options)).pipe(
        tap((state) => push$.next(state)),
        finalize(() => push$.complete()),
        map((state) => __spreadValues({ ref: el }, state))
      );
    });
  }

  // src/templates/assets/javascripts/components/toc/index.ts
  function watchTableOfContents(el, { viewport$: viewport$3, header$: header$2 }) {
    const table = /* @__PURE__ */ new Map();
    const anchors = getElements(".md-nav__link", el);
    for (const anchor of anchors) {
      const id = decodeURIComponent(anchor.hash.substring(1));
      const target = getOptionalElement(`[id="${id}"]`);
      if (typeof target !== "undefined")
        table.set(anchor, target);
    }
    const adjust$ = header$2.pipe(
      distinctUntilKeyChanged("height"),
      map(({ height }) => {
        const main = getComponentElement("main");
        const grid = getElement(":scope > :first-child", main);
        return height + 0.8 * (grid.offsetTop - main.offsetTop);
      }),
      share()
    );
    const partition$ = watchElementSize(document.body).pipe(
      distinctUntilKeyChanged("height"),
      /* Build index to map anchor paths to vertical offsets */
      switchMap(
        (body) => defer(() => {
          let path = [];
          return of([...table].reduce((index, [anchor, target]) => {
            while (path.length) {
              const last2 = table.get(path[path.length - 1]);
              if (last2.tagName >= target.tagName) {
                path.pop();
              } else {
                break;
              }
            }
            let offset = target.offsetTop;
            while (!offset && target.parentElement) {
              target = target.parentElement;
              offset = target.offsetTop;
            }
            let parent = target.offsetParent;
            for (; parent; parent = parent.offsetParent)
              offset += parent.offsetTop;
            return index.set(
              [...path = [...path, anchor]].reverse(),
              offset
            );
          }, /* @__PURE__ */ new Map()));
        }).pipe(
          /* Sort index by vertical offset (see https://bit.ly/30z6QSO) */
          map((index) => new Map([...index].sort(([, a], [, b]) => a - b))),
          combineLatestWith(adjust$),
          /* Re-compute partition when viewport offset changes */
          switchMap(
            ([index, adjust]) => viewport$3.pipe(
              scan(([prev, next], { offset: { y }, size }) => {
                const last2 = y + size.height >= Math.floor(body.height);
                while (next.length) {
                  const [, offset] = next[0];
                  if (offset - adjust < y || last2) {
                    prev = [...prev, next.shift()];
                  } else {
                    break;
                  }
                }
                while (prev.length) {
                  const [, offset] = prev[prev.length - 1];
                  if (offset - adjust >= y && !last2) {
                    next = [prev.pop(), ...next];
                  } else {
                    break;
                  }
                }
                return [prev, next];
              }, [[], [...index]]),
              distinctUntilChanged((a, b) => a[0] === b[0] && a[1] === b[1])
            )
          )
        )
      )
    );
    return partition$.pipe(
      map(([prev, next]) => ({
        prev: prev.map(([path]) => path),
        next: next.map(([path]) => path)
      })),
      /* Extract anchor list migrations */
      startWith({ prev: [], next: [] }),
      bufferCount(2, 1),
      map(([a, b]) => {
        if (a.prev.length < b.prev.length) {
          return {
            prev: b.prev.slice(Math.max(0, a.prev.length - 1), b.prev.length),
            next: []
          };
        } else {
          return {
            prev: b.prev.slice(-1),
            next: b.next.slice(0, b.next.length - a.next.length)
          };
        }
      })
    );
  }
  function mountTableOfContents(el, { viewport$: viewport$3, header$: header$2, main$: main$2, target$: target$2 }) {
    return defer(() => {
      const push$ = new Subject();
      const done$ = push$.pipe(ignoreElements(), endWith(true));
      push$.subscribe(({ prev, next }) => {
        for (const [anchor] of next) {
          anchor.classList.remove("md-nav__link--passed");
          anchor.classList.remove("md-nav__link--active");
        }
        for (const [index, [anchor]] of prev.entries()) {
          anchor.classList.add("md-nav__link--passed");
          anchor.classList.toggle(
            "md-nav__link--active",
            index === prev.length - 1
          );
        }
      });
      if (feature("toc.follow")) {
        const smooth$ = merge(
          viewport$3.pipe(debounceTime(1), map(() => void 0)),
          viewport$3.pipe(debounceTime(250), map(() => "smooth"))
        );
        push$.pipe(
          filter(({ prev }) => prev.length > 0),
          combineLatestWith(main$2.pipe(observeOn(asyncScheduler))),
          withLatestFrom(smooth$)
        ).subscribe(([[{ prev }], behavior]) => {
          const [anchor] = prev[prev.length - 1];
          if (anchor.offsetHeight) {
            const container = getElementContainer(anchor);
            if (typeof container !== "undefined") {
              const offset = anchor.offsetTop - container.offsetTop;
              const { height } = getElementSize(container);
              container.scrollTo({
                top: offset - height / 2,
                behavior
              });
            }
          }
        });
      }
      if (feature("navigation.tracking"))
        viewport$3.pipe(
          takeUntil(done$),
          distinctUntilKeyChanged("offset"),
          debounceTime(250),
          skip(1),
          takeUntil(target$2.pipe(skip(1))),
          repeat({ delay: 250 }),
          withLatestFrom(push$)
        ).subscribe(([, { prev }]) => {
          const url = getLocation();
          const anchor = prev[prev.length - 1];
          if (anchor && anchor.length) {
            const [active] = anchor;
            const { hash } = new URL(active.href);
            if (url.hash !== hash) {
              url.hash = hash;
              history.replaceState({}, "", `${url}`);
            }
          } else {
            url.hash = "";
            history.replaceState({}, "", `${url}`);
          }
        });
      return watchTableOfContents(el, { viewport$: viewport$3, header$: header$2 }).pipe(
        tap((state) => push$.next(state)),
        finalize(() => push$.complete()),
        map((state) => __spreadValues({ ref: el }, state))
      );
    });
  }

  // src/templates/assets/javascripts/components/top/index.ts
  function watchBackToTop(_el, { viewport$: viewport$3, main$: main$2, target$: target$2 }) {
    const direction$ = viewport$3.pipe(
      map(({ offset: { y } }) => y),
      bufferCount(2, 1),
      map(([a, b]) => a > b && b > 0),
      distinctUntilChanged()
    );
    const active$ = main$2.pipe(
      map(({ active }) => active)
    );
    return combineLatest([active$, direction$]).pipe(
      map(([active, direction]) => !(active && direction)),
      distinctUntilChanged(),
      takeUntil(target$2.pipe(skip(1))),
      endWith(true),
      repeat({ delay: 250 }),
      map((hidden) => ({ hidden }))
    );
  }
  function mountBackToTop(el, { viewport$: viewport$3, header$: header$2, main$: main$2, target$: target$2 }) {
    const push$ = new Subject();
    const done$ = push$.pipe(ignoreElements(), endWith(true));
    push$.subscribe({
      /* Handle emission */
      next({ hidden }) {
        el.hidden = hidden;
        if (hidden) {
          el.setAttribute("tabindex", "-1");
          el.blur();
        } else {
          el.removeAttribute("tabindex");
        }
      },
      /* Handle complete */
      complete() {
        el.style.top = "";
        el.hidden = true;
        el.removeAttribute("tabindex");
      }
    });
    header$2.pipe(
      takeUntil(done$),
      distinctUntilKeyChanged("height")
    ).subscribe(({ height }) => {
      el.style.top = `${height + 16}px`;
    });
    fromEvent(el, "click").subscribe((ev) => {
      ev.preventDefault();
      window.scrollTo({ top: 0 });
    });
    return watchBackToTop(el, { viewport$: viewport$3, main$: main$2, target$: target$2 }).pipe(
      tap((state) => push$.next(state)),
      finalize(() => push$.complete()),
      map((state) => __spreadValues({ ref: el }, state))
    );
  }

  // src/templates/assets/javascripts/patches/ellipsis/index.ts
  function patchEllipsis({ document$: document$2, viewport$: viewport$3 }) {
    document$2.pipe(
      switchMap(() => getElements(".md-ellipsis")),
      mergeMap(
        (el) => watchElementVisibility(el).pipe(
          takeUntil(document$2.pipe(skip(1))),
          filter((visible) => visible),
          map(() => el),
          take(1)
        )
      ),
      filter((el) => el.offsetWidth < el.scrollWidth),
      mergeMap((el) => {
        const text = el.innerText;
        const host = el.closest("a") || el;
        host.title = text;
        if (!feature("content.tooltips"))
          return EMPTY;
        return mountInlineTooltip2(host, { viewport$: viewport$3 }).pipe(
          takeUntil(document$2.pipe(skip(1))),
          finalize(() => host.removeAttribute("title"))
        );
      })
    ).subscribe();
    if (feature("content.tooltips"))
      document$2.pipe(
        switchMap(() => getElements(".md-status")),
        mergeMap((el) => mountInlineTooltip2(el, { viewport$: viewport$3 }))
      ).subscribe();
  }

  // src/templates/assets/javascripts/patches/indeterminate/index.ts
  function patchIndeterminate({ document$: document$2, tablet$: tablet$2 }) {
    document$2.pipe(
      switchMap(() => getElements(
        ".md-toggle--indeterminate"
      )),
      tap((el) => {
        el.indeterminate = true;
        el.checked = false;
      }),
      mergeMap(
        (el) => fromEvent(el, "change").pipe(
          takeWhile(() => el.classList.contains("md-toggle--indeterminate")),
          map(() => el)
        )
      ),
      withLatestFrom(tablet$2)
    ).subscribe(([el, tablet]) => {
      el.classList.remove("md-toggle--indeterminate");
      if (tablet)
        el.checked = false;
    });
  }

  // src/templates/assets/javascripts/patches/scrollfix/index.ts
  function isAppleDevice() {
    return /(iPad|iPhone|iPod)/.test(navigator.userAgent);
  }
  function patchScrollfix({ document$: document$2 }) {
    document$2.pipe(
      switchMap(() => getElements("[data-md-scrollfix]")),
      tap((el) => el.removeAttribute("data-md-scrollfix")),
      filter(isAppleDevice),
      mergeMap(
        (el) => fromEvent(el, "touchstart").pipe(
          map(() => el)
        )
      )
    ).subscribe((el) => {
      const top = el.scrollTop;
      if (top === 0) {
        el.scrollTop = 1;
      } else if (top + el.offsetHeight === el.scrollHeight) {
        el.scrollTop = top - 1;
      }
    });
  }

  // src/templates/assets/javascripts/patches/scrolllock/index.ts
  function patchScrolllock({ viewport$: viewport$3, tablet$: tablet$2 }) {
    combineLatest([watchToggle("search"), tablet$2]).pipe(
      map(([active, tablet]) => active && !tablet),
      switchMap(
        (active) => of(active).pipe(
          delay(active ? 400 : 100)
        )
      ),
      withLatestFrom(viewport$3)
    ).subscribe(([active, { offset: { y } }]) => {
      if (active) {
        document.body.setAttribute("data-md-scrolllock", "");
        document.body.style.top = `-${y}px`;
      } else {
        const value = -1 * parseInt(document.body.style.top, 10);
        document.body.removeAttribute("data-md-scrolllock");
        document.body.style.top = "";
        if (value)
          window.scrollTo(0, value);
      }
    });
  }

  // src/templates/assets/javascripts/polyfills/index.ts
  if (!Object.entries)
    Object.entries = function(obj) {
      const data = [];
      for (const key of Object.keys(obj))
        data.push([key, obj[key]]);
      return data;
    };
  if (!Object.values)
    Object.values = function(obj) {
      const data = [];
      for (const key of Object.keys(obj))
        data.push(obj[key]);
      return data;
    };
  if (typeof Element !== "undefined") {
    if (!Element.prototype.scrollTo)
      Element.prototype.scrollTo = function(x, y) {
        if (typeof x === "object") {
          this.scrollLeft = x.left;
          this.scrollTop = x.top;
        } else {
          this.scrollLeft = x;
          this.scrollTop = y;
        }
      };
    if (!Element.prototype.replaceWith)
      Element.prototype.replaceWith = function(...nodes) {
        const parent = this.parentNode;
        if (parent) {
          if (nodes.length === 0)
            parent.removeChild(this);
          for (let i = nodes.length - 1; i >= 0; i--) {
            let node = nodes[i];
            if (typeof node === "string")
              node = document.createTextNode(node);
            else if (node.parentNode)
              node.parentNode.removeChild(node);
            if (!i)
              parent.replaceChild(node, this);
            else
              parent.insertBefore(this.previousSibling, node);
          }
        }
      };
  }

  // src/templates/assets/javascripts/bundle.ts
  function fetchSearchIndex() {
    if (location.protocol === "file:") {
      return watchScript(
        `${new URL("search/search_index.js", config3.base)}`
      ).pipe(
        // @ts-ignore - @todo fix typings
        map(() => __index),
        shareReplay(1)
      );
    } else {
      return requestJSON(
        new URL("search/search_index.json", config3.base)
      );
    }
  }
  document.documentElement.classList.remove("no-js");
  document.documentElement.classList.add("js");
  var document$ = watchDocument();
  var location$ = watchLocation();
  var target$ = watchLocationTarget(location$);
  var keyboard$ = watchKeyboard();
  var viewport$2 = watchViewport();
  var tablet$ = watchMedia("(min-width: 60em)");
  var screen$ = watchMedia("(min-width: 76.25em)");
  var print$ = watchPrint();
  var config3 = configuration();
  var index$ = document.forms.namedItem("search") ? fetchSearchIndex() : NEVER;
  var alert$ = new Subject();
  setupClipboardJS({ alert$ });
  setupAlternate({ document$ });
  var progress$ = new Subject();
  var sitemap$ = fetchSitemap(config3.base);
  if (feature("navigation.instant"))
    setupInstantNavigation({ sitemap$, location$, viewport$: viewport$2, progress$ }).subscribe(document$);
  var _a;
  if (((_a = config3.version) == null ? void 0 : _a.provider) === "mike")
    setupVersionSelector({ document$ });
  merge(location$, target$).pipe(
    delay(125)
  ).subscribe(() => {
    setToggle("drawer", false);
    setToggle("search", false);
  });
  keyboard$.pipe(
    filter(({ mode }) => mode === "global")
  ).subscribe((key) => {
    switch (key.type) {
      /* Go to previous page */
      case "p":
      case ",":
        const prev = getOptionalElement("link[rel=prev]");
        if (typeof prev !== "undefined")
          setLocation(prev);
        break;
      /* Go to next page */
      case "n":
      case ".":
        const next = getOptionalElement("link[rel=next]");
        if (typeof next !== "undefined")
          setLocation(next);
        break;
      /* Expand navigation, see https://bit.ly/3ZjG5io */
      case "Enter":
        const active = getActiveElement();
        if (active instanceof HTMLLabelElement)
          active.click();
    }
  });
  patchEllipsis({ viewport$: viewport$2, document$ });
  patchIndeterminate({ document$, tablet$ });
  patchScrollfix({ document$ });
  patchScrolllock({ viewport$: viewport$2, tablet$ });
  var header$ = watchHeader(getComponentElement("header"), { viewport$: viewport$2 });
  var main$ = document$.pipe(
    map(() => getComponentElement("main")),
    switchMap((el) => watchMain(el, { viewport$: viewport$2, header$ })),
    shareReplay(1)
  );
  var control$ = merge(
    ...getComponentElements("consent").map((el) => mountConsent(el, { target$ })),
    ...getComponentElements("dialog").map((el) => mountDialog(el, { alert$ })),
    ...getComponentElements("palette").map((el) => mountPalette(el)),
    ...getComponentElements("progress").map((el) => mountProgress(el, { progress$ })),
    ...getComponentElements("search").map((el) => mountSearch(el, { index$, keyboard$ })),
    ...getComponentElements("source").map((el) => mountSource(el))
  );
  var content$ = defer(() => merge(
    ...getComponentElements("announce").map((el) => mountAnnounce(el)),
    ...getComponentElements("content").map((el) => mountContent(el, { sitemap$, viewport$: viewport$2, target$, print$ })),
    ...getComponentElements("content").map(
      (el) => feature("search.highlight") ? mountSearchHiglight(el, { index$, location$ }) : EMPTY
    ),
    ...getComponentElements("header").map((el) => mountHeader(el, { viewport$: viewport$2, header$, main$ })),
    ...getComponentElements("header-title").map((el) => mountHeaderTitle(el, { viewport$: viewport$2, header$ })),
    ...getComponentElements("sidebar").map(
      (el) => el.getAttribute("data-md-type") === "navigation" ? at(screen$, () => mountSidebar(el, { viewport$: viewport$2, header$, main$ })) : at(tablet$, () => mountSidebar(el, { viewport$: viewport$2, header$, main$ }))
    ),
    ...getComponentElements("tabs").map((el) => mountTabs(el, { viewport$: viewport$2, header$ })),
    ...getComponentElements("toc").map((el) => mountTableOfContents(el, {
      viewport$: viewport$2,
      header$,
      main$,
      target$
    })),
    ...getComponentElements("top").map((el) => mountBackToTop(el, { viewport$: viewport$2, header$, main$, target$ }))
  ));
  var component$ = document$.pipe(
    switchMap(() => content$),
    mergeWith(control$),
    shareReplay(1)
  );
  component$.subscribe();
  window.document$ = document$;
  window.location$ = location$;
  window.target$ = target$;
  window.keyboard$ = keyboard$;
  window.viewport$ = viewport$2;
  window.tablet$ = tablet$;
  window.screen$ = screen$;
  window.print$ = print$;
  window.alert$ = alert$;
  window.progress$ = progress$;
  window.component$ = component$;
})();
//# sourceMappingURL=bundle.js.map

