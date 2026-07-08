<script lang="ts">
  import { onMount } from 'svelte';
  import { getStudentName, submitActivityResult } from '$lib/client/activity';

  type Screen = 'home' | 'cv' | 'letter';
  type CvFields = {
    perso: string;
    accroche: string;
    ecole: string;
    stages: string;
    langues: string;
    info: string;
    hobbies: string;
    references: string;
  };
  type LetterFields = {
    exp: string;
    dest: string;
    date: string;
    objet: string;
    appel: string;
    p1: string;
    p2: string;
    p3: string;
    sig: string;
  };

  let studentName = 'Explorateur';
  let screen: Screen = 'home';
  let cvExample = '';
  let letterExample = '';
  let completionMessage = '';
  let cv: CvFields = { perso: '', accroche: '', ecole: '', stages: '', langues: '', info: '', hobbies: '', references: '' };
  let letter: LetterFields = { exp: '', dest: '', date: '', objet: '', appel: 'Madame, Monsieur,', p1: '', p2: '', p3: '', sig: '' };

  const cvExamples = [
    `[DONNÉES PERSONNELLES]\nJulien Favre\nChemin des Epinettes 4\n1964 Conthey\n079 023 85 96\n\n[ACCROCHE]\nFiable, motivé, autonome et curieux, je recherche une place d’apprentissage d’agent d’exploitation.\n\n[STAGE]\nAgent d’exploitation, Service de la propreté urbaine : entretien, plantation, machines.`,
    `[DONNÉES PERSONNELLES]\nDaniela Fontana\n1095 Lutry\n\n[ACCROCHE]\nJe recherche une place d’apprentissage d’assistante médicale. Je suis fiable et j’ai un bon contact avec les gens.\n\n[STAGES]\nClinique dentaire, centre de soins, pharmacie.`,
    `[DONNÉES PERSONNELLES]\nAndrea Seferovic\n2800 Delémont\n\n[ACCROCHE]\nObjectif : apprentissage de spécialiste en restauration. Attentive, aimable et sérieuse.\n\n[INTÉRÊTS]\nDanse hip-hop, natation, recherches Internet.`
  ];

  const letterExamples = [
    `Objet : Candidature à une place d’apprentissage d’agente d’exploitation CFC\n\nMadame,\n\nJe vous fais parvenir mon dossier de candidature. J’apprécie le travail manuel et la variété des tâches.\n\nJe serais heureuse de vous rencontrer pour un entretien ou un stage.`,
    `Objet : Candidature à une place d’apprentissage d’assistant dentaire CFC\n\nMadame, Monsieur,\n\nJe souhaite exercer une profession en contact avec les gens et liée à la santé. Mes stages ont confirmé mon intérêt.\n\nDans l’attente de votre réponse, je vous adresse mes meilleures salutations.`,
    `Objet : Candidature à une place d’apprentissage d’employée de commerce CFC\n\nMadame,\n\nVos activités m’intéressent et mes stages dans l’administration ont confirmé mon choix professionnel.\n\nJe serais ravie de venir me présenter dans votre entreprise.`
  ];

  onMount(() => {
    studentName = getStudentName();
    const savedCv = localStorage.getItem('pcp_cv_v1');
    const savedLetter = localStorage.getItem('pcp_letter_v1');
    if (savedCv) cv = { ...cv, ...(JSON.parse(savedCv) as Partial<CvFields>) };
    if (savedLetter) letter = { ...letter, ...(JSON.parse(savedLetter) as Partial<LetterFields>) };
  });

  function saveCv() {
    localStorage.setItem('pcp_cv_v1', JSON.stringify(cv));
  }

  function saveLetter() {
    localStorage.setItem('pcp_letter_v1', JSON.stringify(letter));
  }

  async function markComplete(kind: 'CV' | 'Lettre de motivation') {
    const report = await submitActivityResult({
      studentName,
      world: 'pcp',
      mission: kind,
      score: 1,
      total: 1,
      scoreBasis: 'last',
      errorCount: 0,
      metadata: { completedAt: new Date().toISOString() }
    });
    completionMessage = report.message;
  }
</script>

<svelte:head>
  <title>Espace PCP / Orientation — Classe Numérique</title>
</svelte:head>

<div class="page">
  <header class="header" style="background: #92400e;">
    <div class="header-inner">
      <div class="brand"><span class="brand-icon">💼</span><div><h1 class="brand-title">Espace PCP / Orientation</h1><p class="brand-subtitle">Dossier professionnel de {studentName}</p></div></div>
      <a class="btn ghost" href="/">↩ QG</a>
    </div>
  </header>

  <main class="main stack">
    {#if screen === 'home'}
      <section class="card stack center" style="max-width: 48rem; margin: 3rem auto;">
        <h2>Préparation au Choix Professionnel</h2>
        <p class="muted">Prépare ton dossier : CV, lettre de motivation, exemples et export PDF/impression.</p>
        <div class="grid world-grid">
          <button class="card stack center" type="button" on:click={() => (screen = 'cv')}><span style="font-size: 3rem;">📝</span><strong>Créer mon CV</strong><span class="muted small">Rédige les bases de ton futur CV.</span></button>
          <button class="card stack center" type="button" on:click={() => (screen = 'letter')}><span style="font-size: 3rem;">✉️</span><strong>Écrire ma Lettre</strong><span class="muted small">Adapte ton message pour une entreprise.</span></button>
        </div>
      </section>
    {:else if screen === 'cv'}
      <section class="stack">
        <div class="mission-top no-print">
          <button class="btn secondary" type="button" on:click={() => (screen = 'home')}>⬅ Retour</button>
          <div class="actions">
            {#each cvExamples as example, index}<button class="btn secondary" type="button" on:click={() => (cvExample = example)}>Exemple {index + 1}</button>{/each}
            <button class="btn good" type="button" on:click={() => window.print()}>📥 Exporter PDF / Imprimer</button>
            <button class="btn primary" type="button" on:click={() => markComplete('CV')}>✅ CV terminé</button>
          </div>
        </div>
        {#if completionMessage}<p class="feedback good no-print">{completionMessage}</p>{/if}
        <div class="split">
          <div class="pcp-sheet">
            <div class="pcp-grid two">
              <div class="stack">
                <h3>Données personnelles</h3>
                <textarea class="pcp-field" bind:value={cv.perso} on:input={saveCv} placeholder="Nom, Prénom&#10;Adresse&#10;Téléphone&#10;Email"></textarea>
                <h3>Langues</h3><textarea class="pcp-field" bind:value={cv.langues} on:input={saveCv} placeholder="Français, allemand, anglais..."></textarea>
                <h3>Informatique</h3><textarea class="pcp-field" bind:value={cv.info} on:input={saveCv} placeholder="Word, Internet..."></textarea>
                <h3>Centres d’intérêts</h3><textarea class="pcp-field" bind:value={cv.hobbies} on:input={saveCv} placeholder="Sport, lecture, activités..."></textarea>
              </div>
              <div class="stack">
                <textarea class="pcp-field" style="font-style: italic;" bind:value={cv.accroche} on:input={saveCv} placeholder="Accroche : fiable, motivé, autonome..."></textarea>
                <h3>Scolarité</h3><textarea class="pcp-field" bind:value={cv.ecole} on:input={saveCv} placeholder="Années - école - lieu"></textarea>
                <h3>Stages d’observation</h3><textarea class="pcp-field" bind:value={cv.stages} on:input={saveCv} placeholder="Dates - métier - entreprise&#10;• Tâches effectuées"></textarea>
                <h3>Références</h3><textarea class="pcp-field" bind:value={cv.references} on:input={saveCv} placeholder="Nom, fonction, téléphone..."></textarea>
              </div>
            </div>
          </div>
          {#if cvExample}<aside class="example-panel no-print">⬅️ Modèle d’inspiration\n\n{cvExample}</aside>{/if}
        </div>
      </section>
    {:else}
      <section class="stack">
        <div class="mission-top no-print">
          <button class="btn secondary" type="button" on:click={() => (screen = 'home')}>⬅ Retour</button>
          <div class="actions">
            {#each letterExamples as example, index}<button class="btn secondary" type="button" on:click={() => (letterExample = example)}>Exemple {index + 1}</button>{/each}
            <button class="btn good" type="button" on:click={() => window.print()}>📥 Exporter PDF / Imprimer</button>
            <button class="btn primary" type="button" on:click={() => markComplete('Lettre de motivation')}>✅ Lettre terminée</button>
          </div>
        </div>
        {#if completionMessage}<p class="feedback good no-print">{completionMessage}</p>{/if}
        <div class="split">
          <div class="pcp-sheet stack">
            <textarea class="pcp-field" style="width: 50%;" bind:value={letter.exp} on:input={saveLetter} placeholder="Ton Prénom Nom&#10;Adresse&#10;Téléphone&#10;Email"></textarea>
            <textarea class="pcp-field" style="width: 50%; margin-left: auto;" bind:value={letter.dest} on:input={saveLetter} placeholder="Entreprise&#10;Responsable&#10;Adresse"></textarea>
            <textarea class="pcp-field" style="text-align: right;" bind:value={letter.date} on:input={saveLetter} placeholder="Lieu, le date"></textarea>
            <textarea class="pcp-field" bind:value={letter.objet} on:input={saveLetter} placeholder="Objet : Candidature..."></textarea>
            <textarea class="pcp-field" bind:value={letter.appel} on:input={saveLetter} placeholder="Madame, Monsieur,"></textarea>
            <textarea class="pcp-field" bind:value={letter.p1} on:input={saveLetter} placeholder="Moi : pourquoi j’écris"></textarea>
            <textarea class="pcp-field" bind:value={letter.p2} on:input={saveLetter} placeholder="Vous : le métier / l’entreprise"></textarea>
            <textarea class="pcp-field" bind:value={letter.p3} on:input={saveLetter} placeholder="Nous : mes atouts / demande d’entretien"></textarea>
            <textarea class="pcp-field" style="width: 40%; margin-left: auto;" bind:value={letter.sig} on:input={saveLetter} placeholder="Ta signature"></textarea>
          </div>
          {#if letterExample}<aside class="example-panel no-print">⬅️ Modèle d’inspiration\n\n{letterExample}</aside>{/if}
        </div>
      </section>
    {/if}
  </main>
</div>
