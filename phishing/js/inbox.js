/* Simulador de triagem: renderização da caixa de entrada, inspeção de evidências,
   registro da análise (sinais + ação) e regras de avaliação. */
(function (App) {
  "use strict";

  var D = App.data, UI = App.UI, esc = UI.esc;
  var GRADE_TEXT = { ok: "Ação adequada", part: "Ação aceitável, com ressalvas", bad: "Ação arriscada" };
  var KIND_TEXT = { phishing: "Golpe", legitimo: "Legítimo" };

  function S() { return App.store.state; }
  function label(list, id) { return list.filter(function (x) { return x.id === id; })[0].label; }

  /* ---------- Avaliação ---------- */
  function signalResult(email, answer) {
    var chosen = answer.signals || [];
    return {
      hits: email.signals.filter(function (s) { return chosen.indexOf(s) >= 0; }),
      missed: email.signals.filter(function (s) { return chosen.indexOf(s) < 0; }),
      wrong: chosen.filter(function (s) { return email.signals.indexOf(s) < 0; })
    };
  }

  function grade(email) {
    var a = S().answers[email.id];
    return a ? email.actions[a.action][0] : null;
  }

  function totals() {
    var t = { answered: 0, ok: 0, badOnPhishing: 0, hits: 0, expected: 0, wrong: 0, inspected: 0 };
    D.EMAILS.forEach(function (e) {
      var a = S().answers[e.id], ins = S().inspected[e.id] || {};
      if (ins.from || ins.link) t.inspected++;
      t.expected += e.signals.length;
      if (!a) return;
      t.answered++;
      var g = grade(e), r = signalResult(e, a);
      if (g === "ok") t.ok++;
      if (g === "bad" && e.kind === "phishing") t.badOnPhishing++;
      t.hits += r.hits.length;
      t.wrong += r.wrong.length;
    });
    t.demonstrated = t.answered === D.EMAILS.length && t.ok >= 4 && t.badOnPhishing === 0;
    return t;
  }

  /* ---------- Caixa de entrada ---------- */
  function list(current) {
    return '<ol class="inbox-list" aria-label="Mensagens">' + D.EMAILS.map(function (e, i) {
      var g = grade(e);
      var status = g ? '<span class="mail-status s-' + g + '"><span aria-hidden="true">' + { ok: "✓", part: "◐", bad: "✕" }[g] + '</span> ' + { ok: "Adequada", part: "Com ressalvas", bad: "Arriscada" }[g] + '</span>'
        : '<span class="mail-status">Não analisado</span>';
      return '<li><button type="button" class="inbox-item' + (i === current ? " is-current" : "") + '" data-mail="' + i + '"' + (i === current ? ' aria-current="true"' : "") + '>' +
        '<span class="from">' + esc(e.from.name) + '</span><span class="subj">' + esc(e.subject) + '</span>' +
        '<span class="meta"><span>' + esc(e.date) + '</span>' + status + '</span></button></li>';
    }).join("") + '</ol>';
  }

  function mail(e) {
    var answered = !!S().answers[e.id], ins = S().inspected[e.id] || {};
    var showFrom = answered || ins.from, showLink = answered || ins.link;
    var link = "";
    if (e.link) {
      link = '<p><button type="button" class="' + (e.link.button ? "mail-cta" : "mail-link") + '" data-reveal="link" aria-expanded="' + !!showLink + '" aria-controls="dest-' + e.id + '">' + esc(e.link.text) + '</button></p>' +
        '<p class="link-dest" id="dest-' + e.id + '"' + (showLink ? "" : " hidden") + '><span>Destino real do link</span><code>' + esc(e.link.href) + '</code></p>';
    }
    return '<article class="mail" aria-labelledby="subj-' + e.id + '">' +
      '<header class="mail-head"><h2 id="subj-' + e.id + '">' + esc(e.subject) + '</h2>' +
      '<dl class="mail-meta"><dt>De</dt><dd><b>' + esc(e.from.name) + '</b> ' +
        (showFrom ? '<span class="addr">&lt;' + esc(e.from.addr) + '&gt;</span>'
                  : '<button type="button" class="reveal" data-reveal="from">Ver endereço completo</button>') + '</dd>' +
      '<dt>Para</dt><dd>voce@uln.edu.br</dd><dt>Data</dt><dd>' + esc(e.date) + '</dd></dl></header>' +
      '<div class="mail-body">' + e.body.map(function (p) { return '<p>' + esc(p) + '</p>'; }).join("") + link +
        (e.attach ? '<p class="attach"><span class="file" aria-hidden="true">PDF</span><span>' + esc(e.attach.name) + ' · ' + esc(e.attach.size) + '</span></p>' : "") +
        '<p class="sign">' + esc(e.sign) + '</p></div>' +
      (e.link && !showLink ? '<p class="mail-tip">Neste simulador os links não abrem. Clique no link para ver o destino real, como você faria passando o mouse por cima (ou tocando e segurando, no celular).</p>' : "") +
      '</article>';
  }

  function analysisForm(e) {
    var a = S().answers[e.id], err = App.ui.error;
    var sigs = D.SIGNALS.map(function (s) {
      var checked = a && a.signals.indexOf(s.id) >= 0;
      return '<label class="opt"><input type="checkbox" name="sig" value="' + s.id + '"' + (checked ? " checked" : "") + (a ? " disabled" : "") + '><span>' + s.label + '</span></label>';
    }).join("") +
      '<label class="opt opt--none"><input type="checkbox" name="none" value="1"' + (a && a.none ? " checked" : "") + (a ? " disabled" : "") + '><span>Não encontrei nenhum desses sinais</span></label>';
    var acts = D.ACTIONS.map(function (x) {
      return '<label class="opt"><input type="radio" name="act" value="' + x.id + '"' + (a && a.action === x.id ? " checked" : "") + (a ? " disabled" : "") + '><span>' + x.label + '</span></label>';
    }).join("");
    return '<form class="activity" id="f-mail" novalidate>' +
      (a ? "" : UI.cta([
        "Inspecione o e-mail: clique em <b>Ver endereço completo</b> e no link para ver o destino real.",
        "No item 1, marque todos os sinais de risco que encontrou, ou <b>Não encontrei nenhum desses sinais</b>.",
        "No item 2, escolha o que você faria e clique em <b>Registrar análise</b>."
      ])) +
      '<fieldset><legend>1. Quais sinais de risco você encontrou?</legend>' + sigs + '</fieldset>' +
      '<fieldset><legend>2. O que você faz com este e-mail?</legend>' + acts + '</fieldset>' +
      (err ? '<p class="err" role="alert">' + err + '</p>' : "") +
      (a ? result(e, a) : '<div class="row"><button type="submit" class="btn">Registrar análise</button></div>') +
      '</form>';
  }

  function result(e, a) {
    var act = e.actions[a.action], r = signalResult(e, a), i = D.EMAILS.indexOf(e);
    function item(sym, cls, text, note) {
      return '<li class="' + cls + '"><span class="sym" aria-hidden="true">' + sym + '</span><span><b>' + text + '</b>' + (note ? " " + esc(note) : "") + '</span></li>';
    }
    var lines = r.hits.map(function (s) { return item("✓", "is-hit", "Você identificou: " + label(D.SIGNALS, s) + ".", e.notes[s]); })
      .concat(r.missed.map(function (s) { return item("○", "is-miss", "Não marcado: " + label(D.SIGNALS, s) + ".", e.notes[s]); }))
      .concat(r.wrong.map(function (s) { return item("✕", "is-wrong", "Marcado, mas não está presente: " + label(D.SIGNALS, s) + ".", e.notes[s] || "Este sinal não aparece neste e-mail."); }));
    var sigSummary = !e.signals.length && !r.wrong.length
      ? '<p>Você não apontou sinais de risco, e de fato não há. ' + esc(e.notes.dom) + '</p>'
      : '<ul class="sig-list">' + lines.join("") + '</ul>';
    var sigKind = !r.missed.length && !r.wrong.length ? "ok" : (r.hits.length || (!e.signals.length && !r.wrong.length) ? "part" : "bad");
    var tries = a.tries > 1 ? '<p class="muted small">Tentativa ' + a.tries + ' neste e-mail.</p>' : "";
    var next = i < D.EMAILS.length - 1
      ? '<button type="button" class="btn" data-mail="' + (i + 1) + '">Próximo e-mail →</button>'
      : '<button type="button" class="btn" data-go="fim">Ver síntese →</button>';
    return UI.feedback(act[0], GRADE_TEXT[act[0]] + ' <span class="tag-kind">Este e-mail é: ' + KIND_TEXT[e.kind] + '</span>', '<p>' + esc(act[1]) + '</p>' + tries, "fb-mail") +
      UI.feedback(sigKind, "Sinais de risco <span class=\"score\">(" + r.hits.length + " de " + e.signals.length + " identificados" + (r.wrong.length ? ", " + r.wrong.length + " a mais" : "") + ")</span>", sigSummary) +
      '<div class="lesson"><p class="eyebrow">Para levar</p><p>' + esc(e.lesson) + '</p></div>' +
      '<div class="row"><button type="button" class="btn quiet" data-act="retry">Refazer este e-mail</button>' + next + '</div>';
  }

  function inbox() {
    var i = Math.min(S().mailIndex, D.EMAILS.length - 1), e = D.EMAILS[i];
    return '<div class="inbox">' + list(i) + '<div class="inbox-main">' + mail(e) + analysisForm(e) + '</div></div>';
  }

  /* ---------- Interações ---------- */
  function submit(form) {
    var e = D.EMAILS[S().mailIndex];
    var sigs = Array.prototype.map.call(form.querySelectorAll('input[name="sig"]:checked'), function (x) { return x.value; });
    var none = !!form.querySelector('input[name="none"]:checked');
    var act = form.querySelector('input[name="act"]:checked');
    if (!sigs.length && !none) { App.ui.error = "Marque os sinais que encontrou ou a opção “Não encontrei nenhum desses sinais”."; return null; }
    if (sigs.length && none) { App.ui.error = "Você marcou sinais e também “Não encontrei nenhum”. Desmarque um dos dois."; return null; }
    if (!act) { App.ui.error = "Escolha o que você faria com este e-mail."; return null; }
    App.ui.error = null;
    S().answers[e.id] = { signals: sigs, none: none, action: act.value, tries: (S().tries[e.id] || 0) + 1 };
    S().tries[e.id] = S().answers[e.id].tries;
    return "fb-mail";
  }

  function reveal(what) {
    var id = D.EMAILS[S().mailIndex].id;
    S().inspected[id] = S().inspected[id] || {};
    S().inspected[id][what] = true;
  }

  App.Inbox = {
    totals: totals,
    grade: grade,
    inbox: inbox,
    submit: submit,
    reveal: reveal,
    KIND_TEXT: KIND_TEXT,
    GRADE_TEXT: GRADE_TEXT,
    label: label
  };
})(window.App = window.App || {});
