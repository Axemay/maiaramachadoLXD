/* Objetos de aprendizagem interativos: renderização e tratamento das respostas.
   - Abertura do caso (resposta registrada, sem certo ou errado)
   - Checagens das unidades (escolha única ou classificação)
   - Simulador "Cabe Design Thinking?" (abordagem + dado que sustenta)
   - Flashcards situacionais (autoavaliação) */
(function (DT) {
  "use strict";

  var D = DT.data, UI = DT.UI, A = DT.Assessment, esc = UI.esc;
  var LETTERS = "ABCD";

  function radio(name, value, label, checked, disabled) {
    return '<label class="opt"><input type="radio" name="' + name + '" value="' + value + '"' +
      (checked ? " checked" : "") + (disabled ? " disabled" : "") + '><span>' + label + '</span></label>';
  }
  function findBy(list, key, value) { return list.filter(function (x) { return x[key] === value; })[0]; }

  /* ---------- Abertura do caso ---------- */
  function opening() {
    var chosen = DT.state.opening;
    var options = D.OPENING.map(function (o) { return radio("opening", o.id, esc(o.text), chosen === o.id, !!chosen); }).join("");
    return '<form class="activity" id="f-opening" novalidate>' +
      (chosen ? "" : UI.cta(["Escolha a opção que mais se parece com o que você faria e clique em <b>Registrar resposta</b>."])) +
      '<fieldset><legend>Antes de aprovar a proposta, o que você faria primeiro?</legend>' + options + '</fieldset>' +
      (DT.ui.errors.opening ? '<p class="err" role="alert">Escolha uma das opções para registrar sua resposta.</p>' : "") +
      (chosen
        ? UI.feedback("info", "Resposta registrada", "<p>Não há resposta certa neste momento. Guarde sua escolha: voltamos a ela na síntese do módulo.</p>", "fb-opening") +
          '<div class="row"><button type="button" class="btn quiet" data-act="reopen">Mudar minha resposta</button></div>'
        : '<div class="row"><button type="submit" class="btn">Registrar resposta</button></div>') +
      '</form>';
  }

  /* ---------- Checagens das unidades ---------- */
  function itemFeedback(check, item, given) {
    var ok = given === item.ans;
    var name = findBy(check.cats.map(function (c) { return { id: c[0], name: c[1] }; }), "id", item.ans).name;
    return '<p class="item-fb"><b class="' + (ok ? "is-ok" : "is-bad") + '"><span aria-hidden="true">' + (ok ? "✓ " : "✕ ") + '</span>' +
      (ok ? "Adequado." : "Não é essa. A categoria é " + name + ".") + '</b> ' + esc(item.fb) + '</p>';
  }

  function check(id) {
    var c = D.CHECKS[id], r = DT.state.checks[id], html = "";

    if (!r) {
      html += c.type === "single"
        ? UI.cta(["Marque a opção que você considera adequada e clique em <b>Verificar</b>."])
        : UI.cta(["Para cada informação, clique em uma das categorias abaixo dela.", "Quando todos os itens estiverem classificados, clique em <b>Verificar</b>."]);
    }

    if (c.type === "single") {
      html += '<fieldset><legend>' + esc(c.prompt) + '</legend>' + c.options.map(function (o) {
        return radio(id, o.id, esc(o.text), r && r.ans === o.id, !!r);
      }).join("") + '</fieldset>';
    } else {
      html += '<p><b>' + esc(c.prompt) + '</b></p>' + c.items.map(function (it, n) {
        var given = r ? r.ans[it.id] : null;
        return '<fieldset class="cls-item"><legend class="sr">Item ' + (n + 1) + '</legend><p>' + esc(it.text) + '</p><div class="chips">' +
          c.cats.map(function (cat) {
            return '<label class="chip"><input type="radio" name="' + id + '-' + it.id + '" value="' + cat[0] + '"' +
              (given === cat[0] ? " checked" : "") + (r ? " disabled" : "") + '><span>' + cat[1] + '</span></label>';
          }).join("") + '</div>' + (r ? itemFeedback(c, it, given) : "") + '</fieldset>';
      }).join("");
    }

    if (DT.ui.errors[id]) html += '<p class="err" role="alert">' + DT.ui.errors[id] + '</p>';

    if (!r) {
      html += '<div class="row"><button type="submit" class="btn">Verificar</button></div>';
    } else if (c.type === "single") {
      var chosen = findBy(c.options, "id", r.ans);
      html += UI.feedback(chosen.ok ? "ok" : "bad", chosen.ok ? "Formulação adequada" : "Ainda não é essa",
        '<p>' + esc(chosen.fb) + '</p>' + (chosen.ok ? "" : '<p><b>Para revisar:</b> ' + esc(c.tip) + '</p>'), "fb-" + id);
      if (!chosen.ok && DT.ui.revealed[id]) {
        var right = findBy(c.options, "ok", true);
        html += UI.feedback("info", "Resposta comentada", '<p><b>' + esc(right.text) + '</b></p><p>' + esc(right.fb) + '</p>');
      }
      html += '<div class="row"><button type="button" class="btn quiet" data-act="retry" data-id="' + id + '">Refazer</button>' +
        (!chosen.ok && !DT.ui.revealed[id] ? '<button type="button" class="btn ghost" data-act="reveal" data-id="' + id + '">Ver resposta comentada</button>' : "") + '</div>';
    } else {
      var kind = r.score === r.total ? "ok" : (r.score === 0 ? "bad" : "part");
      var verdict = r.score === r.total ? "Todas as classificações adequadas" : (r.score === 0 ? "Nenhuma classificação adequada" : "Classificação parcial");
      html += UI.feedback(kind, verdict + ' <span class="score">(' + r.score + ' de ' + r.total + ')</span>',
        r.score === r.total
          ? '<p>Leia as explicações em cada item: elas reforçam o critério que diferencia as categorias.</p>'
          : '<p><b>Para revisar:</b> ' + esc(c.tip) + ' A explicação de cada item está logo abaixo dele.</p>', "fb-" + id);
      html += '<div class="row"><button type="button" class="btn quiet" data-act="retry" data-id="' + id + '">Refazer</button></div>';
    }

    return '<form class="activity" id="f-' + id + '" data-check="' + id + '" novalidate>' + html + '</form>';
  }

  /* ---------- Simulador ---------- */
  function scenarioTabs(current) {
    return D.SCENARIOS.map(function (s, k) {
      var pts = A.scenarioPoints(s);
      var cls = pts === null ? "" : (pts === 2 ? "s-ok" : (pts === 1 ? "s-part" : "s-bad"));
      var stateTxt = pts === null ? "não respondido" : (pts === 2 ? "adequado" : (pts === 1 ? "parcial" : "inadequado"));
      return '<button type="button" data-scen="' + k + '" class="' + cls + '"' + (k === current ? ' aria-current="true"' : "") +
        ' aria-label="Cenário ' + (k + 1) + ', ' + stateTxt + '">' + (k + 1) + '</button>';
    }).join("");
  }

  function scenarioFeedback(s, r, i) {
    var aOk = r.a === s.correct, eOk = A.evidenceIsStrong(s, r.e);
    var chosenEv = findBy(s.ev, "id", r.e), bestEv = findBy(s.ev, "ok", true);
    var apName = function (id) { return findBy(D.APPROACHES.map(function (a) { return { id: a[0], name: a[1] }; }), "id", id).name; };
    var kind = aOk && eOk ? "ok" : (aOk || eOk ? "part" : "bad");
    var verdict = aOk && eOk ? "Decisão adequada e bem fundamentada"
      : (aOk ? "Decisão adequada, fundamentação frágil"
      : (eOk ? "Você identificou o dado certo, mas chegou a outra conclusão" : "Decisão inadequada para este cenário"));
    var tries = DT.state.simTries[s.id] || 1;
    var body = '<p><b>Sua escolha: ' + esc(apName(r.a)) + '.</b> ' + esc(s.afb[r.a]) + '</p>' +
      (aOk ? "" : '<p><b>Abordagem mais adequada: ' + esc(apName(s.correct)) + '.</b> ' + esc(s.afb[s.correct]) + '</p>') +
      '<p><b>Sobre o dado que você escolheu:</b> ' + esc(chosenEv.fb) + '</p>' +
      (eOk ? "" : '<p><b>Dado mais forte:</b> ' + esc(bestEv.text) + '</p>') +
      (tries > 1 ? '<p class="muted small">Tentativa ' + tries + ' neste cenário.</p>' : "");
    var next = i < D.SCENARIOS.length - 1
      ? '<button type="button" class="btn" data-scen="' + (i + 1) + '">Próximo cenário →</button>'
      : '<button type="button" class="btn" data-go="cards">Ir para os flashcards →</button>';
    return UI.feedback(kind, verdict + ' <span class="score">(' + ((aOk ? 1 : 0) + (eOk ? 1 : 0)) + ' de 2)</span>', body, "fb-sim") +
      '<div class="row"><button type="button" class="btn quiet" data-act="simretry">Refazer este cenário</button>' + next + '</div>';
  }

  function simulatorHeader() {
    var t = A.totals();
    return UI.cta([
        "Leia o cenário.",
        "No item 1, marque a abordagem que você recomenda.",
        "No item 2, marque o dado do cenário que mais sustenta sua decisão.",
        "Clique em <b>Confirmar decisão</b> e leia o feedback.",
        "Use os botões numerados para ir a qualquer cenário. Você pode refazer quantas vezes quiser."
      ]) +
      '<div class="row row--between"><div class="scen-tabs" role="group" aria-label="Cenários">' + scenarioTabs(Math.min(DT.state.simIndex, D.SCENARIOS.length - 1)) + '</div>' +
      '<p class="score muted">' + t.simDone + '/6 cenários · ' + t.simPts + '/12 pontos</p></div>' +
      '<p class="legend" aria-hidden="true"><span><i style="border-color:var(--line);background:var(--card)"></i>Não respondido</span>' +
      '<span><i style="border-color:var(--ok);background:var(--ok-soft)"></i>Adequado</span>' +
      '<span><i style="border-color:var(--part);background:var(--part-soft)"></i>Parcial</span>' +
      '<span><i style="border-color:var(--bad);background:var(--bad-soft)"></i>Inadequado</span></p>';
  }

  function simulator() {
    var i = Math.min(DT.state.simIndex, D.SCENARIOS.length - 1), s = D.SCENARIOS[i], r = DT.state.sim[s.id];
    var approaches = D.APPROACHES.map(function (a) { return radio("ap", a[0], a[1], r && r.a === a[0], !!r); }).join("");
    var evidence = s.ev.map(function (e) { return radio("ev", e.id, esc(e.text), r && r.e === e.id, !!r); }).join("");
    return '<form class="activity" id="f-sim" novalidate>' +
      '<div class="row"><span class="tag">' + esc(s.tag) + '</span><span class="eyebrow">Cenário ' + (i + 1) + ' de 6</span></div>' +
      '<h2>' + esc(s.title) + '</h2><p>' + esc(s.text) + '</p>' +
      '<fieldset><legend>1. Qual abordagem você recomenda?</legend>' + approaches + '</fieldset>' +
      '<fieldset><legend>2. Qual dado do cenário mais sustenta sua decisão?</legend>' + evidence + '</fieldset>' +
      (DT.ui.errors.sim ? '<p class="err" role="alert">' + DT.ui.errors.sim + '</p>' : "") +
      (r ? scenarioFeedback(s, r, i)
         : '<p class="muted small">Responda os itens 1 e 2 antes de confirmar.</p><div class="row"><button type="submit" class="btn">Confirmar decisão</button></div>') +
      '</form>';
  }

  /* ---------- Flashcards ---------- */
  function cardList() {
    return DT.state.cardFilter ? D.CARDS.filter(function (c) { return DT.state.cards[c.id] !== "ok"; }) : D.CARDS;
  }

  function flashcards() {
    var list = cardList(), t = A.totals();
    if (!list.length) {
      return UI.feedback("ok", "Nenhuma carta para revisar", "<p>Você marcou todas as cartas como “acertei”. Pode voltar ao baralho completo se quiser revisar.</p>") +
        '<div class="row"><button type="button" class="btn quiet" data-act="cardfilter">Ver todas as cartas</button></div>';
    }
    var k = Math.min(DT.state.cardIndex, list.length - 1), c = list[k], rated = DT.state.cards[c.id];
    var face = DT.ui.flipped
      ? '<div class="card back" aria-live="polite"><p class="eyebrow">Resposta comentada</p><p>' + esc(c.a) + '</p>' +
        '<p style="font-weight:700;margin-top:auto">Como foi sua resposta?</p><div class="row" role="group" aria-label="Autoavaliação">' +
        [["ok", "Acertei"], ["part", "Acertei em parte"], ["miss", "Não acertei"]].map(function (x) {
          return '<button type="button" class="btn ' + (rated === x[0] ? "" : "quiet") + '" data-rate="' + x[0] + '" aria-pressed="' + (rated === x[0]) + '">' + x[1] + '</button>';
        }).join("") + '</div></div>'
      : '<div class="card"><p class="eyebrow">Situação</p><p class="q">' + esc(c.q) + '</p>' +
        '<p class="hint">Pense na sua resposta antes de virar a carta.</p>' +
        '<div class="row"><button type="button" class="btn" data-act="flip">Virar a carta</button></div></div>';
    return UI.cta([
        "Leia a situação e pense em como você responderia.",
        "Clique em <b>Virar a carta</b> para ver a resposta comentada.",
        "Compare com o que você pensou e escolha <b>Acertei</b>, <b>Acertei em parte</b> ou <b>Não acertei</b>. A próxima carta aparece em seguida."
      ]) +
      '<div class="row row--between"><p class="score muted">Carta ' + (k + 1) + ' de ' + list.length + (DT.state.cardFilter ? " (revisão)" : "") + ' · ' + t.cardsDone + '/6 avaliadas</p>' +
      '<button type="button" class="btn quiet" data-act="cardfilter" aria-pressed="' + DT.state.cardFilter + '">' + (DT.state.cardFilter ? "Ver todas as cartas" : "Revisar só as que não acertei") + '</button></div>' +
      face +
      '<div class="row row--between"><button type="button" class="btn quiet" data-card="' + (k - 1) + '"' + (k === 0 ? " disabled" : "") + '>← Carta anterior</button>' +
      '<button type="button" class="btn quiet" data-card="' + (k + 1) + '"' + (k >= list.length - 1 ? " disabled" : "") + '>Próxima carta →</button></div>';
  }

  /* ---------- Envio de respostas ----------
     Cada função valida, grava o estado e devolve o id do elemento que deve receber foco. */
  function submitOpening(form) {
    var v = form.querySelector('input[name="opening"]:checked');
    if (!v) { DT.ui.errors.opening = true; return null; }
    DT.ui.errors.opening = false;
    DT.state.opening = v.value;
    return "fb-opening";
  }

  function submitCheck(form) {
    var id = form.dataset.check, c = D.CHECKS[id];
    if (c.type === "single") {
      var o = form.querySelector('input[name="' + id + '"]:checked');
      if (!o) { DT.ui.errors[id] = "Escolha uma opção antes de verificar."; return null; }
      DT.state.checks[id] = { ans: o.value, score: findBy(c.options, "id", o.value).ok ? 1 : 0, total: 1 };
    } else {
      var ans = {}, missing = false, score = 0;
      c.items.forEach(function (it) {
        var x = form.querySelector('input[name="' + id + '-' + it.id + '"]:checked');
        if (!x) { missing = true; return; }
        ans[it.id] = x.value;
        if (x.value === it.ans) score++;
      });
      if (missing) { DT.ui.errors[id] = "Classifique todos os itens antes de verificar."; return null; }
      DT.state.checks[id] = { ans: ans, score: score, total: c.items.length };
    }
    DT.ui.errors[id] = null;
    return "fb-" + id;
  }

  function submitSimulator(form) {
    var s = D.SCENARIOS[DT.state.simIndex];
    var a = form.querySelector('input[name="ap"]:checked'), e = form.querySelector('input[name="ev"]:checked');
    if (!a || !e) {
      DT.ui.errors.sim = !a && !e ? "Escolha a abordagem e o dado que a sustenta."
        : (!a ? "Escolha a abordagem que você recomenda." : "Escolha o dado que sustenta sua decisão.");
      return null;
    }
    DT.ui.errors.sim = null;
    DT.state.sim[s.id] = { a: a.value, e: e.value };
    DT.state.simTries[s.id] = (DT.state.simTries[s.id] || 0) + 1;
    return "fb-sim";
  }

  function rateCard(value) {
    var list = cardList(), c = list[Math.min(DT.state.cardIndex, list.length - 1)];
    DT.state.cards[c.id] = value;
    DT.ui.flipped = false;
    if (!DT.state.cardFilter) {
      if (DT.state.cardIndex < D.CARDS.length - 1) DT.state.cardIndex++;
      else DT.ui.flipped = true; /* última carta: mantém a resposta visível */
    } else {
      var remaining = cardList();
      if (DT.state.cardIndex >= remaining.length) DT.state.cardIndex = Math.max(0, remaining.length - 1);
    }
  }

  DT.Activities = {
    LETTERS: LETTERS,
    opening: opening,
    check: check,
    simulatorHeader: simulatorHeader,
    simulator: simulator,
    flashcards: flashcards,
    submitOpening: submitOpening,
    submitCheck: submitCheck,
    submitSimulator: submitSimulator,
    rateCard: rateCard
  };
})(window.DT = window.DT || {});
