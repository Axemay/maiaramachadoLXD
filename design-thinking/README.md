# Design Thinking · Módulo 1

Amostra de portfólio de Maiara Machado (Design Educacional): o primeiro módulo de um curso autoinstrucional de seis, com caso integrador, checagens comentadas, simulador de decisão, flashcards e apostila em PDF.

## Como abrir

Abra `index.html` em um navegador atualizado (Chrome, Edge, Firefox ou Safari). Não é preciso servidor nem instalação: os scripts são clássicos, sem módulos ES, e funcionam direto do arquivo.

As fontes vêm do Google Fonts. Sem internet, o navegador usa as fontes do sistema e o curso continua funcionando.

## Estrutura

```text
design-thinking-m1/
├── index.html            Estrutura da página (menu, área de conteúdo, carregamento dos scripts)
├── css/
│   └── styles.css        Tokens de cor e tipografia, layout, componentes, responsivo
├── data/
│   └── content.js        Conteúdo e base de cenários (fonte única para o módulo e a apostila)
├── js/
│   ├── storage.js        Progresso no navegador (localStorage) e estado
│   ├── ui.js             Componentes reutilizáveis: faixas, feedback, instrução "O que fazer", paginação
│   ├── assessment.js     Regras de avaliação: progresso, pontuação, três status, exportação JSON
│   ├── activities.js     Objetos interativos: abertura, checagens, simulador, flashcards
│   ├── screens.js        Telas do módulo, montadas como faixas de conteúdo
│   ├── navigation.js     Sumário, barra de progresso, troca de telas e foco
│   └── app.js            Inicialização e tratamento de eventos
└── assets/
    └── apostila-design-thinking-m1.pdf
```

A ordem dos scripts em `index.html` importa: cada arquivo usa o que os anteriores registraram no objeto global `DT`.

## Como editar o conteúdo

- **Textos, cenários, alternativas e feedbacks:** `data/content.js`. Cada cenário do simulador traz a abordagem adequada (`correct`), o feedback de cada abordagem (`afb`) e os dados do cenário com o feedback de cada um (`ev`).
- **Textos das unidades:** `js/screens.js`.
- **Cores e tipografia:** bloco `:root` no início de `css/styles.css`.

A apostila em PDF é gerada a partir de `data/content.js`. Quando o conteúdo mudar, gere o PDF de novo para que os dois continuem iguais.

## Avaliação

| Status | Critério | Tipo |
|---|---|---|
| Participação | Todas as telas de conteúdo e prática visitadas | Automático |
| Conclusão | Abertura, 4 checagens, 6 cenários e 6 flashcards respondidos | Automático |
| Desempenho demonstrado | 9 ou mais pontos de 12 no simulador | Automático |

A autoavaliação dos flashcards fica registrada, mas não entra no status de desempenho.

## Limitações

- O progresso fica salvo só no navegador usado. Para enviar resultados a um ambiente virtual de aprendizagem, o módulo precisaria ser empacotado em SCORM ou xAPI.
- A acessibilidade segue a WCAG 2.2 AA como referência, mas ainda não foi auditada com leitores de tela.
- Os módulos 2 a 6 estão planejados, não implementados.
