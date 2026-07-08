<script lang="ts">
  import type { ActionData } from './$types';
  export let form: ActionData;
</script>

<svelte:head>
  <title>Accès enseignant — Classe Numérique</title>
</svelte:head>

<div class="page">
  <header class="header">
    <div class="header-inner">
      <div class="brand">
        <span class="brand-icon">🔐</span>
        <div>
          <h1 class="brand-title">Accès enseignant</h1>
          <p class="brand-subtitle">Session protégée côté serveur</p>
        </div>
      </div>
      <a class="btn ghost" href="/">↩ QG</a>
    </div>
  </header>

  <main class="main">
    <form method="POST" class="card stack" style="max-width: 30rem; margin: 3rem auto;">
      <div class="center">
        <div style="font-size: 3rem;">📋</div>
        <h2>Tableau de suivi</h2>
        <p class="muted small">Le mot de passe n’est jamais vérifié dans le navigateur.</p>
      </div>

      {#if form?.message}
        <p class="feedback bad">{form.message}</p>
      {/if}

      <label class="label">
        Mot de passe enseignant
        <input class="input" name="password" type="password" autocomplete="current-password" required />
      </label>

      <button class="btn primary" type="submit">Ouvrir le suivi</button>
    </form>
  </main>
</div>
