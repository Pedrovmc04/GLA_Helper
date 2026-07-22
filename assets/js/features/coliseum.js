// coliseum.js - Corrida Colosseum: recomendacoes de picks por liga.
// Dados: Wiki GLA + recomendacoes do usuario. Sprites: assets/img/characters e assets/img/xp.
window.GLA = window.GLA || {};
(function (GLA) {
  "use strict";

  var DATA = window.COLISEUM_DATA || null;
  var t = function (k, p) { return GLA.i18n ? GLA.i18n.t(k, p) : k; };
  var $ = function (id) { return document.getElementById(id); };

  function initials(name) {
    var parts = (name || "").replace(/\([^)]*\)/g, "").trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return "?";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  function makeAvatar(id, name) {
    var avatar = document.createElement("span");
    avatar.className = "col-avatar";
    var img = document.createElement("img");
    img.src = "assets/img/characters/" + id + ".png";
    img.alt = name;
    img.loading = "lazy";
    img.addEventListener("error", function () {
      avatar.classList.add("missing");
      avatar.textContent = initials(name);
    });
    avatar.appendChild(img);
    return avatar;
  }

  function makeStars(stars, tier) {
    var wrap = document.createElement("div");
    wrap.className = "col-stars col-stars-" + tier;
    var icon = "assets/img/xp/" + (tier === "silver" ? "silver_tier" : "gold_tier") + ".png";
    var altKey = tier === "silver" ? "coliseum.starsSilver" : "coliseum.starsGold";
    wrap.title = stars + " " + t(altKey);
    for (var i = 0; i < stars; i++) {
      var img = document.createElement("img");
      img.src = icon;
      img.alt = t(altKey);
      img.loading = "lazy";
      wrap.appendChild(img);
    }
    return wrap;
  }

  function makeSide(name, id, isNpc, row) {
    var side = document.createElement("div");
    side.className = "col-side" + (isNpc ? " is-npc" : " is-pick");
    side.appendChild(makeAvatar(id, name));

    var label = document.createElement("span");
    label.className = "col-name";
    label.textContent = name;
    side.appendChild(label);

    if (!isNpc) {
      side.appendChild(makeStars(row.stars, row.tier));
    }
    return side;
  }

  function makeRow(row) {
    var el = document.createElement("div");
    el.className = "col-row";

    el.appendChild(makeSide(row.npcName, row.npcId, true, row));

    var vs = document.createElement("span");
    vs.className = "col-vs";
    vs.textContent = "VS";
    el.appendChild(vs);

    el.appendChild(makeSide(row.pickName, row.pickId, false, row));
    return el;
  }

  function makeLeague(league) {
    var card = document.createElement("section");
    card.className = "col-league";

    var head = document.createElement("div");
    head.className = "col-league-head";
    var title = document.createElement("h3");
    title.className = "col-league-title";
    title.textContent = league.name;
    head.appendChild(title);
    if (league.reward) {
      var reward = document.createElement("span");
      reward.className = "col-reward";
      reward.textContent = t("coliseum.reward") + ": " + league.reward;
      head.appendChild(reward);
    }
    card.appendChild(head);

    var rows = document.createElement("div");
    rows.className = "col-rows";
    league.rows.forEach(function (r) { rows.appendChild(makeRow(r)); });
    card.appendChild(rows);
    return card;
  }

  function makeInfoPanel() {
    var panel = document.createElement("div");
    panel.className = "panel col-info";

    var h = document.createElement("h3");
    h.className = "col-info-title";
    h.textContent = t("coliseum.infoTitle");
    panel.appendChild(h);

    var ul = document.createElement("ul");
    ul.className = "col-info-list";
    (DATA.info || []).forEach(function (line) {
      var li = document.createElement("li");
      li.textContent = line;
      ul.appendChild(li);
    });
    panel.appendChild(ul);

    if (DATA.rewardsTotal && DATA.rewardsTotal.length) {
      var rh = document.createElement("h3");
      rh.className = "col-info-title";
      rh.textContent = t("coliseum.rewardsTitle");
      panel.appendChild(rh);
      var rul = document.createElement("ul");
      rul.className = "col-info-list";
      DATA.rewardsTotal.forEach(function (line) {
        var li = document.createElement("li");
        li.textContent = line;
        rul.appendChild(li);
      });
      panel.appendChild(rul);
    }
    return panel;
  }

  function makeLeftovers() {
    if (!DATA.leftovers || !DATA.leftovers.length) return null;
    var p = document.createElement("p");
    p.className = "muted small col-leftovers";
    p.textContent = t("coliseum.leftovers") + ": " + DATA.leftovers.join(", ") + ".";
    return p;
  }

  function init() {
    var host = $("coliseum-list");
    if (!host || !DATA) return;
    host.innerHTML = "";

    var frag = document.createDocumentFragment();
    frag.appendChild(makeInfoPanel());
    (DATA.leagues || []).forEach(function (lg) { frag.appendChild(makeLeague(lg)); });
    var lo = makeLeftovers();
    if (lo) frag.appendChild(lo);
    host.appendChild(frag);
  }

  GLA.router && GLA.router.register("coliseum", { init: init, onShow: function () {
    // Re-render se o idioma mudou enquanto estava em outra view.
    if (GLA._coliseumLang !== (GLA.i18n && GLA.i18n.current())) {
      GLA._coliseumLang = GLA.i18n && GLA.i18n.current();
      init();
    }
  } });

  GLA.bus && GLA.bus.on && GLA.bus.on("lang:change", function () {
    if (GLA.router && GLA.router.current() === "coliseum") init();
  });
})(window.GLA);
