<script lang="ts">
  import { base } from '$app/paths';
  import { onMount } from 'svelte';
  import { clearStudentName, getStudentName, storeStudentName } from '$lib/client/activity';
  import { worlds } from '$lib/worlds';

  let ready = false;
  let studentName = '';
  let nameInput = '';
  let selectedCategory = 'TOUS';

  const categories = ['TOUS', 'MATHS', 'FRANÇAIS', 'SCIENCES', 'AUTRES'];

  onMount(() => {
    const stored = getStudentName('');
    studentName = stored;
    nameInput = stored;
    ready = true;
  });

  function login() {
    const nextName = nameInput.trim();
    if (nextName.length < 2) return;
    studentName = nextName;
    storeStudentName(nextName);
  }

  function logout() {
    clearStudentName();
    studentName = '';
    nameInput = '';
  }

  function routeFor(route: string): string {
    return `${base}${route}?eleve=${encodeURIComponent(studentName)}`;
  }

  // Détection automatique de la catégorie basée sur le titre et la description
  function detectCategory(title: string, subtitle: string): string {
    const text = `${title} ${subtitle}`.toLowerCase();
    if (text.match(/math|nombre|calcul|géométrie|chiffre|livret|tables|fraction|soustraction|addition|multiplication/i)) {
      return 'MATHS';
    }
    if (text.match(/conj|français|verbe|mot|orthographe|grammaire|lecture|phrase|vocabulaire/i)) {
      return 'FRANÇAIS';
    }
    if (text.match(/science|physique|chimie|corps|planète|nature|espace|lab/i)) {
      return 'SCIENCES';
    }
    return 'AUTRES';
  }

  $: filteredWorlds = worlds.filter(w => {
    if (selectedCategory === 'TOUS') return true;
    return detectCategory(w.title, w.subtitle) === selectedCategory;
  });
</script>

<svelte:head>
  <title>LEARNING HUB — QG Gamifié</title>
  <meta name="description" content="Launcher de jeux éducatifs interactifs pour la classe." />
</svelte:head>

<!-- Arrière-plan animé type Dark Gaming -->
<div class="bg-container">
  <div class="glow-orb orb-1"></div>
  <div class="glow-orb orb-2"></div>
  <div class="glow-orb orb-3"></div>
  <div class="grid-overlay"></div>
</div>

<div class="app-layout">
  <!-- Header Gaming Sticky -->
  <header class="header">
    <div class="header-inner">
      <div class="brand">
        <span class="brand-icon">⚡</span>
        <div>
          <h1 class="brand-title">LEARNING <span class="gradient-text">HUB</span></h1>
          <p class="brand-subtitle">Ton espace pour apprendre en mode jeu</p>
        </div>
      </div>

      <div class="header-actions">
        {#if studentName}
          <div class="profile-chip">
            <span class="profile-label">PROFIL ÉLÈVE</span>
            <span class="profile-name">{studentName}</span>
          </div>
          <button class="btn btn-ghost btn-sm" type="button" on:click={logout} title="Changer de profil">
            🔄
          </button>
        {/if}
        <a class="btn btn-teacher" href="{base}/teacher">
          ⚙️ <span>Espace Enseignant</span>
        </a>
      </div>
    </div>
  </header>

  <main class="main-content">
    {#if !ready}
      <section class="card auth-card center">
        <div class="loader"></div>
        <p class="muted">Connexion au Hub en cours...</p>
      </section>

    {:else if !studentName}
      <!-- Formulaire de Connexion Élève (Gaming Entry) -->
      <section class="card auth-card center">
        <div class="avatar-badge">👋</div>
        <h2>BIENVENUE, JOUER ET APPRENDRE</h2>
        <p class="muted">Inscris ton prénom pour déverrouiller ton accès au Hub.</p>
        
        <form class="auth-form" on:submit|preventDefault={login}>
          <div class="input-group">
            <label for="student-name-input">TON PRÉNOM</label>
            <input 
              id="student-name-input"
              class="input-gaming" 
              bind:value={nameInput} 
              required 
              minlength="2" 
              placeholder="Ex: Lucas, Léa..." 
              autocomplete="off"
            />
          </div>
          <button class="btn btn-primary btn-glow" type="submit">
            ENTRER DANS LE HUB ➔
          </button>
        </form>
      </section>

    {:else}
      <!-- Zone d'Accueil HQ -->
      <section class="hero-banner">
        <div class="hero-content">
          <span class="badge-tag">QG • CENTRE D'APPRENTISSAGE</span>
          <h2 class="hero-title">
            Choisis ton <span class="gradient-text-alt">prochain défi.</span>
          </h2>
          <p class="hero-sub">
            Salut <strong class="student-highlight">{studentName}</strong> ! Explore les jeux, relève les défis et construis ta progression.
          </p>
        </div>
      </section>

      <!-- Dashboard de Progression (Maquette future intégration) -->
      <section class="progression-block card">
        <div class="progression-header">
          <div>
            <h3>PROGRESSION DU HUB</h3>
            <span class="status-badge">EN PRÉPARATION</span>
          </div>
          <div class="xp-placeholder">0 / -- XP</div>
        </div>
        <div class="progress-bar-bg">
          <div class="progress-bar-fill" style="width: 15%;"></div>
        </div>
        <div class="progression-features-preview">
          <span>🔒 Niveaux</span>
          <span>🔒 Badges</span>
          <span>🔒 Recompenses</span>
          <span>🔒 Defis Quotidiens</span>
        </div>
      </section>

      <!-- Bibliothèque des Jeux -->
      <section class="library-section">
        <div class="library-header">
          <div>
            <h2>TA BIBLIOTHÈQUE</h2>
            <p class="muted small">Les défis disponibles pour toi</p>
          </div>

          <!-- Barre de Filtres par Catégorie -->
          <div class="filter-bar">
            {#each categories as cat}
              <button 
                class="filter-btn" 
                class:active={selectedCategory === cat}
                on:click={() => selectedCategory = cat}
              >
                {cat}
              </button>
            {/each}
          </div>
        </div>

        <!-- Grille des Jeux -->
        <div class="world-grid">
          {#each filteredWorlds as world}
            {@const cat = detectCategory(world.title, world.subtitle)}
            <article class="card game-card">
              <div class="card-top">
                <span class="category-tag">{cat}</span>
                <span class="status-dot" title="Prêt à jouer"></span>
              </div>
              
              <div class="card-icon">{world.emoji}</div>

              <div class="card-info">
                <h3 class="game-title">{world.title}</h3>
                <p class="game-desc">{world.subtitle}</p>
              </div>

              <div class="card-meta">
                <span class="meta-tag">ACTIVITÉ</span>
                <span class="meta-tag highlight">PRÊT À JOUER</span>
              </div>

              <a class="btn btn-play" href={routeFor(world.route)}>
                JOUER ➔
              </a>
            </article>
          {/each}
        </div>
      </section>
    {/if}
  </main>

  <footer class="footer">
    <span>© 2026 LEARNING HUB — Plateforme de jeux éducatifs</span>
  </footer>
</div>

<style>
  /* --- VARIABLES & RESET ENCAPSULÉ --- */
  :global(body) {
    background-color: #090d16;
    color: #f1f5f9;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    margin: 0;
    padding: 0;
  }

  * {
    box-sizing: border-box;
  }

  /* --- FOND ANIMÉ DARK GAMING --- */
  .bg-container {
    position: fixed;
    inset: 0;
    overflow: hidden;
    z-index: 0;
    pointer-events: none;
    background: radial-gradient(circle at 50% 0%, #111827 0%, #060810 100%);
  }

  .grid-overlay {
    position: absolute;
    inset: 0;
    background-image: 
      linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
    background-size: 40px 40px;
  }

  .glow-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(100px);
    opacity: 0.25;
    animation: float 20s infinite alternate ease-in-out;
  }

  .orb-1 {
    width: 500px;
    height: 500px;
    background: #06b6d4;
    top: -100px;
    left: -100px;
  }

  .orb-2 {
    width: 600px;
    height: 600px;
    background: #6366f1;
    bottom: -150px;
    right: -100px;
    animation-delay: -5s;
  }

  .orb-3 {
    width: 400px;
    height: 400px;
    background: #a855f7;
    top: 40%;
    left: 40%;
    animation-delay: -10s;
  }

  @keyframes float {
    0% { transform: translate(0, 0) scale(1); }
    100% { transform: translate(50px, 40px) scale(1.1); }
  }

  @media (prefers-reduced-motion: reduce) {
    .glow-orb {
      animation: none;
    }
  }

  /* --- STRUCTURE GLOBALE --- */
  .app-layout {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  .main-content {
    flex: 1;
    max-width: 1200px;
    width: 100%;
    margin: 0 auto;
    padding: 2rem 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 2.5rem;
  }

  /* --- HEADER --- */
  .header {
    position: sticky;
    top: 0;
    z-index: 50;
    background: rgba(10, 15, 29, 0.75);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }

  .header-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0.85rem 1.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .brand-icon {
    font-size: 1.8rem;
    filter: drop-shadow(0 0 10px rgba(6, 182, 212, 0.6));
  }

  .brand-title {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 800;
    letter-spacing: 0.05em;
  }

  .brand-subtitle {
    margin: 0;
    font-size: 0.75rem;
    color: #94a3b8;
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .profile-chip {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    background: rgba(255, 255, 255, 0.05);
    padding: 0.35rem 0.75rem;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .profile-label {
    font-size: 0.65rem;
    color: #38bdf8;
    font-weight: 700;
    letter-spacing: 0.05em;
  }

  .profile-name {
    font-size: 0.9rem;
    font-weight: 700;
    color: #fff;
  }

  /* --- CARTES & COMPOSANTS EN VERRE --- */
  .card {
    background: rgba(15, 23, 42, 0.65);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 1.5rem;
    box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
  }

  /* --- PAGE D'ACCUEIL HERO --- */
  .hero-banner {
    background: linear-gradient(135deg, rgba(30, 27, 75, 0.7), rgba(49, 46, 129, 0.4));
    border: 1px solid rgba(99, 102, 241, 0.25);
    border-radius: 20px;
    padding: 2.5rem;
    position: relative;
    overflow: hidden;
  }

  .badge-tag {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    background: rgba(99, 102, 241, 0.2);
    border: 1px solid rgba(99, 102, 241, 0.4);
    color: #818cf8;
    border-radius: 999px;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    margin-bottom: 0.75rem;
  }

  .hero-title {
    margin: 0 0 0.5rem 0;
    font-size: 2.2rem;
    font-weight: 900;
    line-height: 1.2;
  }

  .hero-sub {
    margin: 0;
    color: #cbd5e1;
    font-size: 1.05rem;
  }

  .student-highlight {
    color: #38bdf8;
    font-weight: 800;
  }

  /* --- PROGRESSION BLOCK --- */
  .progression-block {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    background: rgba(15, 23, 42, 0.4);
    border-color: rgba(255, 255, 255, 0.06);
  }

  .progression-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .progression-header h3 {
    margin: 0;
    font-size: 1rem;
    letter-spacing: 0.05em;
  }

  .status-badge {
    display: inline-block;
    font-size: 0.65rem;
    background: rgba(234, 179, 8, 0.15);
    color: #fde047;
    border: 1px solid rgba(234, 179, 8, 0.3);
    padding: 0.15rem 0.5rem;
    border-radius: 4px;
    font-weight: 700;
    margin-top: 0.25rem;
  }

  .xp-placeholder {
    font-family: monospace;
    font-size: 0.9rem;
    color: #64748b;
  }

  .progress-bar-bg {
    width: 100%;
    height: 10px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 5px;
    overflow: hidden;
  }

  .progress-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, #06b6d4, #6366f1);
    border-radius: 5px;
  }

  .progression-features-preview {
    display: flex;
    gap: 1.5rem;
    font-size: 0.8rem;
    color: #64748b;
    flex-wrap: wrap;
  }

  /* --- BIBLIOTHÈQUE & FILTRES --- */
  .library-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 1.5rem;
    gap: 1.5rem;
    flex-wrap: wrap;
  }

  .library-header h2 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 800;
    letter-spacing: 0.03em;
  }

  .filter-bar {
    display: flex;
    gap: 0.5rem;
    background: rgba(0, 0, 0, 0.3);
    padding: 0.35rem;
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.05);
    overflow-x: auto;
  }

  .filter-btn {
    background: transparent;
    border: none;
    color: #94a3b8;
    padding: 0.4rem 0.85rem;
    border-radius: 6px;
    font-weight: 700;
    font-size: 0.75rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .filter-btn.active {
    background: #38bdf8;
    color: #090d16;
    box-shadow: 0 0 12px rgba(56, 189, 248, 0.4);
  }

  /* --- GRILLE & CARTES DE JEUX --- */
  .world-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
  }

  @media (max-width: 900px) {
    .world-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 600px) {
    .world-grid {
      grid-template-columns: 1fr;
    }
  }

  .game-card {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    position: relative;
    transition: transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1), border-color 0.25s ease, box-shadow 0.25s ease;
    border: 1px solid rgba(255, 255, 255, 0.08);
  }

  /* HOVER GAMING EFFECT */
  @media (hover: hover) {
    .game-card:hover {
      transform: translateY(-6px) scale(1.02);
      border-color: rgba(56, 189, 248, 0.5);
      box-shadow: 0 12px 35px -5px rgba(6, 182, 212, 0.25);
    }

    .game-card:hover .card-icon {
      transform: scale(1.1) rotate(-3deg);
    }

    .game-card:hover .btn-play {
      background: #06b6d4;
      color: #000;
      box-shadow: 0 0 15px rgba(6, 182, 212, 0.6);
    }
  }

  .card-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .category-tag {
    font-size: 0.65rem;
    font-weight: 800;
    color: #818cf8;
    letter-spacing: 0.05em;
  }

  .status-dot {
    width: 8px;
    height: 8px;
    background: #10b981;
    border-radius: 50%;
    box-shadow: 0 0 8px #10b981;
  }

  .card-icon {
    font-size: 3rem;
    text-align: center;
    margin: 0.5rem 0;
    transition: transform 0.25s ease;
  }

  .card-info {
    flex: 1;
  }

  .game-title {
    margin: 0 0 0.4rem 0;
    font-size: 1.15rem;
    font-weight: 800;
    color: #fff;
  }

  .game-desc {
    margin: 0;
    font-size: 0.85rem;
    color: #94a3b8;
    line-height: 1.4;
  }

  .card-meta {
    display: flex;
    gap: 0.5rem;
  }

  .meta-tag {
    font-size: 0.65rem;
    padding: 0.2rem 0.5rem;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 4px;
    color: #64748b;
  }

  .meta-tag.highlight {
    color: #34d399;
    border-color: rgba(52, 211, 153, 0.2);
  }

  /* --- BOUTONS & INPUTS --- */
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.65rem 1.25rem;
    border-radius: 10px;
    font-weight: 800;
    font-size: 0.85rem;
    text-decoration: none;
    cursor: pointer;
    border: none;
    transition: all 0.2s ease;
  }

  .btn-play {
    background: rgba(255, 255, 255, 0.08);
    color: #fff;
    border: 1px solid rgba(255, 255, 255, 0.15);
    width: 100%;
    margin-top: 0.5rem;
    letter-spacing: 0.05em;
  }

  .btn-primary {
    background: linear-gradient(135deg, #06b6d4, #3b82f6);
    color: #fff;
  }

  .btn-glow {
    box-shadow: 0 0 20px rgba(6, 182, 212, 0.4);
  }

  .btn-teacher {
    background: rgba(255, 255, 255, 0.05);
    color: #cbd5e1;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .btn-ghost {
    background: transparent;
    color: #94a3b8;
  }

  .btn-sm {
    padding: 0.4rem 0.6rem;
    font-size: 0.8rem;
  }

  .auth-card {
    max-width: 420px;
    margin: 3rem auto;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    text-align: center;
  }

  .avatar-badge {
    font-size: 3rem;
  }

  .auth-form {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .input-group {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    text-align: left;
  }

  .input-group label {
    font-size: 0.7rem;
    font-weight: 800;
    color: #38bdf8;
    letter-spacing: 0.05em;
  }

  .input-gaming {
    background: rgba(0, 0, 0, 0.4);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 10px;
    padding: 0.8rem 1rem;
    color: #fff;
    font-size: 1rem;
    outline: none;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }

  .input-gaming:focus {
    border-color: #38bdf8;
    box-shadow: 0 0 15px rgba(56, 189, 248, 0.3);
  }

  /* EFFETS DE TEXTE */
  .gradient-text {
    background: linear-gradient(135deg, #38bdf8, #818cf8);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .gradient-text-alt {
    background: linear-gradient(135deg, #22d3ee, #ffffff, #c084fc);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .muted {
    color: #94a3b8;
  }

  .muted.small {
    font-size: 0.85rem;
  }

  .center {
    text-align: center;
  }

  .footer {
    padding: 2rem;
    text-align: center;
    font-size: 0.8rem;
    color: #475569;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
  }

  /* LOADER */
  .loader {
    width: 30px;
    height: 30px;
    border: 3px solid rgba(255, 255, 255, 0.1);
    border-top-color: #38bdf8;
    border-radius: 50%;
    animation: spin 1s infinite linear;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
</style>