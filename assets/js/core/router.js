// router.js - roteador por hash (#/view) com init preguicoso por feature.
window.GLA = window.GLA || {};
(function (GLA) {
  "use strict";

  var features = {};   // id -> { init, onShow }
  var initialized = {}; // id -> true
  var currentId = null;
  var defaultId = "home";

  function parseHash() {
    var h = location.hash || "";
    var m = /^#\/?([\w-]+)/.exec(h);
    return m ? m[1] : null;
  }

  function knownView(id) {
    return !!document.querySelector('[data-view="' + id + '"]');
  }

  function render(id) {
    if (!knownView(id)) id = defaultId;
    currentId = id;

    document.querySelectorAll("[data-view]").forEach(function (el) {
      el.classList.toggle("active", el.getAttribute("data-view") === id);
    });
    document.querySelectorAll("[data-nav]").forEach(function (el) {
      el.classList.toggle("active", el.getAttribute("data-nav") === id);
    });

    var feature = features[id];
    if (feature) {
      if (!initialized[id] && typeof feature.init === "function") {
        try { feature.init(); } catch (e) { console.error("[" + id + "] init:", e); }
        initialized[id] = true;
      }
      if (typeof feature.onShow === "function") {
        try { feature.onShow(); } catch (e) { console.error("[" + id + "] onShow:", e); }
      }
    }

    window.scrollTo({ top: 0, behavior: "auto" });
    GLA.bus.emit("route:change", id);
  }

  function onHashChange() { render(parseHash() || defaultId); }

  GLA.router = {
    register: function (id, feature) { features[id] = feature || {}; },
    go: function (id) {
      if (parseHash() === id) { render(id); }
      else { location.hash = "#/" + id; }
    },
    current: function () { return currentId; },
    start: function (fallback) {
      if (fallback) defaultId = fallback;
      window.addEventListener("hashchange", onHashChange);
      render(parseHash() || defaultId);
    }
  };
})(window.GLA);
