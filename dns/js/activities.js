/* Interações do explicativo: diagrama passo a passo, ordenação das etapas e diagnóstico de situações. */
(function (App) {
  "use strict";

  var D = App.data, UI = App.UI, esc = UI.esc;
  var BOX_W = 132, BOX_H = 50;

  function S() { return App.store.state; }

  /* ---------- Diagrama ---------- */
  function edgePoint(from, to) {
    /* ponto na borda da caixa "from", na direção de "to" */
    var dx = to.x - from.x, dy = to.y - from.y;
    var sx = Math.abs(dx) > 0 ? (BOX_W / 2 + 6) / Math.abs(dx) : Infinity;
    var sy = Math.abs(dy) > 0 ? (BOX_H / 2 + 6) / Math.abs(dy) : Infinity;
    var s = Math.min(sx, sy);
    return { x: from.x + dx * s, y: from.y + dy * s };
  }

  function diagram(step) {
    var active = step.nodes, svg = "";
    step.arrows.forEach(function (a, k) {
      var f = D.NODES[a[0]], t = D.NODES[a[1]];
      var p1 = edgePoint(f, t), p2 = edgePoint(t, f);
      /* setas de ida e volta entre os mesmos nós ficam lado a lado */
      var reverse = step.arrows.some(function (b) { return b[0] === a[1] && b[1] === a[0]; });
      var off = reverse ? (k === 0 ? -9 : 9) : 0;
      var len = Math.hypot(p2.x - p1.x, p2.y - p1.y), nx = -(p2.y - p1.y) / len * off, ny = (p2.x - p1.x) / len * off;
      var mx = (p1.x + p2.x) / 2 + nx * 2.4, my = (p1.y + p2.y) / 2 + ny * 2.4;
      var w = a[2].length * 6.6 + 16;
      svg += '<line class="flow" x1="' + (p1.x + nx) + '" y1="' + (p1.y + ny) + '" x2="' + (p2.x + nx) + '" y2="' + (p2.y + ny) + '" marker-end="url(#arrow)"/>' +
        '<g class="flow-label"><rect x="' + (mx - w / 2) + '" y="' + (my - 12) + '" width="' + w + '" height="22" rx="11"/>' +
        '<text x="' + mx + '" y="' + (my + 4) + '" text-anchor="middle">' + esc(a[2]) + '</text></g>';
    });
    var nodes = Object.keys(D.NODES).map(function (id) {
      var n = D.NODES[id], on = active.indexOf(id) >= 0;
      return '<g class="node' + (on ? " is-on" : "") + '"><rect x="' + (n.x - BOX_W / 2) + '" y="' + (n.y - BOX_H / 2) + '" width="' + BOX_W + '" height="' + BOX_H + '" rx="10"/>' +
        '<text x="' + n.x + '" y="' + (n.y - 3) + '" text-anchor="middle">' + n.label[0] + '</text>' +
        '<text x="' + n.x + '" y="' + (n.y + 14) + '" text-anchor="middle" class="l2">' + n.label[1] + '</text></g>';
    }).join("");
    var desc = "Passo " + (S().step + 1) + ": " + step.title + ". " +
      (step.arrows.length ? step.arrows.map(function (a) { return D.NODES[a[0]].label.join(" ") + " para " + D.NODES[a[1]].label.join(" ") + ": " + a[2]; }).join("; ") : "Tudo acontece no seu navegador.");
    var cx = active.reduce(function (sum, id) { return sum + D.NODES[id].x; }, 0) / active.length;
    return '<p class="swipe-hint">Deslize o diagrama para o lado para ver todos os servidores.</p>' +
      '<div class="diagram net" data-focus-x="' + Math.round(cx) + '"><svg viewBox="0 0 720 330" role="img" aria-label="' + esc(desc) + '">' +
      '<defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="arrowhead"/></marker></defs>' +
      nodes + svg + '</svg></div>';
  }

  function journey() {
    var i = S().step, step = D.STEPS[i], n = D.STEPS.length;
    var dots = D.STEPS.map(function (s, k) {
      var seen = S().seenSteps[k];
      return '<button type="button" class="dot' + (seen ? " seen" : "") + '" data-step="' + k + '"' + (k === i ? ' aria-current="step"' : "") + ' aria-label="Passo ' + (k + 1) + ': ' + esc(s.title) + (seen ? ", visto" : "") + '">' + (k + 1) + '</button>';
    }).join("");
    return '<div class="stepper">' +
      '<div class="dots" role="group" aria-label="Passos">' + dots + '</div>' +
      diagram(step) +
      '<div class="step-panel" id="stepPanel" tabindex="-1" aria-live="polite">' +
        '<p class="eyebrow">Passo ' + (i + 1) + ' de ' + n + '</p><h2>' + esc(step.title) + '</h2><p>' + esc(step.text) + '</p>' +
        (step.detail ? '<p class="detail">' + esc(step.detail) + '</p>' : "") +
        (step.why ? '<div class="why"><p class="eyebrow">Por que isso importa</p><p>' + esc(step.why) + '</p></div>' : "") +
      '</div>' +
      '<div class="row row--between"><button type="button" class="btn quiet" data-step="' + (i - 1) + '"' + (i === 0 ? " disabled" : "") + '>← Passo anterior</button>' +
      (i < n - 1 ? '<button type="button" class="btn" data-step="' + (i + 1) + '">Próximo passo →</button>'
                 : '<button type="button" class="btn" data-go="ordenar">Praticar: coloque em ordem →</button>') + '</div></div>';
  }

  /* ---------- Ordenação ---------- */
  function orderResult() {
    var r = S().orderChecked;
    if (!r) return null;
    var correct = D.ORDER_ITEMS.map(function (x) { return x.id; });
    var hits = r.order.filter(function (id, k) { return correct[k] === id; }).length;
    return { hits: hits, total: correct.length, order: r.order, correct: correct };
  }

  function ordering() {
    var order = S().order, res = orderResult(), locked = !!res;
    var items = order.map(function (id, k) {
      var it = D.ORDER_ITEMS.filter(function (x) { return x.id === id; })[0];
      var mark = "";
      if (res) {
        var right = res.correct[k] === id, pos = res.correct.indexOf(id) + 1;
        mark = '<span class="ord-mark ' + (right ? "is-ok" : "is-bad") + '"><span aria-hidden="true">' + (right ? "✓" : "✕") + '</span> ' + (right ? "Posição correta" : "Vai na posição " + pos) + '</span>';
      }
      return '<li class="ord-item"><span class="ord-n" aria-hidden="true">' + (k + 1) + '</span><span class="ord-t">' + esc(it.text) + mark + '</span>' +
        (locked ? "" : '<span class="ord-btns"><button type="button" class="mv" data-move="' + k + ':-1"' + (k === 0 ? " disabled" : "") + ' aria-label="Subir: ' + esc(it.text) + '">↑</button>' +
        '<button type="button" class="mv" data-move="' + k + ':1"' + (k === order.length - 1 ? " disabled" : "") + ' aria-label="Descer: ' + esc(it.text) + '">↓</button></span>') + '</li>';
    }).join("");
    var fb = "";
    if (res) {
      var kind = res.hits === res.total ? "ok" : (res.hits >= 3 ? "part" : "bad");
      fb = UI.feedback(kind, (res.hits === res.total ? "Sequência correta" : "Sequência com trocas") + ' <span class="score">(' + res.hits + ' de ' + res.total + ' na posição certa)</span>',
        '<p>A lógica: o nome precisa virar número antes de qualquer conexão. A busca vai do mais próximo (memória, resolvedor) ao mais distante (raiz, .br, servidor do domínio). E a conexão segura vem antes do pedido da página, porque o pedido já viaja cifrado.</p>' +
        (S().orderTries > 1 ? '<p class="muted small">Tentativa ' + S().orderTries + '.</p>' : ""), "fb-order") +
        '<div class="row"><button type="button" class="btn quiet" data-act="orderretry">Refazer</button><button type="button" class="btn" data-go="diagnostico">Próxima atividade →</button></div>';
    }
    return '<div class="activity" id="orderBox">' +
      (res ? "" : UI.cta(["Use as setas ↑ e ↓ para mover cada etapa até a posição certa, da primeira (1) à última (6).", "Quando terminar, clique em <b>Verificar ordem</b>."])) +
      '<ol class="ord-list" aria-label="Etapas na ordem atual">' + items + '</ol>' +
      (res ? fb : '<div class="row"><button type="button" class="btn" data-act="ordercheck">Verificar ordem</button></div>') + '</div>';
  }

  function move(spec) {
    var p = spec.split(":"), k = +p[0], d = +p[1], o = S().order, j = k + d;
    if (j < 0 || j >= o.length) return k;
    var tmp = o[k]; o[k] = o[j]; o[j] = tmp;
    return j;
  }

  /* ---------- Diagnóstico ---------- */
  function diagnosis() {
    return D.DIAGNOSES.map(function (q, n) {
      var r = S().diag[q.id], err = App.ui.errors[q.id];
      var opts = D.LAYERS.map(function (l) {
        return '<label class="opt"><input type="radio" name="' + q.id + '" value="' + l[0] + '"' + (r === l[0] ? " checked" : "") + (r ? " disabled" : "") + '><span>' + l[1] + '</span></label>';
      }).join("");
      var fb = "";
      if (r) {
        var ok = r === q.ans, right = D.LAYERS.filter(function (l) { return l[0] === q.ans; })[0][1];
        fb = UI.feedback(ok ? "ok" : "bad", ok ? "Diagnóstico certo" : "Não é aí",
          '<p>' + esc(q.fb[r]) + '</p>' + (ok ? "" : '<p><b>Onde está o problema: ' + right + '.</b> ' + esc(q.fb[q.ans]) + '</p>'), "fb-" + q.id) +
          '<div class="row"><button type="button" class="btn quiet" data-act="diagretry" data-id="' + q.id + '">Refazer</button></div>';
      }
      return '<form class="activity" id="f-' + q.id + '" data-diag="' + q.id + '" novalidate>' +
        '<p class="eyebrow">Situação ' + (n + 1) + ' de ' + D.DIAGNOSES.length + '</p><p class="situ">' + esc(q.text) + '</p>' +
        '<fieldset><legend>Em que etapa está o problema?</legend>' + opts + '</fieldset>' +
        (err ? '<p class="err" role="alert">' + err + '</p>' : "") +
        (r ? fb : '<div class="row"><button type="submit" class="btn">Verificar</button></div>') + '</form>';
    }).join("");
  }

  function submitDiagnosis(form) {
    var id = form.dataset.diag, v = form.querySelector('input[name="' + id + '"]:checked');
    if (!v) { App.ui.errors[id] = "Escolha uma etapa antes de verificar."; return "f-" + id; }
    App.ui.errors[id] = null;
    S().diag[id] = v.value;
    return "fb-" + id;
  }

  /* ---------- Avaliação ---------- */
  function totals() {
    var seen = D.STEPS.filter(function (s, k) { return S().seenSteps[k]; }).length;
    var res = orderResult();
    var answered = D.DIAGNOSES.filter(function (q) { return S().diag[q.id]; }).length;
    var right = D.DIAGNOSES.filter(function (q) { return S().diag[q.id] === q.ans; }).length;
    var done = seen + (res ? 1 : 0) + answered, total = D.STEPS.length + 1 + D.DIAGNOSES.length;
    return {
      seen: seen, orderHits: res ? res.hits : null, answered: answered, right: right,
      pct: Math.round(done / total * 100), complete: done === total,
      demonstrated: !!res && res.hits === res.total && right >= 3
    };
  }

  App.Act = {
    journey: journey, ordering: ordering, move: move, orderResult: orderResult,
    diagnosis: diagnosis, submitDiagnosis: submitDiagnosis, totals: totals
  };
})(window.App = window.App || {});
