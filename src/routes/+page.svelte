<script lang="ts">
  import { onMount } from 'svelte';
  import { clearStudentName, getStudentName, storeStudentName } from '$lib/client/activity';
  import { worlds } from '$lib/worlds';

  let ready = false;
  let studentName = '';
  let nameInput = '';

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
    return `${route}?eleve=${encodeURIComponent(studentName)}`;
  }
</script>

<svelte:head>
  <title>Le Portail de la Classe — QG</title>
  <meta name="description" content="Portail SvelteKit local pour les activités de classe." />
</svelte:head>

<div class="page">
  <header class="header">
    <div class="header-inner">
      <div class="brand">
        <span class="brand-icon">🎒</span>
        <div>
          <h1 class="brand-title">Le Portail de la Classe</h1>
          <p class="brand-subtitle">QG local d’apprentissage autonome</p>
        </div>
      </div>
      <a class="btn ghost" href="/teacher">⚙️ Espace Enseignant</a>
    </div>
  </header>

  <main class="main stack">
    {#if !ready}
      <section class="card stack center" style="max-width: 30rem; margin: 3rem auto;">
        <p class="muted">Chargement du QG...</p>
      </section>
    {:else if !studentName}
      <section class="card stack center" style="max-width: 30rem; margin: 3rem auto;">
        <div style="font-size: 3rem;">👋</div>
        <h2>Bonjour !</h2>
        <p class="muted">Inscris ton prénom pour accéder aux défis de la classe.</p>
        <form class="stack" on:submit|preventDefault={login}>
          <label class="label" style="text-align: left;">
            Mon prénom
            <input class="input" bind:value={nameInput} required minlength="2" placeholder="Ex: Lucas, Léa..." />
          </label>
          <button class="btn primary" type="submit">Entrer dans la classe ➔</button>
        </form>
      </section>
    {:else}
      <section class="card mission-top" style="background: linear-gradient(135deg,#312e81,#4338ca); color: white;">
        <div>
          <h2 style="margin: 0;">Heureux de te revoir, <span style="color: #fbbf24;">{studentName}</span> ! 🚀</h2>
          <p style="margin: 0.3rem 0 0; color: #c7d2fe;">Choisis une activité ou un jeu pour t’entraîner.</p>
        </div>
        <button class="btn ghost" type="button" on:click={logout}>❌ Changer de compte</button>
      </section>

      <section class="stack">
        <div>
          <h2>🎯 Les Défis Disponibles</h2>         
        </div>
        <div class="grid world-grid">
          {#each worlds as world}
            <article class="card stack">
              <div style="font-size: 2.5rem;">{world.emoji}</div>
              <div>
                <h3 style="margin: 0 0 0.35rem;">{world.title}</h3>
                <p class="muted small" style="margin: 0;">{world.subtitle}</p>
              </div>
              <a class="btn secondary" href={routeFor(world.route)}>Ouvrir ➔</a>
            </article>
          {/each}
        </div>
      </section>
    {/if}
  </main>

  <footer class="footer">© 2026 Classe Numérique — Fondation SvelteKit locale.</footer>
</div>
