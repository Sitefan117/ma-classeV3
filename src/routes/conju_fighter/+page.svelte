<!DOCTYPE html>
<html lang="fr" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Conju-Fighter Arcade</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Rajdhani:wght@600;700;800&family=JetBrains+Mono:wght@500;700;800&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'JetBrains Mono', monospace;
      background-color: #030712;
      color: #f3f4f6;
      user-select: none;
      touch-action: manipulation;
    }
    .font-arcade { font-family: 'Press Start 2P', cursive; }
    .font-title { font-family: 'Rajdhani', sans-serif; }
    .arcade-card {
      background: rgba(15, 23, 42, 0.85);
      border: 2px solid #334155;
      box-shadow: 0 0 25px rgba(0, 0, 0, 0.6), inset 0 0 15px rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(12px);
    }
    .neon-border-cyan { box-shadow: 0 0 15px rgba(6, 182, 212, 0.4), inset 0 0 10px rgba(6, 182, 212, 0.2); }
    .neon-border-amber { box-shadow: 0 0 20px rgba(245, 158, 11, 0.5), inset 0 0 10px rgba(245, 158, 11, 0.3); }
    
    /* CRT overlay effect */
    .crt::after {
      content: " ";
      display: block;
      position: absolute;
      top: 0; left: 0; bottom: 0; right: 0;
      background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%);
      background-size: 100% 4px;
      z-index: 50;
      pointer-events: none;
      opacity: 0.3;
    }

    /* ANIMATIONS DE COMBAT */
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
    }
  </style>
</head>
<body class="min-h-screen crt flex flex-col items-center justify-center p-2 sm:p-4 overflow-x-hidden">

  <div id="app" class="w-full max-w-4xl min-h-[90vh] flex flex-col justify-between relative z-10">
    
    <!-- 1. MENU PRINCIPAL -->
    <div id="menu-screen" class="arcade-card rounded-2xl p-6 sm:p-10 my-auto flex flex-col items-center border-2 border-cyan-500/30 neon-border-cyan">
      <div class="text-center mb-8">
        <span class="inline-block text-xs font-arcade text-cyan-400 tracking-widest uppercase mb-2 animate-pulse">
          ⚡ ARCADE LEARNING SYSTEM ⚡
        </span>
        <h1 class="text-4xl sm:text-6xl font-extrabold font-title tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-amber-300 to-rose-500 uppercase drop-shadow">
          CONJU-FIGHTER
        </h1>
        <p class="text-slate-400 text-sm mt-2 font-medium">Réponds à 10 verbes pour terrasser l'adversaire !</p>
      </div>

      <form id="config-form" class="w-full max-w-xl space-y-6">
        <div class="space-y-3">
          <label class="block text-xs font-arcade text-amber-400 uppercase tracking-wider">1. Choisis ton Niveau</label>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <label class="cursor-pointer">
              <input type="radio" name="level" value="A" class="peer hidden" checked>
              <div class="p-3 text-center rounded-xl border-2 border-slate-700 bg-slate-900/60 peer-checked:border-cyan-400 peer-checked:bg-cyan-950/40 peer-checked:text-cyan-300 transition-all">
                <div class="font-bold text-lg">Niveau A</div>
                <div class="text-[10px] text-slate-400 mt-1">1er Groupe (-er)</div>
              </div>
            </label>
            <label class="cursor-pointer">
              <input type="radio" name="level" value="B" class="peer hidden">
              <div class="p-3 text-center rounded-xl border-2 border-slate-700 bg-slate-900/60 peer-checked:border-cyan-400 peer-checked:bg-cyan-950/40 peer-checked:text-cyan-300 transition-all">
                <div class="font-bold text-lg">Niveau B</div>
                <div class="text-[10px] text-slate-400 mt-1">2ème Groupe (-ir)</div>
              </div>
            </label>
            <label class="cursor-pointer">
              <input type="radio" name="level" value="C" class="peer hidden">
              <div class="p-3 text-center rounded-xl border-2 border-slate-700 bg-slate-900/60 peer-checked:border-cyan-400 peer-checked:bg-cyan-950/40 peer-checked:text-cyan-300 transition-all">
                <div class="font-bold text-lg">Niveau C</div>
                <div class="text-[10px] text-slate-400 mt-1">Être & Avoir</div>
              </div>
            </label>
            <label class="cursor-pointer">
              <input type="radio" name="level" value="BOSS" class="peer hidden">
              <div class="p-3 text-center rounded-xl border-2 border-slate-700 bg-slate-900/60 peer-checked:border-rose-500 peer-checked:bg-rose-950/40 peer-checked:text-rose-400 transition-all">
                <div class="font-bold text-lg text-rose-500">BOSS</div>
                <div class="text-[10px] text-slate-400 mt-1">Mélange A + B + C</div>
              </div>
            </label>
          </div>
        </div>

        <div class="space-y-3">
          <label class="block text-xs font-arcade text-amber-400 uppercase tracking-wider">2. Choisis les temps</label>
          <div class="grid grid-cols-2 gap-3">
            <label class="cursor-pointer">
              <input type="checkbox" name="tense" value="present" class="peer hidden" checked>
              <div class="p-3 rounded-xl border-2 border-slate-700 bg-slate-900/60 peer-checked:border-amber-400 peer-checked:bg-amber-950/30 peer-checked:text-amber-300 flex items-center justify-between">
                <span class="font-semibold text-sm">Présent</span>
              </div>
            </label>
            <label class="cursor-pointer">
              <input type="checkbox" name="tense" value="futur" class="peer hidden">
              <div class="p-3 rounded-xl border-2 border-slate-700 bg-slate-900/60 peer-checked:border-amber-400 peer-checked:bg-amber-950/30 peer-checked:text-amber-300 flex items-center justify-between">
                <span class="font-semibold text-sm">Futur Simple</span>
              </div>
            </label>
            <label class="cursor-pointer">
              <input type="checkbox" name="tense" value="imparfait" class="peer hidden">
              <div class="p-3 rounded-xl border-2 border-slate-700 bg-slate-900/60 peer-checked:border-amber-400 peer-checked:bg-amber-950/30 peer-checked:text-amber-300 flex items-center justify-between">
                <span class="font-semibold text-sm">Imparfait</span>
              </div>
            </label>
            <label class="cursor-pointer">
              <input type="checkbox" name="tense" value="passe_compose" class="peer hidden">
              <div class="p-3 rounded-xl border-2 border-slate-700 bg-slate-900/60 peer-checked:border-amber-400 peer-checked:bg-amber-950/30 peer-checked:text-amber-300 flex items-center justify-between">
                <span class="font-semibold text-sm">Passé Composé</span>
              </div>
            </label>
          </div>
          <p id="tense-error" class="text-rose-500 text-xs hidden">Veuillez sélectionner au moins un temps !</p>
        </div>

        <button type="submit" class="w-full py-4 mt-4 bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-arcade text-sm rounded-xl shadow-lg font-black tracking-widest transition-all">
          COMBATTRE (10 VICTOIRES) ➔
        </button>
      </form>
    </div>

    <!-- 2. ECRAN DE COMBAT -->
    <div id="game-screen" class="hidden flex-col justify-between min-h-[88vh] py-2">
      
      <!-- HUD / BARRES DE VIE -->
      <header class="w-full arcade-card rounded-2xl p-4 flex justify-between items-center gap-4 border-slate-800">
        <!-- JOUEUR -->
        <div class="flex-1">
          <div class="flex justify-between items-center mb-1">
            <span class="font-title font-extrabold text-cyan-400 tracking-wider text-base flex items-center gap-2">
              🛡️ CHEVALIER
            </span>
            <span id="player-hp-text" class="text-xs font-mono font-bold text-cyan-300">10 / 10 HP</span>
          </div>
          <div class="w-full bg-slate-900 h-4 rounded-full border border-slate-700/80 p-0.5">
            <div id="player-hp-bar" class="bg-gradient-to-r from-cyan-500 to-teal-300 h-full rounded-full transition-all duration-300" style="width: 100%"></div>
          </div>
        </div>

        <!-- CHRONO -->
        <div class="text-center px-2 flex flex-col items-center">
          <div id="timer-display" class="font-arcade text-2xl text-amber-400 drop-shadow">08</div>
          <div class="text-[9px] tracking-widest text-slate-500 font-bold uppercase">TEMPS</div>
        </div>

        <!-- ADVERSAIRE -->
        <div class="flex-1 text-right">
          <div class="flex justify-between items-center mb-1">
            <span id="enemy-hp-text" class="text-xs font-mono font-bold text-rose-400">10 / 10 HP</span>
            <span id="enemy-name" class="font-title font-extrabold text-rose-500 tracking-wider text-base flex items-center gap-2">
              MONSTRE <span class="text-xl">👾</span>
            </span>
          </div>
          <div class="w-full bg-slate-900 h-4 rounded-full border border-slate-700/80 p-0.5">
            <div id="enemy-hp-bar" class="bg-gradient-to-r from-rose-600 to-rose-400 h-full rounded-full transition-all duration-300 float-right" style="width: 100%"></div>
          </div>
        </div>
      </header>

      <!-- SCENE DE COMBAT VISUELLE -->
      <main id="arena" class="my-auto py-4 flex flex-col items-center relative rounded-2xl bg-slate-950/60 border border-slate-800/80 p-4 min-h-[260px] justify-between">
        
        <!-- PROJECTILE ANIMATION -->
        <div id="projectile" class="hidden"></div>

        <!-- PERSONNAGES EN SCÈNE -->
        <div class="w-full flex justify-between items-end px-8 sm:px-16 my-auto relative">
          
          <!-- SPRITE HÉROS -->
          <div id="hero-sprite" class="flex flex-col items-center transition-transform duration-100">
            <svg class="w-24 h-24 sm:w-28 sm:h-28 drop-shadow-[0_0_12px_rgba(6,182,212,0.5)]" viewBox="0 0 64 64" fill="none">
              <!-- Corps/Armure -->
              <rect x="24" y="28" width="16" height="20" rx="2" fill="#0284c7"/>
              <rect x="26" y="32" width="12" height="12" fill="#e0f2fe"/>
              <!-- Tête / Casque -->
              <rect x="22" y="12" width="20" height="16" rx="4" fill="#0369a1"/>
              <rect x="26" y="18" width="12" height="4" fill="#38bdf8"/>
              <!-- Épée -->
              <rect x="42" y="14" width="4" height="26" fill="#cbd5e1"/>
              <rect x="40" y="36" width="8" height="4" fill="#f59e0b"/>
              <!-- Jambes -->
              <rect x="26" y="48" width="5" height="10" fill="#0f172a"/>
              <rect x="33" y="48" width="5" height="10" fill="#0f172a"/>
            </svg>
            <span class="text-[10px] font-arcade text-cyan-400 mt-1">HERO</span>
          </div>

          <!-- SPRITE MONSTRE / BOSS -->
          <div id="enemy-sprite" class="flex flex-col items-center transition-transform duration-100">
            <svg class="w-24 h-24 sm:w-28 sm:h-28 drop-shadow-[0_0_12px_rgba(244,63,94,0.5)]" viewBox="0 0 64 64" fill="none">
              <!-- Corps Monstre -->
              <rect x="18" y="20" width="28" height="26" rx="6" fill="#be123c"/>
              <circle cx="26" cy="30" r="4" fill="#fff"/>
              <circle cx="38" cy="30" r="4" fill="#fff"/>
              <circle cx="26" cy="30" r="2" fill="#000"/>
              <circle cx="38" cy="30" r="2" fill="#000"/>
              <!-- Dents -->
              <path d="M26 40 L28 36 L30 40 L32 36 L34 40 L36 36 L38 40" stroke="#fff" stroke-width="2"/>
              <!-- Cornes -->
              <path d="M20 20 L14 10 L24 16 Z" fill="#f43f5e"/>
              <path d="M44 20 L50 10 L40 16 Z" fill="#f43f5e"/>
              <!-- Jambes -->
              <rect x="22" y="46" width="6" height="12" fill="#881337"/>
              <rect x="36" y="46" width="6" height="12" fill="#881337"/>
            </svg>
            <span id="enemy-sprite-label" class="text-[10px] font-arcade text-rose-400 mt-1">BOSS</span>
          </div>

        </div>

        <!-- ZONE DE CONJUGAISON -->
        <div class="w-full max-w-xl bg-slate-900/90 border border-slate-700/80 rounded-xl p-4 text-center mt-2 shadow-xl">
          <div class="mb-1">
            <span id="prompt-tag" class="px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-xs font-mono text-amber-300">
              Présent • Verb (chanter)
            </span>
          </div>
          <p id="target-sentence" class="text-2xl sm:text-4xl font-extrabold text-white tracking-wide font-mono my-2">
            Nous <span class="text-cyan-400 underline decoration-cyan-500/50 underline-offset-8">chant____</span>
          </p>
          <div id="feedback-text" class="h-5 text-xs font-title font-bold tracking-wider text-amber-400 opacity-0 transition-all">
            -
          </div>
        </div>

      </main>

      <!-- OPTIONS QCM -->
      <footer class="w-full mt-2">
        <div id="options-grid" class="grid grid-cols-2 gap-3">
          <!-- Injecté par JS -->
        </div>
      </footer>

    </div>

    <!-- 3. ECRAN DE FIN -->
    <div id="end-screen" class="hidden arcade-card rounded-2xl p-8 sm:p-12 my-auto flex-col items-center text-center border-2 border-amber-500/30 neon-border-amber">
      <div id="end-icon" class="text-6xl mb-4 animate-bounce">🏆</div>
      <h2 id="end-title" class="text-4xl sm:text-5xl font-extrabold font-title tracking-wider text-amber-400 uppercase mb-2">
        VICTOIRE ARCADE !
      </h2>
      <p id="end-subtitle" class="text-slate-300 font-medium text-base mb-6">Tu as réussi à vaincre l'adversaire en 10 verbes !</p>

      <div class="w-full max-w-md bg-slate-900/80 border border-slate-800 rounded-xl p-5 mb-8 space-y-3 font-mono text-sm">
        <div class="flex justify-between border-b border-slate-800 pb-2">
          <span class="text-slate-400">Score Final:</span>
          <span id="final-score" class="font-bold text-amber-300">1000 pts</span>
        </div>
        <div class="flex justify-between">
          <span class="text-slate-400">Précision:</span>
          <span id="final-accuracy" class="font-bold text-emerald-400">100%</span>
        </div>
      </div>

      <button id="restart-btn" class="py-4 px-8 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-arcade text-xs rounded-xl font-black tracking-widest transition-all transform hover:scale-105 active:scale-95 shadow-xl">
        REJOINGNER LA PARTIE 🔄
      </button>
    </div>

  </div>

  <script>
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
      { infinitif: 'réfléchir', group: 'B', radical: 'réfléch', participe: 'réfléchi', aux: 'avoir' },
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

    // AUDIO SYNTH
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

    let config = { level: 'A', tenses: ['present'] };
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

    const menuScreen = document.getElementById('menu-screen');
    const gameScreen = document.getElementById('game-screen');
    const endScreen = document.getElementById('end-screen');
    const configForm = document.getElementById('config-form');
    const tenseError = document.getElementById('tense-error');

    const playerHpBar = document.getElementById('player-hp-bar');
    const playerHpText = document.getElementById('player-hp-text');
    const enemyHpBar = document.getElementById('enemy-hp-bar');
    const enemyHpText = document.getElementById('enemy-hp-text');
    const enemyName = document.getElementById('enemy-name');
    const timerDisplay = document.getElementById('timer-display');

    const heroSprite = document.getElementById('hero-sprite');
    const enemySprite = document.getElementById('enemy-sprite');
    const projectile = document.getElementById('projectile');

    const promptTag = document.getElementById('prompt-tag');
    const targetSentence = document.getElementById('target-sentence');
    const feedbackText = document.getElementById('feedback-text');
    const optionsGrid = document.getElementById('options-grid');

    function generateQuestion() {
      let eligibleVerbs = config.level === 'BOSS' ? VERB_DATABASE : VERB_DATABASE.filter(v => v.group === config.level);
      const verb = eligibleVerbs[Math.floor(Math.random() * eligibleVerbs.length)];
      const tense = config.tenses[Math.floor(Math.random() * config.tenses.length)];
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
          sentence = `${pronoun} <span class="text-cyan-400 underline decoration-cyan-500/50 underline-offset-8">_______</span>`;
          const allForms = IRREGULARS[verb.infinitif][tense];
          options = Array.from(new Set([correctAnswer, ...allForms])).sort(() => Math.random() - 0.5).slice(0, 4);
        } else {
          correctAnswer = pronoun;
          sentence = `<span class="text-cyan-400 underline decoration-cyan-500/50 underline-offset-8">_______</span> ${fullForm}`;
          options = PRONOUNS_SHORT.filter(p => p !== correctAnswer).sort(() => Math.random() - 0.5).slice(0, 3);
          options.push(correctAnswer);
        }
      } else {
        if (tense === 'passe_compose') {
          const form = `${IRREGULARS.avoir.present[pIndex]} ${verb.participe}`;
          if (qType === 'ending') {
            correctAnswer = form;
            sentence = `${pronoun} <span class="text-cyan-400 underline decoration-cyan-500/50 underline-offset-8">_______</span>`;
            const fake1 = `${IRREGULARS.avoir.present[(pIndex + 1) % 6]} ${verb.participe}`;
            const fake2 = `${verb.radical}${TERMINAISONS.present[verb.group][pIndex]}`;
            options = Array.from(new Set([correctAnswer, fake1, fake2, `${verb.radical}é`])).slice(0, 4);
          } else {
            correctAnswer = pronoun;
            sentence = `<span class="text-cyan-400 underline decoration-cyan-500/50 underline-offset-8">_______</span> ${form}`;
            options = PRONOUNS_SHORT.filter(p => p !== correctAnswer).sort(() => Math.random() - 0.5).slice(0, 3);
            options.push(correctAnswer);
          }
        } else {
          const term = TERMINAISONS[tense][verb.group][pIndex];
          const correctForm = `${verb.radical}${term}`;
          if (qType === 'ending') {
            correctAnswer = term;
            sentence = `${pronoun} ${verb.radical}<span class="text-cyan-400 underline decoration-cyan-500/50 underline-offset-8">____</span>`;
            const allTerms = TERMINAISONS[tense][verb.group];
            options = Array.from(new Set([correctAnswer, ...allTerms])).sort(() => Math.random() - 0.5).slice(0, 4);
          } else {
            correctAnswer = pronoun;
            sentence = `<span class="text-cyan-400 underline decoration-cyan-500/50 underline-offset-8">_______</span> ${correctForm}`;
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
      gameState.enemyHp = 10; // 10 réponses réussies pour gagner !
      gameState.score = 0;
      gameState.totalQuestions = 0;
      gameState.correctQuestions = 0;
      gameState.isAnimating = false;

      menuScreen.classList.add('hidden');
      endScreen.classList.add('hidden');
      gameScreen.classList.remove('hidden');
      gameScreen.classList.add('flex');

      updateHUD();
      nextTurn();
    }

    function updateHUD() {
      playerHpBar.style.width = `${(gameState.playerHp / 10) * 100}%`;
      playerHpText.textContent = `${gameState.playerHp} / 10 HP`;

      enemyHpBar.style.width = `${(gameState.enemyHp / 10) * 100}%`;
      enemyHpText.textContent = `${gameState.enemyHp} / 10 HP`;
    }

    function startTimer() {
      clearInterval(gameState.timerInterval);
      gameState.timer = 8;
      timerDisplay.textContent = '08';

      gameState.timerInterval = setInterval(() => {
        gameState.timer--;
        timerDisplay.textContent = gameState.timer < 10 ? `0${gameState.timer}` : gameState.timer;
        if (gameState.timer <= 0) {
          clearInterval(gameState.timerInterval);
          handleAnswer(-1);
        }
      }, 1000);
    }

    function nextTurn() {
      if (gameState.playerHp <= 0 || gameState.enemyHp <= 0) {
        endGame();
        return;
      }

      gameState.currentQuestion = generateQuestion();
      promptTag.textContent = gameState.currentQuestion.promptText;
      targetSentence.innerHTML = gameState.currentQuestion.sentence;

      optionsGrid.innerHTML = '';
      gameState.currentQuestion.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'py-3 px-4 bg-slate-900 border-2 border-slate-700 hover:border-cyan-400 hover:bg-slate-800 rounded-xl font-bold text-lg text-center flex items-center justify-between';
        btn.innerHTML = `<span class="text-xs text-slate-500">${idx + 1}</span><span class="flex-1 text-cyan-300 font-mono">${opt}</span>`;
        btn.onclick = () => handleAnswer(idx);
        optionsGrid.appendChild(btn);
      });

      startTimer();
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

        // Animation Attaque Joueur
        heroSprite.classList.add('animate-hero-attack');
        projectile.className = 'projectile-player';
        projectile.classList.remove('hidden');

        setTimeout(() => {
          projectile.classList.add('hidden');
          enemySprite.classList.add('animate-hurt');
          showFeedback('⚔️ ATTAQUE REUSSIE ! (-1 HP)', 'text-cyan-400');
        }, 200);

        setTimeout(() => {
          heroSprite.classList.remove('animate-hero-attack');
          enemySprite.classList.remove('animate-hurt');
        }, 500);

      } else {
        gameState.playerHp = Math.max(0, gameState.playerHp - 1);
        sfx.playError();

        // Animation Attaque Ennemi
        enemySprite.classList.add('animate-enemy-attack');
        projectile.className = 'projectile-boss';
        projectile.classList.remove('hidden');

        setTimeout(() => {
          projectile.classList.add('hidden');
          heroSprite.classList.add('animate-hurt');
          showFeedback('💥 LE MONSTRE RIPOSTE ! (-1 HP)', 'text-rose-500');
        }, 200);

        setTimeout(() => {
          enemySprite.classList.remove('animate-enemy-attack');
          heroSprite.classList.remove('animate-hurt');
        }, 500);
      }

      updateHUD();

      setTimeout(() => {
        gameState.isAnimating = false;
        nextTurn();
      }, 900);
    }

    function showFeedback(text, colorClass) {
      feedbackText.textContent = text;
      feedbackText.className = `h-5 text-xs font-title font-bold tracking-wider ${colorClass} opacity-100 transition-all`;
      setTimeout(() => { feedbackText.className = 'h-5 text-xs font-title font-bold tracking-wider text-amber-400 opacity-0 transition-all'; }, 700);
    }

    function endGame() {
      clearInterval(gameState.timerInterval);
      gameScreen.classList.add('hidden');
      endScreen.classList.remove('hidden');
      endScreen.classList.add('flex');

      const isWin = gameState.playerHp > 0;
      document.getElementById('end-icon').textContent = isWin ? '🏆' : '💀';
      document.getElementById('end-title').textContent = isWin ? 'VICTOIRE !' : 'GAME OVER';
      document.getElementById('end-subtitle').textContent = isWin 
        ? "Bravo ! Tu as maîtrisé les 10 verbes et éliminé le monstre !" 
        : "Tes PV sont tombés à zéro... Révise tes conjugaisons et retente ta chance !";

      const accuracy = Math.round((gameState.correctQuestions / gameState.totalQuestions) * 100) || 0;
      document.getElementById('final-score').textContent = `${gameState.score} pts`;
      document.getElementById('final-accuracy').textContent = `${accuracy}%`;
    }

    configForm.onsubmit = (e) => {
      e.preventDefault();
      const formData = new FormData(configForm);
      config.level = formData.get('level');
      config.tenses = formData.getAll('tense');

      if (config.tenses.length === 0) {
        tenseError.classList.remove('hidden');
        return;
      }
      tenseError.classList.add('hidden');
      sfx.init();
      startGame();
    };

    document.getElementById('restart-btn').onclick = () => {
      endScreen.classList.add('hidden');
      menuScreen.classList.remove('hidden');
    };

    window.addEventListener('keydown', (e) => {
      if (gameScreen.classList.contains('hidden')) return;
      if (['1', '2', '3', '4'].includes(e.key)) {
        const btns = optionsGrid.querySelectorAll('button');
        const idx = parseInt(e.key) - 1;
        if (btns[idx]) btns[idx].click();
      }
    });
  </script>
</body>
</html>