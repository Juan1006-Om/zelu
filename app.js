/* ===== zelu — protótipo navegável (sem banco de dados) ===== */
const $ = s => document.querySelector(s);
const brl = v => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* ---------- ÍCONES ---------- */
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

/* ---------- DADOS FIXOS ---------- */
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

/* ---------- ESTADO (só em memória) ---------- */
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

/* ---------- HELPERS ---------- */
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
  d.className =
