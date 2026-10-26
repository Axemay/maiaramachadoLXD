/* Telas do simulador, montadas como faixas de conteúdo. */
(function (App) {
  "use strict";

  var D = App.data, UI = App.UI, band = UI.band, esc = UI.esc;

  function environment() {
    return '<dl class="env">' + D.ENVIRONMENT.map(function (r) {
      return '<div><dt>' + r[0] + '</dt><dd>' + r[1] + '</dd></div>';
    }).join("") + '</dl>';
  }

  var Screens = {};

  Screens.inicio = function () {
    var started = Object.keys(App.store.state.answers).length > 0;
    return band("intro",
        UI.head("Objeto de aprendizagem · cerca de 12 minutos", "Esse e-mail é confiável?",
          "Um simulador de triagem: você inspeciona cinco e-mails reais do dia a dia de uma universidade, aponta os sinais de risco e decide o que fazer com cada um.") +
        (App.store.available ? "" : '<p class="warn-store">Este navegador não permite salvar o progresso. As respostas se perdem ao fechar a página.</p>') +
        '<div class="row"><button type="button" class="btn" data-go="' + (started ? "caixa" : "sinais") + '">' + (started ? "Voltar à caixa de entrada" : "Começar") + '</button></div>') +
      band("soft",
        '<h2>Ao final, você será capaz de</h2><ul class="plain">' +
        '<li>inspecionar remetente, link e anexo antes de interagir com um e-mail;</li>' +
        '<li>identificar sinais de risco e distinguir um sinal isolado de um padrão de golpe;</li>' +
        '<li><b>decidir</b> a ação adequada para cada mensagem, inclusive reconhecer as legítimas.</li></ul>') +
      band("case",
        '<p>Você trabalha na <b>Universidade do Litoral Norte (ULN)</b>, uma instituição fictícia. Guarde estas referências: é com elas que você vai comparar cada mensagem.</p>' + environment(),
        "Seu contexto");
  };

  Screens.sinais = function () {
    var cards = [
      ["Remetente", "O nome exibido pode ser qualquer um. Confira o endereço completo e, nele, o domínio depois do @.", "Suporte TI &lt;suporte@<mark>uln-edu.com</mark>&gt;"],
      ["Link", "O texto do link e o destino real podem ser diferentes. Passe o mouse (ou toque e segure) antes de clicar.", "Texto: webmail.uln.edu.br<br>Destino: <mark>uln-edu-validacao.top</mark>"],
      ["Tom", "Pressa, ameaça e pedido de sigilo existem para você agir antes de pensar ou de confirmar.", "“nas próximas 24 horas” · “não comente com a equipe”"],
      ["Pedido", "Senha, dados pessoais e pagamentos fora do fluxo normal são o objetivo da maioria dos golpes.", "“valide sua conta” · “pague o boleto em anexo”"],
      ["Contexto", "Você esperava essa mensagem? O serviço é o que a instituição usa? Um nome conhecido não basta.", "arquivos.uln.edu.br × <mark>docs-compartilhados.net</mark>"]
    ];
    return band("intro",
        UI.head("Aprender · cerca de 3 minutos", "Onde olhar",
          "Antes de clicar, cinco pontos de um e-mail dizem muito sobre ele.")) +
      band("content", '<div class="sig-cards">' + cards.map(function (c, i) {
        return '<div class="sig-card"><p class="eyebrow">' + (i + 1) + ' de 5</p><h3>' + c[0] + '</h3><p>' + c[1] + '</p><p class="ex">' + c[2] + '</p></div>';
      }).join("") + '</div>') +
      band("case",
        '<h3>Nenhum sinal sozinho decide</h3><p>Um aviso legítimo pode ter prazo curto. Um golpe bem-feito pode vir de um nome conhecido. O que decide é o conjunto: quem enviou, para onde o link leva e o que está sendo pedido.</p>' +
        '<p class="quote">Na dúvida, confirme por um canal que <b>você</b> escolhe: o ramal do catálogo, o chat interno, o endereço digitado no navegador. Nunca pelos contatos do próprio e-mail.</p>',
        "Antes de praticar") +
      band("activity", '<p>Agora é com você: cinco mensagens chegaram na sua caixa de entrada.</p><div class="row"><button type="button" class="btn" data-go="caixa">Abrir a caixa de entrada →</button></div>');
  };

  Screens.caixa = function () {
    var t = App.Inbox.totals();
    return band("intro",
        UI.head("Praticar · cerca de 8 minutos", "Caixa de entrada",
          "Cinco e-mails chegaram hoje. Alguns são golpes, outros são legítimos. Analise um de cada vez.") +
        '<p class="score muted">' + t.answered + ' de 5 analisados · ' + t.ok + ' ações adequadas</p>') +
      band("case", environment(), "Referências da ULN") +
      band("activity", App.Inbox.inbox());
  };

  Screens.fim = function () {
    var t = App.Inbox.totals(), S = App.store.state;
    function statusRow(ok, title, desc) {
      return '<div class="status"><span class="st ' + (ok ? "done" : "") + '" aria-hidden="true">' + (ok ? "✓" : "") + '</span>' +
        '<div><h3>' + title + ' <span class="sr">' + (ok ? "(atingido)" : "(ainda não atingido)") + '</span></h3><p>' + desc + '</p></div></div>';
    }
    var rows = D.EMAILS.map(function (e) {
      var a = S.answers[e.id], g = App.Inbox.grade(e);
      return '<tr><td>' + esc(e.subject) + '</td><td>' + App.Inbox.KIND_TEXT[e.kind] + '</td><td>' +
        (a ? esc(App.Inbox.label(D.ACTIONS, a.action)) : '<span class="muted">Não analisado</span>') + '</td><td>' +
        (g ? '<span class="mail-status s-' + g + '">' + { ok: "✓ Adequada", part: "◐ Com ressalvas", bad: "✕ Arriscada" }[g] + '</span>' : "") + '</td></tr>';
    }).join("");
    return band("intro",
        UI.head("Fechamento", "Síntese") +
        '<div class="metrics"><div class="metric"><b>' + t.ok + '/5</b><span>ações adequadas</span></div>' +
        '<div class="metric"><b>' + t.hits + '/' + t.expected + '</b><span>sinais de risco identificados</span></div>' +
        '<div class="metric"><b>' + t.inspected + '/5</b><span>e-mails em que você inspecionou remetente ou link</span></div></div>') +
      band("soft",
        '<h2>Seus status</h2><div class="status-list">' +
        statusRow(t.answered === 5, "Conclusão", "Você analisou os cinco e-mails.") +
        statusRow(t.demonstrated, "Desempenho demonstrado", "Pelo menos 4 ações adequadas e nenhuma ação arriscada diante de um golpe. Abrir o link de um golpe pesa mais do que desconfiar de um e-mail legítimo.") +
        '</div>' +
        (t.wrong ? '<p class="small muted">Você marcou ' + t.wrong + ' sinal(is) que não estavam presentes. Excesso de desconfiança também tem custo: avisos legítimos acabam ignorados.</p>' : "")) +
      band("content", '<div class="table-wrap"><table><thead><tr><th>E-mail</th><th>Era</th><th>Sua ação</th><th>Avaliação</th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
        '<div class="row"><button type="button" class="btn quiet" data-go="caixa">Voltar à caixa de entrada</button></div>') +
      band("case", '<p class="quote">Antes de clicar: quem enviou, para onde leva e o que pede. Na dúvida, confirme por um canal que você escolhe.</p>', "Para levar") +
      band("content",
        '<h3>Recomeçar</h3>' +
        (App.ui.confirmReset
          ? '<div class="confirm" role="alertdialog" aria-labelledby="cfT"><p id="cfT"><b>Apagar todas as análises?</b> Essa ação não pode ser desfeita.</p><div class="row"><button type="button" class="btn danger" data-act="resetyes">Sim, apagar e recomeçar</button><button type="button" class="btn quiet" data-act="resetno">Cancelar</button></div></div>'
          : '<p>Apaga as análises salvas neste navegador.</p><div class="row"><button type="button" class="btn quiet" data-act="reset">Recomeçar o simulador</button></div>'));
  };

  Screens.ficha = function () {
    var rows = [
      ["Público", "Servidores, docentes e colaboradores de instituições de ensino e pesquisa; não exige conhecimento técnico"],
      ["Duração", "Cerca de 12 minutos"],
      ["Objetivo principal", "Decidir a ação adequada diante de um e-mail suspeito, com base em evidências inspecionadas no próprio e-mail (Bloom revisado: Avaliar)"],
      ["Estratégia", "Microconteúdo curto (onde olhar) seguido de simulação com cinco mensagens. Três golpes de tipos diferentes (captura de senha, falso dirigente, falso compartilhamento) e duas mensagens legítimas, uma delas com urgência, para evitar o viés de que tudo é golpe"],
      ["Interação", "O participante inspeciona remetente e link antes de decidir, aponta os sinais que encontrou e escolhe uma ação. A inspeção é registrada como evidência de comportamento"],
      ["Avaliação", "Automática e explicada: cada ação recebe feedback específico para aquele e-mail, e cada sinal é comentado (identificado, não marcado ou marcado sem estar presente). Desempenho: 4 ações adequadas e nenhuma ação arriscada diante de golpe"],
      ["Acessibilidade", "WCAG 2.2 AA como referência: controles nativos operáveis por teclado, inspeção por botões em vez de passar o mouse, feedback com texto e símbolo além da cor. Ainda não auditado com leitores de tela"],
      ["Tecnologia", "HTML, CSS e JavaScript sem bibliotecas, com dados dos cenários separados da lógica. Os links do simulador nunca abrem"],
      ["Limitações", "Instituição, pessoas e domínios são fictícios. O progresso fica salvo só no navegador"],
      ["Autoria", "Maiara Machado · concepção, design instrucional e roteiro"]
    ];
    return band("intro", UI.head("Sobre esta peça", "Ficha técnica", "Objeto de aprendizagem avulso, com escopo reduzido e funcionamento completo.")) +
      band("content", '<div class="table-wrap"><table><tbody>' + rows.map(function (r) { return '<tr><th>' + r[0] + '</th><td>' + r[1] + '</td></tr>'; }).join("") + '</tbody></table></div>');
  };

  App.Screens = Screens;
})(window.App = window.App || {});
