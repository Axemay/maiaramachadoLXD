/* Núcleo compartilhado pelos objetos de aprendizagem do portfólio:
   armazenamento local, componentes de interface e navegação entre telas.
   Cada objeto chama App.start({...}) com suas próprias telas e regras de conclusão. */
(function (App) {
  "use strict";

  /* ---------- Armazenamento ---------- */
  App.createStore = function (key, blank) {
    var store = { available: true, state: blank() };
    try {
      localStorage.setItem(key + "-t", "1");
      localStorage.removeItem(key + "-t");
      var raw = localStorage.getItem(key);
      if (raw) {
        var saved = JSON.parse(raw);
        if (saved && saved.v === store.state.v) store.state = Object.assign(blank(), saved);
      }
    } catch (e) {
      store.available = false;
    }
    store.save = function () {
      try { localStorage.setItem(key, JSON.stringify(store.state)); } catch (e) { store.available = false; }
    };
    store.reset = function () {
      store.state = blank();
      try { localStorage.removeItem(key); } catch (e) { /* sem armazenamento */ }
    };
    return store;
  };

  /* ---------- Componentes ---------- */
  var SYMBOLS = { ok: "✓", part: "◐", bad: "✕", info: "→" };
  var UI = App.UI = {
    esc: function (t) {
      return String(t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" }[c]; });
    },
    band: function (kind, inner, label) {
      return '<section class="band band--' + kind + '"><div class="in">' +
        (label ? '<p class="eyebrow band-label">' + label + '</p>' : "") + inner + '</div></section>';
    },
    head: function (eyebrow, title, lead) {
      return '<p class="eyebrow">' + eyebrow + '</p><h1 tabindex="-1" id="h1">' + title + '</h1>' + (lead ? '<p class="lead">' + lead + '</p>' : "");
    },
    cta: function (steps) {
      var body = steps.length === 1 ? '<p>' + steps[0] + '</p>'
        : '<ol>' + steps.map(function (s) { return '<li>' + s + '</li>'; }).join("") + '</ol>';
      return '<div class="cta"><p class="cta-h"><span aria-hidden="true">▸</span> O que fazer</p>' + body + '</div>';
    },
    feedback: function (kind, verdict, body, focusId) {
      return '<div class="fb ' + kind + '"' + (focusId ? ' id="' + focusId + '" tabindex="-1"' : "") + '>' +
        '<p class="v"><span class="sym" aria-hidden="true">' + SYMBOLS[kind] + '</span>' + verdict + '</p>' + body + '</div>';
    },
    announce: function (text) {
      var live = document.getElementById("live");
      live.textContent = "";
      setTimeout(function () { live.textContent = text; }, 40);
    }
  };

  /* ---------- Navegação ----------
     config: { screens:[{id,title,grp}], render:{id:fn}, isDone(id), progress()->0..100, store, menuExtra } */
  App.start = function (config) {
    var store = config.store;
    App.config = config;

    function pager(current) {
      var s = config.screens, i = 0;
      for (var k = 0; k < s.length; k++) if (s[k].id === current) i = k;
      var prev = s[i - 1], next = s[i + 1];
      return UI.band("nav", '<div class="pager">' +
        (prev ? '<button type="button" class="btn quiet" data-go="' + prev.id + '">← ' + UI.esc(prev.title) + '</button>' : '<span></span>') +
        (next ? '<button type="button" class="btn" data-go="' + next.id + '">' + UI.esc(next.title) + ' →</button>' : "") + '</div>');
    }

    function renderToc() {
      var html = "<ol>", last;
      config.screens.forEach(function (s) {
        if (s.grp && s.grp !== last) html += '<li class="grp" aria-hidden="true">' + s.grp + '</li>';
        last = s.grp;
        var done = config.isDone(s.id), seen = store.state.visited[s.id];
        html += '<li><button type="button" data-go="' + s.id + '"' + (store.state.current === s.id ? ' aria-current="page"' : "") + '>' +
          '<span class="st ' + (done ? "done" : (seen ? "seen" : "")) + '" aria-hidden="true">' + (done ? "✓" : "") + '</span>' +
          '<span>' + UI.esc(s.title) + '<span class="sr">' + (done ? ", concluído" : (seen ? ", visitado" : "")) + '</span></span></button></li>';
      });
      document.getElementById("toc").innerHTML = html + "</ol>" + (config.menuExtra || "");
    }

    function render(focusId) {
      var S = store.state;
      if (!config.render[S.current]) S.current = config.screens[0].id;
      S.visited[S.current] = true;
      store.save();
      document.getElementById("main").innerHTML = config.render[S.current]() + pager(S.current);
      renderToc();
      var pct = config.progress();
      document.getElementById("progLabel").textContent = pct + "% concluído";
      document.getElementById("progFill").style.width = pct + "%";
      if (focusId) { var el = document.getElementById(focusId); if (el) el.focus(); }
    }

    function setMenu(open) {
      document.getElementById("toc").classList.toggle("open", open);
      document.getElementById("menuBtn").setAttribute("aria-expanded", String(open));
    }

    function go(id) {
      store.state.current = id;
      if (config.onLeave) config.onLeave();
      try { history.replaceState(null, "", "#" + id); } catch (e) { /* sem histórico */ }
      render("h1");
      window.scrollTo({ top: 0, behavior: "auto" });
      setMenu(false);
    }

    App.render = render;
    App.go = go;

    document.addEventListener("click", function (ev) {
      var b = ev.target.closest("button");
      if (!b) return;
      if (b.id === "menuBtn") { setMenu(b.getAttribute("aria-expanded") !== "true"); return; }
      if (b.dataset.go) { go(b.dataset.go); return; }
      if (config.onClick) config.onClick(b, ev);
    });
    document.addEventListener("submit", function (ev) {
      ev.preventDefault();
      if (config.onSubmit) config.onSubmit(ev.target);
    });

    var hash = (location.hash || "").replace("#", "");
    if (hash && config.render[hash]) store.state.current = hash;
    render();
  };
})(window.App = window.App || {});
