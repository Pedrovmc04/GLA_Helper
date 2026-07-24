// boats.js - Planejador de Barcos (kit 2-5 + Arsenal Lv6 + skins).
// Barco 6/arsenal/refinaria/skins: base no Labophase. Barcos 2-5: base no Barcos.txt.
window.GLA = window.GLA || {};
(function (GLA) {
  "use strict";

  var D = window.BOATS_DATA || null;
  var t = function (k, p) { return GLA.i18n ? GLA.i18n.t(k, p) : k; };
  var $ = function (id) { return document.getElementById(id); };

  var ARS_KEY = "boats.arsenal";   // { key: qty }
  var SKIN_KEY = "boats.skins";    // { key: bool }
  var LOW_KEY = "boats.lowBoat";   // "2".."5"

  var arsenalSel = {};
  var skinSel = {};
  var lowBoat = "5";

  // ---------- sprites / labels ----------
  function label(key) {
    if (D.labels[key]) return D.labels[key];
    return String(key).replace(/[_-]+/g, " ").replace(/\b\w/g, function (c) { return c.toUpperCase(); });
  }
  function itemSprite(key) {
    if (D.refinery[key]) {
      var f = key === "titanium_ingot" ? "titanium_ingots" : key;
      return "assets/img/boats/refinery/" + f + ".png";
    }
    if (D.inks.indexOf(key) !== -1) return "assets/img/boats/inks/" + key + ".png";
    return "assets/img/boats/items/" + key + ".png";
  }
  function arsenalSprite(key) {
    var f = key === "ship_upgrade_kit" ? "upgrade_kit_6" : key + "_6";
    return "assets/img/boats/arsenal/" + f + ".png";
  }
  function skinSprite(key) { return "assets/img/boats/skins/boat_" + key + ".png"; }

  function berry(v) { return Number(v || 0).toLocaleString("pt-BR", { maximumFractionDigits: 0 }); }

  // ---------- flatten ----------
  function expand(key, qty, acc) {
    if (D.arsenal[key]) {
      D.arsenal[key].forEach(function (ing) { expand(ing.key, ing.qty * qty, acc); });
    } else if (D.refinery[key]) {
      D.refinery[key].forEach(function (ing) { expand(ing.key, ing.qty * qty, acc); });
    } else {
      acc[key] = (acc[key] || 0) + qty;
    }
  }
  function costOf(acc) {
    var total = 0;
    Object.keys(acc).forEach(function (k) { total += acc[k] * (D.itemValues[k] || 0); });
    return total;
  }
  function sortedEntries(acc) {
    return Object.keys(acc).map(function (k) {
      return { key: k, qty: acc[k], sub: acc[k] * (D.itemValues[k] || 0) };
    }).sort(function (a, b) { return b.sub - a.sub || b.qty - a.qty; });
  }

  // ---------- avatar helper ----------
  function initials(name) {
    var p = (name || "").trim().split(/\s+/).filter(Boolean);
    if (!p.length) return "?";
    return (p.length === 1 ? p[0].slice(0, 2) : p[0][0] + p[p.length - 1][0]).toUpperCase();
  }
  function iconEl(src, name, cls) {
    var span = document.createElement("span");
    span.className = "boat-ico" + (cls ? " " + cls : "");
    var img = document.createElement("img");
    img.src = src; img.alt = name; img.loading = "lazy";
    img.addEventListener("error", function () { span.classList.add("missing"); span.textContent = initials(name); });
    span.appendChild(img);
    return span;
  }

  // material chip (icon + name + qty [+ subtotal])
  function matChip(key, qty, showCost) {
    var chip = document.createElement("div");
    chip.className = "boat-mat";
    chip.appendChild(iconEl(itemSprite(key), label(key)));
    var txt = document.createElement("span");
    txt.className = "boat-mat-txt";
    var sub = showCost ? (D.itemValues[key] ? " &middot; " + berry(qty * D.itemValues[key]) + " B" : "") : "";
    txt.innerHTML = "<strong>" + qty + "x</strong> " + label(key) + sub;
    chip.appendChild(txt);
    return chip;
  }

  function baseMaterialsBlock(acc, titleKey) {
    var wrap = document.createElement("div");
    var h = document.createElement("h4");
    h.className = "boat-sub";
    h.textContent = t(titleKey);
    wrap.appendChild(h);
    var grid = document.createElement("div");
    grid.className = "boat-mat-grid";
    sortedEntries(acc).forEach(function (e) { grid.appendChild(matChip(e.key, e.qty, true)); });
    wrap.appendChild(grid);
    return wrap;
  }

  // ---------- Barcos 2-5 ----------
  function renderLow() {
    var host = $("boats-low-result");
    if (!host) return;
    host.innerHTML = "";
    var boat = D.lowBoats[lowBoat];
    if (!boat) return;

    var parts = [["cannon", boat.cannon], ["sail", boat.sail], ["hull", boat.hull]];
    var partsWrap = document.createElement("div");
    partsWrap.className = "boat-parts";
    parts.forEach(function (pair) {
      var card = document.createElement("div");
      card.className = "boat-part";
      var head = document.createElement("div");
      head.className = "boat-part-head";
      head.appendChild(iconEl(arsenalSprite(pair[0]), label(pair[0]), "big"));
      var hn = document.createElement("span");
      hn.textContent = label(pair[0]);
      head.appendChild(hn);
      card.appendChild(head);
      var list = document.createElement("div");
      list.className = "boat-mat-grid";
      pair[1].forEach(function (ing) { list.appendChild(matChip(ing.key, ing.qty, false)); });
      card.appendChild(list);
      partsWrap.appendChild(card);
    });
    host.appendChild(partsWrap);

    var acc = {};
    parts.forEach(function (pair) { pair[1].forEach(function (ing) { expand(ing.key, ing.qty, acc); }); });
    host.appendChild(baseMaterialsBlock(acc, "boats.baseMaterials"));

    var total = document.createElement("div");
    total.className = "boat-total";
    total.innerHTML = "<span>" + t("boats.totalCost") + "</span><strong>" + berry(costOf(acc)) + " Berries</strong>";
    host.appendChild(total);
  }

  // ---------- Arsenal Lv6 ----------
  function renderArsenalCatalog() {
    var host = $("boats-arsenal-grid");
    if (!host) return;
    host.innerHTML = "";
    D.arsenalOrder.forEach(function (key) {
      var qty = Number(arsenalSel[key] || 0);
      var row = document.createElement("label");
      row.className = "boat-pick" + (qty > 0 ? " on" : "");
      var cb = document.createElement("input");
      cb.type = "checkbox"; cb.checked = qty > 0; cb.setAttribute("data-ars", key);
      row.appendChild(cb);
      row.appendChild(iconEl(arsenalSprite(key), label(key)));
      var nm = document.createElement("span");
      nm.className = "boat-pick-name";
      nm.textContent = label(key);
      row.appendChild(nm);
      var num = document.createElement("input");
      num.type = "number"; num.min = "1"; num.value = String(qty > 0 ? qty : 1);
      num.className = "boat-qty"; num.setAttribute("data-ars-qty", key);
      num.disabled = qty <= 0;
      row.appendChild(num);
      host.appendChild(row);
    });
  }

  function renderSkinCatalog() {
    var host = $("boats-skins-grid");
    if (!host) return;
    host.innerHTML = "";
    D.skinOrder.forEach(function (key) {
      var on = !!skinSel[key];
      var row = document.createElement("label");
      row.className = "boat-pick" + (on ? " on" : "");
      var cb = document.createElement("input");
      cb.type = "checkbox"; cb.checked = on; cb.setAttribute("data-skin", key);
      row.appendChild(cb);
      row.appendChild(iconEl(skinSprite(key), label(key)));
      var nm = document.createElement("span");
      nm.className = "boat-pick-name";
      nm.textContent = label(key);
      row.appendChild(nm);
      host.appendChild(row);
    });
  }

  function renderArsenalResult() {
    var host = $("boats-arsenal-result");
    if (!host) return;
    host.innerHTML = "";
    var acc = {};
    var any = false;
    D.arsenalOrder.forEach(function (key) {
      var qty = Number(arsenalSel[key] || 0);
      if (qty > 0) { any = true; expand(key, qty, acc); }
    });
    if (!any) {
      host.innerHTML = '<p class="boat-empty">' + t("boats.arsenalEmpty") + "</p>";
      return;
    }
    host.appendChild(baseMaterialsBlock(acc, "boats.baseMaterials"));
    var total = document.createElement("div");
    total.className = "boat-total";
    total.innerHTML = "<span>" + t("boats.totalCost") + "</span><strong>" + berry(costOf(acc)) + " Berries</strong>";
    host.appendChild(total);
  }

  function renderSkinResult() {
    var host = $("boats-skins-result");
    if (!host) return;
    host.innerHTML = "";
    var inkAcc = {};
    var any = false;
    D.skinOrder.forEach(function (key) {
      if (skinSel[key]) {
        any = true;
        D.skins[key].forEach(function (ing) { inkAcc[ing.key] = (inkAcc[ing.key] || 0) + ing.qty; });
      }
    });
    if (!any) {
      host.innerHTML = '<p class="boat-empty">' + t("boats.skinsEmpty") + "</p>";
      return;
    }
    var h = document.createElement("h4");
    h.className = "boat-sub";
    h.textContent = t("boats.inksNeeded");
    host.appendChild(h);
    var grid = document.createElement("div");
    grid.className = "boat-mat-grid";
    D.inks.forEach(function (ink) {
      if (inkAcc[ink]) grid.appendChild(matChip(ink, inkAcc[ink], false));
    });
    host.appendChild(grid);
    var note = document.createElement("p");
    note.className = "boat-note";
    note.textContent = t("boats.inksNote");
    host.appendChild(note);
  }

  // ---------- persistencia ----------
  function save() {
    GLA.profiles.set(ARS_KEY, arsenalSel);
    GLA.profiles.set(SKIN_KEY, skinSel);
    GLA.profiles.set(LOW_KEY, lowBoat);
  }
  function load() {
    arsenalSel = GLA.profiles.get(ARS_KEY, {}) || {};
    skinSel = GLA.profiles.get(SKIN_KEY, {}) || {};
    lowBoat = GLA.profiles.get(LOW_KEY, "5") || "5";
  }

  function renderAll() {
    var sel = $("boats-low-select");
    if (sel) sel.value = lowBoat;
    renderLow();
    renderArsenalCatalog();
    renderArsenalResult();
    renderSkinCatalog();
    renderSkinResult();
  }

  function init() {
    if (!$("view-boats") || !D) return;
    load();

    var sel = $("boats-low-select");
    if (sel) {
      sel.innerHTML = "";
      ["5", "4", "3", "2"].forEach(function (n) {
        var o = document.createElement("option");
        o.value = n; o.textContent = t("boats.boat") + " " + n;
        sel.appendChild(o);
      });
      sel.addEventListener("change", function () { lowBoat = sel.value; save(); renderLow(); });
    }

    var arsGrid = $("boats-arsenal-grid");
    if (arsGrid) {
      arsGrid.addEventListener("change", function (e) {
        var cb = e.target.closest("[data-ars]");
        if (cb) {
          var k = cb.getAttribute("data-ars");
          arsenalSel[k] = cb.checked ? Math.max(1, Number(arsenalSel[k] || 0)) : 0;
          save(); renderArsenalCatalog(); renderArsenalResult();
          return;
        }
        var q = e.target.closest("[data-ars-qty]");
        if (q) {
          var key = q.getAttribute("data-ars-qty");
          var v = Math.max(1, Math.floor(Number(q.value) || 1));
          arsenalSel[key] = v; save(); renderArsenalResult();
        }
      });
    }

    var skinGrid = $("boats-skins-grid");
    if (skinGrid) {
      skinGrid.addEventListener("change", function (e) {
        var cb = e.target.closest("[data-skin]");
        if (!cb) return;
        skinSel[cb.getAttribute("data-skin")] = cb.checked;
        save(); renderSkinCatalog(); renderSkinResult();
      });
    }

    var clearArs = $("boats-arsenal-clear");
    if (clearArs) clearArs.addEventListener("click", function () { arsenalSel = {}; save(); renderArsenalCatalog(); renderArsenalResult(); });
    var clearSkin = $("boats-skins-clear");
    if (clearSkin) clearSkin.addEventListener("click", function () { skinSel = {}; save(); renderSkinCatalog(); renderSkinResult(); });

    renderAll();

    GLA.bus.on("profile:change", function () { load(); renderAll(); });
  }

  GLA.router && GLA.router.register("boats", {
    init: init,
    onShow: function () {
      if (GLA._boatsLang !== (GLA.i18n && GLA.i18n.current())) {
        GLA._boatsLang = GLA.i18n && GLA.i18n.current();
        if ($("view-boats") && D && $("boats-low-select")) renderAll();
      }
    }
  });

  GLA.bus && GLA.bus.on && GLA.bus.on("lang:change", function () {
    if (GLA.router && GLA.router.current() === "boats") renderAll();
  });
})(window.GLA);
