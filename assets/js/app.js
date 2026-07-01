// app.js - bootstrap do shell: idioma, perfis, sidebar, roteamento.
(function (GLA) {
  "use strict";

  var t = function (k, p) { return GLA.i18n.t(k, p); };
  var editingId = null;

  // ---------------- Sidebar (mobile) ----------------
  function setupSidebar() {
    var toggle = document.getElementById("menu-toggle");
    var scrim = document.querySelector("[data-close-sidebar]");
    function open() { document.body.classList.add("sidebar-open"); }
    function close() { document.body.classList.remove("sidebar-open"); }
    if (toggle) toggle.addEventListener("click", function () {
      document.body.classList.toggle("sidebar-open");
    });
    if (scrim) scrim.addEventListener("click", close);
    GLA.bus.on("route:change", close);
  }

  // ---------------- Navegacao ----------------
  function setupNav() {
    document.querySelectorAll("[data-nav]").forEach(function (el) {
      el.addEventListener("click", function (e) {
        e.preventDefault();
        GLA.router.go(el.getAttribute("data-nav"));
      });
    });
  }

  // ---------------- Idioma ----------------
  function setupLang() {
    var wrap = document.getElementById("lang-switch");
    function refresh() {
      wrap.querySelectorAll(".lang-btn").forEach(function (b) {
        b.classList.toggle("active", b.getAttribute("data-lang") === GLA.i18n.current());
      });
    }
    wrap.querySelectorAll(".lang-btn").forEach(function (b) {
      b.addEventListener("click", function () { GLA.i18n.setLang(b.getAttribute("data-lang")); });
    });
    GLA.bus.on("lang:change", refresh);
    refresh();
  }

  // ---------------- Perfis ----------------
  function updateChip() {
    var p = GLA.profiles.active();
    var avatar = document.getElementById("profile-avatar");
    var name = document.getElementById("profile-chip-name");
    avatar.textContent = p.emoji || "\uD83D\uDC64";
    avatar.style.background = p.color || "#e8c468";
    name.textContent = p.name;
  }

  function fillForm(p) {
    document.getElementById("profile-name-input").value = p ? p.name : "";
    document.getElementById("profile-emoji-input").value = p ? p.emoji : "\uD83D\uDC64";
    document.getElementById("profile-color-input").value = p ? p.color : "#e8c468";
    editingId = p ? p.id : null;
  }

  function renderProfileList() {
    var list = document.getElementById("profile-list");
    var active = GLA.profiles.active();
    list.innerHTML = "";
    GLA.profiles.list().forEach(function (p) {
      var row = document.createElement("div");
      row.className = "profile-row" + (p.id === active.id ? " active" : "");
      row.innerHTML =
        '<span class="profile-avatar" style="background:' + (p.color || "#e8c468") + '">' + (p.emoji || "\uD83D\uDC64") + "</span>" +
        '<span class="p-name"></span>' +
        (p.id === active.id ? '<span class="p-active-tag">' + t("profile.activeTag") + "</span>" : "");
      row.querySelector(".p-name").textContent = p.name;
      row.addEventListener("click", function () {
        GLA.profiles.setActive(p.id);
        fillForm(GLA.profiles.active());
        renderProfileList();
      });
      list.appendChild(row);
    });
  }

  function status(msg, ok) {
    var el = document.getElementById("profile-status");
    el.textContent = msg;
    el.className = "status-msg " + (ok ? "ok" : "err");
  }

  function setupProfileModal() {
    var modal = document.getElementById("profile-modal");
    var chip = document.getElementById("profile-chip");

    function open() {
      renderProfileList();
      fillForm(GLA.profiles.active());
      status("", true);
      modal.classList.add("open");
    }
    function close() { modal.classList.remove("open"); }

    chip.addEventListener("click", open);
    document.getElementById("profile-close").addEventListener("click", close);
    modal.addEventListener("click", function (e) { if (e.target === modal) close(); });

    document.getElementById("profile-new").addEventListener("click", function () {
      fillForm(null);
      status("", true);
      document.getElementById("profile-name-input").focus();
    });

    document.getElementById("profile-create").addEventListener("click", function () {
      var name = document.getElementById("profile-name-input").value.trim();
      if (!name) { status(t("profile.needName"), false); return; }
      var payload = {
        id: editingId,
        name: name,
        emoji: document.getElementById("profile-emoji-input").value,
        color: document.getElementById("profile-color-input").value
      };
      var saved = GLA.profiles.upsert(payload);
      editingId = saved.id;
      renderProfileList();
      status(t("profile.saved"), true);
    });

    document.getElementById("profile-delete").addEventListener("click", function () {
      var ok = GLA.profiles.remove(GLA.profiles.active().id);
      if (!ok) { status(t("profile.cantDeleteLast"), false); return; }
      fillForm(GLA.profiles.active());
      renderProfileList();
      status(t("profile.deleted"), true);
    });

    document.getElementById("profile-export").addEventListener("click", function () {
      var payload = GLA.profiles.exportActive();
      var blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json;charset=utf-8" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download = "gla-perfil-" + (payload.profile.name || "perfil").replace(/\s+/g, "_") + ".json";
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    });

    var fileInput = document.getElementById("profile-file");
    document.getElementById("profile-import").addEventListener("click", function () { fileInput.click(); });
    fileInput.addEventListener("change", function () {
      var file = fileInput.files && fileInput.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function () {
        try {
          GLA.profiles.importPayload(JSON.parse(reader.result));
          fillForm(GLA.profiles.active());
          renderProfileList();
          status(t("profile.imported"), true);
        } catch (e) {
          status(t("profile.importFail"), false);
        }
        fileInput.value = "";
      };
      reader.readAsText(file);
    });

    document.getElementById("profile-share").addEventListener("click", function () {
      var link = GLA.profiles.shareText();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(link).then(
          function () { status(t("profile.copied"), true); },
          function () { window.prompt(t("profile.copyFail"), link); }
        );
      } else {
        window.prompt(t("profile.copyFail"), link);
      }
    });

    // Fecha modal com ESC.
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
  }

  // ---------------- Boot ----------------
  function boot() {
    GLA.i18n.init();
    GLA.profiles.init();
    GLA.i18n.setLang(GLA.i18n.current());

    setupSidebar();
    setupNav();
    setupLang();
    setupProfileModal();

    updateChip();
    GLA.bus.on("profile:change", function () {
      updateChip();
      var modal = document.getElementById("profile-modal");
      if (modal.classList.contains("open")) renderProfileList();
    });
    GLA.bus.on("lang:change", function () { updateChip(); });

    GLA.router.start("home");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})(window.GLA);
