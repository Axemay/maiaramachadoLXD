/* ===== Edite aqui: dados dos projetos =====
   publicado: true  -> aparece com o botão "Abrir projeto"
   publicado: false -> fica oculto (ou aparece como "Em produção" se MOSTRAR_EM_PRODUCAO = true)
   O filtro por formato aparece sozinho quando houver 4 ou mais projetos visíveis. */
const MOSTRAR_EM_PRODUCAO = false;
const PROJETOS = [
  { titulo:"Design Thinking: da compreensão do problema à construção de soluções", formato:"Curso autoinstrucional · HTML + apostila PDF", tipo:"curso", thumb:"notas", escopo:"Amostra · módulo 1 de 6", publicado:true, link:"design-thinking/index.html", img:"assets/thumbs/dt.jpg", ficha:"#ficha",
    extras:[{rotulo:"Apostila (PDF)", href:"design-thinking/assets/apostila-design-thinking-m1.pdf"}],
    desc:"Módulo 1 de um curso de seis, entregue completo: caso integrador, quatro microunidades com checagem imediata, simulador de decisão com seis cenários e flashcards situacionais. Acompanha apostila diagramada de 19 páginas com exercícios e gabarito.",
    publico:"Profissionais de gestão, processos, inovação e atendimento", carga:"Módulo 1 · cerca de 40 min + apostila de 19 páginas",
    demonstra:["Objetivo de nível Avaliar (Bloom)","Caso integrador","Simulador de decisão","Flashcards","Apostila diagramada","Acessibilidade"] },
  { titulo:"Metas que Movem Resultados", formato:"Curso autoinstrucional · HTML", tipo:"curso", thumb:"curso", escopo:"Minicurso completo", publicado:true, link:"metas/index.html", img:"assets/thumbs/metas.jpg", ficha:"#sobre",
    desc:"Minicurso para gestores sobre desdobramento de metas, mensalização, causa raiz, plano de ação e projeção de resultado, construído em torno de um caso fictício que atravessa todos os módulos.",
    publico:"Gestores e líderes de equipe", carga:"1h30 · 6 módulos e avaliação final",
    demonstra:["Design instrucional","Aprendizagem baseada em caso","7 interações","Avaliação formativa","HTML/CSS/JS","Acessibilidade"] },
  { titulo:"Introdução a Redes de Computadores", formato:"E-book diagramado · PDF", tipo:"editoracao", thumb:"livro", publicado:false, link:"redes/index.html",
    desc:"Apostila introdutória com capa, sumário, divisores de módulo e boxes didáticos, a partir de conteúdo técnico bruto.",
    publico:"Iniciantes em TI", carga:"3 capítulos",
    demonstra:["Transposição didática","Diagramação","Identidade visual"] },
  { titulo:"Esse e-mail é confiável?", formato:"Objeto interativo · HTML", tipo:"objeto", thumb:"quiz", escopo:"Objeto avulso", publicado:true, link:"phishing/index.html", img:"assets/thumbs/phishing.jpg", ficha:"#ficha",
    desc:"Simulador de triagem: o participante inspeciona remetente e link de cinco e-mails de uma universidade fictícia, aponta os sinais de risco e decide o que fazer. Três golpes de tipos diferentes e duas mensagens legítimas, uma delas com urgência, para evitar o viés de que tudo é golpe.",
    publico:"Servidores, docentes e colaboradores de instituições de ensino", carga:"Cerca de 12 min",
    demonstra:["Simulação com inspeção de evidências","Feedback por ação e por sinal","Segurança da informação","Acessibilidade"] },
  { titulo:"Do endereço à página", formato:"Objeto explicativo · HTML", tipo:"objeto", thumb:"rede", escopo:"Objeto avulso", publicado:true, link:"dns/index.html", img:"assets/thumbs/dns.jpg", ficha:"#ficha",
    desc:"O que acontece entre digitar um endereço e ver a página: sete passos com diagrama de rede gerado por código, ordenação das etapas e diagnóstico de quatro problemas reais de acesso a partir do sintoma.",
    publico:"Iniciantes em TI e profissionais que lidam com sistemas web", carga:"Cerca de 10 min",
    demonstra:["Transposição didática de conteúdo técnico","Diagrama interativo","Ordenação acessível","Diagnóstico"] },
  { titulo:"Storyboard: videoaula sobre senhas seguras", formato:"Roteiro e storyboard · PDF", tipo:"roteiro", thumb:"story", publicado:false, link:"storyboard/index.html",
    desc:"Roteiro de videoaula com storyboard quadro a quadro, narração e indicações de animação.",
    publico:"Usuários de TI em geral", carga:"Vídeo de 4 min",
    demonstra:["Roteirização","Storyboard","Linguagem audiovisual"] }
];
const TIPOS={curso:"Cursos",editoracao:"Editoração",objeto:"Objetos interativos",roteiro:"Roteiros"};
/* ========================================== */
