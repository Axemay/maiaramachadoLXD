/* Página do portfólio: monta os cards a partir de data/projetos.js, filtro por formato,
   atividade da seção "Experimente" e botão de copiar e-mail. */
const THUMBS={
  curso:`<div class="m"><div class="side"><i class="on"></i><i></i><i></i><i></i><i></i><i></i></div><div class="main"><div class="h"></div><div class="t"></div><div class="t" style="width:85%"></div><div class="bars"><i style="height:40%"></i><i style="height:38%"></i><i style="height:46%"></i><i style="height:45%"></i><i style="height:52%"></i><i style="height:46%"></i><i style="height:44%"></i><i style="height:48%"></i><i style="height:46%"></i><i style="height:50%"></i><i style="height:72%"></i><i style="height:70%"></i></div></div></div>`,
  livro:`<div class="book"><div class="pg cover"><i></i><i class="s"></i></div><div class="pg"><div class="h"></div><div class="t"></div><div class="t"></div><div class="t" style="width:80%"></div><div class="t"></div><div class="t" style="width:60%"></div></div></div>`,
  quiz:`<div class="quizm"><div class="h"></div><div class="o"></div><div class="o ok"></div><div class="o"></div><div class="o"></div></div>`,
  notas:`<div class="notes-m"><i></i><i></i><i></i><i></i></div>`,
  rede:`<div class="net-m"><i class="a"></i><i></i><i class="a"></i><i></i><i></i><i class="a"></i><b></b></div>`,
  story:`<div class="story"><div><b></b><i></i></div><div><b></b><i></i></div><div><b></b><i></i></div></div>`
};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const visiveis=PROJETOS.filter(p=>p.publicado||MOSTRAR_EM_PRODUCAO);
const list=document.getElementById("projList");
list.classList.toggle("single",visiveis.length===1);
list.innerHTML=visiveis.map((p,i)=>`
  <article class="proj" data-tipo="${esc(p.tipo)}" aria-labelledby="pt${i}">
    ${p.img?`<div class="thumb shot"><img src="${esc(p.img)}" alt="Tela do projeto ${esc(p.titulo)}" loading="lazy"></div>`:`<div class="thumb" aria-hidden="true">${THUMBS[p.thumb]||""}</div>`}
    <div class="proj-body">
      <div class="proj-top"><span class="fmt">${esc(p.formato)}</span>${p.publicado?(p.escopo?`<span class="scope">${esc(p.escopo)}</span>`:""):`<span class="badge">Em produção</span>`}</div>
      <h3 id="pt${i}">${esc(p.titulo)}</h3>
      <p class="desc">${esc(p.desc)}</p>
      <dl class="spec"><dt>Público</dt><dd>${esc(p.publico)}</dd><dt>Escopo</dt><dd>${esc(p.carga)}</dd></dl>
      <div class="chips" aria-label="Competências demonstradas">${p.demonstra.map(d=>`<span class="chip">${esc(d)}</span>`).join("")}</div>
      <div class="actions">${p.publicado?`<a class="btn pri" href="${esc(p.link)}" target="_blank" rel="noopener">Abrir projeto</a>${p.ficha?`<a class="btn" href="${esc(p.link+p.ficha)}" target="_blank" rel="noopener">Ver ficha de DI</a>`:""}${(p.extras||[]).map(x=>`<a class="btn" href="${esc(x.href)}" target="_blank" rel="noopener">${esc(x.rotulo)}</a>`).join("")}`:""}</div>
    </div>
  </article>`).join("");

/* Filtro: só aparece com 4+ projetos */
if(visiveis.length>=4){
  const tipos=[...new Set(visiveis.map(p=>p.tipo))];
  const f=document.getElementById("filters"); f.hidden=false;
  f.innerHTML=`<button type="button" aria-pressed="true" data-t="all">Todos</button>`+tipos.map(t=>`<button type="button" aria-pressed="false" data-t="${t}">${TIPOS[t]||t}</button>`).join("");
  f.addEventListener("click",e=>{
    const b=e.target.closest("button"); if(!b) return;
    f.querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed",String(x===b)));
    list.querySelectorAll(".proj").forEach(p=>p.hidden=b.dataset.t!=="all"&&p.dataset.tipo!==b.dataset.t);
  });
}

/* Laboratório */
const FB=[
  {ok:false,t:"Esse é o erro mais comum.",d:"A projeção linear trata todos os meses como iguais. Como o segundo semestre pesa mais, ela subestima o resultado e pode levar a medidas desnecessárias."},
  {ok:true,t:"Exatamente.",d:"Ajustada à sazonalidade, a projeção é 19.800 ÷ 46% ≈ 43.000 entregas, cerca de 98% da meta. O farol é amarelo, não vermelho: pede reforço nas ações, não alarme."},
  {ok:false,t:"Esperar é arriscado.",d:"Mesmo com o segundo semestre mais forte, a projeção ajustada fica abaixo de 100%. Sem ação agora, a meta provavelmente não será atingida, e em novembro já não há tempo para corrigir."}
];
const choices=document.querySelectorAll(".choice"), fb=document.getElementById("fb"), rs=document.getElementById("labReset");
choices.forEach(b=>b.addEventListener("click",()=>{
  const a=FB[+b.dataset.a];
  choices.forEach(x=>{x.setAttribute("aria-pressed",String(x===b));x.classList.remove("right","wrong");});
  b.classList.add(a.ok?"right":"wrong");
  fb.hidden=false; fb.innerHTML=`<b>${a.t}</b>${a.d}`; rs.hidden=false;
}));
rs.addEventListener("click",()=>{choices.forEach(x=>{x.setAttribute("aria-pressed","false");x.classList.remove("right","wrong");});fb.hidden=true;rs.hidden=true;choices[0].focus();});

/* Contato: copiar e-mail */
const copyBtn=document.getElementById("copyEmail"), copyMsg=document.getElementById("copyMsg");
copyBtn.addEventListener("click",()=>{
  const email=document.getElementById("email").textContent;
  const fallback=()=>{const r=document.createRange();r.selectNodeContents(document.getElementById("email"));const sel=getSelection();sel.removeAllRanges();sel.addRange(r);copyMsg.textContent="E-mail selecionado. Use Ctrl+C para copiar.";};
  try{navigator.clipboard.writeText(email).then(()=>{copyMsg.textContent="E-mail copiado.";},fallback);}catch(e){fallback();}
});
