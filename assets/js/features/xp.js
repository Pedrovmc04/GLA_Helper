// xp.js - Calculadora de pots de XP por tier.
// Formulas e sprites baseados no Labophase (sprites: Drakantos GLA).
window.GLA = window.GLA || {};
(function (GLA) {
  "use strict";

  var LEVEL_MAX = 140;

  // Multiplicador aplicado ao valor do pot: tiers mais altos rendem menos XP
  // por pot (multiplicador menor), entao precisam de mais pots.
  var TIERS = {
    bronze:  { multiplier: 3, icon: "assets/img/xp/bronze_tier.png",  nameKey: "xp.tier.bronze" },
    silver:  { multiplier: 2, icon: "assets/img/xp/silver_tier.png",  nameKey: "xp.tier.silver" },
    gold:    { multiplier: 1, icon: "assets/img/xp/gold_tier.png",    nameKey: "xp.tier.gold" },
    diamond: { multiplier: 1, icon: "assets/img/xp/diamond_tier.png", nameKey: "xp.tier.diamond" }
  };

  var POTS = {
    small:  { baseXp: 1000,   icon: "assets/img/xp/small_xp_pot.png",  nameKey: "xp.pot.small" },
    medium: { baseXp: 10000,  icon: "assets/img/xp/medium_xp_pot.png", nameKey: "xp.pot.medium" },
    large:  { baseXp: 100000, icon: "assets/img/xp/large_xp_pot.png",  nameKey: "xp.pot.large" }
  };

  var TIER_KEY = "xp.tier";
  var STATE_KEY = "xp.state";
  var selectedTier = "bronze";

  var t = function (k, p) { return GLA.i18n ? GLA.i18n.t(k, p) : k; };
  var $ = function (id) { return document.getElementById(id); };

  // XP acumulado ate o inicio do nivel L.
  function xpTotal(level) {
    var n = level - 1;
    return (50 * Math.pow(n, 3) - 150 * Math.pow(n, 2) + 400 * n) / 3;
  }
  // XP necessario dentro do nivel L (de L para L+1).
  function xpLevel(level) {
    return 50 * level * level - 150 * level + 200;
  }

  function xpFormat(value) {
    return Number(value || 0).toLocaleString("pt-BR", { maximumFractionDigits: 0 });
  }

  function calculate(levelAtual, porcentagemAtual, levelDesejado, tierMultiplier) {
    if (
      !isFinite(levelAtual) || !isFinite(levelDesejado) || !isFinite(porcentagemAtual) ||
      levelAtual <= 0 || levelAtual > LEVEL_MAX || levelDesejado > LEVEL_MAX ||
      levelDesejado <= levelAtual || porcentagemAtual < 0 || porcentagemAtual > 100 ||
      !isFinite(tierMultiplier) || tierMultiplier <= 0
    ) {
      return { error: t("xp.error") };
    }

    var xpAtual = xpTotal(levelAtual) + (xpLevel(levelAtual) * porcentagemAtual) / 100;
    var xpDesejada = xpTotal(levelDesejado);
    var xpFaltante = Math.max(0, xpDesejada - xpAtual);

    var smallValue = POTS.small.baseXp * tierMultiplier;
    var smallNeeded = Math.ceil(xpFaltante / smallValue);

    var large = Math.floor(smallNeeded / 100);
    var remAfterLarge = smallNeeded % 100;
    var medium = Math.floor(remAfterLarge / 10);
    var small = remAfterLarge % 10;

    return { xpFaltante: xpFaltante, pots: { large: large, medium: medium, small: small } };
  }

  function renderResult(result) {
    var list = $("xp-result-list");
    var note = $("xp-result-note");
    if (!list || !note) return;
    list.innerHTML = "";

    if (result.error) {
      note.className = "xp-error";
      note.textContent = result.error;
      return;
    }

    note.className = "xp-note";
    note.textContent = t("xp.missing") + ": " + xpFormat(result.xpFaltante);

    var order = [["large", POTS.large], ["medium", POTS.medium], ["small", POTS.small]];
    var shown = 0;
    order.forEach(function (pair) {
      var amount = result.pots[pair[0]] || 0;
      if (amount <= 0) return;
      shown += 1;
      var line = document.createElement("div");
      line.className = "xp-pot-line";
      var img = document.createElement("img");
      img.src = pair[1].icon;
      img.alt = t(pair[1].nameKey);
      img.loading = "lazy";
      var span = document.createElement("span");
      span.innerHTML = t(pair[1].nameKey) + ": <strong>" + xpFormat(amount) + "</strong>";
      line.appendChild(img);
      line.appendChild(span);
      list.appendChild(line);
    });

    if (shown === 0) {
      var done = document.createElement("div");
      done.className = "xp-note";
      done.textContent = t("xp.noPots");
      list.appendChild(done);
    }
  }

  function setSelectedTier(key) {
    if (!TIERS[key]) key = "bronze";
    selectedTier = key;
    var host = $("xp-tiers");
    if (host) {
      host.querySelectorAll(".xp-tier-btn").forEach(function (btn) {
        btn.classList.toggle("active", btn.dataset.tier === key);
      });
    }
    GLA.profiles.set(TIER_KEY, key);
  }

  function buildTiers() {
    var host = $("xp-tiers");
    if (!host) return;
    host.innerHTML = "";
    Object.keys(TIERS).forEach(function (key) {
      var tier = TIERS[key];
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "xp-tier-btn";
      btn.dataset.tier = key;
      btn.title = t(tier.nameKey);
      btn.innerHTML = '<img src="' + tier.icon + '" alt="' + t(tier.nameKey) + '" loading="lazy" /><span>' + t(tier.nameKey) + "</span>";
      btn.addEventListener("click", function () {
        setSelectedTier(key);
        recalc();
      });
      host.appendChild(btn);
    });
  }

  function saveState() {
    GLA.profiles.set(STATE_KEY, {
      level: $("xp-level-current").value,
      percent: $("xp-percent-current").value,
      target: $("xp-level-target").value
    });
  }

  function loadState() {
    var tier = GLA.profiles.get(TIER_KEY, "bronze");
    setSelectedTier(tier);
    var st = GLA.profiles.get(STATE_KEY, null);
    if (st) {
      if (st.level != null) $("xp-level-current").value = st.level;
      if (st.percent != null) $("xp-percent-current").value = st.percent;
      if (st.target != null) $("xp-level-target").value = st.target;
    }
  }

  function recalc() {
    var levelAtual = Number($("xp-level-current").value || 0);
    var porcentagemAtual = Number($("xp-percent-current").value || 0);
    var levelDesejado = Number($("xp-level-target").value || 0);
    var tier = TIERS[selectedTier] || TIERS.bronze;
    saveState();
    renderResult(calculate(levelAtual, porcentagemAtual, levelDesejado, tier.multiplier));
  }

  function init() {
    if (!$("view-xp")) return;
    buildTiers();

    ["xp-level-current", "xp-percent-current", "xp-level-target"].forEach(function (id) {
      var el = $(id);
      if (!el) return;
      el.addEventListener("input", recalc);
      el.addEventListener("change", recalc);
    });

    var clearBtn = $("xp-clear-btn");
    if (clearBtn) {
      clearBtn.addEventListener("click", function () {
        $("xp-level-current").value = "1";
        $("xp-percent-current").value = "0";
        $("xp-level-target").value = "140";
        setSelectedTier("bronze");
        recalc();
      });
    }

    loadState();
    recalc();

    GLA.bus.on("profile:change", function () { loadState(); recalc(); });
    GLA.bus.on("lang:change", function () { buildTiers(); setSelectedTier(selectedTier); recalc(); });
  }

  GLA.router && GLA.router.register("xp", { init: init });
})(window.GLA);
