// ================================================================
// tools.js — Инструменты: калькулятор, ASCII-таблица, live-панель,
//            движок квиза, 3D-анимация фона
// Автор: [имя участника]
// Отвечает за: toggleCalc(), calcEval(), filterAscii(),
//              updateLivePanel(), buildQuiz(), init3DCanvas()
// ================================================================

/* ====================================================== CALCULATOR ====================================================== */
function toggleCalc(){
  calcOpen=!calcOpen;
  const fab=document.getElementById('calc-fab');
  const panel=document.getElementById('calc-panel');
  if(calcOpen){panel.classList.add('open');fab.classList.add('open');}
  else{panel.classList.remove('open');fab.classList.remove('open');}
  click();
}
function calcInput(v){calcExpr+=v;updateCalcDisp();}
function calcDel(){calcExpr=calcExpr.slice(0,-1);updateCalcDisp();}
function calcClear(){calcExpr='';document.getElementById('cp-result').textContent='0';updateCalcDisp();}
function updateCalcDisp(){document.getElementById('cp-expr').textContent=calcExpr;}

function calcEval(){
  if(!calcExpr)return;
  try{
    // Replace variables with actual values
    let expr=calcExpr;
    if(PR.p)expr=expr.replaceAll('p',PR.p.toString());
    if(PR.q)expr=expr.replaceAll('q',PR.q.toString());
    if(PR.n)expr=expr.replaceAll('n',PR.n.toString());
    if(PR.phi)expr=expr.replaceAll('φ',PR.phi.toString()).replaceAll('phi',PR.phi.toString());
    if(PR.e)expr=expr.replaceAll('e',PR.e.toString());
    if(PR.d)expr=expr.replaceAll('d',PR.d.toString());

    // Handle mod and ^ operators with BigInt
    const result=evalBigIntExpr(expr);
    document.getElementById('cp-result').textContent=result.toString();
    // history
    const row=`${calcExpr} = ${result}`;
    calcHistory.unshift(row);if(calcHistory.length>8)calcHistory.pop();
    renderCalcHist();
    tone(660,.08,'sine',.05);
  }catch(e){
    document.getElementById('cp-result').textContent='Err';
    errSnd();
  }
}

function evalBigIntExpr(expr){
  // Simple BigInt evaluator supporting +,-,×,*,^,mod,()
  expr=expr.trim().replace(/\s*×\s*/g,'*').replace(/\s*mod\s*/g,'%').replace(/\s*\^\s*/g,'**');
  // We need to handle BigInt power carefully
  // Tokenize and evaluate
  return evalExpr(expr);
}

function evalExpr(e){
  e=e.trim();
  // Replace numbers with BigInt literals first
  e=e.replace(/\b(\d+)\b/g,'$1n');
  // Handle a^b mod c pattern → modPow(a,b,c) for efficiency and correctness
  e=e.replace(/(\([^)]+\)|\d+n)\s*\*\*\s*(\([^)]+\)|\d+n)\s*%\s*(\([^)]+\)|\d+n)/g,
    (m,base,exp,mod)=>`_mpow(${base},${exp},${mod})`);
  // Remaining ** without mod
  e=e.replace(/(\([^)]+\)|\d+n)\s*\*\*\s*(\([^)]+\)|\d+n)/g,
    (m,a,b)=>`_mpow(${a},${b},null)`);
  try{
    const fn=new Function('_mpow','return '+e);
    return fn((base,exp,mod)=>{
      // fast modular exponentiation; if mod===null do plain pow
      let r=1n;
      base=mod!==null?base%mod:base;
      while(exp>0n){
        if(exp%2n===1n)r=mod!==null?r*base%mod:r*base;
        exp>>=1n;
        base=mod!==null?base*base%mod:base*base;
      }
      return r;
    });
  }catch(err){throw err;}
}

function renderCalcHist(){
  const h=document.getElementById('cp-hist');if(!h)return;
  h.innerHTML=calcHistory.map(r=>`<div class="cp-hist-row" onclick="calcFromHist('${r.split('=')[0].trim()}')">${r}</div>`).join('');
}
function calcFromHist(expr){calcExpr=expr;updateCalcDisp();}

function updateCalcVars(){
  const kd=document.getElementById('cp-keys');if(!kd)return;
  const vars=[['p',PR.p],['q',PR.q],['n',PR.n],['φ',PR.phi],['e',PR.e],['d',PR.d]];
  let h=`<span style="font-size:10px;color:var(--txt3);align-self:center;" data-i="calc-vars">${T('calc-vars')}</span>`;
  vars.forEach(([lbl,val])=>{
    if(val>0n)h+=`<button class="cp-key-btn" onclick="calcInput('${lbl}')">${lbl}=${val}</button>`;
  });
  kd.innerHTML=h;
}

/* ====================================================== ASCII TABLE ====================================================== */
let asciiOpen=false;
const ASCII_DATA=[];
(function buildAscii(){
  const specials={0:'NUL',1:'SOH',2:'STX',3:'ETX',4:'EOT',5:'ENQ',6:'ACK',7:'BEL',8:'BS',9:'TAB',10:'LF',11:'VT',12:'FF',13:'CR',14:'SO',15:'SI',16:'DLE',17:'DC1',18:'DC2',19:'DC3',20:'DC4',21:'NAK',22:'SYN',23:'ETB',24:'CAN',25:'EM',26:'SUB',27:'ESC',28:'FS',29:'GS',30:'RS',31:'US',127:'DEL'};
  for(let i=0;i<=127;i++){
    let ch=specials[i]||String.fromCharCode(i);
    const isPrint=i>=32&&i<127;
    ASCII_DATA.push({dec:i,hex:i.toString(16).toUpperCase().padStart(2,'0'),char:isPrint?String.fromCharCode(i):ch,desc:specials[i]||(isPrint?'':''),print:isPrint});
  }
})();
function renderAsciiTable(filter=''){
  const tb=document.getElementById('ascii-tbody');if(!tb)return;
  const fl=filter.toLowerCase().trim();
  const rows=ASCII_DATA.filter(r=>{
    if(!fl)return true;
    return r.dec.toString().includes(fl)||r.hex.toLowerCase().includes(fl)||(r.print&&r.char.toLowerCase()===fl)||r.desc.toLowerCase().includes(fl);
  });
  tb.innerHTML=rows.map(r=>`<tr onclick="calcInput('${r.dec}')">
    <td class="adec">${r.dec}</td>
    <td class="ahex">0x${r.hex}</td>
    <td class="achar">${r.print?r.char:'<span style="font-size:10px;color:var(--txt3)">'+r.char+'</span>'}</td>
    <td class="adesc">${r.desc||'printable'}</td>
  </tr>`).join('');
}
function filterAscii(v){renderAsciiTable(v);}
function toggleAscii(){
  asciiOpen=!asciiOpen;
  const panel=document.getElementById('ascii-panel');
  if(asciiOpen){
    panel.classList.add('open');
    renderAsciiTable();
    const titleEl=document.getElementById('ascii-title');
    if(titleEl)titleEl.textContent=T('ascii-title')||'ASCII Table';
  } else {
    panel.classList.remove('open');
  }
  click();
}

/* ====================================================== LIVE PANEL ====================================================== */
const RLP_CONFIG = [
  {key:'p',   labelKey:'p',          ico:'p',  col:'var(--acc)', bg:'var(--al)'},
  {key:'q',   labelKey:'q',          ico:'q',  col:'var(--pur)', bg:'var(--pl)'},
  {key:'n',   labelKey:'n = p×q',    ico:'n',  col:'var(--grn)', bg:'var(--gl)'},
  {key:'phi', labelKey:'φ(n)',        ico:'φ',  col:'var(--org)', bg:'var(--ol)'},
  {key:'e',   labelKey:'rlp-e',      ico:'e',  col:'#0ea5e9', bg:'rgba(14,165,233,.1)'},
  {key:'d',   labelKey:'rlp-d',      ico:'d',  col:'var(--pur)', bg:'var(--pl)'},
  {key:'M',   labelKey:'rlp-M',      ico:'M',  col:'var(--txt)', bg:'var(--bg2)'},
  {key:'C',   labelKey:'rlp-C',      ico:'C',  col:'var(--red)', bg:'var(--rl)'},
];

function updateLivePanel(){
  const w=document.getElementById('rlp-values');if(!w)return;
  const vals={p:PR.p,q:PR.q,n:PR.n,phi:PR.phi,e:PR.e,d:PR.d,M:PR.M,C:PR.C};
  const hasAny=Object.values(vals).some(v=>v&&v>0n);
  if(!hasAny){
    w.innerHTML=`<div class="rlp-empty">${T('rlp-empty')}</div>`;
    return;
  }
  // Keep existing items, add new ones with animation
  const existing=new Set([...w.querySelectorAll('.rlp-item')].map(el=>el.dataset.key));
  let html='';
  RLP_CONFIG.forEach(({key,labelKey,ico,col,bg})=>{
    const v=vals[key];
    if(!v||v<=0n)return;
    const label = (labelKey.startsWith('rlp-')||labelKey==='rlp-title') ? T(labelKey) : labelKey;
    const isNew=!existing.has(key);
    html+=`<div class="rlp-item${isNew?'':' show'}" data-key="${key}" style="transition-delay:${isNew?'0.05s':'0s'}">
      <div class="rlp-ico" style="background:${bg};color:${col}">${ico}</div>
      <div class="rlp-info">
        <div class="rlp-key" style="color:${col}">${label}</div>
        <div class="rlp-val" style="color:${col}">${v.toString()}</div>
      </div>
    </div>`;
  });
  w.innerHTML=html;
  // Trigger transitions for new items
  requestAnimationFrame(()=>{
    w.querySelectorAll('.rlp-item:not(.show)').forEach((el,i)=>{
      el.style.transitionDelay=(i*0.07)+'s';
      requestAnimationFrame(()=>el.classList.add('show'));
    });
  });
}

/* ====================================================== BOOT ====================================================== */

/* ====================================================== QUIZ ENGINE ====================================================== */
/* ════════════════════════════════════════════
   TASKS ENGINE — 10 practical RSA exercises
   ════════════════════════════════════════════ */

// Helper: modular exponentiation
function modpow(base, exp, mod) {
  let result = 1n;
  base = BigInt(base) % BigInt(mod);
  exp = BigInt(exp);
  mod = BigInt(mod);
  while (exp > 0n) {
    if (exp % 2n === 1n) result = (result * base) % mod;
    exp = exp / 2n;
    base = (base * base) % mod;
  }
  return Number(result);
}

// Extended Euclidean for mod inverse
function modInverse(e, phi) {
  let [old_r, r] = [e, phi];
  let [old_s, s] = [1, 0];
  while (r !== 0) {
    const q = Math.floor(old_r / r);
    [old_r, r] = [r, old_r - q * r];
    [old_s, s] = [s, old_s - q * s];
  }
  return ((old_s % phi) + phi) % phi;
}

const TASKS_DATA = {
  ru: [
    {
      type: 'compute',
      title: 'Шаг 1: Вычисли модуль n',
      task: 'Даны простые числа p = 17 и q = 19. Вычисли модуль n = p × q.',
      formula: 'n = p × q',
      hint: '17 × 19 = ?',
      answer: 323,
      exp: 'n = 17 × 19 = 323. Это модуль RSA — входит в оба ключа. n ≥ 256 ✓ (символы ASCII поместятся).'
    },
    {
      type: 'compute',
      title: 'Шаг 2: Функция Эйлера',
      task: 'Для p = 17 и q = 19 вычисли φ(n) = (p−1) × (q−1).',
      formula: 'φ(n) = (p−1)(q−1)',
      hint: '(17−1) × (19−1) = 16 × 18 = ?',
      answer: 288,
      exp: 'φ(n) = 16 × 18 = 288. Функция Эйлера нужна для выбора e и вычисления d. Её держат в секрете!'
    },
    {
      type: 'check',
      title: 'Шаг 3: Подходит ли e?',
      task: 'φ(n) = 288. Какое из чисел ПОДХОДИТ как открытый ключ e? Выбери правильное.',
      formula: 'e: простое, e < φ(n), НОД(e, φ(n)) = 1',
      options: ['3 (НОД(3,288)=3)', '5 (НОД(5,288)=1)', '9 (не простое)', '288 (равно φ(n))'],
      answer: 1,
      exp: 'e = 5: простое ✓, 5 < 288 ✓, НОД(5,288) = 1 ✓ — подходит! e = 3: НОД(3,288)=3 — не подходит. e = 9: не простое. e = 288: нельзя, e < φ(n).'
    },
    {
      type: 'compute',
      title: 'Шаг 4: Закрытый ключ d',
      task: 'e = 5, φ(n) = 288. Найди d такое, что d × 5 ≡ 1 (mod 288). Т.е. (d × 5) mod 288 = 1.',
      formula: 'd × e ≡ 1 (mod φ(n))',
      hint: 'Перебери: (1×5) mod 288 = 5, (2×5) mod 288 = 10 ... найди d где результат = 1',
      answer: 173,
      exp: 'd = 173: 173 × 5 = 865. 865 mod 288 = 1 ✓ (865 = 3 × 288 + 1). Проверка: (d×e) mod φ(n) = 1.'
    },
    {
      type: 'compute',
      title: 'Шаг 5: Зашифруй символ',
      task: "Открытый ключ (e=5, n=323). ASCII код буквы 'A' = 65. Вычисли C = 65⁵ mod 323.",
      formula: 'C = M^e mod n',
      hint: '65^5 = 1 160 290 625. Теперь 1 160 290 625 mod 323 = ?',
      answer: 1116,
      exp: "C = 65^5 mod 323 = 1 116. Используй калькулятор 🧮 внизу: набери 65^5 mod 323."
    },
    {
      type: 'compute',
      title: 'Шаг 6: Расшифруй символ',
      task: "Закрытый ключ (d=173, n=323). Шифртекст C = 1116. Расшифруй: M = 1116¹⁷³ mod 323.",
      formula: 'M = C^d mod n',
      hint: 'Используй калькулятор 🧮: 1116^173 mod 323',
      answer: 65,
      exp: "M = 1116^173 mod 323 = 65. ASCII 65 = буква 'A' ✓. Шифрование и дешифровка симметричны!"
    },
    {
      type: 'compute',
      title: 'Другой пример: найди n',
      task: 'p = 11, q = 23. Чему равно n?',
      formula: 'n = p × q',
      hint: '11 × 23 = ?',
      answer: 253,
      exp: 'n = 11 × 23 = 253. Заметь: 253 ≥ 256? Нет! 253 < 256 — такой ключ не подойдёт для всех ASCII символов. Надо выбрать большие p и q.'
    },
    {
      type: 'compute',
      title: 'Вычисли φ(n)',
      task: 'p = 13, q = 17. Вычисли φ(n).',
      formula: 'φ(n) = (p−1)(q−1)',
      hint: '(13−1) × (17−1) = 12 × 16 = ?',
      answer: 192,
      exp: 'φ(n) = 12 × 16 = 192. Обрати внимание: n = 13×17 = 221 < 256 — маловато для ASCII, но математика верна.'
    },
    {
      type: 'check',
      title: 'Что зашифровывает e?',
      task: 'Открытый ключ (e, n). Какая формула правильно описывает шифрование?',
      formula: 'C = ?',
      options: ['C = M + e mod n', 'C = M × e mod n', 'C = M^e mod n', 'C = M^d mod n'],
      answer: 2,
      exp: 'Правильно: C = M^e mod n. Именно возведение в степень e по модулю n делает RSA безопасным — обратная операция без d вычислительно невозможна.'
    },
    {
      type: 'compute',
      title: 'Финальный тест',
      task: 'p = 7, q = 11, e = 7. Найди φ(n). (Подсказка: сначала n = p×q, потом φ(n) = (p-1)(q-1))',
      formula: 'φ(n) = (p−1)(q−1)',
      hint: 'p−1 = 6, q−1 = 10, 6×10 = ?',
      answer: 60,
      exp: 'n = 7×11 = 77, φ(n) = 6×10 = 60. Проверь: НОД(e,φ) = НОД(7,60) = 1 ✓ — e подходит. d: 7×d ≡ 1(mod 60) → d = 43 (7×43=301, 301 mod 60 = 1 ✓).'
    }
  ],
  en: [
    {
      type: 'compute', title: 'Step 1: Calculate modulus n',
      task: 'Given primes p = 17 and q = 19. Calculate modulus n = p × q.',
      formula: 'n = p × q', hint: '17 × 19 = ?', answer: 323,
      exp: 'n = 17 × 19 = 323. This is the RSA modulus, part of both keys. n ≥ 256 ✓'
    },
    {
      type: 'compute', title: "Step 2: Euler's totient",
      task: 'For p = 17 and q = 19, compute φ(n) = (p−1) × (q−1).',
      formula: 'φ(n) = (p−1)(q−1)', hint: '16 × 18 = ?', answer: 288,
      exp: 'φ(n) = 16 × 18 = 288. Needed to choose e and compute d. Must stay secret!'
    },
    {
      type: 'check', title: 'Step 3: Valid e?',
      task: 'φ(n) = 288. Which number is a valid public exponent e?',
      formula: 'e: prime, e < φ(n), GCD(e, φ(n)) = 1',
      options: ['3 (GCD(3,288)=3)', '5 (GCD(5,288)=1)', '9 (not prime)', '288 (equals φ(n))'],
      answer: 1,
      exp: 'e = 5: prime ✓, 5 < 288 ✓, GCD(5,288) = 1 ✓ — valid! e=3: GCD=3. e=9: not prime. e=288: must be < φ(n).'
    },
    {
      type: 'compute', title: 'Step 4: Private key d',
      task: 'e = 5, φ(n) = 288. Find d such that d × 5 ≡ 1 (mod 288).',
      formula: 'd × e ≡ 1 (mod φ(n))', hint: 'Try d values: (d×5) mod 288 = 1', answer: 173,
      exp: 'd = 173: 173 × 5 = 865. 865 mod 288 = 1 ✓'
    },
    {
      type: 'compute', title: "Step 5: Encrypt 'A'",
      task: "Public key (e=5, n=323). ASCII code of 'A' = 65. Compute C = 65⁵ mod 323.",
      formula: 'C = M^e mod n', hint: 'Use calculator 🧮: 65^5 mod 323', answer: 1116,
      exp: "C = 65^5 mod 323 = 1116."
    },
    {
      type: 'compute', title: 'Step 6: Decrypt',
      task: 'Private key (d=173, n=323). Ciphertext C = 1116. Compute M = 1116¹⁷³ mod 323.',
      formula: 'M = C^d mod n', hint: 'Use calculator 🧮: 1116^173 mod 323', answer: 65,
      exp: "M = 65 → ASCII 'A' ✓"
    },
    {
      type: 'compute', title: 'Another example: find n',
      task: 'p = 11, q = 23. What is n?',
      formula: 'n = p × q', hint: '11 × 23 = ?', answer: 253,
      exp: 'n = 253. Note: 253 < 256 — too small for all ASCII characters! Choose larger primes.'
    },
    {
      type: 'compute', title: 'Compute φ(n)',
      task: 'p = 13, q = 17. Compute φ(n).',
      formula: 'φ(n) = (p−1)(q−1)', hint: '12 × 16 = ?', answer: 192,
      exp: 'φ(n) = 12 × 16 = 192.'
    },
    {
      type: 'check', title: 'Encryption formula',
      task: 'Public key (e, n). Which formula correctly describes encryption?',
      formula: 'C = ?',
      options: ['C = M + e mod n', 'C = M × e mod n', 'C = M^e mod n', 'C = M^d mod n'],
      answer: 2,
      exp: 'C = M^e mod n. Raising to the power of e is what makes RSA secure.'
    },
    {
      type: 'compute', title: 'Final challenge',
      task: 'p = 7, q = 11, e = 7. Find φ(n).',
      formula: 'φ(n) = (p−1)(q−1)', hint: '6 × 10 = ?', answer: 60,
      exp: 'φ(n) = 60. d = 43 because 7×43 = 301, 301 mod 60 = 1 ✓'
    }
  ],
  kz: [
    {
      type: 'compute', title: '1-қадам: n модулін есепте',
      task: 'p = 17, q = 19 жай сандары берілген. n = p × q модулін есепте.',
      formula: 'n = p × q', hint: '17 × 19 = ?', answer: 323,
      exp: 'n = 17 × 19 = 323. RSA модулі — екі кілтте де бар. n ≥ 256 ✓'
    },
    {
      type: 'compute', title: '2-қадам: Эйлер функциясы',
      task: 'p = 17, q = 19. φ(n) = (p−1) × (q−1) есепте.',
      formula: 'φ(n) = (p−1)(q−1)', hint: '16 × 18 = ?', answer: 288,
      exp: 'φ(n) = 16 × 18 = 288.'
    },
    {
      type: 'check', title: '3-қадам: e дұрыс ба?',
      task: 'φ(n) = 288. Ашық e кілті ретінде қайсысы жарамды?',
      formula: 'e: жай сан, e < φ(n), ЕОБ(e, φ(n)) = 1',
      options: ['3 (ЕОБ(3,288)=3)', '5 (ЕОБ(5,288)=1)', '9 (жай сан емес)', '288 (φ(n)-ге тең)'],
      answer: 1,
      exp: 'e = 5: жай сан ✓, 5 < 288 ✓, ЕОБ(5,288) = 1 ✓ — жарамды!'
    },
    {
      type: 'compute', title: '4-қадам: d жабық кілті',
      task: 'e = 5, φ(n) = 288. d × 5 ≡ 1 (mod 288) болатын d тап.',
      formula: 'd × e ≡ 1 (mod φ(n))', hint: '(d×5) mod 288 = 1 болатын d іздеу', answer: 173,
      exp: 'd = 173: 173 × 5 = 865. 865 mod 288 = 1 ✓'
    },
    {
      type: 'compute', title: "5-қадам: 'A' шифрла",
      task: "Ашық кілт (e=5, n=323). 'A' әрпінің ASCII коды = 65. C = 65⁵ mod 323 есепте.",
      formula: 'C = M^e mod n', hint: '🧮 калькуляторды қолдан: 65^5 mod 323', answer: 1116,
      exp: 'C = 1116.'
    },
    {
      type: 'compute', title: '6-қадам: Шифрды аш',
      task: 'Жабық кілт (d=173, n=323). C = 1116. M = 1116¹⁷³ mod 323 есепте.',
      formula: 'M = C^d mod n', hint: '🧮 калькулятор: 1116^173 mod 323', answer: 65,
      exp: "M = 65 → ASCII 'A' ✓"
    },
    {
      type: 'compute', title: 'n таб',
      task: 'p = 11, q = 23. n неге тең?',
      formula: 'n = p × q', hint: '11 × 23 = ?', answer: 253,
      exp: 'n = 253. Ескерту: 253 < 256 — ASCII символдар үшін өте аз! Үлкенірек p, q таңда.'
    },
    {
      type: 'compute', title: 'φ(n) есепте',
      task: 'p = 13, q = 17. φ(n) есепте.',
      formula: 'φ(n) = (p−1)(q−1)', hint: '12 × 16 = ?', answer: 192,
      exp: 'φ(n) = 12 × 16 = 192.'
    },
    {
      type: 'check', title: 'Шифрлеу формуласы',
      task: 'Ашық кілт (e, n). Шифрлеуді дұрыс сипаттайтын формуланы таңда.',
      formula: 'C = ?',
      options: ['C = M + e mod n', 'C = M × e mod n', 'C = M^e mod n', 'C = M^d mod n'],
      answer: 2,
      exp: 'C = M^e mod n. e-ші дәрежеге шығару RSA-ны қауіпсіз етеді.'
    },
    {
      type: 'compute', title: 'Соңғы тапсырма',
      task: 'p = 7, q = 11, e = 7. φ(n) таб.',
      formula: 'φ(n) = (p−1)(q−1)', hint: '6 × 10 = ?', answer: 60,
      exp: 'φ(n) = 60. d = 43, себебі 7×43 = 301, 301 mod 60 = 1 ✓'
    }
  ]
};

let tState = { idx:0, score:0, answered:false, userAnswers:[] };

function startTasks(){
  tState = {idx:0, score:0, answered:false, userAnswers:[]};
  document.getElementById('tasks-start-screen').style.display='none';
  document.getElementById('tasks-result').classList.remove('show');
  document.getElementById('tasks-game-screen').style.display='block';
  renderTask();
}

function getTData(){ return TASKS_DATA[lang] || TASKS_DATA.ru; }

function renderTask(){
  const data = getTData();
  const t = data[tState.idx];
  const total = data.length;
  document.getElementById('tprogfill').style.width = ((tState.idx/total)*100)+'%';
  tState.answered = false;

  let html = `<div class="quiz-q-card rv" style="animation:fup .4s ease">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
      <span class="stag" style="font-size:12px;padding:4px 12px">${t.title}</span>
      <span style="font-size:14px;color:var(--txt3);font-family:'Source Code Pro',monospace">${tState.idx+1}/${total}</span>
    </div>
    <div class="qformula">${t.formula}</div>
    <p class="qtext">${t.task}</p>`;

  if(t.type === 'compute'){
    html += `
    <div style="margin:8px 0 4px;font-size:13px;color:var(--txt3);font-weight:600;">${lang==='kz'?'Жауап:':lang==='en'?'Your answer:':'Твой ответ:'}</div>
    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:16px">
      <input id="task-inp" type="number" class="ps-inp" style="width:140px;font-size:22px;text-align:center" placeholder="?"
        onkeydown="if(event.key==='Enter')checkTask()">
      <button class="bblu" onclick="checkTask()" id="task-check-btn">${lang==='kz'?'Тексеру':lang==='en'?'Check':'Проверить'} ✓</button>
    </div>`;
    if(t.hint){
      html += `<div style="font-size:13px;color:var(--txt3);margin-bottom:12px">💡 ${lang==='kz'?'Кеңес':lang==='en'?'Hint':'Подсказка'}: <span style="color:var(--acc)">${t.hint}</span></div>`;
    }
  } else {
    html += `<div class="quiz-opts" style="margin-bottom:16px">`;
    t.options.forEach((opt,i)=>{
      html += `<button class="qopt" id="topt-${i}" onclick="checkTaskChoice(${i})">${opt}</button>`;
    });
    html += `</div>`;
  }

  html += `<div id="task-feedback" style="display:none"></div>
    <div id="task-next-btn" style="display:none;margin-top:16px;">
      <button class="bblu" onclick="nextTask()">${tState.idx+1<total?(lang==='kz'?'Келесі →':lang==='en'?'Next →':'Далее →'):(lang==='kz'?'Нәтижелер 🏆':lang==='en'?'Results 🏆':'Результаты 🏆')}</button>
    </div>
  </div>`;

  document.getElementById('tasks-q-container').innerHTML = html;
  if(t.type==='compute') setTimeout(()=>{ const el=document.getElementById('task-inp'); if(el) el.focus(); },100);
}

function checkTask(){
  if(tState.answered) return;
  const data = getTData();
  const t = data[tState.idx];
  const inp = document.getElementById('task-inp');
  if(!inp) return;
  const val = parseInt(inp.value.trim());
  if(isNaN(val)){ inp.style.borderColor='var(--red)'; return; }
  tState.answered = true;
  const correct = val === t.answer;
  if(correct) tState.score++;
  tState.userAnswers.push({correct, userAns: val, correctAns: t.answer});
  showTaskFeedback(correct, t, val);
}

function checkTaskChoice(idx){
  if(tState.answered) return;
  const data = getTData();
  const t = data[tState.idx];
  tState.answered = true;
  const correct = idx === t.answer;
  if(correct) tState.score++;
  tState.userAnswers.push({correct, userAns: idx, correctAns: t.answer});
  document.querySelectorAll('.qopt').forEach((b,i)=>{
    b.disabled = true;
    if(i===t.answer) b.classList.add('correct');
    else if(i===idx && !correct) b.classList.add('wrong');
  });
  showTaskFeedback(correct, t, t.options[idx]);
}

function showTaskFeedback(correct, t, userAns){
  const fb = document.getElementById('task-feedback');
  const inp = document.getElementById('task-inp');
  if(inp){ inp.disabled=true; inp.style.borderColor=correct?'var(--grn)':'var(--red)'; }
  const btn = document.getElementById('task-check-btn');
  if(btn) btn.disabled=true;
  fb.style.display='block';
  fb.innerHTML = `<div class="quiz-exp ${correct?'correct':'wrong'}" style="animation:fup .3s ease;background:var(--surf);border-radius:12px;padding:16px;border:2px solid ${correct?'var(--grn)':'var(--red)'}">
    <div style="font-size:20px;font-weight:900;margin-bottom:8px">${correct?'✅ '+(lang==='kz'?'Дұрыс!':lang==='en'?'Correct!':'Правильно!'):'❌ '+(lang==='kz'?'Қате. Дұрыс жауап: ':lang==='en'?'Wrong. Correct answer: ':'Неверно. Правильный ответ: ')+t.answer}</div>
    <div style="font-size:15px;line-height:1.75;color:var(--txt2)">${t.exp}</div>
  </div>`;
  document.getElementById('task-next-btn').style.display='block';
}

function nextTask(){
  const data = getTData();
  if(tState.idx + 1 >= data.length){ showTaskResults(); return; }
  tState.idx++;
  renderTask();
}

function showTaskResults(){
  document.getElementById('tasks-game-screen').style.display='none';
  const res = document.getElementById('tasks-result');
  res.classList.add('show');
  const s = tState.score, t = getTData().length;
  const pct = Math.round(s/t*100);
  document.getElementById('tasks-score-ring').style.setProperty('--deg', (pct*3.6)+'deg');
  document.getElementById('tasks-score-num').textContent = s+'/'+t;
  const grades = lang==='kz'
    ? ['Жаман емес, бірақ жаттығу керек 💪','Жақсы нәтиже! 👍','Өте жақсы! 🎉','Тамаша! Сен RSA шебері! 🏆']
    : lang==='en'
    ? ['Keep practicing! 💪','Good job! 👍','Great result! 🎉','Perfect! RSA master! 🏆']
    : ['Нужно больше практики 💪','Хороший результат! 👍','Отлично! 🎉','Мастер RSA! 🏆'];
  const gi = pct<50?0:pct<70?1:pct<90?2:3;
  document.getElementById('tasks-grade').textContent = ['💪','👍','🎉','🏆'][gi];
  document.getElementById('tasks-grade-txt').textContent = grades[gi];

  let reviewHtml = '';
  getTData().forEach((t,i)=>{
    const ua = tState.userAnswers[i];
    if(!ua) return;
    const correctLabel = t.type==='check' ? t.options[t.answer] : t.answer;
    const userLabel = t.type==='check' ? (t.options[ua.userAns]??ua.userAns) : ua.userAns;
    reviewHtml += `<div class="qr-item ${ua.correct?'ok':'fail'}" style="margin-bottom:12px;padding:14px 16px;border-radius:12px;background:var(--surf);border:2px solid ${ua.correct?'var(--grn)':'var(--red)'}">
      <div style="display:flex;align-items:flex-start;gap:12px">
        <div class="qr-ico" style="flex-shrink:0;font-size:20px;margin-top:2px">${ua.correct?'✅':'❌'}</div>
        <div style="flex:1;min-width:0">
          <div class="qr-txt" style="font-weight:700;margin-bottom:4px">${t.title}</div>
          ${!ua.correct?`
            <div style="font-size:13px;margin-bottom:2px;color:var(--txt2)">
              ${lang==='kz'?'Сіздің жауабыңыз':lang==='en'?'Your answer':'Ваш ответ'}:
              <span style="color:var(--red);font-weight:600">${userLabel}</span>
            </div>
            <div style="font-size:13px;margin-bottom:8px;color:var(--txt2)">
              ${lang==='kz'?'Дұрыс жауап':lang==='en'?'Correct answer':'Правильный ответ'}:
              <span style="color:var(--grn);font-weight:600">${correctLabel}</span>
            </div>
            <div style="font-size:13px;line-height:1.65;color:var(--txt2);background:var(--bg2);border-radius:8px;padding:10px 12px;border-left:3px solid var(--acc)">
              💡 ${t.exp}
            </div>`
          :''}
        </div>
      </div>
    </div>`;
  });
  document.getElementById('tasks-review').innerHTML = reviewHtml;
}

function restartTasks(){
  tState = {idx:0,score:0,answered:false,userAnswers:[]};
  document.getElementById('tasks-result').classList.remove('show');
  document.getElementById('tasks-game-screen').style.display='block';
  document.getElementById('tprogfill').style.width='0%';
  renderTask();
}

/* ====================================================== 3D CRYPTO ANIMATION ====================================================== */
function init3DCryptoCanvas(){
  const canvas = document.getElementById('crypto-3d-canvas');
  if(!canvas) return;
  // Canvas is always visible across all pages
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], frame = 0;

  function resize(){
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Create floating crypto symbols
  const symbols = ['🔑','🔐','n','e','d','p','q','φ','M^e','C^d','mod','01','10','RSA','≡','×','∀','∈'];
  const COLORS = ['#4f8ef7','#a78bfa','#22c55e','#fb923c','#f472b6'];

  for(let i=0; i<60; i++){
    particles.push({
      x: Math.random()*100,
      y: Math.random()*100,
      vx: (Math.random()-.5)*.3,
      vy: (Math.random()-.5)*.3,
      sym: symbols[Math.floor(Math.random()*symbols.length)],
      color: COLORS[Math.floor(Math.random()*COLORS.length)],
      alpha: 0.3+Math.random()*.5,
      size: 10+Math.random()*14,
      phase: Math.random()*Math.PI*2,
      speed: .5+Math.random()*.7
    });
  }

  // Connections
  function drawConnections(){
    for(let i=0;i<particles.length;i++){
      for(let j=i+1;j<particles.length;j++){
        const dx=(particles[i].x-particles[j].x)/100*W;
        const dy=(particles[i].y-particles[j].y)/100*H;
        const dist=Math.sqrt(dx*dx+dy*dy);
        if(dist<90){
          ctx.save();
          ctx.globalAlpha=(.5-dist/180)*particles[i].alpha;
          ctx.strokeStyle=particles[i].color;
          ctx.lineWidth=0.8;
          ctx.beginPath();
          ctx.moveTo(particles[i].x/100*W, particles[i].y/100*H);
          ctx.lineTo(particles[j].x/100*W, particles[j].y/100*H);
          ctx.stroke();
          ctx.restore();
        }
      }
    }
  }

  function animate(){
    ctx.clearRect(0,0,W,H);
    // dark gradient bg — brighter navy/indigo
    const grd=ctx.createLinearGradient(0,0,W,H);
    grd.addColorStop(0,'rgba(8,18,55,.82)');
    grd.addColorStop(1,'rgba(20,10,60,.82)');
    ctx.fillStyle=grd;
    ctx.fillRect(0,0,W,H);

    frame++;
    drawConnections();

    particles.forEach(p=>{
      p.x += p.vx;
      p.y += p.vy;
      if(p.x<-5) p.x=105; if(p.x>105) p.x=-5;
      if(p.y<-5) p.y=105; if(p.y>105) p.y=-5;

      const pulse = Math.sin(frame/40*p.speed + p.phase);
      const alpha = p.alpha * (0.7 + 0.3*pulse);
      const scale = 1 + 0.15*pulse;

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.font = `bold ${p.size*scale}px 'Source Code Pro', monospace`;
      ctx.fillStyle = p.color;
      ctx.textAlign='center';
      ctx.textBaseline='middle';

      // glow
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 8*scale;
      ctx.fillText(p.sym, p.x/100*W, p.y/100*H);
      ctx.restore();
    });

    requestAnimationFrame(animate);
  }
  animate();
}

window.addEventListener('DOMContentLoaded',()=>{
  // Restore settings
  const savedLang=gv(SK.LANG,'ru');lang=savedLang;
  const savedTheme=gv(SK.THEME,'light');
  document.body.setAttribute('data-theme',savedTheme);
  const ttog=document.getElementById('ttog');if(ttog)ttog.checked=savedTheme==='dark';
  soundOn=gv(SK.SOUND,'true')!=='false';
  const stog=document.getElementById('stog');if(stog)stog.checked=soundOn;
  // Practice always starts fresh on page reload
  // loadPR(); — disabled intentionally
  // Apply lang (also builds practice)
  applyLang();
  // Navigate to saved page
  const savedPage=gv(SK.PAGE,'home');
  const validPages=['home','demo','theory','practice','facts','tasks','ai','cipher'];
goPage(validPages.includes(savedPage)?savedPage:'home',true);
  setTimeout(rev,80);
  // Animation embedded inline
  init3DCryptoCanvas();
});
