// profiles.js - perfis em localStorage com dados por perfil, export/import e link.
window.GLA = window.GLA || {};
(function (GLA) {
  "use strict";

  var INDEX_KEY = "gla.profiles";
  var DATA_PREFIX = "gla.pdata.";
  var storage = GLA.storage;

  var state = { profiles: [], activeId: null };

  function uid() {
    return "p" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function persist() {
    storage.setJSON(INDEX_KEY, state);
  }

  function dataKey(id) { return DATA_PREFIX + id; }

  function loadData(id) { return storage.getJSON(dataKey(id), {}); }
  function saveData(id, data) { storage.setJSON(dataKey(id), data || {}); }

  function findIndex(id) {
    for (var i = 0; i < state.profiles.length; i++) {
      if (state.profiles[i].id === id) return i;
    }
    return -1;
  }

  // ---- Base64 unicode-safe ----
  function encode(obj) {
    return btoa(unescape(encodeURIComponent(JSON.stringify(obj))));
  }
  function decode(str) {
    return JSON.parse(decodeURIComponent(escape(atob(str))));
  }

  var api = {
    init: function () {
      var loaded = storage.getJSON(INDEX_KEY, null);
      if (loaded && Array.isArray(loaded.profiles) && loaded.profiles.length) {
        state = loaded;
      } else {
        var p = { id: uid(), name: "Padrao", emoji: "\uD83D\uDC64", color: "#e8c468" };
        state = { profiles: [p], activeId: p.id };
        persist();
      }
      if (findIndex(state.activeId) === -1) {
        state.activeId = state.profiles[0].id;
        persist();
      }
      this.applyShareFromURL();
    },

    list: function () { return state.profiles.slice(); },

    active: function () {
      var i = findIndex(state.activeId);
      return i === -1 ? state.profiles[0] : state.profiles[i];
    },

    setActive: function (id) {
      if (findIndex(id) === -1) return;
      state.activeId = id;
      persist();
      GLA.bus.emit("profile:change", this.active());
    },

    // Cria (sem id) ou atualiza (com id). Retorna o perfil.
    upsert: function (profile) {
      var clean = {
        name: (profile.name || "").trim() || "Perfil",
        emoji: (profile.emoji || "\uD83D\uDC64").trim() || "\uD83D\uDC64",
        color: profile.color || "#e8c468"
      };
      if (profile.id && findIndex(profile.id) !== -1) {
        var i = findIndex(profile.id);
        state.profiles[i] = Object.assign({}, state.profiles[i], clean);
        persist();
        GLA.bus.emit("profile:change", this.active());
        return state.profiles[i];
      }
      var created = Object.assign({ id: uid() }, clean);
      state.profiles.push(created);
      state.activeId = created.id;
      persist();
      GLA.bus.emit("profile:change", this.active());
      return created;
    },

    remove: function (id) {
      if (state.profiles.length <= 1) return false;
      var i = findIndex(id);
      if (i === -1) return false;
      state.profiles.splice(i, 1);
      storage.removeRaw(dataKey(id));
      if (state.activeId === id) state.activeId = state.profiles[0].id;
      persist();
      GLA.bus.emit("profile:change", this.active());
      return true;
    },

    // ---- Dados escopados no perfil ativo ----
    get: function (key, fallback) {
      var data = loadData(state.activeId);
      return Object.prototype.hasOwnProperty.call(data, key) ? data[key] : fallback;
    },
    set: function (key, value) {
      var data = loadData(state.activeId);
      data[key] = value;
      saveData(state.activeId, data);
    },

    // ---- Export / Import / Link ----
    exportActive: function () {
      var p = this.active();
      return {
        _type: "gla-profile",
        v: 1,
        profile: { name: p.name, emoji: p.emoji, color: p.color },
        data: loadData(p.id)
      };
    },

    importPayload: function (payload) {
      if (!payload || payload._type !== "gla-profile" || !payload.profile) {
        throw new Error("invalid");
      }
      var created = this.upsert({
        name: payload.profile.name,
        emoji: payload.profile.emoji,
        color: payload.profile.color
      });
      saveData(created.id, payload.data || {});
      GLA.bus.emit("profile:change", this.active());
      return created;
    },

    shareText: function () {
      var payload = this.exportActive();
      var base = location.href.split("#")[0].split("?")[0];
      return base + "?p=" + encode(payload) + location.hash;
    },

    applyShareFromURL: function () {
      var match = /[?&]p=([^&#]+)/.exec(location.search);
      if (!match) return false;
      try {
        var payload = decode(decodeURIComponent(match[1]));
        this.importPayload(payload);
      } catch (e) {
        return false;
      }
      // Limpa o parametro da URL para nao reimportar em refresh.
      var clean = location.href.replace(/([?&])p=[^&#]+(&|$)/, "$1").replace(/[?&]$/, "");
      try { history.replaceState(null, "", clean); } catch (e) {}
      return true;
    }
  };

  GLA.profiles = api;
})(window.GLA);
