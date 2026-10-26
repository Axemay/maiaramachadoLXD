/* Inicialização do simulador: estado, regras de conclusão e eventos específicos. */
(function (App) {
  "use strict";

  var D = App.data;

  App.store = App.createStore("mm-phishing-v1", function () {
    return { v: 1, current: "inicio", visited: {}, answers: {}, tries: {}, inspected: {}, mailIndex: 0 };
  });
  App.ui = { error: null, confirmReset: false };

  function isDone(id) {
    var t = App.Inbox.totals();
    if (id === "sinais") return !!App.store.state.visited.sinais;
    if (id === "caixa" || id === "fim") return t.answered === D.EMAILS.length;
    return false;
  }

  function progress() {
    var t = App.Inbox.totals();
    return Math.round(((App.store.state.visited.sinais ? 1 : 0) + t.answered) / (1 + D.EMAILS.length) * 100);
  }

  App.start({
    store: App.store,
    screens: D.SCREENS,
    render: App.Screens,
    isDone: isDone,
    progress: progress,
    onLeave: function () { App.ui.error = null; App.ui.confirmReset = false; },
    onClick: function (b) {
      var S = App.store.state;
      if (b.dataset.mail !== undefined) {
        S.mailIndex = +b.dataset.mail; App.ui.error = null;
        App.render();
        var m = document.querySelector(".mail h2"); if (m) { m.setAttribute("tabindex", "-1"); m.focus(); }
        return;
      }
      if (b.dataset.reveal) {
        App.Inbox.reveal(b.dataset.reveal);
        App.render();
        var target = b.dataset.reveal === "link" ? document.querySelector(".link-dest code") : document.querySelector(".mail .addr");
        App.UI.announce(target ? (b.dataset.reveal === "link" ? "Destino real do link: " : "Endereço: ") + target.textContent : "");
        var back = b.dataset.reveal === "link" ? document.querySelector('[data-reveal="link"]') : document.querySelector(".mail h2");
        if (back) { if (!back.matches("button")) back.setAttribute("tabindex", "-1"); back.focus({ preventScroll: true }); }
        return;
      }
      var act = b.dataset.act;
      if (act === "retry") { delete S.answers[D.EMAILS[S.mailIndex].id]; App.render("f-mail"); }
      else if (act === "reset") { App.ui.confirmReset = true; App.render(); var y = document.querySelector('[data-act="resetyes"]'); if (y) y.focus(); }
      else if (act === "resetno") { App.ui.confirmReset = false; App.render(); }
      else if (act === "resetyes") { App.store.reset(); App.ui.confirmReset = false; App.UI.announce("Simulador reiniciado."); App.go("inicio"); }
    },
    onSubmit: function (form) {
      if (form.id !== "f-mail") return;
      App.render(App.Inbox.submit(form));
    }
  });
})(window.App = window.App || {});
