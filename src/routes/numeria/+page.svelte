<script lang="ts">
  import { onMount } from 'svelte';
  import { getStudentName, submitActivityResult } from '$lib/client/activity';

  type Grade = '6H' | '7H' | '8H';
  type Screen = 'welcome' | 'hub' | 'realm' | 'game' | 'result' | 'codex';
  type Realm = { id: string; name: string; desc: string };
  type Question = { q: string; a: string; help?: string };
  type Progress = Record<string, Record<string, number>>;
  type GameState = { playerName: string; selectedGrade: Grade; progress: Progress; unlockedCodex: Grade[] };

  const STORAGE_KEY = 'numeria_save_sveltekit_v1';
  const realms: Record<Grade, Realm[]> = {
    '6H': [
      { id: '6H-N1', name: '🏞️ Vallée des Collections', desc: 'Dénombrements, groupements et sauts numériques.' },
      { id: '6H-N2', name: '📜 Runes de Lecture', desc: 'Structure de position et comparaisons jusqu’à 10’000.' },
      { id: '6H-N3', name: '📏 Sentier des Droites', desc: 'Lecture de positions graduées.' },
      { id: '6H-N4', name: '💎 Citadelle des Décompositions', desc: 'Extraction des ordres U, D, C, M.' },
      { id: '6H-N5', name: '🌌 Portes de l’Histoire', desc: 'Grands nombres et passages de seuils.' }
    ],
    '7H': [
      { id: '7H-N1', name: '🏰 Domaine des Positions', desc: 'Structure jusqu’au million.' },
      { id: '7H-N2', name: '⚖️ Équilibre des Ordres', desc: 'Encadrements et intercalations.' },
      { id: '7H-N3', name: '⚡ Noyau des Extractions', desc: 'Dizaines, centaines et milliers entiers.' },
      { id: '7H-N4', name: '🍕 Archipel des Fractions', desc: 'Fractions usuelles et grandeurs.' },
      { id: '7H-N5', name: '💧 Cascades Décimales', desc: 'Fractions décimales et nombres à virgule.' }
    ],
    '8H': [
      { id: '8H-N1', name: '🌌 Confins des Milliards', desc: 'Milliards, millions et milliers.' },
      { id: '8H-N2', name: '✍️ Temple des Écritures', desc: 'Mots-nombres complexes.' },
      { id: '8H-N3', name: '🗺️ Cartographie Suprême', desc: 'Intercalations décimales fines.' },
      { id: '8H-N4', name: '⏳ Distorsions de Grandeurs', desc: 'Sauts modulables du millième.' },
      { id: '8H-N5', name: '🔍 Analyseur de Micro-Valeurs', desc: 'Extraction de composants décimaux.' }
    ]
  };

  const codexItems: Record<Grade, { name: string; desc: string }> = {
    '6H': { name: 'Le Sceptre d’Émeraude', desc: 'Canalise les groupements par 10.' },
    '7H': { name: 'L’Orbe de l’Éclipse', desc: 'Permet de scinder l’unité en fractions.' },
    '8H': { name: 'L’Éclair de Platine', desc: 'Sonde des milliards aux millièmes.' }
  };

  let screen: Screen = 'welcome';
  let state: GameState = { playerName: '', selectedGrade: '6H', progress: {}, unlockedCodex: [] };
  let selectedRealm: Realm = realms['6H'][0];
  let selectedRealmIndex = 0;
  let missionId = 0;
  let questions: Question[] = [];
  let questionIndex = 0;
  let score = 0;
  let input = '';
  let feedback = '';
  let transitioning = false;
  let stars = 0;
  let sentMessage = '';

  onMount(() => {
    const studentName = getStudentName('');
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        state = JSON.parse(saved) as GameState;
      } catch {
        state.playerName = studentName;
      }
    } else {
      state.playerName = studentName;
    }
    screen = state.playerName ? 'hub' : 'welcome';
  });

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function formatSwiss(value: number | string): string {
    const [whole, decimal] = value.toString().split('.');
    return whole.replace(/\B(?=(\d{3})+(?!\d))/g, "'") + (decimal ? `.${decimal}` : '');
  }

  function clean(value: string): string {
    return value.trim().toLocaleLowerCase('fr-FR').replace(/[\s']/g, '').replace(',', '.');
  }

  function startGame() {
    if (!state.playerName.trim()) return;
    state.playerName = state.playerName.trim();
    state.selectedGrade = '6H';
    save();
    screen = 'hub';
  }

  function resetGame() {
    if (!confirm('Réinitialiser toute la progression Numéria ?')) return;
    state = { playerName: '', selectedGrade: '6H', progress: {}, unlockedCodex: [] };
    localStorage.removeItem(STORAGE_KEY);
    screen = 'welcome';
  }

  function selectGrade(grade: Grade) {
    state.selectedGrade = grade;
    save();
  }

  function openRealm(realm: Realm, index: number) {
    selectedRealm = realm;
    selectedRealmIndex = index;
    screen = 'realm';
  }

  function generateQuestions(grade: Grade, realmId: string): Question[] {
    const list: Question[] = [];
    for (let index = 0; index < 5; index += 1) {
      if (grade === '6H') {
        if (realmId.endsWith('N1')) {
          const hundreds = Math.floor(Math.random() * 8) + 2;
          const tens = Math.floor(Math.random() * 9) + 1;
          list.push({ q: `Recompose : ${hundreds} paquets de 100 et ${tens} paquets de 10.`, a: String(hundreds * 100 + tens * 10), help: 'Chaque paquet de 100 vaut une centaine.' });
        } else if (realmId.endsWith('N2')) {
          const value = Math.floor(Math.random() * 7000) + 1500;
          list.push({ q: `Dans ${formatSwiss(value)}, quel est le chiffre des centaines ?`, a: String(Math.floor((value % 1000) / 100)), help: 'M | C | D | U : repère la colonne des centaines.' });
        } else if (realmId.endsWith('N3')) {
          const step = Math.random() > 0.5 ? 10 : 100;
          const start = (Math.floor(Math.random() * 40) + 10) * 10;
          list.push({ q: `Avance de ${step} en ${step}. Quel nombre vient après ${formatSwiss(start)} ?`, a: String(start + step), help: 'Ajoute la valeur d’un intervalle.' });
        } else if (realmId.endsWith('N4')) {
          const value = Math.floor(Math.random() * 4000) + 450;
          list.push({ q: `Combien de dizaines entières y a-t-il dans ${formatSwiss(value)} ?`, a: String(Math.floor(value / 10)), help: 'Une dizaine entière contient 10 unités.' });
        } else {
          const base = 9950 + Math.floor(Math.random() * 30);
          list.push({ q: `${formatSwiss(base)} + 1 = ?`, a: String(base + 1), help: 'Observe le passage de seuil.' });
        }
      } else if (grade === '7H') {
        if (realmId.endsWith('N4')) {
          const pool = [{ q: 'Quelle fraction représente la moitié exacte ?', a: '1/2' }, { q: 'Écris trois quarts en fraction.', a: '3/4' }, { q: 'Écris deux tiers en fraction.', a: '2/3' }];
          list.push(pool[index % pool.length]);
        } else if (realmId.endsWith('N5')) {
          const cents = [5, 12, 75, 8, 142][index];
          list.push({ q: `Convertis ${cents}/100 en nombre à virgule.`, a: String(cents / 100), help: 'Un centième est deux rangs après la virgule.' });
        } else {
          const value = Math.floor(Math.random() * 400000) + 150000;
          list.push({ q: `Combien de centaines entières y a-t-il dans ${formatSwiss(value)} ?`, a: String(Math.floor(value / 100)), help: 'Divise mentalement par 100.' });
        }
      } else {
        if (realmId.endsWith('N2')) {
          const names = [{ q: 'deux millions cinq cent mille', a: '2500000' }, { q: 'quatre millions deux cent mille', a: '4200000' }, { q: 'un million huit cent mille', a: '1800000' }];
          const selected = names[index % names.length];
          list.push({ q: `Écris en chiffres : ${selected.q}.`, a: selected.a, help: 'Place les millions puis les milliers.' });
        } else if (realmId.endsWith('N3')) {
          const base = Number(((Math.floor(Math.random() * 8) + 2) + 0.14).toFixed(2));
          list.push({ q: `Trouve le centième : ${base} < ? < ${(base + 0.02).toFixed(2)}`, a: (base + 0.01).toFixed(2), help: 'Ajoute un centième.' });
        } else if (realmId.endsWith('N4')) {
          const base = Number(((Math.floor(Math.random() * 5) + 1) + 0.45).toFixed(3));
          list.push({ q: `Ajoute 5 millièmes à ${base}.`, a: (base + 0.005).toFixed(3), help: 'Un millième est le troisième rang après la virgule.' });
        } else {
          const billions = Math.floor(Math.random() * 7) + 2;
          list.push({ q: `${billions} milliards et 500 milliers = ?`, a: String(billions * 1_000_000_000 + 500_000), help: 'Écris les milliards puis les milliers.' });
        }
      }
    }
    return list;
  }

  function startMission(nextMissionId: number) {
    missionId = nextMissionId;
    questions = generateQuestions(state.selectedGrade, selectedRealm.id);
    questionIndex = 0;
    score = 0;
    input = '';
    feedback = '';
    transitioning = false;
    screen = 'game';
  }

  function pressKey(key: string) {
    if (transitioning) return;
    if (key === 'CLR') input = '';
    else if (key === 'OK') validate();
    else if (input.length < 15) input += key;
  }

  async function validate() {
    if (transitioning || !input) return;
    transitioning = true;
    const current = questions[questionIndex];
    if (clean(input) === clean(current.a)) {
      score += 1;
      feedback = '⚡ Succès ! Réponse juste.';
    } else {
      feedback = `❌ Structure incomplète. La clé était : ${formatSwiss(current.a)}.`;
    }

    window.setTimeout(() => {
      questionIndex += 1;
      input = '';
      feedback = '';
      transitioning = false;
      if (questionIndex >= questions.length) finishMission();
    }, 1500);
  }

  async function finishMission() {
    stars = score === 5 ? 3 : score >= 4 ? 2 : score >= 3 ? 1 : 0;
    const key = `${state.selectedGrade}_${selectedRealm.id}`;
    state.progress[key] = state.progress[key] ?? {};
    state.progress[key][String(missionId)] = Math.max(state.progress[key][String(missionId)] ?? 0, stars);
    if (missionId === 1 && score >= 4 && !state.unlockedCodex.includes(state.selectedGrade)) {
      state.unlockedCodex = [...state.unlockedCodex, state.selectedGrade];
    }
    save();

    const report = await submitActivityResult({
      studentName: state.playerName,
      world: 'numeria',
      mission: `${state.selectedGrade} ${selectedRealm.name} ${missionId === 0 ? 'Entraînement' : 'Gardien'}`,
      score,
      total: 5,
      scoreBasis: 'best',
      errorCount: 5 - score,
      errorFamilies: score < 5 ? [selectedRealm.id] : [],
      metadata: { stars }
    });
    sentMessage = report.message;
    screen = 'result';
  }
</script>

<svelte:head>
  <title>Les Royaumes de Numéria — Classe Numérique</title>
</svelte:head>

<div class="dark-page page">
  <header class="dark-header">
    <div class="header-inner">
      <div class="brand"><span class="brand-icon">⚔️</span><div><h1 class="brand-title">NUMÉRIA</h1><p class="brand-subtitle">Les Royaumes de la Numération</p></div></div>
      <a class="btn dark" href="/">↩ QG</a>
    </div>
  </header>

  <main class="main" style="max-width: 46rem;">
    {#if screen === 'welcome'}
      <section class="dark-card stack center">
        <h2>✨ Votre Mission</h2>
        <p>Le grand cristal des nombres a été brisé. Explore les royaumes HarmoS et restaure l’harmonie mathématique !</p>
        <label class="label" style="color: #cbd5e1;">Identifie-toi, Aventurier <input class="dark-input" bind:value={state.playerName} placeholder="Votre prénom..." /></label>
        <button class="btn primary" type="button" on:click={startGame}>Établir la Connexion ⚡</button>
      </section>
    {:else if screen === 'hub'}
      <section class="stack">
        <div class="dark-card mission-top">
          <div><span class="kicker">Aventurier</span><h2>{state.playerName}</h2></div>
          <div class="actions"><button class="btn warn" type="button" on:click={() => (screen = 'codex')}>📜 Codex</button><button class="btn danger" type="button" on:click={resetGame}>Réinitialiser</button></div>
        </div>
        <div class="dark-card stack center">
          <strong class="kicker">Sélectionner un degré scolaire</strong>
          <div class="grid" style="grid-template-columns: repeat(3, 1fr);">
            {#each ['6H','7H','8H'] as grade}
              <button class="dark-option" class:selected={state.selectedGrade === grade} type="button" on:click={() => selectGrade(grade as Grade)}>{grade}</button>
            {/each}
          </div>
        </div>
        <h2 class="center">Royaumes de Numération</h2>
        {#each realms[state.selectedGrade] as realm, index}
          <button class="dark-card mission-top" type="button" on:click={() => openRealm(realm, index)}>
            <span><strong>{realm.name}</strong><br /><span class="muted small">{realm.desc}</span></span>
            <span class="badge">Explorer</span>
          </button>
        {/each}
      </section>
    {:else if screen === 'realm'}
      <section class="dark-card stack center">
        <button class="btn dark" type="button" on:click={() => (screen = 'hub')}>⬅️ Retour à la carte</button>
        <h2>{selectedRealm.name}</h2>
        <p class="muted">{selectedRealm.desc}</p>
        {#each [{ title: '⚔️ Mission d’entraînement unique', id: 0 }, { title: '🐉 Épreuve souveraine du Gardien', id: 1 }] as mission}
          <button class="dark-option mission-top" type="button" on:click={() => startMission(mission.id)}>
            <span>{mission.title}</span>
            <span>{'⭐'.repeat(state.progress[`${state.selectedGrade}_${selectedRealm.id}`]?.[String(mission.id)] ?? 0) || '○○○'}</span>
          </button>
        {/each}
      </section>
    {:else if screen === 'game'}
      <section class="dark-card stack center">
        <div class="mission-top"><span class="badge">Q. {questionIndex + 1} / 5</span><span class="badge">{selectedRealm.name}</span></div>
        {#if questions[questionIndex]?.help}<div class="dark-card compact"><strong>💡 Parchemin d’aide</strong><p>{questions[questionIndex].help}</p></div>{/if}
        <div class="dark-card compact"><h2>{questions[questionIndex]?.q}</h2></div>
        <input class="dark-input" style="text-align:center; font-size: 1.7rem; font-weight: 1000;" readonly value={input} placeholder="?" />
        <div class="keypad">
          {#each ['1','2','3','4','5','6','7','8','9','.','0','/','\'','CLR','OK'] as key}
            <button class="dark-option" type="button" on:click={() => pressKey(key)}>{key === 'CLR' ? 'Effacer' : key === 'OK' ? 'Valider' : key}</button>
          {/each}
        </div>
        <p class:good={feedback.startsWith('⚡')} class:bad={!feedback.startsWith('⚡')} class="feedback">{feedback}</p>
      </section>
    {:else if screen === 'result'}
      <section class="dark-card stack center">
        <h2>Rapport d’Exploration</h2>
        <p style="font-size: 2rem; color: var(--amber);">{'⭐'.repeat(stars)}{'○'.repeat(3 - stars)}</p>
        <p>Précision de l’esprit : <strong>{score} / 5</strong></p>
        <p class="muted small">{sentMessage}</p>
        <button class="btn primary" type="button" on:click={() => openRealm(selectedRealm, selectedRealmIndex)}>Continuer la Quête 🧭</button>
      </section>
    {:else}
      <section class="dark-card stack">
        <button class="btn dark" type="button" on:click={() => (screen = 'hub')}>⬅️ Retour au Hub</button>
        <h2 class="center">📜 Le Codex des Anciens</h2>
        {#each Object.entries(codexItems) as [grade, item]}
          <article class="dark-card compact" style:opacity={state.unlockedCodex.includes(grade as Grade) ? 1 : 0.35}>
            <h3>{state.unlockedCodex.includes(grade as Grade) ? `✨ ${item.name}` : `??? Artefact Relique ${grade}`}</h3>
            <p>{state.unlockedCodex.includes(grade as Grade) ? item.desc : 'Battez le Gardien de ce degré avec au moins 4 bonnes réponses.'}</p>
          </article>
        {/each}
      </section>
    {/if}
  </main>
</div>
