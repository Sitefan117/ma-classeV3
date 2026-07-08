<script lang="ts">
  import type { ActionData, PageData } from './$types';

  export let data: PageData;
  export let form: ActionData;

  let search = '';
  let worldFilter = 'all';

  $: filteredResults = data.results.filter((result) => {
    const term = search.trim().toLocaleLowerCase('fr-FR');
    const matchesStudent = !term || result.studentName.toLocaleLowerCase('fr-FR').includes(term);
    const matchesWorld = worldFilter === 'all' || result.world === worldFilter;
    return matchesStudent && matchesWorld;
  });

  $: worlds = Array.from(new Set(data.results.map((result) => result.world))).sort();

  function rate(score: number, total: number): number {
    return total > 0 ? Math.round((score / total) * 100) : 0;
  }

  function rateClass(score: number, total: number): string {
    const percent = rate(score, total);
    if (percent >= 80) return 'score-pill good';
    if (percent >= 50) return 'score-pill mid';
    return 'score-pill low';
  }

  function formatDate(timestamp: number): string {
    return new Date(timestamp).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' });
  }
</script>

<svelte:head>
  <title>Tableau enseignant — Classe Numérique</title>
</svelte:head>

<div class="page">
  <header class="header">
    <div class="header-inner">
      <div class="brand">
        <span class="brand-icon">📋</span>
        <div>
          <h1 class="brand-title">Suivi des Résultats</h1>
          <p class="brand-subtitle">SQLite local, session enseignant protégée</p>
        </div>
      </div>
      <div class="actions no-print">
        <a class="btn ghost" href="/">↩ QG</a>
        <form method="POST" action="/teacher/logout">
          <button class="btn ghost" type="submit">Déconnexion</button>
        </form>
      </div>
    </div>
  </header>

  <main class="main stack">
    <section class="grid world-grid">
      <div class="card compact">
        <div class="kicker">Élèves suivis</div>
        <strong style="font-size: 2rem;">{data.students.length}</strong>
      </div>
      <div class="card compact">
        <div class="kicker">Résultats enregistrés</div>
        <strong style="font-size: 2rem;">{data.results.length}</strong>
      </div>
      <div class="card compact">
        <div class="kicker">Progressions monde/mission</div>
        <strong style="font-size: 2rem;">{data.progress.length}</strong>
      </div>
    </section>

    <section class="card stack no-print">
      <div class="mission-top">
        <div>
          <h2>Recherche intervention</h2>
          <p class="muted small">Filtrer rapidement pour repérer les besoins d’aide.</p>
        </div>
        <div class="actions">
          <input class="input" style="width: 18rem;" bind:value={search} placeholder="Rechercher un élève..." />
          <select class="select" style="width: 16rem;" bind:value={worldFilter}>
            <option value="all">Tous les mondes</option>
            {#each worlds as world}
              <option value={world}>{world}</option>
            {/each}
          </select>
        </div>
      </div>
    </section>

    <section class="card stack">
      <h2>Résultats récents</h2>
      <div class="table-wrap">
        <table class="table">
          <thead>
            <tr>
              <th>Élève</th>
              <th>Monde</th>
              <th>Mission</th>
              <th>Score</th>
              <th>Réussite</th>
              <th>Erreurs</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {#if filteredResults.length === 0}
              <tr><td colspan="7" class="center muted">Aucun résultat pour ces filtres.</td></tr>
            {:else}
              {#each filteredResults as result}
                <tr>
                  <td><strong>{result.studentName}</strong></td>
                  <td>{result.world}</td>
                  <td>{result.mission}</td>
                  <td><strong>{result.score} / {result.total}</strong> <span class="muted small">({result.scoreBasis})</span></td>
                  <td><span class={rateClass(result.score, result.total)}>{rate(result.score, result.total)}%</span></td>
                  <td>{result.errorCount}{#if result.errorFamilies}<br /><span class="muted small">{result.errorFamilies}</span>{/if}</td>
                  <td>{formatDate(result.createdAt)}</td>
                </tr>
              {/each}
            {/if}
          </tbody>
        </table>
      </div>
    </section>

    <section class="split">
      <div class="card stack">
        <h2>Progression par monde</h2>
        <div class="table-wrap">
          <table class="table">
            <thead><tr><th>Élève</th><th>Monde</th><th>Mission</th><th>Meilleur</th><th>Dernier</th><th>Essais</th></tr></thead>
            <tbody>
              {#each data.progress as progress}
                <tr>
                  <td>{progress.studentName}</td>
                  <td>{progress.world}</td>
                  <td>{progress.mission}</td>
                  <td>{progress.bestScore} / {progress.total}</td>
                  <td>{progress.lastScore} / {progress.total}</td>
                  <td>{progress.completions}</td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>

      <div class="card stack no-print">
        <h2>Notes enseignant</h2>
        {#if form?.message}<p class="feedback good">{form.message}</p>{/if}
        <form method="POST" action="?/addNote" class="stack">
          <label class="label">
            Élève concerné
            <select class="select" name="studentId">
              <option value="">Note générale</option>
              {#each data.students as student}
                <option value={student.id}>{student.displayName}</option>
              {/each}
            </select>
          </label>
          <label class="label">
            Monde / activité
            <input class="input" name="world" placeholder="ex: geometrie, livrets..." />
          </label>
          <label class="label">
            Intervention prévue
            <textarea class="textarea" name="body" required placeholder="Besoin repéré, relance, groupe de soutien..."></textarea>
          </label>
          <button class="btn primary" type="submit">Ajouter la note</button>
        </form>

        <div class="stack">
          {#each data.notes as note}
            <article class="card compact">
              <strong>{note.studentName ?? 'Note générale'}</strong>
              {#if note.world}<span class="badge">{note.world}</span>{/if}
              <p>{note.body}</p>
              <p class="muted small">{formatDate(note.createdAt)}</p>
            </article>
          {/each}
        </div>
      </div>
    </section>
  </main>
</div>
