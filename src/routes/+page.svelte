<script lang="ts">
  import { base } from '$app/paths';
  import { onMount } from 'svelte';
  import { clearStudentName, getStudentName, storeStudentName } from '$lib/client/activity';
  import { worlds } from '$lib/worlds';
  import { labModules, type LabModule } from '$lib/modules';

  let ready = false;
  let studentName = '';
  let nameInput = '';

  // Gestion des vues : 'HUB' | 'ARCADE' | 'LAB'
  let currentView: 'HUB' | 'ARCADE' | 'LAB' = 'HUB';

  // Filtres Arcade
  let selectedArcadeCategory = 'TOUS';
  const arcadeCategories = ['TOUS', 'MATHS', 'FRANÇAIS', 'SCIENCES', 'AUTRES'];

  // Navigation Learning Lab (Matière -> Domaine)
  let selectedSubject: string | null = null;
  let selectedDomain: string | null = null;

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
    currentView = 'HUB';
  }

  function routeFor(route: string): string {
    return `${base}${route}?eleve=${encodeURIComponent(studentName)}`;
  }

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
    if (selectedArcadeCategory === 'TOUS') return true;
    return detectCategory(w.title, w.subtitle) === selectedArcadeCategory;
  });

  // Extraction dynamique des matières et domaines du Learning Lab
  $: subjects = Array.from(new Set(labModules.map(m => m.subject)));

  $: domainsForSubject = selectedSubject
    ? Array.from(new Set(labModules.filter(m => m.subject === selectedSubject).map(m => m.domain)))
    : [];

  $: filteredLabModules = labModules.filter(m => {
    if (selectedSubject && m.subject !== selectedSubject) return false;
    if (selectedDomain && m.domain !== selectedDomain) return false;
    return true;
  });

  function selectSubject(subj: string) {
    if (selectedSubject === subj) {
      selectedSubject = null;
      selectedDomain = null;
    } else {
      selectedSubject = subj;
      selectedDomain = null;
    }
  }

  function selectDomain(dom: string) {
    selectedDomain = selectedDomain === dom ? null : dom;
  }
</script>

<svelte:head>
  <title>LEARNING HUB — QG Gamifié</title>
  <meta name="description" content="Plateforme d'apprentissage numérique : Arcade et Learning Lab" />
</svelte:head>

<!-- Arrière-plan animé Dark Gaming -->
<div class="bg-container">
  <div class="glow-orb orb-1"></div>
  <div class="glow-orb orb-2"></div>
  <div class="glow-orb orb-3"></div>
  <div class="grid-overlay"></div>
</div>

<div class="app-layout">
  <!-- Header Sticky -->
  <header class="header">
    <div class="header-inner">
      <button class="brand brand-btn" type="button" on:click={() => currentView = 'HUB'}>
        <span class="brand-icon">⚡</span>
        <div class="brand-text">
          <h1 class="brand-title">LEARNING <span class="gradient-text">HUB</span></h1>
          <p class="brand-subtitle">Ton espace pour apprendre en mode jeu</p>
        </div>
      </button>

      <div class="header-actions">
        {#if studentName}
          <div class="profile-chip">
            <span class="profile-label">ÉLÈVE</span>
            <span class="profile-name">{studentName}</span>
          </div>
          <button class="btn btn-ghost btn-sm" type="button" on:click={logout} title="Changer de profil">
            🔒
          </button>
        {/if}
        <a class="btn btn-teacher" href="{base}/teacher">
           <span>Espace Enseignant</span>
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
      <!-- Connexion Élève -->
      <section class="card auth-card center">
        <div class="avatar-badge">🎮</div>
        <h2>BIENVENUE SUR LE HUB</h2>
        <p class="muted">Inscris ton prénom pour déverrouiller ton espace d'apprentissage.</p>
        
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
      <!-- FIL D'ARIANE / NAVIGATION SUPERIEURE -->
      {#if currentView !== 'HUB'}
        <nav class="breadcrumb-nav">
          <button class="btn-back" on:click={() => currentView = 'HUB'}>
            ← Retour au Hub
          </button>
          <span class="breadcrumb-separator">/</span>
          <span class="breadcrumb-current">
            {currentView === 'ARCADE' ? '🎮 ARCADE' : '🧠 LEARNING LAB'}
          </span>
        </nav>
      {/if}

      <!-- ================================================================= -->
      <!-- VUE 1 : VUE DU HUB PRINCIPAL (ENTRÉE GÉNÉRALE) -->
      <!-- ================================================================= -->
      {#if currentView === 'HUB'}
        <section class="hero-banner">
          <div class="hero-content">
            <span class="badge-tag">CENTRE D'APPRENTISSAGE</span>
            <h2 class="hero-title">
              Salut <span class="student-highlight">{studentName}</span> !
            </h2>
            <p class="hero-sub">
              Choisis ta destination pour aujourd'hui.
            </p>
          </div>
        </section>

        <!-- Les Deux Entrées Majeures du Hub -->
        <div class="hub-portals-grid">
          <!-- Entrée ARCADE -->
          <button class="portal-card arcade-portal" on:click={() => currentView = 'ARCADE'}>
            <div class="portal-badge">ESPACE JEUX</div>
            <div class="portal-icon">🎮</div>
            <h3 class="portal-title">ARCADE</h3>
            <p class="portal-desc">
              Rejoins la zone de jeu. Relève des défis, bats tes records et affronte les quiz interactifs !
            </p>
            <div class="portal-footer">
              <span class="btn btn-portal btn-arcade">JOUER ➔</span>
            </div>
          </button>

          <!-- Entrée LEARNING LAB -->
          <button class="portal-card lab-portal" on:click={() => currentView = 'LAB'}>
            <div class="portal-badge lab-badge">COURS INTERACTIFS</div>
            <div class="portal-icon">🧠</div>
            <h3 class="portal-title">LEARNING LAB</h3>
            <p class="portal-desc">
              Accède aux modules de cours, schémas, manipulations interactives et corrigés intégrés.
            </p>
            <div class="portal-footer">
              <span class="btn btn-portal btn-lab">APPRENDRE ➔</span>
            </div>
          </button>
        </div>

        <!-- Aperçu Structure Progression Future -->
        <section class="progression-block card">
          <div class="progression-header">
            <div>
              <h3>PROGRESSION GLOBALE DU HUB</h3>
              <span class="status-badge">ACCÈS LIBRE LIBÉRÉ</span>
            </div>
            <div class="xp-placeholder">0 / 1000 XP</div>
          </div>
          <div class="progress-bar-bg">
            <div class="progress-bar-fill" style="width: 25%;"></div>
          </div>
          <div class="progression-features-preview">
            <span>⭐ Modules complétés</span>
            <span>🏆 Badges débloqués</span>
            <span>⚡ Défis validés</span>
          </div>
        </section>

      <!-- ================================================================= -->
      <!-- VUE 2 : ARCADE (JEUX ÉDUCATIFS) -->
      <!-- ================================================================= -->
      {:else if currentView === 'ARCADE'}
        <section class="library-section">
          <div class="library-header">
            <div>
              <h2 class="section-title">🎮 ARCADE</h2>
              <p class="muted small">Sélectionne un jeu pour commencer la partie.</p>
            </div>

            <!-- Filtres Catégories Arcade -->
            <div class="filter-bar">
              {#each arcadeCategories as cat}
                <button 
                  class="filter-btn" 
                  class:active={selectedArcadeCategory === cat}
                  on:click={() => selectedArcadeCategory = cat}
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
                  <span class="meta-tag">JEU INTERACTIF</span>
                  <span class="meta-tag highlight">DISPONIBLE</span>
                </div>

                <a class="btn btn-play" href={routeFor(world.route)}>
                  ▶ JOUER
                </a>
              </article>
            {/each}
          </div>
        </section>

      <!-- ================================================================= -->
      <!-- VUE 3 : LEARNING LAB (COURS & RESSOURCES INTERACTIVES) -->
      <!-- ================================================================= -->
      {:else if currentView === 'LAB'}
        <section class="lab-section">
          <div class="lab-header">
            <h2 class="section-title lab-title-glow">🧠 LEARNING LAB</h2>
            <p class="lab-subtitle">Espace de cours interactifs et manipulations numériques.</p>
          </div>

          <!-- ÉTAPE 1 : Choix de la Matière -->
          <div class="lab-navigation-block">
            <h3 class="nav-label">1. Choisi ta matière :</h3>
            <div class="subject-pills">
              <button 
                class="subject-pill" 
                class:active={selectedSubject === null}
                on:click={() => { selectedSubject = null; selectedDomain = null; }}
              >
                Toutes les matières
              </button>
              {#each subjects as subj}
                <button 
                  class="subject-pill" 
                  class:active={selectedSubject === subj}
                  on:click={() => selectSubject(subj)}
                >
                  {#if subj === 'Mathématiques'}📚{:else if subj === 'Français'}🇫🇷{:else if subj === 'Sciences'}🔬{:else}📖{/if}
                  {subj}
                </button>
              {/each}
            </div>
          </div>

          <!-- ÉTAPE 2 : Choix du Domaine (si matière sélectionnée) -->
          {#if selectedSubject && domainsForSubject.length > 0}
            <div class="lab-navigation-block domain-block">
              <h3 class="nav-label">2. Domaine ({selectedSubject}) :</h3>
              <div class="domain-pills">
                <button 
                  class="domain-pill" 
                  class:active={selectedDomain === null}
                  on:click={() => selectedDomain = null}
                >
                  Tous les domaines
                </button>
                {#each domainsForSubject as dom}
                  <button 
                    class="domain-pill" 
                    class:active={selectedDomain === dom}
                    on:click={() => selectDomain(dom)}
                  >
                    → {dom}
                  </button>
                {/each}
              </div>
            </div>
          {/if}

          <!-- ÉTAPE 3 : Grille des Cartes de Modules de Cours -->
          <div class="lab-modules-grid">
            {#each filteredLabModules as module}
              <article class="card lab-card">
                <div class="lab-card-header">
                  <span class="lab-subject-tag">{module.subject} • {module.domain}</span>
                  <span class="lab-level-badge">{module.level}</span>
                </div>

                <h3 class="lab-card-title">{module.title}</h3>
                <p class="lab-card-desc">{module.description}</p>

                <div class="lab-card-features">
                  {#if module.isInteractive}
                    <span class="feature-tag">✨ INTERACTIF</span>
                  {/if}
                  {#if module.duration}
                    <span class="feature-tag">⏱️ {module.duration}</span>
                  {/if}
                </div>

                <div class="lab-card-actions">
                  <a class="btn btn-lab-open" href={routeFor(module.href)}>
                    📖 OUVRIR →
                  </a>
                  {#if module.gameLink}
                    <a class="btn btn-lab-game" href={routeFor(module.gameLink.route)}>
                      🎮 {module.gameLink.title}
                    </a>
                  {/if}
                </div>
              </article>
            {/each}
          </div>

          {#if filteredLabModules.length === 0}
            <div class="card empty-state center">
              <p class="muted">Aucun module de cours disponible pour cette sélection pour le moment.</p>
            </div>
          {/if}
        </section>
      {/if}
    {/if}
  </main>

  <footer class="footer">
    <span>© 2026 LEARNING HUB — Espace d'Apprentissage Interactif</span>
  </footer>
</div>

<style>
  :global(body) {
    background-color: #090d16;
    color: #f1f5f9;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
    margin: 0;
    padding: 0;
  }

  * {
    box-sizing: border-box;
  }

  /* --- FOND ANIMÉ --- */
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
    opacity: 0.22;
    animation: float 20s infinite alternate ease-in-out;
  }

  .orb-1 { width: 500px; height: 500px; background: #06b6d4; top: -100px; left: -100px; }
  .orb-2 { width: 600px; height: 600px; background: #6366f1; bottom: -150px; right: -100px; animation-delay: -5s; }
  .orb-3 { width: 400px; height: 400px; background: #3b82f6; top: 40%; left: 40%; animation-delay: -10s; }

  @keyframes float {
    0% { transform: translate(0, 0) scale(1); }
    100% { transform: translate(50px, 40px) scale(1.1); }
  }

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
    gap: 2rem;
  }

  /* --- HEADER --- */
  .header {
    position: sticky;
    top: 0;
    z-index: 50;
    background: rgba(10, 15, 29, 0.85);
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

  .brand-btn {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    text-align: left;
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .brand-icon {
    font-size: 1.8rem;
  }

  .brand-title {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 800;
    letter-spacing: 0.05em;
    color: #fff;
  }

  .brand-subtitle {
    margin: 0;
    font-size: 0.75rem;
    color: #94a3b8;
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 0.75rem;
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

  .profile-label { font-size: 0.65rem; color: #38bdf8; font-weight: 700; }
  .profile-name { font-size: 0.9rem; font-weight: 700; color: #fff; }

  /* --- FIL D'ARIANE --- */
  .breadcrumb-nav {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.9rem;
  }

  .btn-back {
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.12);
    color: #38bdf8;
    padding: 0.4rem 0.85rem;
    border-radius: 8px;
    font-weight: 700;
    cursor: pointer;
  }

  .breadcrumb-separator { color: #64748b; }
  .breadcrumb-current { font-weight: 800; color: #f1f5f9; }

  /* --- HERO BANNER --- */
  .hero-banner {
    background: linear-gradient(135deg, rgba(30, 27, 75, 0.7), rgba(15, 23, 42, 0.8));
    border: 1px solid rgba(99, 102, 241, 0.25);
    border-radius: 20px;
    padding: 2rem;
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
    margin-bottom: 0.5rem;
  }

  .hero-title { margin: 0 0 0.5rem 0; font-size: 2rem; font-weight: 900; }
  .hero-sub { margin: 0; color: #cbd5e1; font-size: 1.05rem; }
  .student-highlight { color: #38bdf8; font-weight: 800; }

  /* --- HUB PORTALS GRID (ENTRÉES MAJEURES) --- */
  .hub-portals-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }

  @media (max-width: 768px) {
    .hub-portals-grid { grid-template-columns: 1fr; }
  }

  .portal-card {
    background: rgba(15, 23, 42, 0.7);
    border: 2px solid rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
    cursor: pointer;
    transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
    color: inherit;
    position: relative;
  }

  .arcade-portal:hover {
    border-color: #06b6d4;
    box-shadow: 0 0 30px rgba(6, 182, 212, 0.25);
    transform: translateY(-4px);
  }

  .lab-portal:hover {
    border-color: #a855f7;
    box-shadow: 0 0 30px rgba(168, 85, 247, 0.25);
    transform: translateY(-4px);
  }

  .portal-badge {
    font-size: 0.7rem;
    font-weight: 800;
    letter-spacing: 0.05em;
    padding: 0.2rem 0.6rem;
    background: rgba(6, 182, 212, 0.2);
    color: #22d3ee;
    border-radius: 6px;
    margin-bottom: 1rem;
  }

  .lab-badge {
    background: rgba(168, 85, 247, 0.2);
    color: #c084fc;
  }

  .portal-icon { font-size: 3.5rem; margin-bottom: 0.5rem; }
  .portal-title { margin: 0 0 0.5rem 0; font-size: 1.8rem; font-weight: 900; }
  .portal-desc { margin: 0 0 1.5rem 0; color: #94a3b8; font-size: 0.95rem; line-height: 1.5; flex: 1; }
  .portal-footer { width: 100%; }

  .btn-portal { width: 100%; padding: 0.85rem; font-size: 1rem; border-radius: 12px; }
  .btn-arcade { background: linear-gradient(135deg, #06b6d4, #3b82f6); color: #fff; }
  .btn-lab { background: linear-gradient(135deg, #8b5cf6, #6366f1); color: #fff; }

  /* --- SECTION LEARNING LAB --- */
  .lab-section { display: flex; flex-direction: column; gap: 1.5rem; }
  .lab-header { margin-bottom: 0.5rem; }
  .section-title { margin: 0 0 0.25rem 0; font-size: 1.8rem; font-weight: 900; }
  .lab-title-glow { color: #a78bfa; }
  .lab-subtitle { margin: 0; color: #94a3b8; font-size: 0.95rem; }

  .lab-navigation-block {
    background: rgba(15, 23, 42, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 14px;
    padding: 1rem 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .nav-label { margin: 0; font-size: 0.85rem; color: #cbd5e1; font-weight: 700; }

  .subject-pills, .domain-pills { display: flex; gap: 0.6rem; flex-wrap: wrap; }

  .subject-pill, .domain-pill {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #cbd5e1;
    padding: 0.5rem 1rem;
    border-radius: 10px;
    font-weight: 700;
    font-size: 0.85rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .subject-pill.active {
    background: #8b5cf6;
    color: #fff;
    border-color: #a78bfa;
    box-shadow: 0 0 15px rgba(139, 92, 246, 0.4);
  }

  .domain-pill.active {
    background: #06b6d4;
    color: #000;
    border-color: #67e8f9;
  }

  /* CARTES DU LEARNING LAB (Plus calmes et axées sur la lisibilité) */
  .lab-modules-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }

  @media (max-width: 768px) {
    .lab-modules-grid { grid-template-columns: 1fr; }
  }

  .lab-card {
    background: rgba(15, 23, 42, 0.8);
    border: 1px solid rgba(139, 92, 246, 0.25);
    border-radius: 16px;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    transition: border-color 0.2s ease;
  }

  .lab-card:hover {
    border-color: rgba(168, 85, 247, 0.6);
  }

  .lab-card-header { display: flex; justify-content: space-between; align-items: center; }
  .lab-subject-tag { font-size: 0.7rem; font-weight: 800; color: #c084fc; letter-spacing: 0.05em; }
  .lab-level-badge { font-size: 0.7rem; font-weight: 800; background: rgba(255, 255, 255, 0.1); padding: 0.2rem 0.5rem; border-radius: 4px; color: #e2e8f0; }

  .lab-card-title { margin: 0; font-size: 1.25rem; font-weight: 800; color: #fff; line-height: 1.3; }
  .lab-card-desc { margin: 0; font-size: 0.88rem; color: #94a3b8; line-height: 1.5; flex: 1; }

  .lab-card-features { display: flex; gap: 0.5rem; }
  .feature-tag { font-size: 0.7rem; padding: 0.2rem 0.5rem; background: rgba(255, 255, 255, 0.05); border-radius: 4px; color: #cbd5e1; font-weight: 600; }

  .lab-card-actions { display: flex; gap: 0.75rem; margin-top: 0.5rem; }

  .btn-lab-open {
    flex: 1;
    background: #8b5cf6;
    color: #fff;
    text-align: center;
    padding: 0.65rem;
    border-radius: 10px;
    font-weight: 800;
    font-size: 0.85rem;
    text-decoration: none;
    transition: background 0.2s ease;
  }

  .btn-lab-open:hover { background: #7c3aed; }

  .btn-lab-game {
    background: rgba(255, 255, 255, 0.08);
    color: #38bdf8;
    border: 1px solid rgba(56, 189, 248, 0.3);
    padding: 0.65rem 0.85rem;
    border-radius: 10px;
    font-weight: 700;
    font-size: 0.85rem;
    text-decoration: none;
  }

  /* --- BOUTONS, INPUTS & UTILITAIRES --- */
  .card {
    background: rgba(15, 23, 42, 0.65);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 1.5rem;
  }

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
  }

  .btn-primary { background: linear-gradient(135deg, #06b6d4, #3b82f6); color: #fff; }
  .btn-glow { box-shadow: 0 0 20px rgba(6, 182, 212, 0.4); }
  .btn-teacher { background: rgba(255, 255, 255, 0.05); color: #cbd5e1; border: 1px solid rgba(255, 255, 255, 0.1); }
  .btn-ghost { background: transparent; color: #94a3b8; }
  .btn-sm { padding: 0.4rem 0.6rem; font-size: 0.8rem; }

  .auth-card { max-width: 420px; margin: 3rem auto; width: 100%; display: flex; flex-direction: column; align-items: center; gap: 1rem; text-align: center; }
  .avatar-badge { font-size: 3rem; }
  .auth-form { width: 100%; display: flex; flex-direction: column; gap: 1.25rem; }
  .input-group { display: flex; flex-direction: column; gap: 0.4rem; text-align: left; }
  .input-group label { font-size: 0.7rem; font-weight: 800; color: #38bdf8; }
  .input-gaming { background: rgba(0, 0, 0, 0.4); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 10px; padding: 0.8rem 1rem; color: #fff; font-size: 1rem; outline: none; }

  .gradient-text { background: linear-gradient(135deg, #38bdf8, #818cf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .muted { color: #94a3b8; }
  .muted.small { font-size: 0.85rem; }
  .center { text-align: center; }

  .progression-block { display: flex; flex-direction: column; gap: 1rem; background: rgba(15, 23, 42, 0.4); }
  .progression-header { display: flex; justify-content: space-between; align-items: center; }
  .progression-header h3 { margin: 0; font-size: 0.95rem; }
  .status-badge { font-size: 0.65rem; background: rgba(234, 179, 8, 0.15); color: #fde047; padding: 0.15rem 0.5rem; border-radius: 4px; font-weight: 700; }
  .xp-placeholder { font-family: monospace; font-size: 0.85rem; color: #64748b; }
  .progress-bar-bg { width: 100%; height: 8px; background: rgba(255, 255, 255, 0.05); border-radius: 4px; overflow: hidden; }
  .progress-bar-fill { height: 100%; background: linear-gradient(90deg, #06b6d4, #8b5cf6); }
  .progression-features-preview { display: flex; gap: 1.5rem; font-size: 0.8rem; color: #64748b; flex-wrap: wrap; }

  .library-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 1rem; gap: 1rem; flex-wrap: wrap; }
  .filter-bar { display: flex; gap: 0.4rem; background: rgba(0, 0, 0, 0.3); padding: 0.3rem; border-radius: 10px; overflow-x: auto; }
  .filter-btn { background: transparent; border: none; color: #94a3b8; padding: 0.4rem 0.75rem; border-radius: 6px; font-weight: 700; font-size: 0.75rem; cursor: pointer; }
  .filter-btn.active { background: #38bdf8; color: #090d16; }

  .world-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
  @media (max-width: 900px) { .world-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 600px) { .world-grid { grid-template-columns: 1fr; } }

  .game-card { display: flex; flex-direction: column; gap: 1rem; }
  .card-top { display: flex; justify-content: space-between; align-items: center; }
  .category-tag { font-size: 0.65rem; font-weight: 800; color: #818cf8; }
  .status-dot { width: 8px; height: 8px; background: #10b981; border-radius: 50%; }
  .card-icon { font-size: 2.8rem; text-align: center; margin: 0.25rem 0; }
  .card-info { flex: 1; }
  .game-title { margin: 0 0 0.4rem 0; font-size: 1.1rem; font-weight: 800; color: #fff; }
  .game-desc { margin: 0; font-size: 0.85rem; color: #94a3b8; line-height: 1.4; }
  .card-meta { display: flex; gap: 0.5rem; }
  .meta-tag { font-size: 0.65rem; padding: 0.2rem 0.5rem; background: rgba(255, 255, 255, 0.04); border-radius: 4px; color: #64748b; }
  .meta-tag.highlight { color: #34d399; }

  .btn-play { background: rgba(255, 255, 255, 0.08); color: #fff; border: 1px solid rgba(255, 255, 255, 0.15); width: 100%; text-align: center; }

  .footer { padding: 2rem; text-align: center; font-size: 0.8rem; color: #475569; border-top: 1px solid rgba(255, 255, 255, 0.05); }
  .loader { width: 30px; height: 30px; border: 3px solid rgba(255, 255, 255, 0.1); border-top-color: #38bdf8; border-radius: 50%; animation: spin 1s infinite linear; }
  @keyframes spin { to { transform: rotate(360deg); } }
</style>