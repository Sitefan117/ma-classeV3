<script lang="ts">
  import { getContent } from './data/convertigo';
  import type { BeltContent, Exercise } from './types/exercise';
  import AudioButton from './components/AudioButton.svelte';
  import ConversionTable from './components/ConversionTable.svelte';
  import HelpPanel from './components/HelpPanel.svelte';
  import WorldMap from './components/WorldMap.svelte';

  let selectedGrade = $state<'7H' | '8H' | null>(null);
  let activeBelt = $state<string | null>(null);
  let currentExerciseIndex = $state(0);
  let userAnswers = $state<Record<string, string>>({});
  let showHelp = $state(false);
  let showTable = $state(false);
  let isValidated = $state(false);

  let beltContent = $derived<BeltContent | null>(
    selectedGrade && activeBelt ? getContent(selectedGrade, activeBelt) : null
  );

  let currentExercises = $derived<any[]>(
    beltContent?.exercises || []
  );

  let currentExercise = $derived<any>(
    currentExercises[currentExerciseIndex] || null
  );

  // Titre/Instruction globale de l'exercice
  let exerciseTitle = $derived<string>(
    currentExercise?.instruction ||
    currentExercise?.title ||
    currentExercise?.prompt ||
    'Réponds aux questions suivantes :'
  );

  // Extrait la liste des questions ou construit un item par défaut si l'exercice n'a pas de sous-questions
  let questionsList = $derived<any[]>(
    currentExercise?.questions || [
      {
        id: currentExercise?.id || 'main_input',
        text: currentExercise?.question || currentExercise?.label || 'Résultat :'
      }
    ]
  );

  function selectGrade(grade: '7H' | '8H') {
    selectedGrade = grade;
  }

  function enterHouse(beltId: string) {
    activeBelt = beltId;
    currentExerciseIndex = 0;
    userAnswers = {};
    isValidated = false;
  }

  function leaveHouse() {
    activeBelt = null;
  }

  function handleValidate() {
    isValidated = true;
  }

  function nextExercise() {
    if (currentExerciseIndex < currentExercises.length - 1) {
      currentExerciseIndex++;
      isValidated = false;
    }
  }

  function prevExercise() {
    if (currentExerciseIndex > 0) {
      currentExerciseIndex--;
      isValidated = false;
    }
  }
</script>

<svelte:head>
  <title>Convertigo — Monde RPG Pédagogique</title>
</svelte:head>

<main class="convertigo-main">
  {#if !selectedGrade}
    <div class="grade-selection-screen">
      <h1>🏰 Bienvenue dans Convertigo RPG</h1>
      <p>Choisis ton degré scolaire pour commencer l'aventure :</p>
      
      <div class="grade-buttons">
        <button class="grade-card" onclick={() => selectGrade('7H')}>
          <h2>Degré 7H</h2>
          <p>Longueurs, périmètres, aires du carré/rectangle, masses, capacités.</p>
        </button>

        <button class="grade-card" onclick={() => selectGrade('8H')}>
          <h2>Degré 8H</h2>
          <p>Aires complexes, volumes (cube/pavé), capacités, durées et angles.</p>
        </button>
      </div>
    </div>

  {:else if !activeBelt}
    <div class="top-bar">
      <button class="back-btn" onclick={() => (selectedGrade = null)}>◀ Changer de niveau ({selectedGrade})</button>
      <h2>Village de Convertigo ({selectedGrade})</h2>
    </div>

    <WorldMap grade={selectedGrade} onEnterHouse={enterHouse} />

  {:else}
    <div class="house-overlay">
      <div class="house-modal">
        <header class="house-header">
          <button class="exit-btn" onclick={leaveHouse}>🚪 Sortir de la maison</button>
          <h2>Maison Ceinture {activeBelt.toUpperCase()} ({selectedGrade})</h2>
          <div class="tools-buttons">
            <button class="tool-btn" onclick={() => (showTable = !showTable)}>
              📊 Table de conversion
            </button>
            <button class="tool-btn" onclick={() => (showHelp = !showHelp)}>
              💡 Aide & Méthode
            </button>
          </div>
        </header>

        {#if showTable}
          <div class="panel-wrapper">
            <ConversionTable />
          </div>
        {/if}

        {#if showHelp}
          <div class="panel-wrapper">
            <HelpPanel method={beltContent?.theory || 'Utilise les conversions et relis attentivement la consigne.'} />
          </div>
        {/if}

        {#if beltContent}
          <div class="theory-section">
            <div class="npc-intro">
              <span class="npc-avatar">🧙‍♂️</span>
              <div>
                <strong>Maître Pédagogique :</strong>
                <p>{beltContent.theory}</p>
              </div>
              <AudioButton text={beltContent.theory} />
            </div>
          </div>
        {/if}

        {#if currentExercise}
          <div class="exercise-card">
            <div class="exercise-header">
              <h3>Exercice {currentExerciseIndex + 1} / {currentExercises.length}</h3>
              <AudioButton text={exerciseTitle} />
            </div>

            <!-- Consigne globale -->
            <p class="instruction">{exerciseTitle}</p>

            <!-- Liste dynamique de questions de l'exercice -->
            <div class="questions-list">
              {#each questionsList as q, i}
                <div class="question-row">
                  <label for="input-{q.id || i}" class="question-label">
                    {q.text || q.label || q.prompt || `Question ${i + 1} :`}
                  </label>
                  <input 
                    id="input-{q.id || i}"
                    type="text" 
                    class="answer-input" 
                    placeholder="Ta réponse..." 
                    bind:value={userAnswers[q.id || `q_${i}`]}
                  />
                </div>
              {/each}
            </div>

            <button class="validate-btn" onclick={handleValidate}>
              Vérifier mes réponses
            </button>

            {#if isValidated}
              <div class="feedback-box">
                <p>✅ Réponses enregistrées ! Passe à l'exercice suivant.</p>
              </div>
            {/if}

            <div class="exercise-nav">
              <button disabled={currentExerciseIndex === 0} onclick={prevExercise}>
                ◀ Précédent
              </button>
              <button disabled={currentExerciseIndex === currentExercises.length - 1} onclick={nextExercise}>
                Suivant ▶
              </button>
            </div>
          </div>
        {:else}
          <div class="exercise-card">
            <p>Aucun exercice disponible dans cette maison.</p>
          </div>
        {/if}
      </div>
    </div>
  {/if}
</main>

<style>
  .convertigo-main { padding: 20px; min-height: 100vh; background: #1e293b; color: #f8fafc; }
  .grade-selection-screen { max-width: 650px; margin: 60px auto; text-align: center; background: #334155; padding: 32px; border-radius: 16px; }
  .grade-buttons { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 24px; }
  .grade-card { background: #0284c7; color: white; border: none; padding: 20px; border-radius: 12px; cursor: pointer; }
  .top-bar { display: flex; justify-content: space-between; align-items: center; max-width: 960px; margin: 0 auto 16px auto; }
  .back-btn { background: #475569; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; }

  .house-overlay { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.85); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 20px; }
  .house-modal { background: #0f172a; border: 3px solid #38bdf8; border-radius: 16px; width: 100%; max-width: 800px; max-height: 90vh; overflow-y: auto; padding: 24px; display: flex; flex-direction: column; gap: 16px; }
  .house-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #334155; padding-bottom: 12px; }
  .exit-btn { background: #ef4444; color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-weight: bold; }
  .tools-buttons { display: flex; gap: 8px; }
  .tool-btn { background: #334155; color: white; border: 1px solid #64748b; padding: 6px 12px; border-radius: 6px; cursor: pointer; }
  .panel-wrapper { background: #1e293b; padding: 12px; border-radius: 8px; }
  .npc-intro { display: flex; align-items: center; gap: 12px; background: #1e293b; padding: 12px; border-radius: 8px; border-left: 4px solid #38bdf8; }
  .npc-avatar { font-size: 2rem; }

  .exercise-card { background: #1e293b; padding: 20px; border-radius: 12px; display: flex; flex-direction: column; gap: 16px; }
  .exercise-header { display: flex; justify-content: space-between; align-items: center; }
  .instruction { font-size: 1.1rem; font-weight: 600; color: #38bdf8; background: #0f172a; padding: 12px; border-radius: 8px; margin: 0; }
  
  .questions-list { display: flex; flex-direction: column; gap: 12px; }
  .question-row { display: flex; flex-direction: column; gap: 6px; background: #0f172a; padding: 10px; border-radius: 6px; border: 1px solid #334155; }
  .question-label { font-size: 0.95rem; color: #e2e8f0; font-weight: 500; }
  
  .answer-input { padding: 10px; border-radius: 6px; border: 1px solid #475569; background: #1e293b; color: white; font-size: 1rem; }
  .validate-btn { background: #22c55e; color: white; border: none; padding: 12px 20px; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 1rem; }
  .feedback-box { background: rgba(34, 197, 94, 0.2); border: 1px solid #22c55e; padding: 10px; border-radius: 6px; color: #4ade80; }
  .exercise-nav { display: flex; justify-content: space-between; }
  .exercise-nav button { background: #334155; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; }
  .exercise-nav button:disabled { opacity: 0.4; cursor: not-allowed; }
</style>