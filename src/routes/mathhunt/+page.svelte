<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>TABLE HUNT - The Multiplication Shooting Game</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
    <style>
        * {
            box-shadow: none !important;
            user-select: none;
            -webkit-user-select: none;
            touch-action: manipulation;
        }
        body, html {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            background-color: #0b0e14;
            color: #ffffff;
            font-family: 'Press Start 2P', monospace, cursive;
            overflow: hidden;
        }
        /* Low-res crisp pixel art rendering */
        canvas {
            image-rendering: optimizeSpeed;
            image-rendering: -moz-crisp-edges;
            image-rendering: -webkit-optimize-contrast;
            image-rendering: -o-crisp-edges;
            image-rendering: pixelated;
            -ms-interpolation-mode: nearest-neighbor;
        }
        .scanlines {
            background: linear-gradient(
                rgba(18, 16, 16, 0) 50%, 
                rgba(0, 0, 0, 0.25) 50%
            ), linear-gradient(
                90deg,
                rgba(255, 0, 0, 0.03),
                rgba(0, 255, 0, 0.01),
                rgba(0, 0, 255, 0.03)
            );
            background-size: 100% 3px, 6px 100%;
            pointer-events: none;
        }
        /* Custom Arcade Border */
        .arcade-frame {
            border: 4px solid #3b2d54;
            outline: 4px solid #000;
            box-shadow: inset 0 0 10px rgba(0,0,0,0.8);
        }
        .pixel-btn {
            position: relative;
            background-color: #2b2b45;
            border: 3px solid #f6d6bd;
            color: #f6d6bd;
            text-shadow: 2px 2px #000;
            transition: transform 0.1s;
            cursor: pointer;
        }
        .pixel-btn:hover {
            background-color: #434366;
            transform: scale(1.02);
        }
        .pixel-btn:active {
            transform: scale(0.96);
            background-color: #f6d6bd;
            color: #121013;
            text-shadow: none;
        }
        .pixel-btn.active {
            background-color: #e2443a;
            color: #ffffff;
            border-color: #ffffff;
        }
    </style>
</head>
<body class="flex flex-col items-center justify-center min-h-screen p-2 sm:p-4 select-none">

    <!-- GAME WRAPPER -->
    <div id="game-wrapper" class="relative w-full max-w-4xl aspect-[16/9] flex items-center justify-center bg-black rounded-lg overflow-hidden arcade-frame">
        
        <!-- Game Canvas Rendering Window -->
        <canvas id="gameCanvas" width="320" height="180" class="w-full h-full block cursor-none"></canvas>

        <!-- CRT Scanline Effect Overlay -->
        <div class="absolute inset-0 scanlines pointer-events-none"></div>

        <!-- UI OVERLAY: MENU -->
        <div id="menu-overlay" class="absolute inset-0 bg-[#0f0a1c] bg-opacity-95 p-4 sm:p-6 flex flex-col justify-between items-center text-center overflow-y-auto z-20">
            <div class="space-y-2 mt-1 sm:mt-2">
                <h1 class="text-xl sm:text-3xl text-[#f6a000] tracking-wider drop-shadow-[3px_3px_0px_#000]">TABLE HUNT</h1>
                <p class="text-[8px] sm:text-xs text-[#a3a7c2] uppercase">JEU DE TIR ARCADE SUR LES MULTIPLICATIONS</p>
            </div>

            <!-- Tables Selection Grid -->
            <div class="w-full max-w-xl my-1 sm:my-2">
                <div class="flex justify-between items-center mb-2">
                    <span class="text-[10px] sm:text-xs text-[#52b141]">LIVRETS À CHASSER:</span>
                    <div class="flex gap-2">
                        <button id="btn-select-all" type="button" class="text-[8px] sm:text-[10px] bg-[#1d1d2c] border border-[#a3a7c2] px-2 py-1 hover:bg-[#32324e]">TOUT</button>
                        <button id="btn-deselect-all" type="button" class="text-[8px] sm:text-[10px] bg-[#1d1d2c] border border-[#a3a7c2] px-2 py-1 hover:bg-[#32324e]">AUCUN</button>
                    </div>
                </div>
                <div id="table-grid" class="grid grid-cols-4 sm:grid-cols-6 gap-2 text-xs">
                    <!-- Buttons JS generated dynamically -->
                </div>
            </div>

            <!-- Options Panel -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 w-full max-w-xl text-[9px] sm:text-xs my-1 sm:my-2">
                <!-- Difficulty -->
                <div class="bg-[#18132b] p-2 border border-[#3b2d54] flex flex-col justify-center items-center gap-1">
                    <span class="text-[#f6a000]">DIFFICULTÉ</span>
                    <button id="btn-difficulty" type="button" class="pixel-btn px-2 py-1 sm:py-2 w-full text-center">FACILE</button>
                </div>
                <!-- Movement -->
                <div class="bg-[#18132b] p-2 border border-[#3b2d54] flex flex-col justify-center items-center gap-1">
                    <span class="text-[#f6a000]">MOUVEMENT</span>
                    <button id="btn-movement" type="button" class="pixel-btn px-2 py-1 sm:py-2 w-full text-center">ON</button>
                </div>
                <!-- Sound -->
                <div class="bg-[#18132b] p-2 border border-[#3b2d54] flex flex-col justify-center items-center gap-1">
                    <span class="text-[#f6a000]">SONS</span>
                    <button id="btn-sound" type="button" class="pixel-btn px-2 py-1 sm:py-2 w-full text-center">ON</button>
                </div>
            </div>

            <!-- Warning message when no tables selected -->
            <div id="table-warning" class="hidden text-[#e2443a] text-[9px] sm:text-xs font-bold animate-pulse">
                SÉLECTIONNEZ AU MOINS 1 LIVRET !
            </div>

            <!-- Start Game Button -->
            <button id="btn-start-game" type="button" class="pixel-btn active text-xs sm:text-lg px-6 py-3 my-1 sm:my-2 w-full max-w-md animate-pulse">
                &gt;&gt; START GAME &lt;&lt;
            </button>
        </div>

        <!-- UI OVERLAY: VICTORY / GAME OVER -->
        <div id="victory-overlay" class="hidden absolute inset-0 bg-[#0f0a1c] bg-opacity-95 p-6 flex flex-col justify-center items-center text-center z-30">
            <div class="border-4 border-[#f6a000] p-4 sm:p-6 max-w-lg w-full bg-[#18132b] flex flex-col items-center gap-3 sm:gap-4">
                <h2 class="text-lg sm:text-2xl text-[#f6d6bd] tracking-widest animate-bounce">PARTIE TERMINÉE !</h2>
                <div id="star-rating" class="text-xl sm:text-2xl text-[#f6a000]">★ ★ ★ ★ ★</div>
                
                <div class="w-full space-y-2 text-left text-[10px] sm:text-sm my-1 sm:my-2 bg-[#0d0918] p-3 sm:p-4 border border-[#3b2d54]">
                    <div class="flex justify-between">
                        <span class="text-[#a3a7c2]">OBJECTIF:</span>
                        <span class="text-[#52b141]">10 / 10 RÉUSSIS</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-[#a3a7c2]">TIRS TOTAUX:</span>
                        <span id="final-shots" class="text-[#f6d6bd]">0</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-[#a3a7c2]">PRÉCISION:</span>
                        <span id="final-accuracy" class="text-[#f6a000]">100%</span>
                    </div>
                </div>

                <div class="flex gap-4 w-full justify-center">
                    <button id="btn-replay" type="button" class="pixel-btn active text-xs sm:text-sm px-4 py-3 flex-1">REJOUER</button>
                    <button id="btn-menu" type="button" class="pixel-btn text-xs sm:text-sm px-4 py-3 flex-1">MENU</button>
                </div>
            </div>
        </div>

    </div>

    <script>
        /* =========================================================================
           1. AUDIO SYNTHESIZER (8-Bit Synthesized Sound via Web Audio API)
           ========================================================================= */
        class RetroAudioEngine {
            constructor() {
                this.ctx = null;
                this.enabled = true;
            }

            init() {
                try {
                    if (!this.ctx) {
                        const AudioContext = window.AudioContext || window.webkitAudioContext;
                        if (AudioContext) {
                            this.ctx = new AudioContext();
                        }
                    }
                    if (this.ctx && this.ctx.state === 'suspended') {
                        this.ctx.resume();
                    }
                } catch (e) {
                    console.warn("Web Audio API warning:", e);
                }
            }

            playShoot() {
                if (!this.enabled) return;
                this.init();
                if (!this.ctx) return;

                const now = this.ctx.currentTime;
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();

                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(600, now);
                osc.frequency.exponentialRampToValueAtTime(40, now + 0.15);

                gain.gain.setValueAtTime(0.2, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start(now);
                osc.stop(now + 0.15);
            }

            playHit() {
                if (!this.enabled) return;
                this.init();
                if (!this.ctx) return;

                const now = this.ctx.currentTime;
                [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
                    const osc = this.ctx.createOscillator();
                    const gain = this.ctx.createGain();
                    osc.type = 'square';
                    osc.frequency.setValueAtTime(freq, now + idx * 0.05);

                    gain.gain.setValueAtTime(0.15, now + idx * 0.05);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.05 + 0.1);

                    osc.connect(gain);
                    gain.connect(this.ctx.destination);

                    osc.start(now + idx * 0.05);
                    osc.stop(now + idx * 0.05 + 0.1);
                });
            }

            playMiss() {
                if (!this.enabled) return;
                this.init();
                if (!this.ctx) return;

                const now = this.ctx.currentTime;
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();

                osc.type = 'triangle';
                osc.frequency.setValueAtTime(150, now);
                osc.frequency.linearRampToValueAtTime(60, now + 0.2);

                gain.gain.setValueAtTime(0.2, now);
                gain.gain.linearRampToValueAtTime(0.01, now + 0.2);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start(now);
                osc.stop(now + 0.2);
            }

            playVictory() {
                if (!this.enabled) return;
                this.init();
                if (!this.ctx) return;

                const notes = [
                    {f: 440, d: 0.1}, {f: 554, d: 0.1}, {f: 659, d: 0.1}, {f: 880, d: 0.3}
                ];
                let time = this.ctx.currentTime;
                notes.forEach(note => {
                    const osc = this.ctx.createOscillator();
                    const gain = this.ctx.createGain();
                    osc.type = 'square';
                    osc.frequency.setValueAtTime(note.f, time);

                    gain.gain.setValueAtTime(0.2, time);
                    gain.gain.exponentialRampToValueAtTime(0.01, time + note.d);

                    osc.connect(gain);
                    gain.connect(this.ctx.destination);

                    osc.start(time);
                    osc.stop(time + note.d);
                    time += note.d + 0.02;
                });
            }
        }

        /* =========================================================================
           2. GAME DATA & QUESTION GENERATOR
           ========================================================================= */
        class QuestionGenerator {
            static generate(selectedTables, difficulty) {
                if (!selectedTables || selectedTables.length === 0) {
                    selectedTables = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
                }
                
                // Pick random table from selection
                const table = selectedTables[Math.floor(Math.random() * selectedTables.length)];
                const multiplier = Math.floor(Math.random() * 12) + 1;
                
                // Randomly swap factors for variety (e.g., 7 x 8 vs 8 x 7)
                const swap = Math.random() < 0.5;
                const factorA = swap ? multiplier : table;
                const factorB = swap ? table : multiplier;
                const correctAnswer = factorA * factorB;

                const wrongAnswers = new Set();

                if (difficulty === 'FACILE') {
                    // Random bounds
                    while (wrongAnswers.size < 3) {
                        const delta = (Math.floor(Math.random() * 20) + 1) * (Math.random() < 0.5 ? 1 : -1);
                        const dummy = Math.max(1, correctAnswer + delta);
                        if (dummy !== correctAnswer) {
                            wrongAnswers.add(dummy);
                        }
                    }
                } else {
                    // ACCRUE: Smart distractors (±1, ±2, factor swap mistakes, neighbor table results)
                    const smartCandidates = [
                        correctAnswer + 1,
                        correctAnswer - 1,
                        correctAnswer + 2,
                        correctAnswer - 2,
                        (factorA + 1) * factorB,
                        (factorA - 1) * factorB,
                        factorA * (factorB + 1),
                        factorA * (factorB - 1),
                        correctAnswer + factorA,
                        correctAnswer - factorB
                    ];

                    smartCandidates.sort(() => Math.random() - 0.5);

                    for (let cand of smartCandidates) {
                        if (cand > 0 && cand !== correctAnswer) {
                            wrongAnswers.add(cand);
                        }
                        if (wrongAnswers.size === 3) break;
                    }

                    while (wrongAnswers.size < 3) {
                        const fallback = Math.max(1, correctAnswer + (Math.floor(Math.random() * 10) - 5));
                        if (fallback !== correctAnswer) {
                            wrongAnswers.add(fallback);
                        }
                    }
                }

                const choices = [correctAnswer, ...Array.from(wrongAnswers)];
                choices.sort(() => Math.random() - 0.5);

                return {
                    factorA,
                    factorB,
                    correctAnswer,
                    choices
                };
            }
        }

        /* =========================================================================
           3. SPRITES & CANVAS RENDERER
           ========================================================================= */
        const CANVAS_WIDTH = 320;
        const CANVAS_HEIGHT = 180;

        class Duck {
            constructor(id, value, isCorrect, x, y, isMoving) {
                this.id = id;
                this.value = value;
                this.isCorrect = isCorrect;
                this.x = x;
                this.y = y;
                this.width = 28;
                this.height = 24;
                this.vx = isMoving ? (Math.random() > 0.5 ? 1 : -1) * (0.4 + Math.random() * 0.4) : 0;
                this.vy = isMoving ? (Math.random() > 0.5 ? 1 : -1) * (0.2 + Math.random() * 0.3) : 0;
                this.frame = 0;
                this.animTimer = 0;
                this.facingRight = this.vx >= 0;
                this.state = 'ALIVE'; // 'ALIVE', 'HIT', 'DEAD'
                this.rotation = 0;
                this.fallSpeed = 0;
            }

            update(delta) {
                if (this.state === 'ALIVE') {
                    this.x += this.vx;
                    this.y += this.vy;

                    // Bounce off boundary edges
                    if (this.x < 15 || this.x > CANVAS_WIDTH - 45) {
                        this.vx *= -1;
                        this.facingRight = this.vx >= 0;
                    }
                    if (this.y < 35 || this.y > CANVAS_HEIGHT - 65) {
                        this.vy *= -1;
                    }

                    // Flapping animation frame
                    this.animTimer += delta;
                    if (this.animTimer > 0.15) {
                        this.frame = (this.frame + 1) % 4;
                        this.animTimer = 0;
                    }
                } else if (this.state === 'HIT') {
                    this.rotation += 0.2;
                    this.fallSpeed += 0.25;
                    this.y += this.fallSpeed;
                    if (this.y > CANVAS_HEIGHT + 30) {
                        this.state = 'DEAD';
                    }
                }
            }

            draw(ctx) {
                ctx.save();
                ctx.translate(Math.floor(this.x + this.width / 2), Math.floor(this.y + this.height / 2));
                if (this.rotation !== 0) {
                    ctx.rotate(this.rotation);
                }
                if (!this.facingRight) {
                    ctx.scale(-1, 1);
                }

                // DRAW DUCK PIXEL ART
                const bodyColor = '#805300';
                const headColor = '#24802c';
                const wingColor = '#a8731d';
                const beakColor = '#f6a000';

                // Duck Head
                ctx.fillStyle = headColor;
                ctx.fillRect(-6, -12, 10, 8);

                // Eye
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, -10, 2, 2);
                ctx.fillStyle = '#000000';
                ctx.fillRect(1, -10, 1, 1);

                // Beak
                ctx.fillStyle = beakColor;
                ctx.fillRect(4, -8, 6, 3);

                // Body
                ctx.fillStyle = bodyColor;
                ctx.fillRect(-10, -4, 18, 10);
                ctx.fillRect(-12, -2, 2, 6); // Tail

                // Wings depending on animation frame
                ctx.fillStyle = wingColor;
                if (this.frame === 0) { // Wing up
                    ctx.fillRect(-4, -12, 6, 8);
                } else if (this.frame === 1 || this.frame === 3) { // Wing middle
                    ctx.fillRect(-6, -3, 10, 5);
                } else if (this.frame === 2) { // Wing down
                    ctx.fillRect(-4, 2, 6, 7);
                }

                ctx.restore();

                // DRAW ANSWER PLAQUE / BANNER ATTACHED BELOW DUCK
                ctx.save();
                const plaqueWidth = 26;
                const plaqueHeight = 12;
                const plaqueX = Math.floor(this.x + (this.width - plaqueWidth) / 2);
                const plaqueY = Math.floor(this.y + this.height + 2);

                // String hanging
                ctx.strokeStyle = '#000000';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(this.x + 6, this.y + 10);
                ctx.lineTo(plaqueX + 4, plaqueY);
                ctx.moveTo(this.x + this.width - 6, this.y + 10);
                ctx.lineTo(plaqueX + plaqueWidth - 4, plaqueY);
                ctx.stroke();

                // Plaque background & border
                ctx.fillStyle = '#000000';
                ctx.fillRect(plaqueX - 1, plaqueY - 1, plaqueWidth + 2, plaqueHeight + 2);
                ctx.fillStyle = '#f6d6bd';
                ctx.fillRect(plaqueX, plaqueY, plaqueWidth, plaqueHeight);

                // Text Choice
                ctx.fillStyle = '#000000';
                ctx.font = '8px "Press Start 2P"';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(this.value.toString(), plaqueX + plaqueWidth / 2, plaqueY + plaqueHeight / 2 + 1);

                ctx.restore();
            }

            containsPoint(px, py) {
                return (
                    px >= this.x - 4 &&
                    px <= this.x + this.width + 4 &&
                    py >= this.y - 12 &&
                    py <= this.y + this.height + 16
                );
            }
        }

        /* =========================================================================
           4. MAIN GAME CONTROLLER
           ========================================================================= */
        class TableHuntGame {
            constructor() {
                this.canvas = document.getElementById('gameCanvas');
                this.ctx = this.canvas.getContext('2d');
                this.audio = new RetroAudioEngine();

                // All tables 1-12 selected by default
                this.selectedTables = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
                this.difficulty = 'FACILE';
                this.movementOn = true;

                // Game State Counters
                this.correctHits = 0;
                this.totalShots = 0;
                this.targetScore = 10;
                this.isPlaying = false;

                // Entities & FX
                this.ducks = [];
                this.currentQuestion = null;
                this.effects = [];
                this.crosshairPos = { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 };

                this.clouds = [
                    { x: 20, y: 15, speed: 0.1 },
                    { x: 120, y: 25, speed: 0.15 },
                    { x: 230, y: 10, speed: 0.08 }
                ];

                this.lastTime = performance.now();

                this.setupMenuUI();
                this.bindEvents();
                this.gameLoop();
            }

            setupMenuUI() {
                const tableGrid = document.getElementById('table-grid');
                if (!tableGrid) return;
                tableGrid.innerHTML = '';

                // Create Table Buttons 1 to 12
                for (let i = 1; i <= 12; i++) {
                    const btn = document.createElement('button');
                    btn.type = 'button';
                    btn.className = `pixel-btn text-[10px] p-2 ${this.selectedTables.includes(i) ? 'active' : ''}`;
                    btn.innerText = `×${i}`;
                    btn.onclick = (e) => {
                        e.preventDefault();
                        if (this.selectedTables.includes(i)) {
                            this.selectedTables = this.selectedTables.filter(t => t !== i);
                            btn.classList.remove('active');
                        } else {
                            this.selectedTables.push(i);
                            btn.classList.add('active');
                        }
                        this.checkTableWarning();
                    };
                    tableGrid.appendChild(btn);
                }

                // Select All / Deselect All
                document.getElementById('btn-select-all').onclick = (e) => {
                    e.preventDefault();
                    this.selectedTables = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
                    Array.from(tableGrid.children).forEach(b => b.classList.add('active'));
                    this.checkTableWarning();
                };

                document.getElementById('btn-deselect-all').onclick = (e) => {
                    e.preventDefault();
                    this.selectedTables = [];
                    Array.from(tableGrid.children).forEach(b => b.classList.remove('active'));
                    this.checkTableWarning();
                };

                // Option Toggles
                const btnDiff = document.getElementById('btn-difficulty');
                btnDiff.onclick = (e) => {
                    e.preventDefault();
                    this.difficulty = this.difficulty === 'FACILE' ? 'ACCRUE' : 'FACILE';
                    btnDiff.innerText = this.difficulty;
                };

                const btnMove = document.getElementById('btn-movement');
                btnMove.onclick = (e) => {
                    e.preventDefault();
                    this.movementOn = !this.movementOn;
                    btnMove.innerText = this.movementOn ? 'ON' : 'OFF';
                };

                const btnSound = document.getElementById('btn-sound');
                btnSound.onclick = (e) => {
                    e.preventDefault();
                    this.audio.enabled = !this.audio.enabled;
                    btnSound.innerText = this.audio.enabled ? 'ON' : 'OFF';
                };

                // Start Game
                document.getElementById('btn-start-game').onclick = (e) => {
                    e.preventDefault();
                    if (this.selectedTables.length === 0) {
                        this.checkTableWarning();
                        return;
                    }
                    this.audio.init();
                    document.getElementById('menu-overlay').classList.add('hidden');
                    this.startGame();
                };

                // Replay & Menu Buttons
                document.getElementById('btn-replay').onclick = (e) => {
                    e.preventDefault();
                    document.getElementById('victory-overlay').classList.add('hidden');
                    this.startGame();
                };

                document.getElementById('btn-menu').onclick = (e) => {
                    e.preventDefault();
                    document.getElementById('victory-overlay').classList.add('hidden');
                    document.getElementById('menu-overlay').classList.remove('hidden');
                };
            }

            checkTableWarning() {
                const warning = document.getElementById('table-warning');
                if (this.selectedTables.length === 0) {
                    warning.classList.remove('hidden');
                } else {
                    warning.classList.add('hidden');
                }
            }

            bindEvents() {
                const updateCrosshair = (e) => {
                    const rect = this.canvas.getBoundingClientRect();
                    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
                    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

                    this.crosshairPos.x = Math.floor(((clientX - rect.left) / rect.width) * CANVAS_WIDTH);
                    this.crosshairPos.y = Math.floor(((clientY - rect.top) / rect.height) * CANVAS_HEIGHT);
                };

                this.canvas.addEventListener('mousemove', updateCrosshair);

                const handleShoot = (e) => {
                    e.preventDefault();
                    updateCrosshair(e);
                    if (this.isPlaying) {
                        this.shoot(this.crosshairPos.x, this.crosshairPos.y);
                    }
                };

                this.canvas.addEventListener('mousedown', handleShoot);
                this.canvas.addEventListener('touchstart', handleShoot, { passive: false });
            }

            startGame() {
                this.correctHits = 0;
                this.totalShots = 0;
                this.isPlaying = true;
                this.nextQuestion();
            }

            nextQuestion() {
                this.currentQuestion = QuestionGenerator.generate(this.selectedTables, this.difficulty);
                this.spawnDucks();
            }

            spawnDucks() {
                this.ducks = [];
                const positions = [
                    { x: 40, y: 55 },
                    { x: 110, y: 70 },
                    { x: 180, y: 50 },
                    { x: 250, y: 65 }
                ];

                this.currentQuestion.choices.forEach((choice, index) => {
                    const isCorrect = choice === this.currentQuestion.correctAnswer;
                    const pos = positions[index];
                    const duck = new Duck(
                        index,
                        choice,
                        isCorrect,
                        pos.x,
                        pos.y,
                        this.movementOn
                    );
                    this.ducks.push(duck);
                });
            }

            shoot(x, y) {
                this.totalShots++;
                this.audio.playShoot();

                let hitSomething = false;

                for (let duck of this.ducks) {
                    if (duck.state === 'ALIVE' && duck.containsPoint(x, y)) {
                        hitSomething = true;

                        if (duck.isCorrect) {
                            duck.state = 'HIT';
                            this.correctHits++;
                            this.audio.playHit();
                            this.addEffect(x, y, 'HIT!', '#52b141');

                            setTimeout(() => {
                                if (this.correctHits >= this.targetScore) {
                                    this.endGame();
                                } else {
                                    this.nextQuestion();
                                }
                            }, 600);
                        } else {
                            this.audio.playMiss();
                            this.addEffect(x, y, 'MISS!', '#e2443a');
                        }
                        break;
                    }
                }

                if (!hitSomething) {
                    this.audio.playMiss();
                    this.addEffect(x, y, 'MISS!', '#e2443a');
                }
            }

            addEffect(x, y, text, color) {
                this.effects.push({
                    x,
                    y,
                    text,
                    color,
                    life: 1.0
                });
            }

            endGame() {
                this.isPlaying = false;
                this.audio.playVictory();

                const accuracy = Math.round((this.correctHits / Math.max(1, this.totalShots)) * 100);
                
                let stars = '★ ★ ★ ★ ★';
                if (accuracy < 50) stars = '★ ★ ☆ ☆ ☆';
                else if (accuracy < 70) stars = '★ ★ ★ ☆ ☆';
                else if (accuracy < 90) stars = '★ ★ ★ ★ ☆';

                document.getElementById('final-shots').innerText = this.totalShots;
                document.getElementById('final-accuracy').innerText = `${accuracy}%`;
                document.getElementById('star-rating').innerText = stars;

                document.getElementById('victory-overlay').classList.remove('hidden');
            }

            update(delta) {
                this.clouds.forEach(cloud => {
                    cloud.x += cloud.speed;
                    if (cloud.x > CANVAS_WIDTH) cloud.x = -30;
                });

                this.ducks.forEach(duck => duck.update(delta));

                for (let i = this.effects.length - 1; i >= 0; i--) {
                    const fx = this.effects[i];
                    fx.y -= 0.3;
                    fx.life -= 0.03;
                    if (fx.life <= 0) this.effects.splice(i, 1);
                }
            }

            render() {
                const ctx = this.ctx;
                ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

                // Sky Background
                ctx.fillStyle = '#3ca0d0';
                ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

                // Sun
                ctx.fillStyle = '#f6d6bd';
                ctx.fillRect(260, 15, 20, 20);

                // Clouds
                ctx.fillStyle = '#ffffff';
                this.clouds.forEach(cloud => {
                    ctx.fillRect(Math.floor(cloud.x), Math.floor(cloud.y), 24, 8);
                    ctx.fillRect(Math.floor(cloud.x + 4), Math.floor(cloud.y - 4), 16, 4);
                });

                // Mountains & Trees
                ctx.fillStyle = '#2b3f5e';
                ctx.beginPath();
                ctx.moveTo(0, 130);
                ctx.lineTo(50, 90);
                ctx.lineTo(110, 130);
                ctx.lineTo(180, 85);
                ctx.lineTo(240, 130);
                ctx.lineTo(320, 95);
                ctx.lineTo(320, 130);
                ctx.fill();

                ctx.fillStyle = '#174728';
                ctx.fillRect(0, 120, CANVAS_WIDTH, 20);

                // Ground & Fence
                ctx.fillStyle = '#388726';
                ctx.fillRect(0, 135, CANVAS_WIDTH, 45);
                ctx.fillStyle = '#1d5214';
                ctx.fillRect(0, 165, CANVAS_WIDTH, 15);

                ctx.fillStyle = '#7a4b22';
                for (let x = 10; x < CANVAS_WIDTH; x += 30) {
                    ctx.fillRect(x, 138, 4, 18);
                }
                ctx.fillRect(0, 142, CANVAS_WIDTH, 3);
                ctx.fillRect(0, 150, CANVAS_WIDTH, 3);

                // Ducks
                this.ducks.forEach(duck => duck.draw(ctx));

                // FX Popups
                this.effects.forEach(fx => {
                    ctx.save();
                    ctx.fillStyle = fx.color;
                    ctx.font = '10px "Press Start 2P"';
                    ctx.textAlign = 'center';
                    ctx.globalAlpha = Math.max(0, fx.life);
                    ctx.fillText(fx.text, Math.floor(fx.x), Math.floor(fx.y));
                    ctx.restore();
                });

                // Top HUD
                ctx.fillStyle = '#0f0a1c';
                ctx.fillRect(0, 0, CANVAS_WIDTH, 24);
                ctx.fillStyle = '#3b2d54';
                ctx.fillRect(0, 23, CANVAS_WIDTH, 1);

                if (this.currentQuestion) {
                    ctx.fillStyle = '#f6a000';
                    ctx.font = '8px "Press Start 2P"';
                    ctx.textAlign = 'left';
                    ctx.fillText(`TOUCHES:${this.correctHits}/${this.targetScore}`, 6, 15);

                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign = 'center';
                    ctx.fillText(`${this.currentQuestion.factorA} × ${this.currentQuestion.factorB} = ?`, CANVAS_WIDTH / 2, 15);

                    ctx.fillStyle = '#52b141';
                    ctx.textAlign = 'right';
                    ctx.fillText(`TIRS:${this.totalShots}`, CANVAS_WIDTH - 6, 15);
                }

                // Crosshair Cursor
                if (this.isPlaying) {
                    const cx = this.crosshairPos.x;
                    const cy = this.crosshairPos.y;

                    ctx.strokeStyle = '#e2443a';
                    ctx.lineWidth = 1;

                    ctx.beginPath();
                    ctx.arc(cx, cy, 5, 0, Math.PI * 2);
                    ctx.moveTo(cx - 8, cy);
                    ctx.lineTo(cx + 8, cy);
                    ctx.moveTo(cx, cy - 8);
                    ctx.lineTo(cx, cy + 8);
                    ctx.stroke();

                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(cx, cy, 1, 1);
                }
            }

            gameLoop() {
                const now = performance.now();
                const delta = (now - this.lastTime) / 1000;
                this.lastTime = now;

                if (this.isPlaying) {
                    this.update(delta);
                }
                this.render();

                requestAnimationFrame(() => this.gameLoop());
            }
        }

        // Safe robust window loader
        function initApp() {
            window.game = new TableHuntGame();
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initApp);
        } else {
            initApp();
        }
    </script>
</body>
</html>