# Do endereço à página

Objeto explicativo sobre o que acontece entre digitar um endereço e ver a página (cerca de 10 minutos). Abra `index.html` no navegador; não precisa de servidor.

## Estrutura

```text
dns/
├── index.html          Estrutura da página
├── css/base.css        Identidade visual comum às peças do portfólio
├── css/peca.css        Estilos próprios (diagrama, passos, ordenação)
├── data/content.js     Passos, nós do diagrama, etapas e situações de diagnóstico
├── js/core.js          Núcleo comum: armazenamento, componentes, navegação
├── js/activities.js    Diagrama em SVG, ordenação acessível e diagnóstico
├── js/screens.js       Telas
└── js/app.js           Inicialização e eventos
```

## Notas técnicas

- O diagrama é gerado a partir de `data/content.js`; mudar um passo ali muda o diagrama.
- A ordenação usa botões ↑ ↓ (alternativa acessível ao arrastar).
- O IP 203.0.113.25 é de uma faixa reservada para documentação (RFC 5737).
