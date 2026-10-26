/* Interações do curso Metas que Movem Resultados: navegação, simuladores, gráficos e avaliação. */
(function(){
  const VIEWS=[
    {id:"inicio",t:"Boas-vindas",s:"Objetivos e caso"},
    {id:"m1",t:"Anatomia de uma meta",s:"Módulo 1 · 10 min"},
    {id:"m2",t:"Desdobramento",s:"Módulo 2 · 20 min"},
    {id:"m3",t:"Faixas e mensalização",s:"Módulo 3 · 15 min"},
    {id:"m4",t:"Análise de causa raiz",s:"Módulo 4 · 15 min"},
    {id:"m5",t:"Plano de ação 5W2H",s:"Módulo 5 · 15 min"},
    {id:"m6",t:"Acompanhamento e projeção",s:"Módulo 6 · 15 min"},
    {id:"avaliacao",t:"Avaliação final",s:"6 questões"}
  ];
  const fmt=n=>Math.round(n).toLocaleString("pt-BR");
  const pct=(n,d=1)=>n.toLocaleString("pt-BR",{minimumFractionDigits:d,maximumFractionDigits:d})+"%";
  const css=v=>getComputedStyle(document.documentElement).getPropertyValue(v).trim();

  /* ---------- Navegação e progresso ---------- */
  const navList=document.getElementById("navList");
  navList.innerHTML=VIEWS.map(v=>`<li><a href="#${v.id}" data-view="${v.id}"><span class="st" aria-hidden="true"></span><span>${v.t}<small>${v.s}</small></span></a></li>`).join("");
  let visited=new Set();
  try{ visited=new Set(JSON.parse(localStorage.getItem("mmr-visited")||"[]")); }catch(e){}
  function saveVisited(){ try{ localStorage.setItem("mmr-visited",JSON.stringify([...visited])); }catch(e){} }
  function updateProgress(){
    const n=VIEWS.filter(v=>visited.has(v.id)).length;
    document.getElementById("progTxt").textContent=`${n} de ${VIEWS.length} etapas`;
    const p=Math.round(n/VIEWS.length*100);
    const bar=document.getElementById("progBar"); bar.setAttribute("aria-valuenow",p); bar.firstElementChild.style.width=p+"%";
    document.querySelectorAll("nav.trilha a").forEach(a=>a.classList.toggle("done",visited.has(a.dataset.view)&&a.dataset.view!=="sobre"));
  }
  const valid=["inicio","m1","m2","m3","m4","m5","m6","avaliacao","sobre"];
  function show(id,focus){
    if(!valid.includes(id)) id="inicio";
    document.querySelectorAll("section.mod").forEach(s=>s.hidden=s.dataset.view!==id);
    document.querySelectorAll("nav.trilha a").forEach(a=>{ if(a.dataset.view===id) a.setAttribute("aria-current","page"); else a.removeAttribute("aria-current"); });
    visited.add(id); saveVisited(); updateProgress();
    if(id==="m2") drawPareto();
    if(id==="m3") renderMens();
    document.getElementById("trilha").classList.remove("open");
    document.getElementById("menuBtn").setAttribute("aria-expanded","false");
    if(focus){ window.scrollTo({top:0}); const h=document.querySelector(`section[data-view="${id}"] h1, section[data-view="${id}"] h2`); if(h){h.setAttribute("tabindex","-1"); h.focus({preventScroll:true});} }
  }
  window.addEventListener("hashchange",()=>show(location.hash.slice(1),true));
  document.getElementById("menuBtn").addEventListener("click",e=>{
    const t=document.getElementById("trilha"); const o=t.classList.toggle("open"); e.currentTarget.setAttribute("aria-expanded",String(o));
  });

  /* ---------- M1: classificador ---------- */
  const STMTS=[
    {q:"Aumentar as vendas da filial.",ok:false,fb:"Incompleta. Tem o objetivo gerencial, mas falta o valor (de quanto para quanto) e o prazo. Ninguém consegue dizer se foi atingida."},
    {q:"Reduzir o tempo médio de atendimento de 12 para 8 minutos até junho de 2027.",ok:true,fb:"Completa. Objetivo (reduzir o tempo médio de atendimento), valor (de 12 para 8 minutos) e prazo (até junho de 2027)."},
    {q:"Atingir NPS 70.",ok:false,fb:"Incompleta. Tem um valor de chegada, mas não tem prazo nem ponto de partida. Sem prazo, não é possível acompanhar o ritmo."},
    {q:"Reduzir em 30% os chamados reabertos até dezembro de 2027.",ok:true,fb:"Completa. Um ajuste recomendado: registrar a base de referência (por exemplo, a média de 2026), para que os 30% sejam calculados sobre um número conhecido."}
  ];
  document.getElementById("classif").innerHTML=STMTS.map((s,i)=>`
    <div class="stmt"><q>${s.q}</q>
      <div class="choices" role="group" aria-label="Classificar a meta ${i+1}">
        <button type="button" class="btn" data-i="${i}" data-a="1">Completa</button>
        <button type="button" class="btn" data-i="${i}" data-a="0">Incompleta</button>
      </div><div aria-live="polite" id="cfb${i}"></div></div>`).join("");
  document.getElementById("classif").addEventListener("click",e=>{
    const b=e.target.closest("button[data-i]"); if(!b) return;
    const s=STMTS[b.dataset.i]; const right=(b.dataset.a==="1")===s.ok;
    b.parentElement.querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed",String(x===b)));
    document.getElementById("cfb"+b.dataset.i).innerHTML=`<div class="fb ${right?"ok":"no"}"><b>${right?"Correto.":"Não exatamente."}</b> ${s.fb}</div>`;
  });

  /* ---------- M2: Pareto ---------- */
  const CAUSES=[["Roteirização",1680],["Endereço incorreto",1250],["Falta de veículo",820],["Separação no CD",560],["Clima e trânsito",300],["Outros",190]];
  function drawPareto(){
    const svg=document.getElementById("pareto"); const W=640,H=320,L=48,R=48,T=16,B=64;
    const total=CAUSES.reduce((a,c)=>a+c[1],0), max=2000, bw=(W-L-R)/CAUSES.length;
    const ink=css("--ink"),mut=css("--muted"),line=css("--line"),acc=css("--accent"),sig=css("--signal");
    const y=v=>T+(H-T-B)*(1-v/max), y2=p=>T+(H-T-B)*(1-p/100);
    let g=`<title id="paretoT">Gráfico de Pareto dos atrasos da Lumen em 2026</title><desc id="paretoD">Roteirização 1.680, endereço incorreto 1.250, falta de veículo 820, separação no centro de distribuição 560, clima e trânsito 300, outros 190. As duas primeiras causas somam 61% dos atrasos.</desc>`;
    [0,500,1000,1500,2000].forEach(v=>{ g+=`<line x1="${L}" x2="${W-R}" y1="${y(v)}" y2="${y(v)}" stroke="${line}" stroke-width="1"/><text x="${L-8}" y="${y(v)+4}" text-anchor="end" font-size="11" fill="${mut}" font-family="IBM Plex Mono, monospace">${fmt(v)}</text>`; });
    [0,50,100].forEach(p=>{ g+=`<text x="${W-R+8}" y="${y2(p)+4}" font-size="11" fill="${sig}" font-family="IBM Plex Mono, monospace">${p}%</text>`; });
    let acum=0, pts=[];
    CAUSES.forEach((c,i)=>{
      const x=L+i*bw+bw*.16, w=bw*.68; acum+=c[1]; const p=acum/total*100;
      g+=`<rect x="${x}" y="${y(c[1])}" width="${w}" height="${y(0)-y(c[1])}" rx="3" fill="${acc}" opacity="${i<2?1:.55}"/>`;
      const inside=c[1]>400; g+=`<text x="${x+w/2}" y="${inside?y(0)-10:y(c[1])-6}" text-anchor="middle" font-size="11" fill="${inside?"#FFFFFF":ink}" font-family="IBM Plex Mono, monospace">${fmt(c[1])}</text>`;
      const lbl=c[0].split(" "); g+=`<text x="${x+w/2}" y="${H-B+18}" text-anchor="middle" font-size="11" fill="${mut}">${lbl[0]}</text>`;
      if(lbl[1]) g+=`<text x="${x+w/2}" y="${H-B+32}" text-anchor="middle" font-size="11" fill="${mut}">${lbl.slice(1).join(" ")}</text>`;
      pts.push([x+w/2,y2(p),p]);
    });
    g+=`<polyline points="${pts.map(p=>p[0]+","+p[1]).join(" ")}" fill="none" stroke="${sig}" stroke-width="2.5"/>`;
    pts.forEach(p=>{ g+=`<circle cx="${p[0]}" cy="${p[1]}" r="4" fill="${sig}"/>`; });
    pts.slice(0,3).forEach(p=>{ g+=`<text x="${p[0]-10}" y="${p[1]-10}" text-anchor="end" font-size="11" font-weight="700" fill="${sig}" stroke="#FFFFFF" stroke-width="4" paint-order="stroke" font-family="IBM Plex Mono, monospace">${Math.round(p[2])}%</text>`; });
    svg.innerHTML=g;
  }

  /* ---------- M2: simulador de desdobramento ---------- */
  const SIM=[{k:"rot",n:"Roteirização",base:1680,v:65},{k:"end",n:"Endereço incorreto",base:1250,v:60},{k:"fro",n:"Falta de veículo",base:820,v:50},{k:"cd",n:"Separação no CD",base:560,v:30}];
  document.getElementById("simRows").innerHTML=SIM.map(s=>`
    <div class="sim-row"><label for="s-${s.k}">${s.n}<br><span class="hint mono">${fmt(s.base)} atrasos</span></label>
    <input type="range" id="s-${s.k}" min="0" max="90" step="5" value="${s.v}"><output for="s-${s.k}" id="o-${s.k}">−${s.v}%</output></div>`).join("");
  function sim(){
    let elim=0;
    SIM.forEach(s=>{ s.v=+document.getElementById("s-"+s.k).value; document.getElementById("o-"+s.k).textContent="−"+s.v+"%"; document.getElementById("t-"+s.k).textContent="−"+s.v+"%"; elim+=s.base*s.v/100; });
    const atrasos=4800-elim, rate=(40000-atrasos)/40000*100;
    document.getElementById("simRate").textContent=pct(rate);
    const pill=document.getElementById("simPill"), gap=document.getElementById("simGap");
    if(rate>=94){ pill.className="pill ok"; pill.textContent="Desdobramento suficiente"; gap.textContent=`Elimina ${fmt(elim)} atrasos, ${fmt(elim-2400)} acima do necessário.`; }
    else{ pill.className="pill bad"; pill.textContent="Desdobramento insuficiente"; gap.textContent=`Faltam ${fmt(2400-elim)} atrasos para fechar a conta.`; }
  }
  document.getElementById("simRows").addEventListener("input",sim); sim();

  /* ---------- M3: mensalização ---------- */
  const MESES=["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
  const PESO=[7.0,6.8,7.9,7.8,8.6,7.9,7.6,8.0,7.8,8.4,11.2,11.0];
  let modo="saz";
  function pesos(){ return modo==="saz"?PESO:MESES.map(()=>100/12); }
  function renderMens(){
    const A=Math.max(0,+document.getElementById("mAnual").value||0), G=(+document.getElementById("mGat").value||90)/100, S=(+document.getElementById("mSup").value||110)/100;
    const p=pesos(), vals=p.map(x=>A*x/100);
    document.querySelector("#mensTbl tbody").innerHTML=MESES.map((m,i)=>`<tr><td>${m}</td><td class="num">${pct(p[i])}</td><td class="num">${fmt(vals[i]*G)}</td><td class="num"><b>${fmt(vals[i])}</b></td><td class="num">${fmt(vals[i]*S)}</td></tr>`).join("")+
      `<tr><td><b>Total</b></td><td class="num">100,0%</td><td class="num">${fmt(A*G)}</td><td class="num"><b>${fmt(A)}</b></td><td class="num">${fmt(A*S)}</td></tr>`;
    const svg=document.getElementById("mensChart"), W=640,H=240,L=52,R=12,T=14,B=28;
    const mx=Math.max(...vals.map(v=>v*S))*1.08||1, bw=(W-L-R)/12;
    const mut=css("--muted"),line=css("--line"),acc=css("--accent"),sig=css("--signal"),ink=css("--ink");
    const y=v=>T+(H-T-B)*(1-v/mx);
    const step=Math.pow(10,Math.floor(Math.log10(mx/4||1))); const nice=Math.ceil(mx/4/step)*step;
    let g="";
    for(let v=0;v<=mx;v+=nice){ g+=`<line x1="${L}" x2="${W-R}" y1="${y(v)}" y2="${y(v)}" stroke="${line}"/><text x="${L-8}" y="${y(v)+4}" text-anchor="end" font-size="11" fill="${mut}" font-family="IBM Plex Mono, monospace">${fmt(v)}</text>`; }
    vals.forEach((v,i)=>{
      const x=L+i*bw+bw*.18,w=bw*.64;
      g+=`<rect x="${x}" y="${y(v)}" width="${w}" height="${y(0)-y(v)}" rx="3" fill="${acc}"/>`;
      g+=`<line x1="${x-2}" x2="${x+w+2}" y1="${y(v*G)}" y2="${y(v*G)}" stroke="${ink}" stroke-width="1.5" stroke-dasharray="3 2"/>`;
      g+=`<line x1="${x-2}" x2="${x+w+2}" y1="${y(v*S)}" y2="${y(v*S)}" stroke="${sig}" stroke-width="2"/>`;
      g+=`<text x="${x+w/2}" y="${H-8}" text-anchor="middle" font-size="11" fill="${mut}">${MESES[i]}</text>`;
    });
    svg.innerHTML=g;
    svg.setAttribute("aria-label",`Meta mensal de entregas, distribuição ${modo==="saz"?"sazonal":"linear"}. Maior mês: ${MESES[vals.indexOf(Math.max(...vals))]} com ${fmt(Math.max(...vals))}.`);
  }
  if(!document.getElementById("mensLeg")){
    const leg=document.createElement("div"); leg.className="legend"; leg.id="mensLeg";
    leg.innerHTML=`<span><i style="background:var(--accent)"></i>Alvo</span><span><i style="background:var(--ink);height:2px;vertical-align:3px"></i>Gatilho</span><span><i style="background:var(--signal);height:3px;vertical-align:3px"></i>Superação</span>`;
    document.getElementById("mensChart").after(leg);
  }
  ["mAnual","mGat","mSup"].forEach(id=>document.getElementById(id).addEventListener("input",renderMens));
  document.getElementById("dSaz").addEventListener("click",()=>{modo="saz";document.getElementById("dSaz").setAttribute("aria-pressed","true");document.getElementById("dLin").setAttribute("aria-pressed","false");renderMens();});
  document.getElementById("dLin").addEventListener("click",()=>{modo="lin";document.getElementById("dLin").setAttribute("aria-pressed","true");document.getElementById("dSaz").setAttribute("aria-pressed","false");renderMens();});

  /* ---------- M4: Ishikawa ---------- */
  const SIXM={
    "Método":["Roteiros montados uma vez por semana, sem ajuste diário","Janela de entrega do cliente não é considerada no roteiro"],
    "Máquina":["Sistema de roteirização usa tempo de parada fixo de 5 min","Mapas do sistema desatualizados em bairros novos"],
    "Mão de obra":["Planejadores sem treinamento no sistema atual","Motoristas novos sem conhecimento da região"],
    "Material":["Cadastro de clientes sem horário de recebimento","Pedidos chegam ao planejamento sem volume e peso"],
    "Meio ambiente":["Restrições de circulação de caminhões no centro","Obras viárias não comunicadas ao planejamento"],
    "Medida":["O atraso é medido só no fim do mês","Não existe indicador de aderência ao roteiro"]
  };
  const sixm=document.getElementById("sixm");
  sixm.innerHTML=Object.keys(SIXM).map(k=>`<button type="button" aria-pressed="false" data-k="${k}">${k}</button>`).join("");
  sixm.addEventListener("click",e=>{
    const b=e.target.closest("button"); if(!b) return;
    sixm.querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed",String(x===b)));
    document.getElementById("sixmOut").innerHTML=`<p><b>${b.dataset.k}:</b> causas levantadas pela equipe</p><ul class="clean">${SIXM[b.dataset.k].map(c=>`<li>${c}</li>`).join("")}</ul>`;
  });
  sixm.querySelector("button").click();

  /* ---------- M4: 5 porquês ---------- */
  const WHY=[
    ["Problema","35% dos atrasos da Lumen vêm de roteirização."],
    ["Por quê 1","As rotas são planejadas com mais paradas do que cabem na janela de entrega."],
    ["Por quê 2","O sistema calcula cada parada com 5 minutos, mas a média real é de 9 minutos."],
    ["Por quê 3","O parâmetro de tempo de parada foi configurado na implantação, em 2021, e nunca foi revisado."],
    ["Por quê 4","Não existe rotina de revisão dos parâmetros nem um responsável por eles."],
    ["Causa raiz","Ausência de padrão e de responsável pela manutenção dos parâmetros do sistema de roteirização. Ação derivada: definir um dono e revisar os parâmetros a cada trimestre com dados reais de campo."]
  ];
  let wi=1;
  function renderWhy(){
    document.getElementById("whyList").innerHTML=WHY.slice(0,wi).map((w,i)=>`<li class="${i===WHY.length-1?"root":""}"><b>${w[0]}</b><span>${w[1]}</span></li>`).join("");
    const nb=document.getElementById("whyNext"); nb.disabled=wi>=WHY.length; nb.textContent=wi>=WHY.length-1?"Revelar causa raiz":"Perguntar “por quê?”";
  }
  document.getElementById("whyNext").addEventListener("click",()=>{ if(wi<WHY.length){wi++;renderWhy();} });
  document.getElementById("whyReset").addEventListener("click",()=>{wi=1;renderWhy();});
  renderWhy();

  /* ---------- M5: 5W2H ---------- */
  const PLAN=[
    {what:"Revisar o tempo de parada no sistema de roteirização",why:"Causa raiz: parâmetro de 5 min contra 9 min reais",where:"Planejamento de Rotas",who:"Carlos Teixeira",when:"2027-02-28",how:"Medir paradas reais por 4 semanas e atualizar o parâmetro por tipo de cliente",much:"R$ 0"},
    {what:"Definir responsável e rotina trimestral de revisão de parâmetros",why:"Evitar que o parâmetro fique desatualizado de novo",where:"Planejamento de Rotas",who:"Carlos Teixeira",when:"2027-03-15",how:"Criar procedimento padrão e incluir na reunião de resultados do trimestre",much:"R$ 0"}
  ];
  function dBR(s){ if(!s) return "–"; const [y,m,d]=s.split("-"); return `${d}/${m}/${y}`; }
  const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  function renderPlan(){ document.querySelector("#planTbl tbody").innerHTML=PLAN.map(r=>`<tr><td>${esc(r.what)}</td><td>${esc(r.why)}</td><td>${esc(r.where)}</td><td>${esc(r.who)}</td><td class="mono">${dBR(r.when)}</td><td>${esc(r.how)}</td><td class="num">${esc(r.much||"–")}</td></tr>`).join(""); }
  renderPlan();
  document.getElementById("w2h").addEventListener("submit",e=>{
    e.preventDefault();
    const v=id=>document.getElementById(id).value.trim();
    const r={what:v("wWhat"),why:v("wWhy"),where:v("wWhere"),who:v("wWho"),when:v("wWhen"),how:v("wHow"),much:v("wMuch")};
    const issues=[];
    if(!r.what) issues.push("Preencha <b>O quê</b>.");
    else{ const w=r.what.split(/\s+/)[0].toLowerCase(); if(!/(ar|er|ir|or)$/.test(w)) issues.push(`<b>O quê</b> deve começar com verbo no infinitivo (implantar, revisar, criar). "${esc(r.what.split(/\s+/)[0])}" não parece ser um.`); }
    if(!r.why) issues.push("Preencha <b>Por quê</b>, ligando a ação a uma causa.");
    if(!r.who) issues.push("Indique <b>Quem</b> é responsável.");
    else if(/\b(equipe|time|todos|área|setor|gerência)\b|\/|\se\s/i.test(r.who)) issues.push("<b>Quem</b> deve ser uma única pessoa. Responsabilidade compartilhada costuma virar responsabilidade de ninguém.");
    if(!r.when) issues.push("Defina uma data em <b>Quando</b>.");
    if(!r.how) issues.push("Descreva <b>Como</b> a ação será executada.");
    const fb=document.getElementById("wFb");
    if(issues.length){ fb.innerHTML=`<div class="fb no"><b>Ajuste antes de adicionar:</b><ul class="clean" style="margin-top:6px">${issues.map(i=>`<li>${i}</li>`).join("")}</ul></div>`; return; }
    PLAN.push(r); renderPlan(); e.target.reset();
    fb.innerHTML=`<div class="fb ok"><b>Ação adicionada ao plano.</b> Ela tem dono, prazo e método, então pode ser acompanhada na reunião de resultados.</div>`;
  });

  /* ---------- M6: projeção ---------- */
  const pMes=document.getElementById("pMes");
  pMes.innerHTML=MESES.slice(0,11).map((m,i)=>`<option value="${i+1}"${i===5?" selected":""}>${m} (mês ${i+1})</option>`).join("");
  function farol(p){ return p>=100?["ok","Verde"]:p>=90?["warn","Amarelo"]:["bad","Vermelho"]; }
  function proj(){
    const M=+document.getElementById("pMeta").value||0, n=+pMes.value, R=+document.getElementById("pReal").value||0;
    const lin=R/n*12, share=PESO.slice(0,n).reduce((a,b)=>a+b,0)/100, saz=share?R/share:0;
    const pl=M?lin/M*100:0, ps=M?saz/M*100:0;
    document.getElementById("pLin").textContent=`${fmt(lin)} (${pct(pl)})`;
    document.getElementById("pSaz").textContent=`${fmt(saz)} (${pct(ps)})`;
    const [cl,tl]=farol(pl),[cs,ts]=farol(ps);
    const a=document.getElementById("pLinPill"); a.className="pill "+cl; a.textContent=tl;
    const b=document.getElementById("pSazPill"); b.className="pill "+cs; b.textContent=ts;
    const esperado=M*share, ritmo=(M-R)/(12-n);
    document.getElementById("pTxt").innerHTML=`Até ${MESES[n-1].toLowerCase()}, a sazonalidade previa <b class="mono">${fmt(esperado)}</b> entregas (${pct(share*100)} da meta). A Lumen realizou <b class="mono">${fmt(R)}</b>, ${R>=esperado?"acima":"abaixo"} do previsto em <b class="mono">${fmt(Math.abs(R-esperado))}</b>. Para fechar o ano no alvo, precisa de <b class="mono">${fmt(ritmo)}</b> entregas por mês até dezembro.`+(cl!==cs?` <b>Repare:</b> a projeção linear e a sazonal dão farol diferente. Ignorar a sazonalidade levaria a uma decisão errada.`:"");
  }
  ["pMeta","pReal"].forEach(id=>document.getElementById(id).addEventListener("input",proj)); pMes.addEventListener("change",proj); proj();

  /* ---------- Avaliação ---------- */
  const QZ=[
    {q:"Qual das opções é uma meta completa?",o:["Melhorar a satisfação dos clientes em 2027.","Aumentar a taxa de entregas no prazo de 88% para 94% até dezembro de 2027.","Atingir 94% de entregas no prazo.","Reduzir os atrasos o máximo possível."],c:1,e:["Falta valor: quanto melhorar, medido por qual indicador?","Tem objetivo gerencial, valor de partida e de chegada, e prazo.","Falta prazo e ponto de partida.","“O máximo possível” não é um valor. Não dá para saber se foi atingida."]},
    {q:"Por que estratificar o problema antes de desdobrar a meta?",o:["Para dividir a meta igualmente entre todas as áreas.","Para identificar os poucos fatores que explicam a maior parte do problema e colocar as metas onde está a alavanca.","Para aumentar o número de indicadores acompanhados.","Porque a estratificação substitui a análise de causa raiz."],c:1,e:["Divisão igual ignora onde o problema realmente está.","É o princípio de Pareto aplicado ao desdobramento.","Mais indicadores não significam melhor gestão.","A estratificação mostra onde está o problema. A análise de causa mostra por quê. Uma não substitui a outra."]},
    {q:"A meta anual é de 94% de entregas no prazo. Como mensalizá-la?",o:["Dividir 94% por 12 e somar os meses.","Garantir que a soma das metas mensais dê 94%.","Definir uma curva de evolução da taxa ao longo dos meses, conforme o efeito esperado das ações.","Usar 94% em todos os meses, sem exceção."],c:2,e:["Percentuais não se dividem nem se somam assim.","Somar taxas mensais não produz uma taxa anual.","Para metas em taxa, define-se a evolução esperada mês a mês.","Possível, mas ignora que as ações levam tempo para fazer efeito. Os primeiros meses ficariam vermelhos por construção."]},
    {q:"Quando parar de perguntar “por quê?” na técnica dos 5 porquês?",o:["Sempre na quinta pergunta.","Quando a resposta apontar para outra área.","Quando chegar a uma causa sobre a qual a equipe pode agir e que, eliminada, impede o problema de voltar.","Quando a equipe concordar com uma resposta."],c:2,e:["O número cinco é uma referência, não uma regra.","Apontar para outra área costuma ser fuga da causa, não a causa.","Esse é o critério de causa raiz.","Consenso não garante que a causa foi encontrada."]},
    {q:"Qual ação de 5W2H está mais bem definida?",o:["O quê: Melhoria do roteiro · Quem: equipe de rotas · Quando: o quanto antes","O quê: Revisar o tempo de parada no sistema · Quem: Carlos Teixeira · Quando: 28/02/2027","O quê: Rotas · Quem: Planejamento · Quando: 1º semestre","O quê: Tentar reduzir atrasos · Quem: todos · Quando: 2027"],c:1,e:["Sem verbo no infinitivo, responsável coletivo e prazo vago.","Verbo no infinitivo, uma pessoa responsável e uma data.","Sem verbo, responsável coletivo e prazo impreciso.","“Tentar” não é ação, “todos” não é dono, “2027” não é prazo."]},
    {q:"Em junho, a Lumen realizou 45% da meta anual de volume. O segundo semestre historicamente concentra 54% do volume. O que concluir?",o:["A meta será perdida: a projeção linear indica 90%.","É preciso ajustar a projeção pela sazonalidade antes de decidir, porque o segundo semestre pesa mais.","Basta esperar dezembro para avaliar.","A meta deve ser revista para baixo imediatamente."],c:1,e:["A projeção linear ignora que o segundo semestre é mais forte.","Ajustada, a projeção fica em torno de 98% da meta: farol amarelo, não vermelho. A decisão muda.","Esperar dezembro elimina a chance de agir.","Revisar a meta sem analisar a projeção correta é precipitado."]}
  ];
  const quiz=document.getElementById("quiz");
  quiz.innerHTML=QZ.map((x,i)=>`<div class="q"><fieldset><legend>${i+1}. ${x.q}</legend>${x.o.map((o,j)=>`<label class="opt" id="o${i}_${j}"><input type="radio" name="q${i}" value="${j}"><span>${o}</span></label>`).join("")}</fieldset><div id="qe${i}" aria-live="polite"></div></div>`).join("")+
    `<div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap"><button class="btn pri" type="submit">Enviar respostas</button><button class="btn" type="button" id="qReset">Refazer</button><span id="qScore" class="score" aria-live="polite"></span></div>`;
  quiz.addEventListener("submit",e=>{
    e.preventDefault(); let s=0, missing=0;
    QZ.forEach((x,i)=>{
      const sel=quiz.querySelector(`input[name="q${i}"]:checked`);
      x.o.forEach((_,j)=>document.getElementById(`o${i}_${j}`).classList.remove("right","wrong"));
      if(!sel){ missing++; document.getElementById("qe"+i).innerHTML=`<div class="fb no">Escolha uma alternativa.</div>`; return; }
      const j=+sel.value, ok=j===x.c; if(ok) s++;
      document.getElementById(`o${i}_${x.c}`).classList.add("right"); if(!ok) document.getElementById(`o${i}_${j}`).classList.add("wrong");
      document.getElementById("qe"+i).innerHTML=`<div class="fb ${ok?"ok":"no"}"><b>${ok?"Correto.":"Não exatamente."}</b> ${x.e[j]}${ok?"":" <br><b>Resposta esperada:</b> "+x.e[x.c]}</div>`;
    });
    document.getElementById("qScore").textContent=missing?`Faltam ${missing} questão(ões)`:`${s} de ${QZ.length} acertos`;
  });
  document.getElementById("qReset").addEventListener("click",()=>{ quiz.reset(); quiz.querySelectorAll(".opt").forEach(o=>o.classList.remove("right","wrong")); QZ.forEach((_,i)=>document.getElementById("qe"+i).innerHTML=""); document.getElementById("qScore").textContent=""; });

  /* ---------- Tema: redesenha gráficos ---------- */
  try{ matchMedia("(prefers-color-scheme: dark)").addEventListener("change",()=>{drawPareto();renderMens();}); }catch(e){}
  new MutationObserver(()=>{drawPareto();renderMens();}).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme"]});

  drawPareto(); renderMens();
  show(location.hash.slice(1)||"inicio",false);
})();
