<script>
  import { onMount } from 'svelte';

  /* ==========================================================================
     1. MOTEUR MATHÉMATIQUE (MathEngine)
     ========================================================================== */
  const MathEngine = {
    units: ['', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf'],
    tens: ['', 'dix', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', 'septante', 'huitante', 'nonante'],

    numberToSwissText(n) {
      if (n === 0) return 'zéro';
      if (n < 10) return this.units[n];
      if (n < 100) {
        let t = Math.floor(n / 10), u = n % 10;
        if (n === 11) return 'onze'; if (n === 12) return 'douze'; if (n === 13) return 'treize';
        if (n === 14) return 'quatorze'; if (n === 15) return 'quinze'; if (n === 16) return 'seize';
        return this.tens[t] + (u === 1 ? ' et un' : (u > 0 ? '-' + this.units[u] : ''));
      }
      if (n < 1000) {
        let c = Math.floor(n / 100), rem = n % 100;
        let cText = c === 1 ? 'cent' : this.units[c] + ' cents';
        return cText + (rem > 0 ? ' ' + this.numberToSwissText(rem) : '');
      }
      if (n <= 10000) {
        let m = Math.floor(n / 1000), rem = n % 1000;
        let mText = m === 1 ? 'mille' : this.numberToSwissText(m) + ' mille';
        return mText + (rem > 0 ? ' ' + this.numberToSwissText(rem) : '');
      }
      return n.toString();
    },

    decompose(num) {
      return {
        U: num % 10,
        D: Math.floor(num / 10) % 10,
        C: Math.floor(num / 100) % 10,
        M: Math.floor(num / 1000) % 10
      };
    },

    calculateValue(counts) {
      return (counts.U || 0) * 1 + (counts.D || 0) * 10 + (counts.C || 0) * 100 + (counts.M || 0) * 1000;
    },

    analyzeError(target, deliveredCounts) {
      const targetDec = this.decompose(target);
      const deliveredVal = this.calculateValue(deliveredCounts);
      const deliveredDec = this.decompose(deliveredVal);

      const diffs = {
        U: deliveredDec.U - targetDec.U,
        D: deliveredDec.D - targetDec.D,
        C: deliveredDec.C - targetDec.C,
        M: deliveredDec.M - targetDec.M,
        totalDiff: deliveredVal - target
      };

      return { target, deliveredVal, targetDec, deliveredDec, diffs };
    }
  };

  /* ==========================================================================
     2. MOTEUR AUDIO ET EFFETS (Audio & Visuals)
     ========================================================================== */
  let audioCtx = null;
  function initAudio() {
    if (!config.audio) return;
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
  }

  function playChiptune(type) {
    if (!config.audio) return;
    initAudio();
    if (!audioCtx) return;
    
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain); gain.connect(audioCtx.destination);
    
    if (type === 'catch') {
      osc.type = 'square'; osc.frequency.setValueAtTime(300, audioCtx.currentTime);
      osc.frequency.setValueAtTime(600, audioCtx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);
      osc.start(); osc.stop(audioCtx.currentTime + 0.08);
    } else if (type === 'fuse') {
      osc.type = 'sawtooth'; osc.frequency.setValueAtTime(150, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(900, audioCtx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
      osc.start(); osc.stop(audioCtx.currentTime + 0.2);
    } else if (type === 'break') {
      osc.type = 'square'; osc.frequency.setValueAtTime(800, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
      osc.start(); osc.stop(audioCtx.currentTime + 0.15);
    } else if (type === 'error') {
      osc.type = 'sawtooth'; osc.frequency.setValueAtTime(120, audioCtx.currentTime);
      osc.frequency.setValueAtTime(80, audioCtx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);
      osc.start(); osc.stop(audioCtx.currentTime + 0.25);
    } else if (type === 'win') {
      let notes = [523, 659, 783, 1046];
      notes.forEach((f, idx) => {
        let o = audioCtx.createOscillator(); let g = audioCtx.createGain();
        o.type = 'square'; o.connect(g); g.connect(audioCtx.destination);
        o.frequency.setValueAtTime(f, audioCtx.currentTime + idx * 0.05);
        g.gain.setValueAtTime(0.1, audioCtx.currentTime + idx * 0.05);
        g.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + idx * 0.05 + 0.08);
        o.start(audioCtx.currentTime + idx * 0.05); o.stop(audioCtx.currentTime + idx * 0.05 + 0.08);
      });
    }
  }

  let canvas;
  let ctx;
  let particles = [];

  function resizeCanvas() { 
    if (canvas) {
      canvas.width = window.innerWidth; 
      canvas.height = window.innerHeight; 
    }
  }

  function createBurst(x, y, color, count = 15) {
    if (!config.animations) return;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 5 + 2;
      particles.push({ x: x, y: y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: 1.0, color: color, size: Math.random() * 3 + 2 });
    }
  }

  function renderParticles() {
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (config.animations) {
        for (let i = particles.length - 1; i >= 0; i--) {
          let p = particles[i]; p.x += p.vx; p.y += p.vy; p.life -= 0.04;
          ctx.fillStyle = p.color; ctx.globalAlpha = Math.max(0, p.life);
          ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
          if (p.life <= 0) particles.splice(i, 1);
        }
      }
      ctx.globalAlpha = 1; 
    }
    requestAnimationFrame(renderParticles);
  }

  /* ==========================================================================
     3. CONFIGURATION ET ÉTAT D'APPLICATION (State & Config)
     ========================================================================== */
  let config = {
    taskMode: 1,
    minVal: 1, maxVal: 1999,
    noU: false, noD: false, noC: false, noM: false,
    lockBelt: true,
    allowedBeltItems: ['U', 'D', 'C', 'M'],
    allowFuse: true, allowBreak: true,
    audio: true, animations: true, trainingMode: false
  };

  let gameState = {
    score: 0, combo: 1, lives: 3, superGauge: 0,
    currentOrderVal: 0, currentOrderText: '',
    specialType: null, errorAttempts: 0,
    workbench: { M: 0, C: 0, D: 0, U: 0 },
    cartonHasApo: false, activeBeltItems: [],
    spawnerInterval: null, isBeltLocked: false
  };

  function loadSavedConfig() {
    try {
      const saved = localStorage.getItem('snf_config');
      if (saved) {
        const parsed = JSON.parse(saved);
        Object.assign(config, parsed);
      }
    } catch (e) { console.warn("Impossible de charger les paramètres enregistrés."); }
  }

  function saveCurrentConfig() {
    try {
      localStorage.setItem('snf_config', JSON.stringify(config));
    } catch (e) { console.warn("Impossible de sauvegarder la configuration."); }
  }

  /* ==========================================================================
     4. CONSTRUCTEUR DE COMPOSANTS DOM & EVENTS
     ========================================================================== */
  function createPackageDOM(type) {
    const wrap = document.createElement('div');
    wrap.className = `block-item pack-${type}`;

    if (type === 'U') {
      wrap.innerText = '';
    } else if (type === 'D') {
      for (let i = 0; i < 10; i++) { 
        const u = document.createElement('div'); u.className = 'pack-U'; wrap.appendChild(u); 
      }
    } else if (type === 'C') {
      for (let i = 0; i < 10; i++) {
        const d = document.createElement('div'); d.className = 'mini-dizaine';
        for (let j = 0; j < 10; j++) { const dot = document.createElement('div'); dot.className = 'mini-dot'; d.appendChild(dot); }
        wrap.appendChild(d);
      }
    } else if (type === 'M') {
      const grid = document.createElement('div');
      grid.className = 'pack-M-grid';
      for (let i = 0; i < 10; i++) { const p = document.createElement('div'); p.className = 'mini-plate'; grid.appendChild(p); }
      wrap.appendChild(grid);
    }
    return wrap;
  }

  function bindAction(element, callback) {
    if (!element) return;
    element.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      initAudio();
      callback(e);
    });
  }

  function switchTab(tabId) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    
    const targetBtn = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
    if (targetBtn) targetBtn.classList.add('active');
    
    const targetContent = document.getElementById(tabId);
    if (targetContent) targetContent.classList.add('active');
  }

  /* ==========================================================================
     5. BOUCLE DE JEU ET DÉROULEMENT
     ========================================================================== */
  function startGame() {
    config.taskMode = parseInt(document.getElementById('cfg-task-mode').value) || 1;
    let minVal = parseInt(document.getElementById('cfg-min').value) || 1;
    let maxVal = parseInt(document.getElementById('cfg-max').value) || 1999;
    
    if (minVal > maxVal) { let tmp = minVal; minVal = maxVal; maxVal = tmp; }
    config.minVal = Math.max(1, Math.min(10000, minVal));
    config.maxVal = Math.max(1, Math.min(10000, maxVal));

    config.noU = document.getElementById('cfg-no-U').checked;
    config.noD = document.getElementById('cfg-no-D').checked;
    config.noC = document.getElementById('cfg-no-C').checked;
    config.noM = document.getElementById('cfg-no-M').checked;

    config.allowedBeltItems = [];
    if (document.getElementById('cfg-item-U').checked) config.allowedBeltItems.push('U');
    if (document.getElementById('cfg-item-D').checked) config.allowedBeltItems.push('D');
    if (document.getElementById('cfg-item-C').checked) config.allowedBeltItems.push('C');
    if (document.getElementById('cfg-item-M').checked) config.allowedBeltItems.push('M');
    if (config.allowedBeltItems.length === 0) config.allowedBeltItems = ['U'];

    config.allowFuse = document.getElementById('cfg-allow-fuse').checked;
    config.allowBreak = document.getElementById('cfg-allow-break').checked;

    config.audio = document.getElementById('cfg-audio').checked;
    config.animations = document.getElementById('cfg-animations').checked;
    config.trainingMode = document.getElementById('cfg-training-mode').checked;
    config.lockBelt = document.getElementById('cfg-lock-belt').checked;

    if (!config.animations) document.body.classList.add('no-anim');
    else document.body.classList.remove('no-anim');

    saveCurrentConfig();

    const modesNames = ["Production", "Lecture", "Décomposition", "Transformation", "Contrôle Qualité", "Défi"];
    document.getElementById('ui-level').innerText = `${modesNames[config.taskMode - 1]} (${config.minVal.toLocaleString('fr-CH')} à ${config.maxVal.toLocaleString('fr-CH')})`;
    document.getElementById('config-screen').style.display = 'none';

    gameState.lives = config.trainingMode ? 999 : 3;
    updateUI();
    nextOrder();
    startBeltSpawner();
    requestAnimationFrame(updateBeltPositions);
  }

  function isValidNumberForConfig(num) {
    let dec = MathEngine.decompose(num);
    if (config.noU && dec.U === 0) return false;
    if (config.noD && dec.D === 0) return false;
    if (config.noC && dec.C === 0) return false;
    if (config.noM && dec.M === 0) return false;
    return true;
  }

  function nextOrder() {
    let candidate = 0;
    let attempts = 0;
    do {
      candidate = Math.floor(Math.random() * (config.maxVal - config.minVal + 1)) + config.minVal;
      attempts++;
    } while (!isValidNumberForConfig(candidate) && attempts < 1000);

    gameState.currentOrderVal = candidate;
    gameState.currentOrderText = MathEngine.numberToSwissText(candidate);
    gameState.cartonHasApo = false;
    gameState.errorAttempts = 0;

    const apoBtn = document.getElementById('btn-toggle-apo');
    if (apoBtn) apoBtn.classList.remove('active');

    document.getElementById('ui-order-num').innerText = candidate.toLocaleString('fr-CH');
    document.getElementById('ui-order-text').innerText = `"${gameState.currentOrderText}"`;

    const badgeSp = document.getElementById('ui-badge-special');
    const bonusApo = document.getElementById('ui-bonus-apo');

    if (candidate >= 1000) bonusApo.style.display = 'block';
    else bonusApo.style.display = 'none';

    if (config.taskMode === 6) {
      const types = ['no-fuse', 'exact-count'];
      gameState.specialType = types[Math.floor(Math.random() * types.length)];
    } else {
      gameState.specialType = null;
    }

    if (gameState.specialType === 'no-fuse') badgeSp.innerHTML = `<span class="special-badge">DÉFI: SANS FUSION</span>`;
    else if (gameState.specialType === 'exact-count') badgeSp.innerHTML = `<span class="special-badge">DÉFI: SANS DÉCOMPOSITION</span>`;
    else badgeSp.innerHTML = '';

    document.getElementById('carton-box').innerHTML = '';
    checkBeltLockCondition();
  }

  function calculateTotalAvailableValue() {
    let total = MathEngine.calculateValue(gameState.workbench);
    
    const carton = document.getElementById('carton-box');
    carton.querySelectorAll('.block-item').forEach(b => {
      let t = b.dataset.type;
      if (t === 'U') total += 1; if (t === 'D') total += 10;
      if (t === 'C') total += 100; if (t === 'M') total += 1000;
    });

    gameState.activeBeltItems.forEach(item => {
      if (item.type === 'U') total += 1; if (item.type === 'D') total += 10;
      if (item.type === 'C') total += 100; if (item.type === 'M') total += 1000;
    });

    return total;
  }

  function checkBeltLockCondition() {
    if (!config.lockBelt) { setBeltLockState(false); return; }
    const availableValue = calculateTotalAvailableValue();
    const threshold = Math.ceil(gameState.currentOrderVal * 1.10);
    setBeltLockState(availableValue >= threshold);
  }

  function setBeltLockState(locked) {
    gameState.isBeltLocked = locked;
    const trackBg = document.getElementById('belt-track-bg');
    const beltContainer = document.getElementById('conveyor-belt-container');
    const badge = document.getElementById('belt-status-badge');

    if (locked) {
      trackBg.classList.add('paused'); beltContainer.classList.add('belt-locked'); badge.style.display = 'block';
    } else {
      trackBg.classList.remove('paused'); beltContainer.classList.remove('belt-locked'); badge.style.display = 'none';
    }
  }

  function startBeltSpawner() {
    if (gameState.spawnerInterval) clearInterval(gameState.spawnerInterval);
    spawnBeltItem();
    gameState.spawnerInterval = setInterval(() => { 
      if (!gameState.isBeltLocked) spawnBeltItem(); 
    }, 1200);
  }

  function spawnBeltItem() {
    const types = config.allowedBeltItems;
    const rType = types[Math.floor(Math.random() * types.length)];
    const container = document.getElementById('conveyor-items');
    const el = createPackageDOM(rType);
    el.classList.add('belt-item');
    
    const randomY = Math.floor(Math.random() * 50) + 10;
    el.style.top = randomY + 'px';

    const item = { element: el, type: rType, x: 10, speed: 1.8 };
    bindAction(el, () => catchItem(item));
    container.appendChild(el);
    gameState.activeBeltItems.push(item);

    checkBeltLockCondition();
  }

  function updateBeltPositions() {
    const beltComp = document.getElementById('conveyor-belt-container');
    if (!beltComp) return;
    const containerWidth = beltComp.offsetWidth;
    for (let i = gameState.activeBeltItems.length - 1; i >= 0; i--) {
      const item = gameState.activeBeltItems[i];
      if (!gameState.isBeltLocked) item.x += item.speed;
      item.element.style.left = item.x + 'px';
      if (item.x > containerWidth + 60) {
        item.element.remove();
        gameState.activeBeltItems.splice(i, 1);
        checkBeltLockCondition();
      }
    }
    requestAnimationFrame(updateBeltPositions);
  }

  function catchItem(item) {
    playChiptune('catch');
    item.element.remove();
    const idx = gameState.activeBeltItems.indexOf(item);
    if (idx > -1) gameState.activeBeltItems.splice(idx, 1);
    gameState.workbench[item.type]++;
    renderWorkbench();
    checkBeltLockCondition();
  }

  function renderWorkbench() {
    ['M', 'C', 'D', 'U'].forEach(type => {
      const cnt = document.getElementById(`content-${type}`);
      cnt.innerHTML = '';
      for (let i = 0; i < gameState.workbench[type]; i++) {
        const blk = createPackageDOM(type);
        bindAction(blk, () => sendToCarton(type));
        cnt.appendChild(blk);
      }

      const btnFuse = document.getElementById(`fuse-${type}`);
      if (btnFuse) btnFuse.style.visibility = (config.allowFuse && gameState.workbench[type] >= 10) ? 'visible' : 'hidden';

      const btnBreak = document.getElementById(`break-${type}`);
      if (btnBreak) btnBreak.style.visibility = (config.allowBreak && gameState.workbench[type] >= 1) ? 'visible' : 'hidden';
    });
  }

  function fuse(type, event) {
    if (!config.allowFuse) return;
    if (gameState.workbench[type] >= 10) {
      playChiptune('fuse');
      if (event) {
        const rect = event.target.getBoundingClientRect();
        createBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, '#ffe600', 20);
      }
      gameState.workbench[type] -= 10;
      let nextType = type === 'U' ? 'D' : (type === 'D' ? 'C' : 'M');
      gameState.workbench[nextType]++;
      renderWorkbench();
      checkBeltLockCondition();
    }
  }

  function breakDown(type, event) {
    if (!config.allowBreak) return;
    if (gameState.workbench[type] >= 1) {
      playChiptune('break');
      if (event) {
        const rect = event.target.getBoundingClientRect();
        createBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, '#ff007f', 20);
      }
      gameState.workbench[type]--;
      let lowerType = type === 'M' ? 'C' : (type === 'C' ? 'D' : 'U');
      gameState.workbench[lowerType] += 10;
      renderWorkbench();
      checkBeltLockCondition();
    }
  }

  function sendToCarton(type) {
    gameState.workbench[type]--;
    renderWorkbench();
    const box = document.getElementById('carton-box');
    const blk = createPackageDOM(type);
    blk.dataset.type = type;
    bindAction(blk, () => {
      gameState.workbench[type]++;
      blk.remove();
      renderWorkbench();
      checkBeltLockCondition();
    });
    box.appendChild(blk);
    checkBeltLockCondition();
  }

  function toggleApostrophe() {
    gameState.cartonHasApo = !gameState.cartonHasApo;
    const btn = document.getElementById('btn-toggle-apo');
    if (gameState.cartonHasApo) {
      btn.classList.add('active'); playChiptune('catch');
    } else {
      btn.classList.remove('active');
    }
  }

  function shipOrder() {
    const carton = document.getElementById('carton-box');
    const blocks = carton.querySelectorAll('.block-item');
    
    let deliveredCounts = { U: 0, D: 0, C: 0, M: 0 };
    blocks.forEach(b => { deliveredCounts[b.dataset.type]++; });

    const analysis = MathEngine.analyzeError(gameState.currentOrderVal, deliveredCounts);

    if (analysis.diffs.totalDiff === 0) {
      // SUCCÈS MATHÉMATIQUE
      playChiptune('win');
      let earnedPoints = 100 * gameState.combo;
      if (analysis.target >= 1000 && gameState.cartonHasApo) earnedPoints += 50;

      gameState.score += earnedPoints;
      if (!config.trainingMode) gameState.combo++;
      gameState.superGauge = Math.min(100, gameState.superGauge + 20);

      updateUI();
      createBurst(window.innerWidth / 2, window.innerHeight / 2, '#00ff66', 30);
      nextOrder();
    } else {
      // ÉCHEC
      playChiptune('error');
      gameState.combo = 1;
      if (!config.trainingMode) gameState.lives--;
      gameState.errorAttempts++;

      showAdaptiveFeedback(analysis);
      updateUI();

      if (gameState.lives <= 0 && !config.trainingMode) {
        alert(`PARTIE TERMINÉE !\nScore obtenu : ${gameState.score}`);
        location.reload();
      }
    }
  }

  /* ==========================================================================
     6. SYSTÈME DE FEEDBACK ADAPTATIF
     ========================================================================== */
  function showAdaptiveFeedback(analysis) {
    const level = Math.min(5, gameState.errorAttempts);
    let feedbackHTML = `<strong>Analyse de commande (Tentative ${level}/5) :</strong><br><br>`;

    if (level === 1) {
      if (analysis.diffs.totalDiff < 0) {
        feedbackHTML += `Il manque <strong>${Math.abs(analysis.diffs.totalDiff)}</strong> pour atteindre la commande.`;
      } else {
        feedbackHTML += `Il y a un surplus de <strong>${analysis.diffs.totalDiff}</strong> par rapport à la commande.`;
      }
    } else if (level === 2) {
      feedbackHTML += `Regarde attentivement le rang des : `;
      let errs = [];
      if (analysis.diffs.M !== 0) errs.push("Milliers (M)");
      if (analysis.diffs.C !== 0) errs.push("Centaines (C)");
      if (analysis.diffs.D !== 0) errs.push("Dizaines (D)");
      if (analysis.diffs.U !== 0) errs.push("Unités (U)");
      feedbackHTML += `<strong>${errs.join(', ')}</strong>.`;
    } else if (level === 3) {
      feedbackHTML += `La commande attend :<br>`;
      feedbackHTML += `• ${analysis.targetDec.M} M | ${analysis.targetDec.C} C | ${analysis.targetDec.D} D | ${analysis.targetDec.U} U<br>`;
      feedbackHTML += `Tu as actuellement livré une valeur de ${analysis.deliveredVal}.`;
    } else if (level === 4) {
      feedbackHTML += `<strong>Comparaison par position :</strong><br>`;
      feedbackHTML += `• Milliers: attendu ${analysis.targetDec.M}, livré ${analysis.deliveredDec.M}<br>`;
      feedbackHTML += `• Centaines: attendu ${analysis.targetDec.C}, livré ${analysis.deliveredDec.C}<br>`;
      feedbackHTML += `• Dizaines: attendu ${analysis.targetDec.D}, livré ${analysis.deliveredDec.D}<br>`;
      feedbackHTML += `• Unités: attendu ${analysis.targetDec.U}, livré ${analysis.deliveredDec.U}`;
    } else {
      feedbackHTML += `<strong>Conseil de fabrication :</strong><br>`;
      feedbackHTML += `Utilise la zone de travail pour regrouper ou décomposer le matériel avant de le placer dans le carton !`;
    }

    document.getElementById('inspector-feedback').innerHTML = feedbackHTML;
    document.getElementById('inspector-overlay').style.display = 'flex';
  }

  function updateUI() {
    document.getElementById('ui-score').innerText = gameState.score;
    document.getElementById('ui-combo').innerText = config.trainingMode ? '∞' : `x${gameState.combo}`;
    
    let hearts = '';
    if (config.trainingMode) {
      hearts = 'MODE ENTRAÎNEMENT';
    } else {
      for (let i = 0; i < 3; i++) {
        hearts += i < gameState.lives ? '❤️ ' : '🖤 ';
      }
    }
    document.getElementById('ui-lives').innerText = hearts;
    document.getElementById('super-gauge').style.width = `${gameState.superGauge}%`;
  }

  onMount(() => {
    ctx = canvas.getContext('2d');
    window.addEventListener('resize', resizeCanvas); 
    resizeCanvas();
    requestAnimationFrame(renderParticles);

    bindAction(document.getElementById('btn-start-game'), startGame);
    bindAction(document.getElementById('btn-ship-order'), shipOrder);
    bindAction(document.getElementById('btn-toggle-apo'), toggleApostrophe);
    bindAction(document.getElementById('btn-close-inspector'), () => {
      document.getElementById('inspector-overlay').style.display = 'none';
    });

    bindAction(document.getElementById('fuse-U'), (e) => fuse('U', e));
    bindAction(document.getElementById('fuse-D'), (e) => fuse('D', e));
    bindAction(document.getElementById('fuse-C'), (e) => fuse('C', e));

    bindAction(document.getElementById('break-M'), (e) => breakDown('M', e));
    bindAction(document.getElementById('break-C'), (e) => breakDown('C', e));
    bindAction(document.getElementById('break-D'), (e) => breakDown('D', e));

    loadSavedConfig();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (gameState.spawnerInterval) clearInterval(gameState.spawnerInterval);
    };
  });
</script>

<svelte:head>
  <title>Swiss Number Factory - Éducation Spécialisée</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">
  <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
</svelte:head>

<canvas bind:this={canvas} id="effects-canvas"></canvas>

<div id="config-screen">
  <div class="config-card">
    <h1>SWISS NUMBER FACTORY</h1>
    
    <div class="tabs">
      <button type="button" class="tab-btn active" data-tab="tab-quick" onclick={() => switchTab('tab-quick')}>CONFIGURATION RAPIDE</button>
      <button type="button" class="tab-btn" data-tab="tab-adv" onclick={() => switchTab('tab-adv')}>PARAMÈTRES AVANCÉS</button>
      <button type="button" class="tab-btn" data-tab="tab-access" onclick={() => switchTab('tab-access')}>ACCESSIBILITÉ & GAMIFICATION</button>
    </div>

    <!-- TAB 1: RAPIDE -->
    <div id="tab-quick" class="tab-content active">
      <div class="config-group">
        <label class="group-title" for="cfg-task-mode">MODE DE JEU ET TÂCHE PÉDAGOGIQUE</label>
        <select id="cfg-task-mode" style="width: 100%;">
          <option value="1">Mode 1 — PRODUCTION (Construire le nombre)</option>
          <option value="2">Mode 2 — LECTURE (Identifier le nombre représenté)</option>
          <option value="3">Mode 3 — DÉCOMPOSITION (Décomposer un nombre donné)</option>
          <option value="4">Mode 4 — TRANSFORMATION (Effectuer les fusions/décompositions)</option>
          <option value="5">Mode 5 — CONTRÔLE QUALITÉ (Corriger l'erreur de commande)</option>
          <option value="6">Mode 6 — DÉFI (Contraintes de stratégies)</option>
        </select>
      </div>

      <div class="config-group">
        <label class="group-title" for="cfg-min">INTERVALLE DES NOMBRES (1 à 10'000)</label>
        <div class="range-inputs">
          <span>MIN:</span>
          <input type="number" id="cfg-min" value="1" min="1" max="10000">
          <span>MAX:</span>
          <input type="number" id="cfg-max" value="1999" min="1" max="10000">
        </div>
      </div>
    </div>

    <!-- TAB 2: AVANCÉ -->
    <div id="tab-adv" class="tab-content">
      <div class="config-group">
        <label class="group-title" for="cfg-no-U">EXCLURE DES CHIFFRES (GÉRER LES ZÉROS INTERCALÉS)</label>
        <div class="checkbox-grid">
          <label class="checkbox-item"><input type="checkbox" id="cfg-no-U"> Sans Unités (=0U)</label>
          <label class="checkbox-item"><input type="checkbox" id="cfg-no-D"> Sans Dizaines (=0D)</label>
          <label class="checkbox-item"><input type="checkbox" id="cfg-no-C"> Sans Centaines (=0C)</label>
          <label class="checkbox-item"><input type="checkbox" id="cfg-no-M"> Sans Milliers (=0M)</label>
        </div>
      </div>

      <div class="config-group">
        <label class="group-title" for="cfg-item-U">ARTICLES GÉNÉRÉS SUR LE TAPIS</label>
        <div class="checkbox-grid">
          <label class="checkbox-item"><input type="checkbox" id="cfg-item-U" checked> Unités (U)</label>
          <label class="checkbox-item"><input type="checkbox" id="cfg-item-D" checked> Dizaines (D)</label>
          <label class="checkbox-item"><input type="checkbox" id="cfg-item-C" checked> Centaines (C)</label>
          <label class="checkbox-item"><input type="checkbox" id="cfg-item-M" checked> Milliers (M)</label>
        </div>
      </div>

      <div class="config-group">
        <label class="group-title" for="cfg-allow-fuse">AUTORISATIONS DE TRANSFORMATION</label>
        <div class="checkbox-grid">
          <label class="checkbox-item"><input type="checkbox" id="cfg-allow-fuse" checked> Fusion Autorisée</label>
          <label class="checkbox-item"><input type="checkbox" id="cfg-allow-break" checked> Décomposition Autorisée</label>
        </div>
      </div>
    </div>

    <!-- TAB 3: ACCESSIBILITÉ & GAMIFICATION -->
    <div id="tab-access" class="tab-content">
      <div class="config-group">
        <label class="group-title" for="cfg-audio">ACCESSIBILITÉ ET CONFORT DE JEU</label>
        <div class="checkbox-grid">
          <label class="checkbox-item"><input type="checkbox" id="cfg-audio" checked> Effets Sonores (ON)</label>
          <label class="checkbox-item"><input type="checkbox" id="cfg-animations" checked> Animations Visuelles (ON)</label>
          <label class="checkbox-item"><input type="checkbox" id="cfg-training-mode"> MODE ENTRAÎNEMENT (Sans pression)</label>
          <label class="checkbox-item"><input type="checkbox" id="cfg-lock-belt" checked> Pause Tapis Intelligent (+10%)</label>
        </div>
      </div>
    </div>

    <button type="button" class="btn-start" id="btn-start-game">DÉMARRER LA PRODUCTION</button>
  </div>
</div>

<header>
  <div class="stat-box">Mode: <div id="ui-level" class="stat-val">Production</div></div>
  <div class="stat-box">Score: <div id="ui-score" class="stat-val">0</div></div>
  <div class="stat-box">Combo: <div id="ui-combo" class="stat-val">x1</div></div>
  <div class="stat-box">Vies: <div id="ui-lives" class="stat-val"></div></div>
</header>
<div id="super-gauge-container"><div id="super-gauge"></div></div>

<div id="order-zone">
  <div>
    <div class="order-title">COMMANDE EN COURS : <span id="ui-badge-special"></span></div>
    <div class="order-target">
      <span id="ui-order-num" class="order-num">0</span>
      <span id="ui-order-text" class="order-text">"..."</span>
    </div>
  </div>
  <div id="ui-bonus-apo" style="display:none; color: var(--accent-yellow); font-size: 5.5pt;">
     Séparateur (')
  </div>
</div>

<div id="game-container">
  <div id="conveyor-belt-container">
    <div id="belt-status-badge"> TAPIS EN PAUSE (+10%)</div>
    <div class="belt-track" id="belt-track-bg"></div>
    <div id="conveyor-items"></div>
  </div>

  <div id="workspace">
    <div id="workbench">
      <div class="column" id="col-M">
        <div class="column-header">Milliers (M)</div>
        <div class="column-content" id="content-M"></div>
        <div class="column-actions">
          <button type="button" class="btn-action-col btn-break" id="break-M"> Décomposer 10C</button>
        </div>
      </div>
      <div class="column" id="col-C">
        <div class="column-header">Centaines (C)</div>
        <div class="column-content" id="content-C"></div>
        <div class="column-actions">
          <button type="button" class="btn-action-col btn-fuse" id="fuse-C"> Fusion 10C1M</button>
          <button type="button" class="btn-action-col btn-break" id="break-C"> Décomposer 10D</button>
        </div>
      </div>
      <div class="column" id="col-D">
        <div class="column-header">Dizaines (D)</div>
        <div class="column-content" id="content-D"></div>
        <div class="column-actions">
          <button type="button" class="btn-action-col btn-fuse" id="fuse-D"> Fusion 10D1C</button>
          <button type="button" class="btn-action-col btn-break" id="break-D"> Décomposer 10U</button>
        </div>
      </div>
      <div class="column" id="col-U">
        <div class="column-header">Unités (U)</div>
        <div class="column-content" id="content-U"></div>
        <div class="column-actions">
          <button type="button" class="btn-action-col btn-fuse" id="fuse-U"> Fusion 10U1D</button>
        </div>
      </div>
    </div>

    <div id="shipping-zone">
      <div class="carton-header">CARTON D'EXPÉDITION</div>
      <div class="carton" id="carton-box"></div>
      <div class="shipping-controls">
        <button type="button" class="btn-action btn-apo" id="btn-toggle-apo">Apostrophe (')</button>
        <button type="button" class="btn-action btn-ship" id="btn-ship-order">EXPÉDIER</button>
      </div>
    </div>
  </div>
</div>

<div id="inspector-overlay">
  <div class="inspector-card">
    <div style="font-size: 20pt; margin-bottom: 8px;">🔍</div>
    <h2 style="color: var(--accent); font-size: 8.5pt; margin-top:0;">CONTRÔLE QUALITÉ & REMÉDIATION</h2>
    <p id="inspector-feedback" style="font-size: 6pt; line-height: 1.5; color: var(--text-dim); margin: 10px 0; text-align: left;"></p>
    <button type="button" class="btn-start" id="btn-close-inspector">CORRIGER ET RÉESSAYER</button>
  </div>
</div>

<style>
  :root {
    --bg: #0d0221;
    --panel: #150833;
    --border-neon: #00f0ff;
    --accent: #ff007f;
    --accent-green: #00ff66;
    --accent-yellow: #ffe600;
    --accent-orange: #ff6600;
    --text: #ffffff;
    --text-dim: #9d99e0;
    
    --unit-color: #00f0ff;
    --dizaine-color: #ff007f;
    --centaine-color: #ffe600;
    --millier-color: #00ff66;
  }

  * { 
    box-sizing: border-box; 
    font-family: 'Press Start 2P', monospace; 
    user-select: none; 
    -webkit-user-select: none;
    touch-action: manipulation;
  }

  /* ACCESSIBILITÉ & CONFIGURATION */
  #config-screen {
    position: absolute; inset: 0; background: rgba(13, 2, 33, 0.98); z-index: 100;
    display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 15px;
  }
  .config-card {
    background: var(--panel); border: 3px solid var(--accent); border-radius: 8px;
    padding: 20px; max-width: 680px; width: 100%; box-shadow: 0 0 25px var(--accent);
    max-height: 95vh; overflow-y: auto;
  }
  .config-card h1 { text-align: center; margin-top: 0; color: var(--border-neon); font-size: 11pt; line-height: 1.4; }
  
  .tabs { display: flex; gap: 8px; margin-bottom: 15px; }
  .tab-btn { flex: 1; padding: 10px; background: #070112; border: 1px solid var(--border-neon); color: var(--text); font-size: 6pt; cursor: pointer; border-radius: 4px; }
  .tab-btn.active { background: var(--border-neon); color: #000; font-weight: bold; }

  .tab-content { display: none; }
  .tab-content.active { display: block; }

  .config-group {
    margin-bottom: 12px; background: rgba(0,0,0,0.3); padding: 10px;
    border: 1px solid var(--text-dim); border-radius: 6px;
  }
  .config-group label.group-title {
    display: block; color: var(--accent-yellow); font-size: 6.5pt; margin-bottom: 8px; line-height: 1.3;
  }
  .range-inputs { display: flex; align-items: center; gap: 8px; font-size: 6.5pt; }
  .range-inputs input[type="number"], select {
    background: #0d0221; border: 1.5px solid var(--border-neon); color: #fff; padding: 6px;
    width: 90px; font-size: 7.5pt; border-radius: 4px; text-align: center; user-select: auto;
  }
  select { width: auto; text-align: left; }

  .checkbox-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .checkbox-item { display: flex; align-items: center; gap: 6px; font-size: 6pt; cursor: pointer; }
  .checkbox-item input[type="checkbox"] { width: 20px; height: 20px; accent-color: var(--accent-green); cursor: pointer; }

  .btn-start {
    width: 100%; padding: 16px; background: var(--accent-green); color: #000; border: none;
    font-size: 10pt; font-weight: bold; cursor: pointer; margin-top: 8px; box-shadow: 0 0 15px var(--accent-green);
    border-radius: 6px;
  }

  /* HEADER */
  header {
    background: var(--panel); padding: 6px 12px; display: flex; justify-content: space-between;
    align-items: center; border-bottom: 2px solid var(--border-neon); min-height: 44px;
  }
  .stat-box { font-size: 5.5pt; color: var(--text-dim); }
  .stat-val { font-size: 8.5pt; color: var(--text); text-shadow: 0 0 8px var(--border-neon); margin-top: 2px; }

  /* BANDEAU COMMANDE XL */
  #order-zone {
    background: #060010; padding: 8px 14px; border-bottom: 3px solid var(--accent-yellow);
    display: flex; align-items: center; justify-content: space-between; gap: 10px; min-height: 60px;
  }
  .order-title { font-size: 5.5pt; color: var(--text-dim); margin-bottom: 3px; }
  .order-target { display: flex; align-items: center; gap: 10px; }
  .order-num { 
    color: var(--accent-yellow); background: #1a083a; padding: 4px 10px; 
    border: 2px solid var(--accent-yellow); font-size: 13pt; text-shadow: 0 0 10px var(--accent-yellow);
    border-radius: 4px;
  }
  .order-text { font-size: 7.5pt; color: var(--border-neon); line-height: 1.3; }

  #game-container { flex: 1; display: flex; flex-direction: column; position: relative; overflow: hidden; }
  #effects-canvas { position: absolute; inset: 0; pointer-events: none; z-index: 40; }

  /* TAPIS ROULANT ET EFFET VERROUILLÉ */
  #conveyor-belt-container {
    height: 120px; background: #05000e; border-bottom: 3px solid var(--accent); position: relative; overflow: hidden;
    transition: border-color 0.4s, background-color 0.4s;
  }
  :global(#conveyor-belt-container.belt-locked) {
    border-bottom: 4px solid var(--accent-orange); background: #1a0500;
  }
  .belt-track {
    position: absolute; inset: 0;
    background: repeating-linear-gradient(90deg, #0d0221 0px, #0d0221 60px, #1a083a 60px, #1a083a 120px);
    animation: moveBelt 2s linear infinite;
  }
  :global(.belt-track.paused) {
    animation-play-state: paused;
    background: repeating-linear-gradient(90deg, #210802 0px, #210802 60px, #3a1008 60px, #3a1008 120px);
    filter: sepia(0.6) saturate(2);
  }
  :global(.no-anim .belt-track) { animation: none !important; }
  
  #belt-status-badge {
    position: absolute; top: 6px; right: 10px; z-index: 20;
    background: rgba(255, 102, 0, 0.9); color: #fff; padding: 4px 8px;
    border-radius: 4px; font-size: 5.5pt; font-weight: bold; display: none;
    box-shadow: 0 0 10px var(--accent-orange);
  }

  @keyframes moveBelt { from { background-position: 0 0; } to { background-position: 120px 0; } }
  #conveyor-items { position: absolute; inset: 0; pointer-events: none; z-index: 10; }

  :global(.belt-item) { 
    position: absolute; cursor: pointer; pointer-events: auto; z-index: 15; 
    padding: 6px; min-width: 48px; min-height: 48px;
    display: flex; align-items: center; justify-content: center;
    touch-action: manipulation;
  }

  :global(.pack-U) { 
    width: 16px; height: 16px; border-radius: 50%; background: var(--unit-color); 
    box-shadow: 0 0 6px var(--unit-color); display: flex; align-items: center; justify-content: center;
    font-size: 4pt; color: #000; font-weight: bold;
  }
  
  :global(.pack-D) { 
    display: inline-flex; gap: 2px; padding: 3px 5px; background: rgba(255, 0, 127, 0.2); 
    border: 2px solid var(--dizaine-color); box-shadow: 0 0 8px var(--dizaine-color); border-radius: 4px; 
  }
  :global(.pack-D .pack-U) { width: 8px; height: 8px; box-shadow: none; }

  :global(.pack-C) { 
    display: inline-grid; grid-template-columns: repeat(10, 1fr); gap: 1px; padding: 3px; 
    background: rgba(255, 230, 0, 0.2); border: 2px solid var(--centaine-color); 
    box-shadow: 0 0 8px var(--centaine-color); border-radius: 4px; 
  }
  :global(.pack-C .mini-dizaine) { display: flex; flex-direction: column; gap: 1px; padding: 1px; background: rgba(0,0,0,0.5); }
  :global(.pack-C .mini-dot) { width: 3px; height: 3px; border-radius: 50%; background: var(--unit-color); }
  
  :global(.pack-M) { 
    display: inline-flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 3px 5px; background: linear-gradient(135deg, rgba(0,255,102,0.2), rgba(0,240,255,0.15)); 
    border: 2px solid var(--millier-color); box-shadow: 0 0 8px var(--millier-color); border-radius: 4px;
  }
  :global(.pack-M-grid) { display: grid; grid-template-columns: repeat(5, 1fr); gap: 2px; }
  :global(.pack-M .mini-plate) { width: 6px; height: 6px; background: var(--centaine-color); border-radius: 1px; }

  /* WORKSPACE */
  #workspace { flex: 1; display: flex; gap: 8px; padding: 6px; background: #070112; overflow: hidden; }
  #workbench { flex: 1.3; display: flex; gap: 6px; }
  .column { flex: 1; background: var(--panel); border: 1.5px solid var(--border-neon); display: flex; flex-direction: column; align-items: center; padding: 4px; position: relative; }
  .column-header { font-size: 5.5pt; color: var(--border-neon); text-shadow: 0 0 4px var(--border-neon); margin-bottom: 4px; text-align: center; }
  .column-content { flex: 1; width: 100%; display: flex; flex-wrap: wrap-reverse; gap: 4px; align-content: flex-start; overflow-y: auto; }

  :global(.block-item) { cursor: pointer; min-width: 40px; min-height: 40px; display: flex; align-items: center; justify-content: center; }

  .column-actions { display: flex; flex-direction: column; gap: 3px; width: 100%; margin-top: 4px; height: 52px; justify-content: flex-end; }
  .btn-action-col { 
    width: 100%; border: none; padding: 6px 1px; font-size: 4.5pt; cursor: pointer; 
    text-align: center; visibility: hidden; border-radius: 3px; min-height: 22px;
  }
  .btn-fuse { background: var(--accent-yellow); color: #000; box-shadow: 0 0 6px var(--accent-yellow); }
  .btn-break { background: var(--accent); color: #fff; box-shadow: 0 0 6px var(--accent); }

  /* LIVRAISON */
  #shipping-zone { flex: 0.8; background: var(--panel); border: 2px solid var(--accent-green); padding: 6px; display: flex; flex-direction: column; gap: 6px; }
  .carton-header { font-size: 5.5pt; color: var(--accent-green); text-shadow: 0 0 4px var(--accent-green); text-align: center; }
  .carton { flex: 1; border: 2px dashed var(--text-dim); border-radius: 4px; display: flex; flex-wrap: wrap; align-content: flex-start; padding: 6px; gap: 4px; overflow-y: auto; background: #0a031a; }
  
  .shipping-controls { display: flex; gap: 6px; }
  .btn-action { flex: 1; padding: 12px 2px; border: none; font-size: 5.5pt; cursor: pointer; border-radius: 4px; min-height: 44px; }
  .btn-ship { background: var(--accent-green); color: #000; box-shadow: 0 0 10px var(--accent-green); font-weight: bold; }
  .btn-apo { background: var(--accent-yellow); color: #000; box-shadow: 0 0 10px var(--accent-yellow); }
  :global(.btn-apo.active) { background: #fff; color: #000; box-shadow: 0 0 12px #fff; }

  #inspector-overlay { position: absolute; inset: 0; background: rgba(5, 0, 15, 0.95); z-index: 50; display: none; flex-direction: column; align-items: center; justify-content: center; padding: 15px; }
  .inspector-card { background: var(--panel); border: 3px solid var(--accent); border-radius: 8px; padding: 20px; max-width: 520px; width: 100%; text-align: center; }
  #super-gauge-container { width: 100%; height: 6px; background: #1a083a; border-bottom: 1px solid var(--border-neon); }
  #super-gauge { width: 0%; height: 100%; background: var(--accent-yellow); transition: width 0.3s; }
</style>