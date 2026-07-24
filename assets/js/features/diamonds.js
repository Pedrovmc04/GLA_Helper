// diamonds.js - Planejador de Diamantes (Conquista de Diamantes).
// Otimizador: cobertura minima de personagens que cubram todos os diamantes selecionados.
window.GLA = window.GLA || {};
(function (GLA) {
  "use strict";

  var D = window.DIAMONDS_DATA || null;
  var t = function (k, p) { return GLA.i18n ? GLA.i18n.t(k, p) : k; };
  var $ = function (id) { return document.getElementById(id); };
  var SEL_KEY = "diamonds.selected";
  var CHAR_KEY = "diamonds.characters";

  var selected = {}; // diamondKey -> bool
  var chosen = {}; // character id -> bool (manual pool)
  var lastResult = null;

  function charSprite(id) { return "assets/img/characters/" + id + ".png"; }
  function diamondSprite(dia) { return "assets/img/characters/" + dia.sprite + ".png"; }

  function initials(name) {
    var p = (name || "").trim().split(/\s+/).filter(Boolean);
    if (!p.length) return "?";
    return (p.length === 1 ? p[0].slice(0, 2) : p[0][0] + p[p.length - 1][0]).toUpperCase();
  }
  function iconEl(src, name) {
    var span = document.createElement("span");
    span.className = "dia-ico";
    var img = document.createElement("img");
    img.src = src; img.alt = name; img.loading = "lazy";
    img.addEventListener("error", function () { span.classList.add("missing"); span.textContent = initials(name); });
    span.appendChild(img);
    return span;
  }

  function selectedDiamonds() {
    return D.diamonds.filter(function (d) { return selected[d.key]; });
  }

  function syncMandatoryCharacters() {
    var needsEnel = selectedDiamonds().some(function (d) { return d.reqClass === "Enel"; });
    D.chars.forEach(function (c) {
      if (c.classes.indexOf("Enel") !== -1) {
        if (needsEnel) chosen[c.id] = true;
        else if (chosen[c.id]) delete chosen[c.id];
      }
    });
  }

  // ----- Otimizador: minimo de personagens por categoria -----
  // O estado guarda, para cada categoria, quantos personagens ja foram
  // escolhidos (limitado a 5). Enel e pre-selecionado integralmente.
  function optimize(dias) {
    var normal = [];
    var targets = {};
    var needsEnel = dias.some(function (d) { return d.reqClass === "Enel"; });
    dias.forEach(function (d) {
      if (d.reqClass !== "Enel" && targets[d.reqClass] === undefined) {
        targets[d.reqClass] = 5;
        normal.push(d.reqClass);
      }
    });

    var hasManualPool = D.chars.some(function (c) {
      return chosen[c.id] && c.classes.indexOf("Enel") === -1;
    });
    var candidates = D.chars.filter(function (c) {
      var isEnel = c.classes.indexOf("Enel") !== -1;
      return (needsEnel && isEnel) || (!isEnel && (chosen[c.id] || !hasManualPool));
    });
    var allEnel = D.chars.filter(function (c) { return c.classes.indexOf("Enel") !== -1; });
    var enel = candidates.filter(function (c) { return c.classes.indexOf("Enel") !== -1; });
    var base = enel.slice();
    var pool = candidates.filter(function (c) { return c.classes.indexOf("Enel") === -1; });
    var zero = normal.map(function () { return 0; });
    var keyOf = function (counts) { return counts.join(","); };
    var cap = function (value, i) { return Math.min(value, targets[normal[i]] || 5); };
    var dp = {};
    dp[keyOf(zero)] = { chars: [], counts: zero };

    pool.forEach(function (c) {
      var entries = Object.keys(dp).map(function (key) { return dp[key]; });
      entries.forEach(function (state) {
        var next = state.counts.slice();
        normal.forEach(function (cl, i) {
          if (c.classes.indexOf(cl) !== -1) next[i] = cap(next[i] + 1, i);
        });
        var key = keyOf(next);
        if (key !== keyOf(state.counts) && (!dp[key] || dp[key].chars.length > state.chars.length + 1)) {
          dp[key] = { chars: state.chars.concat([c]), counts: next };
        }
      });
    });

    var target = normal.map(function (cl) { return targets[cl]; });
    var state = dp[keyOf(target)];
    var missing = [];
    if (!state) {
      normal.forEach(function (cl, i) {
        if (!Object.keys(dp).some(function (key) { return dp[key].counts[i] >= target[i]; })) missing.push(cl);
      });
      state = { chars: [], counts: zero };
    }
    var all = base.concat(state.chars);
    if (needsEnel && enel.length !== allEnel.length) {
      missing.push("Enel");
    }
    return { chars: all, missing: missing, candidates: candidates };
  }

  // ----- Render -----
  function renderGrid() {
    var host = $("diamonds-grid");
    if (!host) return;
    host.innerHTML = "";
    D.diamonds.forEach(function (d) {
      var on = !!selected[d.key];
      var card = document.createElement("button");
      card.type = "button";
      card.className = "dia-card" + (on ? " on" : "");
      card.setAttribute("data-dia", d.key);
      card.appendChild(iconEl(diamondSprite(d), d.name));
      var nm = document.createElement("span");
      nm.className = "dia-name";
      nm.textContent = d.name;
      card.appendChild(nm);
      var cls = document.createElement("span");
      cls.className = "dia-class";
      cls.textContent = d.reqClass;
      card.appendChild(cls);
      host.appendChild(card);
    });
  }

  function renderCharacterLists() {
    var host = $("diamonds-character-lists");
    if (!host) return;
    host.innerHTML = "";
    var dias = selectedDiamonds();
    if (!dias.length) return;
    dias.forEach(function (d) {
      var section = document.createElement("section");
      section.className = "dia-character-section";
      var title = document.createElement("h3");
      title.textContent = d.name + " — " + d.reqClass + (d.reqClass === "Enel" ? " (todos)" : " (min. 5)");
      section.appendChild(title);
      var list = document.createElement("div");
      list.className = "dia-character-grid";
      D.chars.filter(function (c) { return c.classes.indexOf(d.reqClass) !== -1; }).forEach(function (c) {
        var label = document.createElement("label");
        label.className = "dia-character" + (chosen[c.id] ? " picked" : "");
        var input = document.createElement("input");
        input.type = "checkbox";
        input.checked = !!chosen[c.id];
        input.setAttribute("data-char", c.id);
        input.disabled = d.reqClass === "Enel";
        label.appendChild(input);
        label.appendChild(iconEl(charSprite(c.id), c.name));
        var name = document.createElement("span");
        name.textContent = c.name;
        label.appendChild(name);
        list.appendChild(label);
      });
      section.appendChild(list);
      host.appendChild(section);
    });
  }

  function renderResult() {
    var host = $("diamonds-result");
    if (!host) return;
    host.innerHTML = "";
    var dias = selectedDiamonds();
    if (!dias.length) {
      host.innerHTML = '<p class="dia-empty">' + t("diamonds.empty") + "</p>";
      return;
    }

    if (!lastResult) {
      host.innerHTML = '<p class="dia-empty">' + t("diamonds.optimizeHint") + "</p>";
      return;
    }
    var res = lastResult;

    var head = document.createElement("div");
    head.className = "dia-result-head";
    head.innerHTML = "<span>" + t("diamonds.minChars") + "</span><strong>" + res.chars.length + "</strong>";
    host.appendChild(head);

    // Lista dos personagens escolhidos + quais diamantes cada um cobre.
    var list = document.createElement("div");
    list.className = "dia-solution";
    res.chars.forEach(function (c) {
      var covers = dias.filter(function (d) { return c.classes.indexOf(d.reqClass) !== -1; });
      var row = document.createElement("div");
      row.className = "dia-sol-row";
      row.appendChild(iconEl(charSprite(c.id), c.name));
      var info = document.createElement("div");
      info.className = "dia-sol-info";
      var nm = document.createElement("div");
      nm.className = "dia-sol-name";
      nm.textContent = c.name;
      info.appendChild(nm);
      var tags = document.createElement("div");
      tags.className = "dia-tags";
      covers.forEach(function (d) {
        var tg = document.createElement("span");
        tg.className = "dia-tag";
        tg.textContent = d.name + " (" + d.reqClass + ")";
        tags.appendChild(tg);
      });
      info.appendChild(tags);
      row.appendChild(info);
      list.appendChild(row);
    });
    host.appendChild(list);

    if (res.missing && res.missing.length) {
      var warn = document.createElement("p");
      warn.className = "dia-warn";
      warn.textContent = t("diamonds.impossible") + " " + res.missing.join(", ") + ".";
      host.appendChild(warn);
    }
  }

  function render() { renderGrid(); renderCharacterLists(); renderResult(); }

  function save() { GLA.profiles.set(SEL_KEY, selected); }
  function load() {
    selected = GLA.profiles.get(SEL_KEY, {}) || {};
    chosen = GLA.profiles.get(CHAR_KEY, {}) || {};
    syncMandatoryCharacters();
  }

  function init() {
    if (!$("view-diamonds") || !D) return;
    load();

    var grid = $("diamonds-grid");
    if (grid) {
      grid.addEventListener("click", function (e) {
        var card = e.target.closest("[data-dia]");
        if (!card) return;
        var k = card.getAttribute("data-dia");
        selected[k] = !selected[k];
        syncMandatoryCharacters();
        lastResult = null;
        save();
        GLA.profiles.set(CHAR_KEY, chosen);
        card.classList.toggle("on", !!selected[k]);
        render();
      });
    }

    var chars = $("diamonds-character-lists");
    if (chars) {
      chars.addEventListener("change", function (e) {
        var input = e.target.closest("[data-char]");
        if (!input) return;
        chosen[input.getAttribute("data-char")] = input.checked;
        lastResult = null;
        GLA.profiles.set(CHAR_KEY, chosen);
        renderCharacterLists();
        renderResult();
      });
    }

    var optimizeBtn = $("diamonds-optimize");
    if (optimizeBtn) optimizeBtn.addEventListener("click", function () {
      var dias = selectedDiamonds();
      lastResult = dias.length ? optimize(dias) : null;
      if (lastResult && !lastResult.missing.length) {
        chosen = {};
        lastResult.chars.forEach(function (c) { chosen[c.id] = true; });
        GLA.profiles.set(CHAR_KEY, chosen);
      }
      render();
    });

    var all = $("diamonds-all");
    if (all) all.addEventListener("click", function () { D.diamonds.forEach(function (d) { selected[d.key] = true; }); syncMandatoryCharacters(); lastResult = null; save(); GLA.profiles.set(CHAR_KEY, chosen); render(); });
    var clr = $("diamonds-clear");
    if (clr) clr.addEventListener("click", function () { selected = {}; chosen = {}; lastResult = null; save(); GLA.profiles.set(CHAR_KEY, chosen); render(); });

    render();
    GLA.bus.on("profile:change", function () { load(); render(); });
  }

  GLA.router && GLA.router.register("diamonds", {
    init: init,
    onShow: function () {
      if (GLA._diamondsLang !== (GLA.i18n && GLA.i18n.current())) {
        GLA._diamondsLang = GLA.i18n && GLA.i18n.current();
        if ($("view-diamonds") && D && $("diamonds-grid")) render();
      }
    }
  });

  GLA.bus && GLA.bus.on && GLA.bus.on("lang:change", function () {
    if (GLA.router && GLA.router.current() === "diamonds") render();
  });
})(window.GLA);
