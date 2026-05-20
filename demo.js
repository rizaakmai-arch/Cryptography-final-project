// ================================================================
// demo.js — RSA Kaspi Demo Animation
// Автор: [имя участника]
// Отвечает за: анимацию Kaspi-демо, навигацию по этапам,
//              рендер правой панели, scroll-reveal наблюдатель
// ================================================================

const STAGES = [
  {
    icon:"🔐",title:"RSA-криптография",sub:"Введение",color:"#e8001c",
    body:[
      "RSA — алгоритм с публичным ключом, предложенный Rivest, Shamir и Adleman в 1977 году. Каждая пара ключей математически связана, но вычислить приватный ключ из публичного — практически невозможно.",
      "Kaspi.kz использует TLS 1.3, где RSA играет ключевую роль при аутентификации сервера через сертификат X.509, а также при подписи платёжных поручений.",
      "Безопасность RSA основана на сложности факторизации больших чисел: произведение n = p × q вычислить легко, а обратная задача (найти p и q) для 2048-битного n — вычислительно нереальна."
    ],
    accuracy:null,
    fact:"RSA-2048 защищён от взлома классическим компьютером: потребовалось бы ~2⁷⁰⁰ операций. Квантовый компьютер потенциально мог бы взломать его — именно поэтому банки готовятся к постквантовой криптографии."
  },
  {
    icon:"🤝",title:"TLS-рукопожатие",sub:"Установка соединения",color:"#5856d6",
    body:[
      "При открытии приложения телефон инициирует TLS 1.3-соединение. Сервер Kaspi отправляет свой X.509-сертификат, подписанный RSA — он содержит публичный ключ (e, n).",
      "Телефон проверяет цепочку сертификатов до доверенного корневого CA: сначала промежуточный CA, затем корневой. Только убедившись в цепочке, телефон доверяет серверу.",
      "После аутентификации генерируются эфемерные ECDHE-ключи (Forward Secrecy) — уникальный сессионный ключ для каждого соединения."
    ],
    accuracy:"В TLS 1.3 RSA не используется для обмена ключами (это делает ECDHE). RSA применяется исключительно для подписи сертификата сервера, что позволяет телефону убедиться в подлинности Kaspi.",
    fact:"Forward Secrecy: даже если приватный ключ сервера утечёт завтра, все прошлые сессии останутся зашифрованными — их ключи уже уничтожены."
  },
  {
    icon:"🗝️",title:"Аутентификация",sub:"Вход по PIN-коду",color:"#ff9500",
    body:[
      "После TLS-рукопожатия телефон отправляет аутентификационные данные по защищённому каналу: номер телефона и производную от PIN-кода через PBKDF2 (10 000+ итераций).",
      "Сервер сверяет хеш с хранимым значением, не зная самого PIN. Даже при утечке базы данных злоумышленник получит лишь медленно-хешированные значения.",
      "После успешной аутентификации сервер выдаёт JWT-токен, подписанный RSA-ключом (алгоритм RS256). Токен хранится в памяти и используется для каждого последующего запроса."
    ],
    accuracy:"PIN не передаётся напрямую. На устройстве он хешируется через PBKDF2 или bcrypt, затем передаётся по AES-256-GCM-туннелю TLS. Сервер сверяет хеш, а не сам PIN.",
    fact:"PBKDF2 намеренно медленный: даже самый быстрый GPU перебирает лишь ~10 млн вариантов в секунду. 6-значный PIN (10⁶ комбинаций) — взломать теоретически, но с ограничением попыток — нереально."
  },
  {
    icon:"✅",title:"Сессия установлена",sub:"Главный экран загружен",color:"#34c759",
    body:[
      "Главный экран — баланс, история, список карт — загружается через AES-256-GCM-туннель. Каждый HTTP-запрос защищён отдельным GCM-тегом целостности (128 бит).",
      "RSA сыграл свою роль: верификация сертификата и подпись JWT. Теперь в деле симметричный AES, который в 1000× быстрее RSA и идеален для больших объёмов данных.",
      "Все данные персонализированы и привязаны к вашей сессии. JWT-токен передаётся в каждом запросе в заголовке Authorization: Bearer."
    ],
    accuracy:null,
    fact:"AES-256-GCM — симметричный шифр. Один сессионный ключ (256 бит) шифрует и расшифровывает всё в рамках соединения. Безопасность — в секрете ключа и непредсказуемости nonce."
  },
  {
    icon:"🏦",title:"Мой Банк",sub:"Счета загружены через AES",color:"#34c759",
    body:[
      "Список счетов (Kaspi Gold, Kaspi Red, рассрочки) загружается одним API-запросом. Ответ сервера зашифрован AES-256-GCM — видны только размер пакета и IP-адрес серверов Kaspi.",
      "JWT-токен, подписанный RSA (RS256), в заголовке каждого запроса гарантирует серверу: именно вы запросили данные, никто не подменил токен в пути.",
      "Kaspi Gold *0654 с балансом 107 966 ₸ — эти данные пришли зашифрованными и расшифрованы только на вашем устройстве."
    ],
    accuracy:null,
    fact:"RS256 в JWT: сервер подписывает заголовок и payload своим RSA-приватным ключом d. Ваш телефон проверяет подпись публичным ключом e из сертификата — гарантия подлинности данных."
  },
  {
    icon:"💳",title:"Выбор счёта",sub:"Kaspi Gold для перевода",color:"#f0a830",
    body:[
      "Нажав на Kaspi Gold, телефон запрашивает детальную информацию: доступный баланс, лимиты, историю операций. Запрос подписан JWT с RSA, ответ — в AES-туннеле.",
      "При выборе 'Перевести' сервер проверяет: достаточно ли средств, не превышены ли дневные лимиты, не заблокирован ли счёт. Всё это — за одним API-запросом.",
      "Каждое действие логируется с временной меткой и цифровой подписью — аудиторский след, который нельзя подделать без приватного ключа сервера."
    ],
    accuracy:null,
    fact:"Лимиты переводов в Kaspi — до 5 000 000 ₸ в сутки между клиентами Kaspi. Превышение лимита проверяется на сервере после верификации JWT-подписи."
  },
  {
    icon:"📨",title:"Инициация перевода",sub:"Выбор получателя",color:"#007aff",
    body:[
      "Запрос на поиск получателя (+7 707 987 65 43) уходит по TLS-каналу. Провайдер видит только IP-адрес серверов Kaspi — ни номер телефона, ни сумму.",
      "Сервер возвращает зашифрованный ответ: 'Дарын Оспанов, карта Kaspi Gold'. Имя отображается до подтверждения — вы видите, кому переводите.",
      "На этом этапе формируется черновик платёжного поручения: отправитель, получатель, сумма, nonce (одноразовое число против replay-атак)."
    ],
    accuracy:null,
    fact:"HMAC-SHA256 защищает каждый API-запрос от подмены в пути: даже изменив один байт в зашифрованном пакете, сервер отклонит запрос — контрольная сумма не совпадёт."
  },
  {
    icon:"🔒",title:"RSA-подпись перевода",sub:"Откуда берётся d и как всё работает",color:"#e8001c",
    rsa_animation: true,
    body:[],
    accuracy:null,
    fact:"Подпись RSA-PSS: в отличие от RSA-PKCS1v1.5, PSS добавляет случайный salt — одни и те же данные каждый раз дают разную подпись. Это защищает от ряда атак на детерминированное RSA."
  },
  {
    icon:"📋",title:"Подтверждение платежа",sub:"Пакет данных отправлен",color:"#5856d6",
    body:[
      "Нажав ОТПРАВИТЬ, телефон формирует финальный пакет: зашифрованные данные + RSA-PSS подпись + timestamp + nonce. Всё обёрнуто в TLS-запись.",
      "Nonce — случайное 128-битное число, уникальное для каждого платежа. Если злоумышленник перехватит и повторно отправит запрос, сервер его отклонит: этот nonce уже использован.",
      "Timestamp ограничивает жизнь запроса: если между созданием и получением прошло более 30 секунд, запрос считается устаревшим и отвергается."
    ],
    accuracy:null,
    fact:"Anti-replay protection: сервер хранит использованные nonce в Redis-кэше с TTL 60 сек. Повторный запрос с тем же nonce получит ответ 409 Conflict."
  },
  {
    icon:"⚙️",title:"Обработка в HSM",sub:"Расшифровка и верификация",color:"#ff9500",
    body:[
      "Пакет поступает в HSM (Hardware Security Module) — физически защищённый чип, сертифицированный по FIPS 140-2 Level 3. Приватный RSA-ключ d никогда не покидает HSM.",
      "HSM проверяет RSA-PSS подпись: вычисляет S^e mod n и сравнивает с H(M). Совпадение означает: данные не изменены, подпись создана законным владельцем.",
      "После верификации система атомарно изменяет балансы: -50 000 ₸ у отправителя, +50 000 ₸ у получателя. Операция атомарна — либо оба изменения, либо ни одного."
    ],
    accuracy:null,
    fact:"FIPS 140-2 Level 3: попытка физически вскрыть HSM-корпус автоматически уничтожает ключи — специальная схема самоуничтожения реагирует на вскрытие, температуру, напряжение."
  },
  {
    icon:"🎉",title:"Перевод выполнен!",sub:"Итоги безопасности",color:"#34c759",
    body:[
      "За ~200–400 мс отработала целая цепочка: TLS 1.3 → ECDHE → AES-256-GCM → RSA-PSS (JWT + подпись) → HMAC-SHA256 → HSM. Каждое звено — отдельный слой защиты.",
      "RSA в Kaspi: (1) подпись TLS-сертификата сервера, (2) подпись JWT-токена сессии (RS256), (3) RSA-PSS подпись платёжного поручения, верифицируемая в HSM.",
      "Переход к постквантовой криптографии (ML-KEM, ML-DSA по NIST FIPS 203/204) уже начат — к 2029 году банки обязаны обновить инфраструктуру согласно рекомендациям NIST."
    ],
    accuracy:null,
    fact:"Kaspi обрабатывает миллионы транзакций ежедневно — каждая защищена описанной цепочкой. Суммарная вычислительная нагрузка на RSA-операции — одна из причин, почему банки инвестируют в HSM-кластеры."
  }
];

let cur = 0;
const total = STAGES.length;

function rsaAnimationHTML(stageIdx) {
  return `
  <div class="rp-header">
    <div class="rp-icon">🔒</div>
    <div>
      <div class="rp-stage-label">Этап ${stageIdx+1} / ${total}</div>
      <div class="rp-title" style="font-size:28px;">RSA-подпись</div>
      <div class="rp-subtitle" style="color:var(--red);">Откуда берётся ключ d</div>
    </div>
  </div>
  <div class="rp-divider" style="background:linear-gradient(90deg,var(--red),transparent);"></div>

  <div class="rsa-panel">

    <!-- STEP 7: SIGNING -->
    <div class="rsa-step rsa-section">
      <div class="rsa-section-title">⑦ Подпись вашего перевода 50 000 ₸</div>
      
      <!-- ============ ДАННЫЕ ПЛАТЕЖА ============ -->
      <div style="background:rgba(100,200,255,.12);border:2px solid rgba(100,200,255,.3);border-radius:14px;padding:18px;margin-bottom:18px;">
        <div style="font-size:18px;color:#64c8ff;font-family:'Raleway',sans-serif;margin-bottom:12px;font-weight:700;">📱 Платёж</div>
        <div style="font-size:16px;color:#fff;font-family:'SF Mono',monospace;line-height:1.8;">
          {<br/>
          &nbsp;&nbsp;"recipient": "+77079876543",<br/>
          &nbsp;&nbsp;"amount": 50000,<br/>
          &nbsp;&nbsp;"currency": "KZT"<br/>
          }
        </div>
      </div>

      <!-- ============ КОНВЕРТАЦИЯ M ============ -->
      <div style="background:rgba(147,112,219,.12);border:2px solid rgba(147,112,219,.3);border-radius:14px;padding:18px;margin-bottom:18px;">
        <div style="font-size:18px;color:#d8b4fe;font-family:'Raleway',sans-serif;margin-bottom:12px;font-weight:700;">🔄 Конвертируем M (данные)</div>
        
        <div style="margin-bottom:12px;">
          <div style="font-size:13px;color:rgba(255,255,255,.5);margin-bottom:6px;">1️⃣ Исходные данные:</div>
          <div style="background:rgba(255,255,255,.04);border-radius:8px;padding:10px;font-family:'SF Mono',monospace;font-size:14px;color:#d8b4fe;">
            M = {recipient, amount, currency}
          </div>
        </div>

        <div style="margin-bottom:12px;">
          <div style="font-size:13px;color:rgba(255,255,255,.5);margin-bottom:6px;">2️⃣ Применяем SHA-256 (хеширование):</div>
          <div style="background:rgba(255,255,255,.04);border-radius:8px;padding:10px;font-family:'SF Mono',monospace;font-size:14px;color:#d8b4fe;">
            hash(M) = a3f8c2b9e1d4f7c6...2c91
          </div>
        </div>

        <div>
          <div style="font-size:13px;color:rgba(255,255,255,.5);margin-bottom:6px;">3️⃣ Конвертируем хеш в число M:</div>
          <div style="background:rgba(255,255,255,.04);border-radius:8px;padding:10px;font-family:'SF Mono',monospace;font-size:16px;color:#d8b4fe;font-weight:600;">
            M = 2891
          </div>
        </div>
      </div>

      <!-- ============ ИЗВЕСТНЫЕ ЗНАЧЕНИЯ ============ -->
      <div style="background:rgba(59,130,246,.12);border:2px solid rgba(59,130,246,.3);border-radius:14px;padding:18px;margin-bottom:18px;">
        <div style="font-size:18px;color:#93c5fd;font-family:'Raleway',sans-serif;margin-bottom:12px;font-weight:700;">🔐 Известные значения (параметры RSA)</div>
        
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;">
          <div style="background:rgba(255,255,255,.05);border-radius:8px;padding:12px;text-align:center;">
            <div style="font-size:13px;color:rgba(255,255,255,.5);margin-bottom:6px;">p (простое число)</div>
            <div style="font-family:'SF Mono',monospace;font-size:32px;color:#93c5fd;font-weight:700;">53</div>
          </div>
          <div style="background:rgba(255,255,255,.05);border-radius:8px;padding:12px;text-align:center;">
            <div style="font-size:13px;color:rgba(255,255,255,.5);margin-bottom:6px;">q (простое число)</div>
            <div style="font-family:'SF Mono',monospace;font-size:32px;color:#93c5fd;font-weight:700;">59</div>
          </div>
        </div>

        <div style="background:rgba(255,255,255,.05);border-radius:8px;padding:12px;text-align:center;">
          <div style="font-size:13px;color:rgba(255,255,255,.5);margin-bottom:6px;">n = p × q (модуль)</div>
          <div style="font-family:'SF Mono',monospace;font-size:36px;color:#93c5fd;font-weight:700;">3127</div>
        </div>
      </div>

      <!-- ============ PUBLIC KEY ============ -->
      <div style="background:rgba(249,115,22,.12);border:2px solid rgba(249,115,22,.3);border-radius:14px;padding:18px;margin-bottom:18px;">
        <div style="font-size:18px;color:#fdba74;font-family:'Raleway',sans-serif;margin-bottom:12px;font-weight:700;">📤 Public Key (для всех)</div>
        
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
          <div style="background:rgba(255,255,255,.05);border-radius:8px;padding:12px;text-align:center;">
            <div style="font-size:13px;color:rgba(255,255,255,.5);margin-bottom:6px;">e</div>
            <div style="font-family:'SF Mono',monospace;font-size:32px;color:#fdba74;font-weight:700;">65537</div>
          </div>
          <div style="background:rgba(255,255,255,.05);border-radius:8px;padding:12px;text-align:center;">
            <div style="font-size:13px;color:rgba(255,255,255,.5);margin-bottom:6px;">n</div>
            <div style="font-family:'SF Mono',monospace;font-size:32px;color:#fdba74;font-weight:700;">3127</div>
          </div>
        </div>

        <div style="font-size:12px;color:rgba(255,200,100,.6);margin-top:10px;text-align:center;">
          (e, n) = (65537, 3127)
        </div>
      </div>

      <!-- ============ PRIVATE KEY ============ -->
      <div style="background:rgba(232,0,28,.12);border:2px solid rgba(232,0,28,.3);border-radius:14px;padding:18px;margin-bottom:18px;">
        <div style="font-size:18px;color:#fca5a5;font-family:'Raleway',sans-serif;margin-bottom:12px;font-weight:700;">🔒 Private Key (только Kaspi)</div>
        
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
          <div style="background:rgba(255,255,255,.05);border-radius:8px;padding:12px;text-align:center;">
            <div style="font-size:13px;color:rgba(255,255,255,.5);margin-bottom:6px;">d</div>
            <div style="font-family:'SF Mono',monospace;font-size:32px;color:#fca5a5;font-weight:700;">2753</div>
          </div>
          <div style="background:rgba(255,255,255,.05);border-radius:8px;padding:12px;text-align:center;">
            <div style="font-size:13px;color:rgba(255,255,255,.5);margin-bottom:6px;">n</div>
            <div style="font-family:'SF Mono',monospace;font-size:32px;color:#fca5a5;font-weight:700;">3127</div>
          </div>
        </div>

        <div style="font-size:12px;color:rgba(255,150,150,.6);margin-top:10px;text-align:center;">
          (d, n) = (2753, 3127)
        </div>
      </div>

      <!-- ============ SIGNATURE FORMULA ============ -->
      <div style="background:rgba(232,0,28,.12);border:3px solid rgba(232,0,28,.4);border-radius:14px;padding:18px;margin-bottom:18px;">
        <div style="font-size:18px;color:#fca5a5;font-family:'Raleway',sans-serif;margin-bottom:14px;font-weight:700;">📝 Formula for Signature</div>
        
        <div style="text-align:center;margin-bottom:14px;">
          <div style="font-family:'SF Mono',monospace;font-size:48px;color:#fca5a5;font-weight:700;line-height:1.1;">
            S ≡ M<sup style='font-size:40px;'>d</sup> (mod n)
          </div>
        </div>

        <div style="background:rgba(255,255,255,.04);border-radius:8px;padding:12px;">
          <div style="font-size:13px;color:rgba(255,255,255,.5);margin-bottom:8px;">Подставляем значения:</div>
          <div style="font-family:'SF Mono',monospace;font-size:16px;color:#fca5a5;line-height:1.8;">
            S ≡ 2891<sup style='font-size:13px;'>2753</sup> (mod 3127)<br/>
            S ≡ 2891 × 2891 × ... (2753 раза) (mod 3127)<br/>
            <span style="color:#86efac;font-weight:600;">S = 1847</span>
          </div>
        </div>
      </div>

      <!-- ============ SIGNATURE RESULT ============ -->
      <div style="background:rgba(76,217,100,.12);border:2px solid rgba(76,217,100,.3);border-radius:14px;padding:18px;margin-bottom:18px;">
        <div style="font-size:18px;color:#86efac;font-family:'Raleway',sans-serif;margin-bottom:12px;font-weight:700;">✅ Результат подписи S</div>
        
        <div style="background:rgba(255,255,255,.05);border-radius:8px;padding:14px;text-align:center;">
          <div style="font-family:'SF Mono',monospace;font-size:36px;color:#86efac;font-weight:700;">S = 1847</div>
          <div style="font-size:12px;color:rgba(132,255,172,.5);margin-top:8px;">
            ← Эта подпись отправляется с платежом
          </div>
        </div>
      </div>

      <!-- ============ VERIFICATION FORMULA ============ -->
      <div style="background:rgba(52,199,89,.12);border:3px solid rgba(52,199,89,.3);border-radius:14px;padding:18px;">
        <div style="font-size:18px;color:#86efac;font-family:'Raleway',sans-serif;margin-bottom:14px;font-weight:700;">🔍 Formula for Verification</div>
        
        <div style="text-align:center;margin-bottom:14px;">
          <div style="font-family:'SF Mono',monospace;font-size:48px;color:#86efac;font-weight:700;line-height:1.1;">
            M ≡ S<sup style='font-size:40px;'>e</sup> (mod n)
          </div>
        </div>

        <div style="background:rgba(255,255,255,.04);border-radius:8px;padding:12px;">
          <div style="font-size:13px;color:rgba(255,255,255,.5);margin-bottom:8px;">Подставляем значения:</div>
          <div style="font-family:'SF Mono',monospace;font-size:16px;color:#86efac;line-height:1.8;">
            M ≡ 1847<sup style='font-size:13px;'>65537</sup> (mod 3127)<br/>
            M ≡ 1847 × 1847 × ... (65537 раз) (mod 3127)<br/>
            <span style="color:#fca5a5;font-weight:600;">M = 2891 ✓</span>
          </div>
        </div>

        <div style="font-size:13px;color:#86efac;margin-top:12px;padding-top:12px;border-top:1px solid rgba(132,255,172,.2);">
          ✓ М совпадает с исходным = платёж подлинный!<br/>
          ✓ Это доказывает что платёж подписал именно Kaspi
        </div>
      </div>
    </div>

    <div class="rsa-step rp-fact" style="color:var(--red);border-left-color:var(--red);">
      <div class="rp-fact-label">💡 Факт</div>
      <p>${STAGES[stageIdx].fact}</p>
    </div>

    <button class="rsa-step rsa-restart" onclick="restartRSA(${stageIdx})">↺ Повторить анимацию</button>

  </div>
  `;
}

function renderPanel(i) {
  const s = STAGES[i];
  const panel = document.getElementById('right-panel');

  if (s.rsa_animation) {
    panel.innerHTML = rsaAnimationHTML(i);
    document.getElementById('kaspi-wrap').classList.add('rsa-slide-active');
    requestAnimationFrame(() => requestAnimationFrame(() => {
      startRSAAnimation();
      panel.querySelectorAll('*').forEach(el => {
        el.style.setProperty('font-size', '20px', 'important');
      });
      // Start JS phone scroll tracking (zoom breaks CSS sticky)
      if (window.initRSAPhoneScroll) window.initRSAPhoneScroll();
    }));
    return;
  }
  document.getElementById('kaspi-wrap').classList.remove('rsa-slide-active');
  if (window.cleanupRSAPhoneScroll) window.cleanupRSAPhoneScroll();

  panel.innerHTML = `
    <div class="rp-header">
      <div class="rp-icon">${s.icon}</div>
      <div>
        <div class="rp-stage-label">Этап ${i+1} / ${total}</div>
        <div class="rp-title">${s.title}</div>
        <div class="rp-subtitle" style="color:${s.color};">${s.sub}</div>
      </div>
    </div>
    <div class="rp-divider" style="background:linear-gradient(90deg,${s.color},transparent);"></div>
    <div class="rp-body">${s.body.map(p=>`<p>${p}</p>`).join('')}</div>
    ${s.accuracy ? `<div class="rp-accuracy"><div class="rp-accuracy-label">⚡ Точность vs реальность</div><p>${s.accuracy}</p></div>` : ''}
    <div class="rp-fact" style="color:${s.color};border-left-color:${s.color};">
      <div class="rp-fact-label">💡 Факт</div>
      <p>${s.fact}</p>
    </div>`;
}

function startRSAAnimation() {
  const steps = document.querySelectorAll('.rsa-step');
  steps.forEach((el, i) => {
    setTimeout(() => el.classList.add('rsa-visible'), 100 + i * 550);
  });
}

function restartRSA(i) {
  const steps = document.querySelectorAll('.rsa-step');
  steps.forEach(el => el.classList.remove('rsa-visible'));
  setTimeout(() => startRSAAnimation(), 100);
}

function renderDots() {
  const c = document.getElementById('dots');
  c.innerHTML = '';
  for (let i = 0; i < total; i++) {
    const d = document.createElement('button');
    d.className = 'dot' + (i === cur ? ' active' : i < cur ? ' past' : '');
    d.onclick = () => go(i);
    c.appendChild(d);
  }
}

function go(i) {
  document.querySelector('.screen.active')?.classList.remove('active');
  cur = i;
  const sc = document.querySelector(`[data-stage="${i}"]`);
  if (sc) sc.classList.add('active');
  const s = STAGES[i];
  document.getElementById('hdr-num').textContent = i + 1;
  document.getElementById('btn-prev').disabled = i === 0;
  const nxt = document.getElementById('btn-next');
  nxt.disabled = i === total - 1;
  nxt.textContent = i === total - 1 ? 'Готово ✓' : 'Далее →';
  renderPanel(i);
  renderDots();
  document.getElementById('right-panel').scrollTop = 0;
}

document.getElementById('btn-prev').onclick = () => { if (cur > 0) go(cur - 1); };
document.getElementById('btn-next').onclick = () => { if (cur < total - 1) go(cur + 1); };

// Init
renderPanel(0);
renderDots();


/* ── RSA PHONE SCROLL TRACKER ──────────────────────────────────────
   position:sticky is broken inside zoom:N containers (browser bug).
   Instead we listen to scroll on #pg-demo / window and apply
   transform:translateY to .phone-wrap manually.
──────────────────────────────────────────────────────────────────── */
(function(){
  var _cleanup = null;

  window.initRSAPhoneScroll = function() {
    if (_cleanup) { _cleanup(); _cleanup = null; }

    var pgDemo    = document.getElementById('pg-demo');
    var kaspiWrap = document.getElementById('kaspi-wrap');
    var phoneWrap = document.querySelector('#kaspi-wrap .phone-wrap');
    if (!phoneWrap || !pgDemo || !kaspiWrap) return;

    function onScroll() {
      if (!kaspiWrap.classList.contains('rsa-slide-active')) return;

      // 1. Считываем актуальный zoom
      var zoom = parseFloat(window.getComputedStyle(kaspiWrap).zoom) || 
                 parseFloat(window.getComputedStyle(pgDemo).zoom) || 1;

      var containerRect = kaspiWrap.getBoundingClientRect();
      var phoneRect = phoneWrap.getBoundingClientRect();
      
      var banner = document.querySelector('.header') || document.querySelector('header');
      var bannerHeight = banner ? banner.getBoundingClientRect().height : 60;

      // 2. НАСТРОЙКА: На сколько пикселей поднять телефон выше центра экрана
      // Подбирайте это значение (50, 70, 100), чтобы выровнять как нужно
      var visualOffsetUp = 100; 

      // 3. Вычисляем идеальную точку на экране с учетом смещения вверх
      var targetTop = bannerHeight + Math.max(0, (window.innerHeight - bannerHeight - phoneRect.height) / 2) - visualOffsetUp;

      // 4. Переводим в координаты внутри контейнера
      var currentTopInContainer = targetTop - containerRect.top;

      // 5. Защита от блокировки: гарантируем, что максимальный путь не уйдет в минус
      var maxTranslateScreen = Math.max(0, containerRect.height - phoneRect.height);

      // 6. Ограничиваем движение рамками контейнера
      var finalTranslateScreen = Math.max(0, Math.min(currentTopInContainer, maxTranslateScreen));

      // 7. Конвертируем экранные пиксели в CSS пиксели с учетом zoom
      var finalTranslateCSS = finalTranslateScreen / zoom;

      // Применяем трансформацию
      phoneWrap.style.transform = 'translateY(' + finalTranslateCSS + 'px)';
    }

    var ticking = false;
    function scrollThrottler() {
      if (!ticking) {
        window.requestAnimationFrame(function() {
          onScroll();
          ticking = false;
        });
        ticking = true;
      }
    }

    // Привязываем события
    pgDemo.addEventListener('scroll', scrollThrottler, { passive: true });
    window.addEventListener('scroll', scrollThrottler, { passive: true });
    window.addEventListener('resize', scrollThrottler, { passive: true });

    // Запускаем один раз сразу для инициализации позиции
    onScroll();

    _cleanup = function() {
      pgDemo.removeEventListener('scroll', scrollThrottler);
      window.removeEventListener('scroll', scrollThrottler);
      window.removeEventListener('resize', scrollThrottler);
      var pw = document.querySelector('#kaspi-wrap .phone-wrap');
      if (pw) pw.style.transform = '';
    };
  };

  window.cleanupRSAPhoneScroll = function() {
    if (_cleanup) { _cleanup(); _cleanup = null; }
  };
})();


(function() {

// ── KASPI MULTILANG ──────────────────────────────────────────
const KASPI_LANG = {
  ru: {
    hdrTitle: 'Kaspi.kz — RSA Криптография',
    hdrSub: 'Как защищён каждый перевод',
    etap: 'Этап',
    prev: '← Назад',
    next: 'Далее →',
    done: 'Готово ✓',
    stages: [
      { title:'RSA-криптография', sub:'Введение', body:['RSA — алгоритм с публичным ключом, предложенный Rivest, Shamir и Adleman в 1977 году. Каждая пара ключей математически связана, но вычислить приватный ключ из публичного — практически невозможно.','Kaspi.kz использует TLS 1.3, где RSA играет ключевую роль при аутентификации сервера через сертификат X.509, а также при подписи платёжных поручений.','Безопасность RSA основана на сложности факторизации больших чисел: произведение n = p × q вычислить легко, а обратная задача — вычислительно нереальна.'], accuracy:null, fact:'RSA-2048 защищён от взлома классическим компьютером: потребовалось бы ~2⁷⁰⁰ операций. Именно поэтому банки готовятся к постквантовой криптографии.' },
      { title:'TLS-рукопожатие', sub:'Установка соединения', body:['При открытии приложения телефон инициирует TLS 1.3-соединение. Сервер Kaspi отправляет свой X.509-сертификат, подписанный RSA — он содержит публичный ключ (e, n).','Телефон проверяет цепочку сертификатов до доверенного корневого CA. Только убедившись в цепочке, телефон доверяет серверу.','После аутентификации генерируются эфемерные ECDHE-ключи (Forward Secrecy).'], accuracy:'В TLS 1.3 RSA не используется для обмена ключами (это делает ECDHE). RSA применяется исключительно для подписи сертификата сервера.', fact:'Forward Secrecy: даже если приватный ключ сервера утечёт, все прошлые сессии останутся зашифрованными.' },
      { title:'Аутентификация', sub:'Вход по PIN-коду', body:['Телефон отправляет аутентификационные данные: номер телефона и производную от PIN-кода через PBKDF2.','Сервер сверяет хеш с хранимым значением. После успешной аутентификации сервер выдаёт JWT-токен, подписанный RSA (RS256).'], accuracy:'PIN хешируется через PBKDF2, передаётся по AES-256-GCM-туннелю TLS. Сервер сверяет хеш, а не сам PIN.', fact:'PBKDF2 намеренно медленный: даже самый быстрый GPU перебирает лишь ~10 млн вариантов в секунду.' },
      { title:'Сессия установлена', sub:'Главный экран загружен', body:['Главный экран загружается через AES-256-GCM-туннель. Каждый HTTP-запрос защищён отдельным GCM-тегом целостности.','RSA сыграл роль в верификации сертификата и подписи JWT. Теперь в деле симметричный AES.'], accuracy:null, fact:'AES-256-GCM — симметричный шифр. Один сессионный ключ шифрует и расшифровывает всё в рамках соединения.' },
      { title:'Мой Банк', sub:'Счета загружены через AES', body:['Список счетов загружается одним API-запросом. Ответ сервера зашифрован AES-256-GCM.','JWT-токен, подписанный RSA (RS256), гарантирует серверу подлинность запроса.'], accuracy:null, fact:'RS256 в JWT: сервер подписывает payload своим RSA-приватным ключом d. Телефон проверяет подпись публичным ключом e.' },
      { title:'Выбор счёта', sub:'Kaspi Gold для перевода', body:['Нажав на Kaspi Gold, телефон запрашивает детальную информацию. Запрос подписан JWT с RSA.','При выборе «Перевести» сервер проверяет достаточность средств и лимиты.'], accuracy:null, fact:'Лимиты переводов в Kaspi — до 5 000 000 ₸ в сутки между клиентами Kaspi.' },
      { title:'Инициация перевода', sub:'Выбор получателя', body:['Запрос на поиск получателя уходит по TLS-каналу. Провайдер видит только IP-адрес серверов Kaspi.','Сервер возвращает зашифрованный ответ с именем получателя.'], accuracy:null, fact:'HMAC-SHA256 защищает каждый API-запрос: изменив один байт, сервер отклонит запрос.' },
      { title:'RSA-подпись перевода', sub:'Откуда берётся d и как всё работает', body:[], accuracy:null, fact:'RSA-PSS: PSS добавляет случайный salt — одни и те же данные каждый раз дают разную подпись. Защита от атак на детерминированное RSA.' },
      { title:'Подтверждение платежа', sub:'Пакет данных отправлен', body:['Телефон формирует финальный пакет: зашифрованные данные + RSA-PSS подпись + timestamp + nonce.','Nonce — случайное 128-битное число, уникальное для каждого платежа.'], accuracy:null, fact:'Anti-replay: сервер хранит использованные nonce в Redis-кэше с TTL 60 сек.' },
      { title:'Обработка в HSM', sub:'Расшифровка и верификация', body:['Пакет поступает в HSM — физически защищённый чип. Приватный RSA-ключ d никогда не покидает HSM.','HSM проверяет RSA-PSS подпись и атомарно изменяет балансы.'], accuracy:null, fact:'FIPS 140-2 Level 3: попытка вскрыть HSM автоматически уничтожает ключи.' },
      { title:'Перевод выполнен!', sub:'Итоги безопасности', body:['За ~200–400 мс: TLS 1.3 → ECDHE → AES-256-GCM → RSA-PSS → HMAC-SHA256 → HSM.','RSA в Kaspi: (1) подпись сертификата, (2) подпись JWT (RS256), (3) RSA-PSS подпись платёжного поручения.'], accuracy:null, fact:'Kaspi обрабатывает миллионы транзакций — каждая защищена этой цепочкой.' }
    ]
  },
  en: {
    hdrTitle: 'Kaspi.kz — RSA Cryptography',
    hdrSub: 'How every transfer is protected',
    etap: 'Stage',
    prev: '← Back',
    next: 'Next →',
    done: 'Done ✓',
    stages: [
      { title:'RSA Cryptography', sub:'Introduction', body:['RSA is a public-key algorithm proposed by Rivest, Shamir and Adleman in 1977. Each key pair is mathematically linked, but computing the private key from the public one is computationally infeasible.','Kaspi.kz uses TLS 1.3, where RSA plays a key role in server authentication via an X.509 certificate and in signing payment orders.','RSA security is based on the difficulty of factoring large numbers: computing n = p × q is easy, but the reverse — finding p and q — is practically impossible.'], accuracy:null, fact:'RSA-2048 is safe from classical computers: breaking it would require ~2⁷⁰⁰ operations. That is why banks are preparing for post-quantum cryptography.' },
      { title:'TLS Handshake', sub:'Establishing the connection', body:['When the app opens, the phone initiates a TLS 1.3 connection. The Kaspi server sends its X.509 certificate signed with RSA — it contains the public key (e, n).','The phone verifies the certificate chain up to a trusted root CA. Only then does it trust the server.','After authentication, ephemeral ECDHE keys are generated (Forward Secrecy).'], accuracy:'In TLS 1.3, RSA is not used for key exchange (ECDHE does that). RSA is used exclusively to sign the server certificate.', fact:'Forward Secrecy: even if the server private key leaks, all past sessions remain encrypted — their keys are already destroyed.' },
      { title:'Authentication', sub:'Login with PIN', body:['The phone sends authentication data: phone number and a derivative of the PIN via PBKDF2.','The server checks the hash. On success, it issues a JWT token signed with RSA (RS256).'], accuracy:'The PIN is hashed via PBKDF2 and sent through an AES-256-GCM TLS tunnel. The server checks the hash, not the PIN itself.', fact:'PBKDF2 is intentionally slow: even the fastest GPU checks only ~10M combinations per second.' },
      { title:'Session Established', sub:'Home screen loaded', body:['The home screen loads through an AES-256-GCM tunnel. Every HTTP request is protected by its own 128-bit GCM integrity tag.','RSA played its role in certificate verification and JWT signing. Now symmetric AES takes over.'], accuracy:null, fact:'AES-256-GCM is a symmetric cipher. One session key encrypts and decrypts everything within the connection.' },
      { title:'My Bank', sub:'Accounts loaded via AES', body:['The account list loads in one API call. The server response is encrypted with AES-256-GCM.','A JWT token signed with RSA (RS256) proves to the server that the request is authentic.'], accuracy:null, fact:'RS256 in JWT: the server signs the payload with its RSA private key d. Your phone verifies the signature using public key e.' },
      { title:'Account Selection', sub:'Kaspi Gold for transfer', body:['Tapping Kaspi Gold, the phone requests detailed info. The request is signed with JWT/RSA.','Selecting Transfer, the server checks the available balance and daily limits.'], accuracy:null, fact:'Kaspi transfer limits: up to 5,000,000 ₸ per day between Kaspi clients.' },
      { title:'Initiating Transfer', sub:'Choosing recipient', body:['The recipient lookup request goes through the TLS channel. The ISP only sees Kaspi server IPs.','The server returns an encrypted response with the recipient name.'], accuracy:null, fact:'HMAC-SHA256 protects every API request: changing even one byte causes the server to reject the request.' },
      { title:'RSA Transfer Signature', sub:'Where d comes from and how it works', body:[], accuracy:null, fact:'RSA-PSS: PSS adds a random salt — the same data gives a different signature every time. This protects against attacks on deterministic RSA.' },
      { title:'Payment Confirmation', sub:'Data packet sent', body:['The phone assembles the final packet: encrypted data + RSA-PSS signature + timestamp + nonce.','The nonce is a random 128-bit number unique to each payment.'], accuracy:null, fact:'Anti-replay: the server stores used nonces in a Redis cache with TTL 60 sec.' },
      { title:'HSM Processing', sub:'Decryption and verification', body:['The packet reaches the HSM — a physically secured chip. The RSA private key d never leaves the HSM.','The HSM verifies the RSA-PSS signature and atomically updates balances.'], accuracy:null, fact:'FIPS 140-2 Level 3: attempting to open the HSM physically destroys the keys automatically.' },
      { title:'Transfer Complete!', sub:'Security summary', body:['In ~200–400 ms: TLS 1.3 → ECDHE → AES-256-GCM → RSA-PSS → HMAC-SHA256 → HSM.','RSA in Kaspi: (1) TLS certificate signature, (2) JWT signature (RS256), (3) RSA-PSS payment signature verified in HSM.'], accuracy:null, fact:'Kaspi processes millions of transactions daily — each protected by this chain.' }
    ]
  },
  kz: {
    hdrTitle: 'Kaspi.kz — RSA Криптография',
    hdrSub: 'Әр аударым қалай қорғалады',
    etap: 'Кезең',
    prev: '← Артқа',
    next: 'Келесі →',
    done: 'Дайын ✓',
    stages: [
      { title:'RSA-криптография', sub:'Кіріспе', body:['RSA — Rivest, Shamir және Adleman 1977 жылы ұсынған ашық кілтті алгоритм. Кілт жұбы математикалық байланысқан, бірақ жекелік кілтті ашық кілттен есептеу мүмкін емес.','Kaspi.kz TLS 1.3 протоколын қолданады, мұнда RSA X.509 сертификаты арқылы серверді аутентификациялауда және төлем бұйрықтарына қол қоюда маңызды рөл атқарады.','RSA қауіпсіздігі үлкен сандарды факторлаудың күрделілігіне негізделген: n = p × q есептеу оңай, ал кері есеп — іс жүзінде мүмкін емес.'], accuracy:null, fact:'RSA-2048 классикалық компьютерден қорғалған: оны бұзуға ~2⁷⁰⁰ операция қажет. Сондықтан банктер кванттан кейінгі криптографияға дайындалуда.' },
      { title:'TLS қол алысу', sub:'Байланыс орнату', body:['Қосымша ашылғанда телефон TLS 1.3 байланысын бастайды. Kaspi сервері RSA қолтаңбасы бар X.509 сертификатын жібереді.','Телефон сенімді тамырлы CA-ға дейін сертификат тізбегін тексереді.','Аутентификациядан кейін уақытша ECDHE кілттері жасалады (Forward Secrecy).'], accuracy:'TLS 1.3-те RSA кілт алмасу үшін қолданылмайды (ECDHE жасайды). RSA тек сервер сертификатына қол қою үшін пайдаланылады.', fact:'Forward Secrecy: серверлік жеке кілт ашылса да, барлық өткен сессиялар шифрланған күйінде қалады.' },
      { title:'Аутентификация', sub:'PIN-кодпен кіру', body:['Телефон аутентификация деректерін жібереді: телефон нөмірі және PBKDF2 арқылы PIN туындысы.','Сервер хешті тексергеннен кейін RSA қолтаңбасы бар JWT-токен береді (RS256).'], accuracy:'PIN PBKDF2 арқылы хешіледі және AES-256-GCM TLS туннелі арқылы жіберіледі.', fact:'PBKDF2 әдейі баяу: тіпті ең жылдам GPU секундына тек ~10 млн нұсқаны тексереді.' },
      { title:'Сессия орнатылды', sub:'Басты экран жүктелді', body:['Басты экран AES-256-GCM туннелі арқылы жүктеледі. Әр HTTP сұранысы жеке GCM тұтастық тегімен қорғалады.','RSA сертификатты тексеруде және JWT қол қоюда рөлін атқарды. Енді симметриялық AES іске кіреді.'], accuracy:null, fact:'AES-256-GCM симметриялық шифр. Бір сессиялық кілт байланыс аясындағы барлықты шифрлайды және шифрды ашады.' },
      { title:'Менің банкім', sub:'Шоттар AES арқылы жүктелді', body:['Шоттар тізімі бір API сұранысымен жүктеледі. Сервер жауабы AES-256-GCM шифрланған.','RSA қолтаңбасы бар JWT-токен (RS256) серверге сұраныстың шынайылығын дәлелдейді.'], accuracy:null, fact:'JWT-дегі RS256: сервер payload-ды RSA жеке кілтімен d қол қояды. Телефон ашық кілтпен e тексереді.' },
      { title:'Шот таңдау', sub:'Аудару үшін Kaspi Gold', body:['Kaspi Gold басқанда, телефон егжей-тегжейлі ақпарат сұрайды. Сұраныс JWT/RSA арқылы қол қойылған.','«Аудару» таңдалғанда сервер қаражат жеткіліктілігін және лимиттерді тексереді.'], accuracy:null, fact:'Kaspi аударым лимиті — Kaspi клиенттері арасында тәулігіне 5 000 000 ₸ дейін.' },
      { title:'Аударымды бастау', sub:'Алушыны таңдау', body:['Алушыны іздеу сұранысы TLS-арналы арқылы жіберіледі. Провайдер тек Kaspi серверлерінің IP-мекенжайын көреді.','Сервер алушының атымен шифрланған жауапты қайтарады.'], accuracy:null, fact:'HMAC-SHA256 әр API сұранысын қорғайды: бір байт өзгертсе, сервер сұранысты қабылдамайды.' },
      { title:'RSA аударым қолтаңбасы', sub:'d қайдан шығады және барлығы қалай жұмыс істейді', body:[], accuracy:null, fact:'RSA-PSS: PSS кездейсоқ salt қосады — бірдей деректер әр жолы әртүрлі қолтаңба береді. Детерминирленген RSA шабуылдарынан қорғайды.' },
      { title:'Төлемді растау', sub:'Деректер пакеті жіберілді', body:['Телефон соңғы пакетті жасайды: шифрланған деректер + RSA-PSS қолтаңба + timestamp + nonce.','Nonce — әр төлем үшін бірегей 128 биттік кездейсоқ сан.'], accuracy:null, fact:'Replay-дан қорғау: сервер қолданылған nonce-тарды Redis кэшінде TTL 60 сек сақтайды.' },
      { title:'HSM-де өңдеу', sub:'Шифрды ашу және верификация', body:['Пакет HSM-ге түседі — физикалық қорғалған чип. RSA жеке кілті d ешқашан HSM-нен шықпайды.','HSM RSA-PSS қолтаңбасын тексереді және балансты атомды түрде өзгертеді.'], accuracy:null, fact:'FIPS 140-2 Level 3: HSM корпусын физикалық ашуға әрекет еткенде кілттер автоматты түрде жойылады.' },
      { title:'Аударым орындалды!', sub:'Қауіпсіздік қорытындысы', body:['~200–400 мс ішінде: TLS 1.3 → ECDHE → AES-256-GCM → RSA-PSS → HMAC-SHA256 → HSM.','Kaspi-дегі RSA: (1) сертификатқа қол қою, (2) JWT қолтаңбасы (RS256), (3) HSM-де тексерілетін RSA-PSS төлем қолтаңбасы.'], accuracy:null, fact:'Kaspi күн сайын миллиондаған транзакцияны өңдейді — әрқайсысы осы тізбекпен қорғалады.' }
    ]
  }
};

window.kaspiApplyLang = function() {
  const langKey = localStorage.getItem('rsa_lang') || 'ru';
  const L = KASPI_LANG[langKey] || KASPI_LANG.ru;
  // Header
  const hdrTitle = document.querySelector('#kaspi-wrap .hdr-title');
  const hdrSub = document.querySelector('#kaspi-wrap .hdr-sub');
  if(hdrTitle) hdrTitle.textContent = L.hdrTitle;
  if(hdrSub) hdrSub.textContent = L.hdrSub;
  // Buttons
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  if(btnPrev) btnPrev.textContent = L.prev;
  if(btnNext) btnNext.textContent = (cur === total-1) ? L.done : L.next;
  // Patch STAGES with current language
  const ls = L.stages;
  for(let i=0;i<Math.min(STAGES.length, ls.length);i++){
    if(!STAGES[i].rsa_animation) {
      STAGES[i]._title = ls[i].title;
      STAGES[i]._sub = ls[i].sub;
      STAGES[i]._body = ls[i].body;
      STAGES[i]._fact = ls[i].fact;
      STAGES[i]._accuracy = ls[i].accuracy;
    } else {
      STAGES[i]._fact = ls[i].fact;
    }
  }
  // Re-render current panel
  if(typeof renderPanel === 'function') renderPanel(cur);
  // Re-render dots label
  const badge = document.getElementById('hdr-num');
  if(badge) badge.textContent = cur + 1;
};


const STAGES = [
  {
    icon:"🔐",title:"RSA-криптография",sub:"Введение",color:"#e8001c",
    body:[
      "RSA — алгоритм с публичным ключом, предложенный Rivest, Shamir и Adleman в 1977 году. Каждая пара ключей математически связана, но вычислить приватный ключ из публичного — практически невозможно.",
      "Kaspi.kz использует TLS 1.3, где RSA играет ключевую роль при аутентификации сервера через сертификат X.509, а также при подписи платёжных поручений.",
      "Безопасность RSA основана на сложности факторизации больших чисел: произведение n = p × q вычислить легко, а обратная задача (найти p и q) для 2048-битного n — вычислительно нереальна."
    ],
    accuracy:null,
    fact:"RSA-2048 защищён от взлома классическим компьютером: потребовалось бы ~2⁷⁰⁰ операций. Квантовый компьютер потенциально мог бы взломать его — именно поэтому банки готовятся к постквантовой криптографии."
  },
  {
    icon:"🤝",title:"TLS-рукопожатие",sub:"Установка соединения",color:"#5856d6",
    body:[
      "При открытии приложения телефон инициирует TLS 1.3-соединение. Сервер Kaspi отправляет свой X.509-сертификат, подписанный RSA — он содержит публичный ключ (e, n).",
      "Телефон проверяет цепочку сертификатов до доверенного корневого CA: сначала промежуточный CA, затем корневой. Только убедившись в цепочке, телефон доверяет серверу.",
      "После аутентификации генерируются эфемерные ECDHE-ключи (Forward Secrecy) — уникальный сессионный ключ для каждого соединения."
    ],
    accuracy:"В TLS 1.3 RSA не используется для обмена ключами (это делает ECDHE). RSA применяется исключительно для подписи сертификата сервера, что позволяет телефону убедиться в подлинности Kaspi.",
    fact:"Forward Secrecy: даже если приватный ключ сервера утечёт завтра, все прошлые сессии останутся зашифрованными — их ключи уже уничтожены."
  },
  {
    icon:"🗝️",title:"Аутентификация",sub:"Вход по PIN-коду",color:"#ff9500",
    body:[
      "После TLS-рукопожатия телефон отправляет аутентификационные данные по защищённому каналу: номер телефона и производную от PIN-кода через PBKDF2 (10 000+ итераций).",
      "Сервер сверяет хеш с хранимым значением, не зная самого PIN. Даже при утечке базы данных злоумышленник получит лишь медленно-хешированные значения.",
      "После успешной аутентификации сервер выдаёт JWT-токен, подписанный RSA-ключом (алгоритм RS256). Токен хранится в памяти и используется для каждого последующего запроса."
    ],
    accuracy:"PIN не передаётся напрямую. На устройстве он хешируется через PBKDF2 или bcrypt, затем передаётся по AES-256-GCM-туннелю TLS. Сервер сверяет хеш, а не сам PIN.",
    fact:"PBKDF2 намеренно медленный: даже самый быстрый GPU перебирает лишь ~10 млн вариантов в секунду. 6-значный PIN (10⁶ комбинаций) — взломать теоретически, но с ограничением попыток — нереально."
  },
  {
    icon:"✅",title:"Сессия установлена",sub:"Главный экран загружен",color:"#34c759",
    body:[
      "Главный экран — баланс, история, список карт — загружается через AES-256-GCM-туннель. Каждый HTTP-запрос защищён отдельным GCM-тегом целостности (128 бит).",
      "RSA сыграл свою роль: верификация сертификата и подпись JWT. Теперь в деле симметричный AES, который в 1000× быстрее RSA и идеален для больших объёмов данных.",
      "Все данные персонализированы и привязаны к вашей сессии. JWT-токен передаётся в каждом запросе в заголовке Authorization: Bearer."
    ],
    accuracy:null,
    fact:"AES-256-GCM — симметричный шифр. Один сессионный ключ (256 бит) шифрует и расшифровывает всё в рамках соединения. Безопасность — в секрете ключа и непредсказуемости nonce."
  },
  {
    icon:"🏦",title:"Мой Банк",sub:"Счета загружены через AES",color:"#34c759",
    body:[
      "Список счетов (Kaspi Gold, Kaspi Red, рассрочки) загружается одним API-запросом. Ответ сервера зашифрован AES-256-GCM — видны только размер пакета и IP-адрес серверов Kaspi.",
      "JWT-токен, подписанный RSA (RS256), в заголовке каждого запроса гарантирует серверу: именно вы запросили данные, никто не подменил токен в пути.",
      "Kaspi Gold *0654 с балансом 107 966 ₸ — эти данные пришли зашифрованными и расшифрованы только на вашем устройстве."
    ],
    accuracy:null,
    fact:"RS256 в JWT: сервер подписывает заголовок и payload своим RSA-приватным ключом d. Ваш телефон проверяет подпись публичным ключом e из сертификата — гарантия подлинности данных."
  },
  {
    icon:"💳",title:"Выбор счёта",sub:"Kaspi Gold для перевода",color:"#f0a830",
    body:[
      "Нажав на Kaspi Gold, телефон запрашивает детальную информацию: доступный баланс, лимиты, историю операций. Запрос подписан JWT с RSA, ответ — в AES-туннеле.",
      "При выборе 'Перевести' сервер проверяет: достаточно ли средств, не превышены ли дневные лимиты, не заблокирован ли счёт. Всё это — за одним API-запросом.",
      "Каждое действие логируется с временной меткой и цифровой подписью — аудиторский след, который нельзя подделать без приватного ключа сервера."
    ],
    accuracy:null,
    fact:"Лимиты переводов в Kaspi — до 5 000 000 ₸ в сутки между клиентами Kaspi. Превышение лимита проверяется на сервере после верификации JWT-подписи."
  },
  {
    icon:"📨",title:"Инициация перевода",sub:"Выбор получателя",color:"#007aff",
    body:[
      "Запрос на поиск получателя (+7 707 987 65 43) уходит по TLS-каналу. Провайдер видит только IP-адрес серверов Kaspi — ни номер телефона, ни сумму.",
      "Сервер возвращает зашифрованный ответ: 'Дарын Оспанов, карта Kaspi Gold'. Имя отображается до подтверждения — вы видите, кому переводите.",
      "На этом этапе формируется черновик платёжного поручения: отправитель, получатель, сумма, nonce (одноразовое число против replay-атак)."
    ],
    accuracy:null,
    fact:"HMAC-SHA256 защищает каждый API-запрос от подмены в пути: даже изменив один байт в зашифрованном пакете, сервер отклонит запрос — контрольная сумма не совпадёт."
  },
  {
    icon:"🔒",title:"RSA-подпись перевода",sub:"Откуда берётся d и как всё работает",color:"#e8001c",
    rsa_animation: true,
    body:[],
    accuracy:null,
    fact:"Подпись RSA-PSS: в отличие от RSA-PKCS1v1.5, PSS добавляет случайный salt — одни и те же данные каждый раз дают разную подпись. Это защищает от ряда атак на детерминированное RSA."
  },
  {
    icon:"📋",title:"Подтверждение платежа",sub:"Пакет данных отправлен",color:"#5856d6",
    body:[
      "Нажав ОТПРАВИТЬ, телефон формирует финальный пакет: зашифрованные данные + RSA-PSS подпись + timestamp + nonce. Всё обёрнуто в TLS-запись.",
      "Nonce — случайное 128-битное число, уникальное для каждого платежа. Если злоумышленник перехватит и повторно отправит запрос, сервер его отклонит: этот nonce уже использован.",
      "Timestamp ограничивает жизнь запроса: если между созданием и получением прошло более 30 секунд, запрос считается устаревшим и отвергается."
    ],
    accuracy:null,
    fact:"Anti-replay protection: сервер хранит использованные nonce в Redis-кэше с TTL 60 сек. Повторный запрос с тем же nonce получит ответ 409 Conflict."
  },
  {
    icon:"⚙️",title:"Обработка в HSM",sub:"Расшифровка и верификация",color:"#ff9500",
    body:[
      "Пакет поступает в HSM (Hardware Security Module) — физически защищённый чип, сертифицированный по FIPS 140-2 Level 3. Приватный RSA-ключ d никогда не покидает HSM.",
      "HSM проверяет RSA-PSS подпись: вычисляет S^e mod n и сравнивает с H(M). Совпадение означает: данные не изменены, подпись создана законным владельцем.",
      "После верификации система атомарно изменяет балансы: -50 000 ₸ у отправителя, +50 000 ₸ у получателя. Операция атомарна — либо оба изменения, либо ни одного."
    ],
    accuracy:null,
    fact:"FIPS 140-2 Level 3: попытка физически вскрыть HSM-корпус автоматически уничтожает ключи — специальная схема самоуничтожения реагирует на вскрытие, температуру, напряжение."
  },
  {
    icon:"🎉",title:"Перевод выполнен!",sub:"Итоги безопасности",color:"#34c759",
    body:[
      "За ~200–400 мс отработала целая цепочка: TLS 1.3 → ECDHE → AES-256-GCM → RSA-PSS (JWT + подпись) → HMAC-SHA256 → HSM. Каждое звено — отдельный слой защиты.",
      "RSA в Kaspi: (1) подпись TLS-сертификата сервера, (2) подпись JWT-токена сессии (RS256), (3) RSA-PSS подпись платёжного поручения, верифицируемая в HSM.",
      "Переход к постквантовой криптографии (ML-KEM, ML-DSA по NIST FIPS 203/204) уже начат — к 2029 году банки обязаны обновить инфраструктуру согласно рекомендациям NIST."
    ],
    accuracy:null,
    fact:"Kaspi обрабатывает миллионы транзакций ежедневно — каждая защищена описанной цепочкой. Суммарная вычислительная нагрузка на RSA-операции — одна из причин, почему банки инвестируют в HSM-кластеры."
  }
];

let cur = 0;
const total = STAGES.length;

function rsaAnimationHTML(stageIdx, etap, factText) {
  etap = etap || (KASPI_LANG[localStorage.getItem('rsa_lang')||'ru']||KASPI_LANG.ru).etap;
  factText = factText || STAGES[stageIdx].fact;
  return `
  <div class="rp-header">
    <div class="rp-icon">🔒</div>
    <div>
      <div class="rp-stage-label">${etap} ${stageIdx+1} / ${total}</div>
      <div class="rp-title" style="font-size:28px;">RSA-подпись</div>
      <div class="rp-subtitle" style="color:var(--red);">Откуда берётся ключ d</div>
    </div>
  </div>
  <div class="rp-divider" style="background:linear-gradient(90deg,var(--red),transparent);"></div>

  <div class="rsa-panel">

    <!-- STEP 7: SIGNING -->
    <div class="rsa-step rsa-section">
      <div class="rsa-section-title">⑦ Подпись вашего перевода 50 000 ₸</div>
      
      <!-- ============ ДАННЫЕ ПЛАТЕЖА ============ -->
      <div style="background:rgba(100,200,255,.12);border:2px solid rgba(100,200,255,.3);border-radius:14px;padding:18px;margin-bottom:18px;">
        <div style="font-size:18px;color:#64c8ff;font-family:'Raleway',sans-serif;margin-bottom:12px;font-weight:700;">📱 Платёж</div>
        <div style="font-size:16px;color:#fff;font-family:'SF Mono',monospace;line-height:1.8;">
          {<br/>
          &nbsp;&nbsp;"recipient": "+77079876543",<br/>
          &nbsp;&nbsp;"amount": 50000,<br/>
          &nbsp;&nbsp;"currency": "KZT"<br/>
          }
        </div>
      </div>

      <!-- ============ КОНВЕРТАЦИЯ M ============ -->
      <div style="background:rgba(147,112,219,.12);border:2px solid rgba(147,112,219,.3);border-radius:14px;padding:18px;margin-bottom:18px;">
        <div style="font-size:18px;color:#d8b4fe;font-family:'Raleway',sans-serif;margin-bottom:12px;font-weight:700;">🔄 Конвертируем M (данные)</div>
        
        <div style="margin-bottom:12px;">
          <div style="font-size:13px;color:rgba(255,255,255,.5);margin-bottom:6px;">1️⃣ Исходные данные:</div>
          <div style="background:rgba(255,255,255,.04);border-radius:8px;padding:10px;font-family:'SF Mono',monospace;font-size:14px;color:#d8b4fe;">
            M = {recipient, amount, currency}
          </div>
        </div>

        <div style="margin-bottom:12px;">
          <div style="font-size:13px;color:rgba(255,255,255,.5);margin-bottom:6px;">2️⃣ Применяем SHA-256 (хеширование):</div>
          <div style="background:rgba(255,255,255,.04);border-radius:8px;padding:10px;font-family:'SF Mono',monospace;font-size:14px;color:#d8b4fe;">
            hash(M) = a3f8c2b9e1d4f7c6...2c91
          </div>
        </div>

        <div>
          <div style="font-size:13px;color:rgba(255,255,255,.5);margin-bottom:6px;">3️⃣ Конвертируем хеш в число M:</div>
          <div style="background:rgba(255,255,255,.04);border-radius:8px;padding:10px;font-family:'SF Mono',monospace;font-size:16px;color:#d8b4fe;font-weight:600;">
            M = 2891
          </div>
        </div>
      </div>

      <!-- ============ ИЗВЕСТНЫЕ ЗНАЧЕНИЯ ============ -->
      <div style="background:rgba(59,130,246,.12);border:2px solid rgba(59,130,246,.3);border-radius:14px;padding:18px;margin-bottom:18px;">
        <div style="font-size:18px;color:#93c5fd;font-family:'Raleway',sans-serif;margin-bottom:12px;font-weight:700;">🔐 Известные значения (параметры RSA)</div>
        
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;">
          <div style="background:rgba(255,255,255,.05);border-radius:8px;padding:12px;text-align:center;">
            <div style="font-size:13px;color:rgba(255,255,255,.5);margin-bottom:6px;">p (простое число)</div>
            <div style="font-family:'SF Mono',monospace;font-size:32px;color:#93c5fd;font-weight:700;">53</div>
          </div>
          <div style="background:rgba(255,255,255,.05);border-radius:8px;padding:12px;text-align:center;">
            <div style="font-size:13px;color:rgba(255,255,255,.5);margin-bottom:6px;">q (простое число)</div>
            <div style="font-family:'SF Mono',monospace;font-size:32px;color:#93c5fd;font-weight:700;">59</div>
          </div>
        </div>

        <div style="background:rgba(255,255,255,.05);border-radius:8px;padding:12px;text-align:center;">
          <div style="font-size:13px;color:rgba(255,255,255,.5);margin-bottom:6px;">n = p × q (модуль)</div>
          <div style="font-family:'SF Mono',monospace;font-size:36px;color:#93c5fd;font-weight:700;">3127</div>
        </div>
      </div>

      <!-- ============ PUBLIC KEY ============ -->
      <div style="background:rgba(249,115,22,.12);border:2px solid rgba(249,115,22,.3);border-radius:14px;padding:18px;margin-bottom:18px;">
        <div style="font-size:18px;color:#fdba74;font-family:'Raleway',sans-serif;margin-bottom:12px;font-weight:700;">📤 Public Key (для всех)</div>
        
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
          <div style="background:rgba(255,255,255,.05);border-radius:8px;padding:12px;text-align:center;">
            <div style="font-size:13px;color:rgba(255,255,255,.5);margin-bottom:6px;">e</div>
            <div style="font-family:'SF Mono',monospace;font-size:32px;color:#fdba74;font-weight:700;">65537</div>
          </div>
          <div style="background:rgba(255,255,255,.05);border-radius:8px;padding:12px;text-align:center;">
            <div style="font-size:13px;color:rgba(255,255,255,.5);margin-bottom:6px;">n</div>
            <div style="font-family:'SF Mono',monospace;font-size:32px;color:#fdba74;font-weight:700;">3127</div>
          </div>
        </div>

        <div style="font-size:12px;color:rgba(255,200,100,.6);margin-top:10px;text-align:center;">
          (e, n) = (65537, 3127)
        </div>
      </div>

      <!-- ============ PRIVATE KEY ============ -->
      <div style="background:rgba(232,0,28,.12);border:2px solid rgba(232,0,28,.3);border-radius:14px;padding:18px;margin-bottom:18px;">
        <div style="font-size:18px;color:#fca5a5;font-family:'Raleway',sans-serif;margin-bottom:12px;font-weight:700;">🔒 Private Key (только Kaspi)</div>
        
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
          <div style="background:rgba(255,255,255,.05);border-radius:8px;padding:12px;text-align:center;">
            <div style="font-size:13px;color:rgba(255,255,255,.5);margin-bottom:6px;">d</div>
            <div style="font-family:'SF Mono',monospace;font-size:32px;color:#fca5a5;font-weight:700;">2753</div>
          </div>
          <div style="background:rgba(255,255,255,.05);border-radius:8px;padding:12px;text-align:center;">
            <div style="font-size:13px;color:rgba(255,255,255,.5);margin-bottom:6px;">n</div>
            <div style="font-family:'SF Mono',monospace;font-size:32px;color:#fca5a5;font-weight:700;">3127</div>
          </div>
        </div>

        <div style="font-size:12px;color:rgba(255,150,150,.6);margin-top:10px;text-align:center;">
          (d, n) = (2753, 3127)
        </div>
      </div>

      <!-- ============ SIGNATURE FORMULA ============ -->
      <div style="background:rgba(232,0,28,.12);border:3px solid rgba(232,0,28,.4);border-radius:14px;padding:18px;margin-bottom:18px;">
        <div style="font-size:18px;color:#fca5a5;font-family:'Raleway',sans-serif;margin-bottom:14px;font-weight:700;">📝 Formula for Signature</div>
        
        <div style="text-align:center;margin-bottom:14px;">
          <div style="font-family:'SF Mono',monospace;font-size:48px;color:#fca5a5;font-weight:700;line-height:1.1;">
            S ≡ M<sup style='font-size:40px;'>d</sup> (mod n)
          </div>
        </div>

        <div style="background:rgba(255,255,255,.04);border-radius:8px;padding:12px;">
          <div style="font-size:13px;color:rgba(255,255,255,.5);margin-bottom:8px;">Подставляем значения:</div>
          <div style="font-family:'SF Mono',monospace;font-size:16px;color:#fca5a5;line-height:1.8;">
            S ≡ 2891<sup style='font-size:13px;'>2753</sup> (mod 3127)<br/>
            S ≡ 2891 × 2891 × ... (2753 раза) (mod 3127)<br/>
            <span style="color:#86efac;font-weight:600;">S = 1847</span>
          </div>
        </div>
      </div>

      <!-- ============ SIGNATURE RESULT ============ -->
      <div style="background:rgba(76,217,100,.12);border:2px solid rgba(76,217,100,.3);border-radius:14px;padding:18px;margin-bottom:18px;">
        <div style="font-size:18px;color:#86efac;font-family:'Raleway',sans-serif;margin-bottom:12px;font-weight:700;">✅ Результат подписи S</div>
        
        <div style="background:rgba(255,255,255,.05);border-radius:8px;padding:14px;text-align:center;">
          <div style="font-family:'SF Mono',monospace;font-size:36px;color:#86efac;font-weight:700;">S = 1847</div>
          <div style="font-size:12px;color:rgba(132,255,172,.5);margin-top:8px;">
            ← Эта подпись отправляется с платежом
          </div>
        </div>
      </div>

      <!-- ============ VERIFICATION FORMULA ============ -->
      <div style="background:rgba(52,199,89,.12);border:3px solid rgba(52,199,89,.3);border-radius:14px;padding:18px;">
        <div style="font-size:18px;color:#86efac;font-family:'Raleway',sans-serif;margin-bottom:14px;font-weight:700;">🔍 Formula for Verification</div>
        
        <div style="text-align:center;margin-bottom:14px;">
          <div style="font-family:'SF Mono',monospace;font-size:48px;color:#86efac;font-weight:700;line-height:1.1;">
            M ≡ S<sup style='font-size:40px;'>e</sup> (mod n)
          </div>
        </div>

        <div style="background:rgba(255,255,255,.04);border-radius:8px;padding:12px;">
          <div style="font-size:13px;color:rgba(255,255,255,.5);margin-bottom:8px;">Подставляем значения:</div>
          <div style="font-family:'SF Mono',monospace;font-size:16px;color:#86efac;line-height:1.8;">
            M ≡ 1847<sup style='font-size:13px;'>65537</sup> (mod 3127)<br/>
            M ≡ 1847 × 1847 × ... (65537 раз) (mod 3127)<br/>
            <span style="color:#fca5a5;font-weight:600;">M = 2891 ✓</span>
          </div>
        </div>

        <div style="font-size:13px;color:#86efac;margin-top:12px;padding-top:12px;border-top:1px solid rgba(132,255,172,.2);">
          ✓ М совпадает с исходным = платёж подлинный!<br/>
          ✓ Это доказывает что платёж подписал именно Kaspi
        </div>
      </div>
    </div>

    <div class="rsa-step rp-fact" style="color:var(--red);border-left-color:var(--red);">
      <div class="rp-fact-label">💡 Факт</div>
      <p>${factText}</p>
    </div>

    <button class="rsa-step rsa-restart" onclick="restartRSA(${stageIdx})">↺ Повторить анимацию</button>

  </div>
  `;
}

function renderPanel(i) {
  const s = STAGES[i];
  const panel = document.getElementById('right-panel');
  const langKey = localStorage.getItem('rsa_lang') || 'ru';
  const L = KASPI_LANG[langKey] || KASPI_LANG.ru;
  const ls = L.stages[i] || {};
  const title = ls.title || s.title;
  const sub = ls.sub || s.sub;
  const body = ls.body || s.body;
  const fact = ls.fact || s.fact;
  const accuracy = ls.accuracy !== undefined ? ls.accuracy : s.accuracy;
  const etap = L.etap || 'Этап';

  if (s.rsa_animation) {
    panel.innerHTML = rsaAnimationHTML(i, etap, fact);
    document.getElementById('kaspi-wrap').classList.add('rsa-slide-active');
    requestAnimationFrame(() => requestAnimationFrame(() => {
      startRSAAnimation();
      panel.querySelectorAll('*').forEach(el => {
        el.style.setProperty('font-size', '20px', 'important');
      });
      // Start JS phone scroll tracking (zoom breaks CSS sticky)
      if (window.initRSAPhoneScroll) window.initRSAPhoneScroll();
    }));
    return;
  }
  document.getElementById('kaspi-wrap').classList.remove('rsa-slide-active');
  if (window.cleanupRSAPhoneScroll) window.cleanupRSAPhoneScroll();

  panel.innerHTML = `
    <div class="rp-header">
      <div class="rp-icon">${s.icon}</div>
      <div>
        <div class="rp-stage-label">${etap} ${i+1} / ${total}</div>
        <div class="rp-title">${title}</div>
        <div class="rp-subtitle" style="color:${s.color};">${sub}</div>
      </div>
    </div>
    <div class="rp-divider" style="background:linear-gradient(90deg,${s.color},transparent);"></div>
    <div class="rp-body">${body.map(p=>`<p>${p}</p>`).join('')}</div>
    ${accuracy ? `<div class="rp-accuracy"><div class="rp-accuracy-label">⚡</div><p>${accuracy}</p></div>` : ''}
    <div class="rp-fact" style="color:${s.color};border-left-color:${s.color};">
      <div class="rp-fact-label">💡</div>
      <p>${fact}</p>
    </div>`;
}

function startRSAAnimation() {
  const steps = document.querySelectorAll('.rsa-step');
  steps.forEach((el, i) => {
    setTimeout(() => el.classList.add('rsa-visible'), 100 + i * 550);
  });
}

function restartRSA(i) {
  const steps = document.querySelectorAll('.rsa-step');
  steps.forEach(el => el.classList.remove('rsa-visible'));
  setTimeout(() => startRSAAnimation(), 100);
}

function renderDots() {
  const c = document.getElementById('dots');
  c.innerHTML = '';
  for (let i = 0; i < total; i++) {
    const d = document.createElement('button');
    d.className = 'dot' + (i === cur ? ' active' : i < cur ? ' past' : '');
    d.onclick = () => go(i);
    c.appendChild(d);
  }
}

function go(i) {
  document.querySelector('.screen.active')?.classList.remove('active');
  cur = i;
  const sc = document.querySelector(`[data-stage="${i}"]`);
  if (sc) sc.classList.add('active');
  document.getElementById('hdr-num').textContent = i + 1;
  document.getElementById('btn-prev').disabled = i === 0;
  const nxt = document.getElementById('btn-next');
  nxt.disabled = i === total - 1;
  const langKey = localStorage.getItem('rsa_lang') || 'ru';
  const L = KASPI_LANG[langKey] || KASPI_LANG.ru;
  const btnPrevEl = document.getElementById('btn-prev');
  if(btnPrevEl) btnPrevEl.textContent = L.prev;
  nxt.textContent = i === total - 1 ? L.done : L.next;
  renderPanel(i);
  renderDots();
  document.getElementById('right-panel').scrollTop = 0;
}

document.getElementById('btn-prev').onclick = () => { if (cur > 0) go(cur - 1); };
document.getElementById('btn-next').onclick = () => { if (cur < total - 1) go(cur + 1); };

// Init
renderPanel(0);
renderDots();

})();
