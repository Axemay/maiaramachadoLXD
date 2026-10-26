/* Base de cenários do simulador "Esse e-mail é confiável?".
   Instituição, pessoas, domínios e mensagens são fictícios. Os links do simulador nunca abrem. */
(function (App) {
  "use strict";

  var SCREENS = [
    { id: "inicio", title: "Início", grp: null },
    { id: "sinais", title: "Onde olhar", grp: "Aprender" },
    { id: "caixa", title: "Caixa de entrada", grp: "Praticar" },
    { id: "fim", title: "Síntese", grp: "Fechamento" },
    { id: "ficha", title: "Ficha técnica da peça", grp: "Sobre" }
  ];

  /* O que a instituição usa de fato: o participante compara cada e-mail com isto. */
  var ENVIRONMENT = [
    ["Domínio oficial", "uln.edu.br"],
    ["Webmail", "webmail.uln.edu.br"],
    ["Portal Acadêmico", "portal.uln.edu.br"],
    ["Arquivos compartilhados", "arquivos.uln.edu.br"],
    ["Regra da TI", "A TI nunca pede senha por e-mail"]
  ];

  var SIGNALS = [
    { id: "dom", label: "Endereço do remetente fora do domínio da instituição" },
    { id: "link", label: "Link cujo destino real é diferente do que aparece" },
    { id: "urg", label: "Urgência, ameaça ou prazo curto" },
    { id: "cred", label: "Pedido de senha, login ou dados pessoais" },
    { id: "fin", label: "Pedido de pagamento fora do fluxo normal" },
    { id: "block", label: "Pedido de sigilo ou obstáculo para confirmar com a pessoa" }
  ];

  var ACTIONS = [
    { id: "abrir", label: "Abrir o link ou o anexo para entender do que se trata" },
    { id: "responder", label: "Responder ao remetente pedindo confirmação" },
    { id: "reportar", label: "Não interagir e reportar à equipe de segurança" },
    { id: "canal", label: "Confirmar por um canal oficial que eu mesmo escolho (ramal do catálogo, chat interno, endereço digitado no navegador)" },
    { id: "seguir", label: "Seguir normalmente: não vejo risco neste e-mail" }
  ];

  var EMAILS = [
    {
      id: "e1", kind: "phishing",
      from: { name: "Suporte TI", addr: "suporte@uln-edu.com" },
      date: "seg., 9:12",
      subject: "Sua caixa postal atingiu 98% da capacidade",
      body: [
        "Prezado(a) usuário(a),",
        "Sua caixa postal atingiu 98% da capacidade. Para evitar o bloqueio do envio e do recebimento de mensagens, valide sua conta nas próximas 24 horas pelo link abaixo. Após esse prazo, novas mensagens serão descartadas."
      ],
      link: { text: "https://webmail.uln.edu.br/validar", href: "http://uln-edu-validacao.top/login" },
      sign: "Equipe de Suporte TI",
      signals: ["dom", "link", "urg", "cred"],
      notes: {
        dom: "O remetente é uln-edu.com, um domínio parecido, mas diferente de uln.edu.br.",
        link: "O texto mostra webmail.uln.edu.br, mas o destino real é uln-edu-validacao.top.",
        urg: "“Nas próximas 24 horas” e a ameaça de descartar mensagens criam pressa para você não pensar.",
        cred: "“Validar a conta” significa digitar usuário e senha numa página falsa. A TI da ULN não pede senha por e-mail."
      },
      actions: {
        reportar: ["ok", "É a ação mais útil: você não entrega a senha e o alerta ajuda a TI a bloquear a mensagem para os colegas."],
        canal: ["part", "Seguro: conferir a cota no webmail digitando o endereço mostraria que não há problema. Mas os sinais aqui já são claros, e reportar protege também quem ainda não percebeu."],
        abrir: ["bad", "O link leva a uma página que imita o webmail. Digitar a senha ali entrega sua conta, e com ela o acesso a e-mails e sistemas da instituição."],
        responder: ["bad", "A resposta vai para o golpista. Além de não confirmar nada, mostra que seu endereço está ativo e atento a esse tipo de mensagem."],
        seguir: ["bad", "Há quatro sinais de risco neste e-mail. Ignorar sem reportar deixa a mensagem circulando para outros colegas."]
      },
      lesson: "Domínio parecido + link disfarçado + pressa + pedido de senha: é o padrão clássico de captura de credenciais."
    },
    {
      id: "e2", kind: "legitimo",
      from: { name: "Comunicação da TI", addr: "comunicacao.ti@uln.edu.br" },
      date: "seg., 10:40",
      subject: "Manutenção programada do Portal Acadêmico no sábado",
      body: [
        "Olá,",
        "O Portal Acadêmico ficará indisponível no sábado, 14/11, das 8h às 12h, para uma atualização de segurança. Nenhuma ação é necessária da sua parte.",
        "O calendário de manutenções está disponível em:"
      ],
      link: { text: "portal.uln.edu.br/avisos", href: "https://portal.uln.edu.br/avisos" },
      sign: "Comunicação da Diretoria de TI",
      signals: [],
      notes: {
        dom: "O remetente usa @uln.edu.br, o domínio oficial.",
        link: "O destino real é o mesmo que aparece: portal.uln.edu.br.",
        urg: "O e-mail avisa uma data, mas não pressiona você a agir.",
        cred: "Não pede senha nem dados: diz que nenhuma ação é necessária."
      },
      actions: {
        seguir: ["ok", "Remetente oficial, link que confere e nenhum pedido. É um aviso legítimo, e tratar como tal é parte da segurança: reconhecer o normal ajuda a perceber o estranho."],
        canal: ["part", "Não há risco em conferir no portal, mas aqui não era necessário. Desconfiar de tudo custa tempo e faz avisos importantes serem ignorados."],
        abrir: ["part", "O destino confere com o domínio oficial, então não há risco. Só não era preciso: o aviso já dizia tudo."],
        reportar: ["part", "Reportar um aviso legítimo gera trabalho para a equipe de segurança e dilui a atenção dos alertas reais."],
        responder: ["part", "Não traz risco, porque o remetente é oficial. Mas o e-mail não pedia resposta."]
      },
      lesson: "Nem todo e-mail da TI é golpe. Reconhecer o legítimo é o que dá valor ao alerta quando ele é necessário."
    },
    {
      id: "e3", kind: "phishing",
      from: { name: "Profa. Helena Duarte · Pró-Reitoria de Administração", addr: "helena.duarte.uln@gmail.com" },
      date: "seg., 13:05",
      subject: "Pagamento urgente · confidencial",
      body: [
        "Bom dia,",
        "Preciso que você providencie hoje o pagamento do boleto em anexo, de um fornecedor que atende a Pró-Reitoria. É um assunto confidencial, por isso peço que não comente com a equipe.",
        "Estou em reunião o dia todo e não consigo atender ligações. Me confirme por aqui assim que o pagamento for feito."
      ],
      attach: { name: "boleto_fornecedor_nov.pdf", size: "184 KB" },
      sign: "Helena Duarte",
      signals: ["dom", "urg", "fin", "block"],
      notes: {
        dom: "O nome é de uma autoridade da instituição, mas o endereço é uma conta pessoal do Gmail.",
        urg: "“Hoje” e “assim que for feito” empurram a decisão antes de qualquer conferência.",
        fin: "Pagamentos a fornecedores seguem um fluxo formal. Um pedido direto por e-mail, com boleto anexo, foge desse fluxo.",
        block: "Pedir sigilo e dizer que não pode atender ligações são formas de impedir que você confirme com a própria pessoa."
      },
      actions: {
        canal: ["ok", "Ligue para o ramal da Pró-Reitoria que está no catálogo institucional, nunca para um contato do e-mail. Em golpes de falso dirigente, a confirmação independente desmonta a fraude."],
        reportar: ["ok", "Correto: o padrão é de fraude com nome de dirigente. Reportar permite alertar outras áreas que podem receber o mesmo pedido."],
        responder: ["bad", "A resposta vai para quem controla a conta do Gmail, não para a professora. O golpista confirma o que você quiser ouvir."],
        abrir: ["bad", "O anexo pode conter código malicioso. E, mesmo que seja só um boleto, abrir é o primeiro passo para pagar um golpe."],
        seguir: ["bad", "Pagar o boleto transfere dinheiro da instituição para o golpista, e esse tipo de pagamento raramente é recuperado."]
      },
      lesson: "Nome de autoridade + conta externa + pressa + sigilo + pagamento: o golpe não depende de link, depende de impedir a verificação."
    },
    {
      id: "e4", kind: "phishing",
      from: { name: "Rafael Souza (via Docs Compartilhados)", addr: "no-reply@docs-compartilhados.net" },
      date: "seg., 15:31",
      subject: "Rafael Souza compartilhou “Notas finais 2026.2” com você",
      body: [
        "Rafael Souza compartilhou um documento com você:",
        "“Segue a planilha para conferência antes do fechamento.”"
      ],
      link: { text: "Abrir documento", href: "https://docs-compartilhados.net/s/uln-login?u=voce", button: true },
      sign: "Docs Compartilhados",
      signals: ["dom", "link"],
      notes: {
        dom: "A ULN compartilha arquivos por arquivos.uln.edu.br. Este aviso vem de um serviço externo, docs-compartilhados.net.",
        link: "O botão não mostra o endereço. O destino real é uma página de login fora da instituição.",
        urg: "Não há pressa explícita. Golpes com nome de colega costumam ser mais discretos.",
        cred: "O e-mail não pede senha diretamente, mas o link leva a uma página de login. O pedido vem depois do clique."
      },
      actions: {
        canal: ["ok", "Pergunte ao Rafael pelo chat interno se ele compartilhou o arquivo. Usar o nome de um colega real é justamente o que torna esse golpe convincente."],
        reportar: ["ok", "Correto: o serviço não é o que a instituição usa e o link leva a um login externo. Se a conta do Rafael foi invadida, o alerta ajuda a contê-la."],
        abrir: ["bad", "A página de destino pede login. Quem digita a senha ali entrega a conta, e o golpe se espalha para os contatos da vítima."],
        responder: ["bad", "O endereço é de um serviço externo. Responder não chega ao Rafael e confirma que seu e-mail está ativo."],
        seguir: ["bad", "Seguir significa abrir o documento. Um nome conhecido não torna o link seguro."]
      },
      lesson: "Um nome conhecido não valida o e-mail. O que valida é o canal: o serviço é o que a instituição usa?"
    },
    {
      id: "e5", kind: "legitimo",
      from: { name: "Secretaria Acadêmica", addr: "secretaria@uln.edu.br" },
      date: "seg., 17:02",
      subject: "Lançamento de notas termina hoje às 23h59",
      body: [
        "Prezados docentes,",
        "Lembramos que o prazo para lançamento das notas do semestre termina hoje, às 23h59. Depois desse horário, alterações só poderão ser feitas por requerimento à coordenação.",
        "O lançamento é feito no Portal Acadêmico:"
      ],
      link: { text: "portal.uln.edu.br/notas", href: "https://portal.uln.edu.br/notas" },
      sign: "Secretaria Acadêmica",
      signals: ["urg"],
      notes: {
        dom: "O remetente usa @uln.edu.br, o domínio oficial.",
        link: "O destino real é o mesmo que aparece: portal.uln.edu.br.",
        urg: "Há um prazo curto, mas ele faz parte do calendário acadêmico e o e-mail não pede nada além de usar o sistema oficial.",
        cred: "Não pede senha: indica o portal, onde o login acontece normalmente."
      },
      actions: {
        seguir: ["ok", "Remetente oficial, link que confere e um prazo que faz parte do calendário. A urgência sozinha não transforma um aviso em golpe."],
        canal: ["ok", "Também adequado: digitar portal.uln.edu.br no navegador é um hábito seguro e chega ao mesmo lugar."],
        abrir: ["part", "Aqui o destino confere, então não há risco. Mesmo assim, o hábito de digitar o endereço de sistemas que você já conhece é mais seguro."],
        reportar: ["part", "O único sinal presente é o prazo, e ele é legítimo. Reportar gera ruído para a equipe de segurança."],
        responder: ["part", "Não traz risco, porque o remetente é oficial, mas o e-mail não pedia resposta."]
      },
      lesson: "Urgência é um sinal, não um veredito. O que decide é o conjunto: remetente, destino do link e o que está sendo pedido."
    }
  ];

  App.data = {
    SCREENS: SCREENS,
    ENVIRONMENT: ENVIRONMENT,
    SIGNALS: SIGNALS,
    ACTIONS: ACTIONS,
    EMAILS: EMAILS
  };
})(window.App = window.App || {});
