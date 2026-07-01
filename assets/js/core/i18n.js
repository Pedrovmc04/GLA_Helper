// i18n.js - traducao simples baseada em data-i18n + funcao t().
window.GLA = window.GLA || {};
(function (GLA) {
  "use strict";

  var LANG_KEY = "gla.lang";
  var dicts = window.GLA_I18N || {};
  var DEFAULT_LANG = "pt-BR";
  var current = DEFAULT_LANG;

  function has(lang) { return Object.prototype.hasOwnProperty.call(dicts, lang); }

  function interpolate(str, params) {
    if (!params) return str;
    return str.replace(/\{(\w+)\}/g, function (m, key) {
      return params[key] != null ? params[key] : m;
    });
  }

  function t(key, params) {
    var dict = dicts[current] || dicts[DEFAULT_LANG] || {};
    var val = dict[key];
    if (val == null && current !== DEFAULT_LANG) {
      val = (dicts[DEFAULT_LANG] || {})[key];
    }
    if (val == null) return key;
    return interpolate(val, params);
  }

  function apply(root) {
    root = root || document;
    root.querySelectorAll("[data-i18n]").forEach(function (el) {
      el.textContent = t(el.getAttribute("data-i18n"));
    });
    root.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      el.innerHTML = t(el.getAttribute("data-i18n-html"));
    });
    root.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
      el.setAttribute("placeholder", t(el.getAttribute("data-i18n-placeholder")));
    });
    root.querySelectorAll("[data-i18n-title]").forEach(function (el) {
      el.setAttribute("title", t(el.getAttribute("data-i18n-title")));
    });
  }

  function setLang(lang) {
    if (!has(lang)) lang = DEFAULT_LANG;
    current = lang;
    GLA.storage.setRaw(LANG_KEY, lang);
    document.documentElement.setAttribute("lang", lang);
    apply(document);
    GLA.bus.emit("lang:change", lang);
  }

  function init() {
    var saved = GLA.storage.getRaw(LANG_KEY);
    current = saved && has(saved) ? saved : DEFAULT_LANG;
  }

  GLA.i18n = {
    t: t,
    apply: apply,
    setLang: setLang,
    init: init,
    current: function () { return current; },
    langs: function () { return Object.keys(dicts); }
  };
})(window.GLA);
