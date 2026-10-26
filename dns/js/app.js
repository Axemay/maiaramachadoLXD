/* Inicialização do explicativo: estado, regras de conclusão e eventos específicos. */
(function (App) {
  "use strict";

  var D = App.data;

  App.store = App.createStore("mm-dns-v1", function () {
    return { v: 1, current: "inicio", visited: {}, step: 0, seenSteps: {}, order: D.ORDER_START.slice(), orderChecked: null, orderTries: 0, diag: {} };
  });
  App.ui = { errors: {}, confirmReset: false };

  function isDone(id) {
    var t = App.Act.totals(), S = App.store.state;
    if (id === "jornada") return t.seen === D.STEPS.length;
    if (id === "ordenar") return !!S.orderChecked;
    if (id === "diagnostico") return t.answered === D.DIAGNOSES.length;
    if (id === "fim") return t.complete;
    return false;
  }

  /* No celular o diagrama rola na horizontal: centraliza a área do passo atual. */
  function centerDiagram() {
    var box = document.querySelector(".net");
    if (!box || box.scrollWidth <= box.clientWidth) return;
    var ratio = +box.dataset.focusX / 720;
    box.scrollLeft = Math.max(0, ratio * box.scrollWidth - box.clientWidth / 2);
  }
  new MutationObserver(centerDiagram).observe(document.getElementById("main"), { childList: true });

  App.start({
    store: App.store,
    screens: D.SCREENS,
    render: App.Screens,
    isDone: isDone,
    progress: function () { return App.Act.totals().pct; },
    onLeave: function () {
      App.ui.errors = {}; App.ui.confirmReset = false;
      if (App.store.state.current === "jornada") App.store.state.seenSteps[App.store.state.step] = true;
    },
    onClick: function (b) {
      var S = App.store.state;
      if (b.dataset.step !== undefined) {
        S.step = Math.max(0, Math.min(D.STEPS.length - 1, +b.dataset.step));
        S.seenSteps[S.step] = true;
        App.render("stepPanel");
        return;
      }
      if (b.dataset.move) {
        var to = App.Act.move(b.dataset.move);
        App.render();
        var dir = b.dataset.move.split(":")[1];
        var btn = document.querySelector('[data-move="' + to + ':' + dir + '"]:not([disabled])') || document.querySelector('[data-move^="' + to + ':"]:not([disabled])');
        if (btn) btn.focus();
        var item = D.ORDER_ITEMS.filter(function (x) { return x.id === S.order[to]; })[0];
        App.UI.announce(item.text + ", agora na posição " + (to + 1));
        return;
      }
      var act = b.dataset.act;
      if (act === "ordercheck") { S.orderChecked = { order: S.order.slice() }; S.orderTries++; App.render("fb-order"); }
      else if (act === "orderretry") { S.orderChecked = null; App.render("orderBox"); }
      else if (act === "diagretry") { delete S.diag[b.dataset.id]; App.render("f-" + b.dataset.id); }
      else if (act === "reset") { App.ui.confirmReset = true; App.render(); var y = document.querySelector('[data-act="resetyes"]'); if (y) y.focus(); }
      else if (act === "resetno") { App.ui.confirmReset = false; App.render(); }
      else if (act === "resetyes") { App.store.reset(); App.ui.confirmReset = false; App.UI.announce("Respostas apagadas."); App.go("inicio"); }
    },
    onSubmit: function (form) {
      if (!form.dataset.diag) return;
      App.render(App.Act.submitDiagnosis(form));
    }
  });

  /* O primeiro passo conta como visto ao abrir a jornada */
  if (App.store.state.current === "jornada" && !App.store.state.seenSteps[App.store.state.step]) {
    App.store.state.seenSteps[App.store.state.step] = true;
    App.render();
  }
})(window.App = window.App || {});
