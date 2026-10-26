/* Navegação: sumário, barra de progresso, troca de telas e gestão de foco. */
(function (DT) {
  "use strict";

  var D = DT.data, UI = DT.UI, A = DT.Assessment;
  var PDF_PATH = "assets/apostila-design-thinking-m1.pdf";

  function renderToc() {
    var html = "<ol>", lastGroup;
    D.SCREENS.forEach(function (s) {
      if (s.grp && s.grp !== lastGroup) html += '<li class="grp" aria-hidden="true">' + s.grp + '</li>';
      lastGroup = s.grp;
      var done = A.screenDone(s.id), seen = DT.state.visited[s.id];
      html += '<li><button type="button" data-go="' + s.id + '"' + (DT.state.current === s.id ? ' aria-current="page"' : "") + '>' +
        '<span class="st ' + (done ? "done" : (seen ? "seen" : "")) + '" aria-hidden="true">' + (done ? "✓" : "") + '</span>' +
        '<span>' + UI.esc(s.title) + '<span class="sr">' + (done ? ", concluído" : (seen ? ", visitado" : "")) + '</span></span></button></li>';
    });
    html += "</ol>" +
      '<a class="dl" href="' + PDF_PATH + '" target="_blank" rel="noopener">' +
      '<span class="dl-ic" aria-hidden="true">↓</span>' +
      '<span><b>Baixar apostila (PDF)</b><small>19 páginas · conteúdo, exercícios e gabarito</small></span></a>';
    document.getElementById("toc").innerHTML = html;
  }

  function renderProgress() {
    var t = A.totals();
    document.getElementById("progLabel").textContent = t.pct + "% concluído";
    document.getElementById("progFill").style.width = t.pct + "%";
  }

  function render(focusId) {
    var S = DT.state;
    if (!DT.Screens[S.current]) S.current = "inicio";
    S.visited[S.current] = true;
    if (S.current !== "inicio") S.last = S.current;
    DT.save();
    document.getElementById("main").innerHTML = DT.Screens[S.current]() + UI.pager(S.current);
    renderToc();
    renderProgress();
    if (focusId) {
      var el = document.getElementById(focusId);
      if (el) el.focus();
    }
  }

  function setMenu(open) {
    document.getElementById("toc").classList.toggle("open", open);
    document.getElementById("menuBtn").setAttribute("aria-expanded", String(open));
  }

  function go(id) {
    DT.state.current = id;
    DT.ui.errors = {};
    DT.ui.flipped = false;
    DT.ui.confirmReset = false;
    try { history.replaceState(null, "", "#" + id); } catch (e) { /* ambiente sem histórico */ }
    render("h1");
    window.scrollTo({ top: 0, behavior: "auto" });
    setMenu(false);
  }

  DT.Nav = { render: render, go: go, setMenu: setMenu };
})(window.DT = window.DT || {});
