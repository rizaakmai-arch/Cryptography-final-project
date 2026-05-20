// ================================================================
// core.js — Ядро: i18n, состояние, маршрутизация, математика RSA,
//           движок практики
// Автор: [имя участника]
// Отвечает за: DICT (переводы), THEORY_DATA, STATE, goPage(),
//              isPrime(), gcd(), modInv(), modPow(), practice steps
// ================================================================

/* ====================================================== I18N ====================================================== */
const DICT = {
  kz:{
    'drw-title':'Мәзір','lang-lbl':'Тіл','settings-lbl':'Параметрлер',
    's-sound':'Дыбыс','s-sound-d':'Интерфейс дыбыстары',
    's-dark':'Қараңғы тақырып','s-dark-d':'Оформлениені ауыстыру',
    'nav-lbl':'Навигация','about-lbl':'Жоба туралы',
    'about-txt':'RSA алгоритмі бойынша интерактивті білім беру платформасы.',
    'nav-home':'Басты','nav-demo':'RSA in Real Life',
    'nav-practice':'Тәжірибе','nav-facts':'Деректер мен тарих',
    'hlogo-s':'криптография',
    'hero-badge':'Интерактивті курс · Криптография · RSA',
    'hero-h1':'RSA: <em>Криптографияның</em><br>Визуалды Сиқыры',
    'hero-sub':'RSA алгоритмі хабарламаларыңды, банк транзакцияларын және мемлекеттік құпияларды қорғайды.',
    'chip1':'🔑 Ашық кілт','chip2':'🔐 Жабық кілт','chip3':'🧮 Жай сандар','chip4':'🛡 Асимметриялық шифрлеу',
    'hero-btn1':'▶ Демоны көру →','hero-btn2':'🧪 RSA Тәжірибесі',
    'prac-tag':'Тәжірибе','prac-title':'RSA-ны өзің есепте',
    'prac-lead':'RSA-ның 7 қадамын өзің өт. Жүйе есептеулерді тексереді.',
    'ks-title':'Сенің RSA кілттерің',
    'prac-reset':'↺ Қайта бастау','prac-demo-btn':'▶ Демоны көру',
    'calc-title':'RSA Калькулятор','calc-vars':'Айнымалылар:',
    'facts-tag':'Қызықты деректер','facts-title':'RSA сандарда және тарихта',
    'facts-btn1':'← Тәжірибеге','facts-btn2':'Басты бетке',
    'hist-tag':'Тарих','hist-title':'RSA-ға жол',
    'f1t':'RSA-ның тууы: 1977','f1b':'Ривест, Шамир және Адлеман MIT-та алгоритм жасады.',
    'f2t':'RSA-768: 2 жыл есептеу','f2b':'2009 жылы ғалымдар 768-биттік RSA кілтін 2 жыл ішінде бұзды.',
    'f3t':'RSA барлық жерде','f3b':'HTTPS, SSH, электронды паспорттар — бәрі RSA қолданады.',
    'f4t':'Кванттық қауіп','f4b':'Шор алгоритмі (1994) кванттық компьютерде RSA-ны бұзады.',
    'f5t':'Эйлер RSA-дан 214 жыл бұрын','f5b':'φ(n) 1763 жылы сипатталды.',
    'f6t':'RSA-2048 vs Ғалам','f6b':'Суперкомпьютерге Ғаламның жасынан көп уақыт қажет.',
    'tl1b':'Евклид алгоритмі','tl1t':'ЕОБ табу, RSA-да d есептеу үшін қолданылады.',
    'tl2b':'Эйлер функциясы φ(n)','tl2t':'a^φ(n)≡1(mod n) — RSA математикалық негізі.',
    'tl3b':'Клод Шеннон','tl3t':'ақпарат теориясын формализациялайды.',
    'tl4b':'Диффи–Хеллман','tl4t':'ашық кілтті асимметриялық криптография тұжырымдамасы.',
    'tl5b':'RSA','tl5t':'Rivest, Shamir, Adleman. Бірінші практикалық алгоритм.',
    'tl6b':'Шор алгоритмі','tl6t':'RSA кванттық компьютерге осал екені дәлелденді.',
    'tl7b':'NIST Post-Quantum','tl7t':'CRYSTALS-Kyber және Dilithium стандарттары қабылданды.',
    'foot-sub':'Криптографияның Визуалды Сиқыры','foot-copy':'Интерактивті білім беру платформасы · 2025',
    'save-msg':'✓ Сақталды',
    'nav-tasks':'📝 Тапсырмалар','nav-theory':'📖 Теория','nav-ai':'🤖 ИИ','nav-cipher':'🔐 Шифрлеуші',
    'tasks-tag':'📝 Тапсырмалар','tasks-title':'RSA Тәжірибелік тапсырмалар',
    'tasks-lead':'10 тапсырма — нақты есептеулер, өз жауабыңды енгіз.',
    'tasks-start-desc':'Тек тест емес, нақты RSA есептері. Сандар беріледі — формулалармен өзің есептейсің.',
    'tasks-start-btn':'Тапсырмаларды бастау',
    'tasks-restart':'↺ Қайталау','tasks-go-practice':'🧪 Тәжірибеге',
    'quiz-tag':'Квиз','quiz-title':'RSA білімін тексер',
    'quiz-lead':'10 сұрақ — негізден нюанстарға дейін. Әр жауап түсіндіріледі.',
    'quiz-start-desc':'RSA-ны қаншалықты жақсы түсінгеніңді тексеруге дайынсың ба?',
    'quiz-start-btn':'Квизді бастау',
    'tasks-restart':'↺ Қайталау','tasks-go-practice':'🧪 Тәжірибеге',
    'quiz-next':'Келесі →','quiz-finish':'Аяқтау',

    'pr-s1t':'1-қадам: p және q жай сандарын тандаңыз',
    'pr-s1f':'p және q — жай сандар',
    'pr-s1h':'p және q жай сандар болуы керек (тек 1-ге және өзіне бөлінеді). <b style="color:#fbbf24">⚠ МАҢЫЗДЫ: p×q ≥ 256</b> болуы керек — ASCII (32–126) сыяды. Мысалы: p=17, q=19 → n=323 ✓',
    'pr-s1lp':'Жай сан p','pr-s1lq':'Жай сан q','pr-s1btn':'Тексеру',
    'pr-s2t':'2-қадам: n = p × q есепте',
    'pr-s2f':'n = p × q',
    'pr-s2h':'<span class="blink-kw">n</span> — жалпы модуль. p мен q-ны көбейт.',
    'pr-s2ln':'n мәнін енгіз','pr-s2btn':'Тексеру',
    'pr-s3t':'3-қадам: φ(n) = (p−1)(q−1) есепте',
    'pr-s3f':'φ(n) = (p−1)(q−1)',
    'pr-s3h':'<span class="blink-kw">φ(n)</span> — Эйлер функциясы. (p−1) мен (q−1)-ді көбейт.',
    'pr-s3ln':'φ(n) мәнін енгіз','pr-s3btn':'Тексеру',
    'pr-s4t':'4-қадам: e ашық шешушіні тандаңыз',
    'pr-s4f':'2 < e < φ(n), ЕОБ(e,φ)=1, e — ЖАЙСАН',
    'pr-s4h':'<span class="blink-kw">e</span> жай сан болуы керек, 2-ден үлкен, φ(n)-ден кіші, және φ(n)-мен өзара жай.',
    'pr-s4btn':'Растау',
    'pr-s5t':'5-қадам: d жабық кілтті тап',
    'pr-s5f':'d × e ≡ 1 (mod φ(n))',
    'pr-s5h':'<span class="blink-kw">d</span> — жабық кілт. d × e mod φ(n) = 1 болатын санды тап. Калькуляторды қолдан!',
    'pr-s5ld':'d мәнін енгіз','pr-s5btn':'Тексеру',
    'pr-s6t':'6-қадам: M хабарламасын шифрла',
    'pr-s6f':'C = Mᵉ mod n',
    'pr-s6h':'<span class="blink-kw">C</span> — шифрмәтін. C = M^e mod n формуласын қолдан.',
    'pr-s6lm':'M (2-ден n-1-ге дейін)','pr-s6lc':'C мәнін енгіз','pr-s6btn':'Тексеру',
    'pr-s7t':'7-қадам: C шифрмәтінін шеш',
    'pr-s7f':'M = Cᵈ mod n',
    'pr-s7h':'<span class="blink-kw">M</span> — ашық мәтін. M = C^d mod n формуласын қолдан. Ашық мәтінді қайта алу керек!',
    'pr-s7lm':'M мәнін енгіз (нәтиже)','pr-s7btn':'Тексеру',
    'pr-hint-btn':'💜 Кеңес','pr-correct':'✓ Дұрыс!','pr-wrong':'✗ Қайта көр',
    'pr-done-title':'🎉 Сен RSA-ны толық меңгердің!',
    'pr-done-body':'Барлық 7 қадам сәтті аяқталды. Ашық және жабық кілттер жасалды, хабарлама шифрланып, шешілді!',
    'pr-s4ln':'e мәнін енгіз',
    'rlp-title':'RSA Мәндері',
    'rlp-empty':'Қадамдарды шеше бастаңыз —<br>мәндер осында шығады ✨',
    'err-p-prime':'⚠ p — жай сан болуы керек','err-q-prime':'⚠ q — жай сан болуы керек',
    'err-pq-diff':'⚠ p және q әртүрлі болуы керек','err-enter-nums':'⚠ Сандарды енгізіңіз',
    'err-enter-num':'⚠ Санды енгізіңіз','err-expected':'(күтілген {0})',
    'err-e-gt2':'⚠ e 2-ден үлкен болуы керек','err-e-lt-phi':'⚠ e φ(n)-ден кіші болуы керек = {0}',
    'err-e-prime':'⚠ e жай сан болуы керек','err-gcd':'⚠ ЕОБ(e, φ(n)) = 1 болуы керек',
    'err-e-valid':'⚠ Дұрыс санды енгізіңіз','err-d-check':'— тексер: d×e mod φ(n) = 1 болуы керек',
    'err-m-range':'⚠ M 2-ден n−1-ге дейін болуы керек','match-original':'— бастапқымен сәйкес!',
    'hint-cond-e':'Шарттар: e — жай, 2 < e < {0}, ЕОБ(e, {0}) = 1',
    'ascii-title':'ASCII Кестесі',
    'rlp-e':'e (ашық)','rlp-d':'d (жабық)','rlp-M':'M (хабар)','rlp-C':'C (шифр)',
    'th-page-tag':'📖 Таза теория','th-page-title':'RSA: Теория және мысалдар','th-page-lead':'Барлық формулалар, анықтамалар және толық сандық мысалдар — қадам бақ адам.',
    'th-toc-lbl':'Мазмұны',
    'ttoc-btn-0':'RSA дегеніміз не?','ttoc-btn-1':'Жай сандар p, q','ttoc-btn-2':'Модуль n = p×q','ttoc-btn-3':'Эйлер функциясы φ(n)','ttoc-btn-4':'Ашық кілт e','ttoc-btn-5':'Жабық кілт d','ttoc-btn-6':'Шифрлеу C','ttoc-btn-7':'Шифрды ашу M','ttoc-btn-8':'Толық мысал',
    'th-btn-practice':'🧪 Тәжірибеге →','th-btn-ai':'🤖 ИИ-дан сұрау',
    'ai-page-tag':'🤖 ИИ-Көмекші','ai-page-title':'RSA туралы ИИ-дан сұра','ai-page-lead':'Бірдеңе түсінбедің бе? Сұрақ қой — ИИ мысалдармен түсіндіреді.',
    'ai-hd-name':'RSA Көмекші','ai-hd-status':'Онлайн · RSA криптографиясының сарапшысы',
    'ai-welcome':'Сәлем! 👋 Мен RSA бойынша ИИ-көмекшімін. Кез келген сұрақ қой — мысалдармен түсіндіремін!',
    'ai-hint-text':'Enter — жіберу · Shift+Enter — жол аудару',
    'ai-clr-txt':'Чатты тазалау',
    'ai-inp-placeholder':'Мысалы: φ(n) дегеніміз не және ол не үшін қажет?',
    'ai-q1':'🔐 RSA дегеніміз не?','ai-q2':'φ Эйлер функциясы','ai-q3':'🔑 d қалай табылады?','ai-q4':'⚠ Неліктен n ≥ 256?','ai-q5':'🧮 mod дегеніміз не?','ai-q6':'📋 Толық мысал',
    'cph-tag':'🔐 Шифрлеуші','cph-title':'RSA Мәтін шифрлеушісі','cph-lead':'Кез келген сөзді енгіз — әр таңба RSA бойынша жеке шифрланады.',
    'cph-setup-title':'⚙️ RSA параметрлері','cph-setup-hint':'(екі түрлі жай сан керек, n ≥ 256)','cph-lp':'p (жай)','cph-lq':'q (жай)',
    'cph-small':'← Кіші','cph-large':'Үлкен →','cph-input-title':'✏️ Шифрланатын мәтін',
    'cph-maxlen':'Макс. 40 таңба · әр таңба — бөлек RSA операциясы',
    'cph-enc-btn':'🔐 Шифрлеу','cph-dec-btn':'🔓 Шифрды ашу','cph-clr-btn':'↺ Тазалау',
    'cph-th1':'Таңба','cph-th2':'ASCII (M)','cph-th3':'C = Mᵉ mod n','cph-th4':'Шифрмәтін C',
    'cph-hint-setup':'p және q жай сандарын таңда. Олардың n көбейтіндісі ASCII таңбаларын шифрлеу үшін ≥ 256 болуы керек (32–126 коды).',
    'cph-how-1':'p және q жай сандарын таңда','cph-how-2':'Мәтінді енгіз','cph-how-3':'C = Mᵉ mod n шифрла','cph-how-4':'M = Cᵈ mod n шифрды аш','cph-alert-empty':'Мәтін енгіз!','cph-placeholder':'Сөз немесе сөйлем енгіз, мысалы: Hello',
    'ai-hero-badge-txt':'🤖 ИИ-Көмекші RSA','ai-offline-b':'Толықтай офлайн жұмыс істейді','ai-offline-txt':'— интернетсіз және API кілтсіз. Кірістірілген RSA сарапшысы барлық формулаларды біледі.',
    'ai-gsearch-label':'RSA тақырыбын іздеу','ai-gsearch-blocked-title':'Google iframe-ды бұғаттады','ai-gsearch-blocked-sub':'Бұл браузердің стандартты мінез-құлқы. Нәтижелерді жаңа қойындыда аш:','ai-gsearch-open-tab':'Google-да ашу',
    'cph-not-prime-p':'❌ p={0} — жай сан емес.','cph-not-prime-q':'❌ q={0} — жай сан емес.',
    'cph-pq-diff':'❌ p және q әртүрлі болуы керек.',
    'cph-pub-key':'Ашық кілт (e={0}, n={1})','cph-prv-key':'Жабық кілт (d={0}, n={1})',
    'cph-n-small':'⚠️ n={0} < 256 — барлық ASCII таңбаларын шифрлей алмайды! Үлкен p және q алыңыз (мысалы p=17, q=19 → n=323).',
    'cph-need-pq':'Алдымен дұрыс p және q енгіз!','cph-need-enc':'Алдымен мәтінді шифрла!',
    'cph-enc-progress':'🔐 Таңбаларды шифрлау...','cph-enc-done':'✅ Шифрлеу аяқталды!',
    'cph-dec-progress':'🔓 Таңбаларды шешу...','cph-dec-done':'✅ Шешу аяқталды!',
    'cph-table-enc':'📊 Шифрлеу кестесі (C = Mᵉ mod n)',
    'cph-table-dec':'📊 Шешу кестесі (M = Cᵈ mod n)',
    'cph-out-enc':'Шифрланған мәтін (сандар бос орынмен)',
    'cph-out-dec-ok':'Қалпына келтірілген мәтін ✅','cph-out-dec-fail':'Қалпына келтірілген мәтін ❌',
    'cph-match':'— бастапқымен сәйкес!','cph-space':'(бос орын)',
    'crack-invalid':'⚠ Дұрыс n және e енгіз',
    'crack-start':'▶ ШАБУЫЛ БАСТАЛДЫ','crack-target':'// Мақсат: n={0}, e={1}',
    'crack-method':'// Әдіс: Brute-force факторизация',
    'crack-scan':'// n делімдерін 2-ден √n-ге дейін тексеру (≈{0})...',
    'crack-progress':'Тексеру: {0}% ({1} / {2} тексерілді)',
    'crack-test':'[{0}%] Тест: {1}... ','crack-divisor-found':'БӨЛГІШ ТАБЫЛДЫ!',
    'crack-not-found':'✗ 2..√n аралығында бөлгіш табылмады',
    'crack-n-may-prime':'// n={0} жай сан болуы мүмкін немесе тым үлкен',
    'crack-safe-title':'🛡 Кілт брут-форсқа төзімді',
    'crack-safe-body':'n={0} санының тривиалды емес бөлгіштерін табу мүмкін болмады.<br>Мүмкін n — жай сан немесе кілт жеткілікті үлкен.',
    'crack-warn-prime':'⚠ p={0} немесе q={1} жай сан емес',
    'crack-found':'✓ ТАБЫЛДЫ! p={0}, q={1}',
    'crack-phi':'✓ φ(n) = ({0}-1)({1}-1) = {2}',
    'crack-prv':'✓ ЖАБЫҚ КІЛТ: d={0}',
    'crack-done':'⚡ БҰЗУ ОРЫНДАЛДЫ!',
    'crack-cracked-title':'⚡ RSA бұзылды!',
    'crack-pub-key':'ашық кілт','crack-prv-restored':'ЖАБЫҚ КІЛТ ҚАЛПЫНА КЕЛТІРІЛДІ!',
    'crack-pubkey-label':'Ашық кілт:','crack-prvkey-label':'→ Жабық:',
    'crack-m-range':'⚠ M 2-ден {0}-ға дейін болуы керек',
    'crack-enc-label':'Шифрлеу:','crack-dec-label':'Шешу:',
    'crack-match':'✅ Сәйкес!','crack-error':'❌ Қате',
    'chart-days':'күндер','chart-years':'жылдар','chart-kyears':'мың жыл','chart-myears':'млн жыл',
    'chart-bits':'бит','chart-yr':'1 жыл',
    'err-n-too-small':'⚠ n = p×q = {0} — тым аз! ASCII кодтары (32–126) сияды үшін n ≥ 256 болуы керек. Үлкенірек сандарды таңда (мысалы p=17, q=19).',

  },
  ru:{
    'drw-title':'Меню','lang-lbl':'Язык','settings-lbl':'Настройки',
    's-sound':'Звук','s-sound-d':'Звуки интерфейса',
    's-dark':'Тёмная тема','s-dark-d':'Переключить оформление',
    'nav-lbl':'Навигация','about-lbl':'О проекте',
    'about-txt':'Интерактивная образовательная платформа по алгоритму RSA.',
    'nav-home':'Главная','nav-demo':'RSA in Real Life',
    'nav-practice':'Практика','nav-facts':'Факты и история',
    'hlogo-s':'криптография',
    'hero-badge':'Интерактивный курс · Криптография · RSA',
    'hero-h1':'RSA: <em>Визуальная Магия</em><br>Криптографии',
    'hero-sub':'Алгоритм RSA защищает ваши сообщения, банковские транзакции и государственные тайны.',
    'chip1':'🔑 Открытый ключ','chip2':'🔐 Закрытый ключ','chip3':'🧮 Простые числа','chip4':'🛡 Асимметричное шифрование',
    'hero-btn1':'▶ Смотреть демо →','hero-btn2':'🧪 Практика RSA',
    'prac-tag':'Практика','prac-title':'Вычисли RSA сам',
    'prac-lead':'Пройди все 7 шагов RSA самостоятельно. Система проверит твои вычисления и подскажет, если нужно.',
    'ks-title':'Твои ключи RSA',
    'prac-reset':'↺ Начать заново','prac-demo-btn':'▶ Смотреть демо',
    'calc-title':'RSA Калькулятор','calc-vars':'Переменные:',
    'facts-tag':'Интересные факты','facts-title':'RSA в цифрах и историях',
    'facts-btn1':'← К практике','facts-btn2':'На главную',
    'hist-tag':'История','hist-title':'Путь к RSA',
    'f1t':'Рождение RSA: 1977','f1b':'Ривест, Шамир и Адлеман создали алгоритм в MIT. Клиффорд Кокс (GCHQ) открыл то же самое в 1973 — засекреченно.',
    'f2t':'RSA-768: 2 года вычислений','f2b':'В 2009 году учёные разложили 768-битный ключ RSA за 2 года на сотнях компьютеров.',
    'f3t':'RSA везде вокруг нас','f3b':'HTTPS, SSH, электронные паспорта, банковские приложения — всё использует RSA или его потомков.',
    'f4t':'Квантовая угроза','f4b':'Алгоритм Шора (1994) на квантовом компьютере взломает RSA за полиномиальное время.',
    'f5t':'Эйлер опередил RSA на 214 лет','f5b':'Функция φ(n) описана в 1763 году. Эйлер не подозревал, что его теорема защитит весь интернет.',
    'f6t':'RSA-2048 vs Вселенная','f6b':'Суперкомпьютеру нужно больше времени, чем возраст Вселенной (13.8 млрд лет), чтобы взломать RSA-2048.',
    'tl1b':'Алгоритм Евклида','tl1t':'нахождение НОД, используется в RSA для вычисления d.',
    'tl2b':'Функция Эйлера φ(n)','tl2t':'теорема a^φ(n)≡1(mod n) — математический фундамент RSA.',
    'tl3b':'Клод Шеннон','tl3t':'формализует теорию информации и понятие идеальной секретности.',
    'tl4b':'Диффи–Хеллман','tl4t':'концепция асимметричной криптографии с открытым ключом.',
    'tl5b':'RSA','tl5t':'Rivest, Shamir, Adleman. Первый практичный алгоритм с открытым ключом.',
    'tl6b':'Алгоритм Шора','tl6t':'доказана уязвимость RSA перед квантовыми компьютерами.',
    'tl7b':'NIST Post-Quantum','tl7t':'CRYSTALS-Kyber и Dilithium официально стандартизированы.',
    'foot-sub':'Визуальная Магия Криптографии','foot-copy':'Интерактивная образовательная платформа · 2025',
    'save-msg':'✓ Сохранено',
    'nav-tasks':'📝 Задания','nav-theory':'📖 Теория','nav-ai':'🤖 ИИ','nav-cipher':'🔐 Шифровальщик',
    'tasks-tag':'📝 Задания','tasks-title':'Практические задания RSA',
    'tasks-lead':'10 заданий с реальными вычислениями — введи ответ сам, получи объяснение.',
    'tasks-start-desc':'Не просто тест, а реальные вычисления RSA. Тебе дадут числа — ты сам считаешь по формулам.',
    'tasks-start-btn':'Начать задания',
    'tasks-restart':'↺ Пройти снова','tasks-go-practice':'🧪 К практике',
    'quiz-tag':'Квиз','quiz-title':'Проверь знания RSA',
    'quiz-lead':'10 вопросов — от базы до нюансов. Каждый вопрос объяснён после ответа.',
    'quiz-start-desc':'Готов проверить, насколько хорошо ты понял RSA? 10 вопросов, 4 варианта ответа, подробные объяснения.',
    'quiz-start-btn':'Начать квиз',
    'tasks-restart':'↺ Пройти снова','tasks-go-practice':'🧪 К практике',
    'quiz-next':'Следующий →','quiz-finish':'Завершить',

    'pr-s1t':'Шаг 1: Выбери простые числа p и q',
    'pr-s1f':'p и q — простые числа',
    'pr-s1h':'Числа <span class="blink-kw">p</span> и <span class="blink-kw">q</span> должны быть <b style="color:#fbbf24">простыми</b>. <b style="color:#fbbf24">⚠ ВАЖНО: p×q ≥ 256</b> — иначе ASCII коды (32–126) не поместятся при шифровании. Хороший пример: p=17, q=19 → n=323 ✓',
    'pr-s1lp':'Простое число p','pr-s1lq':'Простое число q','pr-s1btn':'Проверить',
    'pr-s2t':'Шаг 2: Вычисли n = p × q',
    'pr-s2f':'n = p × q',
    'pr-s2h':'<span class="blink-kw">n</span> — публичный модуль. Умножь p на q.',
    'pr-s2ln':'Значение n','pr-s2btn':'Проверить',
    'pr-s3t':'Шаг 3: Вычисли φ(n) = (p−1)(q−1)',
    'pr-s3f':'φ(n) = (p−1)(q−1)',
    'pr-s3h':'<span class="blink-kw">φ(n)</span> — функция Эйлера. Умножь (p−1) на (q−1).',
    'pr-s3ln':'Значение φ(n)','pr-s3btn':'Проверить',
    'pr-s4t':'Шаг 4: Выбери открытый показатель e',
    'pr-s4f':'2 < e < φ(n), НОД(e,φ)=1, e — ПРОСТОЕ',
    'pr-s4h':'<span class="blink-kw">e</span> должно быть простым, больше 2, меньше φ(n) и взаимно простым с φ(n). Нажми на подходящий вариант:',
    'pr-s4btn':'Подтвердить',
    'pr-s5t':'Шаг 5: Найди закрытый ключ d',
    'pr-s5f':'d × e ≡ 1 (mod φ(n))',
    'pr-s5h':'<span class="blink-kw">d</span> — закрытый ключ. Найди такое d, что d × e mod φ(n) = 1. Используй калькулятор!',
    'pr-s5ld':'Значение d','pr-s5btn':'Проверить',
    'pr-s6t':'Шаг 6: Зашифруй сообщение M',
    'pr-s6f':'C = Mᵉ mod n',
    'pr-s6h':'<span class="blink-kw">C</span> — шифртекст. Примени формулу C = M^e mod n.',
    'pr-s6lm':'M (от 2 до n−1)','pr-s6lc':'Значение C','pr-s6btn':'Проверить',
    'pr-s7t':'Шаг 7: Расшифруй C',
    'pr-s7f':'M = Cᵈ mod n',
    'pr-s7h':'<span class="blink-kw">M</span> — открытый текст. Вычисли M = C^d mod n. Должно вернуться исходное M!',
    'pr-s7lm':'Значение M (результат)','pr-s7btn':'Проверить',
    'pr-hint-btn':'💜 Подсказка','pr-correct':'✓ Верно!','pr-wrong':'✗ Попробуй ещё раз',
    'pr-done-title':'🎉 Ты полностью освоил RSA!',
    'pr-done-body':'Все 7 шагов пройдены успешно. Ты сгенерировал ключи, зашифровал и расшифровал сообщение!',
    'pr-s4ln':'Значение e',
    'rlp-title':'RSA Значения',
    'rlp-empty':'Начни решать шаги —<br>значения появятся здесь ✨',
    'err-p-prime':'⚠ p должно быть простым числом','err-q-prime':'⚠ q должно быть простым числом',
    'err-pq-diff':'⚠ p и q должны быть разными','err-enter-nums':'⚠ Введите числа',
    'err-enter-num':'⚠ Введите число','err-expected':'(ожидалось {0})',
    'err-e-gt2':'⚠ e должно быть больше 2','err-e-lt-phi':'⚠ e должно быть меньше φ(n) = {0}',
    'err-e-prime':'⚠ e должно быть простым числом','err-gcd':'⚠ НОД(e, φ(n)) должен быть равен 1',
    'err-e-valid':'⚠ Введите корректное число','err-d-check':'— проверь: d×e mod φ(n) должно = 1',
    'err-m-range':'⚠ M должно быть от 2 до n−1','match-original':'— совпадает с исходным!',
    'hint-cond-e':'Условия: e — простое, 2 < e < {0}, НОД(e, {0}) = 1',
    'ascii-title':'ASCII Таблица',
    'rlp-e':'e (откр.)','rlp-d':'d (закр.)','rlp-M':'M (сообщ.)','rlp-C':'C (шифр)',
    'th-page-tag':'📖 Чистая теория','th-page-title':'RSA: Теория и примеры','th-page-lead':'Все формулы, определения и полностью разобранные числовые примеры — шаг за шагом.',
    'th-toc-lbl':'Содержание',
    'ttoc-btn-0':'Что такое RSA?','ttoc-btn-1':'Простые числа p, q','ttoc-btn-2':'Модуль n = p×q','ttoc-btn-3':'Функция Эйлера φ(n)','ttoc-btn-4':'Открытый ключ e','ttoc-btn-5':'Закрытый ключ d','ttoc-btn-6':'Шифрование C','ttoc-btn-7':'Дешифровка M','ttoc-btn-8':'Полный пример',
    'th-btn-practice':'🧪 К практике →','th-btn-ai':'🤖 Спросить ИИ',
    'ai-page-tag':'🤖 ИИ-Помощник','ai-page-title':'Спроси ИИ о RSA','ai-page-lead':'Не понял что-то? Задай вопрос — ИИ объяснит с примерами на твоём языке.',
    'ai-hd-name':'RSA Помощник','ai-hd-status':'Онлайн · Эксперт по RSA криптографии',
    'ai-welcome':'Привет! 👋 Я ИИ-помощник по RSA. Задай любой вопрос — объясню с примерами!',
    'ai-hint-text':'Enter — отправить · Shift+Enter — перенос строки',
    'ai-clr-txt':'Очистить чат',
    'ai-inp-placeholder':'Например: что такое φ(n) и зачем оно нужно?',
    'ai-q1':'🔐 Что такое RSA?','ai-q2':'φ Функция Эйлера','ai-q3':'🔑 Как найти d?','ai-q4':'⚠ Почему n ≥ 256?','ai-q5':'🧮 Что такое mod?','ai-q6':'📋 Полный пример',
    'cph-tag':'🔐 Шифровальщик','cph-title':'RSA Шифровальщик текста','cph-lead':'Введи любое слово — каждый символ зашифруется по RSA посимвольно.',
    'cph-setup-title':'⚙️ Параметры RSA','cph-setup-hint':'(нужны два разных простых числа, n ≥ 256 для ASCII)','cph-lp':'p (простое)','cph-lq':'q (простое)',
    'cph-small':'← Маленькие','cph-large':'Большие →','cph-input-title':'✏️ Текст для шифрования',
    'cph-maxlen':'Макс. 40 символов · каждый символ — отдельная RSA-операция',
    'cph-enc-btn':'🔐 Зашифровать','cph-dec-btn':'🔓 Расшифровать','cph-clr-btn':'↺ Сброс',
    'cph-th1':'Символ','cph-th2':'ASCII (M)','cph-th3':'C = Mᵉ mod n','cph-th4':'Шифртекст C',
    'cph-hint-setup':'Выбери два разных простых числа p и q. Их произведение n должно быть ≥ 256, чтобы шифровать ASCII-символы (коды 32–126).',
    'cph-how-1':'Выбери простые p и q','cph-how-2':'Введи текст','cph-how-3':'Зашифруй C = Mᵉ mod n','cph-how-4':'Расшифруй M = Cᵈ mod n','cph-alert-empty':'Введи текст!','cph-placeholder':'Введи слово или фразу, например: Hello',
    'ai-hero-badge-txt':'🤖 ИИ-Помощник RSA','ai-offline-b':'Работает полностью офлайн','ai-offline-txt':'— без интернета и API-ключей. Встроенный RSA-эксперт знает все формулы и разберёт любой пример пошагово.',
    'ai-gsearch-label':'Поиск по теме RSA','ai-gsearch-blocked-title':'Google заблокировал iframe','ai-gsearch-blocked-sub':'Это стандартное поведение браузера. Открой результаты в новой вкладке:','ai-gsearch-open-tab':'Открыть в Google',
    'cph-not-prime-p':'❌ p={0} — не простое.','cph-not-prime-q':'❌ q={0} — не простое.',
    'cph-pq-diff':'❌ p и q должны быть разными.',
    'cph-pub-key':'Открытый ключ (e={0}, n={1})','cph-prv-key':'Закрытый ключ (d={0}, n={1})',
    'cph-n-small':'⚠️ n={0} < 256 — нельзя шифровать все ASCII-символы! Возьми большие p и q (например p=17, q=19 → n=323).',
    'cph-need-pq':'Сначала укажи корректные p и q!','cph-need-enc':'Сначала зашифруй текст!',
    'cph-enc-progress':'🔐 Шифрование посимвольно...','cph-enc-done':'✅ Шифрование завершено!',
    'cph-dec-progress':'🔓 Дешифровка посимвольно...','cph-dec-done':'✅ Дешифровка завершена!',
    'cph-table-enc':'📊 Таблица шифрования (C = Mᵉ mod n)',
    'cph-table-dec':'📊 Таблица дешифровки (M = Cᵈ mod n)',
    'cph-out-enc':'Зашифрованный текст (числа через пробел)',
    'cph-out-dec-ok':'Восстановленный текст ✅','cph-out-dec-fail':'Восстановленный текст ❌',
    'cph-match':'  (совпадает с оригиналом!)','cph-space':'(пробел)',
    'crack-invalid':'⚠ Введи корректные n и e',
    'crack-start':'▶ ЗАПУСК АТАКИ','crack-target':'// Цель: n={0}, e={1}',
    'crack-method':'// Метод: Brute-force факторизация',
    'crack-scan':'// Перебор делителей n от 2 до √n (≈{0})...',
    'crack-progress':'Перебор: {0}% (проверено {1} из {2})',
    'crack-test':'  [{0}%] Тест: {1}... ','crack-divisor-found':'ДЕЛИТЕЛЬ НАЙДЕН!',
    'crack-not-found':'✗ Делители не найдены в диапазоне 2..√n',
    'crack-n-may-prime':'// n={0} может быть простым или слишком большим',
    'crack-safe-title':'🛡 Ключ устойчив к перебору',
    'crack-safe-body':'Не удалось найти нетривиальные делители числа n={0}.<br>Возможно, n — простое, или ключ достаточно большой.',
    'crack-warn-prime':'⚠ p={0} или q={1} не являются простыми',
    'crack-found':'✓ НАЙДЕНО! p={0}, q={1}',
    'crack-phi':'✓ φ(n) = ({0}-1)({1}-1) = {2}',
    'crack-prv':'✓ ЗАКРЫТЫЙ КЛЮЧ: d={0}',
    'crack-done':'⚡ ВЗЛОМ ВЫПОЛНЕН!',
    'crack-cracked-title':'⚡ RSA Взломан!',
    'crack-pub-key':'открытый ключ','crack-prv-restored':'ЗАКРЫТЫЙ КЛЮЧ ВОССТАНОВЛЕН!',
    'crack-pubkey-label':'Открытый ключ:','crack-prvkey-label':'→ Закрытый:',
    'crack-m-range':'⚠ M должно быть от 2 до {0}',
    'crack-enc-label':'Шифрование:','crack-dec-label':'Расшифровка:',
    'crack-match':'✅ Совпадает!','crack-error':'❌ Ошибка',
    'chart-days':'дни','chart-years':'годы','chart-kyears':'тысячи лет','chart-myears':'млн лет',
    'chart-bits':'бит','chart-yr':'1 год',
    'err-n-too-small':'⚠ n = p×q = {0} — слишком мало! Нужно n ≥ 256, чтобы ASCII коды (32–126) помещались. Выбери числа побольше (например p=17, q=19).',

  },
  en:{
    'drw-title':'Menu','lang-lbl':'Language','settings-lbl':'Settings',
    's-sound':'Sound','s-sound-d':'Interface sounds',
    's-dark':'Dark theme','s-dark-d':'Toggle appearance',
    'nav-lbl':'Navigation','about-lbl':'About',
    'about-txt':'Interactive educational platform on the RSA algorithm.',
    'nav-home':'Home','nav-demo':'RSA in Real Life',
    'nav-practice':'Practice','nav-facts':'Facts & History',
    'hlogo-s':'cryptography',
    'hero-badge':'Interactive Course · Cryptography · RSA',
    'hero-h1':'RSA: <em>Visual Magic</em><br>of Cryptography',
    'hero-sub':'The RSA algorithm protects your messages, bank transactions, and state secrets.',
    'chip1':'🔑 Public Key','chip2':'🔐 Private Key','chip3':'🧮 Prime Numbers','chip4':'🛡 Asymmetric Encryption',
    'hero-btn1':'▶ Watch Demo →','hero-btn2':'🧪 RSA Practice',
    'prac-tag':'Practice','prac-title':'Compute RSA Yourself',
    'prac-lead':'Go through all 7 RSA steps on your own. The system will check your computations.',
    'ks-title':'Your RSA Keys',
    'prac-reset':'↺ Start Over','prac-demo-btn':'▶ Watch Demo',
    'calc-title':'RSA Calculator','calc-vars':'Variables:',
    'facts-tag':'Interesting Facts','facts-title':'RSA in Numbers and Stories',
    'facts-btn1':'← To Practice','facts-btn2':'Home',
    'hist-tag':'History','hist-title':'The Road to RSA',
    'f1t':'Birth of RSA: 1977','f1b':'Rivest, Shamir, and Adleman created the algorithm at MIT.',
    'f2t':'RSA-768: 2 years','f2b':'In 2009, scientists factored a 768-bit RSA key in 2 years.',
    'f3t':'RSA is everywhere','f3b':'HTTPS, SSH, e-passports, banking apps — all use RSA.',
    'f4t':'The quantum threat','f4b':"Shor's algorithm (1994) on a quantum computer would break RSA.",
    'f5t':'Euler beat RSA by 214 years','f5b':'φ(n) was described in 1763.',
    'f6t':'RSA-2048 vs The Universe','f6b':'A supercomputer needs more time than the age of the Universe.',
    'tl1b':"Euclid's Algorithm",'tl1t':'finding GCD, still used in RSA to compute d.',
    'tl2b':"Euler's Totient φ(n)",'tl2t':'theorem a^φ(n)≡1(mod n) — mathematical foundation of RSA.',
    'tl3b':'Claude Shannon','tl3t':'formalizes information theory.',
    'tl4b':'Diffie–Hellman','tl4t':'concept of asymmetric public-key cryptography.',
    'tl5b':'RSA','tl5t':'Rivest, Shamir, Adleman. First practical public-key algorithm.',
    'tl6b':"Shor's Algorithm",'tl6t':'proves RSA is vulnerable to quantum computers.',
    'tl7b':'NIST Post-Quantum','tl7t':'CRYSTALS-Kyber and Dilithium officially standardized.',
    'foot-sub':'Visual Magic of Cryptography','foot-copy':'Interactive Educational Platform · 2025',
    'save-msg':'✓ Saved',
    'nav-tasks':'📝 Tasks','nav-theory':'📖 Theory','nav-ai':'🤖 AI','nav-cipher':'🔐 Cipher',
    'tasks-tag':'📝 Tasks','tasks-title':'RSA Practical Tasks',
    'tasks-lead':'10 hands-on tasks — compute the answers yourself, get explanations.',
    'tasks-start-desc':'Not just a quiz — real RSA calculations. You are given numbers and must apply the formulas.',
    'tasks-start-btn':'Start tasks',
    'tasks-restart':'↺ Try again','tasks-go-practice':'🧪 Practice',
    'quiz-tag':'Quiz','quiz-title':'Test Your RSA Knowledge',
    'quiz-lead':'10 questions — from basics to nuances. Every answer is explained.',
    'quiz-start-desc':'Ready to test how well you understand RSA? 10 questions, 4 options, detailed explanations.',
    'quiz-start-btn':'Start Quiz',
    'tasks-restart':'↺ Try Again','tasks-go-practice':'🧪 To Practice',
    'quiz-next':'Next →','quiz-finish':'Finish',

    'pr-s1t':'Step 1: Choose primes p and q',
    'pr-s1f':'p and q are prime numbers',
    'pr-s1h':'Numbers <span class="blink-kw">p</span> and <span class="blink-kw">q</span> must be <b style="color:#fbbf24">prime</b>. <b style="color:#fbbf24">⚠ IMPORTANT: p×q ≥ 256</b> — otherwise ASCII codes (32–126) will not fit during encryption. Good example: p=17, q=19 → n=323 ✓',
    'pr-s1lp':'Prime p','pr-s1lq':'Prime q','pr-s1btn':'Check',
    'pr-s2t':'Step 2: Compute n = p × q',
    'pr-s2f':'n = p × q',
    'pr-s2h':'<span class="blink-kw">n</span> — public modulus. Multiply p by q.',
    'pr-s2ln':'Value of n','pr-s2btn':'Check',
    'pr-s3t':'Step 3: Compute φ(n) = (p−1)(q−1)',
    'pr-s3f':'φ(n) = (p−1)(q−1)',
    'pr-s3h':'<span class="blink-kw">φ(n)</span> — Euler\'s totient. Multiply (p−1) by (q−1).',
    'pr-s3ln':'Value of φ(n)','pr-s3btn':'Check',
    'pr-s4t':'Step 4: Choose public exponent e',
    'pr-s4f':'2 < e < φ(n), GCD(e,φ)=1, e — PRIME',
    'pr-s4h':'<span class="blink-kw">e</span> must be prime, greater than 2, less than φ(n), and coprime with φ(n). Click a valid option:',
    'pr-s4btn':'Confirm',
    'pr-s5t':'Step 5: Find private key d',
    'pr-s5f':'d × e ≡ 1 (mod φ(n))',
    'pr-s5h':'<span class="blink-kw">d</span> — private key. Find d such that d × e mod φ(n) = 1. Use the calculator!',
    'pr-s5ld':'Value of d','pr-s5btn':'Check',
    'pr-s6t':'Step 6: Encrypt message M',
    'pr-s6f':'C = Mᵉ mod n',
    'pr-s6h':'<span class="blink-kw">C</span> — ciphertext. Apply C = M^e mod n.',
    'pr-s6lm':'M (from 2 to n−1)','pr-s6lc':'Value of C','pr-s6btn':'Check',
    'pr-s7t':'Step 7: Decrypt C',
    'pr-s7f':'M = Cᵈ mod n',
    'pr-s7h':'<span class="blink-kw">M</span> — plaintext. Compute M = C^d mod n. You should get the original M back!',
    'pr-s7lm':'Value of M (result)','pr-s7btn':'Check',
    'pr-hint-btn':'💜 Hint','pr-correct':'✓ Correct!','pr-wrong':'✗ Try again',
    'pr-done-title':'🎉 You mastered RSA!',
    'pr-done-body':'All 7 steps completed. You generated keys, encrypted and decrypted a message!',
    'pr-s4ln':'Value of e',
    'rlp-title':'RSA Values',
    'rlp-empty':'Start solving steps —<br>values will appear here ✨',
    'err-p-prime':'⚠ p must be a prime number','err-q-prime':'⚠ q must be a prime number',
    'err-pq-diff':'⚠ p and q must be different','err-enter-nums':'⚠ Enter numbers',
    'err-enter-num':'⚠ Enter a number','err-expected':'(expected {0})',
    'err-e-gt2':'⚠ e must be greater than 2','err-e-lt-phi':'⚠ e must be less than φ(n) = {0}',
    'err-e-prime':'⚠ e must be a prime number','err-gcd':'⚠ GCD(e, φ(n)) must equal 1',
    'err-e-valid':'⚠ Enter a valid number','err-d-check':'— check: d×e mod φ(n) must = 1',
    'err-m-range':'⚠ M must be between 2 and n−1','match-original':'— matches the original!',
    'hint-cond-e':'Conditions: e — prime, 2 < e < {0}, GCD(e, {0}) = 1',
    'ascii-title':'ASCII Table',
    'rlp-e':'e (public)','rlp-d':'d (private)','rlp-M':'M (message)','rlp-C':'C (cipher)',
    'th-page-tag':'📖 Pure Theory','th-page-title':'RSA: Theory & Examples','th-page-lead':'All formulas, definitions and fully worked numerical examples — step by step.',
    'th-toc-lbl':'Contents',
    'ttoc-btn-0':'What is RSA?','ttoc-btn-1':'Primes p, q','ttoc-btn-2':'Modulus n = p×q','ttoc-btn-3':'Euler\'s φ(n)','ttoc-btn-4':'Public key e','ttoc-btn-5':'Private key d','ttoc-btn-6':'Encryption C','ttoc-btn-7':'Decryption M','ttoc-btn-8':'Full example',
    'th-btn-practice':'🧪 Go to Practice →','th-btn-ai':'🤖 Ask AI',
    'ai-page-tag':'🤖 AI Assistant','ai-page-title':'Ask AI about RSA','ai-page-lead':'Confused about something? Ask a question — the AI will explain with examples in your language.',
    'ai-hd-name':'RSA Assistant','ai-hd-status':'Online · RSA Cryptography Expert',
    'ai-welcome':'Hello! 👋 I\'m an AI assistant for RSA. Ask any question — I\'ll explain with examples!',
    'ai-hint-text':'Enter — send · Shift+Enter — new line',
    'ai-clr-txt':'Clear chat',
    'ai-inp-placeholder':'E.g.: What is φ(n) and why is it needed?',
    'ai-q1':'🔐 What is RSA?','ai-q2':'φ Euler\'s function','ai-q3':'🔑 How to find d?','ai-q4':'⚠ Why n ≥ 256?','ai-q5':'🧮 What is mod?','ai-q6':'📋 Full example',
    'cph-tag':'🔐 Cipher','cph-title':'RSA Text Cipher','cph-lead':'Type any word — each character is RSA-encrypted individually. See everything: ASCII code, ciphertext, operation C = Mᵉ mod n.',
    'cph-setup-title':'⚙️ RSA Parameters','cph-setup-hint':'(two different primes needed, n ≥ 256 for ASCII)','cph-lp':'p (prime)','cph-lq':'q (prime)',
    'cph-small':'← Small','cph-large':'Large →','cph-input-title':'✏️ Text to encrypt',
    'cph-maxlen':'Max 40 chars · each character is a separate RSA operation',
    'cph-enc-btn':'🔐 Encrypt','cph-dec-btn':'🔓 Decrypt','cph-clr-btn':'↺ Reset',
    'cph-th1':'Char','cph-th2':'ASCII (M)','cph-th3':'C = Mᵉ mod n','cph-th4':'Ciphertext C',
    'cph-hint-setup':'Choose two different prime numbers p and q. Their product n must be ≥ 256 to encrypt ASCII characters (codes 32–126).',
    'cph-how-1':'Choose primes p and q','cph-how-2':'Enter text','cph-how-3':'Encrypt C = Mᵉ mod n','cph-how-4':'Decrypt M = Cᵈ mod n','cph-alert-empty':'Enter text!','cph-placeholder':'Enter a word or phrase, e.g.: Hello',
    'ai-hero-badge-txt':'🤖 AI Assistant RSA','ai-offline-b':'Works fully offline','ai-offline-txt':'— no internet or API keys needed. The built-in RSA expert knows all formulas and will walk through any example step by step.',
    'ai-gsearch-label':'Search RSA topics','ai-gsearch-blocked-title':'Google blocked the iframe','ai-gsearch-blocked-sub':'This is standard browser behaviour. Open results in a new tab:','ai-gsearch-open-tab':'Open in Google',
    'cph-not-prime-p':'❌ p={0} is not prime.','cph-not-prime-q':'❌ q={0} is not prime.',
    'cph-pq-diff':'❌ p and q must be different.',
    'cph-pub-key':'Public key (e={0}, n={1})','cph-prv-key':'Private key (d={0}, n={1})',
    'cph-n-small':'⚠️ n={0} < 256 — cannot encrypt all ASCII chars! Use larger p and q (e.g. p=17, q=19 → n=323).',
    'cph-need-pq':'First set correct p and q!','cph-need-enc':'First encrypt the text!',
    'cph-enc-progress':'🔐 Encrypting char by char...','cph-enc-done':'✅ Encryption complete!',
    'cph-dec-progress':'🔓 Decrypting char by char...','cph-dec-done':'✅ Decryption complete!',
    'cph-table-enc':'📊 Encryption table (C = Mᵉ mod n)',
    'cph-table-dec':'📊 Decryption table (M = Cᵈ mod n)',
    'cph-out-enc':'Encrypted text (numbers separated by spaces)',
    'cph-out-dec-ok':'Recovered text ✅','cph-out-dec-fail':'Recovered text ❌',
    'cph-match':'  (matches original!)','cph-space':'(space)',
    'crack-invalid':'⚠ Enter valid n and e',
    'crack-start':'▶ ATTACK STARTED','crack-target':'// Target: n={0}, e={1}',
    'crack-method':'// Method: Brute-force factorisation',
    'crack-scan':'// Scanning divisors of n from 2 to √n (≈{0})...',
    'crack-progress':'Scanning: {0}% (checked {1} of {2})',
    'crack-test':'  [{0}%] Testing: {1}... ','crack-divisor-found':'DIVISOR FOUND!',
    'crack-not-found':'✗ No divisors found in range 2..√n',
    'crack-n-may-prime':'// n={0} may be prime or too large',
    'crack-safe-title':'🛡 Key is brute-force resistant',
    'crack-safe-body':'Could not find non-trivial divisors of n={0}.<br>Likely n is prime or the key is large enough.',
    'crack-warn-prime':'⚠ p={0} or q={1} is not prime',
    'crack-found':'✓ FOUND! p={0}, q={1}',
    'crack-phi':'✓ φ(n) = ({0}-1)({1}-1) = {2}',
    'crack-prv':'✓ PRIVATE KEY: d={0}',
    'crack-done':'⚡ CRACKED!',
    'crack-cracked-title':'⚡ RSA Cracked!',
    'crack-pub-key':'public key','crack-prv-restored':'PRIVATE KEY RECOVERED!',
    'crack-pubkey-label':'Public key:','crack-prvkey-label':'→ Private:',
    'crack-m-range':'⚠ M must be between 2 and {0}',
    'crack-enc-label':'Encrypt:','crack-dec-label':'Decrypt:',
    'crack-match':'✅ Match!','crack-error':'❌ Error',
    'chart-days':'days','chart-years':'years','chart-kyears':'thousands yrs','chart-myears':'mil. yrs',
    'chart-bits':'bit','chart-yr':'1 year',
    'err-n-too-small':'⚠ n = p×q = {0} — too small! Need n ≥ 256 so ASCII codes (32–126) fit. Try larger numbers (e.g. p=17, q=19).',

  }
};

/* ====================================================== THEORY DATA ====================================================== */
const THEORY_DATA = {
  ru: [
    {
      id:'th0', ico:'🔐', ibg:'rgba(37,99,235,.1)', sub:'Раздел 01', title:'Что такое RSA?',
      body:'<strong>RSA</strong> — алгоритм асимметричного шифрования (1977, MIT). Авторы: <strong>Rivest, Shamir, Adleman</strong>.<br><br>Ключевая идея: <strong>два разных ключа</strong>. Зашифровать — открытым (любой). Расшифровать — только закрытым (только ты).',
      tip:'<strong>Аналогия:</strong> Открытый ключ — замок, раздаёшь всем. Закрытый ключ — ключ к нему, только у тебя.',
      extra:`<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:16px">
        <div style="background:var(--al);border-radius:12px;padding:16px;text-align:center"><div style="font-size:34px;margin-bottom:6px">🔑</div><div style="font-weight:700;color:var(--acc);font-size:17px">Открытый ключ</div><div style="font-size:14px;color:var(--txt2);margin-top:4px">(e, n) — публикуется</div></div>
        <div style="background:var(--pl);border-radius:12px;padding:16px;text-align:center"><div style="font-size:34px;margin-bottom:6px">🔒</div><div style="font-weight:700;color:var(--pur);font-size:17px">Закрытый ключ</div><div style="font-size:14px;color:var(--txt2);margin-top:4px">(d, n) — только для тебя</div></div>
      </div>`
    },
    {
      id:'th1', ico:'🧮', ibg:'rgba(22,163,74,.1)', sub:'Раздел 02', title:'Простые числа p и q',
      body:'<strong>Простое</strong> — делится только на 1 и само себя: 2, 3, 5, 7, 11, 13, 17, 19, 23...<br>В RSA нужны два <strong>разных</strong> простых числа p ≠ q.',
      warn:'⚠️ <div><strong>p×q ≥ 256 обязательно!</strong> Иначе ASCII коды (32–126) не поместятся при шифровании. Пример: p=17, q=19 → n=323 ✓</div>',
      examples:[
        {ok:true, text:'<code>p = 17</code> и <code>q = 19</code> — простые, разные, n=323 ≥ 256 ✓'},
        {ok:false, text:'<code>p = 12</code> (= 4×3, не простое), <code>p = q = 17</code> (одинаковые)'}
      ], exHd:'Пример'
    },
    {
      id:'th2', ico:'n', ibg:'rgba(124,58,237,.1)', iStyle:'font-family:\'Source Code Pro\',monospace;font-weight:900;font-size:22px;color:var(--pur)', sub:'Раздел 03', title:'Модуль n = p × q',
      body:'Входит в оба ключа и публикуется открыто.',
      fml:'n = p × q', fmlNote:'p и q — различные простые; <span>n ≥ 256</span> для корректной работы с ASCII',
      tip:'<strong>Безопасность:</strong> умножить p×q — мгновенно; разложить большое n обратно — годы работы суперкомпьютера.',
      examples:[{ok:true,text:'<code>n = 17 × 19 = 323</code> ≥ 256 ✓'}], exHd:'Пример (p=17, q=19)'
    },
    {
      id:'th3', ico:'φ', ibg:'rgba(234,88,12,.1)', iStyle:'font-family:\'Source Code Pro\',monospace;font-weight:900;font-size:22px;color:var(--org)', sub:'Раздел 04', title:'Функция Эйлера φ(n)',
      body:'<strong>φ(n)</strong> — количество чисел от 1 до n, взаимно простых с n. Нужна для генерации ключей.',
      fml:'φ(n) = (p − 1) × (q − 1)',
      examples:[
        {ok:null,text:'<code>p−1 = 16</code>, <code>q−1 = 18</code>'},
        {ok:null,text:'<code>φ(n) = 16 × 18 = 288</code>'}
      ], exHd:'Пример (p=17, q=19)'
    },
    {
      id:'th4', ico:'e', ibg:'rgba(37,99,235,.1)', iStyle:'font-family:\'Source Code Pro\',monospace;font-weight:900;font-size:22px;color:var(--acc)', sub:'Раздел 05', title:'Открытый показатель e',
      body:'Публичная экспонента — три условия одновременно.',
      fml:'1 &lt; e &lt; φ(n), e — простое, НОД(e,φ(n))=1',
      warn:'⚠️ <div><strong>e обязательно простое число!</strong> Это отдельное условие.</div>',
      examples:[{ok:true,text:'Пробуем <code>e = 5</code>: простое ✓, 5 &lt; 288 ✓, НОД(5,288)=1 ✓ → подходит!'}], exHd:'Пример (φ(n)=288)'
    },
    {
      id:'th5', ico:'d', ibg:'rgba(124,58,237,.1)', iStyle:'font-family:\'Source Code Pro\',monospace;font-weight:900;font-size:22px;color:var(--pur)', sub:'Раздел 06', title:'Закрытый ключ d',
      body:'Секретная экспонента, мультипликативный обратный к e по модулю φ(n).',
      fml:'d × e ≡ 1 (mod φ(n))', fmlNote:'то есть: <span>(d × e) mod φ(n) = 1</span>',
      examples:[
        {ok:null,text:'Ищем d: <code>d × 5 ≡ 1 (mod 288)</code>'},
        {ok:null,text:'Расширенный алгоритм Евклида → <code>d = 173</code>'},
        {ok:null,text:'Проверка: <code>(173 × 5) mod 288 = 865 mod 288 = 1</code> ✓'}
      ], exHd:'Пример (e=5, φ(n)=288)'
    },
    {
      id:'th6', ico:'🔒', ibg:'rgba(22,163,74,.1)', sub:'Раздел 07', title:'Шифрование C = Mᵉ mod n',
      body:'Выполняется открытым ключом (e, n). M — число (ASCII код символа).',
      fml:'C = M<sup>e</sup> mod n', fmlNote:'<span>M</span> — сообщение (2 ≤ M &lt; n) &nbsp; <span>C</span> — шифртекст',
      examples:[{ok:null,text:'<code>C = 65⁵ mod 323 = 1116</code> <span style="color:var(--txt3)">(вычисляется калькулятором)</span>'}], exHd:"Пример (e=5, n=323, M=65='A')"
    },
    {
      id:'th7', ico:'🔓', ibg:'rgba(37,99,235,.1)', sub:'Раздел 08', title:'Дешифровка M = Cᵈ mod n',
      body:'Только закрытый ключ (d, n) может расшифровать.',
      fml:'M = C<sup>d</sup> mod n', fmlNote:'Результат должен совпасть с исходным M',
      examples:[{ok:null,text:"<code>M = 1116¹⁷³ mod 323 = 65</code> ✓ → ASCII 65 = 'A' ✓"}], exHd:'Пример (d=173, n=323, C=1116)'
    },
    {
      id:'th8', ico:'📋', ibg:'rgba(22,163,74,.15)', sub:'Раздел 09', subCol:'var(--grn)', title:'Полный пример (p=17, q=19)',
      codebox: true,
      cs0:'▶ Ввод', cs1:'▶ Вычисления', cs2:'▶ Ключи', cs3:'▶ Шифруем M=65 (\'A\')', cs4:'▶ Дешифруем C=1116',
      c_prime:'# простое', c_prime2:'# простое, ≠ p', c_n256:'# ≥ 256 ✓', c_gcd:'# простое, НОД(5,288)=1 ✓', c_d:'# 173×5 mod 288 = 1 ✓',
      c_pub:'Открытый:', c_prv:'Закрытый:',
      btn1:'🧪 Попробовать самому →', btn2:'🤖 Задать вопрос ИИ'
    }
  ],
  en: [
    {
      id:'th0', ico:'🔐', ibg:'rgba(37,99,235,.1)', sub:'Section 01', title:'What is RSA?',
      body:'<strong>RSA</strong> is an asymmetric encryption algorithm (1977, MIT). Authors: <strong>Rivest, Shamir, Adleman</strong>.<br><br>Key idea: <strong>two different keys</strong>. Encrypt with the public key (anyone can). Decrypt only with the private key (only you).',
      tip:'<strong>Analogy:</strong> The public key is a padlock you hand out to everyone. The private key is the key that opens it — only you have it.',
      extra:`<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:16px">
        <div style="background:var(--al);border-radius:12px;padding:16px;text-align:center"><div style="font-size:34px;margin-bottom:6px">🔑</div><div style="font-weight:700;color:var(--acc);font-size:17px">Public Key</div><div style="font-size:14px;color:var(--txt2);margin-top:4px">(e, n) — published</div></div>
        <div style="background:var(--pl);border-radius:12px;padding:16px;text-align:center"><div style="font-size:34px;margin-bottom:6px">🔒</div><div style="font-weight:700;color:var(--pur);font-size:17px">Private Key</div><div style="font-size:14px;color:var(--txt2);margin-top:4px">(d, n) — only for you</div></div>
      </div>`
    },
    {
      id:'th1', ico:'🧮', ibg:'rgba(22,163,74,.1)', sub:'Section 02', title:'Prime numbers p and q',
      body:'A <strong>prime</strong> is divisible only by 1 and itself: 2, 3, 5, 7, 11, 13, 17, 19, 23...<br>RSA needs two <strong>different</strong> primes p ≠ q.',
      warn:'⚠️ <div><strong>p×q ≥ 256 is required!</strong> Otherwise ASCII codes (32–126) will not fit during encryption. Example: p=17, q=19 → n=323 ✓</div>',
      examples:[
        {ok:true, text:'<code>p = 17</code> and <code>q = 19</code> — prime, different, n=323 ≥ 256 ✓'},
        {ok:false, text:'<code>p = 12</code> (= 4×3, not prime), <code>p = q = 17</code> (equal)'}
      ], exHd:'Example'
    },
    {
      id:'th2', ico:'n', ibg:'rgba(124,58,237,.1)', iStyle:'font-family:\'Source Code Pro\',monospace;font-weight:900;font-size:22px;color:var(--pur)', sub:'Section 03', title:'Modulus n = p × q',
      body:'Part of both keys, published openly.',
      fml:'n = p × q', fmlNote:'p and q are distinct primes; <span>n ≥ 256</span> for ASCII to work correctly',
      tip:'<strong>Security:</strong> multiplying p×q is instant; factoring a large n back takes years on a supercomputer.',
      examples:[{ok:true,text:'<code>n = 17 × 19 = 323</code> ≥ 256 ✓'}], exHd:'Example (p=17, q=19)'
    },
    {
      id:'th3', ico:'φ', ibg:'rgba(234,88,12,.1)', iStyle:'font-family:\'Source Code Pro\',monospace;font-weight:900;font-size:22px;color:var(--org)', sub:'Section 04', title:"Euler's totient φ(n)",
      body:"<strong>φ(n)</strong> — count of integers from 1 to n coprime with n. Needed to generate keys.",
      fml:'φ(n) = (p − 1) × (q − 1)',
      examples:[
        {ok:null,text:'<code>p−1 = 16</code>, <code>q−1 = 18</code>'},
        {ok:null,text:'<code>φ(n) = 16 × 18 = 288</code>'}
      ], exHd:'Example (p=17, q=19)'
    },
    {
      id:'th4', ico:'e', ibg:'rgba(37,99,235,.1)', iStyle:'font-family:\'Source Code Pro\',monospace;font-weight:900;font-size:22px;color:var(--acc)', sub:'Section 05', title:'Public exponent e',
      body:'The public exponent must satisfy three conditions simultaneously.',
      fml:'1 &lt; e &lt; φ(n), e — prime, GCD(e,φ(n))=1',
      warn:'⚠️ <div><strong>e must be a prime number!</strong> This is a separate requirement.</div>',
      examples:[{ok:true,text:'Try <code>e = 5</code>: prime ✓, 5 &lt; 288 ✓, GCD(5,288)=1 ✓ → valid!'}], exHd:'Example (φ(n)=288)'
    },
    {
      id:'th5', ico:'d', ibg:'rgba(124,58,237,.1)', iStyle:'font-family:\'Source Code Pro\',monospace;font-weight:900;font-size:22px;color:var(--pur)', sub:'Section 06', title:'Private key d',
      body:'The secret exponent — multiplicative inverse of e modulo φ(n).',
      fml:'d × e ≡ 1 (mod φ(n))', fmlNote:'meaning: <span>(d × e) mod φ(n) = 1</span>',
      examples:[
        {ok:null,text:'Find d: <code>d × 5 ≡ 1 (mod 288)</code>'},
        {ok:null,text:'Extended Euclidean algorithm → <code>d = 173</code>'},
        {ok:null,text:'Check: <code>(173 × 5) mod 288 = 865 mod 288 = 1</code> ✓'}
      ], exHd:'Example (e=5, φ(n)=288)'
    },
    {
      id:'th6', ico:'🔒', ibg:'rgba(22,163,74,.1)', sub:'Section 07', title:'Encryption C = Mᵉ mod n',
      body:'Performed with the public key (e, n). M is a number (ASCII code of the character).',
      fml:'C = M<sup>e</sup> mod n', fmlNote:'<span>M</span> — message (2 ≤ M &lt; n) &nbsp; <span>C</span> — ciphertext',
      examples:[{ok:null,text:'<code>C = 65⁵ mod 323 = 1116</code> <span style="color:var(--txt3)">(compute with calculator)</span>'}], exHd:"Example (e=5, n=323, M=65='A')"
    },
    {
      id:'th7', ico:'🔓', ibg:'rgba(37,99,235,.1)', sub:'Section 08', title:'Decryption M = Cᵈ mod n',
      body:'Only the private key (d, n) can decrypt.',
      fml:'M = C<sup>d</sup> mod n', fmlNote:'Result must match the original M',
      examples:[{ok:null,text:"<code>M = 1116¹⁷³ mod 323 = 65</code> ✓ → ASCII 65 = 'A' ✓"}], exHd:'Example (d=173, n=323, C=1116)'
    },
    {
      id:'th8', ico:'📋', ibg:'rgba(22,163,74,.15)', sub:'Section 09', subCol:'var(--grn)', title:'Full example (p=17, q=19)',
      codebox: true,
      cs0:'▶ Input', cs1:'▶ Calculations', cs2:'▶ Keys', cs3:"▶ Encrypt M=65 ('A')", cs4:'▶ Decrypt C=1116',
      c_prime:'# prime', c_prime2:'# prime, ≠ p', c_n256:'# ≥ 256 ✓', c_gcd:'# prime, GCD(5,288)=1 ✓', c_d:'# 173×5 mod 288 = 1 ✓',
      c_pub:'Public:', c_prv:'Private:',
      btn1:'🧪 Try it yourself →', btn2:'🤖 Ask the AI'
    }
  ],
  kz: [
    {
      id:'th0', ico:'🔐', ibg:'rgba(37,99,235,.1)', sub:'Бөлім 01', title:'RSA дегеніміз не?',
      body:'<strong>RSA</strong> — асимметриялық шифрлеу алгоритмі (1977, MIT). Авторлар: <strong>Rivest, Shamir, Adleman</strong>.<br><br>Негізгі идея: <strong>екі түрлі кілт</strong>. Шифрлеу — ашық кілтпен (кез келген адам). Шифрды ашу — тек жабық кілтпен (тек сен).',
      tip:'<strong>Аналогия:</strong> Ашық кілт — замок, барлығына таратасың. Жабық кілт — оның кілті, тек сенде.',
      extra:`<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:16px">
        <div style="background:var(--al);border-radius:12px;padding:16px;text-align:center"><div style="font-size:34px;margin-bottom:6px">🔑</div><div style="font-weight:700;color:var(--acc);font-size:17px">Ашық кілт</div><div style="font-size:14px;color:var(--txt2);margin-top:4px">(e, n) — жарияланады</div></div>
        <div style="background:var(--pl);border-radius:12px;padding:16px;text-align:center"><div style="font-size:34px;margin-bottom:6px">🔒</div><div style="font-weight:700;color:var(--pur);font-size:17px">Жабық кілт</div><div style="font-size:14px;color:var(--txt2);margin-top:4px">(d, n) — тек сенде</div></div>
      </div>`
    },
    {
      id:'th1', ico:'🧮', ibg:'rgba(22,163,74,.1)', sub:'Бөлім 02', title:'Жай сандар p және q',
      body:'<strong>Жай сан</strong> — тек 1-ге және өзіне бөлінеді: 2, 3, 5, 7, 11, 13, 17, 19, 23...<br>RSA-да екі <strong>түрлі</strong> жай сан керек: p ≠ q.',
      warn:'⚠️ <div><strong>p×q ≥ 256 міндетті!</strong> Әйтпесе ASCII кодтары (32–126) шифрлеу кезінде сыймайды. Мысалы: p=17, q=19 → n=323 ✓</div>',
      examples:[
        {ok:true, text:'<code>p = 17</code> және <code>q = 19</code> — жай, түрлі, n=323 ≥ 256 ✓'},
        {ok:false, text:'<code>p = 12</code> (= 4×3, жай емес), <code>p = q = 17</code> (бірдей)'}
      ], exHd:'Мысал'
    },
    {
      id:'th2', ico:'n', ibg:'rgba(124,58,237,.1)', iStyle:'font-family:\'Source Code Pro\',monospace;font-weight:900;font-size:22px;color:var(--pur)', sub:'Бөлім 03', title:'Модуль n = p × q',
      body:'Екі кілтке де кіреді, ашық жарияланады.',
      fml:'n = p × q', fmlNote:'p және q — түрлі жай сандар; ASCII дұрыс жұмыс жасауы үшін <span>n ≥ 256</span>',
      tip:'<strong>Қауіпсіздік:</strong> p×q көбейту — лезде; үлкен n-ді кері ыдырату — суперкомпьютерге жылдар керек.',
      examples:[{ok:true,text:'<code>n = 17 × 19 = 323</code> ≥ 256 ✓'}], exHd:'Мысал (p=17, q=19)'
    },
    {
      id:'th3', ico:'φ', ibg:'rgba(234,88,12,.1)', iStyle:'font-family:\'Source Code Pro\',monospace;font-weight:900;font-size:22px;color:var(--org)', sub:'Бөлім 04', title:'Эйлер функциясы φ(n)',
      body:'<strong>φ(n)</strong> — 1-ден n-ге дейін n-мен өзара жай сандардың саны. Кілттер генерациялауға қажет.',
      fml:'φ(n) = (p − 1) × (q − 1)',
      examples:[
        {ok:null,text:'<code>p−1 = 16</code>, <code>q−1 = 18</code>'},
        {ok:null,text:'<code>φ(n) = 16 × 18 = 288</code>'}
      ], exHd:'Мысал (p=17, q=19)'
    },
    {
      id:'th4', ico:'e', ibg:'rgba(37,99,235,.1)', iStyle:'font-family:\'Source Code Pro\',monospace;font-weight:900;font-size:22px;color:var(--acc)', sub:'Бөлім 05', title:'Ашық көрсеткіш e',
      body:'Публикалық дәреже — үш шарт бір мезгілде.',
      fml:'1 &lt; e &lt; φ(n), e — жай, ЕОБ(e,φ(n))=1',
      warn:'⚠️ <div><strong>e міндетті түрде жай сан!</strong> Бұл бөлек шарт.</div>',
      examples:[{ok:true,text:'<code>e = 5</code> көреміз: жай ✓, 5 &lt; 288 ✓, ЕОБ(5,288)=1 ✓ → жарамды!'}], exHd:'Мысал (φ(n)=288)'
    },
    {
      id:'th5', ico:'d', ibg:'rgba(124,58,237,.1)', iStyle:'font-family:\'Source Code Pro\',monospace;font-weight:900;font-size:22px;color:var(--pur)', sub:'Бөлім 06', title:'Жабық кілт d',
      body:'Құпия дәреже — e-нің φ(n) бойынша мультипликативтік кері элементі.',
      fml:'d × e ≡ 1 (mod φ(n))', fmlNote:'яғни: <span>(d × e) mod φ(n) = 1</span>',
      examples:[
        {ok:null,text:'d іздейміз: <code>d × 5 ≡ 1 (mod 288)</code>'},
        {ok:null,text:'Евклидтің кеңейтілген алгоритмі → <code>d = 173</code>'},
        {ok:null,text:'Тексеру: <code>(173 × 5) mod 288 = 865 mod 288 = 1</code> ✓'}
      ], exHd:'Мысал (e=5, φ(n)=288)'
    },
    {
      id:'th6', ico:'🔒', ibg:'rgba(22,163,74,.1)', sub:'Бөлім 07', title:'Шифрлеу C = Mᵉ mod n',
      body:'Ашық кілтпен (e, n) орындалады. M — сан (таңбаның ASCII коды).',
      fml:'C = M<sup>e</sup> mod n', fmlNote:'<span>M</span> — хабарлама (2 ≤ M &lt; n) &nbsp; <span>C</span> — шифрмәтін',
      examples:[{ok:null,text:'<code>C = 65⁵ mod 323 = 1116</code> <span style="color:var(--txt3)">(калькулятормен есептеледі)</span>'}], exHd:"Мысал (e=5, n=323, M=65='A')"
    },
    {
      id:'th7', ico:'🔓', ibg:'rgba(37,99,235,.1)', sub:'Бөлім 08', title:'Шифрды ашу M = Cᵈ mod n',
      body:'Тек жабық кілт (d, n) шифрды аша алады.',
      fml:'M = C<sup>d</sup> mod n', fmlNote:'Нәтиже бастапқы M-мен сәйкес болуы керек',
      examples:[{ok:null,text:"<code>M = 1116¹⁷³ mod 323 = 65</code> ✓ → ASCII 65 = 'A' ✓"}], exHd:'Мысал (d=173, n=323, C=1116)'
    },
    {
      id:'th8', ico:'📋', ibg:'rgba(22,163,74,.15)', sub:'Бөлім 09', subCol:'var(--grn)', title:'Толық мысал (p=17, q=19)',
      codebox: true,
      cs0:'▶ Кіріс', cs1:'▶ Есептеулер', cs2:'▶ Кілттер', cs3:"▶ M=65 ('A') шифрла", cs4:'▶ C=1116 шифрды аш',
      c_prime:'# жай сан', c_prime2:'# жай, ≠ p', c_n256:'# ≥ 256 ✓', c_gcd:'# жай, ЕОБ(5,288)=1 ✓', c_d:'# 173×5 mod 288 = 1 ✓',
      c_pub:'Ашық:', c_prv:'Жабық:',
      btn1:'🧪 Өзің байқап көр →', btn2:'🤖 ИИ-дан сұрау'
    }
  ]
};

function buildTheory(){
  const container = document.getElementById('theory-sections-container');
  if(!container) return;
  const data = THEORY_DATA[lang] || THEORY_DATA.ru;
  let html = '';
  data.forEach((s, idx) => {
    const icoStyle = s.iStyle ? `style="${s.iStyle}"` : '';
    const subColor = s.subCol ? `style="color:${s.subCol}"` : '';
    let inner = '';
    if(s.body) inner += `<div class="thsec-body">${s.body}</div>`;
    if(s.tip) inner += `<div class="thtip">${s.tip}</div>`;
    if(s.warn) inner += `<div class="thwarn">${s.warn}</div>`;
    if(s.fml){
      inner += `<div class="thfml"><div class="thfml-main">${s.fml}</div>`;
      if(s.fmlNote) inner += `<div class="thfml-note">${s.fmlNote}</div>`;
      inner += `</div>`;
    }
    if(s.examples){
      inner += `<div class="thex"><div class="thex-hd">${s.exHd||''}</div>`;
      s.examples.forEach((ex,i)=>{
        const n = ex.ok===true ? '✓' : ex.ok===false ? '✗' : (i+1);
        const nStyle = ex.ok===false ? 'style="background:var(--red)"' : '';
        inner += `<div class="thex-row"><div class="thex-n" ${nStyle}>${n}</div><div class="thex-t">${ex.text}</div></div>`;
      });
      inner += `</div>`;
    }
    if(s.extra) inner += s.extra;
    if(s.codebox){
      inner += `<div class="th-codebox">
        <span class="cs">${s.cs0}</span>
        <div><span style="color:var(--acc);font-weight:700">p</span> = <span style="color:var(--grn);font-weight:700">17</span> &nbsp;<span style="color:var(--txt3)">${s.c_prime}</span></div>
        <div><span style="color:var(--acc);font-weight:700">q</span> = <span style="color:var(--grn);font-weight:700">19</span> &nbsp;<span style="color:var(--txt3)">${s.c_prime2}</span></div>
        <span class="cs">${s.cs1}</span>
        <div><span style="color:var(--acc)">n</span> = 17 × 19 = <span style="color:var(--grn);font-weight:700">323</span> &nbsp;<span style="color:var(--txt3)">${s.c_n256}</span></div>
        <div><span style="color:var(--acc)">φ(n)</span> = 16 × 18 = <span style="color:var(--grn);font-weight:700">288</span></div>
        <div><span style="color:var(--acc)">e</span> = <span style="color:var(--grn);font-weight:700">5</span> &nbsp;<span style="color:var(--txt3)">${s.c_gcd}</span></div>
        <div><span style="color:var(--pur)">d</span> = <span style="color:var(--pur);font-weight:700">173</span> &nbsp;<span style="color:var(--txt3)">${s.c_d}</span></div>
        <span class="cs">${s.cs2}</span>
        <div><span style="color:var(--acc)">${s.c_pub}</span> (e=<span style="color:var(--grn)">5</span>, n=<span style="color:var(--grn)">323</span>)</div>
        <div><span style="color:var(--pur)">${s.c_prv}</span> (d=<span style="color:var(--pur)">173</span>, n=<span style="color:var(--pur)">323</span>)</div>
        <span class="cs">${s.cs3}</span>
        <div><span style="color:var(--org)">C</span> = 65⁵ mod 323 = <span style="color:var(--org);font-weight:700">1116</span></div>
        <span class="cs">${s.cs4}</span>
        <div><span style="color:var(--grn)">M</span> = 1116¹⁷³ mod 323 = <span style="color:var(--grn);font-weight:700">65</span> = 'A' ✓</div>
      </div>
      <div style="display:flex;gap:10px;margin-top:18px;flex-wrap:wrap">
        <button class="bblu" style="font-size:16px!important;padding:12px 24px!important" onclick="goPage('practice')">${s.btn1}</button>
        <button class="bgho" style="font-size:16px!important;padding:12px 24px!important" onclick="goPage('ai')">${s.btn2}</button>
      </div>`;
    }
    const borderStyle = idx===8 ? 'style="border-color:rgba(22,163,74,.3)"' : '';
    html += `<div class="thsec rv" id="${s.id}" ${borderStyle}>
      <div class="thsec-hd">
        <div class="thsec-ico" style="background:${s.ibg}"${s.iStyle?` `+icoStyle:''}>${s.ico}</div>
        <div><div class="thsec-sub" ${subColor}>${s.sub}</div><div class="thsec-title">${s.title}</div></div>
      </div>
      ${inner}
    </div>`;
  });
  container.innerHTML = html;
  setTimeout(rev, 50);
}

/* ====================================================== STATE ====================================================== */
let lang='ru', soundOn=true, curPage='home';
let PR = { p:0n,q:0n,n:0n,phi:0n,e:0n,d:0n,M:0n,C:0n, step:0, eSelected:null };
let calcOpen=false, calcExpr='', calcHistory=[];
const SK={PAGE:'rsa_page',LANG:'rsa_lang',THEME:'rsa_theme',SOUND:'rsa_sound',PR:'rsa_pr'};
function sv(k,v){try{localStorage.setItem(k,String(v));}catch(e){}}
function gv(k,def=''){try{const r=localStorage.getItem(k);return r===null?def:r;}catch(e){return def;}}

/* ====================================================== I18N ENGINE ====================================================== */
function T(k){return(DICT[lang]||DICT.ru)[k]??k;}
function applyLang(){
  document.querySelectorAll('[data-i]').forEach(el=>{const k=el.getAttribute('data-i');const v=T(k);if(v!==undefined)el.innerHTML=v;});
  document.querySelectorAll('.lbtn').forEach((b,i)=>b.classList.toggle('on',['kz','ru','en'][i]===lang));
  // Update AI textarea placeholder
  const aiInp=document.getElementById('ai-inp');
  // Update cipher textarea placeholder
  const cphTa=document.getElementById('cph-text');if(cphTa){const cph=T('cph-placeholder');if(cph&&cph!=='cph-placeholder')cphTa.placeholder=cph;}
  if(aiInp){const ph=T('ai-inp-placeholder');if(ph&&ph!=='ai-inp-placeholder')aiInp.placeholder=ph;}
  // Update hero titles that contain <em> tags (special handling for ai and cipher pages)
  const aiTitle=document.getElementById('ai-hero-title-el');
  if(aiTitle){
    const titles={kz:'RSA туралы <em>ИИ</em>-дан сұра',ru:'Спроси <em>ИИ</em> о RSA',en:'Ask <em>AI</em> about RSA'};
    aiTitle.innerHTML=titles[lang]||titles.ru;
  }
  const cphTitle=document.getElementById('cipher-hero-title-el');
  if(cphTitle){
    const titles={kz:'RSA <em>Шифрлеушісі</em> мәтіні',ru:'RSA <em>Шифровальщик</em> текста',en:'RSA Text <em>Cipher</em>'};
    cphTitle.innerHTML=titles[lang]||titles.ru;
  }
  rebuildPractice();
  buildTheory();
}
function setLang(l){lang=l;applyLang();sv(SK.LANG,l);click();
  if(curPage==='demo' && typeof window.kaspiApplyLang === 'function') {
    setTimeout(window.kaspiApplyLang, 50);
  }
}

/* ====================================================== ROUTING ====================================================== */
const PAGES=['home','demo','theory','practice','facts','tasks','ai'];
function goPage(p,silent=false){
  curPage=p;
  document.querySelectorAll('.page').forEach(el=>el.classList.remove('active'));
  const pg=document.getElementById('pg-'+p);if(pg)pg.classList.add('active');
  document.querySelectorAll('#topnav .npill').forEach((el,i)=>el.classList.toggle('on',PAGES[i]===p));
  document.querySelectorAll('#drw-nav a').forEach((el,i)=>el.classList.toggle('on',PAGES[i]===p));
  const fab=document.getElementById('calc-fab');
  const asciiFab=document.getElementById('ascii-fab');
  const calcPanel=document.getElementById('calc-panel');
  const asciiPanel=document.getElementById('ascii-panel');
  const cryptoBg=document.getElementById('crypto-3d-canvas');
  if(fab){
    if(p==='practice'){fab.style.display='flex';if(asciiFab)asciiFab.style.display='flex';}
    else{fab.style.display='none';if(asciiFab)asciiFab.style.display='none';if(calcOpen){calcOpen=false;if(calcPanel)calcPanel.classList.remove('open');}if(asciiPanel)asciiPanel.classList.remove('open');}
  }
  // Hide canvas on demo page (has own animation), show on others
  if(cryptoBg)cryptoBg.style.display=(p==='demo'?'none':'block');
  // Update kaspi language on demo page navigation
  if(p==='demo' && typeof window.kaspiApplyLang === 'function') {
    setTimeout(window.kaspiApplyLang, 50);
  }
  window.scrollTo(0,0);setTimeout(rev,80);
  if(p==='security'){setTimeout(()=>{initSecChart&&initSecChart();},120);}
  if(!silent){sv(SK.PAGE,p);click();}
}

/* ====================================================== DRAWER ====================================================== */
function openD(){document.getElementById('drw').classList.add('open');document.getElementById('ov').classList.add('open');click();}
function closeD(){document.getElementById('drw').classList.remove('open');document.getElementById('ov').classList.remove('open');}
function setTheme(el){
  const theme = el.checked?'dark':'light';
  document.body.setAttribute('data-theme',theme);
  sv(SK.THEME,theme);
  // Theme sync (animation embedded)
  if(frame&&frame.contentWindow) frame.contentWindow.postMessage({type:'theme',theme},'*');
  click();
}
function setSnd(el){soundOn=el.checked;sv(SK.SOUND,soundOn);}

/* ====================================================== SOUND ====================================================== */
let ax=null;
function getax(){if(!ax)ax=new(window.AudioContext||window.webkitAudioContext)();return ax;}
function tone(f,d=.07,t='sine',v=.05){if(!soundOn)return;try{const c=getax(),o=c.createOscillator(),g=c.createGain();o.connect(g);g.connect(c.destination);o.type=t;o.frequency.value=f;g.gain.setValueAtTime(v,c.currentTime);g.gain.exponentialRampToValueAtTime(.001,c.currentTime+d);o.start();o.stop(c.currentTime+d);}catch(e){}}
function click(){tone(500,.04,'sine',.04);}
function ok(){tone(660,.1,'sine',.07);setTimeout(()=>tone(880,.08,'sine',.05),110);}
function errSnd(){tone(200,.18,'sawtooth',.05);}
function celebrate(){[523,659,784,1047,1175,1319].forEach((f,i)=>setTimeout(()=>tone(f,.12,'sine',.07),i*120));}

/* ====================================================== MATH ====================================================== */
function isPrime(n){if(n<2n)return false;if(n===2n||n===3n)return true;if(n%2n===0n)return false;const sq=BigInt(Math.ceil(Math.sqrt(Number(n))));for(let i=3n;i<=sq;i+=2n)if(n%i===0n)return false;return true;}
function gcd(a,b){return b===0n?a:gcd(b,a%b);}
function modInv(e,phi){let rm2=phi,rm1=e,tm2=0n,tm1=1n;while(rm1!==0n){const q=rm2/rm1,rn=rm2-q*rm1,tn=tm2-q*tm1;rm2=rm1;rm1=rn;tm2=tm1;tm1=tn;}return((tm2%phi)+phi)%phi;}
function modPow(base,exp,mod){let r=1n;base=base%mod;while(exp>0n){if(exp%2n===1n)r=r*base%mod;exp>>=1n;base=base*base%mod;}return r;}
function findECandidates(phi,count=16){const c=[];let e=3n;while(c.length<count&&e<phi&&e<300n){if(isPrime(e)&&e>2n&&e<phi&&gcd(e,phi)===1n)c.push(e);e++;}return c;}

/* ====================================================== REVEAL ====================================================== */
function rev(){document.querySelectorAll('.rv,.fcrd,.tli').forEach(el=>{if(el.getBoundingClientRect().top<window.innerHeight*.92)el.classList.add('vis');});}
window.addEventListener('scroll',()=>{const h=document.documentElement.scrollHeight-window.innerHeight;if(h>0)document.getElementById('prog').style.width=(window.scrollY/h*100)+'%';rev();});

/* ====================================================== TOAST ====================================================== */
let toastT=null;
function showToast(msg){const t=document.getElementById('save-toast');if(!t)return;t.textContent=msg||T('save-msg');t.classList.add('show');clearTimeout(toastT);toastT=setTimeout(()=>t.classList.remove('show'),1800);}

/* ====================================================== PRACTICE ENGINE ====================================================== */
const STEP_COUNT=7;

function rebuildPractice(){
  buildTrack();
  buildStepCards();
  updateKeySummary();
}

function buildTrack(){
  const w=document.getElementById('prac-track');if(!w)return;
  let h='';
  for(let i=0;i<STEP_COUNT;i++){
    if(i>0)h+=`<div class="pt-line${i<=PR.step?' done':''}"></div>`;
    const cls=i<PR.step?'done':i===PR.step?'active':'';
    h+=`<div class="pt-step"><div class="pt-dot ${cls}" onclick="jumpToPracStep(${i})">${i<PR.step?'✓':(i+1)}</div></div>`;
  }
  w.innerHTML=h;
}

function buildStepCards(){
  const w=document.getElementById('prac-steps');if(!w)return;
  const steps=[s1Card,s2Card,s3Card,s4Card,s5Card,s6Card,s7Card];
  w.innerHTML=steps.map((fn,i)=>fn(i)).join('');
  // show visible cards
  setTimeout(()=>{
    document.querySelectorAll('.ps-card').forEach((el,i)=>{
      if(i<=PR.step){
        setTimeout(()=>el.classList.add('visible'),i*60);
      }
    });
  },50);
}

function stepCard(idx,title,formula,hintKey,body,done){
  const locked=idx>PR.step;
  const isDone=idx<PR.step;
  const numCls=isDone?'ps-num done':'ps-num';
  return`<div class="ps-card${locked?' locked':''}" id="ps-card-${idx}">
    <div class="${numCls}">${isDone?'✓':(idx+1)}</div>
    <div class="ps-title">${title}</div>
    <div class="ps-formula">${formula}</div>
    <div class="hint-bubble" id="hint-${idx}">
      <div class="hb-bg"></div>
      <div class="hb-text">${T(hintKey)}</div>
    </div>
    ${body}
    <div class="ps-feedback" id="fb-${idx}"></div>
    <div class="ps-success" id="succ-${idx}"></div>
  </div>`;
}

function s1Card(i){
  const body=`<div class="ps-input-row">
    <div class="ps-field"><div class="ps-label">${T('pr-s1lp')}</div><input class="ps-inp" id="pr-p" type="number" min="2" placeholder="e.g. 61" oninput="pr1Validate()"></div>
    <div class="ps-field"><div class="ps-label">${T('pr-s1lq')}</div><input class="ps-inp" id="pr-q" type="number" min="2" placeholder="e.g. 53" oninput="pr1Validate()"></div>
    <button class="ps-check-btn" onclick="pr1Check()">✓ ${T('pr-s1btn')}</button>
    <button class="ps-hint-btn" onclick="toggleHint(0)">${T('pr-hint-btn')}</button>
  </div>`;
  return stepCard(i,T('pr-s1t'),T('pr-s1f'),'pr-s1h',body,i<PR.step);
}
function s2Card(i){
  const hint=PR.p?`<span style="font-size:11px;color:var(--txt3);font-family:'Source Code Pro',monospace;display:block;margin-top:6px;">p=${PR.p}, q=${PR.q}</span>`:'';
  const body=`<div class="ps-input-row">
    <div class="ps-field"><div class="ps-label">${T('pr-s2ln')}</div><input class="ps-inp" id="pr-n" type="number" placeholder="?" oninput="clearFb(1)"></div>
    <button class="ps-check-btn" onclick="pr2Check()">✓ ${T('pr-s2btn')}</button>
    <button class="ps-hint-btn" onclick="toggleHint(1)">${T('pr-hint-btn')}</button>
  </div>${hint}`;
  return stepCard(i,T('pr-s2t'),T('pr-s2f'),'pr-s2h',body,i<PR.step);
}
function s3Card(i){
  const hint=PR.n?`<span style="font-size:11px;color:var(--txt3);font-family:'Source Code Pro',monospace;display:block;margin-top:6px;">(${PR.p}-1)×(${PR.q}-1) = ?</span>`:'';
  const body=`<div class="ps-input-row">
    <div class="ps-field"><div class="ps-label">${T('pr-s3ln')}</div><input class="ps-inp" id="pr-phi" type="number" placeholder="?" oninput="clearFb(2)"></div>
    <button class="ps-check-btn" onclick="pr3Check()">✓ ${T('pr-s3btn')}</button>
    <button class="ps-hint-btn" onclick="toggleHint(2)">${T('pr-hint-btn')}</button>
  </div>${hint}`;
  return stepCard(i,T('pr-s3t'),T('pr-s3f'),'pr-s3h',body,i<PR.step);
}
function s4Card(i){
  const hint2=PR.phi?`<span style="font-size:12px;color:var(--txt3);font-family:'Source Code Pro',monospace;display:block;margin-top:6px;">${T('hint-cond-e').replace(/\{0\}/g,PR.phi)}</span>`:'';
  const body=`<div class="ps-input-row">
    <div class="ps-field"><div class="ps-label">${T('pr-s4ln')}</div><input class="ps-inp" id="pr-e-inp" type="number" placeholder="e.g. 17" oninput="clearFb(3)"></div>
    <button class="ps-check-btn" onclick="pr4Check()">✓ ${T('pr-s4btn')}</button>
    <button class="ps-hint-btn" onclick="toggleHint(3)">${T('pr-hint-btn')}</button>
  </div>${hint2}`;
  return stepCard(i,T('pr-s4t'),T('pr-s4f'),'pr-s4h',body,i<PR.step);
}
function kFormulaSteps(e,phi){
  // d = (k*phi + 1) / e, find smallest k where result is integer
  const rows=[];
  for(let k=1n;k<=50n;k++){
    const num=k*phi+1n;
    const isInt=num%e===0n;
    const d=isInt?num/e:null;
    rows.push({k,num,isInt,d});
    if(isInt)break;
  }
  return rows;
}
function s5Card(i){
  let explHTML='';
  if(PR.e&&PR.phi){
    const e=PR.e,phi=PR.phi;
    const rows=kFormulaSteps(e,phi);
    const found=rows[rows.length-1];
    const d=found.d;

    const TL={
      ru:{
        title:'🔑 Как найти d — метод подбора k',
        idea:'<b>Идея:</b> d × e ≡ 1 (mod φ) означает, что <b>d × e</b> при делении на φ даёт остаток 1. Значит d × e = k × φ + 1 для какого-то целого k.',
        formula:'Отсюда формула:',
        formulaBox:`d = (k × φ(n) + 1) / e`,
        instruction:'Подставляем k = 1, 2, 3... и проверяем — делится ли результат нацело:',
        colK:'k',colCalc:'Считаем',colResult:'Целое?',
        yes:'✅ да!',no:'✗',
        found:(k,num,d)=>`(${k} × ${phi} + 1) / ${e} = ${num} / ${e} = <b>${d}</b> — целое!`,
        answer:`✅ Ответ: d = <b>${d}</b>`,
        check:`Проверка: ${e} × ${d} mod ${phi} = <b>${(e*d)%phi}</b> ✓ (это и есть 1)`
      },
      en:{
        title:'🔑 How to find d — k-formula method',
        idea:'<b>Idea:</b> d × e ≡ 1 (mod φ) means <b>d × e</b> divided by φ gives remainder 1. So d × e = k × φ + 1 for some integer k.',
        formula:'This gives the formula:',
        formulaBox:`d = (k × φ(n) + 1) / e`,
        instruction:'Plug in k = 1, 2, 3... and check if the result is a whole number:',
        colK:'k',colCalc:'Calculate',colResult:'Integer?',
        yes:'✅ yes!',no:'✗',
        found:(k,num,d)=>`(${k} × ${phi} + 1) / ${e} = ${num} / ${e} = <b>${d}</b> — whole number!`,
        answer:`✅ Answer: d = <b>${d}</b>`,
        check:`Check: ${e} × ${d} mod ${phi} = <b>${(e*d)%phi}</b> ✓ (that's 1)`
      },
      kz:{
        title:'🔑 d қалай табылады — k формуласы әдісі',
        idea:'<b>Идея:</b> d × e ≡ 1 (mod φ) дегеніміз <b>d × e</b>-ні φ-ға бөлгенде қалдық 1 болады. Яғни d × e = k × φ + 1.',
        formula:'Сонда формула:',
        formulaBox:`d = (k × φ(n) + 1) / e`,
        instruction:'k = 1, 2, 3... мәндерін қойып, бүтін сан шығатынын тексереміз:',
        colK:'k',colCalc:'Есептеу',colResult:'Бүтін?',
        yes:'✅ иә!',no:'✗',
        found:(k,num,d)=>`(${k} × ${phi} + 1) / ${e} = ${num} / ${e} = <b>${d}</b> — бүтін!`,
        answer:`✅ Жауап: d = <b>${d}</b>`,
        check:`Тексеру: ${e} × ${d} mod ${phi} = <b>${(e*d)%phi}</b> ✓ (бұл 1)`
      }
    };
    const l=TL[lang]||TL.ru;

    let tableRows='';
    rows.forEach(({k,num,isInt,d})=>{
      const calc=`(${k} × ${phi} + 1) / ${e} = ${num} / ${e}`;
      const resultTxt=isInt?`= <b class="dval">${d}</b>  ${l.yes}`:`= ${num/e}... &nbsp;${l.no}`;
      const rowCls=isInt?'found-row':'';
      tableRows+=`<tr class="${rowCls}"><td><b>${k}</b></td><td><code>${calc}</code></td><td>${resultTxt}</td></tr>`;
    });

    explHTML=`
    <div class="d-explainer" id="d-explainer-box" style="display:none">
      <div class="d-expl-title">${l.title}</div>
      <div class="d-expl-idea">${l.idea}</div>
      <div class="d-expl-formula-label">${l.formula}</div>
      <div class="d-expl-formulabox"><code>${l.formulaBox}</code></div>
      <div class="d-expl-instruction">${l.instruction}</div>
      <div style="overflow-x:auto">
      <table class="d-expl-table">
        <thead><tr><th>${l.colK}</th><th>${l.colCalc}</th><th>${l.colResult}</th></tr></thead>
        <tbody>${tableRows}</tbody>
      </table>
      </div>
      <div class="d-expl-found">${l.found(found.k,found.num,d)}</div>
      <div class="d-expl-answer">${l.answer}<br><span class="d-expl-check">${l.check}</span></div>
    </div>`;
  }

  const btnLabel={en:'📐 How to find d',ru:'📐 Как найти d',kz:'📐 d қалай табылады'};
  const showExplBtn=PR.e
    ?`<button class="ps-hint-btn d-expl-btn" onclick="toggleDExplainer()" id="d-expl-btn">${btnLabel[lang]||btnLabel.ru}</button>`
    :'';
  const hint2=PR.e
    ?`<div class="d-sub-hint">e = ${PR.e}, φ(n) = ${PR.phi} &rarr; найди d: d × ${PR.e} mod ${PR.phi} = 1</div>`
    :'';
  const body=`<div class="ps-input-row">
    <div class="ps-field"><div class="ps-label">${T('pr-s5ld')}</div><input class="ps-inp" id="pr-d" type="number" placeholder="?" oninput="clearFb(4)"></div>
    <button class="ps-check-btn" onclick="pr5Check()">✓ ${T('pr-s5btn')}</button>
    <button class="ps-hint-btn" onclick="toggleHint(4)">${T('pr-hint-btn')}</button>
    ${showExplBtn}
  </div>${hint2}${explHTML}`;
  return stepCard(i,T('pr-s5t'),T('pr-s5f'),'pr-s5h',body,i<PR.step);
}
function toggleDExplainer(){
  const box=document.getElementById('d-explainer-box');
  const btn=document.getElementById('d-expl-btn');
  if(!box||!btn)return;
  const show=box.style.display==='none';
  box.style.display=show?'block':'none';
  const lbl={en:{open:'📐 How to find d',close:'▲ Hide'},ru:{open:'📐 Как найти d',close:'▲ Скрыть'},kz:{open:'📐 d қалай табылады',close:'▲ Жасыру'}};
  const l=lbl[lang]||lbl.ru;
  btn.textContent=show?l.close:l.open;
  if(show)box.scrollIntoView({behavior:'smooth',block:'nearest'});
}
function s6Card(i){
  const body=`<div class="ps-input-row">
    <div class="ps-field"><div class="ps-label">${T('pr-s6lm')}</div><input class="ps-inp" id="pr-m" type="number" placeholder="e.g. 65" min="2" oninput="clearFb(5)"></div>
    <div class="ps-field"><div class="ps-label">${T('pr-s6lc')}</div><input class="ps-inp" id="pr-c-ans" type="number" placeholder="?" oninput="clearFb(5)"></div>
    <button class="ps-check-btn" onclick="pr6Check()">✓ ${T('pr-s6btn')}</button>
    <button class="ps-hint-btn" onclick="toggleHint(5)">${T('pr-hint-btn')}</button>
  </div>`;
  return stepCard(i,T('pr-s6t'),T('pr-s6f'),'pr-s6h',body,i<PR.step);
}
function s7Card(i){
  const body=`<div class="ps-input-row">
    <div class="ps-field"><div class="ps-label">${T('pr-s7lm')}</div><input class="ps-inp" id="pr-m-ans" type="number" placeholder="?" oninput="clearFb(6)"></div>
    <button class="ps-check-btn" onclick="pr7Check()">✓ ${T('pr-s7btn')}</button>
    <button class="ps-hint-btn" onclick="toggleHint(6)">${T('pr-hint-btn')}</button>
  </div>`;
  return stepCard(i,T('pr-s7t'),T('pr-s7f'),'pr-s7h',body,i<PR.step);
}

function getAllECands(phi){
  const all=[];let e=3n;
  while(all.length<20&&e<phi&&e<200n){
    const ok=isPrime(e)&&e>2n&&e<phi&&gcd(e,phi)===1n;
    all.push({e,ok});e++;
  }
  return all;
}

function toggleHint(idx){const h=document.getElementById('hint-'+idx);if(!h)return;h.classList.toggle('show');click();}
function clearFb(idx){const f=document.getElementById('fb-'+idx);if(f){f.textContent='';f.className='ps-feedback';}}

function setFb(idx,msg,type){
  const f=document.getElementById('fb-'+idx);
  if(!f)return;
  f.innerHTML=msg;f.className='ps-feedback '+type;
  if(type==='ok'){ok();}else if(type==='err'){errSnd();}
}

function advanceStep(){
  PR.step++;
  buildTrack();
  const card=document.getElementById('ps-card-'+PR.step);
  if(card){
    card.classList.remove('locked');
    // Re-enable any inputs that were rendered disabled (e.g. e input which depended on PR.phi)
    card.querySelectorAll('input[disabled], input:disabled').forEach(inp=>inp.removeAttribute('disabled'));
    // Rebuild this card's content so conditional disabled attrs get re-evaluated with current PR state
    const stepFns=[s1Card,s2Card,s3Card,s4Card,s5Card,s6Card,s7Card];
    if(stepFns[PR.step]){
      const tmp=document.createElement('div');
      tmp.innerHTML=stepFns[PR.step](PR.step);
      const newCard=tmp.firstElementChild;
      // Copy classes from new card to existing (keep id)
      card.innerHTML=newCard.innerHTML;
      card.className=newCard.className;
    }
    requestAnimationFrame(()=>card.classList.add('visible'));
    setTimeout(()=>card.scrollIntoView({behavior:'smooth',block:'center'}),200);
  }
  updateKeySummary();
  savePR();
}

function markStepDone(idx){
  const card=document.getElementById('ps-card-'+idx);
  if(!card)return;
  const numEl=card.querySelector('.ps-num');
  if(numEl){numEl.textContent='✓';numEl.classList.add('done');}
  // show success
  const succ=document.getElementById('succ-'+idx);
  if(succ&&!succ.classList.contains('show')){
    succ.innerHTML='';
    succ.classList.add('show');
  }
}

/* Step checks */
function pr1Validate(){
  const pe=document.getElementById('pr-p'),qe=document.getElementById('pr-q');
  if(!pe||!qe)return;
  const pv=pe.value.trim(),qv=qe.value.trim();
  if(pv){const pn=BigInt(pv||'0');pe.classList.toggle('ok',isPrime(pn)&&pn>=2n);pe.classList.toggle('err',pv&&(!isPrime(pn)||pn<2n));}
  if(qv){const qn=BigInt(qv||'0');qe.classList.toggle('ok',isPrime(qn)&&qn>=2n);qe.classList.toggle('err',qv&&(!isPrime(qn)||qn<2n));}
}

function pr1Check(){
  if(PR.step>0)return;
  try{
    const p=BigInt(document.getElementById('pr-p')?.value||'0');
    const q=BigInt(document.getElementById('pr-q')?.value||'0');
    if(!isPrime(p)){setFb(0,T('err-p-prime'),'err');return;}
    if(!isPrime(q)){setFb(0,T('err-q-prime'),'err');return;}
    if(p===q){setFb(0,T('err-pq-diff'),'err');return;}
    // CRITICAL: n must be >= 256 so all ASCII printable chars (32-126) can be encrypted
    const n=p*q;
    if(n<256n){
      setFb(0,T('err-n-too-small').replace('{0}',n),'err');
      return;
    }
    PR.p=p;PR.q=q;
    setFb(0,T('pr-correct')+'  (n = '+n+' ≥ 256 ✓)','ok');
    markStepDone(0);
    showSucc(0,`p = ${p}, q = ${q}, n = ${n}`);
    setTimeout(advanceStep,600);
    updateCalcVars();
    updateLivePanel();
  }catch(e){setFb(0,T('err-enter-nums'),'err');}
}

function pr2Check(){
  if(PR.step!==1)return;
  try{
    const ans=BigInt(document.getElementById('pr-n')?.value||'0');
    const correct=PR.p*PR.q;
    if(ans===correct){PR.n=correct;setFb(1,T('pr-correct'),'ok');markStepDone(1);showSucc(1,`n = ${correct}`);setTimeout(advanceStep,600);updateCalcVars();updateLivePanel();}
    else{setFb(1,T('pr-wrong')+` `+T('err-expected').replace('{0}',correct),'err');}
  }catch(e){setFb(1,T('err-enter-num'),'err');}
}

function pr3Check(){
  if(PR.step!==2)return;
  try{
    const ans=BigInt(document.getElementById('pr-phi')?.value||'0');
    const correct=(PR.p-1n)*(PR.q-1n);
    if(ans===correct){PR.phi=correct;setFb(2,T('pr-correct'),'ok');markStepDone(2);showSucc(2,`φ(n) = ${correct}`);setTimeout(advanceStep,600);updateCalcVars();updateLivePanel();}
    else{setFb(2,T('pr-wrong')+` `+T('err-expected').replace('{0}',correct),'err');}
  }catch(e){setFb(2,T('err-enter-num'),'err');}
}

function selectE(e){
  PR.eSelected=e;
  document.querySelectorAll('.e-card').forEach(c=>c.classList.remove('selected'));
  const cards=document.querySelectorAll('.e-card');
  getAllECands(PR.phi).forEach(({e:ce},i)=>{if(ce===e&&cards[i])cards[i].classList.add('selected');});
  click();
}

function pr4Check(){
  if(PR.step!==3)return;
  try{
    const inp=document.getElementById('pr-e-inp');
    if(!inp||!inp.value){setFb(3,T('err-e-valid'),'err');return;}
    const ans=BigInt(inp.value);
    if(ans<=2n){setFb(3,T('err-e-gt2'),'err');errSnd();return;}
    if(ans>=PR.phi){setFb(3,T('err-e-lt-phi').replace('{0}',PR.phi),'err');errSnd();return;}
    if(!isPrime(ans)){setFb(3,T('err-e-prime'),'err');errSnd();return;}
    if(gcd(ans,PR.phi)!==1n){setFb(3,T('err-gcd'),'err');errSnd();return;}
    PR.e=ans;
    inp.classList.add('ok');
    setFb(3,T('pr-correct'),'ok');markStepDone(3);showSucc(3,`e = ${ans}`);setTimeout(advanceStep,600);updateCalcVars();updateLivePanel();
  }catch(e){setFb(3,T('err-e-valid'),'err');}
}

function pr5Check(){
  if(PR.step!==4)return;
  try{
    const ans=BigInt(document.getElementById('pr-d')?.value||'0');
    const correct=modInv(PR.e,PR.phi);
    if(ans===correct&&(ans*PR.e)%PR.phi===1n){PR.d=ans;setFb(4,T('pr-correct'),'ok');markStepDone(4);showSucc(4,`d = ${ans}`);setTimeout(advanceStep,600);updateCalcVars();updateLivePanel();}
    else{setFb(4,T('pr-wrong')+` `+T('err-d-check'),'err');}
  }catch(e){setFb(4,T('err-enter-num'),'err');}
}

function pr6Check(){
  if(PR.step!==5)return;
  try{
    const M=BigInt(document.getElementById('pr-m')?.value||'0');
    const Cans=BigInt(document.getElementById('pr-c-ans')?.value||'0');
    if(M<2n||M>=PR.n){setFb(5,T('err-m-range'),'err');return;}
    const Ccorrect=modPow(M,PR.e,PR.n);
    if(Cans===Ccorrect){PR.M=M;PR.C=Ccorrect;setFb(5,T('pr-correct')+` C = ${Ccorrect}`,'ok');markStepDone(5);showSucc(5,`C = M^e mod n = ${Ccorrect}`);setTimeout(advanceStep,600);updateCalcVars();updateLivePanel();}
    else{setFb(5,T('pr-wrong')+` `+T('err-expected').replace('{0}',`C = ${Ccorrect}`),'err');}
  }catch(e){setFb(5,T('err-enter-nums'),'err');}
}

function pr7Check(){
  if(PR.step!==6)return;
  try{
    const Mans=BigInt(document.getElementById('pr-m-ans')?.value||'0');
    const Mcorrect=modPow(PR.C,PR.d,PR.n);
    if(Mans===Mcorrect&&Mans===PR.M){
      setFb(6,T('pr-correct')+` M = ${Mcorrect} ✓`,'ok');
      markStepDone(6);
      showSucc(6,`M = C^d mod n = ${Mcorrect} `+T('match-original'));
      PR.step=7;
      buildTrack();
      updateKeySummary();
      celebrate();
      showDoneMessage();
      savePR();
      updateLivePanel();
    } else {
      setFb(6,T('pr-wrong')+` `+T('err-expected').replace('{0}',`M = ${Mcorrect}`),'err');
    }
  }catch(e){setFb(6,T('err-enter-num'),'err');}
}

function showSucc(idx,msg){
  const s=document.getElementById('succ-'+idx);
  if(!s)return;
  s.innerHTML=`<div class="ps-success-ico">✅</div><div class="ps-success-txt">${msg}</div>`;
  s.classList.add('show');
}

function showDoneMessage(){
  const w=document.getElementById('prac-steps');
  if(!w)return;
  const div=document.createElement('div');
  div.style.cssText='margin-top:28px;padding:28px;background:linear-gradient(135deg,rgba(22,163,74,.12),rgba(37,99,235,.12));border:2px solid var(--grn);border-radius:18px;text-align:center;animation:bounceIn .6s ease';
  div.innerHTML=`<div style="font-size:36px;margin-bottom:10px;animation:float 2s ease-in-out infinite">🎉</div><div style="font-family:\'Merriweather\',serif;font-size:20px;font-weight:700;color:var(--grn);margin-bottom:8px;">${T('pr-done-title')}</div><div style="font-size:13px;color:var(--txt2);">${T('pr-done-body')}</div>`;
  w.appendChild(div);
  div.scrollIntoView({behavior:'smooth',block:'center'});
}

function updateKeySummary(){
  const s=document.getElementById('keys-summary');
  if(!s)return;
  if(PR.step>=5){
    s.classList.add('show');
    ['p','q','n','phi','e','d'].forEach(k=>{const el=document.getElementById('ks-'+k);if(el)el.textContent=PR[k]?PR[k].toString():'—';});
  }
}

function jumpToPracStep(i){if(i>PR.step)return;PR.step=i;rebuildPractice();}

function resetPractice(){
  PR={p:0n,q:0n,n:0n,phi:0n,e:0n,d:0n,M:0n,C:0n,step:0,eSelected:null};
  savePR();rebuildPractice();
  document.getElementById('keys-summary')?.classList.remove('show');
  // remove done banner
  const extra=document.querySelectorAll('#prac-steps>div:not(.ps-card)');extra.forEach(el=>el.remove());
  updateLivePanel();
  click();
}

function savePR(){
  try{localStorage.setItem(SK.PR,JSON.stringify({p:PR.p.toString(),q:PR.q.toString(),n:PR.n.toString(),phi:PR.phi.toString(),e:PR.e.toString(),d:PR.d.toString(),M:PR.M.toString(),C:PR.C.toString(),step:PR.step,eSelected:PR.eSelected?PR.eSelected.toString():null}));}catch(e){}
}
function loadPR(){
  try{const s=localStorage.getItem(SK.PR);if(!s)return;const o=JSON.parse(s);PR.p=BigInt(o.p||'0');PR.q=BigInt(o.q||'0');PR.n=BigInt(o.n||'0');PR.phi=BigInt(o.phi||'0');PR.e=BigInt(o.e||'0');PR.d=BigInt(o.d||'0');PR.M=BigInt(o.M||'0');PR.C=BigInt(o.C||'0');PR.step=o.step||0;PR.eSelected=o.eSelected?BigInt(o.eSelected):null;}catch(e){}}

