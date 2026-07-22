// quiz.js - Foxy Quiz (Verdade ou Mentira), modular e integrado ao GLA shell.
window.GLA = window.GLA || {};
(function (GLA) {
  "use strict";

  var TIMED_SECONDS = 10;
  var REVEAL_DELAY = 2200;
  var BEST_KEY = "quiz.best";

  var t = function (k, p) { return GLA.i18n ? GLA.i18n.t(k, p) : k; };

  function buildDeck() {
    var deck = [];
    var Q = (typeof QUESTIONS !== "undefined" && QUESTIONS) || window.QUESTIONS || {};
    (Q.verdadeiro || []).forEach(function (text) {
      deck.push({ text: text, answer: true });
    });
    (Q.falso || []).forEach(function (text) {
      deck.push({ text: text, answer: false });
    });
    return deck;
  }

  function shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
    }
    return arr;
  }

  function normalize(s) {
    return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[.,]/g, "");
  }

  function buildNorm(text) {
    var norm = "", map = [];
    for (var i = 0; i < text.length; i++) {
      var n = normalize(text[i]);
      for (var k = 0; k < n.length; k++) { norm += n[k]; map.push(i); }
    }
    return { norm: norm, map: map };
  }

  var ALL = [];
  var el = {};
  var state = {
    mode: "classic", deck: [], index: 0, correct: 0, wrong: 0,
    streak: 0, best: 0, answered: false, round: 0,
    countdownId: null, advanceId: null, deadline: 0, autoLog: []
  };

  function loadBest() {
    var v = parseInt(GLA.profiles.get(BEST_KEY, 0), 10);
    return isNaN(v) ? 0 : v;
  }
  function saveBest(v) { GLA.profiles.set(BEST_KEY, v); }

  function truthWord(answer) { return t(answer ? "quiz.truth.true" : "quiz.truth.false"); }
  function tagWord(answer) { return t(answer ? "quiz.tag.true" : "quiz.tag.false"); }

  function showScreen(name) {
    el.startScreen.classList.toggle("active", name === "start");
    el.gameScreen.classList.toggle("active", name === "game");
    el.searchScreen.classList.toggle("active", name === "search");
    el.summaryScreen.classList.toggle("active", name === "summary");
  }

  function clearTimers() {
    if (state.countdownId) { clearInterval(state.countdownId); state.countdownId = null; }
    if (state.advanceId) { clearTimeout(state.advanceId); state.advanceId = null; }
  }

  function newDeck() {
    state.deck = shuffle(buildDeck());
    state.index = 0;
    state.round += 1;
  }

  function startGame(mode) {
    state.mode = mode;
    state.correct = 0; state.wrong = 0; state.streak = 0;
    state.best = loadBest(); state.round = 0; state.autoLog = [];
    newDeck();
    showScreen("game");
    el.modeBadge.textContent = t("quiz.badge." + mode) || "";
    el.timerWrap.hidden = mode !== "timed";

    var isAuto = mode === "auto";
    el.autoInfo.hidden = !isAuto;
    el.autoWrong.hidden = !isAuto;
    if (isAuto) {
      el.autoWrongList.innerHTML = "";
      el.autoWrongCount.textContent = "0";
      updateAutoProgress();
    }
    updateScoreboard();
    showQuestion();
  }

  function showQuestion() {
    clearTimers();
    if (state.index >= state.deck.length) newDeck();
    state.answered = false;

    var q = state.deck[state.index];
    el.questionText.textContent = q.text;

    el.questionCard.classList.remove("correct", "wrong", "flash");
    void el.questionCard.offsetWidth;
    el.questionCard.classList.add("flash");

    el.feedback.textContent = "";
    el.feedback.className = "feedback";

    el.btnTrue.disabled = false; el.btnFalse.disabled = false;
    el.btnTrue.classList.remove("reveal-correct");
    el.btnFalse.classList.remove("reveal-correct");
    el.btnNext.hidden = state.mode === "timed";

    el.progressText.textContent = t("quiz.progress", { n: state.index + 1, total: state.deck.length });

    if (state.mode === "timed") startCountdown();
  }

  function startCountdown() {
    state.deadline = Date.now() + TIMED_SECONDS * 1000;
    el.timerBar.style.transition = "none";
    el.timerBar.style.width = "100%";
    el.timerSeconds.textContent = TIMED_SECONDS;
    el.timerWrap.classList.remove("danger");
    void el.timerBar.offsetWidth;
    el.timerBar.style.transition = "width 0.2s linear";

    state.countdownId = setInterval(function () {
      var remaining = Math.max(0, state.deadline - Date.now());
      var secs = Math.ceil(remaining / 1000);
      el.timerSeconds.textContent = secs;
      el.timerBar.style.width = (remaining / (TIMED_SECONDS * 1000) * 100) + "%";
      el.timerWrap.classList.toggle("danger", secs <= 3);
      if (remaining <= 0) {
        clearInterval(state.countdownId);
        state.countdownId = null;
        timeUp();
      }
    }, 100);
  }

  function timeUp() {
    if (state.answered) return;
    state.answered = true;
    var q = state.deck[state.index];
    el.btnTrue.disabled = true; el.btnFalse.disabled = true;
    (q.answer ? el.btnTrue : el.btnFalse).classList.add("reveal-correct");
    state.wrong += 1; state.streak = 0;
    el.questionCard.classList.add("wrong");
    el.feedback.textContent = t("quiz.fb.timeout", { truth: truthWord(q.answer) });
    el.feedback.classList.add("show", "wrong");
    updateScoreboard();
    scheduleAutoNext();
  }

  function answer(choice) {
    if (state.answered) return;
    state.answered = true;
    if (state.countdownId) { clearInterval(state.countdownId); state.countdownId = null; }

    var q = state.deck[state.index];
    var isCorrect = choice === q.answer;

    el.btnTrue.disabled = true; el.btnFalse.disabled = true;
    (q.answer ? el.btnTrue : el.btnFalse).classList.add("reveal-correct");

    if (isCorrect) {
      state.correct += 1; state.streak += 1;
      if (state.streak > state.best) { state.best = state.streak; saveBest(state.best); }
      el.questionCard.classList.add("correct");
      el.feedback.textContent = t("quiz.fb.correct", { truth: truthWord(q.answer) });
      el.feedback.classList.add("show", "correct");
    } else {
      state.wrong += 1; state.streak = 0;
      el.questionCard.classList.add("wrong");
      el.feedback.textContent = t("quiz.fb.wrong", { truth: truthWord(q.answer) });
      el.feedback.classList.add("show", "wrong");
    }

    updateScoreboard();
    if (state.mode === "auto") logAuto(q, choice, isCorrect);

    if (state.mode === "timed") {
      scheduleAutoNext();
    } else {
      el.btnNext.hidden = false;
      if (state.mode !== "auto") el.btnNext.focus();
    }
  }

  function logAuto(q, choice, isCorrect) {
    var entry = { n: state.index + 1, text: q.text, truth: q.answer, guess: choice, correct: isCorrect };
    state.autoLog.push(entry);
    updateAutoProgress();
    if (!isCorrect) addWrongRow(entry);
  }

  function updateAutoProgress() {
    var done = state.autoLog.length;
    var total = state.deck.length;
    el.autoProgress.textContent = done + " / " + total;
    var acc = done ? (state.correct / done * 100) : 100;
    el.autoAccuracy.textContent = t("quiz.accuracy", { v: acc.toFixed(1) });
    el.autoBar.style.width = (total ? (done / total * 100) : 0) + "%";
  }

  function addWrongRow(entry) {
    var wrongCount = state.autoLog.filter(function (e) { return !e.correct; }).length;
    el.autoWrongCount.textContent = wrongCount;
    el.autoWrongList.insertBefore(buildWrongRow(entry), el.autoWrongList.firstChild);
  }

  function buildWrongRow(entry) {
    var div = document.createElement("div");
    div.className = "result-item " + (entry.truth ? "result-true" : "result-false");
    var tag = document.createElement("span");
    tag.className = "result-tag";
    tag.textContent = t("quiz.answerLine", { truth: tagWord(entry.truth), guess: tagWord(entry.guess) });
    var p = document.createElement("p");
    p.className = "result-text";
    p.textContent = "#" + entry.n + " " + entry.text;
    div.appendChild(tag); div.appendChild(p);
    return div;
  }

  function scheduleAutoNext() {
    state.advanceId = setTimeout(function () { state.advanceId = null; nextQuestion(); }, REVEAL_DELAY);
  }

  function nextQuestion() {
    state.index += 1;
    if (state.mode === "auto" && state.index >= state.deck.length) { finishAuto(); return; }
    showQuestion();
  }

  function finishAuto() {
    clearTimers();
    var total = state.autoLog.length;
    var correct = state.correct;
    var wrong = total - correct;
    var acc = total ? (correct / total * 100) : 0;

    el.summaryTotal.textContent = total;
    el.summaryCorrect.textContent = correct;
    el.summaryWrong.textContent = wrong;
    el.summaryAccuracy.textContent = acc.toFixed(1) + "%";

    var wrongEntries = state.autoLog.filter(function (e) { return !e.correct; });
    el.summaryWrongCount.textContent = wrongEntries.length;
    el.summaryWrongList.innerHTML = "";
    var frag = document.createDocumentFragment();
    wrongEntries.forEach(function (entry) { frag.appendChild(buildWrongRow(entry)); });
    el.summaryWrongList.appendChild(frag);
    showScreen("summary");
  }

  function updateScoreboard() {
    el.scoreCorrect.textContent = state.correct;
    el.scoreWrong.textContent = state.wrong;
    el.scoreStreak.textContent = state.streak;
    el.scoreBest.textContent = state.best;
  }

  function restartScore() {
    clearTimers();
    state.correct = 0; state.wrong = 0; state.streak = 0;
    updateScoreboard(); newDeck(); showQuestion();
  }

  function goHome() { clearTimers(); showScreen("start"); }

  // ---------- Exportacao ----------
  function vf(b) { return tagWord(b); }

  function downloadFile(filename, content, mime) {
    var blob = new Blob([content], { type: mime + ";charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }
  function csvCell(s) { return '"' + String(s).replace(/"/g, '""') + '"'; }

  function exportCsv() {
    var rows = ["indice,gabarito,resposta,resultado,texto"];
    state.autoLog.forEach(function (e) {
      rows.push([e.n, vf(e.truth), vf(e.guess), e.correct ? "acertou" : "errou", csvCell(e.text)].join(","));
    });
    downloadFile("foxyquizz_resultado.csv", "\ufeff" + rows.join("\r\n"), "text/csv");
  }
  function exportJson() {
    var payload = {
      total: state.autoLog.length,
      acertos: state.correct,
      erros: state.autoLog.length - state.correct,
      registros: state.autoLog.map(function (e) {
        return { n: e.n, gabarito: vf(e.truth), resposta: vf(e.guess), acertou: e.correct, texto: e.text };
      })
    };
    downloadFile("foxyquizz_resultado.json", JSON.stringify(payload, null, 2), "application/json");
  }

  // ---------- Pesquisa ----------
  function escapeHtml(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function renderSearch() {
    var raw = el.searchInput.value.trim();
    el.searchResults.innerHTML = "";
    if (raw === "") {
      el.searchCount.textContent = "";
      el.searchResults.innerHTML = '<p class="search-empty">' + t("quiz.searchPrompt", { n: ALL.length }) + "</p>";
      return;
    }
    var needle = normalize(raw);
    if (needle === "") {
      el.searchCount.textContent = "";
      el.searchResults.innerHTML = '<p class="search-empty">' + t("quiz.searchPrompt", { n: ALL.length }) + "</p>";
      return;
    }
    var matches = ALL.filter(function (q) { return q._norm.indexOf(needle) !== -1; });
    el.searchCount.textContent = matches.length === 1 ? t("quiz.results.one") : t("quiz.results.many", { n: matches.length });

    if (matches.length === 0) {
      el.searchResults.innerHTML = '<p class="search-empty">' + t("quiz.searchNone", { q: escapeHtml(raw) }) + "</p>";
      return;
    }
    var MAX = 400;
    var shown = matches.slice(0, MAX);
    var frag = document.createDocumentFragment();
    shown.forEach(function (q) {
      var div = document.createElement("div");
      div.className = "result-item " + (q.answer ? "result-true" : "result-false");
      var tag = document.createElement("span");
      tag.className = "result-tag";
      tag.textContent = tagWord(q.answer);
      var p = document.createElement("p");
      p.className = "result-text";
      p.innerHTML = highlight(q, needle);
      div.appendChild(tag); div.appendChild(p);
      frag.appendChild(div);
    });
    el.searchResults.appendChild(frag);
    if (matches.length > MAX) {
      var more = document.createElement("p");
      more.className = "search-empty";
      more.textContent = t("quiz.showingFirst", { max: MAX, n: matches.length });
      el.searchResults.appendChild(more);
    }
  }

  function highlight(q, needle) {
    var idx = q._norm.indexOf(needle);
    if (idx === -1) return escapeHtml(q.text);
    var start = q._map[idx];
    var end = q._map[idx + needle.length - 1] + 1;
    return escapeHtml(q.text.slice(0, start)) +
      "<mark>" + escapeHtml(q.text.slice(start, end)) + "</mark>" +
      escapeHtml(q.text.slice(end));
  }

  function openSearch() {
    showScreen("search");
    renderSearch();
    el.searchInput.focus();
  }

  // ---------- Init ----------
  function init() {
    ALL = buildDeck();
    ALL.forEach(function (q) {
      var n = buildNorm(q.text);
      q._norm = n.norm; q._map = n.map;
    });

    el = {
      startScreen: document.getElementById("start-screen"),
      gameScreen: document.getElementById("game-screen"),
      searchScreen: document.getElementById("search-screen"),
      summaryScreen: document.getElementById("summary-screen"),
      countTotal: document.getElementById("count-total"),
      btnModeClassic: document.getElementById("btn-mode-classic"),
      btnModeTimed: document.getElementById("btn-mode-timed"),
      btnModeSearch: document.getElementById("btn-mode-search"),
      btnModeAuto: document.getElementById("btn-mode-auto"),
      btnTrue: document.getElementById("btn-true"),
      btnFalse: document.getElementById("btn-false"),
      btnNext: document.getElementById("btn-next"),
      btnRestart: document.getElementById("btn-restart"),
      btnHome: document.getElementById("btn-home"),
      btnHomeSearch: document.getElementById("btn-home-search"),
      questionCard: document.getElementById("question-card"),
      questionText: document.getElementById("question-text"),
      feedback: document.getElementById("feedback"),
      progressText: document.getElementById("progress-text"),
      modeBadge: document.getElementById("mode-badge"),
      timerWrap: document.getElementById("timer-wrap"),
      timerBar: document.getElementById("timer-bar"),
      timerSeconds: document.getElementById("timer-seconds"),
      scoreCorrect: document.getElementById("score-correct"),
      scoreWrong: document.getElementById("score-wrong"),
      scoreStreak: document.getElementById("score-streak"),
      scoreBest: document.getElementById("score-best"),
      searchInput: document.getElementById("search-input"),
      searchResults: document.getElementById("search-results"),
      searchCount: document.getElementById("search-count"),
      autoInfo: document.getElementById("auto-info"),
      autoBar: document.getElementById("auto-bar"),
      autoProgress: document.getElementById("auto-progress"),
      autoAccuracy: document.getElementById("auto-accuracy"),
      autoWrong: document.getElementById("auto-wrong"),
      autoWrongCount: document.getElementById("auto-wrong-count"),
      autoWrongList: document.getElementById("auto-wrong-list"),
      summaryTotal: document.getElementById("summary-total"),
      summaryCorrect: document.getElementById("summary-correct"),
      summaryWrong: document.getElementById("summary-wrong"),
      summaryAccuracy: document.getElementById("summary-accuracy"),
      summaryWrongCount: document.getElementById("summary-wrong-count"),
      summaryWrongList: document.getElementById("summary-wrong-list"),
      btnExportCsv: document.getElementById("btn-export-csv"),
      btnExportJson: document.getElementById("btn-export-json"),
      btnHomeSummary: document.getElementById("btn-home-summary")
    };

    el.countTotal.textContent = ALL.length;
    el.scoreBest.textContent = loadBest();

    el.btnModeClassic.addEventListener("click", function () { startGame("classic"); });
    el.btnModeTimed.addEventListener("click", function () { startGame("timed"); });
    el.btnModeSearch.addEventListener("click", openSearch);
    el.btnModeAuto.addEventListener("click", function () { startGame("auto"); });

    el.btnExportCsv.addEventListener("click", exportCsv);
    el.btnExportJson.addEventListener("click", exportJson);
    el.btnHomeSummary.addEventListener("click", goHome);

    el.btnTrue.addEventListener("click", function () { answer(true); });
    el.btnFalse.addEventListener("click", function () { answer(false); });
    el.btnNext.addEventListener("click", nextQuestion);
    el.btnRestart.addEventListener("click", restartScore);
    el.btnHome.addEventListener("click", goHome);
    el.btnHomeSearch.addEventListener("click", goHome);
    el.searchInput.addEventListener("input", renderSearch);

    document.addEventListener("keydown", function (e) {
      if (GLA.router.current() !== "quiz") return;
      if (!el.gameScreen.classList.contains("active")) return;
      if (!state.answered) {
        if (e.key === "ArrowLeft" || e.key.toLowerCase() === "v") answer(true);
        else if (e.key === "ArrowRight" || e.key.toLowerCase() === "m" || e.key.toLowerCase() === "f") answer(false);
      } else if ((e.key === "Enter" || e.key === " ") && state.mode !== "timed") {
        e.preventDefault();
        nextQuestion();
      }
    });

    // Trocar de perfil recarrega o recorde exibido.
    GLA.bus.on("profile:change", function () {
      state.best = loadBest();
      if (el.scoreBest) el.scoreBest.textContent = state.best;
    });
    // Trocar idioma atualiza rotulos dinamicos da tela ativa.
    GLA.bus.on("lang:change", function () {
      if (el.countTotal) el.countTotal.textContent = ALL.length;
      if (el.searchScreen && el.searchScreen.classList.contains("active")) renderSearch();
    });
  }

  GLA.router && GLA.router.register("quiz", { init: init });
})(window.GLA);
