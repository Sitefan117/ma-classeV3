<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Conju-Fighter Arcade</title>
  
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  
  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">
  <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Rajdhani:wght@600;700;800&family=JetBrains+Mono:wght@500;700;800&display=swap" rel="stylesheet">

  <style>
    :root {
      --font-arcade: 'Press Start 2P', cursive;
      --font-title: 'Rajdhani', sans-serif;
      --font-mono: 'JetBrains Mono', monospace;
    }

    body {
      font-family: var(--font-mono);
      background-color: #030712;
      color: #f3f4f6;
      user-select: none;
      touch-action: manipulation;
      margin: 0;
      padding: 0;
      min-height: 100vh;
      overflow-x: hidden;
    }

    .font-arcade { font-family: var(--font-arcade); }
    .font-title { font-family: var(--font-title); }
    .font-mono { font-family: var(--font-mono); }

    /* FOND ET EFFET CRT ARCADE */
    .arcade-bg {
      background: radial-gradient(circle at center, #0b132b 0%, #030712 100%);
      position: relative;
    }

    .crt::after {
      content: " ";
      display: block;
      position: absolute;
      top: 0; left: 0; bottom: 0; right: 0;
      background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.35) 50%);
      background-size: 100% 4px;
      z-index: 50;
      pointer-events: none;
      opacity: 0.3;
    }

    /* SYSTEME DE CARTES ARCADE GLASS */
    .arcade-card {
      background: rgba(13, 21, 39, 0.85);
      border: 2px solid #1e293b;
      border-radius: 16px;
      box-shadow: 0 0 25px rgba(0, 0, 0, 0.8), inset 0 0 15px rgba(255, 255, 255, 0.02);
      backdrop-filter: blur(8px);
    }

    /* BOUTONS ET INTERACTIONS ARCADE */
    .dark-card-btn {
      background: #0d1527;
      border: 2px solid #1e293b;
      border-radius: 12px;
      transition: all 0.15s ease;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
    }

    .dark-card-btn:hover {
      border-color: #38bdf8;
      background: #111c35;
      box-shadow: 0 0 12px rgba(56, 189, 248, 0.3);
      transform: translateY(-2px);
    }

    .dark-card-btn:active {
      transform: translateY(1px);
    }

    .dark-card-btn-selected {
      background: #0d1e38;
      border: 2px solid #38bdf8;
      box-shadow: 0 0 15px rgba(56, 189, 248, 0.4), inset 0 0 10px rgba(56, 189, 248, 0.2);
    }

    .dark-card-btn-selected-yellow {
      background: #1a180e;
      border: 2px solid #f59e0b;
      box-shadow: 0 0 15px rgba(245, 158, 11, 0.4), inset 0 0 10px rgba(245, 158, 11, 0.2);
    }

    /* NEONS & GLOWS */
    .neon-text-cyan {
      color: #38bdf8;
      text-shadow: 0 0 8px rgba(56, 189, 248, 0.6);
    }

    .neon-text-rose {
      color: #f43f5e;
      text-shadow: 0 0 8px rgba(244, 63, 94, 0.6);
    }

    .neon-text-amber {
      color: #fbbf24;
      text-shadow: 0 0 8px rgba(251, 191, 36, 0.6);
    }

    .btn-arcade-action {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      border: 2px solid #34d399;
      box-shadow: 0 0 15px rgba(16, 185, 129, 0.4);
      text-shadow: 0 2px 4px rgba(0,0,0,0.5);
    }

    .btn-arcade-action:hover {
      background: linear-gradient(135deg, #34d399 0%, #10b981 100%);
      box-shadow: 0 0 25px rgba(52, 211, 153, 0.6);
      transform: translateY(-2px);
    }

    /* ANIMATIONS DE COMBAT ORIGINELLES DU BROUILLON */
    @keyframes heroAttack {
      0% { transform: translateX(0); }
      50% { transform: translateX(120px) scale(1.1); }
      100% { transform: translateX(0); }
    }

    @keyframes enemyAttack {
      0% { transform: translateX(0); }
      50% { transform: translateX(-120px) scale(1.1); }
      100% { transform: translateX(0); }
    }

    @keyframes hurt {
      0%, 100% { filter: brightness(1); transform: scale(1); }
      25% { filter: brightness(3) sepia(1) hue-rotate(-50deg); transform: scale(0.9) rotate(-5deg); }
      75% { filter: brightness(3) sepia(1) hue-rotate(-50deg); transform: scale(1.05) rotate(5deg); }
    }

    @keyframes projectileRight {
      0% { left: 20%; opacity: 1; transform: scale(0.5); }
      100% { left: 75%; opacity: 0; transform: scale(1.5); }
    }

    @keyframes projectileLeft {
      0% { right: 20%; opacity: 1; transform: scale(0.5); }
      100% { right: 75%; opacity: 0; transform: scale(1.5); }
    }

    .animate-hero-attack { animation: heroAttack 0.4s ease-in-out; }
    .animate-enemy-attack { animation: enemyAttack 0.4s ease-in-out; }
    .animate-hurt { animation: hurt 0.4s ease-in-out; }

    .projectile-player {
      position: absolute;
      top: 40%;
      width: 40px;
      height: 40px;
      background: radial-gradient(circle, #22d3ee 0%, rgba(6,182,212,0) 70%);
      border-radius: 50%;
      box-shadow: 0 0 20px #06b6d4;
      animation: projectileRight 0.35s ease-in forwards;
      z-index: 30;
    }

    .projectile-boss {
      position: absolute;
      top: 40%;
      width: 45px;
      height: 45px;
      background: radial-gradient(circle, #f43f5e 0%, rgba(244,63,94,0) 70%);
      border-radius: 50%;
      box-shadow: 0 0 20px #f43f5e;
      animation: projectileLeft 0.35s ease-in forwards;
      z-index: 30;
    }
  </style>
</head>
<body class="arcade-bg crt min-h-screen flex flex-col items-center justify-center p-2 sm:p-4 overflow-x-hidden">

  <div id="app" class="w-full max-w-4xl min-h-[90vh] flex flex-col justify-between relative z-10"></div>

  <script>
    /* ==========================================================================
       DONNÉES & LOGIQUE DU BROUILLON (INCHANGÉES)
       ========================================================================== */
    const VERB_DATABASE = [
      { infinitif: 'chanter', group: 'A', radical: 'chant', participe: 'chanté', aux: 'avoir' },
      { infinitif: 'jouer', group: 'A', radical: 'jou', participe: 'joué', aux: 'avoir' },
      { infinitif: 'parler', group: 'A', radical: 'parl', participe: 'parlé', aux: 'avoir' },
      { infinitif: 'regarder', group: 'A', radical: 'regard', participe: 'regardé', aux: 'avoir' },
      { infinitif: 'danser', group: 'A', radical: 'dans', participe: 'dansé', aux: 'avoir' },
      { infinitif: 'écouter', group: 'A', radical: 'écout', participe: 'écouté', aux: 'avoir' },
      { infinitif: 'finir', group: 'B', radical: 'fin', participe: 'fini', aux: 'avoir' },
      { infinitif: 'choisir', group: 'B', radical: 'chois', participe: 'choisi', aux: 'avoir' },
      { infinitif: 'grandir', group: 'B', radical: 'grand', participe: 'grandis', aux: 'avoir' },
      { infinitif: 'réussir', group: 'B', radical: 'réuss', participe: 'réussi', aux: 'avoir' },
      { infinitif: 'réfléchir', group: 'B', radical: 'réfléch', participe: 'réféchi', aux: 'avoir' },
      { infinitif: 'être', group: 'C' },
      { infinitif: 'avoir', group: 'C' }
    ];

    const PRONOUNS_SHORT = ['Je', 'Tu', 'Il', 'Nous', 'Vous', 'Ils'];
    const TERMINAISONS = {
      present: { A: ['e', 'es', 'e', 'ons', 'ez', 'ent'], B: ['is', 'is', 'it', 'issons', 'issez', 'issent'] },
      imparfait: { A: ['ais', 'ais', 'ait', 'ions', 'iez', 'aient'], B: ['issais', 'issais', 'issait', 'issions', 'issiez', 'issaient'] },
      futur: { A: ['erai', 'eras', 'era', 'erons', 'erez', 'eront'], B: ['irai', 'iras', 'ira', 'irons', 'irez', 'iront'] }
    };
    const IRREGULARS = {
      être: {
        present: ['suis', 'es', 'est', 'sommes', 'êtes', 'sont'],
        imparfait: ['étais', 'étais', 'était', 'étions', 'étiez', 'étaient'],
        futur: ['serai', 'seras', 'sera', 'serons', 'serez', 'seront'],
        passe_compose: ['ai été', 'as été', 'a été', 'avons été', 'avez été', 'ont été']
      },
      avoir: {
        present: ['ai', 'as', 'a', 'avons', 'avez', 'ont'],
        imparfait: ['avais', 'avais', 'avait', 'avions', 'aviez', 'avaient'],
        futur: ['aurai', 'auras', 'aura', 'aurons', 'aurez', 'auront'],
        passe_compose: ['ai eu', 'as eu', 'a eu', 'avons eu', 'avez eu', 'ont eu']
      }
    };
    const TENSE_LABELS = { present: 'Présent', imparfait: 'Imparfait', futur: 'Futur Simple', passe_compose: 'Passé Composé' };

    // AUDIO SYNTH DU BROUILLON
    class SoundFx {
      constructor() { this.ctx = null; }
      init() { if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)(); }
      playHit() {
        this.init(); if (!this.ctx) return;
        const osc = this.ctx.createOscillator(); const gain = this.ctx.createGain();
        osc.type = 'triangle'; osc.frequency.setValueAtTime(220, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(110, this.ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.3, this.ctx.currentTime); gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
        osc.connect(gain); gain.connect(this.ctx.destination); osc.start(); osc.stop(this.ctx.currentTime + 0.15);
      }
      playError() {
        this.init(); if (!this.ctx) return;
        const osc = this.ctx.createOscillator(); const gain = this.ctx.createGain();
        osc.type = 'sawtooth'; osc.frequency.setValueAtTime(130, this.ctx.currentTime);
        osc.frequency.setValueAtTime(80, this.ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.3, this.ctx.currentTime); gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);
        osc.connect(gain); gain.connect(this.ctx.destination); osc.start(); osc.stop(this.ctx.currentTime + 0.2);
      }
    }

    const sfx = new SoundFx();

    // ÉTATS DE LA PAGE & DU JEU
    let screen = 'menu'; // 'menu', 'game', 'end'
    let configLevel = 'A';
    let configTenses = ['present'];
    let tenseError = false;

    let gameState = {
      playerHp: 10,
      enemyHp: 10,
      timer: 8,
      timerInterval: null,
      score: 0,
      totalQuestions: 0,
      correctQuestions: 0,
      currentQuestion: null,
      isAnimating: false
    };

    let heroAnimating = '';
    let enemyAnimating = '';
    let activeProjectile = null;
    let feedbackText = '-';
    let feedbackClass = 'opacity-0';

    function generateQuestion() {
      let eligibleVerbs = configLevel === 'BOSS' ? VERB_DATABASE : VERB_DATABASE.filter(v => v.group === configLevel);
      const verb = eligibleVerbs[Math.floor(Math.random() * eligibleVerbs.length)];
      const tense = configTenses[Math.floor(Math.random() * configTenses.length)];
      const pIndex = Math.floor(Math.random() * 6);
      const pronoun = PRONOUNS_SHORT[pIndex];
      const qType = Math.random() > 0.5 ? 'ending' : 'pronoun';
      let correctAnswer = '';
      let options = [];
      let sentence = '';

      if (verb.group === 'C') {
        const fullForm = IRREGULARS[verb.infinitif][tense][pIndex];
        if (qType === 'ending') {
          correctAnswer = fullForm;
          sentence = `${pronoun} <span class="text-cyan-400 font-bold border-b-4 border-cyan-400 pb-1">_______</span>`;
          const allForms = IRREGULARS[verb.infinitif][tense];
          options = Array.from(new Set([correctAnswer, ...allForms])).sort(() => Math.random() - 0.5).slice(0, 4);
        } else {
          correctAnswer = pronoun;
          sentence = `<span class="text-cyan-400 font-bold border-b-4 border-cyan-400 pb-1">_______</span> ${fullForm}`;
          options = PRONOUNS_SHORT.filter(p => p !== correctAnswer).sort(() => Math.random() - 0.5).slice(0, 3);
          options.push(correctAnswer);
        }
      } else {
        if (tense === 'passe_compose') {
          const form = `${IRREGULARS.avoir.present[pIndex]} ${verb.participe}`;
          if (qType === 'ending') {
            correctAnswer = form;
            sentence = `${pronoun} <span class="text-cyan-400 font-bold border-b-4 border-cyan-400 pb-1">_______</span>`;
            const fake1 = `${IRREGULARS.avoir.present[(pIndex + 1) % 6]} ${verb.participe}`;
            const fake2 = `${verb.radical}${TERMINAISONS.present[verb.group][pIndex]}`;
            options = Array.from(new Set([correctAnswer, fake1, fake2, `${verb.radical}é`])).slice(0, 4);
          } else {
            correctAnswer = pronoun;
            sentence = `<span class="text-cyan-400 font-bold border-b-4 border-cyan-400 pb-1">_______</span> ${form}`;
            options = PRONOUNS_SHORT.filter(p => p !== correctAnswer).sort(() => Math.random() - 0.5).slice(0, 3);
            options.push(correctAnswer);
          }
        } else {
          const term = TERMINAISONS[tense][verb.group][pIndex];
          const correctForm = `${verb.radical}${term}`;
          if (qType === 'ending') {
            correctAnswer = term;
            sentence = `${pronoun} ${verb.radical}<span class="text-cyan-400 font-bold border-b-4 border-cyan-400 pb-1">____</span>`;
            const allTerms = TERMINAISONS[tense][verb.group];
            options = Array.from(new Set([correctAnswer, ...allTerms])).sort(() => Math.random() - 0.5).slice(0, 4);
          } else {
            correctAnswer = pronoun;
            sentence = `<span class="text-cyan-400 font-bold border-b-4 border-cyan-400 pb-1">_______</span> ${correctForm}`;
            options = PRONOUNS_SHORT.filter(p => p !== correctAnswer).sort(() => Math.random() - 0.5).slice(0, 3);
            options.push(correctAnswer);
          }
        }
      }
      options.sort(() => Math.random() - 0.5);
      return { promptText: `${TENSE_LABELS[tense]} • (${verb.infinitif})`, sentence, options, correctIndex: options.indexOf(correctAnswer) };
    }

    function startGame() {
      gameState.playerHp = 10;
      gameState.enemyHp = 10;
      gameState.score = 0;
      gameState.totalQuestions = 0;
      gameState.correctQuestions = 0;
      gameState.isAnimating = false;
      screen = 'game';
      nextTurn();
    }

    function startTimer() {
      clearInterval(gameState.timerInterval);
      gameState.timer = 8;
      render();
      gameState.timerInterval = setInterval(() => {
        gameState.timer--;
        if (gameState.timer <= 0) {
          clearInterval(gameState.timerInterval);
          handleAnswer(-1);
        } else {
          render();
        }
      }, 1000);
    }

    function nextTurn() {
      if (gameState.playerHp <= 0 || gameState.enemyHp <= 0) {
        endGame();
        return;
      }
      gameState.currentQuestion = generateQuestion();
      startTimer();
      render();
    }

    function handleAnswer(selectedIndex) {
      if (gameState.isAnimating) return;
      gameState.isAnimating = true;
      clearInterval(gameState.timerInterval);
      gameState.totalQuestions++;
      const isCorrect = selectedIndex === gameState.currentQuestion.correctIndex;

      if (isCorrect) {
        gameState.correctQuestions++;
        gameState.enemyHp = Math.max(0, gameState.enemyHp - 1);
        gameState.score += 100;
        sfx.playHit();

        heroAnimating = 'animate-hero-attack';
        activeProjectile = 'player';
        render();

        setTimeout(() => {
          activeProjectile = null;
          enemyAnimating = 'animate-hurt';
          showFeedback('⚔️ ATTAQUE REUSSIE ! (-1 HP)', 'text-cyan-400 neon-text-cyan');
          render();
        }, 200);

        setTimeout(() => {
          heroAnimating = '';
          enemyAnimating = '';
          render();
        }, 500);
      } else {
        gameState.playerHp = Math.max(0, gameState.playerHp - 1);
        sfx.playError();

        enemyAnimating = 'animate-enemy-attack';
        activeProjectile = 'boss';
        render();

        setTimeout(() => {
          activeProjectile = null;
          heroAnimating = 'animate-hurt';
          showFeedback('💥 LE MONSTRE RIPOSTE ! (-1 HP)', 'text-rose-500 neon-text-rose');
          render();
        }, 200);

        setTimeout(() => {
          enemyAnimating = '';
          heroAnimating = '';
          render();
        }, 500);
      }

      setTimeout(() => {
        gameState.isAnimating = false;
        nextTurn();
      }, 900);
    }

    function showFeedback(text, colorClass) {
      feedbackText = text;
      feedbackClass = `${colorClass} opacity-100`;
      render();
      setTimeout(() => {
        feedbackClass = 'opacity-0';
        render();
      }, 700);
    }

    function endGame() {
      clearInterval(gameState.timerInterval);
      screen = 'end';
      render();
    }

    function handleFormSubmit(e) {
      e.preventDefault();
      if (configTenses.length === 0) {
        tenseError = true;
        render();
        return;
      }
      tenseError = false;
      sfx.init();
      startGame();
    }

    function toggleTense(val) {
      if (configTenses.includes(val)) {
        configTenses = configTenses.filter(t => t !== val);
      } else {
        configTenses = [...configTenses, val];
      }
      render();
    }

    // GESTION DU CLAVIER (1, 2, 3, 4) DU BROUILLON
    window.addEventListener('keydown', (e) => {
      if (screen !== 'game') return;
      if (['1', '2', '3', '4'].includes(e.key)) {
        const idx = parseInt(e.key) - 1;
        if (gameState.currentQuestion && gameState.currentQuestion.options[idx] !== undefined) {
          handleAnswer(idx);
        }
      }
    });

    /* ==========================================================================
       RENDU DU COMPOSANT SVELTE HABILLES AU DESIGN CONJU-FIGHTER ARCADE
       ========================================================================== */
    function render() {
      const app = document.getElementById('app');
      if (!app) return;

      if (screen === 'menu') {
        app.innerHTML = `
          <div class="arcade-card p-6 sm:p-10 my-auto flex flex-col items-center w-full max-w-3xl mx-auto">
            <div class="text-center mb-8">
              <span class="inline-block text-xs font-arcade text-cyan-400 tracking-widest uppercase mb-3 neon-text-cyan">
                ⚡ ARCADE LEARNING SYSTEM ⚡
              </span>
              <h1 class="text-4xl sm:text-6xl font-extrabold font-title tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-rose-400 to-rose-500 uppercase drop-shadow">
                CONJU-FIGHTER
              </h1>
              <p class="text-slate-400 text-sm mt-2 font-mono">Réponds à 10 verbes pour terrasser l'adversaire !</p>
            </div>

            <form id="menu-form" class="w-full max-w-2xl space-y-8">
              <!-- SELECTION NIVEAU -->
              <div class="space-y-3">
                <label class="block text-xs font-arcade text-amber-400 uppercase tracking-wider neon-text-amber">1. CHOISIS TON NIVEAU</label>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  ${[
                    { id: 'A', title: 'Niveau A', desc: '1er Groupe (-er)' },
                    { id: 'B', title: 'Niveau B', desc: '2ème Groupe (-ir)' },
                    { id: 'C', title: 'Niveau C', desc: 'Être & Avoir' },
                    { id: 'BOSS', title: 'BOSS', desc: 'Mélange A + B + C', isBoss: true }
                  ].map(lvl => `
                    <button
                      type="button"
                      data-level="${lvl.id}"
                      class="p-4 text-center dark-card-btn cursor-pointer flex flex-col justify-center items-center transition-all ${configLevel === lvl.id ? 'dark-card-btn-selected' : ''}"
                    >
                      <div class="font-bold text-base font-mono ${lvl.isBoss ? 'text-rose-500 neon-text-rose' : 'text-slate-100'}">${lvl.title}</div>
                      <div class="text-[10px] text-slate-400 mt-1 font-mono">${lvl.desc}</div>
                    </button>
                  `).join('')}
                </div>
              </div>

              <!-- SELECTION TEMPS -->
              <div class="space-y-3">
                <label class="block text-xs font-arcade text-amber-400 uppercase tracking-wider neon-text-amber">2. CHOISIS LES TEMPS</label>
                <div class="grid grid-cols-2 gap-3">
                  ${[
                    { id: 'present', label: 'Présent' },
                    { id: 'futur', label: 'Futur Simple' },
                    { id: 'imparfait', label: 'Imparfait' },
                    { id: 'passe_compose', label: 'Passé Composé' }
                  ].map(t => {
                    const isChecked = configTenses.includes(t.id);
                    return `
                      <button
                        type="button"
                        data-tense="${t.id}"
                        class="p-4 rounded-xl text-left dark-card-btn cursor-pointer transition-all flex items-center justify-between ${isChecked ? 'dark-card-btn-selected-yellow' : ''}"
                      >
                        <span class="font-bold text-sm font-mono ${isChecked ? 'text-amber-400 neon-text-amber' : 'text-slate-300'}">${t.label}</span>
                        <span class="text-xs ${isChecked ? 'text-amber-400' : 'text-slate-600'}">${isChecked ? '✓' : ''}</span>
                      </button>
                    `;
                  }).join('')}
                </div>
                ${tenseError ? `<p class="text-rose-500 text-xs font-mono font-bold mt-1 neon-text-rose">Veuillez sélectionner au moins un temps !</p>` : ''}
              </div>

              <!-- BOUTON START -->
              <button
                type="submit"
                class="w-full py-4 mt-6 btn-arcade-action text-slate-950 font-arcade text-xs sm:text-sm rounded-xl font-bold tracking-wider transition-all shadow-lg active:scale-98"
              >
                COMBATTRE (10 VICTOIRES) ➔
              </button>
            </form>
          </div>
        `;

        // Attach Form & Button listeners
        document.getElementById('menu-form').addEventListener('submit', handleFormSubmit);
        document.querySelectorAll('[data-level]').forEach(btn => {
          btn.addEventListener('click', () => {
            configLevel = btn.getAttribute('data-level');
            render();
          });
        });
        document.querySelectorAll('[data-tense]').forEach(btn => {
          btn.addEventListener('click', () => {
            toggleTense(btn.getAttribute('data-tense'));
          });
        });

      } else if (screen === 'game') {
        app.innerHTML = `
          <div class="flex flex-col justify-between min-h-[88vh] py-2 gap-4">
            
            <!-- HUD / BARRES DE VIE EN STYLE ARCADE -->
            <header class="w-full arcade-card p-4 flex justify-between items-center gap-4">
              <!-- JOUEUR -->
              <div class="flex-1">
                <div class="flex justify-between items-center mb-1">
                  <span class="font-title font-extrabold text-cyan-400 neon-text-cyan tracking-wider text-base flex items-center gap-2">
                    🛡️ CHEVALIER
                  </span>
                  <span class="text-xs font-mono font-bold text-cyan-300">${gameState.playerHp} / 10 HP</span>
                </div>
                <div class="w-full bg-slate-950 h-3 rounded-full border border-slate-800 p-0.5 shadow-inner">
                  <div class="bg-gradient-to-r from-cyan-500 to-cyan-300 h-full rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(56,189,248,0.5)]" style="width: ${(gameState.playerHp / 10) * 100}%"></div>
                </div>
              </div>

              <!-- CHRONO -->
              <div class="text-center px-4 flex flex-col items-center">
                <div class="font-arcade text-2xl text-amber-400 neon-text-amber drop-shadow">
                  0${gameState.timer}
                </div>
                <div class="text-[9px] font-mono text-slate-400 tracking-widest uppercase">TEMPS</div>
              </div>

              <!-- ADVERSAIRE -->
              <div class="flex-1">
                <div class="flex justify-between items-center mb-1">
                  <span class="text-xs font-mono font-bold text-rose-300">${gameState.enemyHp} / 10 HP</span>
                  <span class="font-title font-extrabold text-rose-500 neon-text-rose tracking-wider text-base flex items-center gap-2">
                    MONSTRE 🐉
                  </span>
                </div>
                <div class="w-full bg-slate-950 h-3 rounded-full border border-slate-800 p-0.5 shadow-inner">
                  <div class="bg-gradient-to-r from-rose-500 to-rose-400 h-full rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(244,63,94,0.5)]" style="width: ${(gameState.enemyHp / 10) * 100}%"></div>
                </div>
              </div>
            </header>

            <!-- ZONE DE COMBAT ARCADE -->
            <main class="relative w-full arcade-card flex-1 min-h-[220px] sm:min-h-[280px] flex items-center justify-between px-6 sm:px-16 overflow-hidden">
              <!-- HERO -->
              <div class="relative z-20 transition-all duration-200 ${heroAnimating}">
                <div class="text-6xl sm:text-8xl filter drop-shadow-[0_0_15px_rgba(56,189,248,0.4)]">
                  🧙‍♂️
                </div>
              </div>

              <!-- PROJECTILES DU BROUILLON -->
              ${activeProjectile === 'player' ? `<div class="projectile-player"></div>` : ''}
              ${activeProjectile === 'boss' ? `<div class="projectile-boss"></div>` : ''}

              <!-- FEEDBACK TEXT -->
              <div class="absolute inset-x-0 top-6 text-center pointer-events-none z-30 transition-all duration-300 font-arcade text-xs sm:text-sm ${feedbackClass}">
                ${feedbackText}
              </div>

              <!-- ADVERSAIRE -->
              <div class="relative z-20 transition-all duration-200 ${enemyAnimating}">
                <div class="text-6xl sm:text-8xl filter drop-shadow-[0_0_15px_rgba(244,63,94,0.4)]">
                  👹
                </div>
              </div>
            </main>

            <!-- ZONE DE QUESTION & RÉPONSES -->
            <footer class="w-full arcade-card p-4 sm:p-6 space-y-4">
              <!-- PROMPT & PHRASE -->
              <div class="text-center space-y-1">
                <div class="text-xs font-arcade text-amber-400 neon-text-amber uppercase tracking-wider">
                  ${gameState.currentQuestion ? gameState.currentQuestion.promptText : ''}
                </div>
                <div class="text-xl sm:text-3xl font-mono text-slate-100 font-bold tracking-wide">
                  ${gameState.currentQuestion ? gameState.currentQuestion.sentence : ''}
                </div>
              </div>

              <!-- BOUTONS DE RÉPONSES -->
              <div class="grid grid-cols-2 gap-3 pt-2">
                ${gameState.currentQuestion ? gameState.currentQuestion.options.map((opt, idx) => `
                  <button
                    type="button"
                    data-answer="${idx}"
                    class="py-3 px-4 dark-card-btn font-mono text-base sm:text-lg font-bold text-slate-100 hover:text-cyan-400 transition-all flex items-center justify-between cursor-pointer"
                  >
                    <span>${opt}</span>
                    <span class="text-xs text-slate-500 font-arcade">[${idx + 1}]</span>
                  </button>
                `).join('') : ''}
              </div>
            </footer>

          </div>
        `;

        // Attach Answer listeners
        document.querySelectorAll('[data-answer]').forEach(btn => {
          btn.addEventListener('click', () => {
            const idx = parseInt(btn.getAttribute('data-answer'));
            handleAnswer(idx);
          });
        });

      } else if (screen === 'end') {
        const isWin = gameState.playerHp > 0;
        app.innerHTML = `
          <div class="arcade-card p-8 sm:p-12 my-auto flex flex-col items-center text-center w-full max-w-xl mx-auto space-y-6">
            <div class="text-6xl sm:text-7xl">
              ${isWin ? '🏆' : '💀'}
            </div>

            <div class="space-y-2">
              <h2 class="text-3xl sm:text-5xl font-extrabold font-title tracking-wider ${isWin ? 'text-cyan-400 neon-text-cyan' : 'text-rose-500 neon-text-rose'} uppercase">
                ${isWin ? 'VICTOIRE !' : 'DÉFAITE...'}
              </h2>
              <p class="text-slate-400 font-mono text-sm">
                ${isWin ? 'Tu as triomphé du monstre avec brio !' : 'Le monstre a pris le dessus. Entraîne-toi encore !'}
              </p>
            </div>

            <!-- STATISTIQUES DU BROUILLON -->
            <div class="w-full dark-card-btn p-4 rounded-xl space-y-2 font-mono text-sm text-left">
              <div class="flex justify-between">
                <span class="text-slate-400">Score total :</span>
                <span class="text-amber-400 font-bold">${gameState.score} PTS</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">Questions répondees :</span>
                <span class="text-slate-200 font-bold">${gameState.totalQuestions}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">Bonnes réponses :</span>
                <span class="text-emerald-400 font-bold">${gameState.correctQuestions}</span>
              </div>
            </div>

            <!-- REJOUER -->
            <button
              id="restart-btn"
              type="button"
              class="w-full py-4 btn-arcade-action text-slate-950 font-arcade text-xs sm:text-sm rounded-xl font-bold tracking-wider transition-all shadow-lg active:scale-98 cursor-pointer"
            >
              REJOUER ↻
            </button>
          </div>
        `;

        document.getElementById('restart-btn').addEventListener('click', () => {
          screen = 'menu';
          render();
        });
      }
    }

    // Premier rendu au chargement
    render();
  </script>
</body>
</html>