// wanted.js - Wanted Pirates: match-ups / counters recomendados.
// Dados: ThePlayerLost. Sprites: Drakantos GLA (via Labophase).
window.GLA = window.GLA || {};
(function (GLA) {
  "use strict";

  var DATA = window.WANTED_DATA || [];
  var ALIASES = window.WANTED_ICON_ALIASES || {};
  var SORT_KEY = "wanted.sort";

  var t = function (k, p) { return GLA.i18n ? GLA.i18n.t(k, p) : k; };
  var $ = function (id) { return document.getElementById(id); };

  var el = {};
  var sortMode = "original"; // "original" | "az"

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

  function makeChip(name, isWanted, rank) {
    var chip = document.createElement("div");
    var rankCls = (rank >= 1 && rank <= 3) ? " rank-" + rank : "";
    chip.className = "wanted-chip" + (isWanted ? " is-wanted" : "") + rankCls;
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

  function getRows() {
    var rows = DATA.slice();
    if (sortMode === "az") {
      rows.sort(function (a, b) { return a.wanted.localeCompare(b.wanted, "pt-BR"); });
    }
    return rows;
  }

  function render() {
    if (!el.list) return;
    var filter = normalizeKey(el.search.value.trim());
    var rows = getRows().filter(function (r) {
      if (!filter) return true;
      return normalizeKey(r.wanted).indexOf(filter) !== -1;
    });

    el.count.textContent = rows.length + " / " + DATA.length;
    el.list.innerHTML = "";

    if (rows.length === 0) {
      el.list.innerHTML = '<p class="wanted-empty">' + t("wanted.noResults") + "</p>";
      return;
    }

    var frag = document.createDocumentFragment();
    rows.forEach(function (row) {
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
      row.options.forEach(function (opt, i) { counters.appendChild(makeChip(opt, false, i + 1)); });

      card.appendChild(head);
      card.appendChild(counters);
      frag.appendChild(card);
    });
    el.list.appendChild(frag);
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
      sortOriginal: $("wanted-sort-original")
    };

    el.search.addEventListener("input", render);
    el.sortAz.addEventListener("click", function () { setSort("az"); });
    el.sortOriginal.addEventListener("click", function () { setSort("original"); });

    sortMode = GLA.profiles.get(SORT_KEY, "original");
    setSort(sortMode);

    GLA.bus.on("profile:change", function () {
      sortMode = GLA.profiles.get(SORT_KEY, "original");
      setSort(sortMode);
    });
    GLA.bus.on("lang:change", render);
  }

  GLA.router && GLA.router.register("wanted", { init: init });
})(window.GLA);
