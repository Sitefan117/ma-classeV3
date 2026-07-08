<script lang="ts">
  import { onMount } from 'svelte';
  import { getStudentName, submitActivityResult } from '$lib/client/activity';

  type Level = '6H' | '7H' | '8H';
  type Mode = 'A' | 'B' | 'C' | 'Mixte';
  type PlayMode = 'A' | 'B' | 'C';
  type Shape = {
    name: string;
    kind: 'plane' | 'solid';
    isTriangle: boolean;
    levels: Level[];
    vocab: string;
    hints: string[];
  };

  const shapes: Shape[] = [
    { name: 'Triangle scalène', kind: 'plane', isTriangle: true, levels: ['6H','7H','8H'], vocab: '3 côtés de longueurs toutes différentes.', hints: ['Je suis un triangle quelconque.', 'Mes trois côtés ont des longueurs différentes.', 'Je ne possède aucun angle droit.'] },
    { name: 'Triangle rectangle', kind: 'plane', isTriangle: true, levels: ['6H','7H','8H'], vocab: 'Possède 1 angle droit à 90°.', hints: ['Je suis un triangle avec un angle à 90°.', 'Tu peux vérifier mon coin avec une équerre.', 'Je combine trois côtés et un angle droit.'] },
    { name: 'Triangle isocèle', kind: 'plane', isTriangle: true, levels: ['7H','8H'], vocab: 'Possède 2 côtés égaux.', hints: ['Je suis un triangle avec deux côtés égaux.', 'Mes deux angles sur la base sont identiques.', 'Je possède un axe de symétrie.'] },
    { name: 'Triangle équilatéral', kind: 'plane', isTriangle: true, levels: ['7H','8H'], vocab: '3 côtés égaux et 3 angles égaux.', hints: ['Je suis un triangle parfaitement régulier.', 'Mes trois côtés mesurent la même longueur.', 'Mes trois angles valent chacun 60°.'] },
    { name: 'Carré', kind: 'plane', isTriangle: false, levels: ['6H','7H','8H'], vocab: '4 côtés égaux et 4 angles droits.', hints: ['Je suis un quadrilatère régulier.', 'Mes 4 côtés sont égaux.', 'J’ai 4 angles droits.'] },
    { name: 'Rectangle', kind: 'plane', isTriangle: false, levels: ['6H','7H','8H'], vocab: '4 angles droits, côtés opposés égaux.', hints: ['Je suis un quadrilatère allongé.', 'Mes côtés opposés sont de même longueur.', 'J’ai 4 angles droits.'] },
    { name: 'Cercle', kind: 'plane', isTriangle: false, levels: ['6H','7H','8H'], vocab: 'Courbe fermée sans côté ni angle.', hints: ['Je suis une figure plane ronde.', 'Tous mes points sont à la même distance du centre.', 'On me trace au compas.'] },
    { name: 'Losange', kind: 'plane', isTriangle: false, levels: ['7H','8H'], vocab: '4 côtés égaux sans forcément avoir d’angles droits.', hints: ['Je ressemble à un carré penché.', 'Mes 4 côtés sont égaux.', 'Mes diagonales se croisent perpendiculairement.'] },
    { name: 'Parallélogramme', kind: 'plane', isTriangle: false, levels: ['7H','8H'], vocab: 'Côtés opposés parallèles deux à deux.', hints: ['Mes côtés opposés ne se croisent jamais.', 'Je n’ai pas forcément d’angle droit.', 'Je suis un quadrilatère incliné.'] },
    { name: 'Trapèze', kind: 'plane', isTriangle: false, levels: ['7H','8H'], vocab: 'Possède au moins une paire de côtés opposés parallèles.', hints: ['Je suis un quadrilatère.', 'Deux de mes côtés sont parallèles.', 'Mes bases n’ont pas la même longueur.'] },
    { name: 'Cube', kind: 'solid', isTriangle: false, levels: ['6H','7H','8H'], vocab: 'Solide à 6 faces carrées.', hints: ['Je suis le solide du dé à jouer.', 'J’ai 6 faces, 12 arêtes et 8 sommets.', 'Toutes mes faces sont des carrés.'] },
    { name: 'Pavé droit', kind: 'solid', isTriangle: false, levels: ['6H','7H','8H'], vocab: 'Solide à 6 faces rectangulaires.', hints: ['Je ressemble à une boîte à chaussures.', 'Mes faces sont des rectangles.', 'J’ai 12 arêtes.'] },
    { name: 'Pyramide à base carrée', kind: 'solid', isTriangle: false, levels: ['7H','8H'], vocab: '1 base carrée et 4 faces triangulaires.', hints: ['Je m’élève vers un sommet.', 'Ma base posée au sol est un carré.', 'Mes côtés sont des triangles.'] },
    { name: 'Tétraèdre', kind: 'solid', isTriangle: false, levels: ['8H'], vocab: 'Solide composé de 4 faces triangulaires.', hints: ['Je suis une pyramide très simple.', 'Toutes mes faces sont triangulaires.', 'Je possède 4 sommets.'] }
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
  let blocked = false;
  let sentMessage = '';
  let errorFamilies: string[] = [];

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
    currentMode = mode === 'Mixte' ? choose<PlayMode>(['A', 'B', 'C']) : (mode as PlayMode);

    if (currentMode === 'A') generateModeA();
    else if (currentMode === 'B') generateModeB();
    else generateModeC();
  }

  function generateModeA() {
    points = 30;
    hintsShown = 1;
    current = choose(availableShapes());
    const pool = availableShapes().filter((shape) => shape.name !== current.name && shape.isTriangle === current.isTriangle);
    const fallback = availableShapes().filter((shape) => shape.name !== current.name);
    options = shuffle([current, ...shuffle(pool.length >= 3 ? pool : fallback).slice(0, 3)]);
  }

  function generateModeB() {
    points = 10;
    const pool = availableShapes();
    const groupKind: 'plane' | 'solid' = Math.random() > 0.5 ? 'plane' : 'solid';
    let group = pool.filter((shape) => shape.kind === groupKind);
    let other = pool.filter((shape) => shape.kind !== groupKind);
    if (group.length < 3 || other.length < 1) {
      group = pool.filter((shape) => shape.kind !== groupKind);
      other = pool.filter((shape) => shape.kind === groupKind);
    }
    const base = shuffle(group).slice(0, 3);
    current = choose(other.length > 0 ? other : pool.filter((shape) => !base.includes(shape)));
    options = shuffle([current, ...base]);
  }

  function generateModeC() {
    points = 10;
    current = choose(availableShapes());
    options = [];
  }

  function showHint() {
    if (currentMode !== 'A' || blocked || hintsShown >= current.hints.length) return;
    hintsShown += 1;
    points = Math.max(10, points - 10);
  }

  function answer(selected: string) {
    if (blocked) return;
    blocked = true;

    const isCorrect = currentMode === 'C' ? selected === current.kind : selected === current.name;
    if (isCorrect) {
      score += 1;
      xp += points;
      feedback = `🟢 Analyse valide (+${points} XP).`;
    } else {
      errorFamilies = [...errorFamilies, current.name];
      const expected = currentMode === 'C' ? (current.kind === 'plane' ? 'Figure plane (2D)' : 'Solide (3D)') : current.name;
      feedback = `🔴 À revoir : cible attendue ${expected}. ${current.vocab}`;
    }

    question += 1;
    window.setTimeout(loadQuestion, isCorrect ? 1800 : 3200);
  }

  async function finishMission() {
    phase = 'done';
    const report = await submitActivityResult({
      studentName,
      world: 'geometrie',
      mission: `${level} mode ${mode}`,
      score,
      total: 10,
      scoreBasis: 'last',
      errorCount: 10 - score,
      errorFamilies: Array.from(new Set(errorFamilies)),
      metadata: { xp }
    });
    sentMessage = report.message;
  }

  function svgForShape(name: string): string {
    const start = '<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round">';
    const end = '</svg>';
    switch (name) {
      case 'Triangle scalène': return `${start}<polygon points="25,25 85,45 35,80"/>${end}`;
      case 'Triangle rectangle': return `${start}<polygon points="25,20 25,80 85,80"/><polyline points="25,70 35,70 35,80"/>${end}`;
      case 'Triangle isocèle': return `${start}<polygon points="50,20 20,80 80,80"/>${end}`;
      case 'Triangle équilatéral': return `${start}<polygon points="50,23 15,83 85,83"/>${end}`;
      case 'Carré': return `${start}<rect x="20" y="20" width="60" height="60"/>${end}`;
      case 'Rectangle': return `${start}<rect x="10" y="30" width="80" height="40"/>${end}`;
      case 'Cercle': return `${start}<circle cx="50" cy="50" r="32"/>${end}`;
      case 'Losange': return `${start}<polygon points="50,15 80,50 50,85 20,50"/>${end}`;
      case 'Parallélogramme': return `${start}<polygon points="30,30 85,30 70,70 15,70"/>${end}`;
      case 'Trapèze': return `${start}<polygon points="30,30 70,30 90,70 10,70"/>${end}`;
      case 'Cube': return `${start}<rect x="25" y="40" width="45" height="45"/><path d="M25,40 L45,20 L90,20 L90,65 L70,85 M70,40 L90,20 M45,20 L45,45" stroke-dasharray="2,2"/>${end}`;
      case 'Pavé droit': return `${start}<rect x="15" y="45" width="55" height="35"/><path d="M15,45 L35,25 L90,25 L90,60 L70,80 M70,45 L90,25" stroke-dasharray="2,2"/>${end}`;
      case 'Pyramide à base carrée': return `${start}<polygon points="50,15 15,75 70,85 85,65 50,15"/><path d="M15,75 L45,55 L85,65" stroke-dasharray="2,2"/>${end}`;
      case 'Tétraèdre': return `${start}<polygon points="50,15 15,80 85,80 50,15"/><path d="M15,80 L45,60 L85,80" stroke-dasharray="2,2"/>${end}`;
      default: return `${start}<text x="50" y="55" font-size="24" text-anchor="middle" fill="currentColor" stroke="none">?</text>${end}`;
    }
  }
</script>

<svelte:head>
  <title>Le Défi des Formes — Classe Numérique</title>
</svelte:head>

<div class="dark-page page">
  <header class="dark-header">
    <div class="header-inner">
      <div class="brand"><span class="brand-icon">📐</span><div><h1 class="brand-title">Secteur : Géométrie</h1><p class="brand-subtitle">Agent : {studentName}</p></div></div>
      <a class="btn dark" href="/">↩ QG</a>
    </div>
  </header>

  <main class="main">
    {#if phase === 'config'}
      <section class="dark-card stack" style="max-width: 44rem; margin: 0 auto;">
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
          <div class="grid" style="grid-template-columns: repeat(2, 1fr);">
            <button class="dark-option" class:selected={mode === 'A'} type="button" on:click={() => (mode = 'A')}>🔍 Qui suis-je ?</button>
            <button class="dark-option" class:selected={mode === 'B'} type="button" on:click={() => (mode = 'B')}>⚠️ L’intrus visuel</button>
            <button class="dark-option" class:selected={mode === 'C'} type="button" on:click={() => (mode = 'C')}>📦 2D vs 3D</button>
            <button class="dark-option" class:selected={mode === 'Mixte'} type="button" on:click={() => (mode = 'Mixte')}>🎲 Aléatoire</button>
          </div>
        </div>
        <button class="btn primary" disabled={!level || !mode} type="button" on:click={startMission}>Initialiser la Mission 🚀</button>
      </section>
    {:else if phase === 'play'}
      <section class="dark-card stack">
        <div class="mission-top"><span class="badge">Analyse {Math.min(question, 10)} / 10</span><span class="badge">Mode {currentMode}</span><span class="badge">XP : {xp}</span></div>

        {#if currentMode === 'A'}
          <div class="dark-card compact center">
            <p class="kicker">Flux d’indices détectés</p>
            {#each current.hints.slice(0, hintsShown) as hint}
              <p>« {hint} »</p>
            {/each}
            <button class="btn dark" disabled={hintsShown >= current.hints.length || blocked} type="button" on:click={showHint}>💡 Indice (-10 XP)</button>
          </div>
          <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(11rem, 1fr));">
            {#each options as option}
              <button class="dark-option" type="button" on:click={() => answer(option.name)}>{option.name}</button>
            {/each}
          </div>
        {:else if currentMode === 'B'}
          <div class="center"><p class="kicker">Analyse des structures</p><p class="muted">Élimine l’intrus qui rompt la règle du groupe.</p></div>
          <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(11rem, 1fr));">
            {#each options as option}
              <button class="dark-option stack" type="button" on:click={() => answer(option.name)}>
                <span class="shape-box">{@html svgForShape(option.name)}</span>
                <span>{option.name}</span>
              </button>
            {/each}
          </div>
        {:else}
          <div class="dark-card compact center stack">
            <p class="kicker">Élément à classifier</p>
            <h2>{current.name}</h2>
            <span class="shape-box">{@html svgForShape(current.name)}</span>
          </div>
          <div class="grid" style="grid-template-columns: repeat(2, 1fr);">
            <button class="dark-option" type="button" on:click={() => answer('plane')}>📥 Figure plane (2D)</button>
            <button class="dark-option" type="button" on:click={() => answer('solid')}>📥 Solide (3D)</button>
          </div>
        {/if}

        <p class:good={feedback.startsWith('🟢')} class:bad={!feedback.startsWith('🟢')} class="feedback">{feedback}</p>
      </section>
    {:else}
      <section class="dark-card stack center" style="max-width: 36rem; margin: 0 auto;">
        <h2>🏁 Rapport de Mission Validé</h2>
        <p style="font-size: 2.5rem; font-weight: 1000; color: var(--cyan);">{score} / 10</p>
        <p class="badge" style="margin: 0 auto;">XP totale : {xp}</p>
        <p>{score >= 8 ? '⚡ Expert géomètre : secteur sécurisé.' : '🔍 Mission accomplie, mais le radar indique des failles à corriger.'}</p>
        <p class="muted small">{sentMessage}</p>
        <div class="actions" style="justify-content: center;"><button class="btn primary" type="button" on:click={startMission}>Rejouer</button><a class="btn dark" href="/">Retour au QG</a></div>
      </section>
    {/if}
  </main>
</div>
