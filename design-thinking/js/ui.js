/* Componentes de interface reutilizáveis: geram HTML a partir de dados.
   Todo texto vindo dos dados passa por esc() antes de entrar no HTML. */
(function (DT) {
  "use strict";

  var SYMBOLS = { ok: "✓", part: "◐", bad: "✕", info: "→" };

  var UI = {
    esc: function (t) {
      return String(t).replace(/[&<>"]/g, function (c) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" }[c];
      });
    },

    /* Faixa de conteúdo com fundo próprio.
       kind: intro | content | case | activity | soft | nav */
    band: function (kind, inner, label) {
      return '<section class="band band--' + kind + '"><div class="in">' +
        (label ? '<p class="eyebrow band-label">' + label + '</p>' : "") +
        inner + '</div></section>';
    },

    head: function (eyebrow, title, lead) {
      return '<p class="eyebrow">' + eyebrow + '</p><h1 tabindex="-1" id="h1">' + title + '</h1>' +
        (lead ? '<p class="lead">' + lead + '</p>' : "");
    },

    /* Instrução de ação: aparece antes de toda interação que não é óbvia. */
    cta: function (steps) {
      var body = steps.length === 1
        ? '<p>' + steps[0] + '</p>'
        : '<ol>' + steps.map(function (s) { return '<li>' + s + '</li>'; }).join("") + '</ol>';
      return '<div class="cta"><p class="cta-h"><span aria-hidden="true">▸</span> O que fazer</p>' + body + '</div>';
    },

    /* Caixa de feedback: cor + símbolo + texto, para não depender só de cor. */
    feedback: function (kind, verdict, body, focusId) {
      return '<div class="fb ' + kind + '"' + (focusId ? ' id="' + focusId + '" tabindex="-1"' : "") + '>' +
        '<p class="v"><span class="sym" aria-hidden="true">' + SYMBOLS[kind] + '</span>' + verdict + '</p>' + body + '</div>';
    },

    pager: function (currentId) {
      var screens = DT.data.SCREENS, i = 0;
      for (var k = 0; k < screens.length; k++) if (screens[k].id === currentId) i = k;
      var prev = screens[i - 1], next = screens[i + 1];
      return UI.band("nav", '<div class="pager">' +
        (prev ? '<button type="button" class="btn quiet" data-go="' + prev.id + '">← ' + UI.esc(prev.title) + '</button>' : '<span></span>') +
        (next ? '<button type="button" class="btn" data-go="' + next.id + '">' + UI.esc(next.title) + ' →</button>' : "") +
        '</div>');
    },

    announce: function (text) {
      var live = document.getElementById("live");
      live.textContent = "";
      setTimeout(function () { live.textContent = text; }, 40);
    }
  };

  DT.UI = UI;
})(window.DT = window.DT || {});
