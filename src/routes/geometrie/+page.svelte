<script lang="ts">
  // ==========================================
  // 1. IMPORTATIONS ET CONFIGURATION DES TYPES
  // ==========================================
  import { onMount } from 'svelte';
  import { getStudentName, submitActivityResult } from '$lib/client/activity';

  type Level = '6H' | '7H' | '8H';
  type Mode = 'A' | 'B' | 'C' | 'D' | 'Mixte';
  type PlayMode = 'A' | 'B' | 'C' | 'D';
  
  type Shape = {
    name: string;
    kind: 'plane' | 'solid';
    isTriangle: boolean;
    levels: Level[];
    vocab: string;
    hints: string[];
  };

  // ==========================================
  // 2. BASE DE DONNÉES DES FIGURES
  // ==========================================
  const shapes: Shape[] = [
    { name: 'Triangle quelconque', kind: 'plane', isTriangle: true, levels: ['6H','7H','8H'], vocab: 'Un triangle classique, 3 côtés de longueurs différentes.', hints: ['Je possède exactement 3 côtés.', 'Mes trois côtés n\'ont pas la même longueur.', 'Je ne possède aucun angle droit.'] },
    { name: 'Triangle rectangle', kind: 'plane', isTriangle: true, levels: ['7H','8H'], vocab: 'Possède 1 angle droit mesurable à l\'équerre.', hints: ['Je suis une figure à 3 côtés.', 'Je possède un angle droit parfait.', 'Tu peux vérifier mon coin droit avec une équerre.'] },
    { name: 'Triangle isocèle', kind: 'plane', isTriangle: true, levels: ['8H'], vocab: 'Possède 2 côtés de même longueur et 1 axe de symétrie.', hints: ['Je possède 3 côtés.', 'Deux de mes côtés ont exactement la même mesure.', 'Je possède 1 axe de symétrie unique.'] },
    { name: 'Triangle équilatéral', kind: 'plane', isTriangle: true, levels: ['8H'], vocab: 'Possède 3 côtés de même longueur et 3 axes de symétrie.', hints: ['Je suis un triangle parfaitement régulier.', 'Mes 3 côtés sont rigoureusement égaux.', 'J\'ai 3 axes de symétrie différents.'] },
    { name: 'Triangle isocèle rectangle', kind: 'plane', isTriangle: true, levels: ['8H'], vocab: '1 angle droit et 2 côtés égaux.', hints: ['Je mixe deux propriétés différentes.', 'J\'ai un angle droit ET deux côtés de même longueur.', 'Je suis comme un carré parfait plié en deux sur sa diagonale.'] },
    { name: 'Carré', kind: 'plane', isTriangle: false, levels: ['6H','7H','8H'], vocab: '4 côtés égaux, 4 angles droits, 4 axes de symétrie.', hints: ['Je suis un quadrilatère à 4 côtés égaux.', 'J\'ai 4 angles droits et mes côtés opposés sont parallèles.', 'J\'ai exactement 4 axes de symétrie.'] },
    { name: 'Rectangle', kind: 'plane', isTriangle: false, levels: ['6H','7H','8H'], vocab: 'Côtés opposés égaux, 4 angles droits, 2 axes de symétrie.', hints: ['Je suis un quadrilatère allongé.', 'Mes côtés opposés sont parallèles et égaux, et j\'ai 4 angles droits.', 'J\'ai seulement 2 axes de symétrie.'] },
    { name: 'Cercle', kind: 'plane', isTriangle: false, levels: ['6H','7H','8H'], vocab: 'Ligne courbe fermée, aucun côté droit.', hints: ['On me trace à l\'aide d\'un compas.', 'Tous mes points extérieurs sont à égale distance du centre.', 'Je possède une infinité d\'axes de symétrie.'] },
    { name: 'Losange', kind: 'plane', isTriangle: false, levels: ['7H','8H'], vocab: '4 côtés égaux, 2 axes de symétrie.', hints: ['Je suis un quadrilatère avec 4 côtés égaux.', 'Mes angles ne sont pas obligatoirement droits.', 'Mes diagonales forment mes 2 uniques axes de symétrie.'] },
    { name: 'Parallélogramme', kind: 'plane', isTriangle: false, levels: ['7H','8H'], vocab: 'Côtés opposés égaux et parallèles, aucun axe de symétrie.', hints: ['Mes côtés face-à-face sont parallèles et égaux.', 'Je ressemble à un rectangle sur lequel on aurait poussé.', 'Je n\'ai aucun axe de symétrie.'] },
    { name: 'Trapèze quelconque', kind: 'plane', isTriangle: false, levels: ['7H','8H'], vocab: 'Possède uniquement 2 côtés opposés parallèles.', hints: ['Je suis un quadrilatère avec seulement 2 côtés parallèles.', 'Mes deux lignes parallèles s\'appellent la grande et la petite base.', 'Mes autres côtés ne sont pas du tout parallèles.'] },
    { name: 'Cerf-volant', kind: 'plane', isTriangle: false, levels: ['7H','8H'], vocab: '2 paires de côtés adjacents égaux, 1 axe de symétrie.', hints: ['Je suis un quadrilatère qui porte le nom d\'un jouet volant.', 'J\'ai deux paires de côtés collés qui sont de même taille.', 'Une seule de mes diagonales est un axe de symétrie.'] },
    { name: 'Fer de lance', kind: 'plane', isTriangle: false, levels: ['7H','8H'], vocab: 'En forme de flèche avec un angle rentrant.', hints: ['Je suis un quadrilatère non convexe en forme de flèche.', 'J\'ai un grand angle creux appelé angle rentrant.', 'Je possède un seul axe de symétrie séparant ma pointe.'] },
    { name: 'Trapèze rectangle', kind: 'plane', isTriangle: false, levels: ['8H'], vocab: '2 côtés parallèles et possède exactement 2 angles droits.', hints: ['Je suis de la famille des trapèzes.', 'En plus de mes 2 lignes parallèles, j\'ai 2 angles droits.', 'Mon côté latéral forme un angle parfait avec mes bases.'] },
    { name: 'Trapèze isocèle', kind: 'plane', isTriangle: false, levels: ['8H'], vocab: '2 côtés parallèles, 2 autres côtés égaux, 1 axe de symétrie.', hints: ['Je suis un trapèze symétrique.', 'Mes deux bases sont parallèles, et mes deux côtés penchés ont la même taille.', 'Je possède 1 axe de symétrie vertical.'] },
    { name: 'Cube', kind: 'solid', isTriangle: false, levels: ['7H','8H'], vocab: '6 faces carrées identiques, 12 arêtes égales, 8 sommets.', hints: ['Je suis un solide en 3D volumétrique.', 'Mes 6 faces sont toutes des carrés identiques.', 'J\'ai 12 arêtes et 8 sommets.'] },
    { name: 'Pavé droit', kind: 'solid', isTriangle: false, levels: ['7H','8H'], vocab: '6 faces rectangulaires, 12 arêtes, 8 sommets.', hints: ['Je suis un solide comparable à une boîte.', 'Mes 6 faces sont toutes des rectangles.', 'J\'ai 8 sommets et 12 arêtes.'] },
    { name: 'Pyramide à base carrée', kind: 'solid', isTriangle: false, levels: ['7H','8H'], vocab: '1 base carrée, 4 faces triangulaires, 5 sommets.', hints: ['Je m\'élève en pointe depuis une base au sol.', 'Ma base est un carré, mais mes 4 autres faces sont des triangles.', 'Je possède 5 sommets au total.'] },
    { name: 'Tétraèdre', kind: 'solid', isTriangle: false, levels: ['7H','8H'], vocab: 'Pyramide à base triangulaire : 4 faces, 4 sommets.', hints: ['Je suis un solide composé uniquement de triangles.', 'J\'ai exactement 4 faces triangulaires.', 'Je possède 4 sommets et 6 arêtes.'] }
  ];

  // ==========================================
  // 3. ÉTATS RÉACTIFS DU JEU
  // ==========================================
  let studentName = 'Explorateur';
  let phase: 'config' | 'play' | 'done' = 'config';
  let level: Level | '' = '';
  let mode: Mode | '' = '';
  let question = 1;
  let score = 0;
  let xp = 0;
  
  let currentMode: PlayMode = 'A';
  let current: Shape = shapes[0];
  let options: Shape[] = [];
  let hintsShown = 1;
  let points = 30;
  
  let feedback = '';
  let feedbackDetails = '';
  let blocked = false;
  let errorFamilies: any[] = [];
  
  let isXlMode = false;
  let showAideModal = false;
  let showRadarModal = false;

  onMount(() => {
    studentName = getStudentName();
  });

  function availableShapes(): Shape[] {
    return shapes.filter((shape) => level && shape.levels.includes(level));
  }

  function shuffle<T>(items: T[]): T[] {
    return [...items].sort(() => Math.random() - 0.5);
  }

  function choose<T>(items: T[]): T {
    return items[Math.floor(Math.random() * items.length)];
  }

  function startMission() {
    if (!level || !mode) return;
    phase = 'play';
    question = 1;
    score = 0;
    xp = 0;
    errorFamilies = [];
    loadQuestion();
  }

  function loadQuestion() {
    if (question > 10) {
      finishMission();
      return;
    }

    blocked = false;
    feedback = '';
    feedbackDetails = '';
    currentMode = mode === 'Mixte' ? choose<PlayMode>(['A', 'B', 'C', 'D']) : (mode as PlayMode);

    if (currentMode === 'A') generateModeA();
    else if (currentMode === 'B') generateModeB();
    else if (currentMode === 'C') generateModeC();
    else generateModeD();
  }

  function generateModeA() {
    points = 30;
    hintsShown = 1;
    current = choose(availableShapes());
    let pool = availableShapes().filter(s => s.name !== current.name && s.isTriangle === current.isTriangle);
    if (pool.length < 3) pool = availableShapes().filter(s => s.name !== current.name);
    options = shuffle([current, ...shuffle(pool).slice(0, 3)]);
  }

  function generateModeB() {
    points = 15;
    const groupKind: 'plane' | 'solid' = Math.random() > 0.5 ? 'plane' : 'solid';
    let group = availableShapes().filter((s) => s.kind === groupKind);
    let other = availableShapes().filter((s) => s.kind !== groupKind);
    
    if (group.length < 3 || other.length < 1) {
      group = availableShapes().filter((s) => s.kind !== groupKind);
      other = availableShapes().filter((s) => s.kind === groupKind);
    }
    
    const base = shuffle(group).slice(0, 3);
    current = choose(other);
    if (!current) current = choose(availableShapes().filter(s => !base.includes(s))); 
    
    options = shuffle([current, ...base]);
  }

  function generateModeC() {
    points = 10;
    current = choose(availableShapes());
    options = [];
  }

  function generateModeD() {
    points = 30;
    current = choose(availableShapes());
    const pool = availableShapes().filter(s => s.name !== current.name);
    options = shuffle([current, ...shuffle(pool).slice(0, 5)]);
  }

  function showHint() {
    if (currentMode !== 'A' || blocked || hintsShown >= current.hints.length) return;
    hintsShown += 1;
    points = Math.max(10, points - 10);
  }

  function lireConsigneAudio() {
    let texte = "";
    if (currentMode === 'A') texte = "Mode Qui suis-je. Écoute bien : " + current.hints[0];
    else if (currentMode === 'B') texte = "Mode L'Intrus Visuel. Élimine l'intrus.";
    else if (currentMode === 'C') texte = "Mode Tri. Le " + current.name + " est-il une figure plane ou un solide ?";
    else if (currentMode === 'D') texte = "Mode Qui est-ce. Trouve la forme correspondante aux indices.";

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(texte);
      utterance.lang = 'fr-CH';
      window.speechSynthesis.speak(utterance);
    }
  }

  function answer(selected: string) {
    if (blocked) return;
    blocked = true;

    const isCorrect = currentMode === 'C' ? selected === current.kind : selected === current.name;
    
    if (isCorrect) {
      score += 1;
      xp += points;
      feedback = `🟢 ANALYSE VALIDE (+${points} XP)`;
      feedbackDetails = '';
    } else {
      let expectedName = currentMode === 'C' ? (current.kind === 'plane' ? 'Figure plane (2D)' : 'Solide (3D)') : current.name;
      let selectedShape = shapes.find(s => s.name === selected);
      
      errorFamilies = [...errorFamilies, { target: current.name, answered: selected, mode: currentMode }];
      
      feedback = `🔴 APPRENTISSAGE EN COURS`;
      feedbackDetails = `L'élément recherché était le <strong>${expectedName}</strong> (${current.vocab}).<br>Tu as confondu avec : <strong>${selected}</strong> ${selectedShape ? '(' + selectedShape.vocab + ')' : ''}.`;
    }

    window.setTimeout(() => {
      question += 1;
      loadQuestion();
    }, isCorrect ? 2000 : 5500);
  }

  async function finishMission() {
    phase = 'done';
    await submitActivityResult({
      studentName,
      world: 'geometrie',
      mission: `${level} mode ${mode}`,
      score,
      total: 10,
      scoreBasis: 'last',
      errorCount: 10 - score,
      errorFamilies: errorFamilies,
      metadata: { xp }
    });
  }

  // Vérifie si c'est un solide pour aiguiller le template HTML
  function isSolid(name: string): boolean {
    return ['Cube', 'Pavé droit', 'Pyramide à base carrée', 'Tétraèdre'].includes(name);
  }

  // Renvoie le code des figures planes (2D) uniquement
  function renderPlaneSVG(name: string, customClass = ""): string {
    const s = `<svg class="${customClass}" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="5" stroke-linejoin="round" style="width:100%; height:100%; display:block;">`;
    const e = `</svg>`;
    switch (name) {
      case 'Triangle quelconque': return s + `<polygon points="12,20 88,38 32,88"/>` + e;
      case 'Triangle rectangle': return s + `<polygon points="15,12 15,88 88,88"/><polyline points="15,73 30,73 30,88"/>` + e;
      case 'Triangle isocèle': return s + `<polygon points="50,12 12,88 88,88"/><line x1="31" y1="50" x2="41" y2="50"/>` + e;
      case 'Triangle équilatéral': return s + `<polygon points="50,12 10,86 90,86"/>` + e;
      case 'Triangle isocèle rectangle': return s + `<polygon points="15,15 15,85 85,85"/><polyline points="15,70 30,70 30,85"/>` + e;
      case 'Carré': return s + `<rect x="12" y="12" width="76" height="76"/>` + e;
      case 'Rectangle': return s + `<rect x="8" y="22" width="84" height="56"/>` + e;
      case 'Cercle': return s + `<circle cx="50" cy="50" r="42"/>` + e;
      case 'Losange': return s + `<polygon points="50,8 92,50 50,92 8,50"/>` + e;
      case 'Parallélogramme': return s + `<polygon points="32,18 92,18 68,82 8,82"/>` + e;
      case 'Trapèze quelconque': return s + `<polygon points="28,22 72,22 92,78 8,78"/>` + e;
      case 'Cerf-volant': return s + `<polygon points="50,8 92,42 50,92 8,42"/><line x1="50" y1="8" x2="50" y2="92" stroke-dasharray="4,4"/>` + e;
      case 'Fer de lance': return s + `<polygon points="50,8 92,92 50,66 8,92"/>` + e;
      case 'Trapèze rectangle': return s + `<polygon points="20,22 78,22 92,78 20,78"/><polyline points="20,37 35,37 35,22"/>` + e;
      case 'Trapèze isocèle': return s + `<polygon points="28,22 72,22 92,78 8,78"/>` + e;
      default: return s + `<text x="50" y="55" font-size="24" text-anchor="middle" fill="currentColor" stroke="none">?</text>` + e;
    }
  }
</script>

<svelte:head>
  <title>Secteur : Géométrie — Hub de Mission</title>
</svelte:head>

<!-- BLOC DE CONFIGURATION DES STYLES POUR LA PERSPÉCTIVE COMPATIBLE TOUS NAVIGATEURS -->
<div class="dark-page page" class:xl-mode={isXlMode}>
  <header class="dark-header">
    <div class="header-inner">
      <div class="brand"><span class="brand-icon">📐</span><div><h1 class="brand-title">Secteur : Géométrie</h1><p class="brand-subtitle">Agent : {studentName}</p></div></div>
      <div class="actions">
        <button class="btn dark" type="button" on:click={() => (isXlMode = !isXlMode)}>
          {isXlMode ? '♿ Boutons XL' : '🚳 Boutons Standard'}
        </button>
        <a class="btn dark" href="/">↩ QG</a>
      </div>
    </div>
  </header>

  <main class="main">
    <!-- PANNEAU CONFIGURATION DE DÉPART (RESTE STANDARD ET BEAU) -->
    {#if phase === 'config'}
      <section class="dark-card stack" style="max-width: 50rem; margin: 0 auto;">
        <div class="center"><h2>Configuration de la Mission</h2><p class="muted">Paramètre ton module d’entraînement géométrique.</p></div>
        
        <div class="stack">
          <strong class="kicker">1. Niveau de l’Agent</strong>
          <div class="grid" style="grid-template-columns: repeat(3, 1fr);">
            {#each ['6H','7H','8H'] as item}
              <button class="dark-option" class:selected={level === item} type="button" on:click={() => (level = item as Level)}>{item}</button>
            {/each}
          </div>
        </div>
        
        <div class="stack">
          <strong class="kicker">2. Mode d’analyse</strong>
          <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));">
            <button class="dark-option" class:selected={mode === 'A'} type="button" on:click={() => (mode = 'A')}>🔍 Qui suis-je ?</button>
            <button class="dark-option" class:selected={mode === 'B'} type="button" on:click={() => (mode = 'B')}>⚠️ L’intrus</button>
            <button class="dark-option" class:selected={mode === 'C'} type="button" on:click={() => (mode = 'C')}>📦 2D vs 3D</button>
            <button class="dark-option" class:selected={mode === 'D'} type="button" on:click={() => (mode = 'D')}>🕵️ Qui-est-ce</button>
            <button class="dark-option" style="grid-column: 1 / -1;" class:selected={mode === 'Mixte'} type="button" on:click={() => (mode = 'Mixte')}>🎲 Aléatoire</button>
          </div>
        </div>
        
        <button class="btn primary" disabled={!level || !mode} type="button" on:click={startMission}>Initialiser la Mission 🚀</button>
      </section>
      
    <!-- ZONE ACTIVE DU JEU (LÀ OÙ LES OPTIONS DE DEVIN देवेंद्र DEVIENNENT GRANDES) -->
    {:else if phase === 'play'}
      <section class="dark-card stack play-zone" class:error-state={feedback.startsWith('🔴')} class:success-state={feedback.startsWith('🟢')}>
        <div class="mission-top">
          <div>
            <span class="badge">Analyse {Math.min(question, 10)} / 10</span>
            <span class="badge">Mode {currentMode}</span>
          </div>
          <div class="actions">
            <button class="btn dark small" on:click={() => (showAideModal = true)}>📘 Aide-Mémoire</button>
            <span class="badge xp">XP : {xp}</span>
          </div>
        </div>

        <div class="tools-floating">
          <button class="tool-btn audio" on:click={lireConsigneAudio} title="Écouter">🔊</button>
          {#if currentMode === 'A'}
            <button class="tool-btn hint" class:hidden={hintsShown >= current.hints.length || blocked} on:click={showHint} title="Indice">💡</button>
            <button class="tool-btn radar" on:click={() => (showRadarModal = true)} title="Radar">👁️</button>
          {/if}
        </div>

        {#if currentMode === 'A'}
          <div class="dark-card compact center">
            <p class="kicker">Flux d’indices détectés</p>
            {#each current.hints.slice(0, hintsShown) as hint}
              <p class="italic-hint">« {hint} »</p>
            {/each}
          </div>
          <div class="grid" style="grid-template-columns: repeat(2, 1fr);">
            {#each options as option}
              <button class="dark-option" type="button" on:click={() => answer(option.name)}>{option.name}</button>
            {/each}
          </div>
          
        {:else if currentMode === 'B'}
          <div class="center"><p class="kicker">Analyse des structures</p><p class="muted">Élimine l’intrus qui rompt la règle du groupe.</p></div>
          <div class="grid" style="grid-template-columns: repeat(2, 1fr);">
            {#each options as option}
              <button class="dark-option stack center" type="button" on:click={() => answer(option.name)}>
                <span class="shape-box">
                  {#if isSolid(option.name)}
                    <div class="scene3d">
                      <div class="cube3d c-{option.name.toLowerCase().replace(/ /g, '-')}">
                        {#if option.name === 'Cube'}
                          <div class="face3d f-front"></div><div class="face3d f-back"></div>
                          <div class="face3d f-left"></div><div class="face3d f-right"></div>
                          <div class="face3d f-top"></div><div class="face3d f-bottom"></div>
                        {:else if option.name === 'Pavé droit'}
                          <div class="face3d p-front"></div><div class="face3d p-back"></div>
                          <div class="face3d p-left"></div><div class="face3d p-right"></div>
                          <div class="face3d p-top"></div><div class="face3d p-bottom"></div>
                        {:else if option.name === 'Pyramide à base carrée'}
                          <div class="face3d pyr-base"></div>
                          <div class="face3d pyr-f1"></div><div class="face3d pyr-f2"></div>
                          <div class="face3d pyr-f3"></div><div class="face3d pyr-f4"></div>
                        {:else if option.name === 'Tétraèdre'}
                          <div class="face3d tetra-base"></div>
                          <div class="face3d tetra-f1"></div><div class="face3d tetra-f2"></div>
                          <div class="face3d tetra-f3"></div>
                        {/if}
                      </div>
                    </div>
                  {:else}
                    {@html renderPlaneSVG(option.name, "svg-icon")}
                  {/if}
                </span>
                <span>{option.name}</span>
              </button>
            {/each}
          </div>
          
        {:else if currentMode === 'C'}
          <div class="dark-card compact center stack">
            <p class="kicker">Élément à classifier</p>
            <h2>{current.name}</h2>
            <span class="shape-box large">
              {#if isSolid(current.name)}
                <div class="scene3d lg">
                  <div class="cube3d scale-lg c-{current.name.toLowerCase().replace(/ /g, '-')}">
                    {#if current.name === 'Cube'}
                      <div class="face3d f-front"></div><div class="face3d f-back"></div>
                      <div class="face3d f-left"></div><div class="face3d f-right"></div>
                      <div class="face3d f-top"></div><div class="face3d f-bottom"></div>
                    {:else if current.name === 'Pavé droit'}
                      <div class="face3d p-front"></div><div class="face3d p-back"></div>
                      <div class="face3d p-left"></div><div class="face3d p-right"></div>
                      <div class="face3d p-top"></div><div class="face3d p-bottom"></div>
                    {:else if current.name === 'Pyramide à base carrée'}
                      <div class="face3d pyr-base"></div>
                      <div class="face3d pyr-f1"></div><div class="face3d pyr-f2"></div>
                      <div class="face3d pyr-f3"></div><div class="face3d pyr-f4"></div>
                    {:else if current.name === 'Tétraèdre'}
                      <div class="face3d tetra-base"></div>
                      <div class="face3d tetra-f1"></div><div class="face3d tetra-f2"></div>
                      <div class="face3d tetra-f3"></div>
                    {/if}
                  </div>
                </div>
              {:else}
                {@html renderPlaneSVG(current.name, "svg-icon-large")}
              {/if}
            </span>
          </div>
          <div class="grid" style="grid-template-columns: repeat(2, 1fr);">
            <button class="dark-option center stack" type="button" on:click={() => answer('plane')}><span class="icon-xl">📥</span><span>Figure plane (2D)</span></button>
            <button class="dark-option center stack" type="button" on:click={() => answer('solid')}><span class="icon-xl">📥</span><span>Solide (3D)</span></button>
          </div>
          
        {:else if currentMode === 'D'}
          <div class="dark-card compact center">
            <p class="kicker">Fiche de la cible</p>
            <ul style="list-style: none; padding: 0; margin: 0; font-style: italic; color: #a5f3fc;">
              <li>• {current.hints[0]}</li>
              <li>• {current.hints[1]}</li>
              <li>• {current.hints[2]}</li>
            </ul>
          </div>
          <div class="grid" style="grid-template-columns: repeat(3, 1fr);">
            {#each options as option}
              <button class="dark-option stack center mini" type="button" on:click={() => answer(option.name)}>
                <span class="shape-box mini">
                  {#if isSolid(option.name)}
                    <div class="scene3d sm">
                      <div class="cube3d scale-sm c-{option.name.toLowerCase().replace(/ /g, '-')}">
                        {#if option.name === 'Cube'}
                          <div class="face3d f-front"></div><div class="face3d f-back"></div>
                          <div class="face3d f-left"></div><div class="face3d f-right"></div>
                          <div class="face3d f-top"></div><div class="face3d f-bottom"></div>
                        {:else if option.name === 'Pavé droit'}
                          <div class="face3d p-front"></div><div class="face3d p-back"></div>
                          <div class="face3d p-left"></div><div class="face3d p-right"></div>
                          <div class="face3d p-top"></div><div class="face3d p-bottom"></div>
                        {:else if option.name === 'Pyramide à base carrée'}
                          <div class="face3d pyr-base"></div>
                          <div class="face3d pyr-f1"></div><div class="face3d pyr-f2"></div>
                          <div class="face3d pyr-f3"></div><div class="face3d pyr-f4"></div>
                        {:else if option.name === 'Tétraèdre'}
                          <div class="face3d tetra-base"></div>
                          <div class="face3d tetra-f1"></div><div class="face3d tetra-f2"></div>
                          <div class="face3d tetra-f3"></div>
                        {/if}
                      </div>
                    </div>
                  {:else}
                    {@html renderPlaneSVG(option.name, "svg-icon-mini")}
                  {/if}
                </span>
                <span class="text-mini">{option.name}</span>
              </button>
            {/each}
          </div>
        {/if}

        {#if feedback}
          <div class="feedback-panel">
            <p class:good={feedback.startsWith('🟢')} class:bad={feedback.startsWith('🔴')} class="feedback-title">{feedback}</p>
            {#if feedbackDetails}
              <p class="feedback-details">{@html feedbackDetails}</p>
            {/if}
          </div>
        {/if}
      </section>
      
    {:else}
      <section class="dark-card stack center" style="max-width: 36rem; margin: 0 auto;">
        <h2>🏁 Rapport de Mission Validé</h2>
        <div class="score-display">
          <div class="score-box"><p class="kicker">XP Totale</p><p class="score xp">{xp}</p></div>
          <div class="score-box"><p class="kicker">Précision</p><p class="score">{score} / 10</p></div>
        </div>
        <p>{score === 10 ? '⚡ Secteur géométrique entièrement maîtrisé !' : score >= 7 ? '👍 Très bon travail !' : '🔍 Mission accomplie. Relis l\'aide-mémoire pour corriger les failles.'}</p>
        <div class="actions" style="justify-content: center;"><button class="btn primary" type="button" on:click={startMission}>Rejouer</button><a class="btn dark" href="/">Retour au QG</a></div>
      </section>
    {/if}
  </main>
</div>

<!-- MODALS -->
{#if showAideModal}
  <div class="modal-backdrop" on:click={() => (showAideModal = false)}>
    <div class="modal-content aide-modal" on:click|stopPropagation>
      <div class="modal-header"><h3>📘 Aide-Mémoire (PER)</h3><button on:click={() => (showAideModal = false)}>✕</button></div>
      <div class="modal-body">
        <strong class="kicker">🔺 Triangles</strong>
        <div class="aide-grid">
          {#each shapes.filter(s => s.isTriangle) as s}
            <div class="aide-card"><span>{s.name}</span><div class="shape-box">{@html renderPlaneSVG(s.name, 'svg-icon')}</div><p>{s.vocab}</p></div>
          {/each}
        </div>
        <strong class="kicker mt-4">🟩 Figures Planes</strong>
        <div class="aide-grid">
          {#each shapes.filter(s => !s.isTriangle && s.kind === 'plane') as s}
            <div class="aide-card"><span>{s.name}</span><div class="shape-box">{@html renderPlaneSVG(s.name, 'svg-icon')}</div><p>{s.vocab}</p></div>
          {/each}
        </div>
        <strong class="kicker mt-4">📦 Solides</strong>
        <div class="aide-grid">
          {#each shapes.filter(s => s.kind === 'solid') as s}
            <div class="aide-card">
              <span>{s.name}</span>
              <div class="shape-box">
                <div class="scene3d sm">
                  <div class="cube3d scale-sm c-{s.name.toLowerCase().replace(/ /g, '-')}">
                    {#if s.name === 'Cube'}
                      <div class="face3d f-front"></div><div class="face3d f-back"></div>
                      <div class="face3d f-left"></div><div class="face3d f-right"></div>
                      <div class="face3d f-top"></div><div class="face3d f-bottom"></div>
                    {:else if s.name === 'Pavé droit'}
                      <div class="face3d p-front"></div><div class="face3d p-back"></div>
                      <div class="face3d p-left"></div><div class="face3d p-right"></div>
                      <div class="face3d p-top"></div><div class="face3d p-bottom"></div>
                    {:else if s.name === 'Pyramide à base carrée'}
                      <div class="face3d pyr-base"></div>
                      <div class="face3d pyr-f1"></div><div class="face3d pyr-f2"></div>
                      <div class="face3d pyr-f3"></div><div class="face3d pyr-f4"></div>
                    {:else if s.name === 'Tétraèdre'}
                      <div class="face3d tetra-base"></div>
                      <div class="face3d tetra-f1"></div><div class="face3d tetra-f2"></div>
                      <div class="face3d tetra-f3"></div>
                    {/if}
                  </div>
                </div>
              </div>
              <p>{s.vocab}</p>
            </div>
          {/each}
        </div>
      </div>
    </div>
  </div>
{/if}

{#if showRadarModal}
  <div class="modal-backdrop" on:click={() => (showRadarModal = false)}>
    <div class="modal-content radar-modal center" on:click|stopPropagation>
      <h3 class="kicker">Radar Géométrique</h3>
      <div class="shape-box huge my-4">
        {#if isSolid(current.name)}
          <div class="scene3d lg">
            <div class="cube3d scale-huge c-{current.name.toLowerCase().replace(/ /g, '-')}">
              {#if current.name === 'Cube'}
                <div class="face3d f-front"></div><div class="face3d f-back"></div>
                <div class="face3d f-left"></div><div class="face3d f-right"></div>
                <div class="face3d f-top"></div><div class="face3d f-bottom"></div>
              {:else if current.name === 'Pavé droit'}
                <div class="face3d p-front"></div><div class="face3d p-back"></div>
                <div class="face3d p-left"></div><div class="face3d p-right"></div>
                <div class="face3d p-top"></div><div class="face3d p-bottom"></div>
              {:else if current.name === 'Pyramide à base carrée'}
                <div class="face3d pyr-base"></div>
                <div class="face3d pyr-f1"></div><div class="face3d pyr-f2"></div>
                <div class="face3d pyr-f3"></div><div class="face3d pyr-f4"></div>
              {:else if current.name === 'Tétraèdre'}
                <div class="face3d tetra-base"></div>
                <div class="face3d tetra-f1"></div><div class="face3d tetra-f2"></div>
                <div class="face3d tetra-f3"></div>
              {/if}
            </div>
          </div>
        {:else}
          {@html renderPlaneSVG(current.name, "svg-icon-huge")}
        {/if}
      </div>
      <button class="btn dark" on:click={() => (showRadarModal = false)}>Fermer</button>
    </div>
  </div>
{/if}

<style>
  .center { text-align: center; }
  .stack { display: flex; flex-direction: column; gap: 1.5rem; }
  .grid { display: grid; gap: 1rem; }
  .mt-4 { margin-top: 1rem; }
  .my-4 { margin: 1rem 0; }
  
  .badge.xp { color: var(--gold, #fbbf24); border-color: var(--gold, #fbbf24); }
  .kicker { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--cyan, #22d3ee); }
  .italic-hint { font-style: italic; color: #cbd5e1; margin: 0.5rem 0; }
  
  /* Options standard (Écran de configuration) */
  .dark-option {
    background: #172033; 
    border: 2px solid #2e3e65; 
    border-radius: 0.75rem; 
    padding: 1rem; 
    color: #f1f5f9;
    font-weight: bold; 
    cursor: pointer; 
    transition: all 0.2s;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .dark-option:hover { border-color: #22d3ee; }
  .dark-option.selected { background: #0e3f47; border-color: #22d3ee; box-shadow: 0 0 12px rgba(34, 211, 238, 0.2); }
  
  /* Isolement en cours de jeu */
  .play-zone .dark-option { min-height: 140px; }
  .play-zone .dark-option.mini { padding: 0.4rem; gap: 0.4rem; width: 100%; height: 155px; box-sizing: border-box; }
  .text-mini { font-size: 0.65rem; text-transform: uppercase; margin-top: auto; color: #e2e8f0; text-align: center; }
  
  .icon-xl { font-size: 2rem; margin-bottom: 0.5rem; }
  .xl-mode .play-zone .dark-option { min-height: 180px; font-size: 1.15rem; }
  .xl-mode .play-zone .dark-option.mini { height: 190px; }

  .tools-floating { position: absolute; top: 1rem; right: 1rem; display: flex; gap: 0.5rem; z-index: 10; }
  .tool-btn { width: 2.5rem; height: 2.5rem; border-radius: 50%; border: 1px solid; display: flex; align-items: center; justify-content: center; cursor: pointer; }
  .tool-btn.hidden { display: none; }
  .tool-btn.audio { background: #3b0764; border-color: #9333ea; color: #d8b4fe; }
  .tool-btn.hint { background: #422006; border-color: #d97706; color: #fcd34d; }
  .tool-btn.radar { background: #083344; border-color: #0891b2; color: #67e8f9; }

  .feedback-panel { margin-top: 1rem; padding: 1rem; border-radius: 0.75rem; text-align: center; }
  .error-state .feedback-panel { background: rgba(159, 18, 57, 0.2); border: 1px solid #e11d48; }
  .success-state .feedback-panel { background: rgba(6, 78, 59, 0.2); border: 1px solid #10b981; }
  .feedback-title { font-weight: 900; margin-bottom: 0.5rem; }
  .feedback-title.bad { color: #f43f5e; }
  .feedback-title.good { color: #34d399; }
  .feedback-details { font-size: 0.875rem; color: #cbd5e1; line-height: 1.4; }

  .score-display { display: flex; gap: 2rem; justify-content: center; margin: 2rem 0; }
  .score-box { background: #090d16; border: 1px solid #24324f; padding: 1.5rem; border-radius: 1rem; min-width: 8rem; }
  .score-box .score { font-size: 2.5rem; font-weight: 900; margin-top: 0.5rem; }
  .score-box .score.xp { color: var(--gold, #fbbf24); }
  
  /* CASES DE CONTENEURS D'IMAGES */
  .shape-box { 
    background: #05070f; border: 1px solid #1e293b; border-radius: 0.5rem; 
    display: flex; align-items: center; justify-content: center; 
    width: 75px; height: 75px; box-sizing: border-box; overflow: hidden; position: relative;
  }
  .shape-box.mini { width: 65px; height: 65px; }
  .shape-box.large { width: 130px; height: 130px; }
  .shape-box.huge { width: 170px; height: 170px; }

  /* Ajustements SVG 2D */
  .svg-icon, .svg-icon-mini, .svg-icon-large, .svg-icon-huge { width: 90%; height: 90%; color: #22d3ee; }
  .svg-icon-large { color: #fbbf24; }

  /* ========================================================
     MOTEUR DE CONFIGURATION RENDU 3D NATIF (CORRIGÉ ET SCELLÉ)
     ======================================================== */
  .scene3d {
    width: 60px; height: 60px;
    perspective: 250px;
    perspective-origin: 50% 50%;
    display: flex; align-items: center; justify-content: center;
  }
  .scene3d.sm { transform: scale(0.85); }
  .scene3d.lg { transform: scale(1.6); }

  .cube3d {
    width: 30px; height: 30px;
    position: relative;
    transform-style: preserve-3d;
    transform: rotateX(-20deg) rotateY(35deg);
    animation: spin3D 9s infinite linear;
  }
  
  @keyframes spin3D {
    0% { transform: rotateX(-22deg) rotateY(0deg); }
    100% { transform: rotateX(-22deg) rotateY(360deg); }
  }

  .face3d {
    position: absolute;
    border: 1.5px solid #22d3ee;
    background: rgba(34, 211, 238, 0.25);
    box-sizing: border-box;
  }

  /* 1. CONFIGURATION DU CUBE (Faces de 30x30px fermées parfaitement) */
  .c-cube .face3d { width: 30px; height: 30px; }
  .f-front  { transform: rotateY(0deg) translateZ(15px); }
  .f-back   { transform: rotateY(180deg) translateZ(15px); }
  .f-left   { transform: rotateY(-90deg) translateZ(15px); }
  .f-right  { transform: rotateY(90deg) translateZ(15px); }
  .f-top    { transform: rotateX(90deg) translateZ(15px); }
  .f-bottom { transform: rotateX(-90deg) translateZ(15px); }

  /* 2. CONFIGURATION DU PAVÉ DROIT (Proportions rectangulaires 40x24x24px) */
  .c-pavé-droit .p-front, .c-pavé-droit .p-back { width: 40px; height: 24px; left: -5px; top: 3px; }
  .c-pavé-droit .p-left, .c-pavé-droit .p-right { width: 24px; height: 24px; left: 3px; top: 3px; }
  .c-pavé-droit .p-top, .c-pavé-droit .p-bottom { width: 40px; height: 24px; left: -5px; top: 3px; }
  
  .p-front  { transform: rotateY(0deg) translateZ(12px); }
  .p-back   { transform: rotateY(180deg) translateZ(12px); }
  .p-left   { transform: rotateY(-90deg) translateZ(20px); }
  .p-right  { transform: rotateY(90deg) translateZ(20px); }
  .p-top    { transform: rotateX(90deg) translateZ(12px); }
  .p-bottom { transform: rotateX(-90deg) translateZ(12px); }

  /* 3. CONFIGURATION DE LA PYRAMIDE À BASE CARRÉE */
  .c-pyramide-à-base-carrée .pyr-base { width: 30px; height: 30px; transform: rotateX(-90deg) translateZ(15px); }
  .c-pyramide-à-base-carrée { width: 30px; height: 30px; }
  .c-pyramide-à-base-carrée .face3d:not(.pyr-base) {
    width: 0; height: 0; background: transparent;
    border-left: 15px solid transparent; border-right: 15px solid transparent;
    border-bottom: 28px solid rgba(34, 211, 238, 0.35);
    transform-origin: 50% 100%; top: -13px;
  }
  .pyr-f1 { transform: rotateY(0deg) translateZ(15px) rotateX(30deg); }
  .pyr-f2 { transform: rotateY(90deg) translateZ(15px) rotateX(30deg); }
  .pyr-f3 { transform: rotateY(180deg) translateZ(15px) rotateX(30deg); }
  .pyr-f4 { transform: rotateY(-90deg) translateZ(15px) rotateX(30deg); }

  /* 4. CONFIGURATION DU TÉTRAÈDRE (4 faces triangulaires équilatérales) */
  .c-tétraèdre .tetra-base {
    width: 0; height: 0; background: transparent;
    border-left: 16px solid transparent; border-right: 16px solid transparent;
    border-bottom: 28px solid rgba(34, 211, 238, 0.2);
    transform: rotateX(-90deg) translateZ(10px); top: -5px;
  }
  .c-tétraèdre .face3d:not(.tetra-base) {
    width: 0; height: 0; background: transparent;
    border-left: 16px solid transparent; border-right: 16px solid transparent;
    border-bottom: 28px solid rgba(34, 211, 238, 0.35);
    transform-origin: 50% 100%; top: -14px;
  }
  .tetra-f1 { transform: rotateY(0deg) translateZ(9px) rotateX(20deg); }
  .tetra-f2 { transform: rotateY(120deg) translateZ(9px) rotateX(20deg); }
  .tetra-f3 { transform: rotateY(240deg) translateZ(9px) rotateX(20deg); }

  /* Modals */
  .modal-backdrop { position: fixed; inset: 0; background: rgba(2, 6, 23, 0.85); display: flex; align-items: center; justify-content: center; z-index: 50; padding: 1rem; }
  .modal-content { background: #0f1524; border: 1px solid #3b82f6; border-radius: 1rem; padding: 1.5rem; max-width: 100%; max-height: 90vh; overflow-y: auto; }
  .radar-modal { width: 24rem; border-color: #06b6d4; }
  .aide-modal { width: 56rem; }
  .modal-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #1e293b; padding-bottom: 1rem; margin-bottom: 1rem; }
  .modal-header button { background: none; border: none; color: #94a3b8; font-size: 1.5rem; cursor: pointer; }
  
  .aide-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(12rem, 1fr)); gap: 1rem; }
  .aide-card { background: #090d16; border: 1px solid #1e293b; border-radius: 0.75rem; padding: 1rem; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 0.5rem; }
  .aide-card span { font-size: 0.75rem; font-weight: bold; text-transform: uppercase; color: #e2e8f0; }
  .aide-card p { font-size: 0.7rem; color: #94a3b8; }
</style>