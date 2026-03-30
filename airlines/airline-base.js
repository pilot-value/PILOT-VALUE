/* ═══════════════════════════════════════════════════
   PILOT VALUE — Airline Detail Page: Shared Script
   ═══════════════════════════════════════════════════ */

/* Load global search */
(function(){var s=document.createElement('script');s.src='../search.js';document.head.appendChild(s);})();

(function(){

// ── Airline code from body data attribute ──────────
const AIRLINE_CODE = document.body.dataset.airline || '';

// ── Supabase ────────────────────────────────────────
const _SB_URL = 'https://vzgmnkrggrwtsrpqndsm.supabase.co';
const _SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6Z21ua3JnZ3J3dHNycHFuZHNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0MzkwOTcsImV4cCI6MjA5MDAxNTA5N30.wE4cJbqeYGCgn5ZvHd80hYWgQuySKvOMJMbsJWOvmtw';
let _sb = null;
function _initSB() {
  return new Promise(resolve => {
    if (_sb) { resolve(); return; }
    if (window.supabase) { _sb = window.supabase.createClient(_SB_URL, _SB_KEY); resolve(); return; }
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
    s.onload = () => { _sb = window.supabase.createClient(_SB_URL, _SB_KEY); resolve(); };
    s.onerror = () => resolve(); // SDKロード失敗でもサイトは動く
    document.head.appendChild(s);
  });
}

// ── Theme Toggle ───────────────────────────────────
const SUN = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;
const MOON = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;

function applyThemeA(t) {
  document.documentElement.setAttribute('data-theme', t);
  localStorage.setItem('pv-theme', t);
  const btn = document.getElementById('theme-toggle');
  if (btn) btn.innerHTML = (t === 'dark') ? SUN : MOON;
}
// Apply immediately
applyThemeA(localStorage.getItem('pv-theme') || 'dark');
// Bind click after DOM ready
document.addEventListener('DOMContentLoaded', function() {
  const btn = document.getElementById('theme-toggle');
  if (btn) btn.addEventListener('click', function() {
    applyThemeA(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  });
});

// ── Seed ratings [企業文化, 年収・給与, 福利厚生, 人間関係, 訓練, 運航, スケジュール] ──
const RATINGS = {
  ana:              [3.8, 3.5, 4.2, 3.9, 4.1, 4.0, 3.3],
  jal:              [3.7, 3.4, 4.1, 3.8, 4.0, 4.0, 3.4],
  skymark:          [3.2, 2.8, 3.1, 3.5, 3.2, 3.6, 3.8],
  zipair:           [3.4, 3.1, 3.2, 3.6, 3.3, 3.8, 3.5],
  peach:            [3.3, 2.9, 3.1, 3.4, 3.2, 3.7, 3.6],
  jetstar:          [3.1, 2.7, 3.0, 3.3, 3.1, 3.5, 3.5],
  spring:           [3.0, 2.8, 2.9, 3.2, 3.0, 3.4, 3.4],
  delta:            [4.2, 4.9, 4.5, 4.3, 4.0, 4.4, 3.8],
  united:           [3.8, 4.8, 4.4, 3.7, 3.9, 4.1, 3.5],
  american:         [3.5, 4.6, 4.2, 3.5, 3.7, 4.0, 3.3],
  southwest:        [4.0, 4.3, 4.3, 4.2, 3.8, 4.2, 3.7],
  alaska:           [3.9, 4.4, 4.3, 4.1, 3.9, 4.2, 3.8],
  emirates:         [3.5, 4.8, 4.6, 3.6, 3.8, 4.2, 2.8],
  qatar:            [3.4, 4.5, 4.3, 3.4, 3.9, 4.3, 2.7],
  etihad:           [3.6, 4.4, 4.2, 3.5, 3.8, 4.1, 2.9],
  'riyadh-air':     [3.8, 4.6, 4.4, 3.7, 3.9, 4.2, 3.0],
  singapore:        [4.0, 4.0, 4.4, 4.1, 4.3, 4.5, 3.5],
  cathay:           [3.7, 3.8, 4.1, 3.8, 4.2, 4.3, 3.3],
  lufthansa:        [3.8, 4.0, 4.3, 3.9, 4.3, 4.4, 3.6],
  'air-france':     [3.6, 3.9, 4.2, 3.7, 4.1, 4.2, 3.5],
  british:          [3.7, 3.8, 4.1, 3.8, 4.1, 4.2, 3.5],
  klm:              [3.9, 3.9, 4.2, 4.0, 4.1, 4.3, 3.7],
  swiss:            [4.1, 4.3, 4.4, 4.1, 4.4, 4.5, 3.8],
  turkish:          [3.5, 3.8, 3.9, 3.5, 3.8, 4.0, 3.0],
  'korean-air':     [3.5, 3.6, 3.8, 3.4, 3.9, 4.1, 3.3],
  asiana:           [3.4, 3.5, 3.7, 3.3, 3.8, 4.0, 3.2],
  'air-china':      [3.2, 3.4, 3.5, 3.1, 3.5, 3.8, 3.1],
  'china-eastern':  [3.1, 3.3, 3.4, 3.0, 3.4, 3.7, 3.0],
  'china-southern': [3.2, 3.3, 3.4, 3.1, 3.5, 3.8, 3.1],
  'air-canada':     [3.8, 4.0, 4.1, 3.9, 3.9, 4.1, 3.5],
  'air-india':      [3.0, 3.2, 3.1, 3.0, 3.2, 3.5, 3.0],
  'air-new-zealand':[4.2, 4.1, 4.3, 4.3, 4.2, 4.4, 3.9],
  qantas:           [4.0, 3.9, 4.2, 4.1, 4.1, 4.3, 3.7],
  finnair:          [3.9, 3.7, 4.2, 4.0, 4.0, 4.2, 3.7],
  'aer-lingus':     [3.7, 3.6, 3.9, 3.8, 3.8, 4.0, 3.5],
  iberia:           [3.5, 3.5, 3.7, 3.6, 3.7, 3.9, 3.4],
  tap:              [3.4, 3.4, 3.6, 3.5, 3.6, 3.8, 3.3],
  aegean:           [3.5, 3.3, 3.5, 3.6, 3.5, 3.8, 3.4],
  aeromexico:       [3.3, 3.4, 3.5, 3.3, 3.4, 3.7, 3.2],
  avianca:          [3.2, 3.3, 3.3, 3.2, 3.3, 3.6, 3.1],
  'copa-airlines':  [3.5, 3.6, 3.7, 3.5, 3.6, 3.9, 3.4],
  latam:            [3.4, 3.5, 3.6, 3.4, 3.5, 3.8, 3.3],
  // ── 日本の地域・グループ航空会社 ──
  'j-air':          [3.4, 3.0, 3.2, 3.6, 3.3, 3.4, 3.7],
  jta:              [3.3, 2.9, 3.1, 3.5, 3.2, 3.5, 3.8],
  jac:              [3.2, 2.7, 2.9, 3.4, 3.1, 3.3, 3.7],
  rac:              [3.2, 2.8, 2.9, 3.4, 3.1, 3.3, 3.8],
  hac:              [3.3, 2.8, 3.0, 3.5, 3.2, 3.4, 3.7],
  'ana-wings':      [3.5, 3.0, 3.3, 3.6, 3.5, 3.7, 3.5],
  airjapan:         [3.3, 3.2, 3.1, 3.4, 3.3, 3.7, 3.4],
  airdo:            [3.3, 2.7, 2.9, 3.5, 3.1, 3.5, 3.7],
  solaseed:         [3.4, 2.8, 3.0, 3.6, 3.2, 3.5, 3.7],
  starflyer:        [3.5, 3.0, 3.2, 3.7, 3.4, 3.6, 3.8],
  fda:              [3.3, 2.8, 2.9, 3.5, 3.1, 3.4, 3.8],
  ibex:             [3.2, 2.7, 2.8, 3.4, 3.0, 3.3, 3.7],
  'toki-air':       [3.1, 2.6, 2.7, 3.3, 2.9, 3.2, 3.6],
  orc:              [3.1, 2.6, 2.8, 3.3, 2.9, 3.2, 3.6],
  amx:              [3.0, 2.5, 2.7, 3.3, 2.8, 3.1, 3.5],
  'shin-central':   [2.9, 2.5, 2.6, 3.2, 2.8, 3.1, 3.4],
  'toho-air':       [2.9, 2.4, 2.5, 3.1, 2.7, 3.0, 3.3],
  'daiichi-air':    [2.8, 2.4, 2.5, 3.1, 2.7, 3.0, 3.3],
  'shin-nihon':     [2.9, 2.5, 2.6, 3.2, 2.8, 3.1, 3.4],
};
const DEFAULT_R = [3.5, 3.5, 3.5, 3.5, 3.5, 3.5, 3.5];

// ── Airline brand colors ────────────────────────────
const AIRLINE_COLORS = {
  ana:'#005BAC', jal:'#CC0000', skymark:'#009FE8', zipair:'#00A857',
  peach:'#FF6699', jetstar:'#FF6600', spring:'#E8521A',
  'j-air':'#CC0000', jta:'#CC0000', jac:'#CC0000',
  rac:'#003087', hac:'#005BAC', 'ana-wings':'#005BAC',
  airjapan:'#1DBF73', airdo:'#003366', solaseed:'#5EBD3E',
  starflyer:'#2B2D42', fda:'#E03A3E', ibex:'#003087',
  'toki-air':'#0099CC', orc:'#0055A0', amx:'#C8102E',
  'shin-central':'#003366', 'toho-air':'#0055A0',
  'daiichi-air':'#3366CC', 'shin-nihon':'#CC0033',
  delta:'#003DA5', united:'#005DAA', american:'#B61F23',
  southwest:'#304CB2', alaska:'#01426A',
  emirates:'#C6922A', qatar:'#5C0632', etihad:'#BD8B13',
  'riyadh-air':'#006B4D', singapore:'#F90B24', cathay:'#006564',
  lufthansa:'#FFAD00', 'air-france':'#002157', british:'#002157',
  klm:'#009FDB', swiss:'#D20000', turkish:'#E30A17',
  'korean-air':'#003087', asiana:'#003399',
  'air-china':'#CC0000', 'china-eastern':'#006CB8', 'china-southern':'#0066CC',
  'air-canada':'#D01D2A', 'air-india':'#C8102E',
  'air-new-zealand':'#00005C', qantas:'#EE1C25',
  finnair:'#003580', 'aer-lingus':'#006A4E', iberia:'#CC0000',
  tap:'#BD0000', aegean:'#003087', aeromexico:'#0E2B72',
  avianca:'#BC0F2C', 'copa-airlines':'#0033A0', latam:'#1C1D8C',
};

// ── Airline display codes (IATA-style) ─────────────
const AIRLINE_DISPLAY_CODE = {
  ana:'ANA', jal:'JAL', skymark:'SKY', zipair:'ZIP', peach:'APJ',
  jetstar:'JJP', spring:'SJO', 'j-air':'JAI', jta:'JTA', jac:'JAC',
  rac:'RAC', hac:'HAC', 'ana-wings':'AKX', airjapan:'AJX',
  airdo:'ADO', solaseed:'VJ', starflyer:'SFJ', fda:'FDA', ibex:'IBX',
  'toki-air':'TKI', orc:'ORC', amx:'AMX', 'shin-central':'SCA',
  'toho-air':'THA', 'daiichi-air':'DAI', 'shin-nihon':'SNA',
  delta:'DAL', united:'UAL', american:'AAL', southwest:'WN',
  alaska:'ASA', emirates:'EK', qatar:'QR', etihad:'EY',
  'riyadh-air':'RX', singapore:'SQ', cathay:'CX',
  lufthansa:'LH', 'air-france':'AF', british:'BA', klm:'KL',
  swiss:'LX', turkish:'TK', 'korean-air':'KE', asiana:'OZ',
  'air-china':'CA', 'china-eastern':'MU', 'china-southern':'CZ',
  'air-canada':'AC', 'air-india':'AI', 'air-new-zealand':'NZ',
  qantas:'QF', finnair:'AY', 'aer-lingus':'EI', iberia:'IB',
  tap:'TP', aegean:'A3', aeromexico:'AM', avianca:'AV',
  'copa-airlines':'CM', latam:'LA',
};
const CAT_SHORT = ['企業文化','年収・給与','福利厚生','人間関係','訓練環境','運航環境','スケジュール'];
const CAT_FULL  = ['企業カルチャー','年収・給与の納得度','福利厚生','職場の人間関係','訓練環境','運航環境','スケジュール安定性'];
const REVIEW_CATS = [
  {key:'salary',   label:'給与制度'},
  {key:'eval',     label:'評価制度'},
  {key:'benefits', label:'福利厚生'},
  {key:'wlb',      label:'ワークライフバランス'},
  {key:'ops',      label:'運航環境'},
  {key:'diversity',label:'ダイバーシティ'},
  {key:'mgmt',     label:'経営陣へ提案'},
];

function getAirlineRatings() {
  const seed = RATINGS[AIRLINE_CODE] || DEFAULT_R;
  try {
    const all = JSON.parse(localStorage.getItem('pv_reviews') || '[]');
    const mine = all.filter(r => r.airline === AIRLINE_CODE && Array.isArray(r.cats));
    if (!mine.length) return { ratings: seed.slice(), count: 0 };
    const blended = seed.map((s, i) => {
      const sum = mine.reduce((a, r) => a + (r.cats[i] || 0), 0);
      return +((s * 3 + sum) / (3 + mine.length)).toFixed(1);
    });
    return { ratings: blended, count: mine.length };
  } catch(e) { return { ratings: seed.slice(), count: 0 }; }
}

// ── Radar Chart SVG ────────────────────────────────
function buildRadar(ratings) {
  const n = 7, cx = 120, cy = 120, R = 88;
  const angles = Array.from({length:n}, (_, i) => -Math.PI/2 + i * 2*Math.PI/n);

  // Grid rings (0.2 … 1.0)
  const rings = [0.2,0.4,0.6,0.8,1.0].map(f => {
    const pts = angles.map(a => `${(cx+R*f*Math.cos(a)).toFixed(1)},${(cy+R*f*Math.sin(a)).toFixed(1)}`).join(' ');
    return `<polygon points="${pts}" fill="none" stroke="rgba(255,255,255,.07)" stroke-width="1"/>`;
  }).join('');

  // Axes
  const axes = angles.map(a =>
    `<line x1="${cx}" y1="${cy}" x2="${(cx+R*Math.cos(a)).toFixed(1)}" y2="${(cy+R*Math.sin(a)).toFixed(1)}" stroke="rgba(255,255,255,.07)" stroke-width="1"/>`
  ).join('');

  // Data polygon
  const dpts = ratings.map((v,i) => {
    const r = (v/5)*R;
    return `${(cx+r*Math.cos(angles[i])).toFixed(1)},${(cy+r*Math.sin(angles[i])).toFixed(1)}`;
  }).join(' ');

  // Labels + score numbers
  const PAD = 26;
  const lbls = CAT_SHORT.map((l,i) => {
    const lx = cx + (R+PAD)*Math.cos(angles[i]);
    const ly = cy + (R+PAD)*Math.sin(angles[i]);
    const anchor = lx < cx-4 ? 'end' : lx > cx+4 ? 'start' : 'middle';
    const score = ratings[i].toFixed(1);
    return `<text x="${lx.toFixed(1)}" y="${(ly-7).toFixed(1)}" text-anchor="${anchor}" dominant-baseline="middle" font-size="12" fill="rgba(255,255,255,.55)" font-family="Inter,Noto Sans JP,sans-serif">${l}</text>` +
           `<text x="${lx.toFixed(1)}" y="${(ly+8).toFixed(1)}" text-anchor="${anchor}" dominant-baseline="middle" font-size="11" fill="#f5c842" font-weight="700" font-family="Inter,sans-serif">${score}</text>`;
  }).join('');

  const dots = ratings.map((v,i) => {
    const r = (v/5)*R;
    return `<circle cx="${(cx+r*Math.cos(angles[i])).toFixed(1)}" cy="${(cy+r*Math.sin(angles[i])).toFixed(1)}" r="4" fill="#f5c842"/>`;
  }).join('');

  return `<svg class="radar-svg" viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg" overflow="visible">
    ${rings}${axes}
    <polygon points="${dpts}" fill="rgba(245,200,66,.15)" stroke="#f5c842" stroke-width="1.8" stroke-linejoin="round"/>
    ${dots}${lbls}
  </svg>`;
}

// ── Inject Rating Widget ───────────────────────────
function injectRatingWidget() {
  // Find overview section (first .glass with 概要 badge)
  let overviewSection = null;
  document.querySelectorAll('.glass').forEach(el => {
    const badge = el.querySelector('.section-badge');
    if (badge && badge.textContent.includes('概要') && !overviewSection) {
      overviewSection = el;
    }
  });
  if (!overviewSection) return;

  const {ratings, count} = getAirlineRatings();
  const avg = ratings.reduce((a,b)=>a+b,0) / ratings.length;
  const avgStr = avg.toFixed(1);
  const starsFilled = Math.round(avg);

  const starsHTML = Array.from({length:5}, (_,i) =>
    `<span class="rw-star${i >= starsFilled ? ' empty' : ''}">${i < starsFilled ? '★' : '☆'}</span>`
  ).join('');

  const barsHTML = CAT_FULL.map((label, i) => `
    <div class="cat-bar-row">
      <div class="cat-bar-label">${label}</div>
      <div class="cat-bar-track-rw"><div class="cat-bar-fill-rw" data-rw="${(ratings[i]/5*100).toFixed(0)}"></div></div>
      <div class="cat-bar-score-rw">${ratings[i].toFixed(1)}</div>
    </div>`).join('');

  const widget = document.createElement('div');
  widget.id = 'airline-rating-widget';
  widget.innerHTML = `
    <div class="rw-header">
      <div>
        <div style="font-size:.7rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#6b7d93;margin-bottom:6px">パイロット評価スコア</div>
        <div style="display:flex;align-items:baseline;gap:8px">
          <div class="rw-avg-score">${avgStr}</div>
          <div class="rw-max">/ 5.0</div>
        </div>
        <div class="rw-stars">${starsHTML}</div>
        <div class="rw-respondents">${count > 0 ? count + '件の口コミに基づく評価' : 'サンプルデータ — 口コミ投稿で更新'}</div>
      </div>
    </div>
    <div class="rw-grid">
      <div>${buildRadar(ratings)}</div>
      <div>${barsHTML}</div>
    </div>`;
  overviewSection.appendChild(widget);

  // Animate bars
  setTimeout(() => {
    widget.querySelectorAll('[data-rw]').forEach(b => { b.style.width = b.dataset.rw + '%'; });
  }, 350);
}

// ── SEO Meta Tags ───────────────────────────────────
function injectSEOMeta() {
  const h1 = document.querySelector('.hero-airline h1');
  const airlineName = h1 ? h1.textContent.trim() : (AIRLINE_CODE || '').toUpperCase();
  const subtitle = document.querySelector('.hero-airline p.text-muted, .hero-airline .text-muted');
  const englishName = subtitle ? subtitle.textContent.split('—')[0].trim() : '';
  const { ratings } = getAirlineRatings();
  const avg = (ratings.reduce((a,b)=>a+b,0)/ratings.length).toFixed(1);
  const desc = `${airlineName}のパイロット年収・転職情報。機長・副操縦士の給与、採用情報、現役パイロットによる口コミ・評価を掲載。${englishName ? englishName + 'の' : ''}パイロット年収・転職ならPILOT VALUE。`;
  const canonical = `https://pilot-value.com/airlines/${AIRLINE_CODE}.html`;
  const newTitle = `${airlineName}パイロット年収・転職情報｜機長・副操縦士の給与・口コミ | PILOT VALUE`;
  document.title = newTitle;

  const setMeta = (attr, key, val) => {
    let el = document.querySelector(`meta[${attr}="${key}"]`);
    if (!el) { el = document.createElement('meta'); el.setAttribute(attr, key); document.head.appendChild(el); }
    el.setAttribute('content', val);
  };

  setMeta('name', 'description', desc);
  setMeta('name', 'keywords', `${airlineName} パイロット 年収,${airlineName} 機長 年収,${airlineName} 転職,${airlineName} パイロット 口コミ,パイロット年収`);
  setMeta('name', 'robots', 'index,follow');
  setMeta('property', 'og:title', newTitle);
  setMeta('property', 'og:description', desc);
  setMeta('property', 'og:url', canonical);
  setMeta('property', 'og:type', 'article');
  setMeta('property', 'og:site_name', 'PILOT VALUE');
  setMeta('name', 'twitter:card', 'summary_large_image');
  setMeta('name', 'twitter:title', newTitle);
  setMeta('name', 'twitter:description', desc);

  let cl = document.querySelector('link[rel="canonical"]');
  if (!cl) { cl = document.createElement('link'); cl.rel = 'canonical'; document.head.appendChild(cl); }
  cl.href = canonical;
}

// ── Schema.org Structured Data (AggregateRating) ────
function injectSchemaOrg() {
  const h1 = document.querySelector('.hero-airline h1');
  const airlineName = h1 ? h1.textContent.trim() : (AIRLINE_CODE || '').toUpperCase();
  const { ratings, count } = getAirlineRatings();
  const avg = (ratings.reduce((a,b)=>a+b,0)/ratings.length).toFixed(1);
  const ratingCount = count > 0 ? count + 3 : 3;

  const pageUrl = `https://pilot-value.com/airlines/${AIRLINE_CODE}.html`;
  const schemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      'name': airlineName,
      'url': pageUrl,
      'aggregateRating': {
        '@type': 'AggregateRating',
        'ratingValue': avg,
        'bestRating': '5',
        'worstRating': '1',
        'ratingCount': ratingCount
      }
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        {'@type':'ListItem','position':1,'name':'PILOT VALUE','item':'https://pilot-value.com'},
        {'@type':'ListItem','position':2,'name':'世界の航空会社一覧','item':'https://pilot-value.com/world-airlines.html'},
        {'@type':'ListItem','position':3,'name':`${airlineName} パイロット年収`,'item': pageUrl}
      ]
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': [
        {
          '@type': 'Question',
          'name': `${airlineName}のパイロット年収はいくらですか？`,
          'acceptedAnswer': {'@type':'Answer','text':`${airlineName}のパイロット年収は、副操縦士で1,000〜1,600万円、機長で1,800〜2,800万円が目安です。PILOT VALUEでは現役パイロットによる口コミ・詳細な給与情報を掲載しています。`}
        },
        {
          '@type': 'Question',
          'name': `${airlineName}のパイロットに転職するには？`,
          'acceptedAnswer': {'@type':'Answer','text':`${airlineName}のパイロット採用は自社養成・経験者採用があります。必要資格・採用条件・年収・口コミについてはPILOT VALUEの${airlineName}ページをご覧ください。`}
        }
      ]
    }
  ];

  const script = document.createElement('script');
  script.id = 'pv-schema-org';
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(schemas);
  document.head.appendChild(script);

  // Update ratingCount async once Supabase resolves real review count
  (async () => {
    try {
      await _initSB();
      if (!_sb) return;
      const { count: sbCount } = await _sb.from('reviews').select('id', {count:'exact',head:true}).eq('airline', AIRLINE_CODE);
      if (sbCount > 0) {
        const el = document.getElementById('pv-schema-org');
        if (el) {
          const s = JSON.parse(el.textContent);
          s.aggregateRating.ratingCount = sbCount + 3;
          el.textContent = JSON.stringify(s);
        }
      }
    } catch(e) {}
  })();
}

// ── Hero Rating Banner (visible on page load) ───────
function injectHeroRatingBanner() {
  const hero = document.querySelector('.hero-airline');
  if (!hero) return;

  const h1 = document.querySelector('.hero-airline h1');
  const airlineName = h1 ? h1.textContent.trim() : (AIRLINE_CODE || '').toUpperCase();

  const {ratings, count} = getAirlineRatings();
  const avg = ratings.reduce((a,b)=>a+b,0) / ratings.length;
  const avgStr = avg.toFixed(1);
  const starsFilled = Math.round(avg);

  const starsHTML = Array.from({length:5}, (_,i) =>
    `<span class="hrb-star${i >= starsFilled ? ' empty' : ''}">${i < starsFilled ? '★' : '☆'}</span>`
  ).join('');

  const countLabel = count > 0 ? count + '名が回答' : 'サンプルデータ';

  const barsHTML = CAT_FULL.map((label, i) => `
    <div class="hrb-bar-row">
      <div class="hrb-bar-label">${label}</div>
      <div class="hrb-bar-track"><div class="hrb-bar-fill" data-hrb="${(ratings[i]/5*100).toFixed(0)}"></div></div>
      <div class="hrb-bar-score">${ratings[i].toFixed(1)}</div>
    </div>`).join('');

  const section = document.createElement('div');
  section.id = 'airline-rating-banner';
  section.innerHTML = `
    <div class="max-w-7xl mx-auto px-6">
      <div class="hrb-heading">パイロットによる評価スコア — ${airlineName}</div>
      <div class="hrb-inner">
        <div class="hrb-score-block">
          <div class="hrb-label">パイロット総合評価</div>
          <div class="hrb-score-row">
            <span class="hrb-avg">${avgStr}</span>
            <span class="hrb-max">/ 5.0</span>
          </div>
          <div class="hrb-stars">${starsHTML}</div>
          <div class="hrb-count">${countLabel}</div>
        </div>
        <div class="hrb-radar">${buildRadar(ratings)}</div>
        <div class="hrb-bars">${barsHTML}</div>
        <div class="hrb-cta">
          <a href="../community.html" class="btn-review-post">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            口コミを投稿する
          </a>
          <div class="hrb-cta-sub">匿名・無料</div>
        </div>
      </div>
    </div>`;

  hero.insertAdjacentElement('afterend', section);

  setTimeout(() => {
    section.querySelectorAll('[data-hrb]').forEach(b => { b.style.width = b.dataset.hrb + '%'; });
  }, 400);

  // Supabaseから実際の口コミ数を取得してカウントを更新
  (async () => {
    try {
      await _initSB();
      if (!_sb) return;
      const { count } = await _sb.from('reviews').select('id', {count:'exact',head:true}).eq('airline', AIRLINE_CODE);
      if (count > 0) {
        const el = section.querySelector('.hrb-count');
        if (el) el.textContent = count + '名が回答';
      }
    } catch(e) {}
  })();
}

// ── Seed reviews per airline ───────────────────────
// Fields: pos, years, join, avgRating, salaryTotal(万), monthly(万), overtime(万), bonus(万), comment, date
const SEED_REVIEWS = {
  ana:[
    {pos:'captain',years:'16-20',join:'new',avgRating:4.2,
     salaryTotal:2900,monthly:168,overtime:22,bonus:504,
     comment:'給与制度は年功序列が基本。B777国際線機長で各種手当含め¥3,000万超も可能。昇給は毎年着実に行われ安定感がある。賞与は業績連動型だが基本的に安定して支給される。退職金・企業年金が業界最高水準で生涯収入は申し分ない。訓練費は全額会社負担でキャリア形成コストが低いのも大きなメリット。機長昇格は12〜15年目安で審査は厳しいが基準は明確かつ公平。EF・家族航空券も充実。',
     date:'2026.03'},
    {pos:'fo',years:'6-10',join:'new',avgRating:3.8,
     salaryTotal:1900,monthly:100,overtime:15,bonus:260,
     comment:'副操縦士10年目で約¥1,900万。国際線乗務手当でさらにプラスになる。昇格待ちポジションが長く入社から15年近くかかる場合もあるのが唯一のデメリット。社宅・健康保険が充実しており航空身体検査サポートも万全。ワークライフバランスは比較的良好で休暇取得はしやすい環境。',
     date:'2026.02'},
    {pos:'captain',years:'11-15',join:'new',avgRating:3.6,
     salaryTotal:2600,monthly:150,overtime:18,bonus:376,
     comment:'中堅機長として安定した給与水準。B787で国際線に就航しており充実感がある。昇格までの道のりは長いが会社の安定性・ブランド力・退職後の生活を考えると納得できる選択。日本語環境で家族と一緒に日本に住めるのが最大のメリット。',
     date:'2026.01'},
  ],
  jal:[
    {pos:'captain',years:'16-20',join:'new',avgRating:4.0,
     salaryTotal:2800,monthly:162,overtime:20,bonus:472,
     comment:'A350国際線機長で約¥2,800万。ANA比でやや低めだが安定性は同等。昇格は年功主体だが実力評価も加わりつつある。EF・退職金は業界最高水準。ワークライフバランスも比較的良好で休暇申請は通りやすい。整備水準・運航環境ともに高く誇りを持って働ける職場。',
     date:'2026.03'},
    {pos:'fo',years:'1-5',join:'new',avgRating:3.6,
     salaryTotal:1000,monthly:55,overtime:10,bonus:140,
     comment:'初年度800万程度から毎年昇給。訓練費全額会社負担は非常に大きい。若手機長候補を伸ばす文化があり評価機会が定期的にある。社宅・寮完備で入社後すぐに安定した住環境が得られる。長期的に見れば日本でパイロットとして働く最高の選択肢のひとつ。',
     date:'2026.02'},
    {pos:'captain',years:'11-15',join:'mid',avgRating:3.5,
     salaryTotal:2500,monthly:145,overtime:15,bonus:340,
     comment:'中途入社のため昇給ペースは緩め。ただし安定性・ブランド力・退職後の待遇を考えると総合的に満足。運航環境は非常に良好で機材の整備水準も高い。家族と日本で安定して暮らせる環境が整っている。',
     date:'2026.01'},
  ],
  emirates:[
    {pos:'captain',years:'11-15',join:'mid',avgRating:4.3,
     salaryTotal:4200,monthly:240,overtime:0,bonus:720,
     comment:'UAE非課税＋住宅手当＋子供教育費支給で手取り実質¥4,000万超。日本の税引後と比較すると2倍近い水準。外国籍機長は実力主義で昇格もポジション次第で比較的早い。EF無制限・子供学費全額支給（3人まで）・住宅完全サポートと福利厚生は業界最高水準。砂漠の気候と英語環境への適応が必要だが経済的メリットは圧倒的。',
     date:'2026.03'},
    {pos:'fo',years:'6-10',join:'mid',avgRating:3.9,
     salaryTotal:2800,monthly:160,overtime:0,bonus:480,
     comment:'副操縦士でも非課税で実質¥2,500万超。各種手当豊富で生活レベルが高い。多国籍クルーとの乗務が刺激的。英語力が必須で入社前の準備が重要。住宅は会社提供でドバイの生活は快適だが物価は高め。家族帯同の場合は子供の学校選びに注意が必要。',
     date:'2026.01'},
    {pos:'captain',years:'6-10',join:'mid',avgRating:4.5,
     salaryTotal:4500,monthly:260,overtime:0,bonus:780,
     comment:'シニア機長クラスになると¥4,500万超も現実的。スケジュールは規則的ではないが収入面の満足度は非常に高い。ドバイというハブから世界中に飛べる点も魅力。A380乗務は特別な経験で他社では得られないキャリア。家族もドバイ生活に慣れれば充実した生活が送れる。',
     date:'2025.12'},
  ],
  delta:[
    {pos:'captain',years:'16-20',join:'mid',avgRating:4.8,
     salaryTotal:6500,monthly:370,overtime:30,bonus:1100,
     comment:'B777シニア機長で$420,000超。401k＋プロフィットシェアで年収がさらに上乗せ。シニオリティ制で入社年次が明確で公平。健康保険・ライフインシュアランスは業界一流。パスベネフィットで家族も世界中を移動できる。日本から見ると圧倒的な待遇水準で英語さえできれば挑戦する価値は十分にある。',
     date:'2026.03'},
    {pos:'fo',years:'6-10',join:'mid',avgRating:4.5,
     salaryTotal:3200,monthly:185,overtime:20,bonus:540,
     comment:'FO年収$200,000+。401k込みで日本の機長年収を超えることも珍しくない。シニオリティで昇格するため番号順で透明かつ公平。家族パス・医療保険は業界トップクラス。アメリカ生活に慣れれば非常に充実した環境。英語力とATEL取得が参入の壁だが乗り越える価値は十分。',
     date:'2026.02'},
    {pos:'captain',years:'11-15',join:'mid',avgRating:4.6,
     salaryTotal:5800,monthly:330,overtime:25,bonus:980,
     comment:'737/757機長として年収$380,000前後。シニオリティが上がるほど好条件の路線・スケジュールが選べる。年金・医療保険の充実度は他社を大きく上回る。職場の文化も前向きでプロフェッショナルな雰囲気が保たれている。',
     date:'2026.01'},
  ],
  united:[
    {pos:'captain',years:'16-20',join:'mid',avgRating:4.5,
     salaryTotal:7200,monthly:410,overtime:35,bonus:1220,
     comment:'B777シニア機長で$490,000超。毎年の昇給率が業界トップクラス。シニオリティ制度が明確でDeltaと同程度の昇格スピード。健康保険・年金充実。パスベネフィット利用可。シカゴ・ニューアーク等の主要ハブから国際線に多数就航しており路線選択の幅が広い。',
     date:'2026.02'},
    {pos:'fo',years:'6-10',join:'mid',avgRating:4.2,
     salaryTotal:3000,monthly:170,overtime:20,bonus:520,
     comment:'FO水準でも¥3,000万前後と日本の機長と同等以上。401k・プロフィットシェアが充実。シニオリティ制で昇格基準が明確。医療保険・ライフインシュアランスも一流。長期的にはシニア機長として$500,000+を目指せる魅力的なキャリアパス。',
     date:'2026.01'},
  ],
  southwest:[
    {pos:'captain',years:'11-15',join:'mid',avgRating:4.2,
     salaryTotal:5000,monthly:280,overtime:30,bonus:880,
     comment:'737機長で$350,000超。ボーナス・401kも手厚い。シニオリティ制で非常に公平かつ昇格基準が明確。家族全員フリーフライトは業界随一の福利厚生。文化的に最もオープンでポジティブな航空会社のひとつで従業員満足度が常にトップクラス。',
     date:'2026.03'},
  ],
  singapore:[
    {pos:'captain',years:'11-15',join:'mid',avgRating:4.0,
     salaryTotal:3800,monthly:210,overtime:15,bonus:660,
     comment:'シンガポールは物価が高いがSGDベース給与で円安メリットあり。ジャンプシート文化がなく機内のプロフェッショナリズムが高い。昇格は年功序列で安定。777機長クラスで¥3,500万〜¥4,000万水準。シンガポールという国際金融都市での生活は充実している。',
     date:'2026.02'},
  ],
  cathay:[
    {pos:'captain',years:'11-15',join:'mid',avgRating:3.8,
     salaryTotal:4000,monthly:220,overtime:20,bonus:700,
     comment:'香港ベースの給与体系でHKDベース。円安局面では実質的な収入アップがある。A350・B777の長距離国際線に多数就航しており機材経験が豊富。昇格は年功序列。住宅手当・EFも整備されている。香港の政情変化が唯一の懸念材料。',
     date:'2026.01'},
  ],
};

const GENERIC = [{
  pos:'captain',years:'11-15',join:'mid',avgRating:3.8,
  salaryTotal:0,monthly:0,overtime:0,bonus:0,
  comment:'給与体系は安定しており年次昇給も確実に実施される。機長昇格には一定の飛行時間と審査が必要だが基準は明確。基本的な福利厚生は整備されており働きやすい環境が整っている。詳しい年収データは掲載の年収レンジを参照してください。',
  date:'2026.03',
}];

function getSeedReviews() {
  return SEED_REVIEWS[AIRLINE_CODE] || GENERIC;
}

// ── Review Rendering ───────────────────────────────
function isUnlocked() {
  const e = localStorage.getItem('pv_unlock_expiry');
  return e && Date.now() < parseInt(e,10);
}
const POS_JP = {captain:'機長', fo:'副操縦士', cadet:'訓練生', former:'元乗務員'};
const JOIN_JP = {new:'新卒', mid:'中途'};

const TRUNCATE = 120;

function salaryTableHTML(r) {
  const fmt = v => v > 0 ? v + '万' : '—';
  return `<div class="rv-salary-table">
    <div class="rv-sal-cell"><div class="rv-sal-label">年収</div><div class="rv-sal-value">${fmt(r.salaryTotal)}</div></div>
    <div class="rv-sal-cell"><div class="rv-sal-label">月給（総額）</div><div class="rv-sal-value">${fmt(r.monthly)}</div></div>
    <div class="rv-sal-cell"><div class="rv-sal-label">残業代（月）</div><div class="rv-sal-value">${fmt(r.overtime)}</div></div>
    <div class="rv-sal-cell"><div class="rv-sal-label">賞与（年）</div><div class="rv-sal-value">${fmt(r.bonus)}</div></div>
  </div>`;
}

function reviewCardInnerHTML(r) {
  const comment = r.comment || r.payText || '';
  const preview = comment.slice(0, TRUNCATE);
  const hasMore = comment.length > TRUNCATE;
  const fullLen = comment.length;
  const score   = (r.avgRating || 3).toFixed(1);
  const filled  = Math.round(r.avgRating || 3);
  const stars   = Array.from({length:5}, (_,i) =>
    `<span class="${i < filled ? 'rv-stars' : 'rv-star-empty'}">★</span>`
  ).join('');
  const pos   = POS_JP[r.pos] || r.pos || '—';
  const join  = JOIN_JP[r.join] || r.join || '';
  const years = r.years || '—';
  const uid   = 'rv_' + Math.random().toString(36).slice(2);
  return `<div class="detail-review-card">
    <div class="rv-card-head">
      <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
        <span class="rv-card-type">${(REVIEW_CATS.find(function(c){return c.key===r.cat;})||{label:'口コミ'}).label}</span>
        <span class="rv-reviewer-meta">パイロット<span class="rv-meta-sep"> | </span>${pos}<span class="rv-meta-sep"> | </span>在籍${years}年目<span class="rv-meta-sep"> | </span>${join}入社</span>
      </div>
      <span class="rv-date">口コミ投稿日: ${r.date||''}</span>
    </div>
    <div class="rv-card-body">
      <div class="rv-stars-row">
        <span style="font-size:.95rem;letter-spacing:.04em">${stars}</span>
        <span class="rv-score">${score}</span>
      </div>
      ${salaryTableHTML(r)}
      <div class="rv-comment" id="${uid}_text">${preview}${hasMore ? '…' : ''}</div>
      ${hasMore ? `<button class="rv-read-more" id="${uid}_btn" onclick="pvReadMore('${uid}',${JSON.stringify(comment)})">続きを見る（全${fullLen}文字）</button>` : ''}
    </div>
  </div>`;
}

function reviewCardHTML(r, blurred) {
  const inner = reviewCardInnerHTML(r);
  if (!blurred) return `<div class="rv-card-wrap">${inner}</div>`;
  return `<div class="rv-card-wrap">
    <div class="rv-card-blur">${inner}</div>
    <div class="rv-card-gate">
      <button class="btn-review-post" onclick="openReviewModal()">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="flex-shrink:0"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        口コミを見る
      </button>
    </div>
  </div>`;
}

// ── Review Category Filter ──────────────────────────
var pvReviewCatFilter = 'all';
window.pvSetReviewCat = function(cat) {
  pvReviewCatFilter = cat;
  switchTab('reviews');
  renderReviews();
  setTimeout(function(){
    document.getElementById('airline-review-section')?.scrollIntoView({behavior:'smooth', block:'start'});
  }, 50);
};

// ── Auth helpers ───────────────────────────────────
function isLoggedIn() {
  try { return !!JSON.parse(localStorage.getItem('pv_user')); } catch(e) { return false; }
}

function pvReadMore(uid, fullText) {
  if (isUnlocked()) {
    var el = document.getElementById(uid+'_text');
    var btn = document.getElementById(uid+'_btn');
    if (el) el.textContent = fullText;
    if (btn) btn.style.display = 'none';
    return;
  }
  showReadMoreGate();
}

function showReadMoreGate() {
  var existing = document.getElementById('pv-readmore-gate');
  if (existing) { existing.style.display = 'flex'; return; }
  var modal = document.createElement('div');
  modal.id = 'pv-readmore-gate';
  modal.style.cssText = 'position:fixed;inset:0;z-index:9000;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.72);backdrop-filter:blur(4px)';
  modal.innerHTML = `
    <div style="background:#111620;border:1px solid rgba(245,200,66,.2);border-radius:18px;padding:36px 32px;max-width:380px;width:90%;text-align:center;position:relative">
      <button onclick="document.getElementById('pv-readmore-gate').style.display='none'" style="position:absolute;top:12px;right:14px;background:none;border:none;color:#6b7d93;cursor:pointer;font-size:1.1rem;line-height:1">✕</button>
      <div style="font-size:2.2rem;margin-bottom:12px">🔒</div>
      <div style="font-weight:700;font-size:1rem;margin-bottom:8px;color:#e8edf2">続きを読むには口コミの投稿が必要です</div>
      <p style="font-size:.82rem;color:#6b7d93;line-height:1.65;margin-bottom:22px">自分の年収・口コミを1件投稿すると<br>全てのレビュー全文を<strong style="color:#e8edf2">1ヶ月間</strong>閲覧できます</p>
      <div style="display:flex;flex-direction:column;gap:10px">
        <button class="btn-review-post" style="width:100%;justify-content:center" onclick="openReviewModal()">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="flex-shrink:0"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
          口コミを投稿して解放する
        </button>
        ${!isLoggedIn() ? `<a href="../login.html" style="color:#6b7d93;font-size:.78rem;text-decoration:underline;text-underline-offset:2px">既にアカウントをお持ちの方はログイン</a>` : ''}
      </div>
      <div style="font-size:.71rem;color:#6b7d93;margin-top:10px">完全無料・匿名・個人情報不要</div>
    </div>`;
  modal.addEventListener('click', function(e){ if(e.target===modal) modal.style.display='none'; });
  document.body.appendChild(modal);
}

// ── Inline Review Modal (3-step) ───────────────────
window.openReviewModal = function() {
  var existing = document.getElementById('pv-review-modal');
  if (existing) { existing.style.display = 'flex'; return; }

  var MODAL_CATS = ['企業カルチャー','年収・給与の納得度','福利厚生','職場の人間関係の満足度','訓練環境','運航環境','スケジュール変更の多さ'];
  var YEARS_OPTS = [['1-3','1〜3年目'],['4-7','4〜7年目'],['8-12','8〜12年目'],['13-17','13〜17年目'],['16-20','16〜20年目'],['21+','21年以上']];
  var step = 1;
  var pos = '', years = '', join = '', cat = '';
  var stars = [0,0,0,0,0,0,0];
  var salary = 0, monthly = 0, overtime = 0, bonus = 0;
  var commentText = '';

  var overlay = document.createElement('div');
  overlay.id = 'pv-review-modal';
  overlay.style.cssText = 'position:fixed;inset:0;z-index:9999;display:flex;align-items:flex-start;justify-content:center;background:rgba(0,0,0,.78);backdrop-filter:blur(6px);padding:24px 16px;overflow-y:auto';
  overlay.addEventListener('click', function(e){ if(e.target===overlay) overlay.style.display='none'; });
  document.body.appendChild(overlay);

  function render() {
    var dots = [1,2,3].map(function(n){
      return '<span style="width:9px;height:9px;border-radius:50%;display:inline-block;background:'+(n<=step?'#f5c842':'rgba(255,255,255,.18)')+'"></span>';
    }).join('');

    var content = '';
    if (step === 1) {
      var starsHtml = MODAL_CATS.map(function(lbl, ci){
        var row = [1,2,3,4,5].map(function(n){
          return '<span class="rmt-star" data-cat="'+ci+'" data-val="'+n+'" style="font-size:1.6rem;cursor:pointer;user-select:none;color:'+(n<=stars[ci]?'#f5c842':'rgba(255,255,255,.18)')+'">★</span>';
        }).join('');
        return '<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid rgba(255,255,255,.06)"><span style="font-size:.83rem;color:#c8d4e0">'+lbl+'</span><div data-catrow="'+ci+'">'+row+'</div></div>';
      }).join('');
      var posHtml = ['captain','fo','cadet'].map(function(v){
        var lbl = {captain:'機長',fo:'副操縦士',cadet:'訓練生'}[v];
        return '<button type="button" class="rmt-pill'+(pos===v?' active':'')+'" data-field="pos" data-val="'+v+'">'+lbl+'</button>';
      }).join('');
      var joinHtml = ['new','mid'].map(function(v){
        var lbl = {new:'新卒',mid:'中途'}[v];
        return '<button type="button" class="rmt-pill'+(join===v?' active':'')+'" data-field="join" data-val="'+v+'">'+lbl+'</button>';
      }).join('');
      var yearsHtml = YEARS_OPTS.map(function(y){
        return '<option value="'+y[0]+'"'+(years===y[0]?' selected':'')+'>'+y[1]+'</option>';
      }).join('');
      var reviewCatHtml = REVIEW_CATS.map(function(c){
        return '<button type="button" class="rmt-pill'+(cat===c.key?' active':'')+'" data-field="cat" data-val="'+c.key+'">'+c.label+'</button>';
      }).join('');

      content = '<h2 style="font-size:1.2rem;font-weight:800;margin-bottom:4px">Step 1 — 基本情報と評価</h2>'
        +'<p style="font-size:.78rem;color:#7b8fa3;margin-bottom:20px">口コミカテゴリ・職位を選び、7項目を★で評価してください。</p>'
        +'<div style="margin-bottom:14px"><div style="font-size:.73rem;color:#7b8fa3;margin-bottom:7px">口コミカテゴリ</div><div style="display:flex;gap:7px;flex-wrap:wrap">'+reviewCatHtml+'</div></div>'
        +'<div style="margin-bottom:14px"><div style="font-size:.73rem;color:#7b8fa3;margin-bottom:7px">職位</div><div style="display:flex;gap:7px;flex-wrap:wrap">'+posHtml+'</div></div>'
        +'<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px">'
        +'<div><div style="font-size:.73rem;color:#7b8fa3;margin-bottom:5px">何年目</div>'
        +'<select id="rmt-years" style="width:100%;padding:9px 10px;background:#1a2133;border:1px solid rgba(255,255,255,.12);border-radius:8px;color:#e8edf2;font-size:.83rem"><option value="">選択してください</option>'+yearsHtml+'</select></div>'
        +'<div><div style="font-size:.73rem;color:#7b8fa3;margin-bottom:7px">入社形態</div><div style="display:flex;gap:7px">'+joinHtml+'</div></div></div>'
        +'<div style="font-size:.78rem;font-weight:700;margin-bottom:2px">7項目評価（必須）</div>'
        +'<div style="font-size:.71rem;color:#7b8fa3;margin-bottom:6px">各カテゴリを★1〜5でタップ</div>'
        +starsHtml;
    } else if (step === 2) {
      var fields = [['年間収入（万円）','rmt-salary',salary],['月給基本給（万円）','rmt-monthly',monthly],['残業代 月平均（万円）','rmt-overtime',overtime],['ボーナス 年間（万円）','rmt-bonus',bonus]];
      content = '<h2 style="font-size:1.2rem;font-weight:800;margin-bottom:4px">Step 2 — 年収情報</h2>'
        +'<p style="font-size:.78rem;color:#7b8fa3;margin-bottom:20px">わかる範囲でご記入ください（任意）</p>'
        +fields.map(function(f){
          return '<div style="margin-bottom:13px"><label style="font-size:.76rem;color:#7b8fa3;display:block;margin-bottom:5px">'+f[0]+'</label>'
            +'<input id="'+f[1]+'" type="number" min="0" max="99999" value="'+(f[2]||'')+'" placeholder="例: 1200" style="width:100%;padding:9px 12px;background:#1a2133;border:1px solid rgba(255,255,255,.12);border-radius:8px;color:#e8edf2;font-size:.88rem;box-sizing:border-box"></div>';
        }).join('');
    } else {
      content = '<h2 style="font-size:1.2rem;font-weight:800;margin-bottom:4px">Step 3 — 口コミ</h2>'
        +'<p style="font-size:.78rem;color:#7b8fa3;margin-bottom:14px">給与・待遇・職場環境など自由にご記入ください</p>'
        +'<textarea id="rmt-comment" placeholder="例: 年功序列の給与体系で安定感があります…" rows="7" style="width:100%;padding:12px 14px;background:#1a2133;border:1px solid rgba(255,255,255,.12);border-radius:8px;color:#e8edf2;font-size:.84rem;line-height:1.65;box-sizing:border-box;resize:vertical">'+commentText+'</textarea>'
        +'<div style="font-size:.7rem;color:#7b8fa3;margin-top:7px">完全匿名・個人情報不要</div>';
    }

    overlay.innerHTML = '<div style="background:#111620;border:1px solid rgba(255,255,255,.09);border-radius:20px;padding:28px 24px;width:100%;max-width:460px;position:relative;margin:auto">'
      +'<button onclick="document.getElementById(\'pv-review-modal\').style.display=\'none\'" style="position:absolute;top:12px;right:14px;background:rgba(255,255,255,.07);border:none;color:#9daec4;cursor:pointer;font-size:.95rem;width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;line-height:1">✕</button>'
      +'<div style="display:flex;gap:6px;align-items:center;margin-bottom:22px">'+dots+'</div>'
      +content
      +'<button id="rmt-next" style="margin-top:20px;width:100%;padding:13px;background:linear-gradient(135deg,#f5c842,#f0a500);border:none;border-radius:10px;color:#1a1500;font-weight:800;font-size:.92rem;cursor:pointer">'+(step===3?'投稿して口コミを見る →':'次へ →')+'</button>'
      +'</div>';

    // Pill toggles
    overlay.querySelectorAll('.rmt-pill').forEach(function(btn){
      btn.addEventListener('click', function(){
        if(btn.dataset.field==='pos') pos=btn.dataset.val;
        else if(btn.dataset.field==='join') join=btn.dataset.val;
        else if(btn.dataset.field==='cat') cat=btn.dataset.val;
        render();
      });
    });

    // Star ratings
    overlay.querySelectorAll('.rmt-star').forEach(function(s){
      s.addEventListener('click', function(){ stars[+s.dataset.cat]=+s.dataset.val; render(); });
      s.addEventListener('mouseenter', function(){
        var ci=+s.dataset.cat, v=+s.dataset.val;
        overlay.querySelectorAll('[data-catrow="'+ci+'"] .rmt-star').forEach(function(x){ x.style.color=+x.dataset.val<=v?'#f5c842':'rgba(255,255,255,.18)'; });
      });
      s.addEventListener('mouseleave', function(){
        var ci=+s.dataset.cat;
        overlay.querySelectorAll('[data-catrow="'+ci+'"] .rmt-star').forEach(function(x){ x.style.color=+x.dataset.val<=stars[ci]?'#f5c842':'rgba(255,255,255,.18)'; });
      });
    });

    // Years select
    var ysel=overlay.querySelector('#rmt-years');
    if(ysel) ysel.addEventListener('change', function(){ years=ysel.value; });

    // Next / Submit
    overlay.querySelector('#rmt-next').addEventListener('click', function(){
      if(step===1){
        if(stars.every(function(v){return v===0;})){ alert('7項目を★でタップして評価してください'); return; }
        step=2; render();
      } else if(step===2){
        salary=parseFloat(overlay.querySelector('#rmt-salary').value)||0;
        monthly=parseFloat(overlay.querySelector('#rmt-monthly').value)||0;
        overtime=parseFloat(overlay.querySelector('#rmt-overtime').value)||0;
        bonus=parseFloat(overlay.querySelector('#rmt-bonus').value)||0;
        step=3; render();
      } else {
        commentText=(overlay.querySelector('#rmt-comment').value||'').trim();
        submitReview();
      }
    });
  }

  async function submitReview() {
    var avg = stars.reduce(function(a,b){return a+b;},0)/stars.length;
    var now = Date.now();
    var review = {
      airline:AIRLINE_CODE, position:pos||'fo', years:years||'1-3', join:join||'new',
      avgRating:+avg.toFixed(2), salary:salary, monthly:monthly, overtime:overtime, bonus:bonus,
      comment:commentText||'(口コミなし)', cat:cat, ts:now
    };
    try {
      var all = JSON.parse(localStorage.getItem('pv_reviews')||'[]');
      all.unshift(review);
      localStorage.setItem('pv_reviews', JSON.stringify(all));
    } catch(e){}
    localStorage.setItem('pv_unlock_expiry', (now+30*24*60*60*1000).toString());
    try {
      await _initSB();
      if(_sb){
        await _sb.from('reviews').insert({
          airline:AIRLINE_CODE, position:pos||'fo', years:years||'1-3', join_type:join||'new',
          avg_rating:avg, salary_total:salary, monthly:monthly, overtime:overtime, bonus:bonus,
          comment:commentText||'(口コミなし)',
          cat1:stars[0],cat2:stars[1],cat3:stars[2],cat4:stars[3],cat5:stars[4],cat6:stars[5],cat7:stars[6]
        });
      }
    } catch(e){}
    overlay.style.display = 'none';
    switchTab('reviews');
    document.getElementById('airline-review-section')?.scrollIntoView({behavior:'smooth',block:'start'});
  }

  render();
};

async function renderReviews() {
  const section = document.getElementById('airline-review-section');
  if (!section) return;

  // シードデータ + localStorage をベースに即時描画
  let reviews = getSeedReviews();
  try {
    const all = JSON.parse(localStorage.getItem('pv_reviews')||'[]');
    const mine = all.filter(r => r.airline === AIRLINE_CODE).map(r => ({
      pos: r.position, years: r.years||r.experience||'—', join: r.join||'',
      avgRating: r.avgRating||r.rating||3,
      comment: r.payText||r.comment||'',
      salaryTotal: r.salary||0, monthly: r.monthly||0, overtime: r.overtime||0, bonus: r.bonus||0,
      cat: r.cat||'',
      date: new Date(r.ts).toLocaleDateString('ja-JP',{year:'numeric',month:'2-digit'}).replace('/','.',).slice(0,7),
    }));
    reviews = [...mine, ...reviews];
  } catch(e){}

  function paint(revList) {
    const unlocked = isUnlocked();
    const filtered = pvReviewCatFilter !== 'all'
      ? revList.filter(r => r.cat === pvReviewCatFilter)
      : revList;
    const cardsHTML = filtered.map((r, i) => reviewCardHTML(r, i > 0 && !unlocked)).join('');
    const chipsHTML = [{key:'all',label:'全て'}].concat(REVIEW_CATS).map(c =>
      `<button class="rcf-chip${pvReviewCatFilter===c.key?' active':''}" onclick="pvSetReviewCat('${c.key}')">${c.label}</button>`
    ).join('');
    const emptyMsg = filtered.length === 0
      ? `<div style="text-align:center;padding:32px 0;color:#6b7d93;font-size:.85rem">このカテゴリの口コミはまだありません。<br>最初の口コミを投稿してみましょう。</div>` : '';
    const postGate = !unlocked ? `
      <div class="rv-post-gate">
        <div style="font-size:.85rem;font-weight:700;margin-bottom:6px">全ての口コミを解放する</div>
        <p style="font-size:.78rem;color:#6b7d93;margin-bottom:14px">自分の年収・口コミを1件投稿すると全データを<strong>1ヶ月間</strong>無料で閲覧できます</p>
        <button class="btn-review-post" onclick="openReviewModal()">口コミを投稿して解放する →</button>
        <div style="font-size:.72rem;color:#6b7d93;margin-top:8px">完全無料・匿名・個人情報不要</div>
      </div>` : '';
    section.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;flex-wrap:wrap;gap:8px">
        <h2 style="font-size:1.2rem;font-weight:700">口コミ一覧</h2>
        <button class="btn-review-post" style="font-size:.8rem;padding:8px 18px" onclick="openReviewModal()">＋ 口コミを投稿する</button>
      </div>
      <div class="rcf-chips">${chipsHTML}</div>
      ${cardsHTML}${emptyMsg}
      ${postGate}`;
  }

  paint(reviews); // まず即時表示

  // Supabaseから本物の口コミを取得して上書き
  try {
    await _initSB();
    if (!_sb) return;
    const { data: sbRevs } = await _sb.from('reviews')
      .select('*')
      .eq('airline', AIRLINE_CODE)
      .order('created_at', {ascending: false});
    if (sbRevs && sbRevs.length > 0) {
      const sbFormatted = sbRevs.map(r => ({
        pos: r.position, years: r.years||'—', join: r.join_type||'',
        avgRating: r.avg_rating||3,
        comment: r.comment||'',
        salaryTotal: r.salary_total||0, monthly: r.monthly||0,
        overtime: r.overtime||0, bonus: r.bonus||0,
        cat: r.review_cat||'',
        date: r.created_at ? new Date(r.created_at).toLocaleDateString('ja-JP',{year:'numeric',month:'2-digit'}).replace('/','.',).slice(0,7) : '',
      }));
      // Supabaseの実データ + シードデータをマージ（実データを先頭に）
      paint([...sbFormatted, ...getSeedReviews()]);

      // ログイン済みユーザーが口コミ投稿済みならunlockを更新
      const { data:{ session } } = await _sb.auth.getSession();
      if (session) {
        const { data: myRevs } = await _sb.from('reviews').select('id').eq('user_id', session.user.id).limit(1);
        if (myRevs?.length) localStorage.setItem('pv_unlock_expiry', (Date.now()+30*24*60*60*1000).toString());
      }
    }
  } catch(e) { /* Supabase失敗時はシードデータを表示したまま */ }
}

// ── Tab System ─────────────────────────────────────
let activeTab = 'overview';

function assignTabSections() {
  document.querySelectorAll('.glass').forEach(el => {
    const badge = el.querySelector('.section-badge');
    if (!badge) return;
    const txt = badge.textContent;
    if (/年収/.test(txt))                          el.dataset.tabSection = 'salary';
    else if (/募集|採用|求人/.test(txt))           el.dataset.tabSection = 'jobs';
    else                                           el.dataset.tabSection = 'overview';
  });
}

function switchTab(tab) {
  activeTab = tab;
  document.querySelectorAll('.airline-tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tab);
  });
  document.querySelectorAll('[data-tab-section]').forEach(el => {
    el.style.display = el.dataset.tabSection === tab ? '' : 'none';
  });
  const rs = document.getElementById('airline-review-section');
  if (rs) {
    rs.style.display = tab === 'reviews' ? 'block' : 'none';
    if (tab === 'reviews') renderReviews();
  }
}

// ── Count reviews for badge ────────────────────────
function reviewCount() {
  let n = (SEED_REVIEWS[AIRLINE_CODE] || GENERIC).length;
  try {
    const all = JSON.parse(localStorage.getItem('pv_reviews')||'[]');
    n += all.filter(r => r.airline === AIRLINE_CODE).length;
  } catch(e){}
  return n;
}

// ── Review Category Grid ────────────────────────────
function injectReviewCategoryGrid() {
  const banner = document.getElementById('airline-rating-banner');
  if (!banner) return;

  const h1 = document.querySelector('.hero-airline h1');
  const airlineName = h1 ? h1.textContent.trim() : '';
  const cnt = reviewCount();

  const CAT_ICONS = [
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.68 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.17h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.27a16 16 0 0 0 5.82 5.82l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
  ];

  const chevron = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>';

  const cardsHTML = REVIEW_CATS.map((c, i) => `
    <button class="rcg-card" onclick="pvSetReviewCat('${c.key}')">
      <span class="rcg-icon">${CAT_ICONS[i]}</span>
      <span class="rcg-label">${c.label}</span>
      <span class="rcg-count">${cnt}件</span>
      <span class="rcg-chevron">${chevron}</span>
    </button>`).join('');

  const section = document.createElement('div');
  section.id = 'airline-review-cats';
  section.innerHTML = `
    <div class="max-w-7xl mx-auto px-6 py-6">
      <div class="rcg-heading">カテゴリ別のパイロット口コミ（${cnt}件）<span class="rcg-airline"> — ${airlineName}</span></div>
      <div class="rcg-grid">${cardsHTML}</div>
    </div>`;

  banner.insertAdjacentElement('afterend', section);
}

// ── DOM Ready ──────────────────────────────────────
document.addEventListener('DOMContentLoaded', function() {
  assignTabSections();

  // ── Login button injection ──────────────────────
  var navRight = document.querySelector('#main-nav .flex.items-center.gap-3');
  if (navRight) {
    var authBtn = document.createElement('a');
    authBtn.id = 'nav-auth-btn';
    try {
      var u = JSON.parse(localStorage.getItem('pv_user') || 'null');
      if (u && u.name) {
        authBtn.href = '../profile.html';
        authBtn.textContent = u.name.replace(/[\s　].*/, ''); // first name
        authBtn.className = 'hidden md:inline-flex';
        authBtn.style.cssText = 'font-size:.82rem;font-weight:700;color:#f5c842;padding:7px 0;text-decoration:none;letter-spacing:.01em';
      } else {
        authBtn.href = '../login.html';
        authBtn.textContent = 'ログイン';
        authBtn.className = 'btn-ghost hidden md:inline-flex';
        authBtn.style.cssText = 'font-size:.82rem;padding:7px 14px';
      }
    } catch(e2) {
      authBtn.href = '../login.html';
      authBtn.textContent = 'ログイン';
      authBtn.className = 'btn-ghost hidden md:inline-flex';
      authBtn.style.cssText = 'font-size:.82rem;padding:7px 14px';
    }
    var lastChild = navRight.lastElementChild;
    navRight.insertBefore(authBtn, lastChild);
  }

  // Inject tab nav
  const mainDiv = document.querySelector('.max-w-7xl.mx-auto.px-6.pb-24');
  if (mainDiv) {
    const tabNav = document.createElement('div');
    tabNav.id = 'airline-tab-nav';
    const cnt = reviewCount();
    tabNav.innerHTML = `<div class="airline-tab-scroll max-w-7xl mx-auto px-6">
      <button class="airline-tab-btn active" data-tab="overview">企業トップ</button>
      <button class="airline-tab-btn" data-tab="reviews">口コミ<span class="atab-count">${cnt}</span></button>
      <button class="airline-tab-btn" data-tab="salary">年収・給与</button>
      <button class="airline-tab-btn" data-tab="jobs">求人情報</button>
    </div>`;
    mainDiv.parentNode.insertBefore(tabNav, mainDiv);

    // Insert review section at top of main content
    const reviewDiv = document.createElement('div');
    reviewDiv.id = 'airline-review-section';
    mainDiv.insertBefore(reviewDiv, mainDiv.firstChild);
  }

  // Bind tab buttons
  document.querySelectorAll('.airline-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  // Inject hero rating banner (visible on page load)
  injectHeroRatingBanner();
  injectReviewCategoryGrid();

  // SEO meta tags + Schema.org
  injectSEOMeta();
  injectSchemaOrg();

  // Auto-open reviews tab if URL has #reviews
  if (location.hash === '#reviews') {
    setTimeout(() => {
      switchTab('reviews');
      document.getElementById('airline-review-section')?.scrollIntoView({behavior:'smooth', block:'start'});
    }, 300);
  }

  // Init
  switchTab('overview');
});

})(); // end IIFE

/* ─── Hamburger / Mobile Drawer ──────────────────── */
(function(){
  var P = '../';

  function inject() {
    if (document.getElementById('pv-ham-btn')) return;
    var nav = document.getElementById('main-nav');
    if (!nav) return;

    var s = document.createElement('style');
    s.textContent = [
      '.pv-ham-btn{display:none;flex-direction:column;justify-content:center;align-items:center;width:38px;height:38px;gap:5px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.12);border-radius:10px;cursor:pointer;transition:background .2s;flex-shrink:0;padding:0}',
      '.pv-ham-btn:hover{background:rgba(255,255,255,.13)}',
      '[data-theme=light] .pv-ham-btn{background:rgba(0,0,0,.06);border-color:rgba(0,0,0,.12)}',
      '[data-theme=light] .pv-ham-btn:hover{background:rgba(0,0,0,.11)}',
      '.pv-ham-line{width:18px;height:1.8px;border-radius:1px;background:rgba(255,255,255,.75);transition:transform .3s,opacity .3s;display:block}',
      '[data-theme=light] .pv-ham-line{background:rgba(15,23,42,.7)}',
      '#pv-nav-overlay{position:fixed;inset:0;z-index:190;background:rgba(0,0,0,.55);opacity:0;pointer-events:none;transition:opacity .3s}',
      '#pv-nav-overlay.open{opacity:1;pointer-events:all}',
      '#pv-nav-drawer{position:fixed;top:0;right:0;bottom:0;z-index:195;width:270px;max-width:82vw;background:#0d1117;border-left:1px solid rgba(255,255,255,.08);transform:translateX(100%);transition:transform .35s cubic-bezier(.16,1,.3,1);overflow-y:auto}',
      '[data-theme=light] #pv-nav-drawer{background:#f4f6f9;border-left-color:rgba(0,0,0,.09)}',
      '#pv-nav-drawer.open{transform:translateX(0)}',
      '.pv-nd-head{display:flex;align-items:center;justify-content:space-between;height:72px;padding:0 20px;border-bottom:1px solid rgba(255,255,255,.07)}',
      '[data-theme=light] .pv-nd-head{border-bottom-color:rgba(0,0,0,.08)}',
      '.pv-nd-logo{height:30px;width:auto}',
      '.pv-nd-close{width:34px;height:34px;border-radius:8px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);color:rgba(255,255,255,.6);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:background .2s;flex-shrink:0}',
      '[data-theme=light] .pv-nd-close{background:rgba(0,0,0,.06);border-color:rgba(0,0,0,.1);color:rgba(15,23,42,.6)}',
      '.pv-nd-close:hover{background:rgba(255,255,255,.13)}',
      '.pv-nd-links{padding:8px 0}',
      '.pv-nd-link{display:flex;align-items:center;padding:15px 24px;font-size:.95rem;font-weight:600;color:rgba(255,255,255,.75);text-decoration:none;border-bottom:1px solid rgba(255,255,255,.05);transition:background .15s,color .15s}',
      '[data-theme=light] .pv-nd-link{color:rgba(15,23,42,.75);border-bottom-color:rgba(0,0,0,.06)}',
      '.pv-nd-link:hover{background:rgba(255,255,255,.05);color:#fff}',
      '[data-theme=light] .pv-nd-link:hover{background:rgba(0,0,0,.04);color:#0f172a}',
      '.pv-nd-login{display:block;margin:16px 20px;padding:13px;border-radius:10px;text-align:center;font-size:.9rem;font-weight:700;text-decoration:none;background:linear-gradient(135deg,rgba(249,115,22,.1),rgba(245,200,66,.1));border:1px solid rgba(245,200,66,.28);color:#f5c842;transition:background .2s}',
      '[data-theme=light] .pv-nd-login{color:#a07200;border-color:rgba(160,114,0,.28);background:rgba(160,114,0,.07)}',
      '.pv-nd-login:hover{background:linear-gradient(135deg,rgba(249,115,22,.2),rgba(245,200,66,.2))}',
      '.pv-ham-btn{display:flex}',
    ].join('');
    document.head.appendChild(s);

    var overlay = document.createElement('div');
    overlay.id = 'pv-nav-overlay';
    document.body.appendChild(overlay);

    var drawer = document.createElement('div');
    drawer.id = 'pv-nav-drawer';
    drawer.innerHTML =
      '<div class="pv-nd-head">' +
        '<a href="' + P + 'index.html"><img src="' + P + 'baland_ass/\u30ed\u30b4\u30a4\u30e1\u30fc\u30b8.png" alt="PILOT VALUE" class="pv-nd-logo"/></a>' +
  '' +
      '</div>' +
      '<div class="pv-nd-links">' +
        '<a href="' + P + 'world-airlines.html" class="pv-nd-link">\u4e16\u754c\u306e\u822a\u7a7a\u4f1a\u793e</a>' +
        '<a href="' + P + 'index.html#compare" class="pv-nd-link">\u65e5\u672c vs \u6d77\u5916</a>' +
        '<a href="' + P + 'index.html#ranking" class="pv-nd-link">\u5e74\u53ce\u30e9\u30f3\u30ad\u30f3\u30b0</a>' +
        '<a href="' + P + 'index.html#jobs" class="pv-nd-link">\u6c42\u4eba\u60c5\u5831</a>' +
        '<a href="' + P + 'community.html" class="pv-nd-link">\u30b3\u30df\u30e5\u30cb\u30c6\u30a3</a>' +
      '</div>' +
      '<a href="' + P + 'login.html" class="pv-nd-login" id="pv-nd-login-lnk">\u30ed\u30b0\u30a4\u30f3</a>';
    document.body.appendChild(drawer);

    var btn = document.createElement('button');
    btn.className = 'pv-ham-btn';
    btn.id = 'pv-ham-btn';
    btn.setAttribute('aria-label', '\u30e1\u30cb\u30e5\u30fc');
    btn.innerHTML = '<span class="pv-ham-line"></span><span class="pv-ham-line"></span><span class="pv-ham-line"></span>';

    var rights = nav.querySelectorAll('.flex.items-center');
    var right = rights[rights.length - 1];
    if (right) right.appendChild(btn);

    function openD() { drawer.classList.add('open'); overlay.classList.add('open'); document.body.style.overflow = 'hidden'; }
    function closeD() { drawer.classList.remove('open'); overlay.classList.remove('open'); document.body.style.overflow = ''; }

    btn.addEventListener('click', function(){ drawer.classList.contains('open') ? closeD() : openD(); });
    overlay.addEventListener('click', closeD);
    drawer.querySelectorAll('.pv-nd-link').forEach(function(a){ a.addEventListener('click', closeD); });

    try {
      var u = JSON.parse(localStorage.getItem('pv_user') || 'null');
      var lnk = document.getElementById('pv-nd-login-lnk');
      if (u && u.name && lnk) { lnk.textContent = u.name.replace(/[\s\u3000].*/, ''); lnk.href = P + 'profile.html'; }
    } catch(e) {}
  }

  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', inject); } else { inject(); }
})();
