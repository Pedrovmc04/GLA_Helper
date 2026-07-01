// boost.js - Sistema de Boost & Calculadoras, modular e integrado ao GLA shell.
window.GLA = window.GLA || {};
(function (GLA) {
  "use strict";

  var D = window.BOOST_DATA;
  var PRICES_KEY = "boost.prices";
  var CURRENCY_KEY = "boost.currency";
  var PRICE_IDS = ["sky", "sage", "crimson", "radiant", "chaotic", "distorted"];
  var friendSeq = 0;

  var $ = function (id) { return document.getElementById(id); };

  function fmt(n, dec) {
    dec = dec || 0;
    return Number(n).toLocaleString("pt-BR", { minimumFractionDigits: dec, maximumFractionDigits: dec });
  }

  function tierForLevel(level) {
    return D.CRYSTAL_TIERS.find(function (t) { return level >= t.min && level <= t.max; });
  }

  function getPrices() {
    return {
      sky: parseFloat($("price-sky").value) || 0,
      sage: parseFloat($("price-sage").value) || 0,
      crimson: parseFloat($("price-crimson").value) || 0,
      radiant: parseFloat($("price-radiant").value) || 0,
      chaotic: parseFloat($("price-chaotic").value) || 0,
      distorted: parseFloat($("price-distorted").value) || 0
    };
  }
  function currency() { return ($("currency").value || "").trim() || "moedas"; }

  // ---- Persistencia por perfil ----
  function persistPrices() {
    GLA.profiles.set(PRICES_KEY, getPrices());
    GLA.profiles.set(CURRENCY_KEY, currency());
  }
  function loadPricesIntoInputs() {
    var saved = GLA.profiles.get(PRICES_KEY, null);
    if (saved) {
      PRICE_IDS.forEach(function (k) {
        var input = $("price-" + k);
        if (input && saved[k] != null) input.value = saved[k];
      });
    }
    var cur = GLA.profiles.get(CURRENCY_KEY, null);
    if (cur != null && $("currency")) $("currency").value = cur;
  }

  function expectedAttempts(chancePercent, guaranteed) {
    var p = Math.min(Math.max(chancePercent / 100, 0), 1);
    if (p >= 1) return 1;
    var q = 1 - p;
    var e = 0;
    for (var k = 1; k < guaranteed; k++) e += k * p * Math.pow(q, k - 1);
    e += guaranteed * Math.pow(q, guaranteed - 1);
    return e;
  }

  function fillLevelSelects() {
    var from = $("m-from"), to = $("m-to");
    var fromHtml = "", toHtml = "";
    for (var i = 0; i <= 15; i++) fromHtml += "<option value=\"" + i + "\">+" + i + "</option>";
    for (var j = 1; j <= 16; j++) toHtml += "<option value=\"" + j + "\">+" + j + "</option>";
    from.innerHTML = fromHtml; to.innerHTML = toHtml;
    from.value = "0"; to.value = "16";
  }

  // ---- Calculadora de Melhoria ----
  function calcMelhoria() {
    var items = Array.prototype.slice.call(
      document.querySelectorAll('#m-items input[name="m-item"]:checked')
    ).map(function (el) { return el.value; });
    var fromLvl = parseInt($("m-from").value, 10);
    var toLvl = parseInt($("m-to").value, 10);
    var mode = $("m-mode").value;
    var scroll = parseFloat($("m-scroll").value) || 0;
    var alliance = $("m-alliance").checked;
    var prices = getPrices();
    var out = $("m-result");

    if (items.length === 0) { out.innerHTML = '<p class="result-warn">Selecione pelo menos uma peca do conjunto.</p>'; return; }
    if (toLvl <= fromLvl) { out.innerHTML = '<p class="result-warn">O nivel alvo precisa ser maior que o nivel atual.</p>'; return; }

    var perAttemptByItem = {};
    items.forEach(function (it) {
      var p = D.CRYSTALS_PER_ATTEMPT[it];
      if (alliance) p = Math.max(1, p - 1);
      perAttemptByItem[it] = p;
    });
    var totalPerAttempt = items.reduce(function (s, it) { return s + perAttemptByItem[it]; }, 0);

    var totals = { sky: 0, sage: 0, crimson: 0, radiant: 0 };
    var attemptsPerPiece = 0;
    for (var lvl = fromLvl + 1; lvl <= toLvl; lvl++) {
      var data = D.PITY.find(function (p) { return p.level === lvl; });
      var attempts = mode === "worst" ? data.guaranteed : expectedAttempts(data.chance + scroll, data.guaranteed);
      attemptsPerPiece += attempts;
      var tier = tierForLevel(lvl);
      totals[tier.key] += attempts * totalPerAttempt;
    }
    var totalAttempts = attemptsPerPiece * items.length;

    var totalCost = 0;
    var rows = D.CRYSTAL_TIERS.map(function (t) {
      var qty = totals[t.key];
      if (qty <= 0) return "";
      var price = prices[t.key];
      var cost = qty * price;
      totalCost += cost;
      return "<tr><td><span class=\"crystal " + t.cls + "\">" + t.label + "</span></td><td>" +
        fmt(qty, mode === "worst" ? 0 : 1) + "</td><td>" +
        (price > 0 ? fmt(cost, 2) + " " + currency() : "&mdash;") + "</td></tr>";
    }).join("");

    var modeLabel = mode === "worst" ? "Pior caso (garantia)" : "Media esperada";
    var scrollNote = scroll > 0 && mode === "expected"
      ? " Pergaminho de +" + scroll + "% aplicado a cada tentativa."
      : (scroll > 0 && mode === "worst" ? " (Pergaminho nao afeta o pior caso.)" : "");
    var itemsLabel = items.map(function (it) { return D.ITEM_LABEL[it]; }).join(", ");

    out.innerHTML =
      '<div class="result-head">' + itemsLabel + " &middot; +" + fromLvl + " &rarr; +" + toLvl + " &middot; " + modeLabel + "</div>" +
      '<div class="stat-row">' +
        '<div class="stat"><span class="num">' + items.length + '</span><span class="lbl">Pecas</span></div>' +
        '<div class="stat"><span class="num">' + fmt(attemptsPerPiece, mode === "worst" ? 0 : 1) + '</span><span class="lbl">Tentativas / peca</span></div>' +
        '<div class="stat"><span class="num">' + fmt(totalAttempts, mode === "worst" ? 0 : 1) + '</span><span class="lbl">Tentativas (total)</span></div>' +
      "</div>" +
      '<div class="breakdown"><div class="table-wrap"><table><thead><tr><th>Cristal</th><th>Quantidade</th><th>Custo</th></tr></thead><tbody>' + rows + "</tbody></table></div></div>" +
      '<div class="total-line"><span class="total-lbl">Custo total estimado</span><span class="total-val">' +
        (totalCost > 0 ? fmt(totalCost, 2) + " " + currency() : "defina os precos") + "</span></div>" +
      '<p class="result-note">' +
        (mode === "expected"
          ? "A media esperada considera a chance de sucesso e o limite de garantia (pity) de cada nivel."
          : "O pior caso assume que voce falha ate a tentativa garantida em todos os niveis.") +
        scrollNote + "</p>";
  }

  function calcTransfer() {
    var item = $("t-item").value;
    var level = $("t-level").value;
    var gems = D.TRANSFER[level][item];
    $("t-result").innerHTML =
      '<div class="total-line"><span class="total-lbl">' + D.ITEM_LABEL[item] + " &middot; +" + level +
      '</span><span class="total-val">' + gems + " gemas</span></div>" +
      '<p class="result-note">Custo para trocar a melhoria entre dois itens de mesmo nivel.</p>';
  }

  function calcRefund() {
    var item = $("r-item").value;
    var rows = D.CRYSTAL_TIERS.map(function (t) {
      return "<tr><td><span class=\"crystal " + t.cls + "\">" + t.label + "</span></td><td>" + D.REFUND[t.key][item] + "</td></tr>";
    }).join("");
    $("r-result").innerHTML =
      '<div class="result-head">' + D.ITEM_LABEL[item] + " totalmente melhorado (+16)</div>" +
      '<div class="table-wrap"><table><thead><tr><th>Cristal</th><th>Devolvido</th></tr></thead><tbody>' + rows + "</tbody></table></div>" +
      '<p class="result-note">Quanto maior a categoria do cristal, menos se recupera.</p>';
  }

  function calcReforge() {
    var type = $("rf-type").value;
    var rarity = $("rf-rarity").value;
    var cfg = D.REFORGE[type];
    var prices = getPrices();
    var chance = cfg.chances[rarity];
    var p = chance / 100;
    var expectedTries = p > 0 ? 1 / p : Infinity;
    var price = prices[cfg.material];
    var expectedCost = expectedTries * price;
    $("rf-result").innerHTML =
      '<div class="result-head">' + cfg.matLabel + " &middot; raridade " + D.RARITY_LABEL[rarity] + " (" + chance + "%)</div>" +
      '<div class="stat-row">' +
        '<div class="stat"><span class="num">' + fmt(expectedTries, 1) + '</span><span class="lbl">Tentativas (media)</span></div>' +
        '<div class="stat"><span class="num">' + fmt(expectedTries, 1) + '</span><span class="lbl">' + cfg.matLabel + "</span></div>" +
      "</div>" +
      '<div class="total-line"><span class="total-lbl">Custo medio estimado</span><span class="total-val">' +
        (price > 0 ? fmt(expectedCost, 2) + " " + currency() : "defina o preco") + "</span></div>" +
      '<p class="result-note">Media baseada na chance de ' + chance + "% (1 / chance). Como o material e consumido a cada tentativa, o gasto real pode variar bastante. " +
        '<span class="crystal ' + cfg.material + '" style="margin-top:8px">' + cfg.matLabel + "</span></p>";
  }

  // ---- Compra coletiva de gemas ----
  function gemsForMoney(money) {
    if (money <= 0) return { gems: 0, price: 0 };
    var best = { gems: 0, price: 0 };
    D.GEM_TIERS.forEach(function (tier) {
      var g = Math.floor(money / tier.price);
      if (g < tier.min) return;
      if (g > tier.max) g = tier.max;
      if (g > best.gems) best = { gems: g, price: tier.price };
    });
    return best;
  }
  function tierPriceForQty(qty) {
    var tier = D.GEM_TIERS.find(function (t) { return qty >= t.min && qty <= t.max; });
    return tier ? tier.price : D.GEM_TIERS[D.GEM_TIERS.length - 1].price;
  }
  function appBonusForMoney(money) {
    return D.APP_BONUS_TIERS.find(function (t) { return money >= t.min; }).bonus;
  }

  function addFriendRow(name, money) {
    name = name || ""; money = money || "";
    friendSeq += 1;
    var wrap = document.createElement("div");
    wrap.className = "friend-row";
    wrap.dataset.id = String(friendSeq);
    wrap.innerHTML =
      '<input class="g-name" type="text" placeholder="Amigo ' + ($("g-friends").children.length + 1) + '" value="' + name + '" />' +
      '<div class="g-money-wrap"><span class="g-prefix">R$</span>' +
      '<input class="g-money" type="number" min="0" step="any" placeholder="0,00" value="' + money + '" /></div>' +
      '<button type="button" class="g-remove" title="Remover" aria-label="Remover amigo">&times;</button>';
    wrap.querySelector(".g-name").addEventListener("input", calcGemas);
    wrap.querySelector(".g-money").addEventListener("input", calcGemas);
    wrap.querySelector(".g-remove").addEventListener("click", function () { wrap.remove(); calcGemas(); });
    $("g-friends").appendChild(wrap);
  }

  function calcGemas() {
    var rows = Array.prototype.slice.call(document.querySelectorAll("#g-friends .friend-row"));
    var out = $("g-result");
    var friends = rows.map(function (row, i) {
      var name = row.querySelector(".g-name").value.trim() || ("Amigo " + (i + 1));
      var money = parseFloat(row.querySelector(".g-money").value) || 0;
      return { name: name, money: money };
    });
    var totalMoney = friends.reduce(function (s, f) { return s + f.money; }, 0);
    if (totalMoney <= 0) { out.innerHTML = '<p class="result-warn">Informe quanto cada amigo vai colocar.</p>'; return; }

    var pooled = gemsForMoney(totalMoney);
    var basePrice = pooled.price || tierPriceForQty(pooled.gems);
    var alloc = friends.map(function (f) { return Math.max(0, Math.round(f.money / basePrice)); });
    var totalGems = alloc.reduce(function (s, g) { return s + g; }, 0);
    var costPerFriend = alloc.map(function (g) { return g * basePrice; });
    var totalCost = totalGems * basePrice;
    var totalCashback = totalCost * D.SITE_CASHBACK;
    var soloGems = friends.map(function (f) { return gemsForMoney(f.money).gems; });
    var soloTotal = soloGems.reduce(function (s, g) { return s + g; }, 0);
    var appBonus = appBonusForMoney(totalCost);
    var appGems = Math.floor(totalCost * (1 + appBonus));
    var sitePerGem = totalGems > 0 ? (totalCost * (1 - D.SITE_CASHBACK)) / totalGems : Infinity;
    var appWins = appGems > totalGems;

    var bodyRows = friends.map(function (f, i) {
      var gain = alloc[i] - soloGems[i];
      var gainStr = gain > 0 ? '<span class="gain-pos">+' + gain + "</span>" : (gain < 0 ? '<span class="gain-neg">' + gain + "</span>" : "0");
      var cashback = costPerFriend[i] * D.SITE_CASHBACK;
      var diff = costPerFriend[i] - f.money;
      var diffStr = Math.abs(diff) < 0.005 ? "exato" : (diff > 0 ? "+R$ " + fmt(diff, 2) : "-R$ " + fmt(-diff, 2));
      return "<tr><td>" + f.name + "</td><td>R$ " + fmt(f.money, 2) + "</td><td><strong>" + fmt(alloc[i], 0) +
        "</strong></td><td>R$ " + fmt(costPerFriend[i], 2) + ' <small class="diff">(' + diffStr + ")</small></td><td>" +
        '<span class="gain-pos">R$ ' + fmt(cashback, 2) + "</span></td><td>" + gainStr + "</td></tr>";
    }).join("");

    var totalGain = totalGems - soloTotal;
    var gemDiff = appGems - totalGems;
    var verdict = appWins
      ? '<div class="verdict verdict-app"><strong>Compre pelo APP.</strong> Gastando R$ ' + fmt(totalCost, 2) +
        ", o app entrega <strong>" + fmt(appGems, 0) + " gemas</strong> (1 gema = R$ 1 + " + fmt(appBonus * 100, 0) +
        "% de bonus), contra " + fmt(totalGems, 0) + " do site. Mesmo com o preco menor por gema e o cashback de 2,5% (R$ " +
        fmt(totalCashback, 2) + "), o site fica para tras: <strong>" + fmt(gemDiff, 0) + " gemas a menos</strong>.</div>"
      : '<div class="verdict verdict-site"><strong>Compre pelo SITE.</strong> O preco por gema e menor (R$ ' +
        fmt(sitePerGem, 3) + " liquido com cashback) e voces levam <strong>" + fmt(totalGems, 0) + " gemas</strong> + R$ " +
        fmt(totalCashback, 2) + " de volta, contra " + fmt(appGems, 0) + " gemas do app (R$ 1 cada + " + fmt(appBonus * 100, 0) +
        "%). O app so compensa em compras a partir de R$ 400 (bonus de 15%).</div>";

    out.innerHTML =
      '<div class="result-head">Compra conjunta de ' + friends.length + " " + (friends.length === 1 ? "pessoa" : "pessoas") + "</div>" +
      verdict +
      '<div class="stat-row">' +
        '<div class="stat"><span class="num">' + fmt(totalGems, 0) + '</span><span class="lbl">Gemas a comprar</span></div>' +
        '<div class="stat"><span class="num">R$ ' + fmt(totalCost, 2) + '</span><span class="lbl">Preco final (site)</span></div>' +
        '<div class="stat"><span class="num">R$ ' + fmt(basePrice, 2) + '</span><span class="lbl">R$/gema (faixa)</span></div>' +
        '<div class="stat"><span class="num">R$ ' + fmt(totalCashback, 2) + '</span><span class="lbl">Cashback 2,5%</span></div>' +
        '<div class="stat"><span class="num">' + fmt(appGems, 0) + '</span><span class="lbl">Gemas (app +' + fmt(appBonus * 100, 0) + '%)</span></div>' +
      "</div>" +
      '<div class="breakdown"><div class="table-wrap"><table><thead><tr><th>Amigo</th><th>Dinheiro</th><th>Gemas a selecionar</th><th>Preco real</th><th>Cashback</th><th>vs sozinho</th></tr></thead><tbody>' +
        bodyRows + "</tbody></table></div></div>" +
      '<div class="total-line"><span class="total-lbl">Gemas extras por comprar juntos (site)</span><span class="total-val">' +
        (totalGain >= 0 ? "+" : "") + fmt(totalGain, 0) + "</span></div>" +
      '<div class="total-line"><span class="total-lbl">' + (appWins ? "Gemas a mais escolhendo o app" : "Gemas a mais escolhendo o site") +
        '</span><span class="total-val">' + (gemDiff >= 0 ? "+" : "") + fmt(appWins ? gemDiff : -gemDiff, 0) + "</span></div>";
  }

  function bind(ids, handler) {
    ids.forEach(function (id) {
      var el = $(id);
      if (!el) return;
      var evt = el.tagName === "SELECT" || el.type === "checkbox" ? "change" : "input";
      el.addEventListener(evt, handler);
    });
  }

  function recalcAll() {
    calcMelhoria(); calcTransfer(); calcRefund(); calcReforge(); calcGemas();
  }

  function init() {
    if (!D) { console.error("BOOST_DATA nao carregado"); return; }
    fillLevelSelects();

    var priceIds = ["currency", "price-sky", "price-sage", "price-crimson", "price-radiant", "price-chaotic", "price-distorted"];

    bind(["m-from", "m-to", "m-mode", "m-scroll", "m-alliance"].concat(priceIds), function () { persistPrices(); calcMelhoria(); });
    document.querySelectorAll('#m-items input[name="m-item"]').forEach(function (el) {
      el.addEventListener("change", calcMelhoria);
    });
    bind(["t-item", "t-level"], calcTransfer);
    bind(["r-item"], calcRefund);
    bind(["rf-type", "rf-rarity"].concat(priceIds), function () { persistPrices(); calcReforge(); });
    // Precos tambem devem persistir ao mexer (mesmo sem recalcular melhoria/reforja diretamente).
    bind(priceIds, persistPrices);

    addFriendRow();
    addFriendRow();
    $("g-add").addEventListener("click", function () { addFriendRow(); calcGemas(); });

    loadPricesIntoInputs();
    recalcAll();

    GLA.bus.on("profile:change", function () { loadPricesIntoInputs(); recalcAll(); });
  }

  GLA.router && GLA.router.register("boost", { init: init });
})(window.GLA);
