// wanted.js - Wanted Pirates: match-ups / counters recomendados.
// Dados: ThePlayerLost. Sprites: Drakantos GLA (via Labophase).
window.GLA = window.GLA || {};
(function (GLA) {
  "use strict";

  var DATA = window.WANTED_DATA || [];
  var ALIASES = window.WANTED_ICON_ALIASES || {};
  var SORT_KEY = "wanted.sort";
  var MODE_KEY = "wanted.searchMode";

  var t = function (k, p) { return GLA.i18n ? GLA.i18n.t(k, p) : k; };
  var $ = function (id) { return document.getElementById(id); };

  var el = {};
  var sortMode = "original";   // "original" | "az"
  var searchMode = "target";   // "target" (por alvo) | "counter" (por personagem)

  // Normaliza um nome para chave de sprite (espelha o Labophase).
  function normalizeKey(name) {
    return (name || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "")
      .replace(/_+/g, "_")
      .replace(/^mr([1-5])$/, "mr_$1");
  }

  function resolveIcon(name) {
    var clean = (name || "")
      .replace(/\([^)]*\*\)?/g, "")
      .replace(/\d+\*/g, "")
      .replace(/\s+/g, " ")
      .trim();
    var key = normalizeKey(clean);
    var mapped = ALIASES[key] || key;
    return "assets/img/characters/" + mapped + ".png";
  }

  function initials(name) {
    var clean = (name || "").replace(/\([^)]*\)/g, "").trim();
    var parts = clean.split(/\s+/).filter(Boolean);
    if (!parts.length) return "?";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  function makeChip(name, isWanted, rank, matched) {
    var chip = document.createElement("div");
    var rankCls = (rank >= 1 && rank <= 3) ? " rank-" + rank : "";
    chip.className = "wanted-chip" + (isWanted ? " is-wanted" : "") + rankCls + (matched ? " matched" : "");
    chip.title = name;

    var avatar = document.createElement("span");
    avatar.className = "wanted-avatar";
    var img = document.createElement("img");
    img.src = resolveIcon(name);
    img.alt = name;
    img.loading = "lazy";
    img.addEventListener("error", function () {
      avatar.classList.add("missing");
      avatar.textContent = initials(name);
    });
    avatar.appendChild(img);

    var label = document.createElement("span");
    label.className = "wanted-name";
    label.textContent = name;

    chip.appendChild(avatar);
    chip.appendChild(label);
    return chip;
  }

  function sortByName(rows) {
    if (sortMode === "az") {
      rows.sort(function (a, b) { return a.wanted.localeCompare(b.wanted, "pt-BR"); });
    }
    return rows;
  }

  // Melhor posicao (1..6) em que o counter buscado aparece nos options; senao Infinity.
  function matchRank(row, filter) {
    var best = Infinity;
    row.options.forEach(function (opt, i) {
      if (normalizeKey(opt).indexOf(filter) !== -1 && i + 1 < best) best = i + 1;
    });
    return best;
  }

  function renderCard(row, filter) {
    var card = document.createElement("div");
    card.className = "wanted-card";

    var head = document.createElement("div");
    head.className = "wanted-head";
    head.appendChild(makeChip(row.wanted, true));

    var arrow = document.createElement("span");
    arrow.className = "wanted-arrow";
    arrow.textContent = "\u2192";
    head.appendChild(arrow);

    var counters = document.createElement("div");
    counters.className = "wanted-counters";
    row.options.forEach(function (opt, i) {
      var matched = searchMode === "counter" && filter && normalizeKey(opt).indexOf(filter) !== -1;
      counters.appendChild(makeChip(opt, false, i + 1, matched));
    });

    card.appendChild(head);
    card.appendChild(counters);
    return card;
  }

  function render() {
    if (!el.list) return;
    var filter = normalizeKey(el.search.value.trim());
    var rows;

    if (searchMode === "counter") {
      rows = DATA.slice().filter(function (r) {
        return !filter || matchRank(r, filter) !== Infinity;
      });
      if (filter) {
        // Ordena pelos wanteds em que o personagem e o melhor counter (rank menor primeiro).
        rows.sort(function (a, b) {
          var ra = matchRank(a, filter), rb = matchRank(b, filter);
          if (ra !== rb) return ra - rb;
          return a.wanted.localeCompare(b.wanted, "pt-BR");
        });
      } else {
        sortByName(rows);
      }
    } else {
      rows = sortByName(DATA.slice()).filter(function (r) {
        return !filter || normalizeKey(r.wanted).indexOf(filter) !== -1;
      });
    }

    el.count.textContent = rows.length + " / " + DATA.length;
    el.list.innerHTML = "";

    if (rows.length === 0) {
      var msg = searchMode === "counter" ? t("wanted.noResultsCounter") : t("wanted.noResults");
      el.list.innerHTML = '<p class="wanted-empty">' + msg + "</p>";
      return;
    }

    var frag = document.createDocumentFragment();
    rows.forEach(function (row) { frag.appendChild(renderCard(row, filter)); });
    el.list.appendChild(frag);
  }

  function buildDatalist() {
    var dl = $("wanted-char-list");
    if (!dl) return;
    var set = {};
    if (searchMode === "counter") {
      DATA.forEach(function (r) { r.options.forEach(function (o) { set[o] = true; }); });
    } else {
      DATA.forEach(function (r) { set[r.wanted] = true; });
    }
    var names = Object.keys(set).sort(function (a, b) { return a.localeCompare(b, "pt-BR"); });
    dl.innerHTML = names.map(function (n) { return '<option value="' + n.replace(/"/g, "&quot;") + '"></option>'; }).join("");
  }

  function setSearchMode(mode) {
    searchMode = mode === "counter" ? "counter" : "target";
    GLA.profiles.set(MODE_KEY, searchMode);
    if (el.modeTarget) el.modeTarget.classList.toggle("active", searchMode === "target");
    if (el.modeCounter) el.modeCounter.classList.toggle("active", searchMode === "counter");
    if (el.search) {
      var phKey = searchMode === "counter" ? "wanted.searchPhChar" : "wanted.searchPh";
      el.search.setAttribute("data-i18n-placeholder", phKey);
      el.search.placeholder = t(phKey);
    }
    buildDatalist();
    render();
  }

  function setSort(mode) {
    sortMode = mode === "az" ? "az" : "original";
    GLA.profiles.set(SORT_KEY, sortMode);
    if (el.sortAz) el.sortAz.classList.toggle("active", sortMode === "az");
    if (el.sortOriginal) el.sortOriginal.classList.toggle("active", sortMode === "original");
    render();
  }

  function init() {
    if (!$("view-wanted")) return;
    el = {
      search: $("wanted-search"),
      count: $("wanted-count"),
      list: $("wanted-list"),
      sortAz: $("wanted-sort-az"),
      sortOriginal: $("wanted-sort-original"),
      modeTarget: $("wanted-mode-target"),
      modeCounter: $("wanted-mode-counter")
    };

    el.search.addEventListener("input", render);
    el.sortAz.addEventListener("click", function () { setSort("az"); });
    el.sortOriginal.addEventListener("click", function () { setSort("original"); });
    el.modeTarget.addEventListener("click", function () { setSearchMode("target"); });
    el.modeCounter.addEventListener("click", function () { setSearchMode("counter"); });

    sortMode = GLA.profiles.get(SORT_KEY, "original");
    if (el.sortAz) el.sortAz.classList.toggle("active", sortMode === "az");
    if (el.sortOriginal) el.sortOriginal.classList.toggle("active", sortMode === "original");
    searchMode = GLA.profiles.get(MODE_KEY, "target");
    setSearchMode(searchMode);

    GLA.bus.on("profile:change", function () {
      sortMode = GLA.profiles.get(SORT_KEY, "original");
      if (el.sortAz) el.sortAz.classList.toggle("active", sortMode === "az");
      if (el.sortOriginal) el.sortOriginal.classList.toggle("active", sortMode === "original");
      searchMode = GLA.profiles.get(MODE_KEY, "target");
      setSearchMode(searchMode);
    });
    GLA.bus.on("lang:change", render);
  }

  GLA.router && GLA.router.register("wanted", { init: init });
})(window.GLA);
