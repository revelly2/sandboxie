import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import './Simulation1.css';

// ─── Scenario Data ───────────────────────────────────────────────
const scenarios = {
  en: [
    {
      id: 1,
      icon: '📎',
      description: 'You downloaded an email attachment. After opening it, your files started getting corrupted one by one. The malware only activates when you open the infected file.',
      hint: 'Think: Does it need human action to spread?',
      answer: 'virus',
      explanation: 'A virus requires human interaction (like opening a file) to activate and spread. It attaches itself to host files and corrupts them.'
    },
    {
      id: 2,
      icon: '🌐',
      description: 'A strange program appeared on your PC without you clicking anything. Soon, 5 other computers on the same network got infected too — automatically.',
      hint: 'Think: Did it spread by itself across the network?',
      answer: 'worm',
      explanation: 'A worm self-replicates and spreads across networks without any human interaction. It exploits network vulnerabilities automatically.'
    },
    {
      id: 3,
      icon: '💾',
      description: 'You plugged in a USB drive from a friend. When you opened the document on it, your antivirus detected malicious code embedded inside the .doc file.',
      hint: 'Think: Was the malware attached to a file you had to open?',
      answer: 'virus',
      explanation: 'A virus hides inside legitimate files (like documents). It only executes when the user opens the infected file — classic virus behavior.'
    },
    {
      id: 4,
      icon: '📡',
      description: 'Your network suddenly became very slow. After checking, you found hundreds of copies of an unknown program running, consuming bandwidth and sending packets across the LAN.',
      hint: 'Think: Is it replicating itself and consuming network resources?',
      answer: 'worm',
      explanation: 'Worms consume network bandwidth by replicating themselves endlessly across connected devices without needing to attach to files.'
    },
    {
      id: 5,
      icon: '📧',
      description: 'You received an email with a .exe attachment disguised as a "Photo.jpg.exe". After running it, your programs started behaving strangely and crashing.',
      hint: 'Think: Did you have to run it manually?',
      answer: 'virus',
      explanation: 'This is a virus. It was disguised as a photo but was actually an executable. It needed you to run it manually to activate.'
    },
    {
      id: 6,
      icon: '🔓',
      description: 'An outdated Windows machine was connected to the office network. Without anyone touching it, malware exploited a known OS vulnerability and installed itself, then jumped to other machines.',
      hint: 'Think: Did it exploit a vulnerability without user action?',
      answer: 'worm',
      explanation: 'Worms exploit software vulnerabilities to spread without user interaction. The famous "WannaCry" and "Conficker" attacks worked this way.'
    },
    {
      id: 7,
      icon: '🎮',
      description: 'You downloaded a pirated game from an untrusted website. After installing and launching it, the game worked but a hidden program started modifying your system files.',
      hint: 'Think: Was the malware bundled inside something you installed?',
      answer: 'virus',
      explanation: 'The malware was embedded inside the game installer. You had to manually download and run it — this is typical virus behavior (hiding inside a host program).'
    },
    {
      id: 8,
      icon: '📶',
      description: 'A single infected laptop was brought into the school Wi-Fi. Within hours, every device on the network started showing pop-ups, even those whose owners did nothing.',
      hint: 'Think: Did all the other users have to do anything?',
      answer: 'worm',
      explanation: 'Worms propagate through shared networks automatically. The other users didn\'t click or open anything — the worm spread on its own via the network.'
    },
    {
      id: 9,
      icon: '📝',
      description: 'You opened a spreadsheet that a coworker shared. The spreadsheet had a macro that ran automatically and started deleting files in your Documents folder.',
      hint: 'Think: Was the malicious code inside a document you opened?',
      answer: 'virus',
      explanation: 'Macro viruses embed themselves in documents. They activate when you open the file and enable macros — this requires user interaction.'
    },
    {
      id: 10,
      icon: '🖥️',
      description: 'IT noticed that a server was sending massive amounts of data to unknown IP addresses. The malware had replicated itself into every shared folder on the company network — without any employee opening a file.',
      hint: 'Think: Did it spread without anyone doing anything?',
      answer: 'worm',
      explanation: 'This is a classic network worm. It replicated across shared folders automatically, consuming resources and exfiltrating data without user involvement.'
    },
    {
      id: 11,
      icon: '🔌',
      description: 'After connecting an external hard drive, every executable file (.exe) on your PC now has extra bytes appended to it. Each infected program spreads the malware further when run.',
      hint: 'Think: Does it attach to and modify existing programs?',
      answer: 'virus',
      explanation: 'File-infector viruses attach themselves to executable files. Each time an infected program runs, the virus spreads to more executables.'
    },
    {
      id: 12,
      icon: '🌍',
      description: 'A new malware strain was detected that sends itself as email attachments to every person in the victim\'s contact list — completely automatically, without the victim pressing send.',
      hint: 'Think: Is it self-sending without user action?',
      answer: 'worm',
      explanation: 'Email worms access the victim\'s email client and send copies of themselves to all contacts automatically. No user action is needed for propagation.'
    },
  ],
  il: [
    {
      id: 1,
      icon: '📎',
      description: 'Nag-download ka iti email attachment. Kalpasan a linuktam, nagdadael dagiti file mo iti maysa-maysa. Ti malware ket ag-activate laeng no luktam ti infektado a file.',
      hint: 'Panunotem: Masapul kadi ti aksion ti tao tapno kumalat?',
      answer: 'virus',
      explanation: 'Ti virus ket masapul na ti interaksion ti tao (kas iti panaglukat ti file) tapno ag-activate ken kumalat. Ag-attach daytoy kadagiti host files.'
    },
    {
      id: 2,
      icon: '🌐',
      description: 'Adda napakita a programa iti PC mo nga awan ti inklik-mo. Saan a nagbayag, 5 a computer iti isu met laeng a network ti na-infect — automatiko.',
      hint: 'Panunotem: Nagkalat kadi daytoy iti bukod na babaen ti network?',
      answer: 'worm',
      explanation: 'Ti worm ket ag-kopya iti bukod na ken kumalat kadagiti network nga awan ti tulong ti tao. Ag-exploit daytoy kadagiti network vulnerabilities.'
    },
    {
      id: 3,
      icon: '💾',
      description: 'Nag-plug ka ti USB drive manipud iti gayyem mo. Idi linuktam ti documento iti daytoy, na-detect ti antivirus mo ti malicious code a naka-embed iti .doc file.',
      hint: 'Panunotem: Naka-attach kadi ti malware iti file a masapul mo a luktan?',
      answer: 'virus',
      explanation: 'Ti virus ket agtago iti uneg dagiti legitimate a files. Ag-execute laeng daytoy no luktan ti user ti infektado a file.'
    },
    {
      id: 4,
      icon: '📡',
      description: 'Bigla a nabuntog ti network mo. Kalpasan a tsinekan, nakakita ka ti ginasut a kopya ti di am-ammo a programa, mangal-ala ti bandwidth ken mangipat-patulod kadagiti packet iti LAN.',
      hint: 'Panunotem: Ag-replicate kadi daytoy iti bukod na ken mangkonsumo ti network resources?',
      answer: 'worm',
      explanation: 'Dagiti worms ket mangkonsumo ti network bandwidth babaen ti panagreplicate iti bukod da nga awan pangsardeng kadagiti nakakonektar a device.'
    },
    {
      id: 5,
      icon: '📧',
      description: 'Nakaawat ka ti email nga adda .exe attachment a nakadisguise kas "Photo.jpg.exe". Kalpasan a pinatganmo, dagiti programa mo ket nagrugi a nagmalfunkyon.',
      hint: 'Panunotem: Masapul mo kadi a manual a patgan-en?',
      answer: 'virus',
      explanation: 'Daytoy ket virus. Nakadisguise kas ladawan ngem pudno a executable. Kasapulanna a manual mo a patgan-en tapno ag-activate.'
    },
    {
      id: 6,
      icon: '🔓',
      description: 'Ti outdated a Windows machine ket nakakonektar iti office network. Nga awan tao a nangdukot, in-exploit ti malware ti ammmo a OS vulnerability ket nag-install iti bukod na.',
      hint: 'Panunotem: In-exploit na kadi ti vulnerability nga awan aksion ti user?',
      answer: 'worm',
      explanation: 'Dagiti worms ket mangexploit kadagiti software vulnerabilities tapno kumalat nga awan interaksion ti user. Kasta ti WannaCry ken Conficker.'
    },
    {
      id: 7,
      icon: '🎮',
      description: 'Nag-download ka ti pirated a game manipud iti di mapagtalkan a website. Kalpasan nga in-install ken pinatgan mo, nagtrabaho ti game ngem adda nakalemmeng a programa a nangbaliw kadagiti system files mo.',
      hint: 'Panunotem: Naka-bundle kadi ti malware iti uneg ti in-install mo?',
      answer: 'virus',
      explanation: 'Ti malware ket naka-embed iti uneg ti game installer. Masapul mo a manual a i-download ken patgan-en — daytoy ket tipikal a virus behavior.'
    },
    {
      id: 8,
      icon: '📶',
      description: 'Ti maysa a na-infect a laptop ket naikabil iti school Wi-Fi. Iti uneg ti oras, amin a device iti network ket nagparang ti pop-ups, uray dagidiay awan naaramid dagiti owner da.',
      hint: 'Panunotem: Masapul kadi nga agar-aramid ti sabali a users ti ania man?',
      answer: 'worm',
      explanation: 'Dagiti worms ket kumalat babaen dagiti shared networks automatiko. Dagiti sabali a users ket saan a nagklik wenno naglukat ti ania man.'
    },
    {
      id: 9,
      icon: '📝',
      description: 'Linuktam ti spreadsheet a sinerrek ti katrabahuan mo. Ti spreadsheet ket addaan macro a nagpatgan automatiko ket nangirugi a mangbura kadagiti files iti Documents folder mo.',
      hint: 'Panunotem: Adda kadi ti malicious code iti uneg ti dokumento a linuktam?',
      answer: 'virus',
      explanation: 'Dagiti macro virus ket agitago iti uneg dagiti dokumento. Ag-activate dagitoy no luktan mo ti file ken i-enable dagiti macros.'
    },
    {
      id: 10,
      icon: '🖥️',
      description: 'Nakita ti IT a ti server ket mangipat-patulod ti dakkel a datos kadagiti di am-ammo nga IP address. Ti malware ket nagreplicate iti bukod na kadagiti tunggal shared folder — nga awan empleado a naglukat ti file.',
      hint: 'Panunotem: Nagkalat kadi nga awan tao a nangaramid ti ania man?',
      answer: 'worm',
      explanation: 'Daytoy ket klasiko a network worm. Automatiko a nagreplicate kadagiti shared folders, mangal-ala kadagiti resources nga awan pannakibiang ti user.'
    },
    {
      id: 11,
      icon: '🔌',
      description: 'Kalpasan ti pannakakonektar ti external hard drive, tunggal executable file (.exe) iti PC mo ket addaan dagiti extra bytes. Tunggal infektado a programa ket mangikalat ti malware no mapatgan.',
      hint: 'Panunotem: Ag-attach kadi ken mangbaliw kadagiti existing a programa?',
      answer: 'virus',
      explanation: 'Dagiti file-infector virus ket ag-attach kadagiti executable files. Tunggal mapatgan ti infektado a programa, kumalat ti virus kadagiti ad-adu pay nga executables.'
    },
    {
      id: 12,
      icon: '🌍',
      description: 'Adda baro a malware strain a naidetektar a mangipat-patulod iti bukod na kas email attachments kadagiti tunggal tao iti contact list ti biktima — automatiko, nga awan ti biktima a nangpindot iti send.',
      hint: 'Panunotem: Automatiko kadi a mangipat-patulod iti bukod na nga awan aksion ti user?',
      answer: 'worm',
      explanation: 'Dagiti email worm ket mangakseso iti email client ti biktima ken mangipat-patulod kadagiti kopya iti bukod da kadagiti amin a contacts automatiko.'
    },
  ]
};

const TOTAL_ROUNDS = 10;
const MAX_LIVES = 3;
const TIME_PER_QUESTION = 15; // seconds

// ─── Component ───────────────────────────────────────────────────
const Simulation1 = () => {
  const { lang } = useLanguage();

  // Game states: 'start' | 'playing' | 'results'
  const [gameState, setGameState] = useState('start');
  const [roundScenarios, setRoundScenarios] = useState([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [selected, setSelected] = useState(null);    // 'virus' | 'worm' | null
  const [showFeedback, setShowFeedback] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const timerRef = useRef(null);

  // Pick random scenarios for a round
  const initGame = useCallback(() => {
    const pool = lang === 'il' ? scenarios.il : scenarios.en;
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    setRoundScenarios(shuffled.slice(0, TOTAL_ROUNDS));
    setCurrentRound(0);
    setScore(0);
    setLives(MAX_LIVES);
    setStreak(0);
    setBestStreak(0);
    setSelected(null);
    setShowFeedback(false);
    setTimeLeft(TIME_PER_QUESTION);
    setGameState('playing');
  }, [lang]);

  // Timer logic
  useEffect(() => {
    if (gameState !== 'playing' || showFeedback) return;

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          // Time's up — treat as wrong
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [gameState, currentRound, showFeedback]);

  const handleTimeUp = () => {
    setSelected('timeout');
    setShowFeedback(true);
    setLives(prev => prev - 1);
    setStreak(0);
  };

  const handleAnswer = (choice) => {
    if (selected || showFeedback) return;
    clearInterval(timerRef.current);

    const scenario = roundScenarios[currentRound];
    const isCorrect = choice === scenario.answer;

    setSelected(choice);
    setShowFeedback(true);

    if (isCorrect) {
      const timeBonus = Math.ceil(timeLeft / 3);
      const streakBonus = streak >= 2 ? streak : 0;
      setScore(prev => prev + 10 + timeBonus + streakBonus);
      setStreak(prev => {
        const newStreak = prev + 1;
        setBestStreak(best => Math.max(best, newStreak));
        return newStreak;
      });
    } else {
      setLives(prev => prev - 1);
      setStreak(0);
    }
  };

  const nextRound = () => {
    if (lives <= 0 || currentRound >= TOTAL_ROUNDS - 1) {
      setGameState('results');
      return;
    }
    setCurrentRound(prev => prev + 1);
    setSelected(null);
    setShowFeedback(false);
    setTimeLeft(TIME_PER_QUESTION);
  };

  // Check game-over on lives change
  useEffect(() => {
    if (gameState === 'playing' && lives <= 0 && showFeedback) {
      // We'll transition to results when they click next
    }
  }, [lives, gameState, showFeedback]);

  const scenario = roundScenarios[currentRound];
  const timerPercent = (timeLeft / TIME_PER_QUESTION) * 100;
  const timerClass = timerPercent > 50 ? 'safe' : timerPercent > 25 ? 'warning' : 'danger';
  const progressPercent = ((currentRound + (showFeedback ? 1 : 0)) / TOTAL_ROUNDS) * 100;

  // Results grading
  const getGrade = () => {
    const pct = (score / (TOTAL_ROUNDS * 15)) * 100;
    if (pct >= 90) return { title: lang === 'il' ? 'CYBERSECURITY MASTER!' : 'CYBERSECURITY MASTER!', icon: '🏆', color: 'gold' };
    if (pct >= 60) return { title: lang === 'il' ? 'NALAING KA!' : 'GREAT JOB!', icon: '⭐', color: 'green' };
    return { title: lang === 'il' ? 'AG-PRACTICE KA PAY!' : 'KEEP PRACTICING!', icon: '💪', color: 'red' };
  };

  // ─── Render: Start Screen ─────────────────────────────────────
  if (gameState === 'start') {
    return (
      <div className="sim-page">
        <div className="sim-crt-overlay"></div>

        {/* Breadcrumb */}
        <nav className="module-breadcrumb" aria-label="breadcrumb">
          <Link to="/">Dashboard</Link>
          <span className="module-breadcrumb-sep">›</span>
          <Link to="/simulations">Simulations</Link>
          <span className="module-breadcrumb-sep">›</span>
          <span className="module-breadcrumb-current">
            {lang === 'il' ? 'Virus vs Worm' : 'Virus vs Worm'}
          </span>
        </nav>

        <div className="sim-header">
          <h1 className="sim-title">
            {lang === 'il' ? '🛡️ VIRUS vs WORM' : '🛡️ VIRUS vs WORM'}
          </h1>
          <p className="sim-subtitle">
            {lang === 'il' ? 'RETRO IDENTIFICATION SIMULATOR' : 'RETRO IDENTIFICATION SIMULATOR'}
          </p>
        </div>

        <div className="sim-start">
          <div className="sim-start-icon">🖥️</div>
          <h2 className="sim-title" style={{ fontSize: 'clamp(12px, 2.5vw, 18px)', marginBottom: '20px' }}>
            {lang === 'il' ? 'HAAN KADI A VIRUS WENNO WORM?' : 'IS IT A VIRUS OR A WORM?'}
          </h2>
          <p className="sim-start-desc">
            {lang === 'il'
              ? 'Basaem dagiti real-world scenarios ket desisyonam no ti malware ket Virus wenno Worm. Suroten dagiti clues ken aramiden ti umiso a desisyon!'
              : 'Read real-world scenarios and decide if the malware described is a Virus or a Worm. Follow the clues and make the right call!'}
          </p>

          <button className="sim-start-btn" onClick={initGame}>
            {lang === 'il' ? '▶ IRUGI' : '▶ START'}
          </button>

          <div className="sim-rules">
            <div className="sim-rules-title">
              {lang === 'il' ? '[ DAGITI PAGLINTEGAN ]' : '[ RULES ]'}
            </div>
            <ul className="sim-rules-list">
              <li>{lang === 'il' ? `${TOTAL_ROUNDS} a scenario ti masungbatam` : `Answer ${TOTAL_ROUNDS} scenarios`}</li>
              <li>{lang === 'il' ? `${MAX_LIVES} a biag — no maubos, game over!` : `${MAX_LIVES} lives — lose them all, game over!`}</li>
              <li>{lang === 'il' ? `${TIME_PER_QUESTION} segundo ti tunggal maysa` : `${TIME_PER_QUESTION} seconds per question`}</li>
              <li>{lang === 'il' ? 'Bonus puntos para iti napardas a sungbat ken streak!' : 'Bonus points for fast answers & streaks!'}</li>
              <li>{lang === 'il' ? 'Basaem ti hint no masapul mo ti tulong' : 'Read the hint if you need help'}</li>
            </ul>
          </div>
        </div>

        <div className="sim-pixel-divider">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="sim-pixel-dot"></div>
          ))}
        </div>
      </div>
    );
  }

  // ─── Render: Results Screen ────────────────────────────────────
  if (gameState === 'results') {
    const grade = getGrade();
    const answeredCorrectly = Math.floor(score / 10); // approximate

    return (
      <div className="sim-page">
        <div className="sim-crt-overlay"></div>

        <nav className="module-breadcrumb" aria-label="breadcrumb">
          <Link to="/">Dashboard</Link>
          <span className="module-breadcrumb-sep">›</span>
          <Link to="/simulations">Simulations</Link>
          <span className="module-breadcrumb-sep">›</span>
          <span className="module-breadcrumb-current">
            {lang === 'il' ? 'Resulta' : 'Results'}
          </span>
        </nav>

        <div className="sim-header">
          <h1 className="sim-title">
            {lang === 'il' ? '🎬 SIMULATION NALPAS' : '🎬 SIMULATION COMPLETE'}
          </h1>
        </div>

        <div className="sim-results">
          <div className="sim-results-icon">{grade.icon}</div>
          <h2 className={`sim-results-title ${grade.color}`}>{grade.title}</h2>

          <div className="sim-results-stats">
            <div className="sim-results-stat">
              <span className="sim-results-stat-label">{lang === 'il' ? 'PUNTOS' : 'SCORE'}</span>
              <span className="sim-results-stat-value">{score}</span>
            </div>
            <div className="sim-results-stat">
              <span className="sim-results-stat-label">{lang === 'il' ? 'ROUNDS' : 'ROUNDS'}</span>
              <span className="sim-results-stat-value">{currentRound + 1}</span>
            </div>
            <div className="sim-results-stat">
              <span className="sim-results-stat-label">{lang === 'il' ? 'PINAKAATIDDOG A STREAK' : 'BEST STREAK'}</span>
              <span className="sim-results-stat-value">{bestStreak}</span>
            </div>
            <div className="sim-results-stat">
              <span className="sim-results-stat-label">{lang === 'il' ? 'NABATI A BIAG' : 'LIVES LEFT'}</span>
              <span className={`sim-results-stat-value ${lives === 0 ? 'wrong-val' : ''}`}>{lives}</span>
            </div>
          </div>

          <p className="sim-results-grade">
            {lang === 'il'
              ? 'Laglagipem: Ti virus ket masapul na ti tao tapno kumalat, ngem ti worm ket kumalat iti bukod na babaen ti network. Ituloy mo ti ag-practice!'
              : 'Remember: A virus needs human interaction to spread, while a worm spreads on its own through networks. Keep practicing!'}
          </p>

          <button className="sim-play-again-btn" onClick={initGame}>
            {lang === 'il' ? '↻ AGSULIT' : '↻ PLAY AGAIN'}
          </button>
        </div>
      </div>
    );
  }

  // ─── Render: Playing ──────────────────────────────────────────
  return (
    <div className="sim-page">
      <div className="sim-crt-overlay"></div>

      {/* Breadcrumb */}
      <nav className="module-breadcrumb" aria-label="breadcrumb">
        <Link to="/">Dashboard</Link>
        <span className="module-breadcrumb-sep">›</span>
        <Link to="/simulations">Simulations</Link>
        <span className="module-breadcrumb-sep">›</span>
        <span className="module-breadcrumb-current">
          {lang === 'il' ? 'Virus vs Worm' : 'Virus vs Worm'}
        </span>
      </nav>

      <div className="sim-header">
        <h1 className="sim-title">
          🛡️ VIRUS vs WORM
        </h1>
      </div>

      {/* HUD */}
      <div className="sim-hud">
        <div className="sim-hud-item">
          <span className="sim-hud-label">{lang === 'il' ? 'PUNTOS' : 'SCORE'}</span>
          <span className="sim-hud-value">{score}</span>
        </div>
        <div className="sim-hud-item">
          <span className="sim-hud-label">{lang === 'il' ? 'ROUND' : 'ROUND'}</span>
          <span className="sim-hud-value">{currentRound + 1}/{TOTAL_ROUNDS}</span>
        </div>
        <div className="sim-hud-item">
          <span className="sim-hud-label">{lang === 'il' ? 'BIAG' : 'LIVES'}</span>
          <div className="sim-lives">
            {Array.from({ length: MAX_LIVES }).map((_, i) => (
              <span key={i} className={`sim-heart ${i >= lives ? 'lost' : ''}`}>❤️</span>
            ))}
          </div>
        </div>
        <div className="sim-hud-item">
          <span className="sim-hud-label">{lang === 'il' ? 'ORAS' : 'TIME'}</span>
          <span className={`sim-hud-value ${timeLeft <= 5 ? 'danger' : ''}`}>{timeLeft}s</span>
        </div>
      </div>

      {/* Timer Bar */}
      {!showFeedback && (
        <div className="sim-timer-bar">
          <div
            className={`sim-timer-fill ${timerClass}`}
            style={{ width: `${timerPercent}%` }}
          ></div>
        </div>
      )}

      {/* Progress */}
      <div className="sim-progress-bar">
        <div className="sim-progress-fill" style={{ width: `${progressPercent}%` }}></div>
      </div>

      {/* Streak */}
      {streak >= 2 && !showFeedback && (
        <div className="sim-combo">
          🔥 {streak}x {lang === 'il' ? 'STREAK!' : 'STREAK!'} (+{streak} bonus)
        </div>
      )}

      {/* Scenario */}
      {scenario && (
        <div className="sim-scenario">
          <div className="sim-scenario-label">
            <span className="blink">▸</span>
            {lang === 'il' ? 'SENARYO' : 'SCENARIO'} #{currentRound + 1}
          </div>
          <div className="sim-scenario-icon">{scenario.icon}</div>
          <p className="sim-scenario-text">{scenario.description}</p>
          <p className="sim-scenario-hint">💡 {scenario.hint}</p>
        </div>
      )}

      {/* Answer Buttons */}
      {!showFeedback && (
        <div className="sim-answers">
          <button
            className="sim-answer-btn"
            onClick={() => handleAnswer('virus')}
            disabled={!!selected}
          >
            🦠 VIRUS
          </button>
          <button
            className="sim-answer-btn"
            onClick={() => handleAnswer('worm')}
            disabled={!!selected}
          >
            🐛 WORM
          </button>
        </div>
      )}

      {/* Post-answer buttons with correct/wrong state */}
      {showFeedback && selected !== 'timeout' && (
        <div className="sim-answers">
          <button
            className={`sim-answer-btn ${
              selected === 'virus'
                ? scenario.answer === 'virus' ? 'correct' : 'wrong'
                : scenario.answer === 'virus' ? 'correct' : ''
            }`}
            disabled
          >
            🦠 VIRUS
          </button>
          <button
            className={`sim-answer-btn ${
              selected === 'worm'
                ? scenario.answer === 'worm' ? 'correct' : 'wrong'
                : scenario.answer === 'worm' ? 'correct' : ''
            }`}
            disabled
          >
            🐛 WORM
          </button>
        </div>
      )}

      {/* Feedback */}
      {showFeedback && scenario && (
        <div className={`sim-feedback ${selected === 'timeout' ? 'wrong' : selected === scenario.answer ? 'correct' : 'wrong'}`}>
          {selected === 'timeout' ? (
            <>
              ⏰ {lang === 'il' ? 'NALPAS TI ORAS!' : 'TIME\'S UP!'}
              <br />
              {lang === 'il' ? `Ti umiso a sungbat ket: ${scenario.answer.toUpperCase()}` : `The correct answer was: ${scenario.answer.toUpperCase()}`}
            </>
          ) : selected === scenario.answer ? (
            <>✅ {lang === 'il' ? 'UMISO!' : 'CORRECT!'}</>
          ) : (
            <>
              ❌ {lang === 'il' ? 'BIDDUT!' : 'WRONG!'}
              <br />
              {lang === 'il' ? `Ti umiso a sungbat ket: ${scenario.answer.toUpperCase()}` : `The correct answer was: ${scenario.answer.toUpperCase()}`}
            </>
          )}
          <p className="sim-feedback-explain">{scenario.explanation}</p>
        </div>
      )}

      {/* Next / Game Over button */}
      {showFeedback && (
        <button className="sim-next-btn" onClick={nextRound}>
          {lives <= 0
            ? (lang === 'il' ? '☠️ KITAEN TI RESULTA' : '☠️ SEE RESULTS')
            : currentRound >= TOTAL_ROUNDS - 1
              ? (lang === 'il' ? '🏁 KITAEN TI RESULTA' : '🏁 SEE RESULTS')
              : (lang === 'il' ? 'SUMARUNO ▸' : 'NEXT ▸')}
        </button>
      )}

      <div className="sim-pixel-divider">
        {Array.from({ length: 24 }).map((_, i) => (
          <div key={i} className="sim-pixel-dot"></div>
        ))}
      </div>
    </div>
  );
};

export default Simulation1;
