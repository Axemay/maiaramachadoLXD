# Esse e-mail é confiável?

Simulador de triagem de e-mails suspeitos (cerca de 12 minutos). Abra `index.html` no navegador; não precisa de servidor.

## Estrutura

```text
phishing/
├── index.html          Estrutura da página
├── css/base.css        Identidade visual comum às peças do portfólio
├── css/peca.css        Estilos próprios (caixa de entrada, e-mail, análise)
├── data/content.js     E-mails, sinais, ações e feedbacks (fonte única do conteúdo)
├── js/core.js          Núcleo comum: armazenamento, componentes, navegação
├── js/inbox.js         Simulador: inspeção, registro da análise e avaliação
├── js/screens.js       Telas
└── js/app.js           Inicialização e eventos
```

## Avaliação

- Cada ação recebe feedback específico para aquele e-mail (adequada, com ressalvas, arriscada).
- Cada sinal de risco é comentado: identificado, não marcado ou marcado sem estar presente.
- Desempenho demonstrado: 4 de 5 ações adequadas e nenhuma ação arriscada diante de golpe.

Instituição, pessoas e domínios são fictícios. Os links do simulador nunca abrem.
