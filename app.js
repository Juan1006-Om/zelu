/* ===== zelu — protótipo navegável (sem banco de dados) ===== */
const $ = s => document.querySelector(s);
const brl = v => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const P = {
  home: '<path d="M3 11l9-8 9 8v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/>',
  wallet: '<rect x="2" y="6" width="20" height="14" rx="3"/><path d="M16 14h2M2 10h20"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  bell: '<path d="M6 16v-5a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 21h4"/>',
  back: '<path d="M15 5l-7 7 7 7"/>',
  chat: '<path d="M4 5h16v11H9l-5 4z"/>',
  eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>'
};
const ic = (n, s = 22) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${P[n]}</svg>`;

const CAT = { 'Alimentação': '#8102cf', 'Compras': '#3a4bf3', 'Transporte': '#14B8C8', 'Lazer': '#FF6B8B', 'Assinaturas': '#F2B705', 'Outros': '#8A8FA8' };
const CATE = { 'Alimentação': '🍔', 'Compras': '🛍️', 'Transporte': '🚗', 'Lazer': '🎬', 'Assinaturas': '📱', 'Outros': '✨' };
const APPS = { 'Instagram': '📸', 'TikTok': '🎵', 'Shopee': '🧡', 'Shein': '👗', 'Mercado Livre': '📦', 'iFood': '🍔' };
const MESES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

const QUIZ = [
  { q: 'Com que frequência você compra por impulso?', o: ['Quase nunca', 'Às vezes', 'Toda semana', 'Quase todo dia'] },
  { q: 'Onde você mais gasta hoje?', o: ['Delivery e comida', 'Roupas e beleza', 'Lazer e rolês', 'Apps e assinaturas'] },
  { q: 'Qual é o seu principal objetivo financeiro agora?', o: ['Juntar para uma meta', 'Sair das dívidas', 'Entender meus gastos', 'Criar uma reserva'] },
  { q: 'Como você se sente depois de uma compra não planejada?', o: ['Tranquilo(a)', 'Um pouco culpado(a)', 'Arrependido(a)', 'Ansioso(a)'] }
];

const PERFIS = {
  equilibrio: { e: '🌿', n: 'Equilíbrio Financeiro', d: 'Você já tem uma boa relação com seu dinheiro. A zelu te ajuda a manter o ritmo e chegar mais rápido nas suas metas.', t: ['Acompanhar suas metas de perto', 'Mostrar para onde seu dinheiro está indo', 'Lembrar das contas antes do vencimento'] },
  construcao: { e: '🧭', n: 'Consciência em Construção', d: 'Às vezes o impulso fala mais alto, e tudo bem. Vamos criar pequenas pausas para suas escolhas ficarem mais claras.', t: ['Criar pausas antes de compras não planejadas', 'Organizar seus gastos por categoria', 'Transformar vontades em metas'] },
  pausa: { e: '⏸️', n: 'Hora de uma Pausa', d: 'As compras não planejadas estão pesando. A zelu vai te ajudar com pausas, lembretes e metas, um passo de cada vez e sem cobrança.', t: ['Pausa de reflexão antes de comprar', 'Bloqueio gentil de apps de compra', 'Wishlist com tempo de espera'] }
};

const TUT = [
  { e: '⏸️', t: 'Pausa antes de comprar', d: 'Veja o impacto de uma compra nas suas metas antes de decidir.' },
  { e: '📊', t: 'Seus gastos, sem complicação', d: 'Registre e descubra para onde seu dinheiro vai.' },
  { e: '🎯', t: 'Metas possíveis', d: 'Guarde aos poucos e acompanhe cada passo.' },
  { e: '🛡️', t: 'Bloqueio gentil', d: 'Uma pausa antes de abrir apps que despertam o impulso.' }
];

const QA = [
  { e: '⏸️', n: 'Pausar compra', f: 'abrirPausa()' },
  { e: '➕', n: 'Novo gasto', f: 'novoGasto()' },
  { e: '💜', n: 'Wishlist', f: "go('wishlist')" },
  { e: '📅', n: 'Calendário', f: "go('calendario')" }
];

const REFL = ['Eu preciso disso ou só quero agora?', 'Eu compraria se não tivesse visto o anúncio?', 'Vou usar isso nos próximos 30 dias?'];
const SUG = ['Como estão meus gastos?', 'Quanto falta pra minha meta?', 'Quero comprar uma coisa', 'Dicas pra economizar'];

let S;
function estadoInicial() {
  return {
    user: { nome: 'Lulu', email: 'lulu@email.com', renda: 2800 },
    perfil: 'construcao',
    saldo: 2184.90,
    economizado: 120,
    gastos: [
      { d: 'iFood', c: 'Alimentação', v: 48.9, dia: 14, plan: false },
      { d: 'Uber', c: 'Transporte', v: 23.5, dia: 13, plan: true },
      { d: 'Camiseta', c: 'Compras', v: 89.9, dia: 12, plan: false },
      { d: 'Cinema', c: 'Lazer', v: 42, dia: 10, plan: true },
      { d: 'Spotify', c: 'Assinaturas', v: 21.9, dia: 8, plan: true },
      { d: 'Mercado', c: 'Alimentação', v: 156.3, dia: 6, plan: true }
    ],
    metas: [
      { nome: 'Viagem com amigos', e: '✈️', alvo: 5000, atual: 1850 },
      { nome: 'Câmera nova', e: '📷', alvo: 4000, atual: 900 },
      { nome: 'Reserva de emergência', e: '🛟', alvo: 3000, atual: 1200 }
    ],
    wishlist: [
      { nome: 'Tênis branco', valor: 349.9, dias: 3 },
      { nome: 'Fone bluetooth', valor: 199, dias: 7 }
    ],
    contas: [
      { nome: 'Streaming', e: '📺', valor: 39.9, dia: 5, paga: true },
      { nome: 'Internet', e: '📶', valor: 99.9, dia: 20, paga: false },
      { nome: 'Celular', e: '📱', valor: 59.9, dia: 22, paga: false },
      { nome: 'Academia', e: '🏋️', valor: 89.9, dia: 25, paga: false },
      { nome: 'Fatura do cartão', e: '💳', valor: 640, dia: 28, paga: false }
    ],
    cartoes: [{ nome: 'Cartão principal', final: '4417', limite: 2000, usado: 640 }],
    bloq: { 'Instagram': true, 'TikTok': true, 'Shopee': true, 'Shein': false, 'Mercado Livre': false, 'iFood': false },
    horario: 'O dia todo',
    notif: { 'Lembrete de contas': true, 'Resumo semanal': true, 'Alerta de impulso': true, 'Progresso das metas': false },
    config: { 'Ocultar saldo ao abrir': false, 'Pausa sugerida acima de R$ 100': true, 'Entrar com biometria': false },
    chat: [{ b: 1, t: 'Oi! Eu sou a assistente da zelu 💜 Posso te ajudar a entender seus gastos, acompanhar suas metas ou pensar com calma antes de uma compra. Por onde quer começar?' }]
  };
}
S = estadoInicial();

let hist = [], cur = 'splash', timer = null, quizIdx = 0, quizAns = [], hideSaldo = false, pausaData = null, calSel = null;
const F = { gCat: 'Alimentação', gPlan: 'sim', emo: '🎯' };
const MAIN = ['home', 'carteira', 'metas', 'perfil'];

const totalGastos = () => S.gastos.reduce((a, g) => a + g.v, 0);
const porCat = () => S.gastos.reduce((o, g) => (o[g.c] = (o[g.c] || 0) + g.v, o), {});
const pct = m => Math.min(100, Math.round(m.atual / m.alvo * 100));
const head = (t, right = '', bf = 'back()') => `<div class="hd"><button class="ic" onclick="${bf}">${ic('back', 20)}</button><h2>${t}</h2>${right}</div>`;
const gItem = g => `<div class="li"><span class="lic" style="background:${CAT[g.c]}22">${CATE[g.c]}</span><div class="f1"><b>${esc(g.d)}</b><p class="mut sm">${g.c} · dia ${g.dia}${g.plan ? '' : ' · não planejado'}</p></div><b>-${brl(g.v)}</b></div>`;
const tgList = g => `<div class="card">${Object.keys(S[g]).map(k => `<div class="li"><div class="f1"><b>${k}</b></div><div class="toggle ${S[g][k] ? 'on' : ''}" onclick="tog(this,'${g}','${k}')"></div></div>`).join('')}</div>`;

function toast(m) {
  const t = document.createElement('div');
  t.className = 'toast'; t.innerHTML = m;
  $('#app').appendChild(t);
  setTimeout(() => t.remove(), 2600);
}
function openSheet(h) {
  closeSheet();
  const d = document.createElement('div');
  d.className = 'sheet-bg';
  d.onclick = e => { if (e.target === d) closeSheet(); };
  d.innerHTML = `<div class="sheet">${h}</div>`;
  $('#app').appendChild(d);
}
function closeSheet() { const s = $('.sheet-bg'); if (s) s.remove(); }
function stopTimer() { if (timer) { clearInterval(timer); timer = null; } }
function selChip(el, k, v) {
  F[k] = v;
  el.parentNode.querySelectorAll('.chip').forEach(c => c.classList.remove('sel'));
  el.classList.add('sel');
}
function tog(el, g, k) { S[g][k] = !S[g][k]; el.classList.toggle('on'); }

function go(n) { stopTimer(); closeSheet(); hist.push(cur); cur = n; render(); }
function back() { stopTimer(); cur = hist.pop() || 'home'; render(); }
function reset(n) { stopTimer(); closeSheet(); hist = []; cur = n; render(); }
function tab(n) { reset(n); }
function resetApp() { S = estadoInicial(); quizIdx = 0; quizAns = []; pausaData = null; calSel = null; hideSaldo = false; reset('splash'); }

function navH() {
  const N = [['home', 'home', 'Início'], ['carteira', 'wallet', 'Carteira'], null, ['metas', 'target', 'Metas'], ['perfil', 'user', 'Perfil']];
  return `<nav class="bn">${N.map(n => n
    ? `<button class="${cur === n[0] ? 'act' : ''}" onclick="tab('${n[0]}')">${ic(n[1])}<span>${n[2]}</span></button>`
    : `<button class="plus" onclick="plusSheet()">${ic('plus', 26)}</button>`).join('')}</nav>`;
}
function cbar() {
  return `<div class="cbar"><div class="sug">${SUG.map(s => `<button class="chip" onclick="send('${s}')">${s}</button>`).join('')}</div>
  <div class="row"><input class="in" id="ci" placeholder="Pergunte algo..." onkeydown="if(event.key==='Enter')send()"><button class="send" onclick="send()">➤</button></div></div>`;
}

function render() {
  const a = $('#app');
  if (!a) return;
  const full = cur === 'splash';
  a.innerHTML = `<div class="sb ${full ? 'w' : ''}"><span>9:41</span><span>📶 🔋</span></div>
    <div class="scr ${full ? 'full' : ''} ${MAIN.includes(cur) ? 'wnav' : ''} ${cur === 'assistente' ? 'chatpad' : ''}">${screens[cur]()}</div>
    ${MAIN.includes(cur) ? navH() : ''}
    ${cur === 'home' ? `<button class="fab" onclick="go('assistente')">${ic('chat')}</button>` : ''}
    ${cur === 'assistente' ? cbar() : ''}`;
  const s = a.querySelector('.scr');
  if (after[cur]) after[cur](s);
}

const screens = {
  splash: () => `<div class="splash">
    <div class="logo-big">zelu</div>
    <h1>Menos impulso.<br>Mais direção.</h1>
    <p>Seu dinheiro merece cuidado. Vamos começar te conhecendo melhor?</p>
    <button class="pbtn" onclick="quizIdx=0;quizAns=[];go('quiz')">Começar</button>
    <button class="lbtn" onclick="go('login')">Já tenho conta</button></div>`,

  login: () => `${head('Entrar')}
    <p class="mut">Que bom te ver de novo 💜</p>
    <label>E-mail</label><input class="in" value="${esc(S.user.email)}">
    <label>Senha</label><input class="in" type="password" value="123456">
    <button class="pbtn mt" onclick="reset('home')">Entrar</button>
    <p class="mut sm c mt">Protótipo: nenhum dado é salvo.</p>`,

  quiz: () => {
    const q = QUIZ[quizIdx];
    return `${head('Vamos te conhecer', '', 'prevQ()')}
      <div class="bar"><i style="width:${(quizIdx + 1) / QUIZ.length * 100}%"></i></div>
      <p class="step">Pergunta ${quizIdx + 1} de ${QUIZ.length}</p>
      <h1 class="qt">${q.q}</h1>
      ${q.o.map((o, i) => `<button class="opt ${quizAns[quizIdx] === i ? 'sel' : ''}" onclick="pick(${i})">${o}</button>`).join('')}
      <button class="pbtn mt" ${quizAns[quizIdx] == null ? 'disabled' : ''} onclick="nextQ()">Continuar</button>`;
  },

  resultado: () => {
    const p = PERFIS[S.perfil];
    return `<p class="step">Seu perfil de consumo</p>
      <div class="res-card"><div class="emo">${p.e}</div><h1>${p.n}</h1><p>${p.d}</p></div>
      <h3>O que a zelu vai fazer por você</h3>
      ${p.t.map(t => `<div class="tip">✓ ${t}</div>`).join('')}
      <button class="pbtn mt" onclick="go('cadastro')">Criar minha conta</button>`;
  },

  cadastro: () => `${head('Crie sua conta')}
    <label>Como você quer ser chamado(a)?</label><input class="in" id="cn" placeholder="Seu nome">
    <label>E-mail</label><input class="in" id="ce" placeholder="voce@email.com">
    <label>Renda mensal aproximada (opcional)</label><input class="in" id="cr" type="number" placeholder="Ex: 2000">
    <button class="pbtn mt" onclick="cadastrar()">Criar conta</button>`,

  tutorial: () => `<h1 style="margin-top:10px">Como usar a zelu</h1>
    <p class="mut" style="margin-bottom:16px">Quatro coisas para você saber:</p>
    ${TUT.map(t => `<div class="card li" style="padding:16px"><span class="lic">${t.e}</span><div class="f1"><b>${t.t}</b><p class="mut sm">${t.d}</p></div></div>`).join('')}
    <button class="pbtn mt" onclick="reset('home')">Bora começar</button>`,

  home: () => {
    const cats = porCat(), max = Math.max(...Object.values(cats), 1), m = S.metas[0];
    const bl = Object.values(S.bloq).filter(Boolean).length;
    const h = v => hideSaldo ? 'R$ ••••' : brl(v);
    return `<div class="top"><div><p class="mut">Olá,</p><h2>${esc(S.user.nome)} 👋</h2></div><button class="ic" onclick="go('notificacoes')">${ic('bell')}</button></div>
      <div class="bal"><div class="row"><span>Saldo disponível</span><button class="ic w" onclick="hideSaldo=!hideSaldo;render()">${ic('eye', 18)}</button></div>
        <div class="big">${h(S.saldo)}</div>
        <div class="row sm"><span>Gastos do mês: ${h(totalGastos())}</span><span>Economizado: ${h(S.economizado)}</span></div></div>
      <div class="qa">${QA.map(a => `<button onclick="${a.f}"><span>${a.e}</span>${a.n}</button>`).join('')}</div>
      <div class="card"><h3>Para onde seu dinheiro vai</h3>
        ${Object.entries(cats).sort((a, b) => b[1] - a[1]).map(([c, v]) => `<div class="cat"><div class="row"><span><i class="dot" style="background:${CAT[c]}"></i>${c}</span><b>${brl(v)}</b></div><div class="bar"><i style="width:${v / max * 100}%;background:${CAT[c]}"></i></div></div>`).join('')}</div>
      ${m ? `<div class="card" style="cursor:pointer" onclick="tab('metas')"><div class="row"><h3>${m.e} ${esc(m.nome)}</h3><b class="pill">${pct(m)}%</b></div><div class="bar"><i style="width:${pct(m)}%"></i></div><p class="mut sm">${brl(m.atual)} de ${brl(m.alvo)}</p></div>` : ''}
      <div class="card alert" onclick="go('bloqueio')">🛡️<div><b>${bl} apps com pausa ativa</b><p class="mut sm">Toque para gerenciar</p></div></div>
      <div class="card"><div class="row"><h3>Últimos gastos</h3><button class="link" onclick="go('calendario')">Ver calendário</button></div>${S.gastos.slice(0, 5).map(gItem).join('')}</div>`;
  },

  carteira: () => {
    const pend = S.contas.filter(c => !c.paga).reduce((a, c) => a + c.valor, 0);
    return `<div class="top"><h1>Carteira</h1><button class="ic" onclick="go('addCartao')">${ic('plus')}</button></div>
      <div class="two"><div class="card"><span class="mut sm">Saldo</span><b>${brl(S.saldo)}</b></div><div class="card"><span class="mut sm">A pagar</span><b style="color:#FF5A7A">${brl(pend)}</b></div></div>
      <h3>Cartões</h3>
      <div class="hs">${S.cartoes.map(c => `<div class="ccard"><div class="row"><b>${esc(c.nome)}</b><b>zelu</b></div><div><div class="sm" style="opacity:.85">Usado ${brl(c.usado)} de ${brl(c.limite)}</div><div class="bar" style="background:rgba(255,255,255,.25)"><i style="width:${Math.min(100, c.usado / c.limite * 100)}%;background:#fff"></i></div><b>•••• ${esc(c.final)}</b></div></div>`).join('')}</div>
      <h3>Contas a pagar</h3>
      <div class="card">${S.contas.map((c, i) => `<div class="li"><span class="lic">${c.e}</span><div class="f1"><b>${esc(c.nome)}</b><p class="mut sm">Vence dia ${c.dia}</p></div><div style="text-align:right"><b>${brl(c.valor)}</b><br>${c.paga ? '<span class="sm" style="color:#16a34a;font-weight:800">Paga ✓</span>' : `<button class="link" onclick="pagar(${i})">Pagar</button>`}</div></div>`).join('')}</div>
      <button class="sbtn" onclick="go('calendario')">📅 Ver no calendário</button>`;
  },

  addCartao: () => `${head('Adicionar cartão')}
    <label>Nome do cartão</label><input class="in" id="kn" placeholder="Ex: Cartão do banco">
    <label>Últimos 4 números</label><input class="in" id="kf" maxlength="4" inputmode="numeric" placeholder="0000">
    <label>Limite</label><input class="in" id="kl" type="number" placeholder="R$ 0,00">
    <button class="pbtn mt" onclick="salvarCartao()">Adicionar</button>`,

  addGasto: () => `${head('Registrar gasto')}
    <label>Valor</label><input class="in" id="gv" type="number" placeholder="R$ 0,00">
    <label>Descrição</label><input class="in" id="gd" placeholder="Ex: lanche com amigos">
    <label>Categoria</label>
    <div class="chips">${Object.keys(CAT).map(c => `<button class="chip ${F.gCat === c ? 'sel' : ''}" onclick="selChip(this,'gCat','${c}')">${CATE[c]} ${c}</button>`).join('')}</div>
    <label>Esse gasto foi planejado?</label>
    <div class="chips"><button class="chip ${F.gPlan === 'sim' ? 'sel' : ''}" onclick="selChip(this,'gPlan','sim')">Sim, planejei</button><button class="chip ${F.gPlan === 'nao' ? 'sel' : ''}" onclick="selChip(this,'gPlan','nao')">Não, foi no impulso</button></div>
    <button class="pbtn mt" onclick="salvarGasto()">Salvar gasto</button>`,

  metas: () => {
    const tg = S.metas.reduce((a, m) => a + m.atual, 0);
    return `<div class="top"><h1>Suas metas</h1><button class="ic" onclick="F.emo='🎯';go('novaMeta')">${ic('plus')}</button></div>
      <div class="bal"><span>Total guardado</span><div class="big">${brl(tg)}</div><span class="sm">${S.metas.length} metas · ${brl(S.economizado)} economizados com pausas</span></div>
      ${S.metas.map((m, i) => `<div class="card"><div class="row"><div class="row" style="justify-content:flex-start"><span class="lic">${m.e}</span><div><b>${esc(m.nome)}</b><p class="mut sm">${brl(m.atual)} de ${brl(m.alvo)}</p></div></div><b class="pill">${pct(m)}%</b></div>
        <div class="bar"><i style="width:${pct(m)}%"></i></div>
        <div class="row"><span class="mut sm">${m.atual >= m.alvo ? 'Concluída 🎉' : 'Faltam ' + brl(m.alvo - m.atual)}</span><button class="link" onclick="guardarSheet(${i})">+ Guardar</button></div></div>`).join('')}`;
  },

  novaMeta: () => `${head('Nova meta')}
    <label>Qual é o seu plano?</label><input class="in" id="mn" placeholder="Ex: Show em março">
    <label>Quanto você precisa?</label><input class="in" id="mv" type="number" placeholder="R$ 0,00">
    <label>Escolha um ícone</label>
    <div class="chips">${['🎯', '✈️', '📷', '🎓', '🏠', '🚗', '🎧', '🛟'].map(e => `<button class="chip ${F.emo === e ? 'sel' : ''}" onclick="selChip(this,'emo','${e}')">${e}</button>`).join('')}</div>
    <button class="pbtn mt" onclick="salvarMeta()">Criar meta</button>`,

  pausa: () => {
    if (!pausaData) return `${head('Pausa antes de comprar')}
      <div class="hero-p"><div class="emo">⏸️</div><h2>Viu algo e bateu vontade?</h2><p class="mut">Antes de decidir, vamos olhar juntos o que essa compra significa pra você.</p></div>
      <label>O que você quer comprar?</label><input class="in" id="pn" placeholder="Ex: tênis novo">
      <label>Quanto custa?</label><input class="in" id="pv" type="number" placeholder="R$ 0,00">
      <button class="pbtn mt" onclick="analisar()">Analisar com calma</button>`;
    const p = pausaData, m = S.metas[0];
    const falta = m ? Math.max(m.alvo - m.atual, 1) : 0;
    const horas = S.user.renda ? p.valor / (S.user.renda / 160) : 0;
    const done = p.seg <= 0;
    return `${head('Pausa antes de comprar', '', 'pausaData=null;back()')}
      <div class="card c"><p class="mut">Você quer comprar</p><h2>${esc(p.nome)}</h2><div class="bigg">${brl(p.valor)}</div></div>
      <div class="imp">
        <div class="card"><b>${Math.round(p.valor / Math.max(S.saldo, 1) * 100)}%</b><span>do seu saldo atual</span></div>
        ${m ? `<div class="card"><b>${Math.round(p.valor / falta * 100)}%</b><span>do que falta para ${esc(m.nome)}</span></div>` : ''}
        ${horas ? `<div class="card"><b>${horas < 1 ? Math.round(horas * 60) + 'min' : Math.round(horas) + 'h'}</b><span>do seu trabalho</span></div>` : ''}
      </div>
      <h3>Pensa comigo:</h3>
      ${REFL.map((r, i) => `<button class="opt chk ${p.checks[i] ? 'sel' : ''}" onclick="pausaData.checks[${i}]=!pausaData.checks[${i}];this.classList.toggle('sel')">${r}</button>`).join('')}
      ${done
        ? `<div class="acts"><button class="pbtn" onclick="pausaWish()">💜 Esperar 7 dias na wishlist</button><button class="sbtn" onclick="pausaMeta()">🐷 Guardar esse valor na meta</button><button class="lbtn" onclick="pausaComprar()">Comprar mesmo assim</button></div>`
        : `<div class="breathe"><div class="circ"><span id="seg">${p.seg}</span></div><p class="mut c">Respira fundo... suas opções aparecem em instantes.</p></div>`}`;
  },

  wishlist: () => `${head('Wishlist')}
    <div class="bal"><span>Você já economizou</span><div class="big">${brl(S.economizado)}</div><span class="sm">desistindo de compras com calma 💜</span></div>
    <p class="mut sm" style="margin-bottom:12px">Os itens esperam 7 dias aqui. Se a vontade continuar, você decide com clareza.</p>
    ${S.wishlist.length ? S.wishlist.map((w, i) => `<div class="card"><div class="row"><b>${esc(w.nome)}</b><b>${brl(w.valor)}</b></div>
      <div class="bar"><i style="width:${Math.min(100, w.dias / 7 * 100)}%"></i></div>
      <p class="mut sm">${w.dias >= 7 ? 'Pronto! 7 dias de espera concluídos.' : `Esperando há ${w.dias} dia${w.dias === 1 ? '' : 's'} · faltam ${7 - w.dias}`}</p>
      <div class="two mt"><button class="sbtn" onclick="wishDesistir(${i})">Desisti</button><button class="pbtn" ${w.dias < 7 ? 'disabled' : ''} onclick="wishComprar(${i})">Ainda quero</button></div></div>`).join('')
      : '<p class="mut c mt">Sua wishlist está vazia 🌿</p>'}
    <button class="lbtn" onclick="S.wishlist.forEach(w=>w.dias++);render()">⏩ Avançar 1 dia (demonstração)</button>`,

  calendario: () => {
    const n = new Date(), y = n.getFullYear(), mo = n.getMonth();
    const first = new Date(y, mo, 1).getDay(), dd = new Date(y, mo + 1, 0).getDate();
    const sel = calSel || n.getDate();
    let cells = '';
    for (let i = 0; i < first; i++) cells += '<span></span>';
    for (let d = 1; d <= dd; d++) {
      const hc = S.contas.some(c => c.dia === d && !c.paga), hg = S.gastos.some(g => g.dia === d);
      cells += `<button class="cd ${d === sel ? 'sel' : ''} ${d === n.getDate() ? 'hoje' : ''}" onclick="calSel=${d};render()">${d}${hc || hg ? `<i class="${hc ? 'cc' : 'cg'}"></i>` : ''}</button>`;
    }
    const ev = [
      ...S.contas.filter(c => c.dia === sel).map(c => `<div class="li"><span class="lic">${c.e}</span><div class="f1"><b>${esc(c.nome)}</b><p class="mut sm">${c.paga ? 'Paga ✓' : 'Conta a pagar'}</p></div><b>${brl(c.valor)}</b></div>`),
      ...S.gastos.filter(g => g.dia === sel).map(gItem)
    ];
    return `${head('Calendário financeiro')}
      <div class="card"><h3 class="c">${MESES[mo]} ${y}</h3>
        <div class="cal">${['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map(x => `<b>${x}</b>`).join('')}${cells}</div>
        <div class="leg"><span><i class="cc"></i>Conta a pagar</span><span><i class="cg"></i>Gasto</span></div></div>
      <h3>Dia ${sel}</h3>
      ${ev.length ? `<div class="card">${ev.join('')}</div>` : '<p class="mut">Nada por aqui. Dia tranquilo 🌿</p>'}`;
  },

  bloqueio: () => `${head('Bloqueio de apps')}
    <p class="mut" style="margin-bottom:14px">Escolha os apps que vão ganhar uma pausa antes de abrir. Não é proibição, é só um respiro.</p>
    <div class="card">${Object.keys(S.bloq).map(a => `<div class="li"><span class="lic">${APPS[a]}</span><div class="f1"><b>${a}</b></div><div class="toggle ${S.bloq[a] ? 'on' : ''}" onclick="tog(this,'bloq','${a}')"></div></div>`).join('')}</div>
    <label>Quando a pausa fica ativa</label>
    <select class="in" onchange="S.horario=this.value">${['O dia todo', '22h às 8h', 'Durante o trabalho', 'Fins de semana'].map(h => `<option ${S.horario === h ? 'selected' : ''}>${h}</option>`).join('')}</select>
    <button class="pbtn mt" onclick="simular()">Simular abrir o Instagram</button>`,

  assistente: () => `${head('Assistente zelu')}
    <div class="chat">${S.chat.map(m => `<div class="msg ${m.b ? 'bot' : 'me'}">${m.t}</div>`).join('')}</div>`,

  perfil: () => {
    const p = PERFIS[S.perfil];
    const menu = [['👤', 'Dados pessoais', 'dados'], ['🔔', 'Notificações', 'notificacoes'], ['🛡️', 'Bloqueio de apps', 'bloqueio'], ['💜', 'Wishlist', 'wishlist'], ['💬', 'Assistente zelu', 'assistente'], ['⚙️', 'Configurações', 'configuracoes'], ['❓', 'Ajuda', 'ajuda']];
    return `<div class="c"><div class="av">${esc((S.user.nome[0] || '?').toUpperCase())}</div><h2>${esc(S.user.nome)}</h2><p class="mut sm">${esc(S.user.email)}</p><span class="pill" style="margin-top:10px">${p.e} ${p.n}</span></div>
      <div class="two" style="margin:18px 0 14px"><div class="card"><b>${brl(S.economizado)}</b><span class="mut sm">economizados</span></div><div class="card"><b>${S.metas.length}</b><span class="mut sm">metas ativas</span></div></div>
      <div class="card menu">${menu.map(x => `<button onclick="go('${x[2]}')"><span>${x[0]}</span>${x[1]}</button>`).join('')}</div>
      <button class="lbtn" style="color:#FF5A7A" onclick="reset('splash')">Sair</button>`;
  },

  dados: () => `${head('Dados pessoais')}
    <label>Nome</label><input class="in" id="dn" value="${esc(S.user.nome)}">
    <label>E-mail</label><input class="in" id="de" value="${esc(S.user.email)}">
    <label>Renda mensal</label><input class="in" id="dr" type="number" value="${S.user.renda || ''}">
    <button class="pbtn mt" onclick="salvarDados()">Salvar</button>
    <p class="mut sm c mt">Protótipo: os dados ficam só nesta sessão.</p>`,

  notificacoes: () => `${head('Notificações')}<p class="mut" style="margin-bottom:14px">Escolha como a zelu pode te lembrar das coisas.</p>${tgList('notif')}`,

  configuracoes: () => `${head('Configurações')}${tgList('config')}<button class="sbtn" onclick="resetApp()">Reiniciar protótipo</button>`,

  ajuda: () => `${head('Ajuda')}
    <details><summary>O que é a Pausa?</summary><p>É um momento de reflexão antes de comprar. A zelu mostra quanto a compra pesa no seu saldo e nas suas metas, e você decide com calma.</p></details>
    <details><summary>Como funciona a wishlist?</summary><p>Itens que você quer comprar esperam 7 dias. Se a vontade continuar, ótimo. Se passar, o valor conta como economia.</p></details>
    <details><summary>O bloqueio impede de abrir os apps?</summary><p>Não. Ele só mostra uma pausa antes de abrir, lembrando das suas metas. A decisão é sempre sua.</p></details>
    <details><summary>Meus dados ficam salvos?</summary><p>Este é um protótipo de TCC: nada é salvo. Ao recarregar a página, tudo volta ao início.</p></details>`
};

const after = {
  pausa: () => {
    if (pausaData && pausaData.seg > 0 && !timer) {
      timer = setInterval(() => {
        pausaData.seg--;
        const e = $('#seg'); if (e) e.textContent = pausaData.seg;
        if (pausaData.seg <= 0) { stopTimer(); render(); }
      }, 1000);
    }
  },
  assistente: s => { s.scrollTop = s.scrollHeight; }
};

function pick(i) { quizAns[quizIdx] = i; render(); }
function prevQ() { if (quizIdx > 0) { quizIdx--; render(); } else back(); }
function nextQ() {
  if (quizIdx < QUIZ.length - 1) { quizIdx++; render(); return; }
  const score = quizAns[0] + quizAns[3];
  S.perfil = score <= 1 ? 'equilibrio' : score <= 3 ? 'construcao' : 'pausa';
  go('resultado');
}
function cadastrar() {
  const n = $('#cn').value.trim();
  if (!n) return toast('Conta pra gente seu nome 😊');
  S.user.nome = n;
  const e = $('#ce').value.trim(); if (e) S.user.email = e;
  const r = parseFloat($('#cr').value); if (r > 0) S.user.renda = r;
  go('tutorial');
}

function plusSheet() {
  const op = [['⏸️', 'Pausar antes de uma compra', 'abrirPausa()'], ['➕', 'Registrar um gasto', 'novoGasto()'], ['🎯', 'Criar uma meta', "F.emo='🎯';go('novaMeta')"], ['💳', 'Adicionar cartão', "go('addCartao')"]];
  openSheet(`<h3>O que você quer fazer?</h3><div class="menu">${op.map(x => `<button onclick="${x[2]}"><span>${x[0]}</span>${x[1]}</button>`).join('')}</div>`);
}
function novoGasto() { F.gCat = 'Alimentação'; F.gPlan = 'sim'; go('addGasto'); }
function salvarGasto() {
  const v = parseFloat($('#gv').value);
  if (!(v > 0)) return toast('Informe um valor');
  const d = $('#gd').value.trim() || F.gCat;
  S.gastos.unshift({ d, c: F.gCat, v, dia: new Date().getDate(), plan: F.gPlan === 'sim' });
  S.saldo -= v;
  reset('home');
  toast(F.gPlan === 'sim' ? 'Gasto registrado ✓' : 'Registrado ✓ Da próxima vez, que tal testar a Pausa? 💜');
}
function salvarCartao() {
  const n = $('#kn').value.trim(), f = $('#kf').value.trim(), l = parseFloat($('#kl').value);
  if (!n || f.length !== 4 || !(l > 0)) return toast('Preencha nome, 4 números e limite');
  S.cartoes.push({ nome: n, final: f, limite: l, usado: 0 });
  reset('carteira'); toast('Cartão adicionado ✓');
}
function pagar(i) {
  const c = S.contas[i]; c.paga = true; S.saldo -= c.valor;
  render(); toast(`${esc(c.nome)} paga ✓`);
}

function guardarSheet(i) {
  const m = S.metas[i];
  openSheet(`<h3>${m.e} Guardar em ${esc(m.nome)}</h3>
    <p class="mut sm">Saldo disponível: ${brl(S.saldo)}</p>
    <input class="in mt" id="gm" type="number" placeholder="R$ 0,00">
    <div class="chips mt">${[20, 50, 100, 200].map(v => `<button class="chip" onclick="$('#gm').value=${v}">${brl(v)}</button>`).join('')}</div>
    <button class="pbtn mt" onclick="guardar(${i})">Guardar</button>`);
}
function guardar(i) {
  const v = parseFloat($('#gm').value), m = S.metas[i];
  if (!(v > 0)) return toast('Informe um valor');
  if (v > S.saldo) return toast('Esse valor é maior que seu saldo');
  m.atual += v; S.saldo -= v;
  closeSheet(); render();
  toast(m.atual >= m.alvo ? '🎉 Meta concluída! Você chegou lá.' : `+${brl(v)} guardados. Cada passo conta 💜`);
}
function salvarMeta() {
  const n = $('#mn').value.trim(), v = parseFloat($('#mv').value);
  if (!n || !(v > 0)) return toast('Preencha o nome e o valor da meta');
  S.metas.push({ nome: n, e: F.emo, alvo: v, atual: 0 });
  reset('metas'); toast('Meta criada 🎯');
}

function abrirPausa() { pausaData = null; go('pausa'); }
function analisar() {
  const n = $('#pn').value.trim(), v = parseFloat($('#pv').value);
  if (!n || !(v > 0)) return toast('Conta o que é e quanto custa 😊');
  pausaData = { nome: n, valor: v, checks: [false, false, false], seg: 10 };
  render();
}
function pausaWish() {
  S.wishlist.unshift({ nome: pausaData.nome, valor: pausaData.valor, dias: 0 });
  pausaData = null; reset('home'); go('wishlist');
  toast('Salvo na wishlist. Daqui a 7 dias você decide 💜');
}
function pausaMeta() {
  const m = S.metas[0], v = pausaData.valor;
  if (!m) return toast('Crie uma meta primeiro');
  if (v > S.saldo) return toast('Esse valor é maior que seu saldo');
  m.atual += v; S.saldo -= v; S.economizado += v;
  pausaData = null; reset('metas');
  toast(`+${brl(v)} na meta ${esc(m.nome)} 🐷`);
}
function pausaComprar() {
  S.gastos.unshift({ d: pausaData.nome, c: 'Compras', v: pausaData.valor, dia: new Date().getDate(), plan: false });
  S.saldo -= pausaData.valor;
  pausaData = null; reset('home');
  toast('Compra registrada. O importante é decidir com consciência 💜');
}

function wishDesistir(i) {
  const w = S.wishlist.splice(i, 1)[0];
  S.economizado += w.valor; render();
  toast(`+${brl(w.valor)} economizados ✨`);
}
function wishComprar(i) {
  const w = S.wishlist.splice(i, 1)[0];
  S.gastos.unshift({ d: w.nome, c: 'Compras', v: w.valor, dia: new Date().getDate(), plan: true });
  S.saldo -= w.valor; render();
  toast('Compra pensada é compra consciente ✓');
}

function simular() {
  if (!S.bloq['Instagram']) return toast('Ative a pausa do Instagram primeiro');
  const m = S.metas[0];
  openSheet(`<div class="c"><div style="font-size:48px">⏸️</div><h3>Respira um pouquinho</h3>
    <p class="mut">Você já abriu o Instagram 4 vezes hoje.${m ? ` Que tal dar uma olhada na meta <b>${esc(m.nome)}</b> antes? Ela está em ${pct(m)}%.` : ''}</p>
    <div class="acts"><button class="pbtn" onclick="tab('metas')">Ver minhas metas</button><button class="lbtn" onclick="closeSheet();toast('Tudo bem! Aproveite com consciência 💜')">Entrar mesmo assim</button></div></div>`);
}

function send(t) {
  t = t || ($('#ci') ? $('#ci').value.trim() : '');
  if (!t) return;
  S.chat.push({ t: esc(t) }); render();
  setTimeout(() => { S.chat.push({ b: 1, t: reply(t) }); if (cur === 'assistente') render(); }, 600);
}
function reply(t) {
  t = t.toLowerCase();
  const m = S.metas[0];
  if (/gast|dinheiro/.test(t)) {
    const top = Object.entries(porCat()).sort((a, b) => b[1] - a[1])[0];
    return `Este mês você registrou <b>${brl(totalGastos())}</b> em gastos. Onde mais pesou foi <b>${top[0]}</b> (${brl(top[1])}). <button class="link" onclick="go('calendario')">Ver no calendário</button>`;
  }
  if (/meta|viagem|juntar|falta/.test(t) && m) {
    const f = Math.max(m.alvo - m.atual, 0);
    return `Sua meta <b>${esc(m.nome)}</b> está em ${pct(m)}%. Faltam ${brl(f)}. Guardando ${brl(f / 6)} por mês, você chega lá em 6 meses 🎯`;
  }
  if (/impuls|compr|quero/.test(t)) return `Bateu vontade? Acontece, e tudo bem. Que tal fazer uma pausa rapidinha comigo antes de decidir? <button class="link" onclick="abrirPausa()">Fazer uma pausa</button>`;
  if (/econom|guardar|poupar|dica/.test(t)) return 'Uma dica simples: quando entrar dinheiro, separe primeiro um valor para sua meta, mesmo que pequeno. E deixe compras não planejadas esperarem 7 dias na wishlist 💜';
  if (/^(oi|olá|ola)\b/.test(t)) return `Oi, ${esc(S.user.nome)}! Como posso te ajudar hoje?`;
  return 'Ainda estou aprendendo 💜 Posso te ajudar com seus <b>gastos</b>, suas <b>metas</b>, a <b>vontade de comprar</b> ou <b>dicas para economizar</b>.';
}

function salvarDados() {
  const n = $('#dn').value.trim();
  if (!n) return toast('O nome não pode ficar vazio');
  S.user.nome = n;
  S.user.email = $('#de').value.trim() || S.user.email;
  const r = parseFloat($('#dr').value); S.user.renda = r > 0 ? r : 0;
  back(); toast('Dados atualizados ✓');
}

render();
/* ===== FIM DO app.js ===== */
