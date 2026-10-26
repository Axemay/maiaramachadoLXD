/* Inicialização e tratamento de eventos (delegação no documento). */
(function (DT) {
  "use strict";

  var Nav = DT.Nav, Act = DT.Activities, UI = DT.UI, D = DT.data;

  /* Ações de botões identificadas por data-act */
  var actions = {
    reopen: function () { DT.state.opening = null; return {}; },
    retry: function (b) { delete DT.state.checks[b.dataset.id]; delete DT.ui.revealed[b.dataset.id]; return { focus: "f-" + b.dataset.id }; },
    reveal: function (b) { DT.ui.revealed[b.dataset.id] = true; return {}; },
    simretry: function () { delete DT.state.sim[D.SCENARIOS[DT.state.simIndex].id]; return { focus: "f-sim" }; },
    flip: function () { DT.ui.flipped = true; return { after: function () { var r = document.querySelector("[data-rate]"); if (r) r.focus(); } }; },
    cardfilter: function () { DT.state.cardFilter = !DT.state.cardFilter; DT.state.cardIndex = 0; DT.ui.flipped = false; return {}; },
    reset: function () { DT.ui.confirmReset = true; return { after: function () { var y = document.querySelector('[data-act="resetyes"]'); if (y) y.focus(); } }; },
    resetno: function () { DT.ui.confirmReset = false; return {}; },
    resetyes: function () {
      DT.state = DT.Storage.blank();
      DT.ui = { revealed: {}, flipped: false, confirmReset: false, errors: {} };
      DT.Storage.clear();
      UI.announce("Módulo reiniciado.");
      Nav.go("inicio");
      return { handled: true };
    },
    copy: function () {
      var ta = document.getElementById("exportBox"), msg = document.getElementById("copyMsg");
      function fallback() { ta.focus(); ta.select(); msg.textContent = "Texto selecionado. Use Ctrl+C (ou Cmd+C) para copiar."; }
      try { navigator.clipboard.writeText(ta.value).then(function () { msg.textContent = "Registro copiado."; }, fallback); }
      catch (e) { fallback(); }
      return { handled: true };
    }
  };

  document.addEventListener("click", function (ev) {
    var b = ev.target.closest("button");
    if (!b) return;

    if (b.id === "menuBtn") { Nav.setMenu(b.getAttribute("aria-expanded") !== "true"); return; }
    if (b.dataset.go) { Nav.go(b.dataset.go); return; }
    if (b.dataset.scen !== undefined) { DT.state.simIndex = +b.dataset.scen; DT.ui.errors = {}; Nav.render("h1"); return; }
    if (b.dataset.card !== undefined) { DT.state.cardIndex = +b.dataset.card; DT.ui.flipped = false; Nav.render(); return; }
    if (b.dataset.rate) { Act.rateCard(b.dataset.rate); UI.announce("Autoavaliação registrada."); Nav.render(); return; }

    var action = actions[b.dataset.act];
    if (!action) return;
    var result = action(b);
    if (result.handled) return;
    Nav.render(result.focus);
    if (result.after) result.after();
  });

  document.addEventListener("submit", function (ev) {
    ev.preventDefault();
    var form = ev.target, focus;
    if (form.id === "f-opening") focus = Act.submitOpening(form);
    else if (form.dataset.check) focus = Act.submitCheck(form);
    else if (form.id === "f-sim") focus = Act.submitSimulator(form);
    else return;
    Nav.render(focus);
  });

  /* Abre a tela indicada no endereço (#u2, #sim...) ou a última visitada */
  var hash = (location.hash || "").replace("#", "");
  if (hash && DT.Screens[hash]) DT.state.current = hash;
  Nav.render();
})(window.DT = window.DT || {});
