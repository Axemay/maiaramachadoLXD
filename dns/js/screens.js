/* Telas do explicativo, montadas como faixas de conteúdo. */
(function (App) {
  "use strict";

  var UI = App.UI, band = UI.band, Act = App.Act;
  var Screens = {};

  Screens.inicio = function () {
    var started = App.Act.totals().seen > 0;
    return band("intro",
        UI.head("Objeto explicativo · cerca de 10 minutos", "O que acontece quando você digita um endereço",
          "Entre apertar Enter e ver a página, seu computador conversa com até seis servidores diferentes. Em sete passos, você acompanha essa conversa e aprende a usar o caminho para entender onde um problema está.") +
        (App.store.available ? "" : '<p class="warn-store">Este navegador não permite salvar o progresso. As respostas se perdem ao fechar a página.</p>') +
        '<div class="row"><button type="button" class="btn" data-go="jornada">' + (started ? "Continuar a jornada" : "Começar") + '</button></div>') +
      band("soft",
        '<h2>Ao final, você será capaz de</h2><ul class="plain">' +
        '<li>descrever, em ordem, as etapas entre digitar um endereço e receber a página;</li>' +
        '<li>explicar o papel do DNS, da conexão segura e da resposta do servidor;</li>' +
        '<li><b>diagnosticar</b> em que etapa está um problema comum de acesso a partir do sintoma.</li></ul>') +
      band("case",
        '<p>O endereço da jornada é <b>www.uln.edu.br</b>, da Universidade do Litoral Norte, uma instituição fictícia. Os servidores e o IP usados são exemplos.</p>',
        "Contexto");
  };

  Screens.jornada = function () {
    return band("intro",
        UI.head("Explorar · cerca de 5 minutos", "A jornada de um endereço") +
        UI.cta(["Clique em <b>Próximo passo</b> para avançar. O diagrama destaca quem participa de cada etapa e as setas mostram o que é perguntado e respondido.", "Os números no topo levam a qualquer passo."])) +
      band("content", Act.journey());
  };

  Screens.ordenar = function () {
    return band("intro",
        UI.head("Praticar · cerca de 2 minutos", "Coloque em ordem",
          "As seis etapas abaixo estão embaralhadas. Reorganize do primeiro ao último acontecimento.")) +
      band("activity", Act.ordering());
  };

  Screens.diagnostico = function () {
    return band("intro",
        UI.head("Praticar · cerca de 3 minutos", "Onde está o problema?",
          "Quem entende o caminho consegue localizar a falha pelo sintoma. Para cada situação, indique a etapa em que está o problema.") +
        UI.cta(["Leia a situação, marque a etapa e clique em <b>Verificar</b>.", "Cada situação tem sua própria explicação. Você pode refazer qualquer uma."])) +
      band("activity", Act.diagnosis());
  };

  Screens.fim = function () {
    var t = Act.totals();
    function statusRow(ok, title, desc) {
      return '<div class="status"><span class="st ' + (ok ? "done" : "") + '" aria-hidden="true">' + (ok ? "✓" : "") + '</span>' +
        '<div><h3>' + title + ' <span class="sr">' + (ok ? "(atingido)" : "(ainda não atingido)") + '</span></h3><p>' + desc + '</p></div></div>';
    }
    return band("intro",
        UI.head("Fechamento", "Síntese") +
        '<div class="metrics"><div class="metric"><b>' + t.seen + '/7</b><span>passos da jornada vistos</span></div>' +
        '<div class="metric"><b>' + (t.orderHits === null ? "–" : t.orderHits + "/6") + '</b><span>etapas na posição certa</span></div>' +
        '<div class="metric"><b>' + t.right + '/4</b><span>diagnósticos certos</span></div></div>') +
      band("soft",
        '<h2>Seus status</h2><div class="status-list">' +
        statusRow(t.complete, "Conclusão", "Você viu os sete passos, verificou a ordem e respondeu as quatro situações.") +
        statusRow(t.demonstrated, "Desempenho demonstrado", "Sequência inteira na ordem certa e pelo menos 3 de 4 diagnósticos certos.") +
        '</div>') +
      band("case",
        '<ul class="plain"><li>Nome vira número antes de tudo: sem DNS, o navegador não sabe para onde ir.</li>' +
        '<li>Respostas ficam guardadas por um tempo (TTL). Por isso mudanças de servidor não chegam a todos ao mesmo tempo.</li>' +
        '<li>O cadeado confirma o domínio e a criptografia, não a honestidade do site.</li>' +
        '<li>O código da resposta (200, 404, 500) diz se o problema está no pedido, na página ou no servidor.</li></ul>',
        "Para levar") +
      band("content",
        '<h3>Recomeçar</h3>' +
        (App.ui.confirmReset
          ? '<div class="confirm" role="alertdialog" aria-labelledby="cfT"><p id="cfT"><b>Apagar todas as respostas?</b> Essa ação não pode ser desfeita.</p><div class="row"><button type="button" class="btn danger" data-act="resetyes">Sim, apagar e recomeçar</button><button type="button" class="btn quiet" data-act="resetno">Cancelar</button></div></div>'
          : '<p>Apaga as respostas salvas neste navegador.</p><div class="row"><button type="button" class="btn quiet" data-act="reset">Recomeçar</button></div>'));
  };

  Screens.ficha = function () {
    var rows = [
      ["Público", "Iniciantes em TI e profissionais de outras áreas que lidam com sistemas web; nível introdutório"],
      ["Duração", "Cerca de 10 minutos"],
      ["Objetivo principal", "Diagnosticar em que etapa está um problema de acesso a partir do sintoma (Bloom revisado: Analisar)"],
      ["Estratégia", "Explicação visual em sete passos, com diagrama que destaca os participantes de cada etapa, seguida de ordenação das etapas e de diagnóstico de quatro situações reais de suporte"],
      ["Editoração", "Texto curto por passo, separação entre explicação, detalhe técnico e “por que isso importa”; diagrama gerado a partir dos dados, com descrição textual para leitores de tela"],
      ["Avaliação", "Automática e explicada: ordenação com indicação da posição correta de cada etapa; diagnóstico com feedback específico para cada alternativa"],
      ["Acessibilidade", "WCAG 2.2 AA como referência: ordenação por botões (alternativa ao arrastar), navegação por teclado, foco visível, diagrama com descrição dinâmica, respeito a movimento reduzido. Ainda não auditado com leitores de tela"],
      ["Precisão técnica", "Simplificações declaradas: o fluxo mostra a resolução recursiva típica; o IP 203.0.113.25 é de uma faixa reservada para documentação (RFC 5737)"],
      ["Tecnologia", "HTML, CSS e JavaScript sem bibliotecas; diagrama em SVG gerado por código a partir de data/content.js"],
      ["Autoria", "Maiara Machado · concepção, design instrucional e roteiro"]
    ];
    return band("intro", UI.head("Sobre esta peça", "Ficha técnica", "Objeto explicativo avulso, com escopo reduzido e funcionamento completo.")) +
      band("content", '<div class="table-wrap"><table><tbody>' + rows.map(function (r) { return '<tr><th>' + r[0] + '</th><td>' + r[1] + '</td></tr>'; }).join("") + '</tbody></table></div>');
  };

  App.Screens = Screens;
})(window.App = window.App || {});
