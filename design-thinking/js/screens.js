/* Telas do módulo. Cada tela é uma sequência de faixas (UI.band):
   intro (abertura da tela) · content (explicação) · case (exemplo do caso) · activity (prática) · soft (apoio) · nav. */
(function (DT) {
  "use strict";

  var D = DT.data, UI = DT.UI, A = DT.Assessment, Act = DT.Activities, esc = UI.esc, band = UI.band;

  /* ---------- Diagramas ---------- */
  var VENN =
    '<div class="diagram"><svg viewBox="0 0 480 330" role="img" aria-labelledby="vennT vennD"><title id="vennT">Três lentes da inovação</title>' +
    '<desc id="vennD">Três círculos sobrepostos: desejabilidade, ligada às pessoas; factibilidade, ligada à tecnologia; viabilidade, ligada ao negócio. A área onde os três se encontram é a da inovação.</desc>' +
    '<circle cx="240" cy="115" r="98" fill="var(--venn-1)" stroke="var(--venn-1-line)" stroke-width="2"/>' +
    '<circle cx="178" cy="215" r="98" fill="var(--venn-2)" stroke="var(--venn-2-line)" stroke-width="2"/>' +
    '<circle cx="302" cy="215" r="98" fill="var(--venn-3)" stroke="var(--venn-3-line)" stroke-width="2"/>' +
    '<text x="240" y="62" text-anchor="middle" font-weight="700" font-size="16">Desejabilidade</text><text class="sub" x="240" y="82" text-anchor="middle" font-size="13">as pessoas querem?</text>' +
    '<text x="128" y="245" text-anchor="middle" font-weight="700" font-size="16">Factibilidade</text><text class="sub" x="128" y="265" text-anchor="middle" font-size="13">é possível fazer?</text>' +
    '<text x="352" y="245" text-anchor="middle" font-weight="700" font-size="16">Viabilidade</text><text class="sub" x="352" y="265" text-anchor="middle" font-size="13">se sustenta?</text>' +
    '<text x="240" y="185" text-anchor="middle" font-weight="700" font-size="14">inovação</text></svg></div>';

  var DOUBLE_DIAMOND =
    '<div class="diagram"><svg viewBox="0 0 640 230" role="img" aria-labelledby="ddT ddD"><title id="ddT">Duplo Diamante</title>' +
    '<desc id="ddD">Dois losangos lado a lado. O primeiro cobre o espaço do problema: descobrir, que abre, e definir, que fecha. O segundo cobre o espaço da solução: desenvolver, que abre, e entregar, que fecha.</desc>' +
    '<polygon points="20,110 165,20 310,110 165,200" fill="var(--venn-1)" stroke="var(--venn-1-line)" stroke-width="2"/>' +
    '<polygon points="330,110 475,20 620,110 475,200" fill="var(--venn-2)" stroke="var(--venn-2-line)" stroke-width="2"/>' +
    '<line x1="165" y1="20" x2="165" y2="200" stroke="var(--line)" stroke-dasharray="4 4"/><line x1="475" y1="20" x2="475" y2="200" stroke="var(--line)" stroke-dasharray="4 4"/>' +
    '<text x="95" y="106" text-anchor="middle" font-weight="700" font-size="15">Descobrir</text><text class="sub" x="95" y="126" text-anchor="middle" font-size="12">divergir</text>' +
    '<text x="236" y="106" text-anchor="middle" font-weight="700" font-size="15">Definir</text><text class="sub" x="236" y="126" text-anchor="middle" font-size="12">convergir</text>' +
    '<text x="405" y="106" text-anchor="middle" font-weight="700" font-size="15">Desenvolver</text><text class="sub" x="405" y="126" text-anchor="middle" font-size="12">divergir</text>' +
    '<text x="546" y="106" text-anchor="middle" font-weight="700" font-size="15">Entregar</text><text class="sub" x="546" y="126" text-anchor="middle" font-size="12">convergir</text>' +
    '<text class="sub" x="165" y="222" text-anchor="middle" font-size="12">espaço do problema</text><text class="sub" x="475" y="222" text-anchor="middle" font-size="12">espaço da solução</text></svg></div>';

  function caseNote(title, text) {
    return band("case", '<div class="note note--wide"><span>' + text + '</span></div>', title);
  }
  function checkBand(id) {
    return band("activity", Act.check(id), esc(D.CHECKS[id].title));
  }

  var Screens = {};

  Screens.inicio = function () {
    var t = A.totals(), started = t.done > 0, S = DT.state;
    var mods = [
      ["1", "Fundamentos do Design Thinking", true],
      ["2", "Empatia e descoberta"], ["3", "Definição do problema"], ["4", "Ideação e criatividade"],
      ["5", "Prototipagem e experimentação"], ["6", "Testes, iteração e aplicação"]
    ].map(function (m) {
      return '<li class="mod' + (m[2] ? " on" : "") + '"><span class="n">M' + m[0] + '</span><span class="t">' + m[1] + '</span>' +
        '<span class="tag">' + (m[2] ? "Nesta amostra" : "Planejado") + '</span></li>';
    }).join("");
    return band("intro",
        UI.head("Curso autoinstrucional · Módulo 1 de 6 · cerca de 40 minutos",
          "Design Thinking: da compreensão do problema à construção de soluções",
          "Neste módulo você vai entender os princípios do Design Thinking e, principalmente, aprender a reconhecer quando ele é a abordagem certa e quando não é.") +
        (DT.Storage.available ? "" : '<p class="warn-store">Este navegador não permite salvar o progresso. Você pode fazer o módulo normalmente, mas as respostas se perdem ao fechar a página.</p>') +
        '<div class="row"><button type="button" class="btn" data-go="' + (started && S.last ? S.last : "caso") + '">' + (started ? "Continuar de onde parei" : "Começar o módulo") + '</button>' +
        (started ? '<button type="button" class="btn quiet" data-go="fim">Ver minha síntese</button>' : "") + '</div>') +
      band("soft",
        '<h2>Ao final deste módulo, você será capaz de</h2><ul class="plain">' +
        '<li>explicar o que caracteriza uma abordagem centrada no ser humano;</li>' +
        '<li>usar as lentes de desejabilidade, factibilidade e viabilidade para analisar uma ideia;</li>' +
        '<li>distinguir momentos de divergência e de convergência em um projeto;</li>' +
        '<li><b>avaliar</b>, diante de um problema organizacional, se o Design Thinking é adequado e justificar a escolha com dados do cenário.</li></ul>') +
      band("content",
        '<h2>Como funciona</h2><p>Você acompanha um caso de uma empresa fictícia, estuda quatro unidades curtas e pratica em um simulador com seis cenários. Cada resposta recebe uma explicação. Seu progresso fica salvo neste navegador, e você pode refazer qualquer atividade. A apostila em PDF, com o mesmo conteúdo e gabarito, está no menu.</p>') +
      band("case", '<h2>Trilha do curso</h2><ol class="mods">' + mods + '</ol>');
  };

  Screens.caso = function () {
    return band("intro",
        UI.head("Abertura · o caso que acompanha o curso", "Grupo Vértice e a plataforma Conecta") +
        '<p>O Grupo Vértice é uma empresa de serviços com cerca de 3.000 colaboradores, entre escritórios e equipes de campo. Há oito meses lançou a <b>Conecta</b>, plataforma que reúne pedidos de reembolso, adiantamento e pequenas compras.</p>') +
      band("case",
        '<div class="notes" role="list">' +
        '<div class="note" role="listitem"><b>2.140</b><span>colaboradores fizeram login</span></div>' +
        '<div class="note" role="listitem"><b>38%</b><span>das solicitações iniciadas foram concluídas</span></div>' +
        '<div class="note" role="listitem"><b>41%</b><span>dos reembolsos ainda chegaram por e-mail ou planilha</span></div>' +
        '<div class="note" role="listitem"><b>2 h</b><span>de treinamento obrigatório: a proposta da liderança</span></div></div>' +
        '<p class="quote">A liderança acredita que o problema é falta de treinamento. Ainda não há evidências que confirmem isso.</p>',
        "Os números do último mês") +
      band("activity", Act.opening(), "Sua primeira decisão");
  };

  Screens.u1 = function () {
    return band("intro",
        UI.head("Unidade 1 · cerca de 5 min", "Começar pelas pessoas",
          "Design Thinking é uma abordagem para problemas complexos que começa pelas pessoas que vivem o problema, e não pela solução.")) +
      band("content",
        '<p>Em vez de partir de uma resposta pronta, a equipe investiga necessidades, comportamentos e contexto, gera alternativas e testa cedo, com protótipos simples. A abordagem ganhou forma em escolas e consultorias de design, como a d.school de Stanford e a IDEO, e hoje é usada em serviços, processos e políticas, não só em produtos.</p>' +
        '<div class="grid3">' +
          '<div class="mini"><h3>Começar pelas pessoas</h3><p>Entender o que os usuários fazem, precisam e enfrentam antes de decidir o que construir.</p></div>' +
          '<div class="mini"><h3>Tornar ideias tangíveis</h3><p>Transformar ideias em algo que se possa mostrar e testar: um esboço, um roteiro, uma simulação.</p></div>' +
          '<div class="mini"><h3>Aprender iterando</h3><p>Usar o que os testes revelam para ajustar o problema e a solução, quantas vezes for preciso.</p></div></div>') +
      band("soft",
        '<h3>O que Design Thinking não é</h3><ul class="plain"><li>Uma oficina de post-its sem pesquisa com usuários.</li><li>Uma sequência fixa de etapas que garante inovação.</li><li>Um substituto para dados, análise ou gestão de projetos.</li></ul>') +
      caseNote("No caso Conecta", "A proposta de treinamento parte de uma solução. Uma abordagem centrada no ser humano começaria perguntando: quem abandona as solicitações, em que momento e por quê?") +
      checkBand("u1");
  };

  Screens.u2 = function () {
    return band("intro",
        UI.head("Unidade 2 · cerca de 6 min", "Desejável, factível, viável",
          "A IDEO popularizou três lentes para avaliar uma ideia. Uma boa solução precisa passar pelas três.")) +
      band("content",
        VENN +
        '<div class="table-wrap"><table><thead><tr><th>Lente</th><th>Pergunta central</th><th>Fala sobre</th></tr></thead><tbody>' +
          '<tr><td><b>Desejabilidade</b></td><td>Resolve uma necessidade real das pessoas? Elas vão usar?</td><td>Pessoas</td></tr>' +
          '<tr><td><b>Factibilidade</b></td><td>É possível fazer com a tecnologia e as capacidades disponíveis?</td><td>Tecnologia e operação</td></tr>' +
          '<tr><td><b>Viabilidade</b></td><td>Se sustenta financeiramente e faz sentido para a estratégia?</td><td>Negócio</td></tr></tbody></table></div>' +
        '<p>O Design Thinking costuma <b>começar</b> pela desejabilidade, porque é a lente mais negligenciada em projetos que partem da tecnologia ou do orçamento. Mas começar por ela não significa ignorar as outras duas: uma ideia desejada que não se sustenta também fracassa.</p>') +
      caseNote("No caso Conecta", "Técnicos de campo perdem o formulário quando o sinal cai. Uma solução para isso precisa ser desejada por eles, possível na plataforma e cabível no orçamento.") +
      checkBand("u2");
  };

  Screens.u3 = function () {
    return band("intro",
        UI.head("Unidade 3 · cerca de 6 min", "Divergir e convergir",
          "Todo projeto alterna dois movimentos: abrir possibilidades e fazer escolhas.")) +
      band("content",
        '<div class="grid2"><div class="mini"><h3>Divergir</h3><p>Ampliar o repertório: mais perguntas, mais perfis, mais ideias. O julgamento fica para depois.</p></div>' +
        '<div class="mini"><h3>Convergir</h3><p>Escolher com critérios explícitos: o que priorizar, qual problema atacar, qual ideia testar.</p></div></div>' +
        '<p>O Design Council, do Reino Unido, representa essa alternância no <b>Duplo Diamante</b>. O primeiro diamante trata do problema; o segundo, da solução. O desenho lembra que é preciso divergir também sobre o problema, e não só sobre as ideias.</p>' +
        DOUBLE_DIAMOND) +
      caseNote("Erro comum", "Misturar os dois movimentos na mesma conversa. Criticar uma ideia no instante em que ela surge encerra a divergência antes da hora.") +
      checkBand("u3");
  };

  Screens.u4 = function () {
    return band("intro",
        UI.head("Unidade 4 · cerca de 7 min", "Modelos, iteração e limites",
          "Existem vários modelos de Design Thinking. Eles descrevem a mesma lógica com recortes diferentes, e nenhum é uma receita fixa.")) +
      band("content",
        '<div class="table-wrap"><table><thead><tr><th>Modelo</th><th>Etapas ou espaços</th><th>Ênfase</th></tr></thead><tbody>' +
          '<tr><td><b>d.school (Stanford)</b></td><td>Empatizar, Definir, Idear, Prototipar, Testar</td><td>Modos de trabalho com ferramentas práticas para cada um</td></tr>' +
          '<tr><td><b>Duplo Diamante (Design Council)</b></td><td>Descobrir, Definir, Desenvolver, Entregar</td><td>Alternância entre divergir e convergir, no problema e na solução</td></tr>' +
          '<tr><td><b>Design centrado no ser humano (IDEO)</b></td><td>Inspiração, Ideação, Implementação</td><td>Três espaços amplos, da compreensão à solução em uso</td></tr></tbody></table></div>' +
        '<h3>Iterativo, não linear</h3><p>As etapas são modos de trabalho, não uma fila. Um teste pode revelar que o problema estava mal definido e mandar a equipe de volta à pesquisa. Isso não é falha: é o processo funcionando, e quanto mais cedo acontece, mais barato fica.</p>') +
      band("soft",
        '<div class="grid2"><div class="mini"><h3>Quando costuma ajudar</h3><p>O problema está mal definido, as necessidades das pessoas são pouco conhecidas, há incerteza sobre qual solução funciona, ou o objetivo é criar algo novo.</p></div>' +
        '<div class="mini"><h3>Quando provavelmente não é a primeira escolha</h3><p>A causa pode ser rastreada em dados, a solução já está decidida e só falta executar, ou o problema é puramente técnico.</p></div></div>' +
        '<h3>Limites a conhecer</h3><ul class="plain"><li>Exige tempo e acesso real aos usuários. Sem isso, vira suposição com aparência de método.</li><li>Não prova causalidade. Para problemas com causa mensurável, a análise de causa raiz é mais rigorosa.</li><li>Pode ser combinado com outras abordagens: é comum usar análise de causa raiz em uma parte do problema e Design Thinking em outra.</li></ul>') +
      checkBand("u4");
  };

  Screens.sim = function () {
    return band("intro",
        UI.head("Prática · cerca de 12 min", "Simulador: cabe Design Thinking?",
          "Você é consultor interno e recebe seis pedidos. Para cada um, decida a abordagem mais adequada e aponte o dado do cenário que sustenta sua decisão.") +
        Act.simulatorHeader()) +
      band("activity", Act.simulator()) +
      band("soft", '<p class="small muted">Cada cenário vale 2 pontos: 1 pela abordagem e 1 pelo dado que a sustenta. Escolher a abordagem certa pelo motivo errado conta como resposta parcial, porque em um caso real esse raciocínio falharia no próximo problema.</p>');
  };

  Screens.cards = function () {
    return band("intro",
        UI.head("Prática · cerca de 6 min", "Flashcards situacionais",
          "Cada carta traz uma situação real de projeto. A avaliação da resposta é sua, não do sistema.")) +
      band("activity", Act.flashcards());
  };

  Screens.fim = function () {
    var t = A.totals(), st = A.statuses(), cs = A.cardStats(), S = DT.state;
    var opening = D.OPENING.filter(function (o) { return o.id === S.opening; })[0];
    function statusRow(ok, title, desc) {
      return '<div class="status"><span class="st ' + (ok ? "done" : "") + '" aria-hidden="true">' + (ok ? "✓" : "") + '</span>' +
        '<div><h3>' + title + ' <span class="sr">' + (ok ? "(atingido)" : "(ainda não atingido)") + '</span></h3><p>' + desc + '</p></div></div>';
    }
    return band("intro",
        UI.head("Fechamento", "Síntese do módulo") +
        '<div class="metrics"><div class="metric"><b>' + t.pct + '%</b><span>atividades concluídas</span></div>' +
        '<div class="metric"><b class="score">' + t.simPts + '/12</b><span>pontos no simulador</span></div>' +
        '<div class="metric"><b>' + cs.ok + '/6</b><span>flashcards que você marcou como acertados</span></div></div>') +
      band("soft",
        '<h2>Seus status neste módulo</h2><div class="status-list">' +
        statusRow(st.participation, "Participação", "Você passou por todas as telas de conteúdo e prática.") +
        statusRow(st.completion, "Conclusão das atividades", "Você respondeu a abertura, as quatro checagens, os seis cenários e avaliou os seis flashcards.") +
        statusRow(st.demonstrated, "Desempenho demonstrado", "Pelo menos " + A.DEMONSTRATED_MIN + " de 12 pontos no simulador. É o único critério verificado automaticamente neste módulo, porque depende de regras objetivas. A autoavaliação dos flashcards não entra nesta conta.") +
        '</div>' +
        (!st.demonstrated && t.simDone === 6 ? UI.feedback("part", "Para chegar ao desempenho demonstrado", "<p>Volte aos cenários marcados como parciais ou inadequados no simulador. Releia a explicação e refaça: o objetivo é que a decisão e o dado que a sustenta caminhem juntos.</p>") : "")) +
      band("case",
        (opening
          ? '<p><b>Você escolheu:</b> ' + esc(opening.text) + '</p><p>' + esc(opening.back) + '</p>'
          : '<p>Você ainda não registrou o que faria primeiro no caso Conecta.</p><div class="row"><button type="button" class="btn ghost" data-go="caso">Registrar agora</button></div>') +
        '<h3>Próximo passo no caso: Módulo 2, Empatia e descoberta</h3><p>Você vai entrevistar quatro colaboradores do Grupo Vértice, com perfis bem diferentes, e descobrir se o treinamento resolve, para quem e em que parte do problema.</p><p class="muted small">O Módulo 2 não faz parte desta amostra.</p>',
        "De volta à sua primeira resposta") +
      band("content",
        '<h3>Exportar minhas respostas</h3><p>Copie o registro abaixo para guardar ou enviar a um tutor.</p>' +
        '<label for="exportBox" class="sr">Registro em JSON</label><textarea id="exportBox" readonly>' + esc(JSON.stringify(A.exportRecord(), null, 2)) + '</textarea>' +
        '<div class="row"><button type="button" class="btn quiet" data-act="copy">Copiar registro</button><span id="copyMsg" role="status" class="small muted"></span></div>' +
        '<h3>Recomeçar o módulo</h3>' +
        (DT.ui.confirmReset
          ? '<div class="confirm" role="alertdialog" aria-labelledby="cfT"><p id="cfT"><b>Apagar todas as respostas deste módulo?</b> Essa ação não pode ser desfeita.</p>' +
            '<div class="row"><button type="button" class="btn danger" data-act="resetyes">Sim, apagar e recomeçar</button><button type="button" class="btn quiet" data-act="resetno">Cancelar</button></div></div>'
          : '<p>Apaga as respostas salvas neste navegador e volta ao início.</p><div class="row"><button type="button" class="btn quiet" data-act="reset">Recomeçar o módulo</button></div>'));
  };

  Screens.ficha = function () {
    var rows = [
      ["Público", "Profissionais de gestão, processos, inovação e atendimento; nível introdutório"],
      ["Modalidade", "Autoinstrucional, assíncrona, cerca de 40 minutos"],
      ["Objetivo principal", "Avaliar se o Design Thinking é adequado a um problema organizacional e justificar a escolha com dados do cenário (Bloom revisado: Avaliar)"],
      ["Estratégia", "Caso integrador que atravessa o curso, microunidades com checagem imediata, simulador de decisão com justificativa e flashcards situacionais. Blocos de conteúdo separados por cor: explicação, exemplo do caso e prática"],
      ["Avaliação", "Formativa em todas as atividades, com feedback explicativo e caminho de revisão. Critério automático apenas onde há regra objetiva (simulador). Autoavaliação explícita nos flashcards. Três status separados: participação, conclusão e desempenho"],
      ["Acessibilidade", "WCAG 2.2 AA como referência: HTML semântico, controles nativos operáveis por teclado, foco visível, feedback com texto e símbolo além da cor, mensagens dinâmicas anunciadas, respeito a movimento reduzido. Ainda não auditado com leitores de tela"],
      ["Tecnologia", "HTML, CSS e JavaScript sem bibliotecas, em arquivos separados por responsabilidade (dados, armazenamento, avaliação, atividades, telas, navegação). Progresso salvo no navegador. Apostila em PDF gerada a partir dos mesmos dados"],
      ["Limitações", "O progresso fica só neste navegador e não é enviado a um ambiente virtual de aprendizagem (para isso, seria preciso empacotar em SCORM ou xAPI). Os módulos 2 a 6 estão planejados, não implementados"],
      ["Autoria", "Maiara Machado · concepção, design instrucional e roteiro"]
    ];
    return band("intro", UI.head("Sobre esta peça", "Ficha técnica", "Amostra de portfólio: o primeiro módulo de um curso de seis, desenvolvido como objeto completo e funcional.")) +
      band("content", '<div class="table-wrap"><table><tbody>' + rows.map(function (r) { return '<tr><th>' + r[0] + '</th><td>' + r[1] + '</td></tr>'; }).join("") + '</tbody></table></div>');
  };

  DT.Screens = Screens;
})(window.DT = window.DT || {});
