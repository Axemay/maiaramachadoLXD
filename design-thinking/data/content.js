/* Conteúdo e cenários do Módulo 1.
   Toda a base de feedback do curso vem daqui: editar este arquivo muda o módulo e a apostila. */
(function (DT) {
  "use strict";
  var SCREENS = [
    {id:"inicio", title:"Início", grp:null},
    {id:"caso", title:"O caso Conecta", grp:"Abertura"},
    {id:"u1", title:"Começar pelas pessoas", grp:"Fundamentos"},
    {id:"u2", title:"Desejável, factível, viável", grp:"Fundamentos"},
    {id:"u3", title:"Divergir e convergir", grp:"Fundamentos"},
    {id:"u4", title:"Modelos, iteração e limites", grp:"Fundamentos"},
    {id:"sim", title:"Simulador: cabe Design Thinking?", grp:"Prática"},
    {id:"cards", title:"Flashcards situacionais", grp:"Prática"},
    {id:"fim", title:"Síntese do módulo", grp:"Fechamento"},
    {id:"ficha", title:"Ficha técnica da peça", grp:"Sobre"}
  ];
  var CONTENT_SCREENS = ["caso","u1","u2","u3","u4","sim","cards"];

  var OPENING = [
    {id:"a", text:"Aprovar a trilha de treinamento. É rápida de lançar e tem baixo risco.",
     back:"Você começou pela solução que a liderança propôs. É uma reação comum, e às vezes acerta. Mas, sem evidências, o treinamento pode atacar um sintoma. No Módulo 2 você vai ver o que aparece quando a hipótese é testada antes."},
    {id:"b", text:"Ouvir e observar colaboradores de perfis diferentes usando a plataforma.",
     back:"Você começou pela investigação. É o que o Design Thinking propõe quando o problema ainda não está claro. No Módulo 2 você vai conduzir essas entrevistas e descobrir se o treinamento resolve, para quem e em que parte."},
    {id:"c", text:"Pedir ao fornecedor novas funcionalidades para deixar a plataforma mais completa.",
     back:"Você começou por novas funcionalidades. Sem saber o que trava os usuários, mais funções podem aumentar a complexidade. O Módulo 2 ajuda a descobrir o que de fato falta."}
  ];

  var CHECKS = {
    u1:{type:"single", title:"Verifique sua compreensão",
      prompt:"Qual destas formulações coloca as pessoas no centro do problema da Conecta?",
      options:[
        {id:"a", text:"Precisamos elevar o uso da Conecta para 90% até dezembro.", ok:false,
         fb:"Isso é uma meta da organização. Ela é legítima e ajuda a medir o resultado, mas não diz nada sobre quem usa a plataforma nem sobre o que essas pessoas enfrentam."},
        {id:"b", text:"Como ajudar técnicos de campo a registrar despesas no momento em que elas acontecem, mesmo com sinal fraco?", ok:true,
         fb:"A formulação nomeia um grupo de pessoas, uma situação real e uma dificuldade concreta. E não impõe uma solução: deixa espaço para várias respostas."},
        {id:"c", text:"Precisamos de um treinamento obrigatório para todos os colaboradores.", ok:false,
         fb:"Isso já é uma solução. Formular o problema como solução fecha a investigação antes de ela começar."}
      ],
      tip:"Releia os três princípios acima, em especial “Começar pelas pessoas”."},
    u2:{type:"classify", title:"Classifique as informações", cats:[["D","Desejabilidade"],["F","Factibilidade"],["V","Viabilidade"]],
      prompt:"Três informações chegaram sobre uma ideia para a Conecta: permitir enviar comprovantes pelo celular e continuar depois. Que lente cada uma alimenta?",
      items:[
        {id:"i1", text:"Técnicos de campo dizem que perdem o formulário quando o sinal cai e desistem de enviar.", ans:"D",
         fb:"Desejabilidade: fala da necessidade e do comportamento das pessoas. Mostra que a ideia responde a uma dor real."},
        {id:"i2", text:"A versão atual da plataforma não permite salvar rascunhos sem conexão.", ans:"F",
         fb:"Factibilidade: fala do que a tecnologia e as capacidades atuais permitem fazer. Não quer dizer que seja impossível, só que exige desenvolvimento."},
        {id:"i3", text:"O desenvolvimento custaria R$ 180 mil, e a área não tem esse orçamento este ano.", ans:"V",
         fb:"Viabilidade: fala da sustentação para o negócio, como custo, orçamento e retorno."}
      ],
      tip:"Pergunte-se: a informação fala das pessoas, da tecnologia ou do negócio?"},
    u3:{type:"classify", title:"Divergir ou convergir?", cats:[["DIV","Divergir"],["CON","Convergir"]],
      prompt:"Em cada momento do projeto Conecta, a equipe deveria abrir possibilidades ou fazer escolhas?",
      items:[
        {id:"i1", text:"Antes das entrevistas, a equipe lista todas as perguntas que poderia fazer aos usuários.", ans:"DIV",
         fb:"Divergir: o objetivo é ampliar o repertório. A seleção das melhores perguntas vem depois."},
        {id:"i2", text:"A equipe tem 40 ideias e uma semana para testar apenas duas.", ans:"CON",
         fb:"Convergir: é hora de escolher com critérios explícitos, como impacto na necessidade dos usuários e esforço de teste."},
        {id:"i3", text:"Depois de 12 entrevistas, a equipe agrupa as anotações e escolhe o problema prioritário.", ans:"CON",
         fb:"Convergir: o primeiro diamante se fecha aqui, quando a pesquisa ampla vira uma definição de problema."}
      ],
      tip:"Divergir abre e adia o julgamento. Convergir fecha e decide com critérios."},
    u4:{type:"single", title:"Verifique sua compreensão",
      prompt:"Ao testar um protótipo, a equipe descobre que o problema que definiu estava errado. O que isso significa?",
      options:[
        {id:"a", text:"O processo falhou. É melhor descartar tudo e recomeçar do zero.", ok:false,
         fb:"Nada foi perdido: o teste produziu exatamente o tipo de aprendizado que justifica testar cedo. O que se descobriu deve ser aproveitado, não descartado."},
        {id:"b", text:"É um resultado esperado: a equipe volta à definição levando o que aprendeu.", ok:true,
         fb:"O processo é iterativo. Descobrir cedo que o problema estava mal definido custa muito menos do que descobrir depois da implementação."},
        {id:"c", text:"A equipe deve seguir para a implementação, porque o cronograma já foi aprovado.", ok:false,
         fb:"Seguir com um problema que se sabe errado transforma o cronograma em mais importante que o resultado. O custo aparece depois, com uma solução que não resolve."}
      ],
      tip:"Reveja o trecho sobre iteração: as etapas são modos de trabalho, não uma fila."}
  };

  var APPROACHES = [
    ["dt","Design Thinking"],
    ["masp","Análise de causa raiz (MASP, PDCA)"],
    ["proj","Gestão de projeto convencional"],
    ["comb","Combinação: causa raiz + Design Thinking"]
  ];

  var SCENARIOS = [
    {id:"s1", tag:"Indústria", title:"A linha 3 de envase",
     text:"Desde a troca do fornecedor de filme plástico, há seis semanas, a linha 3 de envase perdeu 12% de produtividade. O sistema registra cada parada, com duração e motivo. As outras linhas, que seguem com o fornecedor antigo, estão estáveis.",
     correct:"masp",
     afb:{
       dt:"O problema já está bem definido e é mensurável, e a causa provável pode ser rastreada nos registros de parada. Começar por pesquisa com usuários atrasaria uma resposta que os dados podem dar.",
       masp:"Há um efeito mensurável, um momento claro de início e dados para testar hipóteses de causa. É o terreno típico da análise de causa raiz.",
       proj:"Ainda não se sabe qual é a solução, então não há escopo a executar. Antes é preciso confirmar a causa.",
       comb:"Nada no cenário indica que a experiência das pessoas seja parte central do problema. Combinar abordagens aqui aumentaria o custo sem ganho claro."},
     ev:[
       {id:"e1", ok:true, text:"A queda começou com a troca de fornecedor e só afeta a linha que usa o novo filme.",
        fb:"É o dado que mais sustenta a decisão: há uma mudança identificável, um efeito localizado e registros para testar a hipótese."},
       {id:"e2", ok:false, text:"Operadores comentam que o turno da noite anda mais cansado.",
        fb:"É um relato que merece atenção, mas é isolado. Sozinho, não explica por que só a linha 3 piorou."},
       {id:"e3", ok:false, text:"A diretoria quer trazer mais inovação para a operação.",
        fb:"A vontade de inovar não define a ferramenta. Quem define é a natureza do problema."}]},
    {id:"s2", tag:"Serviços", title:"A plataforma Conecta",
     text:"A Conecta tem login frequente, mas só 38% das solicitações iniciadas são concluídas. A liderança acredita que falta treinamento. Ninguém conversou ainda com os usuários sobre como usam a plataforma no dia a dia, e os perfis vão de técnicos de campo a analistas de escritório.",
     correct:"dt",
     afb:{
       dt:"O comportamento dos usuários é pouco conhecido e a causa do abandono não está clara. Antes de escolher uma solução, é preciso entender o que acontece na prática, perfil por perfil.",
       masp:"A análise de causa raiz pode ajudar mais adiante, mas ainda falta matéria-prima: não se sabe como os diferentes perfis usam a plataforma. Sem essa compreensão, o grupo tende a confirmar a hipótese do treinamento.",
       proj:"Tratar o caso como projeto convencional significaria aprovar o treinamento sem evidência de que ele resolve o problema.",
       comb:"Pode fazer sentido mais tarde. Agora, o que falta é compreender os usuários. Ainda não há uma causa mensurável identificada para analisar em paralelo."},
     ev:[
       {id:"e1", ok:true, text:"Ninguém sabe por que as pessoas abandonam as solicitações, e os perfis de uso são muito diferentes.",
        fb:"É o dado decisivo: o problema está mal definido e depende de entender pessoas em contextos distintos."},
       {id:"e2", ok:false, text:"A taxa de conclusão é de 38%.",
        fb:"O número mostra o tamanho do problema, não o porquê. Um indicador sozinho não indica a abordagem."},
       {id:"e3", ok:false, text:"A liderança já tem uma hipótese: falta de treinamento.",
        fb:"Uma hipótese sem evidência é o que precisa ser investigado. Ela reforça a necessidade de pesquisa, mas o dado mais forte é o desconhecimento sobre os usuários."}]},
    {id:"s3", tag:"TI", title:"A migração do e-mail",
     text:"Por exigência contratual, a empresa precisa migrar todas as caixas de e-mail para um novo provedor até 30 de março. O provedor, a ferramenta de migração e a lista de 1.200 caixas já estão definidos.",
     correct:"proj",
     afb:{
       dt:"Não há problema mal definido nem solução a descobrir: a decisão já foi tomada. Usar Design Thinking aqui seria criar oficinas sem nada a investigar.",
       masp:"Não existe um problema com causa a investigar. Existe uma entrega a planejar e executar.",
       proj:"Escopo, solução e prazo estão definidos. Cronograma, gestão de riscos e comunicação da mudança resolvem melhor.",
       comb:"Nenhuma das duas abordagens é necessária: o trabalho é de execução planejada."},
     ev:[
       {id:"e1", ok:true, text:"Solução, escopo e prazo já estão definidos. O desafio é executar sem falhas.",
        fb:"É o dado que define a natureza do trabalho: baixa incerteza sobre o quê, alta exigência sobre o como e o quando."},
       {id:"e2", ok:false, text:"Alguns usuários podem estranhar a nova interface.",
        fb:"É um risco real, que pede boa comunicação. Mas não muda a natureza do trabalho, que é executar uma solução já decidida."},
       {id:"e3", ok:false, text:"Há 1.200 caixas para migrar.",
        fb:"O volume afeta o planejamento, não a escolha da abordagem."}]},
    {id:"s4", tag:"Varejo", title:"A central de atendimento",
     text:"Depois de uma reestruturação, o tempo médio de espera na central de atendimento dobrou. Ao mesmo tempo, os comentários abertos da pesquisa de satisfação dizem que os atendentes não entendem o problema do cliente, uma queixa que já aparecia antes da reestruturação.",
     correct:"comb",
     afb:{
       dt:"Design Thinking ajuda a entender por que os clientes não se sentem compreendidos. Mas o aumento da espera tem um marco claro e dados para análise, e ficaria sem tratamento rigoroso.",
       masp:"A análise de causa raiz resolve bem o tempo de espera. A queixa sobre não ser compreendido, porém, é anterior e envolve a experiência do cliente. Ela ficaria sem resposta.",
       proj:"Ainda não há solução definida para nenhum dos dois problemas.",
       comb:"Tratar a espera com análise de causa raiz e a experiência de atendimento com Design Thinking respeita a natureza diferente de cada parte."},
     ev:[
       {id:"e1", ok:true, text:"Há dois fenômenos: um recente e mensurável (a espera) e outro antigo, ligado à experiência (não ser compreendido).",
        fb:"É o dado que justifica combinar: cada parte do problema pede uma abordagem diferente."},
       {id:"e2", ok:false, text:"O tempo de espera dobrou.",
        fb:"Sustenta só metade da decisão. Justifica a análise de causa raiz, mas não explica a queixa antiga."},
       {id:"e3", ok:false, text:"A reestruturação reduziu o quadro de atendentes em 15%.",
        fb:"É uma causa candidata para o tempo de espera, mas não explica uma queixa que já existia antes."}]},
    {id:"s5", tag:"Recursos humanos", title:"O novo benefício",
     text:"O RH quer criar um benefício para reduzir a saída de profissionais com até três anos de casa, grupo com rotatividade de 28% ao ano. Não há pesquisa sobre o que esses profissionais valorizam. O comitê está dividido entre auxílio-academia e mais dias de trabalho remoto.",
     correct:"dt",
     afb:{
       dt:"As necessidades do grupo são desconhecidas e o comitê está escolhendo entre soluções sem evidência. É o cenário típico para começar pelas pessoas.",
       masp:"Dados de desligamento ajudam, mas o objetivo é criar algo novo que as pessoas valorizem. Isso exige entender necessidades e testar alternativas, não só achar uma causa.",
       proj:"Implementar uma das duas opções como projeto seria decidir por opinião.",
       comb:"Faria sentido se houvesse uma causa mensurável para isolar em paralelo. O cenário descreve, sobretudo, falta de conhecimento sobre as pessoas."},
     ev:[
       {id:"e1", ok:true, text:"Não se sabe o que esse grupo valoriza, e as opções em debate vêm da opinião do comitê.",
        fb:"É o dado que decide: a necessidade é desconhecida, e as soluções na mesa ainda não foram testadas com ninguém."},
       {id:"e2", ok:false, text:"A rotatividade do grupo é de 28% ao ano.",
        fb:"Mostra a relevância do problema, não o caminho para resolvê-lo."},
       {id:"e3", ok:false, text:"O comitê já reduziu a decisão a duas opções.",
        fb:"É um sinal de alerta, não de prontidão: a escolha está sendo feita entre soluções antes de entender a necessidade."}]},
    {id:"s6", tag:"Financeiro", title:"O erro na folha",
     text:"Desde a atualização do sistema de folha de pagamento, no mês passado, 4% dos holerites saem com o desconto de INSS calculado errado. Todos os casos com erro são de colaboradores com dois vínculos.",
     correct:"masp",
     afb:{
       dt:"O problema é técnico, mensurável e tem padrão claro. Entender a experiência dos colaboradores não ajuda a corrigir o cálculo.",
       masp:"Há um marco (a atualização), um padrão (dois vínculos) e dados para confirmar a causa.",
       proj:"Ainda não se sabe exatamente o que corrigir. É preciso confirmar a causa antes de planejar a correção.",
       comb:"A experiência das pessoas não é a origem do problema. Uma comunicação cuidadosa aos afetados é importante, mas não exige um processo de Design Thinking."},
     ev:[
       {id:"e1", ok:true, text:"Os erros começaram após a atualização e se concentram em um perfil específico de colaborador.",
        fb:"É o dado que direciona a análise: quando começou e quem é afetado."},
       {id:"e2", ok:false, text:"Os colaboradores afetados estão insatisfeitos.",
        fb:"A insatisfação é consequência. Não ajuda a localizar a causa."},
       {id:"e3", ok:false, text:"4% dos holerites têm erro.",
        fb:"Mede o problema, mas o dado que orienta a análise é o padrão: quem é afetado e desde quando."}]}
  ];

  var CARDS = [
    {id:"c1", q:"Na reunião, um diretor diz: “Já sei o que o usuário quer. Vamos direto para a solução.” Qual é o risco?",
     a:"Transformar uma suposição em requisito. Sem descoberta, a equipe pode construir com eficiência a solução para o problema errado. Uma conversa curta com usuários costuma ser o jeito mais barato de testar a certeza do diretor."},
    {id:"c2", q:"Em uma oficina de ideias, um participante critica cada proposta assim que ela surge. O que está acontecendo?",
     a:"A equipe está tentando divergir e convergir ao mesmo tempo. O julgamento precoce reduz a quantidade e a ousadia das ideias. Separe os momentos: primeiro gerar sem avaliar, depois escolher com critérios combinados."},
    {id:"c3", q:"A solução é desejada pelos usuários e tecnicamente possível, mas custa mais do que gera de valor. Qual lente falhou?",
     a:"Viabilidade. Desejabilidade e factibilidade não bastam: a solução precisa se sustentar para o negócio. Às vezes a saída é uma versão menor, que preserva o que os usuários mais valorizam."},
    {id:"c4", q:"A equipe passou três meses construindo a versão completa antes de mostrá-la a qualquer usuário. O que faltou?",
     a:"Prototipar e testar cedo. Um protótipo simples (um esboço, um roteiro, uma simulação) teria revelado em dias o que só apareceu depois de meses de investimento."},
    {id:"c5", q:"Um problema de produção tem causa conhecida e dados históricos completos. Design Thinking é a melhor primeira ferramenta?",
     a:"Provavelmente não. Com problema bem definido e dados para rastrear a causa, a análise de causa raiz tende a ser mais rápida e rigorosa. Design Thinking rende mais quando o problema ou as necessidades das pessoas ainda não estão claros."},
    {id:"c6", q:"A equipe fez a pesquisa de descoberta entrevistando apenas os gestores das áreas. Qual é o problema?",
     a:"Os gestores falam do que acham que acontece, não do que os usuários vivem. A pesquisa precisa incluir quem usa a solução no dia a dia, e em perfis diferentes. Do contrário, o retrato sai enviesado."}
  ];

  DT.data = {
    SCREENS: SCREENS,
    CONTENT_SCREENS: CONTENT_SCREENS,
    OPENING: OPENING,
    CHECKS: CHECKS,
    APPROACHES: APPROACHES,
    SCENARIOS: SCENARIOS,
    CARDS: CARDS
  };
})(window.DT = window.DT || {});
