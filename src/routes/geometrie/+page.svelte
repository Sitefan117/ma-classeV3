<script lang="ts">
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

  // Base de données étendue (19 figures)
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
  
  // Nouveaux états d'interface
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
    
    // Essayer de piéger avec la même famille (triangles avec triangles)
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
    if (!current) current = choose(availableShapes().filter(s => !base.includes(s))); // Fallback
    
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

  // Rendu mixte : SVG pour 2D, structure HTML/CSS pour 3D
  function renderShapeHTML(name: string, customClass = ""): string {
    if (['Cube', 'Pavé droit', 'Pyramide à base carrée', 'Tétraèdre'].includes(name)) {
      if (name === 'Cube') {
        return `<div class="scene3d ${customClass}"><div class="cube3d"><div class="face3d" style="width:50px; height:50px; transform: rotateY(0deg) translateZ(25px);"></div><div class="face3d" style="width:50px; height:50px; transform: rotateY(90deg) translateZ(25px);"></div><div class="face3d" style="width:50px; height:50px; transform: rotateY(180deg) translateZ(25px);"></div><div class="face3d" style="width:50px; height:50px; transform: rotateY(-90deg) translateZ(25px);"></div><div class="face3d" style="width:50px; height:50px; transform: rotateX(90deg) translateZ(25px);"></div><div class="face3d" style="width:50px; height:50px; transform: rotateX(-90deg) translateZ(25px);"></div></div></div>`;
      } else if (name === 'Pavé droit') {
        return `<div class="scene3d ${customClass}"><div class="cube3d"><div class="face3d" style="width:60px; height:40px; transform: rotateY(0deg) translateZ(20px);"></div><div class="face3d" style="width:60px; height:40px; transform: rotateY(180deg) translateZ(20px);"></div><div class="face3d" style="width:40px; height:40px; transform: rotateY(90deg) translateZ(30px);"></div><div class="face3d" style="width:40px; height:40px; transform: rotateY(-90deg) translateZ(30px);"></div><div class="face3d" style="width:60px; height:40px; transform: rotateX(90deg) translateZ(20px);"></div><div class="face3d" style="width:60px; height:40px; transform: rotateX(-90deg) translateZ(20px);"></div></div></div>`;
      } else {
        return `<div class="scene3d ${customClass} flex-center text-3xl">🔺💎</div>`;
      }
    }

    const s = `<svg class="${customClass}" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round">`;
    const e = `</svg>`;
    switch (name) {
      case 'Triangle quelconque': return s + `<polygon points="20,25 85,40 35,85"/>` + e;
      case 'Triangle rectangle': return s + `<polygon points="25,20 25,80 85,80"/><polyline points="25,70 35,70 35,80"/>` + e;
      case 'Triangle isocèle': return s + `<polygon points="50,20 20,80 80,80"/><line x1="35" y1="50" x2="45" y2="50"/>` + e;
      case 'Triangle équilatéral': return s + `<polygon points="50,20 15,80 85,80"/>` + e;
      case 'Triangle isocèle rectangle': return s + `<polygon points="20,20 20,80 80,80"/><polyline points="20,70 30,70 30,80"/>` + e;
      case 'Carré': return s + `<rect x="20" y="20" width="60" height="60"/>` + e;
      case 'Rectangle': return s + `<rect x="10" y="30" width="80" height="40"/>` + e;
      case 'Cercle': return s + `<circle cx="50" cy="50" r="35"/>` + e;
      case 'Losange': return s + `<polygon points="50,15 80,50 50,85 20,50"/>` + e;
      case 'Parallélogramme': return s + `<polygon points="35,30 85,30 65,70 15,70"/>` + e;
      case 'Trapèze quelconque': return s + `<polygon points="30,30 75,30 90,70 10,70"/>` + e;
      case 'Cerf-volant': return s + `<polygon points="50,15 80,45 50,85 20,45"/><line x1="50" y1="15" x2="50" y2="85" stroke-dasharray="2,2"/>` + e;
      case 'Fer de lance': return s + `<polygon points="50,15 80,85 50,60 20,85"/>` + e;
      case 'Trapèze rectangle': return s + `<polygon points="25,30 75,30 90,70 25,70"/><polyline points="25,40 35,40 35,30"/>` + e;
      case 'Trapèze isocèle': return s + `<polygon points="30,30 70,30 85,70 15,70"/>` + e;
      default: return s + `<text x="50" y="55" font-size="24" text-anchor="middle" fill="currentColor" stroke="none">?</text>` + e;
    }
  }
</script>

<svelte:head>
  <title>Secteur : Géométrie — Hub de Mission</title>
</svelte:head>

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
      
    {:else if phase === 'play'}
      <section class="dark-card stack" class:error-state={feedback.startsWith('🔴')} class:success-state={feedback.startsWith('🟢')}>
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

        <!-- Floating Tools -->
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
                <span class="shape-box">{@html renderShapeHTML(option.name, "svg-icon")}</span>
                <span>{option.name}</span>
              </button>
            {/each}
          </div>
          
        {:else if currentMode === 'C'}
          <div class="dark-card compact center stack">
            <p class="kicker">Élément à classifier</p>
            <h2>{current.name}</h2>
            <span class="shape-box large">{@html renderShapeHTML(current.name, "svg-icon-large")}</span>
          </div>
          <div class="grid" style="grid-template-columns: repeat(2, 1fr);">
            <button class="dark-option center stack" type="button" on:click={() => answer('plane')}><span class="icon-xl">📥</span><span>Figure plane (2D)</span></button>
            <button class="dark-option center stack" type="button" on:click={() => answer('solid')}><span class="icon-xl">📥</span><span>Solide (3D)</span></button>
          </div>
          
        {:else if currentMode === 'D'}
          <div class="dark-card compact center">
            <p class="kicker">Fiche de la cible</p>
            <ul class="hint-list">
              <li>{current.hints[0]}</li>
              <li>{current.hints[1]}</li>
              <li>{current.hints[2]}</li>
            </ul>
          </div>
          <div class="grid" style="grid-template-columns: repeat(3, 1fr);">
            {#each options as option}
              <button class="dark-option stack center mini" type="button" on:click={() => answer(option.name)}>
                <span class="shape-box mini">{@html renderShapeHTML(option.name, "svg-icon-mini")}</span>
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

<!-- Modals -->
{#if showAideModal}
  <div class="modal-backdrop" on:click={() => (showAideModal = false)}>
    <div class="modal-content aide-modal" on:click|stopPropagation>
      <div class="modal-header"><h3>📘 Aide-Mémoire (PER)</h3><button on:click={() => (showAideModal = false)}>✕</button></div>
      <div class="modal-body">
        <strong class="kicker">🔺 Triangles</strong>
        <div class="aide-grid">
          {#each shapes.filter(s => s.isTriangle) as s}
            <div class="aide-card"><span>{s.name}</span><div class="shape-box">{@html renderShapeHTML(s.name, 'svg-icon')}</div><p>{s.vocab}</p></div>
          {/each}
        </div>
        <strong class="kicker mt-4">🟩 Figures Planes</strong>
        <div class="aide-grid">
          {#each shapes.filter(s => !s.isTriangle && s.kind === 'plane') as s}
            <div class="aide-card"><span>{s.name}</span><div class="shape-box">{@html renderShapeHTML(s.name, 'svg-icon')}</div><p>{s.vocab}</p></div>
          {/each}
        </div>
        <strong class="kicker mt-4">📦 Solides</strong>
        <div class="aide-grid">
          {#each shapes.filter(s => s.kind === 'solid') as s}
            <div class="aide-card"><span>{s.name}</span><div class="shape-box">{@html renderShapeHTML(s.name, 'svg-icon')}</div><p>{s.vocab}</p></div>
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
      <div class="shape-box huge my-4">{@html renderShapeHTML(current.name, "svg-icon-huge")}</div>
      <button class="btn dark" on:click={() => (showRadarModal = false)}>Fermer</button>
    </div>
  </div>
{/if}

<style>
  /* Base styles adapted from HTML Tailwind to plain CSS for Svelte */
  .center { text-align: center; }
  .stack { display: flex; flex-direction: column; gap: 1.5rem; }
  .grid { display: grid; gap: 1rem; }
  .flex-center { display: flex; justify-content: center; align-items: center; }
  .mt-4 { margin-top: 1rem; }
  .my-4 { margin: 1rem 0; }
  
  .badge.xp { color: var(--gold, #fbbf24); border-color: var(--gold, #fbbf24); }
  .kicker { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--cyan, #22d3ee); }
  .italic-hint { font-style: italic; color: #cbd5e1; margin: 0.5rem 0; }
  
  .dark-option {
    background: #172033; border: 2px solid #2e3e65; border-radius: 0.75rem; padding: 1rem; color: #f1f5f9;
    font-weight: bold; cursor: pointer; transition: all 0.2s;
  }
  .dark-option:hover { border-color: #22d3ee; }
  .dark-option.selected { background: #0e3f47; border-color: #22d3ee; box-shadow: 0 0 12px rgba(34, 211, 238, 0.2); }
  
  .dark-option.mini { padding: 0.5rem; gap: 0.5rem; }
  .text-mini { font-size: 0.65rem; text-transform: uppercase; }
  
  .icon-xl { font-size: 2rem; margin-bottom: 0.5rem; }

  /* Boutons XL pour Accessibilité / Vélo de bureau */
  .xl-mode .dark-option { padding: 1.5rem; font-size: 1.15rem; }
  .xl-mode .btn { padding: 1rem 2rem; font-size: 1.1rem; }

  /* Floating Tools */
  .tools-floating { position: absolute; top: 1rem; right: 1rem; display: flex; gap: 0.5rem; z-index: 10; }
  .tool-btn { 
    width: 2.5rem; height: 2.5rem; border-radius: 50%; border: 1px solid; 
    display: flex; align-items: center; justify-content: center; cursor: pointer;
  }
  .tool-btn.hidden { display: none; }
  .tool-btn.audio { background: #3b0764; border-color: #9333ea; color: #d8b4fe; }
  .tool-btn.hint { background: #422006; border-color: #d97706; color: #fcd34d; }
  .tool-btn.radar { background: #083344; border-color: #0891b2; color: #67e8f9; }

  /* Feedbacks */
  .feedback-panel { margin-top: 1rem; padding: 1rem; border-radius: 0.75rem; text-align: center; }
  .error-state .feedback-panel { background: rgba(159, 18, 57, 0.2); border: 1px solid #e11d48; }
  .success-state .feedback-panel { background: rgba(6, 78, 59, 0.2); border: 1px solid #10b981; }
  .feedback-title { font-weight: 900; margin-bottom: 0.5rem; }
  .feedback-title.bad { color: #f43f5e; }
  .feedback-title.good { color: #34d399; }
  .feedback-details { font-size: 0.875rem; color: #cbd5e1; line-height: 1.4; }

  /* Score End Screen */
  .score-display { display: flex; gap: 2rem; justify-content: center; margin: 2rem 0; }
  .score-box { background: #090d16; border: 1px solid #24324f; padding: 1.5rem; border-radius: 1rem; min-width: 8rem; }
  .score-box .score { font-size: 2.5rem; font-weight: 900; margin-top: 0.5rem; }
  .score-box .score.xp { color: var(--gold, #fbbf24); }
  
  /* SVG & Shape containers */
  .shape-box { background: #05070f; border: 1px solid #1e293b; border-radius: 0.5rem; display: flex; align-items: center; justify-content: center; padding: 0.5rem; }
  .svg-icon { width: 4rem; height: 4rem; color: #22d3ee; }
  .svg-icon-mini { width: 3rem; height: 3rem; color: #e2e8f0; }
  .svg-icon-large { width: 6rem; height: 6rem; color: #fbbf24; }
  .svg-icon-huge { width: 8rem; height: 8rem; color: #22d3ee; }

  /* 3D CSS Engine */
  .scene3d { width: 80px; height: 80px; perspective: 400px; display: flex; align-items: center; justify-content: center; }
  .cube3d { width: 100%; height: 100%; position: relative; transform-style: preserve-3d; animation: spin3D 8s infinite linear; }
  .face3d { position: absolute; border: 2px solid #22d3ee; background: rgba(34, 211, 238, 0.15); }
  @keyframes spin3D { from { transform: rotateX(-20deg) rotateY(0deg); } to { transform: rotateX(-20deg) rotateY(360deg); } }

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