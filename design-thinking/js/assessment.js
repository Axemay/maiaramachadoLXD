/* Regras de avaliação: progresso, pontuação e os três status do módulo.
   Só há verificação automática onde existe regra objetiva (checagens e simulador). */
(function (DT) {
  "use strict";

  var D = DT.data;
  var DEMONSTRATED_MIN = 9; /* pontos no simulador, de 12 */

  function evidenceIsStrong(scenario, evidenceId) {
    var e = scenario.ev.filter(function (x) { return x.id === evidenceId; })[0];
    return !!(e && e.ok);
  }

  function scenarioPoints(scenario) {
    var r = DT.state.sim[scenario.id];
    if (!r) return null;
    return (r.a === scenario.correct ? 1 : 0) + (evidenceIsStrong(scenario, r.e) ? 1 : 0);
  }

  function totals() {
    var S = DT.state;
    var checkIds = Object.keys(D.CHECKS);
    var checksDone = checkIds.filter(function (k) { return S.checks[k]; }).length;
    var simDone = D.SCENARIOS.filter(function (s) { return S.sim[s.id]; }).length;
    var cardsDone = D.CARDS.filter(function (c) { return S.cards[c.id]; }).length;
    var simPts = D.SCENARIOS.reduce(function (sum, s) { return sum + (scenarioPoints(s) || 0); }, 0);
    var done = (S.opening ? 1 : 0) + checksDone + simDone + cardsDone;
    var total = 1 + checkIds.length + D.SCENARIOS.length + D.CARDS.length;
    return {
      done: done, total: total, pct: Math.round(done / total * 100),
      checksDone: checksDone, simDone: simDone, cardsDone: cardsDone, simPts: simPts
    };
  }

  function screenDone(id) {
    var S = DT.state;
    if (id === "caso") return !!S.opening;
    if (D.CHECKS[id]) return !!S.checks[id];
    if (id === "sim") return D.SCENARIOS.every(function (s) { return S.sim[s.id]; });
    if (id === "cards") return D.CARDS.every(function (c) { return S.cards[c.id]; });
    if (id === "fim") { var t = totals(); return t.done === t.total; }
    return false;
  }

  function statuses() {
    var t = totals();
    return {
      participation: D.CONTENT_SCREENS.every(function (id) { return DT.state.visited[id]; }),
      completion: t.done === t.total,
      demonstrated: t.simDone === D.SCENARIOS.length && t.simPts >= DEMONSTRATED_MIN
    };
  }

  function cardStats() {
    var stats = { ok: 0, part: 0, miss: 0 };
    D.CARDS.forEach(function (c) { var r = DT.state.cards[c.id]; if (r) stats[r]++; });
    return stats;
  }

  /* Registro exportável (JSON) para guardar ou enviar a um tutor. */
  function exportRecord() {
    var S = DT.state, t = totals(), st = statuses();
    var opening = D.OPENING.filter(function (o) { return o.id === S.opening; })[0];
    return {
      curso: "Design Thinking",
      modulo: 1,
      exportadoEm: new Date().toISOString(),
      progresso: t.pct + "%",
      respostaInicial: opening ? opening.text : null,
      checagens: Object.keys(D.CHECKS).map(function (k) {
        var r = S.checks[k];
        return { unidade: k, pontos: r ? r.score : null, total: r ? r.total : null };
      }),
      simulador: D.SCENARIOS.map(function (s) {
        var r = S.sim[s.id];
        return {
          cenario: s.title,
          abordagem: r ? r.a : null,
          abordagemAdequada: s.correct,
          dado: r ? r.e : null,
          dadoAdequado: r ? evidenceIsStrong(s, r.e) : null,
          tentativas: S.simTries[s.id] || 0
        };
      }),
      pontosSimulador: t.simPts + "/12",
      flashcardsAutoavaliacao: cardStats(),
      status: {
        participacao: st.participation,
        conclusao: st.completion,
        desempenhoDemonstrado: st.demonstrated
      }
    };
  }

  DT.Assessment = {
    DEMONSTRATED_MIN: DEMONSTRATED_MIN,
    evidenceIsStrong: evidenceIsStrong,
    scenarioPoints: scenarioPoints,
    totals: totals,
    screenDone: screenDone,
    statuses: statuses,
    cardStats: cardStats,
    exportRecord: exportRecord
  };
})(window.DT = window.DT || {});
