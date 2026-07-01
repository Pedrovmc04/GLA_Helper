// wiki.js - parte informativa do Boost: preenche as tabelas de referencia.
window.GLA = window.GLA || {};
(function (GLA) {
  "use strict";

  var D = window.BOOST_DATA;

  function tierForLevel(level) {
    return D.CRYSTAL_TIERS.find(function (t) { return level >= t.min && level <= t.max; });
  }

  function renderPityTable() {
    var tbody = document.querySelector("#pity-table tbody");
    if (!tbody) return;
    tbody.innerHTML = D.PITY.map(function (row) {
      var tier = tierForLevel(row.level);
      return "<tr><td><span class=\"crystal " + tier.cls + "\">+" + row.level + "</span></td><td>" +
        row.chance + "%</td><td>" + row.guaranteed + "a tentativa</td></tr>";
    }).join("");
  }

  function renderTransferTable() {
    var tbody = document.querySelector("#transfer-table tbody");
    if (!tbody) return;
    var order = ["cabeca", "corpo", "perna", "emblema", "arma", "acessorio"];
    tbody.innerHTML = Object.keys(D.TRANSFER).map(function (lvl) {
      var cells = order.map(function (k) { return "<td>" + D.TRANSFER[lvl][k] + " gemas</td>"; }).join("");
      return "<tr><td><strong>+" + lvl + "</strong></td>" + cells + "</tr>";
    }).join("");
  }

  function renderRefundTable() {
    var tbody = document.querySelector("#refund-table tbody");
    if (!tbody) return;
    var order = ["cabeca", "corpo", "perna", "emblema", "arma", "acessorio"];
    tbody.innerHTML = D.CRYSTAL_TIERS.map(function (t) {
      var cells = order.map(function (k) { return "<td>" + D.REFUND[t.key][k] + "</td>"; }).join("");
      return "<tr><td><span class=\"crystal " + t.cls + "\">" + t.label + "</span></td>" + cells + "</tr>";
    }).join("");
  }

  function init() {
    if (!D) { console.error("BOOST_DATA nao carregado"); return; }
    renderPityTable();
    renderTransferTable();
    renderRefundTable();
  }

  GLA.router && GLA.router.register("wiki", { init: init });
})(window.GLA);
