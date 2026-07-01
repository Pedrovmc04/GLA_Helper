// storage.js - acesso seguro ao localStorage e um mini event bus.
window.GLA = window.GLA || {};
(function (GLA) {
  "use strict";

  function getRaw(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }
  function setRaw(key, value) {
    try { localStorage.setItem(key, value); } catch (e) {}
  }
  function removeRaw(key) {
    try { localStorage.removeItem(key); } catch (e) {}
  }

  GLA.storage = {
    getRaw: getRaw,
    setRaw: setRaw,
    removeRaw: removeRaw,
    getJSON: function (key, fallback) {
      var v = getRaw(key);
      if (v == null) return fallback;
      try { return JSON.parse(v); } catch (e) { return fallback; }
    },
    setJSON: function (key, obj) { setRaw(key, JSON.stringify(obj)); }
  };

  // Event bus simples (pub/sub).
  var listeners = {};
  GLA.bus = {
    on: function (evt, cb) {
      (listeners[evt] = listeners[evt] || []).push(cb);
      return function () {
        listeners[evt] = (listeners[evt] || []).filter(function (f) { return f !== cb; });
      };
    },
    emit: function (evt, payload) {
      (listeners[evt] || []).slice().forEach(function (cb) {
        try { cb(payload); } catch (e) { console.error(e); }
      });
    }
  };
})(window.GLA);
