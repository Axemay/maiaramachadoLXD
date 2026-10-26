/* Conteúdo do explicativo "O que acontece quando você digita um endereço".
   O IP 203.0.113.25 pertence a uma faixa reservada para documentação (RFC 5737): não é um servidor real. */
(function (App) {
  "use strict";

  var SCREENS = [
    { id: "inicio", title: "Início", grp: null },
    { id: "jornada", title: "A jornada de um endereço", grp: "Explorar" },
    { id: "ordenar", title: "Coloque em ordem", grp: "Praticar" },
    { id: "diagnostico", title: "Onde está o problema?", grp: "Praticar" },
    { id: "fim", title: "Síntese", grp: "Fechamento" },
    { id: "ficha", title: "Ficha técnica da peça", grp: "Sobre" }
  ];

  /* Nós do diagrama (coordenadas no viewBox 720 × 330) */
  var NODES = {
    nav:  { x: 95,  y: 165, label: ["Seu", "navegador"] },
    res:  { x: 340, y: 80,  label: ["Resolvedor", "DNS"] },
    root: { x: 610, y: 45,  label: ["Servidores", "raiz"] },
    br:   { x: 610, y: 145, label: ["Servidores", "do .br"] },
    auth: { x: 610, y: 245, label: ["Servidor do", "uln.edu.br"] },
    web:  { x: 340, y: 270, label: ["Servidor web", "www.uln.edu.br"] }
  };

  var STEPS = [
    {
      title: "Você digita o endereço",
      nodes: ["nav"], arrows: [],
      text: "Você digita www.uln.edu.br e pressiona Enter. O navegador separa duas informações: o protocolo (https, conexão segura) e o nome do site. Só que computadores se encontram por números, os endereços IP. O nome precisa ser traduzido.",
      detail: "Protocolo: https · Nome: www.uln.edu.br"
    },
    {
      title: "O navegador procura na memória",
      nodes: ["nav"], arrows: [],
      text: "Antes de perguntar a alguém, o navegador e o sistema operacional conferem se já sabem o IP desse nome, porque o site foi visitado há pouco. Se sabem, pulam direto para a conexão, no passo 6.",
      why: "Por isso, quando um site muda de servidor, alguns usuários continuam chegando ao endereço antigo por um tempo: a resposta antiga ainda está guardada."
    },
    {
      title: "Pergunta ao resolvedor DNS",
      nodes: ["nav", "res"], arrows: [["nav", "res", "IP de www.uln.edu.br?"]],
      text: "Se não sabe, o computador pergunta ao resolvedor DNS configurado na rede, normalmente um servidor da própria instituição ou do provedor de internet. Ele faz a busca em nome do computador e também guarda as respostas recentes."
    },
    {
      title: "Raiz e .br indicam o caminho",
      nodes: ["res", "root", "br"], arrows: [["res", "root", "quem responde por .br?"], ["res", "br", "e por uln.edu.br?"]],
      text: "Se o resolvedor não tem a resposta guardada, ele percorre a hierarquia de nomes. Os servidores raiz indicam quem responde pelo .br. Os servidores do .br, mantidos pelo Registro.br, indicam qual servidor responde pelo domínio uln.edu.br.",
      why: "Ninguém tem a lista completa da internet. Cada nível sabe apenas para quem encaminhar a pergunta."
    },
    {
      title: "O servidor do domínio responde",
      nodes: ["res", "auth", "nav"], arrows: [["res", "auth", "IP de www?"], ["res", "nav", "203.0.113.25"]],
      text: "O servidor autoritativo do domínio, mantido pela instituição ou por quem ela contrata, responde com o IP. O resolvedor repassa a resposta ao computador e a guarda pelo tempo indicado na própria resposta, o TTL.",
      detail: "www.uln.edu.br → 203.0.113.25 · TTL 3600 s (1 hora)"
    },
    {
      title: "Conexão segura com o servidor",
      nodes: ["nav", "web"], arrows: [["nav", "web", "TCP + TLS, porta 443"]],
      text: "Com o IP em mãos, o navegador abre uma conexão com o servidor web na porta 443 e negocia a criptografia (TLS). O servidor apresenta um certificado digital, e o navegador confere se ele é válido e se foi emitido para www.uln.edu.br. Se estiver tudo certo, aparece o cadeado.",
      why: "O cadeado garante que a conexão é cifrada e que você está no domínio que aparece na barra. Ele não garante que o site é honesto: uma página de golpe em um domínio parecido também pode ter cadeado."
    },
    {
      title: "Pedido e resposta da página",
      nodes: ["nav", "web"], arrows: [["nav", "web", "GET /"], ["web", "nav", "200 OK + HTML"]],
      text: "O navegador pede a página. O servidor responde com um código de status e o HTML. O navegador monta a página e faz novos pedidos para cada imagem, estilo e script, às vezes em outros domínios, com novas consultas DNS.",
      detail: "200 OK: tudo certo · 404: página não encontrada · 500: erro no servidor"
    }
  ];

  var ORDER_ITEMS = [
    { id: "o1", text: "O navegador confere se já sabe o IP do nome" },
    { id: "o2", text: "O computador pergunta ao resolvedor DNS" },
    { id: "o3", text: "Raiz e servidores do .br indicam quem responde pelo domínio" },
    { id: "o4", text: "O servidor do domínio informa o IP" },
    { id: "o5", text: "Navegador e servidor estabelecem a conexão segura" },
    { id: "o6", text: "O navegador pede a página e recebe o HTML" }
  ];
  var ORDER_START = ["o4", "o1", "o6", "o3", "o5", "o2"];

  var LAYERS = [
    ["dns", "Tradução do nome (DNS)"],
    ["cache", "Resposta antiga guardada (cache e TTL)"],
    ["tls", "Conexão segura (certificado)"],
    ["http", "Resposta do servidor web (HTTP)"]
  ];

  var DIAGNOSES = [
    {
      id: "q1",
      text: "Digitando o IP 203.0.113.25, o sistema abre. Pelo nome www.uln.edu.br, o navegador diz: “Não foi possível encontrar o endereço do servidor”.",
      ans: "dns",
      fb: {
        dns: "Se o IP funciona e o nome não, o servidor está de pé. O que falha é a tradução do nome em número: o DNS.",
        cache: "Uma resposta antiga guardada levaria a um servidor antigo, mas levaria a algum lugar. Aqui o nome não é encontrado.",
        tls: "Problemas de certificado só aparecem depois que o navegador já encontrou o servidor. Aqui ele nem sabe para onde ir.",
        http: "Para haver resposta do servidor web, o navegador precisa chegar até ele. Pelo nome, ele não chega."
      }
    },
    {
      id: "q2",
      text: "Ao abrir o portal, o navegador mostra um alerta em tela inteira: “Sua conexão não é particular”.",
      ans: "tls",
      fb: {
        tls: "Esse alerta aparece quando o certificado não é válido, venceu ou não corresponde ao nome do site. É a verificação do passo 6 funcionando.",
        dns: "O DNS funcionou: o navegador encontrou um servidor e tentou se conectar. O problema surgiu na verificação do certificado.",
        cache: "O alerta é sobre a identidade do servidor na conexão segura, não sobre qual endereço foi usado.",
        http: "A página nem foi pedida: o navegador interrompe antes, na negociação da conexão segura."
      }
    },
    {
      id: "q3",
      text: "O portal mudou para um servidor novo há 20 minutos. No seu computador já aparece a versão nova. No do colega ao lado, ainda aparece a antiga.",
      ans: "cache",
      fb: {
        cache: "O computador do colega ainda guarda a resposta antiga do DNS, válida até o fim do TTL. Com o tempo (ou limpando o cache), ele passa a usar o IP novo.",
        dns: "O DNS está funcionando: os dois encontram um servidor. A diferença é que um deles usa uma resposta guardada antes da mudança.",
        tls: "Se fosse o certificado, haveria um alerta de segurança. Aqui as duas versões abrem normalmente.",
        http: "Os dois servidores respondem. A questão é qual deles cada computador encontra."
      }
    },
    {
      id: "q4",
      text: "O site abre, com o cabeçalho e o menu, mas no lugar do conteúdo aparece “Erro 404”.",
      ans: "http",
      fb: {
        http: "O caminho todo funcionou: nome traduzido, conexão segura, pedido entregue. O servidor respondeu que aquela página não existe (404). O problema está no endereço da página ou no próprio site.",
        dns: "Se o DNS falhasse, nada do site apareceria. O cabeçalho e o menu mostram que o servidor foi encontrado.",
        cache: "Uma resposta antiga levaria a um servidor antigo, mas o código 404 é a resposta do servidor sobre aquela página específica.",
        tls: "A conexão segura foi estabelecida: o site carregou. O 404 vem depois, na resposta ao pedido."
      }
    }
  ];

  App.data = {
    SCREENS: SCREENS, NODES: NODES, STEPS: STEPS,
    ORDER_ITEMS: ORDER_ITEMS, ORDER_START: ORDER_START,
    LAYERS: LAYERS, DIAGNOSES: DIAGNOSES
  };
})(window.App = window.App || {});
