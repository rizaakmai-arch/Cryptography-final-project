// ================================================================
// cipher.js — Страница теории (TOC), ИИ-чат, RSA-крекер,
//             шифровальщик текста
// Автор: [имя участника]
// Отвечает за: thGo(), aiSend(), aiAnswer(), startCrack(),
//             cphEncrypt(), cphDecrypt(), cphClear()
// ================================================================

/* ═══ THEORY TOC ═══ */
function thGo(id,i){
  document.getElementById(id)?.scrollIntoView({behavior:'smooth',block:'start'});
  document.querySelectorAll('.th-toc-btn').forEach((b,j)=>b.classList.toggle('on',j===i));
}
/* ═══ AI CHAT — OFFLINE RULE-BASED ENGINE ═══ */
let _aiB=false;
function aiResize(el){el.style.height='auto';el.style.height=Math.min(el.scrollHeight,110)+'px';}
function aiKey(e){if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();aiSend();}}
function aiAsk(q){document.getElementById('ai-inp').value=q;aiSend();}

/* ── helpers ── */
function _gcd(a,b){while(b){let t=b;b=a%b;a=t;}return a;}
function _modpow(base,exp,mod){
  let result=1n;base=BigInt(base)%BigInt(mod);exp=BigInt(exp);mod=BigInt(mod);
  while(exp>0n){if(exp%2n===1n)result=result*base%mod;exp=exp/2n;base=base*base%mod;}
  return Number(result);
}
function _extgcd(a,b){if(b===0)return[a,1,0];let[g,x,y]=_extgcd(b,a%b);return[g,y,x-Math.floor(a/b)*y];}
function _modinv(e,phi){let[g,x,]=_extgcd(e,phi);return((x%phi)+phi)%phi;}
function _isPrime(n){if(n<2)return false;for(let i=2;i*i<=n;i++)if(n%i===0)return false;return true;}

/* ── number extractor: finds p=XX q=XX or p,q from text ── */
function _extractPQ(txt){
  const low=txt.toLowerCase();
  // explicit p=N q=N
  let m=low.match(/p\s*[=:]\s*(\d+)/); const p=m?parseInt(m[1]):0;
  let m2=low.match(/q\s*[=:]\s*(\d+)/); const q=m2?parseInt(m2[1]):0;
  if(p&&q)return{p,q};
  // "p=17, q=19" or "17 и 19" style — grab all numbers
  const nums=(low.match(/\b(\d+)\b/g)||[]).map(Number).filter(n=>n>=2&&n<1000&&_isPrime(n));
  if(nums.length>=2)return{p:nums[0],q:nums[1]};
  return null;
}

/* ── full RSA step-by-step for given p,q ── */
function _rsaSteps(p,q,eHint){
  const n=p*q;
  const phi=(p-1)*(q-1);
  // pick e
  let e=eHint||0;
  if(!e||e<=2||e>=phi||_gcd(e,phi)!==1){
    const candidates=[3,5,7,11,13,17,19,23,29,31,37,41,65537];
    e=candidates.find(c=>c>2&&c<phi&&_gcd(c,phi)===1)||3;
  }
  const d=_modinv(e,phi);
  if(!d||d<=1){
    // fallback: pick next valid e
    const fallback=[3,5,7,11,13,17,19,23,29,31,37,41,65537];
    e=fallback.find(c=>c>2&&c<phi&&_gcd(c,phi)===1&&_modinv(c,phi)>1)||e;
    return{p,q,n,phi,e,d:_modinv(e,phi)};
  }
  return{p,q,n,phi,e,d};
}

/* ── format RSA table ── */
function _rsaTable(r){
  const L = {
    en: { hdr:'📐 **Full RSA calculation:**', pub:'Public key', prv:'Private key', chk:'check', gcd:'GCD' },
    kz: { hdr:'📐 **Толық RSA есебі:**', pub:'Ашық кілт', prv:'Жабық кілт', chk:'тексеру', gcd:'ЕОБ' },
    ru: { hdr:'📐 **Полный расчёт RSA:**', pub:'Открытый ключ', prv:'Закрытый ключ', chk:'проверка', gcd:'НОД' }
  };
  const l = L[lang] || L.ru;
  return `\n${l.hdr}\n`+
  `• p = **${r.p}**, q = **${r.q}**\n`+
  `• n = p×q = **${r.n}**\n`+
  `• φ(n) = (p−1)(q−1) = ${r.p-1}×${r.q-1} = **${r.phi}**\n`+
  `• e = **${r.e}**  (${l.gcd}(${r.e}, ${r.phi}) = ${_gcd(r.e,r.phi)} ✓)\n`+
  `• d = e⁻¹ mod φ(n) = **${r.d}**  (${l.chk}: ${r.e}×${r.d} mod ${r.phi} = ${(r.e*r.d)%r.phi} ✓)\n`+
  `• ${l.pub}: **(e=${r.e}, n=${r.n})**\n`+
  `• ${l.prv}: **(d=${r.d}, n=${r.n})**`;
}

/* ── KNOWLEDGE BASE ── */
const _KB=[
  {
    keys:['что такое rsa','rsa алгоритм','rsa что','rsa это','расскажи про rsa','rsa криптография','what is rsa','rsa algorithm','tell me about rsa','rsa cryptography','explain rsa','rsa туралы','rsa дегеніміз'],
    ans:()=>{
      const T={
        ru:`**RSA** — асимметричный алгоритм шифрования с открытым ключом, созданный в 1977 году Ривестом, Шамиром и Адлеманом (MIT).\n\n🔑 Идея: у каждого пользователя **два ключа**:\n• **Открытый (e, n)** — можно публиковать; им шифруют сообщения\n• **Закрытый (d, n)** — держится в секрете; им расшифровывают\n\nБезопасность строится на **вычислительной сложности факторизации** числа n = p×q: умножить два простых числа легко, а разложить обратно — вычислительно неподъёмно при больших числах.\n\n📋 **Пример (p=17, q=19):**\n`,
        en:`**RSA** is a public-key encryption algorithm created in 1977 by Rivest, Shamir and Adleman (MIT).\n\n🔑 Key idea: every user has **two keys**:\n• **Public (e, n)** — published openly; used to encrypt messages\n• **Private (d, n)** — kept secret; used to decrypt\n\nSecurity relies on the **computational difficulty of factoring** n = p×q: multiplying two primes is instant, but factoring a large n back is computationally infeasible.\n\n📋 **Example (p=17, q=19):**\n`,
        kz:`**RSA** — 1977 жылы Ривест, Шамир және Адлеман (MIT) жасаған ашық кілтті шифрлеу алгоритмі.\n\n🔑 Негізгі идея: әрбір пайдаланушының **екі кілті** бар:\n• **Ашық (e, n)** — жарияланады; хабарламаларды шифрлейді\n• **Жабық (d, n)** — құпияда сақталады; шифрды ашады\n\nҚауіпсіздік n = p×q санын **факторлаудың есептеу қиындығына** негізделеді: екі жай санды көбейту оңай, бірақ үлкен n-ді кері факторлау мүмкін емес.\n\n📋 **Мысал (p=17, q=19):**\n`
      };
      return (T[lang]||T.ru)+_rsaTable(_rsaSteps(17,19));
    }
  },
  {
    keys:['формула','все формулы','основные формулы','шпаргалка','формулы rsa','formula','all formulas','cheat sheet','rsa formulas','формулалар'],
    ans:()=>{
      const r=_rsaSteps(11,13);
      const T={
        ru:`📋 **Все формулы RSA — шпаргалка:**\n\n1. **n = p × q** — модуль (открытый)\n2. **φ(n) = (p−1)(q−1)** — функция Эйлера\n3. **e**: 2 < e < φ(n), НОД(e, φ(n)) = 1 — открытый показатель\n4. **d × e ≡ 1 (mod φ(n))** — закрытый ключ\n5. **C = Mᵉ mod n** — шифрование\n6. **M = Cᵈ mod n** — дешифровка\n7. **Для ASCII**: нужно n ≥ 256\n\nПример c p=11, q=13:\n`,
        en:`📋 **All RSA formulas — cheat sheet:**\n\n1. **n = p × q** — modulus (public)\n2. **φ(n) = (p−1)(q−1)** — Euler's totient\n3. **e**: 2 < e < φ(n), GCD(e, φ(n)) = 1 — public exponent\n4. **d × e ≡ 1 (mod φ(n))** — private key\n5. **C = Mᵉ mod n** — encryption\n6. **M = Cᵈ mod n** — decryption\n7. **For ASCII**: need n ≥ 256\n\nExample with p=11, q=13:\n`,
        kz:`📋 **RSA формулалары — шпаргалка:**\n\n1. **n = p × q** — модуль (ашық)\n2. **φ(n) = (p−1)(q−1)** — Эйлер функциясы\n3. **e**: 2 < e < φ(n), ЕОБ(e, φ(n)) = 1 — ашық дәреже\n4. **d × e ≡ 1 (mod φ(n))** — жабық кілт\n5. **C = Mᵉ mod n** — шифрлеу\n6. **M = Cᵈ mod n** — шифрды ашу\n7. **ASCII үшін**: n ≥ 256 болуы керек\n\np=11, q=13 мысалы:\n`
      };
      return (T[lang]||T.ru)+_rsaTable(r);
    }
  },
  {
    keys:['функция эйлера','phi','φ','тотиент','эйлера','euler','totient','euler function','euler\'s function','эйлер функциясы'],
    ans:()=>{
      const T={
        ru:`**Функция Эйлера φ(n)** считает, сколько чисел от 1 до n взаимно простых с n.\n\nДля RSA, где n = p×q (p, q — простые):\n> **φ(n) = (p−1) × (q−1)**\n\n📌 Почему? Среди 1..n только p×k и q×k не взаимно просты с n.\n\n**Пример:** p=7, q=11 → n=77, φ(77) = 6×10 = **60**\n\nφ(n) нужна, чтобы найти d — закрытый ключ: d×e ≡ 1 (mod **φ(n)**)`,
        en:`**Euler's totient function φ(n)** counts how many numbers from 1 to n are coprime with n.\n\nFor RSA where n = p×q (p, q — primes):\n> **φ(n) = (p−1) × (q−1)**\n\n📌 Why? Among 1..n only multiples of p and q are NOT coprime with n.\n\n**Example:** p=7, q=11 → n=77, φ(77) = 6×10 = **60**\n\nφ(n) is needed to find the private key d: d×e ≡ 1 (mod **φ(n)**)`,
        kz:`**Эйлер функциясы φ(n)** — 1-ден n-ге дейінгі n-мен өзара жай сандардың санын есептейді.\n\nRSA үшін n = p×q (p, q — жай сандар):\n> **φ(n) = (p−1) × (q−1)**\n\n**Мысал:** p=7, q=11 → n=77, φ(77) = 6×10 = **60**\n\nφ(n) жабық кілт d табу үшін қажет: d×e ≡ 1 (mod **φ(n)**)`
      };
      return T[lang]||T.ru;
    }
  },
  {
    keys:['закрытый ключ','найти d','вычислить d','как найти d','private key','ключ d','обратный элемент','find d','how to find d','compute d','жабық кілт','d табу'],
    ans:()=>{
      const T={
        ru:`**Закрытый ключ d** — мультипликативный обратный к e по модулю φ(n):\n> **d × e ≡ 1 (mod φ(n))**\n\nНаходится **расширенным алгоритмом Евклида**.\n\n📋 **Пример** p=5, q=11 → n=55, φ=40, e=3:\n\`d × 3 ≡ 1 (mod 40)\`\n\nРасширенный Евклид: 40 = 13×3 + 1 → 1 = 40 − 13×3\n→ d = −13 mod 40 = **27**\n\nПроверка: 3×27 = 81 mod 40 = **1** ✓\n`,
        en:`**Private key d** is the modular inverse of e modulo φ(n):\n> **d × e ≡ 1 (mod φ(n))**\n\nFound using the **Extended Euclidean Algorithm**.\n\n📋 **Example** p=5, q=11 → n=55, φ=40, e=3:\n\`d × 3 ≡ 1 (mod 40)\`\n\nExtended Euclid: 40 = 13×3 + 1 → 1 = 40 − 13×3\n→ d = −13 mod 40 = **27**\n\nCheck: 3×27 = 81 mod 40 = **1** ✓\n`,
        kz:`**Жабық кілт d** — φ(n) модулі бойынша e-нің кері мәні:\n> **d × e ≡ 1 (mod φ(n))**\n\n**Кеңейтілген Евклид алгоритмімен** табылады.\n\n📋 **Мысал** p=5, q=11 → n=55, φ=40, e=3:\n40 = 13×3 + 1 → d = −13 mod 40 = **27**\n\nТексеру: 3×27 = 81 mod 40 = **1** ✓\n`
      };
      return (T[lang]||T.ru)+_rsaTable(_rsaSteps(5,11,3));
    }
  },
  {
    keys:['открытый ключ','выбор e','условия e','public key','ключ e','как выбрать e','choose e','how to choose e','public exponent','ашық кілт','e таңдау'],
    ans:()=>{
      const T={
        ru:`**Открытый ключ (e, n)** — пара, которую можно публиковать.\n\n**Условия выбора e:**\n1. 2 < e < φ(n)\n2. **НОД(e, φ(n)) = 1** — взаимно прост с φ(n)\n3. Обычно берут e = **65537** (2¹⁶+1) в реальных системах\n\n📋 **Пример** p=7, q=13 → n=91, φ=72:\ne=5 → НОД(5,72)=1 ✓\ne=6 → НОД(6,72)=6 ✗ (не подходит)\ne=**11** → НОД(11,72)=1 ✓\n`,
        en:`**Public key (e, n)** — the pair you publish openly.\n\n**Rules for choosing e:**\n1. 2 < e < φ(n)\n2. **GCD(e, φ(n)) = 1** — coprime with φ(n)\n3. In practice e = **65537** (2¹⁶+1) is standard\n\n📋 **Example** p=7, q=13 → n=91, φ=72:\ne=5 → GCD(5,72)=1 ✓\ne=6 → GCD(6,72)=6 ✗ (invalid)\ne=**11** → GCD(11,72)=1 ✓\n`,
        kz:`**Ашық кілт (e, n)** — жарияланатын жұп.\n\n**e таңдау шарттары:**\n1. 2 < e < φ(n)\n2. **ЕОБ(e, φ(n)) = 1** — φ(n)-мен өзара жай\n3. Тәжірибеде e = **65537** қолданылады\n\n📋 **Мысал** p=7, q=13 → n=91, φ=72:\ne=5 → ЕОБ(5,72)=1 ✓\ne=**11** → ЕОБ(11,72)=1 ✓\n`
      };
      return (T[lang]||T.ru)+_rsaTable(_rsaSteps(7,13));
    }
  },
  {
    keys:['шифровани','encrypt','зашифров','c = m','encryption','how to encrypt','шифрлеу'],
    ans:()=>{
      const T={
        ru:`**Шифрование в RSA:**\n> **C = Mᵉ mod n**\n\nM — числовое сообщение (0 ≤ M < n), C — шифртекст.\n\n📋 **Пример** p=5, q=11, e=3, n=55, M=2:\nC = 2³ mod 55 = 8 mod 55 = **8**\nРасшифровка: 8²⁷ mod 55 = **2** ✓ (d=27)\n`,
        en:`**RSA Encryption:**\n> **C = Mᵉ mod n**\n\nM — numeric message (0 ≤ M < n), C — ciphertext.\n\n📋 **Example** p=5, q=11, e=3, n=55, M=2:\nC = 2³ mod 55 = 8 mod 55 = **8**\nDecryption: 8²⁷ mod 55 = **2** ✓ (d=27)\n`,
        kz:`**RSA шифрлеуі:**\n> **C = Mᵉ mod n**\n\nM — сандық хабарлама (0 ≤ M < n), C — шифрмәтін.\n\n📋 **Мысал** p=5, q=11, e=3, n=55, M=2:\nC = 2³ mod 55 = **8**\nШифрды ашу: 8²⁷ mod 55 = **2** ✓\n`
      };
      return (T[lang]||T.ru)+_rsaTable(_rsaSteps(5,11,3));
    }
  },
  {
    keys:['дешифр','расшифр','decrypt','m = c','decryption','how to decrypt','шифрды ашу'],
    ans:()=>{
      const T={
        ru:`**Дешифровка в RSA:**\n> **M = Cᵈ mod n**\n\nРаботает благодаря теореме Эйлера: (Mᵉ)ᵈ ≡ M (mod n).\n\n📋 **Пример** d=27, n=55, C=8:\nM = 8²⁷ mod 55 = **2** ✓\n\nОригинальное сообщение M=2 восстановлено!`,
        en:`**RSA Decryption:**\n> **M = Cᵈ mod n**\n\nWorks thanks to Euler's theorem: (Mᵉ)ᵈ ≡ M (mod n).\n\n📋 **Example** d=27, n=55, C=8:\nM = 8²⁷ mod 55 = **2** ✓\n\nOriginal message M=2 recovered!`,
        kz:`**RSA шифрды ашу:**\n> **M = Cᵈ mod n**\n\nЭйлер теоремасы арқылы жұмыс істейді: (Mᵉ)ᵈ ≡ M (mod n).\n\n📋 **Мысал** d=27, n=55, C=8:\nM = 8²⁷ mod 55 = **2** ✓`
      };
      return T[lang]||T.ru;
    }
  },
  {
    keys:['mod','модул','остаток от деления','что такое mod','операция mod','what is mod','modulo','remainder','mod operation','қалдық'],
    ans:()=>{
      const T={
        ru:`**Операция mod** — остаток от целочисленного деления.\n\n> **a mod n** = остаток при делении a на n\n\n📌 Примеры:\n• 17 mod 5 = **2** (17 = 3×5 + 2)\n• 100 mod 7 = **2** (100 = 14×7 + 2)\n• 55 mod 11 = **0**\n\nВ RSA:\n• C = Mᵉ **(mod n)** — шифрование\n• M = Cᵈ **(mod n)** — дешифровка\n• d×e ≡ 1 **(mod φ(n))** — закрытый ключ`,
        en:`**The mod operation** gives the remainder of integer division.\n\n> **a mod n** = remainder when dividing a by n\n\n📌 Examples:\n• 17 mod 5 = **2** (17 = 3×5 + 2)\n• 100 mod 7 = **2** (100 = 14×7 + 2)\n• 55 mod 11 = **0**\n\nIn RSA:\n• C = Mᵉ **(mod n)** — encryption\n• M = Cᵈ **(mod n)** — decryption\n• d×e ≡ 1 **(mod φ(n))** — private key`,
        kz:`**mod операциясы** — бөлудің қалдығы.\n\n> **a mod n** = a санын n-ге бөлгендегі қалдық\n\n📌 Мысалдар:\n• 17 mod 5 = **2**\n• 100 mod 7 = **2**\n• 55 mod 11 = **0**\n\nRSA-да:\n• C = Mᵉ **(mod n)** — шифрлеу\n• M = Cᵈ **(mod n)** — шифрды ашу`
      };
      return T[lang]||T.ru;
    }
  },
  {
    keys:['ascii','n >= 256','n больше','n не менее','символ','буква','текст','why n','n must be','characters','letters','таңба','n ≥ 256'],
    ans:()=>{
      const intro={
        ru:`**Почему n ≥ 256 для ASCII?**\n\nСообщение M должно быть **меньше n** (условие RSA: 0 ≤ M < n).\nASCII-коды букв занимают диапазон 0–255:\n• 'A' = 65, 'Z' = 90, 'a' = 97, 'z' = 122, пробел = 32`,
        en:`**Why n ≥ 256 for ASCII?**\n\nThe message M must be **less than n** (RSA condition: 0 ≤ M < n).\nASCII character codes span 0–255:\n• 'A' = 65, 'Z' = 90, 'a' = 97, 'z' = 122, space = 32`,
        kz:`**ASCII үшін неліктен n ≥ 256?**\n\nM хабарламасы **n-нен кіші** болуы керек (RSA шарты: 0 ≤ M < n).\nASCII кодтары 0–255 аралығын алып жатыр:\n• 'A' = 65, 'Z' = 90, 'a' = 97, ' ' = 32`
      };
      return (intro[lang]||intro.ru)+`

Если n < 256, то при шифровании буквы с кодом > n алгоритм даст неверный результат (M ≥ n нарушает математику RSA).

📋 **Пример правильной пары** для ASCII:
p=17, q=19 → n=323 ≥ 256 ✓
Можно шифровать любой ASCII-символ.

p=11, q=13 → n=143 — нельзя шифровать символы с кодом ≥ 143\n`+_rsaTable(_rsaSteps(17,19));
    }
  },
  {
    keys:['алгоритм евклида','расширенный евклид','extended euclidean','нод','gcd','взаимно прост','euclidean algorithm','coprime','евклид алгоритмі'],
    ans:()=>`**Расширенный алгоритм Евклида** находит НОД и коэффициенты x,y такие, что:
> **a×x + b×y = НОД(a, b)**

Если НОД(e, φ) = 1, то e×d + φ×y = 1 → **d = e⁻¹ mod φ**

📋 **Пример:** e=3, φ=40, найти d:
\`gcd(3, 40):\`
40 = 13×3 + 1 → **1 = 40 − 13×3**
→ d = −13 mod 40 = 40−13 = **27**
Проверка: 3×27 = 81 = 2×40+1 → 81 mod 40 = **1** ✓

📋 Более сложный пример: e=7, φ=60:
gcd(7, 60):
60 = 8×7 + 4
7 = 1×4 + 3
4 = 1×3 + 1
→ 1 = 4−3 = 4−(7−4) = 2×4−7 = 2×(60−8×7)−7 = 2×60−17×7
→ d = −17 mod 60 = **43**
Проверка: 7×43 = 301 = 5×60+1 ✓`
  },
  {
    keys:['квантов','шор','shor','post-quantum','постквант','crystals','kyber','quantum','quantum threat','кванттық'],
    ans:()=>`**RSA и квантовые компьютеры**

⚛️ Алгоритм **Шора (1994)** позволяет квантовому компьютеру факторизовать n за **O((log n)³)** операций — полиномиальное время!

Обычный компьютер: факторизация RSA-2048 ≈ 10³⁰ лет
Квантовый (теоретически): RSA-2048 ≈ несколько часов

🔑 **Для взлома RSA-2048 нужно ~4000 логических кубит** с исправлением ошибок. Сегодняшние компьютеры (IBM Eagle: 127 кубит) ещё не достигают нужного уровня.

🛡️ **Постквантовая криптография (NIST 2024):**
• **CRYSTALS-Kyber** — замена RSA для шифрования (lattice-based)
• **CRYSTALS-Dilithium** — замена для цифровых подписей
• Основаны на задаче о решётках (Learning With Errors), не поддающейся алгоритму Шора

Переход уже начался: Google Chrome с 2023 г. использует гибридный TLS с Kyber.`
  },
  {
    keys:['история','создатели','ривест','шамир','адлеман','rivest','когда создан','1977','history','creators','shamir','adleman','when was rsa created','тарих'],
    ans:()=>`**История RSA**

📅 **1977** — Рон Ривест (R), Ади Шамир (S) и Леонард Адлеман (A) из MIT опубликовали алгоритм. Название — первые буквы их фамилий.

🔒 **1973** — Клиффорд Кокс (GCHQ, Великобритания) независимо разработал аналогичную систему — но она была засекречена до 1997 года!

**Ключевые даты:**
• 1982 — основана компания RSA Security
• 1994 — Питер Шор создаёт квантовый алгоритм факторизации
• 1999 — взломан RSA-512 (155-значное число)
• 2009 — взломан RSA-768 за ≈2 года кластерного времени
• 2020 — взломан RSA-829 бит (RSA-250) — рекорд на сегодня
• 2024 — NIST стандартизирует постквантовые алгоритмы

🏆 В 2002 году Ривест, Шамир и Адлеман получили **премию Тьюринга** (аналог Нобелевки в CS).`
  },
  {
    keys:['безопасность','надёжность','длина ключа','сколько бит','2048','4096','512','security','key length','how many bits','reliable','қауіпсіздік'],
    ans:()=>`**Надёжность ключей RSA**

| Длина | Статус | Время взлома |
|-------|--------|-------------|
| 512 бит | ❌ Сломан (1999) | Дни на ПК |
| 768 бит | ❌ Сломан (2009) | ~2 года кластер |
| 1024 бит | ⚠️ Устарел | Теоретически уязвим |
| 2048 бит | ✅ Стандарт | ~10³⁰ лет |
| 4096 бит | 🔒 Параноид | Практически ∞ |

📌 **NIST рекомендует минимум 2048 бит** (действует до ~2030).
После 2030 — переход на 3072+ или постквантовые алгоритмы.

Рекорд взлома: **RSA-829 бит** (2020), потребовалось ~2700 лет CPU-времени.`
  },
  {
    keys:['подпись','signature','цифровая подпись','подписать','verify','digital signature','sign','қолтаңба'],
    ans:()=>`**Цифровая подпись RSA**

💡 Идея: перевернуть шифрование! Подписываем **закрытым** ключом, проверяем **открытым**.

**Схема:**
• Создание подписи: **S = Hash(M)ᵈ mod n** (закрытый ключ)
• Проверка: **Sᵉ mod n =? Hash(M)** (открытый ключ)

📋 **Пример (упрощённый)** p=5, q=11, d=27, e=3, n=55:
Сообщение M=4, "хэш" H=4:
Подпись: S = 4²⁷ mod 55 = **9**

Проверка: 9³ mod 55 = 729 mod 55 = 729 − 13×55 = 729−715 = **14** ≠ 4

(В реальных системах используется SHA-256/512 + OAEP padding — числа более надёжны)`
  },
  {
    keys:['пример','полный пример','покажи пример','step by step','шаг за шагом','пошагово','разбери','example','full example','show example','walk through','мысал'],
    ans:(txt)=>{
      const hdr={ru:'Полный пример RSA',en:'Full RSA Example',kz:'Толық RSA мысалы'};
      const encT={ru:'Тест шифрования',en:'Encryption test',kz:'Шифрлеу тексерісі'};
      const more={ru:'Хочешь пример с другими числами? Напиши: "пример p=11 q=23"',en:'Want an example with different numbers? Type: "example p=11 q=23"',kz:'Басқа сандармен мысал керек пе? Жаз: "мысал p=11 q=23"'};
      const l=lang||'ru';
      const pq=_extractPQ(txt);
      if(pq&&_isPrime(pq.p)&&_isPrime(pq.q)&&pq.p!==pq.q){
        const r=_rsaSteps(pq.p,pq.q);
        const M=Math.min(pq.p+1, r.n-1);
        const C=_modpow(M,r.e,r.n);
        const M2=_modpow(C,r.d,r.n);
        return `**${hdr[l]||hdr.ru} (p=${r.p}, q=${r.q}):**\n`+
          _rsaTable(r)+
          `\n\n📨 **${encT[l]||encT.ru}** (M=${M}):\n`+
          `C = ${M}^${r.e} mod ${r.n} = **${C}**\n`+
          `M = ${C}^${r.d} mod ${r.n} = **${M2}** ${M2===M?'✅':'❌'}`;
      }
      const r=_rsaSteps(17,19);
      const C65=_modpow(65,r.e,r.n);
      return `**${hdr[l]||hdr.ru} (p=17, q=19):**\n`+
        _rsaTable(r)+
        `\n\n📨 **${encT[l]||encT.ru}** (M=65 = 'A'):\n`+
        `C = 65^${r.e} mod ${r.n} = **${C65}**\n`+
        `M = ${C65}^${r.d} mod ${r.n} = **${_modpow(C65,r.d,r.n)}** ✅\n\n`+
        (more[l]||more.ru);
    }
  },
  {
    keys:['p=','q=','p =','q ='],
    ans:(txt)=>{
      const pq=_extractPQ(txt);
      if(!pq) return null;
      const l=lang||'ru';
      const notPrime={ru:`❌ p=${pq.p} — не простое. Ближайшее: `,en:`❌ p=${pq.p} is not prime. Nearest: `,kz:`❌ p=${pq.p} — жай сан емес. Жақыны: `};
      const notPrimeQ={ru:`❌ q=${pq.q} — не простое. Ближайшее: `,en:`❌ q=${pq.q} is not prime. Nearest: `,kz:`❌ q=${pq.q} — жай сан емес. Жақыны: `};
      const mustDiff={ru:`❌ p и q должны быть **разными** простыми. Выбери q ≠ ${pq.p}.`,en:`❌ p and q must be **different** primes. Choose q ≠ ${pq.p}.`,kz:`❌ p және q **әртүрлі** жай сандар болуы керек. q ≠ ${pq.p} таңда.`};
      const verif={ru:'Проверка',en:'Verification',kz:'Тексеру'};
      const enc={ru:'Шифрование',en:'Encrypt',kz:'Шифрлеу'};
      const dec={ru:'Дешифровка',en:'Decrypt',kz:'Шифрды ашу'};
      if(!_isPrime(pq.p)) return (notPrime[l]||notPrime.ru)+([pq.p-1,pq.p+1,pq.p+2,pq.p+3].find(x=>_isPrime(x)));
      if(!_isPrime(pq.q)) return (notPrimeQ[l]||notPrimeQ.ru)+([pq.q-1,pq.q+1,pq.q+2,pq.q+3].find(x=>_isPrime(x)));
      if(pq.p===pq.q) return mustDiff[l]||mustDiff.ru;
      const r=_rsaSteps(pq.p,pq.q);
      const M=Math.min(pq.p+3, r.n-2, 100);
      const C=_modpow(M,r.e,r.n);
      const M2=_modpow(C,r.d,r.n);
      return _rsaTable(r)+
        `\n\n📨 **${verif[l]||verif.ru}** (M=${M}):\n`+
        `${enc[l]||enc.ru}: C = ${M}^${r.e} mod ${r.n} = **${C}**\n`+
        `${dec[l]||dec.ru}: M = ${C}^${r.d} mod ${r.n} = **${M2}** ${M2===M?'✅':'❌'}`;
    }
  }
];

/* ── main answer function ── */
function _aiAnswer(txt){
  const low=txt.toLowerCase();
  // Try each rule
  for(const rule of _KB){
    if(rule.keys.some(k=>low.includes(k))){
      const ans=rule.ans(txt);
      if(ans)return ans;
    }
  }
  // calc-only fallback: detect p=X q=X
  const pq=_extractPQ(txt);
  if(pq&&_isPrime(pq.p)&&_isPrime(pq.q)){
    const r=_rsaSteps(pq.p,pq.q);
    return _rsaTable(r);
  }
  // generic RSA fallback — multilingual
  const _fb = {
    en: `Good question about RSA! 🤔 Try to be more specific, or pick a topic from the quick buttons above.\n\n` +
      `I can explain:\n` +
      `• **φ(n)** — Euler's totient function\n` +
      `• **e and d** — how to choose and compute the keys\n` +
      `• **mod** — modular arithmetic\n` +
      `• **Encryption / decryption** with examples\n` +
      `• **Euclidean algorithm** to find d\n` +
      `• **Full example**: type "example p=11 q=17"\n` +
      `• **History of RSA**, security, quantum threats`,
    kz: `RSA туралы жақсы сұрақ! 🤔 Нақтырақ сұра немесе жоғарыдағы батырмалардан тақырып таңда.\n\n` +
      `Мен түсіндіре аламын:\n` +
      `• **φ(n)** — Эйлер функциясы\n` +
      `• **e және d** — кілттерді қалай таңдау және есептеу\n` +
      `• **mod** — қалдық операциясы\n` +
      `• **Шифрлеу / шифрды ашу** мысалдармен\n` +
      `• **Евклид алгоритмі** d табу үшін\n` +
      `• **Толық мысал**: "мысал p=11 q=17" деп жаз\n` +
      `• **RSA тарихы**, қауіпсіздік, кванттық қауіптер`,
    ru: `Хороший вопрос о RSA! 🤔 Попробуй уточнить или выбери тему из быстрых кнопок выше.\n\n` +
      `Я умею объяснять:\n` +
      `• **φ(n)** — функция Эйлера\n` +
      `• **e и d** — как выбрать и вычислить ключи\n` +
      `• **mod** — операция остатка\n` +
      `• **Шифрование / дешифровка** с примерами\n` +
      `• **Алгоритм Евклида** для нахождения d\n` +
      `• **Полный пример**: напиши "пример p=11 q=17"\n` +
      `• **История RSA**, безопасность, квантовые угрозы`
  };
  return _fb[lang] || _fb.ru;
}

function aiSend(){
  if(_aiB)return;
  const inp=document.getElementById('ai-inp');
  const txt=inp.value.trim();if(!txt)return;
  inp.value='';inp.style.height='auto';
  _aiAdd('usr',txt);
  _aiB=true;document.getElementById('ai-btn').disabled=true;
  _aiTyping(true);
  setTimeout(()=>{
    _aiTyping(false);
    _aiAdd('bot',_aiAnswer(txt));
    _aiB=false;document.getElementById('ai-btn').disabled=false;
  },420);
}

function aiGSearchToggle(){
  const panel=document.getElementById('ai-gsearch-panel');
  const btn=document.getElementById('ai-gsearch-toggle-btn');
  const isOpen=panel.classList.toggle('open');
  btn.classList.toggle('active',isOpen);
  if(isOpen) setTimeout(()=>document.getElementById('ai-gsearch-inp')?.focus(),80);
}

function aiGSearch(){
  const inp=document.getElementById('ai-gsearch-inp');
  const raw=inp.value.trim();
  if(!raw)return;
  // Always prepend "RSA" so results stay on topic
  const query='RSA cryptography '+raw;
  const encoded=encodeURIComponent(query);
  const googleUrl=`https://www.google.com/search?q=${encoded}&igu=1`;
  const wrap=document.getElementById('ai-gsearch-frame-wrap');
  const frame=document.getElementById('ai-gsearch-frame');
  const blocked=document.getElementById('ai-gsearch-blocked');
  const extLink=document.getElementById('ai-gsearch-ext-link');

  // Set the external fallback link regardless
  extLink.href=`https://www.google.com/search?q=${encoded}`;

  wrap.style.display='block';
  blocked.style.display='none';
  frame.style.display='block';
  frame.src=googleUrl;

  // Detect if Google blocks the iframe (X-Frame-Options / CSP)
  // We can't read frame.contentDocument due to cross-origin, but we can
  // listen for load and check if it navigated away or stayed blank
  frame.onload=()=>{
    try{
      // If same-origin this would work; for cross-origin it throws → means page loaded (maybe)
      const doc=frame.contentDocument||frame.contentWindow?.document;
      // If doc is accessible and empty, it was blocked
      if(doc&&doc.body&&doc.body.innerHTML===''){
        blocked.style.display='flex';frame.style.display='none';
      }
    }catch(e){
      // Cross-origin error = page actually loaded inside the frame
      // This is the normal success case for Google
    }
  };

  // Fallback: after 4s if frame is still blank height, assume blocked
  setTimeout(()=>{
    if(wrap.style.display==='block'&&frame.style.display==='block'){
      try{
        const doc=frame.contentDocument||frame.contentWindow?.document;
        if(!doc||!doc.body||doc.body.innerHTML===''){
          blocked.style.display='flex';frame.style.display='none';
        }
      }catch(e){/* cross-origin = loaded fine */}
    }
  },4000);
}
function _aiAdd(role,text){
  const c=document.getElementById('ai-msgs');
  const d=document.createElement('div');d.className='ai-msg '+role;
  const ico=role==='bot'?'🤖':'👤';
  const fmt=text
    .replace(/`([^`]+)`/g,'<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>')
    .replace(/\n/g,'<br>');
  d.innerHTML=`<div class="ai-ava">${ico}</div><div class="ai-bub">${fmt}</div>`;
  c.appendChild(d);c.scrollTop=c.scrollHeight;
}
function _aiTyping(show){
  document.getElementById('ai-typ')?.remove();
  if(!show)return;
  const c=document.getElementById('ai-msgs');
  const d=document.createElement('div');d.className='ai-msg bot';d.id='ai-typ';
  d.innerHTML=`<div class="ai-ava">🤖</div><div class="ai-bub"><div class="ai-typing-dots"><span></span><span></span><span></span></div></div>`;
  c.appendChild(d);c.scrollTop=c.scrollHeight;
}
function aiClear(){
  const wb=document.getElementById('ai-welcome-bub');
  const welcomeText=wb?wb.innerHTML:'Привет! 👋 Я RSA-эксперт. Задай любой вопрос!';
  document.getElementById('ai-msgs').innerHTML=`<div class="ai-msg bot"><div class="ai-ava">🤖</div><div class="ai-bub">${welcomeText}</div></div>`;
}

/* ═══ RSA CRACKER ═══ */
let crackWorking=false, crackData=null;

function crackPreset(n,e){
  document.getElementById('crack-n').value=n;
  document.getElementById('crack-e').value=e;
}

function resetCrack(){
  crackWorking=false;
  document.getElementById('crack-log').innerHTML=`<span class="log-dim">${T('crack-invalid')}</span>`;
  document.getElementById('crack-result').className='crack-result-box';
  document.getElementById('crack-pbw').className='progress-bar-wrap';
  document.getElementById('crack-pb').style.width='0%';
  document.getElementById('crack-enc-area').style.display='none';
  document.getElementById('crack-go-btn').disabled=false;
  crackData=null;
}

function crackLog(msg, cls=''){
  const log=document.getElementById('crack-log');
  const line=document.createElement('div');
  if(cls) line.className=cls;
  line.innerHTML=msg;
  log.appendChild(line);
  log.scrollTop=log.scrollHeight;
}

/* ── Cracker page: thin wrappers around the shared math library ── */
function crackGcd(a,b){return _gcd(a,b);}
function crackModInverse(e,phi){return _modinv(e,phi);}
function crackModPow(base,exp,mod){return _modpow(base,exp,mod);}
function crackIsPrime(n){return _isPrime(n);}

async function startCrack(){
  const n=parseInt(document.getElementById('crack-n').value);
  const e=parseInt(document.getElementById('crack-e').value);
  if(!n||!e||n<4||e<2){crackLog(T('crack-invalid'),'log-err');return;}
  if(crackWorking)return;

  crackWorking=true;
  document.getElementById('crack-go-btn').disabled=true;
  document.getElementById('crack-log').innerHTML='';
  document.getElementById('crack-result').className='crack-result-box';
  document.getElementById('crack-enc-area').style.display='none';
  crackData=null;

  const pbw=document.getElementById('crack-pbw');
  const pb=document.getElementById('crack-pb');
  const plbl=document.getElementById('crack-plbl');
  pbw.className='progress-bar-wrap show';

  crackLog(`<span class="log-warn">${T('crack-start')}</span>`);
  crackLog(`<span class="log-dim">${T('crack-target').replace('{0}',n).replace('{1}',e)}</span>`);
  crackLog(`<span class="log-dim">${T('crack-method')}</span>`);
  await sleep(300);
  crackLog(`<span class="log-dim">${T('crack-scan').replace('{0}',Math.ceil(Math.sqrt(n)))}</span>`);
  await sleep(200);

  const limit=Math.ceil(Math.sqrt(n));
  let found=false, p_found=0, q_found=0;
  const step=Math.max(1,Math.floor(limit/20));

  for(let i=2;i<=limit;i++){
    if(i%step===0){
      const pct=Math.round(i/limit*100);
      pb.style.width=pct+'%';
      plbl.textContent=T('crack-progress').replace('{0}',pct).replace('{1}',i).replace('{2}',limit);
      if(i%(step*4)===0){
        crackLog(`<span class="log-dim">${T('crack-test').replace('{0}',pct).replace('{1}',i)}${n%i===0?'<span class="log-ok">'+T('crack-divisor-found')+'</span>':''}</span>`);
      }
      await sleep(18);
    }
    if(n%i===0){
      p_found=i;
      q_found=n/i;
      found=true;
      break;
    }
  }

  pb.style.width='100%';
  await sleep(200);

  const res=document.getElementById('crack-result');
  if(!found){
    crackLog(`<span class="log-err">${T('crack-not-found')}</span>`);
    crackLog(`<span class="log-dim">${T('crack-n-may-prime').replace('{0}',n)}</span>`);
    res.className='crack-result-box show safe';
    res.innerHTML=`<div class="crb-title" style="color:var(--grn)">${T('crack-safe-title')}</div><div class="crb-body">${T('crack-safe-body').replace('{0}',n)}</div>`;
  } else {
    if(!crackIsPrime(p_found)||!crackIsPrime(q_found)){
      crackLog(`<span class="log-warn">${T('crack-warn-prime').replace('{0}',p_found).replace('{1}',q_found)}</span>`);
    }
    const phi=(p_found-1)*(q_found-1);
    const d=crackModInverse(e,phi);

    crackLog(`<span class="log-ok">${T('crack-found').replace('{0}',p_found).replace('{1}',q_found)}</span>`);
    await sleep(100);
    crackLog(`<span class="log-ok">${T('crack-phi').replace('{0}',p_found).replace('{1}',q_found).replace('{2}',phi)}</span>`);
    await sleep(100);
    crackLog(`<span class="log-ok">${T('crack-prv').replace('{0}',d)}</span>`);
    await sleep(100);
    crackLog(`<span class="log-warn">${T('crack-done')}</span>`);

    res.className='crack-result-box show cracked';
    res.innerHTML=`
      <div class="crb-title" style="color:var(--red)">${T('crack-cracked-title')}</div>
      <div class="crb-body">
        <b>n</b> = ${n} = <b>${p_found}</b> × <b>${q_found}</b><br>
        <b>e</b> = ${e} (${T('crack-pub-key')})<br>
        <b>φ(n)</b> = (${p_found}−1)(${q_found}−1) = <b>${phi}</b><br>
        <b>d</b> = <b style="color:var(--red);font-size:16px;">${d}</b> (${T('crack-prv-restored')})<br><br>
        ${T('crack-pubkey-label')} <b>(${e}, ${n})</b> ${T('crack-prvkey-label')} <b>(${d}, ${n})</b>
      </div>`;

    crackData={n,e,d,p:p_found,q:q_found,phi};
    document.getElementById('crack-enc-area').style.display='block';
  }

  crackWorking=false;
  document.getElementById('crack-go-btn').disabled=false;
}

function doEncDec(){
  if(!crackData)return;
  const M=parseInt(document.getElementById('crack-msg').value);
  const {n,e,d}=crackData;
  if(isNaN(M)||M<2||M>=n){
    document.getElementById('crack-enc-result').innerHTML=`<span style="color:var(--red)">${T('crack-m-range').replace('{0}',n-1)}</span>`;
    return;
  }
  const C=crackModPow(M,e,n);
  const M2=crackModPow(C,d,n);
  document.getElementById('crack-enc-result').innerHTML=
    `${T('crack-enc-label')} <b>C = ${M}^${e} mod ${n} = <span style="color:var(--acc)">${C}</span></b><br>`+
    `${T('crack-dec-label')} <b>M = ${C}^${d} mod ${n} = <span style="color:var(--grn)">${M2}</span></b> ${M2===M?T('crack-match'):T('crack-error')}`;
}

function sleep(ms){return new Promise(r=>setTimeout(r,ms));}

// roundRect polyfill for older browsers
if(!CanvasRenderingContext2D.prototype.roundRect){
  CanvasRenderingContext2D.prototype.roundRect=function(x,y,w,h,r){
    this.moveTo(x+r,y);this.lineTo(x+w-r,y);this.quadraticCurveTo(x+w,y,x+w,y+r);
    this.lineTo(x+w,y+h-r);this.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
    this.lineTo(x+r,y+h);this.quadraticCurveTo(x,y+h,x,y+h-r);
    this.lineTo(x,y+r);this.quadraticCurveTo(x,y,x+r,y);this.closePath();
  };
}

let secChartInited=false;
function initSecChart(){
  if(secChartInited)return;
  secChartInited=true;
  const canvas=document.getElementById('sec-chart');
  if(!canvas)return;
  const ctx=canvas.getContext('2d');
  canvas.width=canvas.offsetWidth||800;
  canvas.height=300;
  drawSecChart(ctx,canvas.width,canvas.height,-1);
}

function secHighlight(bits){
  const canvas=document.getElementById('sec-chart');
  if(!canvas)return;
  const ctx=canvas.getContext('2d');
  drawSecChart(ctx,canvas.width,canvas.height,bits);
}

function drawSecChart(ctx,W,H,highlight){
  const isDark=document.body.getAttribute('data-theme')==='dark';
  const bg=isDark?'#1a2740':'#ffffff';
  const gridCol=isDark?'rgba(100,130,180,.15)':'rgba(0,0,0,.07)';
  const textCol=isDark?'#8ba4d4':'#5567a0';
  const accCol='#2563eb';

  ctx.clearRect(0,0,W,H);
  ctx.fillStyle=bg;
  ctx.fillRect(0,0,W,H);

  const data=[
    {bits:512,  logYears:-3,  label:'512',  cls:'weak'},
    {bits:768,  logYears:1,   label:'768',  cls:'med'},
    {bits:1024, logYears:4,   label:'1024', cls:'med'},
    {bits:2048, logYears:15,  label:'2048', cls:'good'},
    {bits:3072, logYears:22,  label:'3072', cls:'good'},
    {bits:4096, logYears:30,  label:'4096', cls:'strong'},
  ];

  const colors={weak:'#dc2626',med:'#ea580c',good:'#2563eb',strong:'#16a34a'};
  const pl=64,pr=24,pt=24,pb=50;
  const chartW=W-pl-pr, chartH=H-pt-pb;
  const minLog=-5, maxLog=35;

  // Grid
  for(let y=minLog;y<=maxLog;y+=5){
    const cy=pt+chartH-(y-minLog)/(maxLog-minLog)*chartH;
    ctx.beginPath();ctx.strokeStyle=gridCol;ctx.lineWidth=1;
    ctx.moveTo(pl,cy);ctx.lineTo(W-pr,cy);ctx.stroke();
    ctx.fillStyle=textCol;ctx.font='10px Source Code Pro, monospace';ctx.textAlign='right';
    const lbl=y<0?`10^${y}`:y===0?T('chart-yr'):`10^${y}`;
    ctx.fillText(lbl,pl-6,cy+4);
  }

  // X axis labels
  data.forEach((d,i)=>{
    const cx=pl+((i+0.5)/data.length)*chartW;
    ctx.fillStyle=textCol;ctx.font='11px Source Code Pro, monospace';ctx.textAlign='center';
    ctx.fillText(d.bits+' '+T('chart-bits'),cx,H-pb+18);
  });

  // Bars
  const barW=Math.floor(chartW/data.length*0.55);
  data.forEach((d,i)=>{
    const cx=pl+((i+0.5)/data.length)*chartW;
    const barH=Math.max(4,(d.logYears-minLog)/(maxLog-minLog)*chartH);
    const cy=pt+chartH-barH;
    const col=colors[d.cls];
    const isHl=highlight===d.bits;

    ctx.save();
    if(isHl){ctx.shadowColor=col;ctx.shadowBlur=18;}
    // bar gradient
    const grad=ctx.createLinearGradient(0,cy,0,cy+barH);
    grad.addColorStop(0,col);
    grad.addColorStop(1,col+'55');
    ctx.fillStyle=grad;
    ctx.beginPath();
    ctx.roundRect(cx-barW/2,cy,barW,barH,4);
    ctx.fill();
    if(isHl){
      ctx.strokeStyle=col;ctx.lineWidth=2;
      ctx.stroke();
    }
    ctx.restore();

    // label above bar
    ctx.fillStyle=isHl?col:textCol;
    ctx.font=`${isHl?'bold ':''} 10px Source Code Pro, monospace`;
    ctx.textAlign='center';
    const lbl2=d.logYears<0?T('chart-days'):(d.logYears<2?T('chart-years'):d.logYears<10?T('chart-kyears'):d.logYears<20?T('chart-myears'):'∞');
    ctx.fillText(lbl2,cx,cy-5);
  });

  // Axis
  ctx.strokeStyle=isDark?'#263555':'#cdd4ee';ctx.lineWidth=1.5;
  ctx.beginPath();ctx.moveTo(pl,pt);ctx.lineTo(pl,pt+chartH);ctx.lineTo(W-pr,pt+chartH);ctx.stroke();

  // Y-axis label
  ctx.save();ctx.translate(14,pt+chartH/2);ctx.rotate(-Math.PI/2);
  ctx.fillStyle=textCol;ctx.font='11px Inter, sans-serif';ctx.textAlign='center';
  ctx.fillText('Время взлома (лог₁₀ лет)',0,0);ctx.restore();
}



/* ═══════════════════════ CIPHER PAGE ═══════════════════════ */
/* All math delegated to the shared library (_gcd, _modpow, _modinv, _isPrime) */
function _cphIsPrime(n){return _isPrime(n);}
function _cphGcd(a,b){return _gcd(a,b);}
function _cphModpow(base,exp,mod){return _modpow(base,exp,mod);}
function _cphModinv(e,phi){return _modinv(e,phi);}

let _cphParams=null, _cphCiphered=[], _cphOriginal='';

function cphValidate(){
  const p=parseInt(document.getElementById('cph-p').value)||0;
  const q=parseInt(document.getElementById('cph-q').value)||0;
  const pi=document.getElementById('cph-p');
  const qi=document.getElementById('cph-q');
  const kd=document.getElementById('cph-keydisp');
  const wn=document.getElementById('cph-warn');
  pi.className='cipher-inp';qi.className='cipher-inp';
  kd.className='cipher-key-display';wn.className='cipher-warning';

  if(!p||!q)return;
  const pp=_cphIsPrime(p),qp=_cphIsPrime(q);
  if(!pp){pi.className='cipher-inp err';wn.innerHTML=T('cph-not-prime-p').replace('{0}',p);wn.className='cipher-warning show';return;}
  if(!qp){qi.className='cipher-inp err';wn.innerHTML=T('cph-not-prime-q').replace('{0}',q);wn.className='cipher-warning show';return;}
  if(p===q){qi.className='cipher-inp err';wn.innerHTML=T('cph-pq-diff');wn.className='cipher-warning show';return;}
  pi.className='cipher-inp ok';qi.className='cipher-inp ok';
  const n=p*q,phi=(p-1)*(q-1);
  const eList=[3,5,7,11,13,17,19,23,29,31,65537];
  const e=eList.find(c=>c>2&&c<phi&&_cphGcd(c,phi)===1)||3;
  const d=_cphModinv(e,phi);
  _cphParams={p,q,n,phi,e,d};
  kd.innerHTML=`<span class="cph-pub">${T('cph-pub-key').replace('{0}',e).replace('{1}',n)}</span> &nbsp;·&nbsp; <span class="cph-prv">${T('cph-prv-key').replace('{0}',d).replace('{1}',n)}</span> &nbsp;·&nbsp; φ(n)=<span class="cph-n">${phi}</span>`;
  kd.className='cipher-key-display show';
  if(n<256){wn.innerHTML=T('cph-n-small').replace('{0}',n);wn.className='cipher-warning show';}
}

function cphQuickPair(big){
  const pairs=big?[[61,67],[71,79],[83,89],[97,101],[103,107]]:[[17,19],[11,13],[7,11],[13,17],[5,11]];
  const [p,q]=pairs[Math.floor(Math.random()*pairs.length)];
  document.getElementById('cph-p').value=p;
  document.getElementById('cph-q').value=q;
  cphValidate();
}

async function cphEncrypt(){
  cphValidate();
  if(!_cphParams){alert(T('cph-need-pq'));return;}
  const txt=document.getElementById('cph-text').value.trim();
  if(!txt){alert(T('cph-alert-empty')||'Введи текст!');return;}
  const {e,n}=_cphParams;

  _cphOriginal=txt;
  _cphCiphered=[];

  const stage=document.getElementById('cph-stage');
  const charsEl=document.getElementById('cph-chars');
  const stageTitle=document.getElementById('cph-stage-title');
  document.getElementById('cph-table-wrap').style.display='none';
  document.getElementById('cph-output').className='cipher-output';
  stage.className='cipher-stage show animating';
  charsEl.innerHTML='';
  stageTitle.textContent=T('cph-enc-progress');

  document.getElementById('cph-enc-btn').disabled=true;
  document.getElementById('cph-dec-btn').disabled=true;

  const chars=[...txt];
  // create placeholders
  const els=[];
  for(const ch of chars){
    const d=document.createElement('div');d.className='cchar';
    d.innerHTML=`<div class="cchar-sym">${ch==' '?'␣':ch}</div><div class="cchar-arrow">↓</div><div class="cchar-code">?</div>`;
    charsEl.appendChild(d);els.push(d);
    await sleep(30);
    d.classList.add('show');
  }
  await sleep(300);

  // encrypt one by one
  let charWarnings = [];
  for(let i=0;i<chars.length;i++){
    const ch=chars[i];
    const M=ch.charCodeAt(0);
    const symEl=els[i].querySelector('.cchar-sym');
    const codeEl=els[i].querySelector('.cchar-code');
    symEl.className='cchar-sym enc';
    codeEl.textContent=`M=${M}`;
    await sleep(180);
    if(M>=n){
      // Character code exceeds n — RSA math breaks for this char
      _cphCiphered.push(null);
      symEl.className='cchar-sym';
      symEl.style.borderColor='var(--red)';
      symEl.style.color='var(--red)';
      codeEl.textContent=`M=${M}≥n!`;
      charWarnings.push({ch, M, idx:i});
    } else {
      const C=_cphModpow(M,e,n);
      _cphCiphered.push(C);
      symEl.className='cchar-sym done';
      codeEl.textContent=`C=${C}`;
    }
    await sleep(120);
  }

  // Show per-character overflow warning if any chars had M >= n
  if(charWarnings.length > 0){
    const wn=document.getElementById('cph-warn');
    const badList = charWarnings.map(w=>`'${w.ch}' (ASCII ${w.M})`).join(', ');
    const msg = {
      ru: `⚠️ ${charWarnings.length} символ(а) с кодом ≥ n=${n}: ${badList}. Эти символы не могут быть зашифрованы корректно — выбери большие p и q (например p=17, q=19 даёт n=323).`,
      en: `⚠️ ${charWarnings.length} character(s) with ASCII code ≥ n=${n}: ${badList}. These cannot be encrypted correctly — choose larger p and q (e.g. p=17, q=19 gives n=323).`,
      kz: `⚠️ ${charWarnings.length} символ(дар) коды n=${n}-ден үлкен: ${badList}. Бұл символдарды дұрыс шифрлау мүмкін емес — үлкенірек p және q таңда (мысалы p=17, q=19 → n=323).`
    };
    wn.innerHTML=msg[lang]||msg.ru;
    wn.className='cipher-warning show';
  }

  stage.className='cipher-stage show';
  stageTitle.textContent=T('cph-enc-done');

  // build table
  const tbody=document.getElementById('cph-tbody');
  tbody.innerHTML='';
  chars.forEach((ch,i)=>{
    const M=ch.charCodeAt(0);
    const C=_cphCiphered[i];
    const tr=document.createElement('tr');
    if(C===null){
      tr.innerHTML=`<td class="td-char">${ch==' '?T('cph-space'):ch}</td><td class="td-code" style="color:var(--red)">${M}</td><td style="color:var(--red);font-size:11px">M=${M} ≥ n=${n}</td><td class="td-cipher" style="color:var(--red)">⚠ overflow</td>`;
    } else {
      tr.innerHTML=`<td class="td-char">${ch==' '?T('cph-space'):ch}</td><td class="td-code">${M}</td><td style="color:var(--txt3);font-size:11px">${M}^${e} mod ${n}</td><td class="td-cipher">${C}</td>`;
    }
    tbody.appendChild(tr);
  });
  document.getElementById('cph-table-title').textContent=T('cph-table-enc');
  document.getElementById('cph-out-label').textContent=T('cph-out-enc');
  document.getElementById('cph-out-text').textContent=_cphCiphered.filter(c=>c!==null).join(' ');
  document.getElementById('cph-table-wrap').style.display='block';
  document.getElementById('cph-output').className='cipher-output show';
  document.getElementById('cph-enc-btn').disabled=false;
  document.getElementById('cph-dec-btn').disabled=false;
}

async function cphDecrypt(){
  if(!_cphParams||!_cphCiphered.length){alert(T('cph-need-enc'));return;}
  const {d,n}=_cphParams;
  const stage=document.getElementById('cph-stage');
  const charsEl=document.getElementById('cph-chars');
  const stageTitle=document.getElementById('cph-stage-title');
  document.getElementById('cph-table-wrap').style.display='none';
  document.getElementById('cph-output').className='cipher-output';
  stage.className='cipher-stage show animating';
  charsEl.innerHTML='';
  stageTitle.textContent=T('cph-dec-progress');

  document.getElementById('cph-enc-btn').disabled=true;
  document.getElementById('cph-dec-btn').disabled=true;

  let recovered='';
  const els=[];
  for(const C of _cphCiphered){
    const de=document.createElement('div');de.className='cchar';
    if(C===null){
      de.innerHTML=`<div class="cchar-sym" style="border-color:var(--red);color:var(--red);font-size:11px">⚠</div><div class="cchar-arrow">↓</div><div class="cchar-code">M≥n</div>`;
    } else {
      de.innerHTML=`<div class="cchar-sym enc" style="font-size:11px">${C}</div><div class="cchar-arrow">↓</div><div class="cchar-code">?</div>`;
    }
    charsEl.appendChild(de);els.push(de);
    await sleep(30);de.classList.add('show');
  }
  await sleep(300);

  for(let i=0;i<_cphCiphered.length;i++){
    const C=_cphCiphered[i];
    const symEl=els[i].querySelector('.cchar-sym');
    symEl.className='cchar-sym';
    await sleep(180);
    if(C===null){
      symEl.style.borderColor='var(--red)';
      symEl.style.color='var(--red)';
      els[i].querySelector('.cchar-code').textContent=lang==='en'?'M≥n: error':lang==='kz'?'M≥n: қате':'M≥n: ошибка';
      recovered+='?';
    } else {
      const M=_cphModpow(C,d,n);
      const ch=String.fromCharCode(M);
      recovered+=ch;
      symEl.className='cchar-sym done';
      symEl.textContent=ch===' '?'␣':ch;
      els[i].querySelector('.cchar-code').textContent=`M=${M}`;
    }
    await sleep(120);
  }

  stage.className='cipher-stage show';
  stageTitle.textContent=T('cph-dec-done');

  // result table
  const tbody=document.getElementById('cph-tbody');
  tbody.innerHTML='';
  _cphCiphered.forEach((C,i)=>{
    if(C===null){
      const tr=document.createElement('tr');
      tr.innerHTML=`<td class="td-cipher" style="color:var(--red)">⚠ M≥n</td><td style="color:var(--txt3);font-size:11px">—</td><td class="td-code" style="color:var(--red)">—</td><td class="td-char" style="color:var(--red)">?</td>`;
      tbody.appendChild(tr);
      return;
    }
    const M=_cphModpow(C,d,n);
    const ch=String.fromCharCode(M);
    const tr=document.createElement('tr');
    tr.innerHTML=`<td class="td-cipher">${C}</td><td style="color:var(--txt3);font-size:11px">${C}^${d} mod ${n}</td><td class="td-code">${M}</td><td class="td-char">${ch===' '?T('cph-space'):ch}</td>`;
    tbody.appendChild(tr);
  });
  const ok=recovered===_cphOriginal;
  document.getElementById('cph-table-title').textContent=T('cph-table-dec');
  document.getElementById('cph-out-label').textContent=ok?T('cph-out-dec-ok'):T('cph-out-dec-fail');
  document.getElementById('cph-out-text').textContent=recovered+(ok?T('cph-match'):'');
  document.getElementById('cph-table-wrap').style.display='block';
  const out=document.getElementById('cph-output');
  out.className='cipher-output show';
  out.style.borderColor=ok?'var(--grn)':'var(--red)';
  document.getElementById('cph-enc-btn').disabled=false;
  document.getElementById('cph-dec-btn').disabled=false;
}

function cphClear(){
  _cphCiphered=[];_cphOriginal='';
  document.getElementById('cph-stage').className='cipher-stage';
  document.getElementById('cph-table-wrap').style.display='none';
  document.getElementById('cph-output').className='cipher-output';
  document.getElementById('cph-dec-btn').disabled=true;
  document.getElementById('cph-text').value='Hello';
  const wn=document.getElementById('cph-warn');
  if(wn){wn.className='cipher-warning';wn.innerHTML='';}
}

// init on page load
setTimeout(cphValidate, 200);

