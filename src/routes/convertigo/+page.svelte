<script lang="ts">
  import { onMount } from 'svelte';
  import exercisesData from './data/exercises.json';

  type Grade = '7H' | '8H';
  type Belt = 'white' | 'yellow' | 'green' | 'blue' | 'black';
  type Step = 'theory' | 'flash' | 'practice' | 'boss' | 'chrono' | 'final';

  // État de l'application
  let currentScreen: 'selection' | 'game' = 'selection';

  // Choix utilisateur
  let selectedGrade: Grade = '7H';
  let selectedBelt: Belt = 'white';
  let currentStep: Step = 'theory';

  // Liste des ceintures avec détails
  const belts = [
    { id: 'white', label: 'Ceinture Blanche', color: '#f1f5f9', textColor: '#0f172a', desc: 'Longueurs & Conversions de base' },
    { id: 'yellow', label: 'Ceinture Jaune', color: '#fde047', textColor: '#713f12', desc: 'Périmètres & Aires' },
    { id: 'green', label: 'Ceinture Verte', color: '#4ade80', textColor: '#14532d', desc: 'Aires de polygones' },
    { id: 'blue', label: 'Ceinture Bleue', color: '#38bdf8', textColor: '#0c4a6e', desc: 'Capacités & Volumes' },
    { id: 'black', label: 'Ceinture Noire', color: '#1e293b', textColor: '#ffffff', desc: 'Masses, Durées & Angles' }
  ];

  // Gamification
  let streak = 0;
  let shields = 0;
  let bossHp = 3;
  let chronoTimeLeft = 45;
  let chronoTimer: any = null;

  // Modales
  let showTableModal = false;
  let showHint = false;
  let userAnswer = '';
  let feedbackMessage = '';
  let isCorrect = false;

  // Tableau
  const units = ['km', 'hm', 'dam', 'm', 'dm', 'cm', 'mm'];
  let conversionDigits: Record<string, string> = { km: '', hm: '', dam: '', m: '', dm: '', cm: '', mm: '' };
  let commaPosition = '';

  $: currentContent = (exercisesData as any[]).find(
    (item) => item.grade === selectedGrade && item.belt === selectedBelt
  ) || null;

  let currentExIndex = 0;
  $: availableExercises = currentContent ? currentContent.exercises : [];
  $: currentEx = availableExercises[currentExIndex] || null;

  let currentOrderList: string[] = [];
  $: if (currentEx && currentEx.type === 'order') {
    currentOrderList = [...currentEx.items];
  }

  onMount(() => {
    const saved = localStorage.getItem('convertigo_progress');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        streak = data.streak || 0;
        shields = data.shields || 0;
      } catch (e) {}
    }
  });

  function saveProgress() {
    localStorage.setItem('convertigo_progress', JSON.stringify({ streak, shields }));
  }

  function launchBelt(beltId: Belt) {
    selectedBelt = beltId;
    currentStep = 'theory';
    currentExIndex = 0;
    feedbackMessage = '';
    showHint = false;
    userAnswer = '';
    currentScreen = 'game';
  }

  function registerSuccess() {
    streak += 1;
    if (streak % 3 === 0) {
      shields += 1;
      feedbackMessage = '🛡️ NOUVEAU BOUCLIER DÉBLOQUÉ !';
    } else {
      feedbackMessage = '🔥 BRAVO ! BONNE RÉPONSE !';
    }
    isCorrect = true;
    saveProgress();
  }

  function registerFailure() {
    isCorrect = false;
    if (shields > 0) {
      shields -= 1;
      feedbackMessage = '🛡️ Ton bouclier t\'a protégé ! La série continue !';
    } else {
      streak = 0;
      feedbackMessage = '❌ Raté ! Utilise les indices ou le tableau.';
    }
    saveProgress();
  }

  function handleFlashAnswer(optionIndex: number) {
    if (!currentContent) return;
    if (optionIndex === currentContent.flashCheck.expectedIndex) {
      registerSuccess();
      setTimeout(() => {
        currentStep = 'practice';
        feedbackMessage = '';
      }, 1200);
    } else {
      registerFailure();
    }
  }

  function validatePractice() {
    if (!currentEx) return;
    let ok = false;

    if (currentEx.type === 'conversion') {
      const val = parseFloat(userAnswer.replace(',', '.'));
      ok = val === currentEx.expectedValue;
    } else if (currentEx.type === 'estimation') {
      ok = userAnswer === currentEx.expected;
    } else if (currentEx.type === 'order') {
      ok = JSON.stringify(currentOrderList) === JSON.stringify(currentEx.expectedOrder);
    }

    if (ok) {
      registerSuccess();
      setTimeout(() => {
        userAnswer = '';
        feedbackMessage = '';
        showHint = false;
        if (currentExIndex < availableExercises.length - 1) {
          currentExIndex += 1;
        } else {
          if (selectedGrade === '7H') {
            bossHp = currentContent.bossHp || 3;
            currentStep = 'boss';
          } else {
            startChrono();
          }
        }
      }, 1200);
    } else {
      registerFailure();
    }
  }

  function attackBoss() {
    bossHp -= 1;
    registerSuccess();
    if (bossHp <= 0) {
      setTimeout(() => { currentStep = 'final'; }, 1000);
    }
  }

  function startChrono() {
    currentStep = 'chrono';
    chronoTimeLeft = currentContent?.chronoSeconds || 45;
    if (chronoTimer) clearInterval(chronoTimer);
    chronoTimer = setInterval(() => {
      chronoTimeLeft -= 1;
      if (chronoTimeLeft <= 0) {
        clearInterval(chronoTimer);
        currentStep = 'final';
      }
    }, 1000);
  }

  function moveItem(fromIndex: number, toIndex: number) {
    if (toIndex < 0 || toIndex >= currentOrderList.length) return;
    const temp = currentOrderList[fromIndex];
    currentOrderList[fromIndex] = currentOrderList[toIndex];
    currentOrderList[toIndex] = temp;
    currentOrderList = [...currentOrderList];
  }
</script>

<main style="min-height: 100vh; background-color: #fef3c7; padding: 20px 15px; font-family: system-ui, sans-serif; color: #0f172a; box-sizing: border-box;">
  <div style="max-width: 680px; margin: 0 auto; display: flex; flex-direction: column; gap: 20px;">

    <!-- ================= ÉCRAN 1 : SÉLECTION NIVEAU & CEINTURE ================= -->
    {#if currentScreen === 'selection'}
      <header style="background: #ffffff; border: 4px solid #0f172a; border-radius: 24px; padding: 20px; box-shadow: 0 6px 0 #0f172a; text-align: center;">
        <div style="font-size: 40px; margin-bottom: 5px;">🥋</div>
        <h1 style="font-size: 26px; font-weight: 900; margin: 0; color: #4f46e5;">CONVERTIGO ARCADE</h1>
        <p style="font-size: 14px; font-weight: 700; color: #64748b; margin-top: 5px;">Choisis ton degré et ta ceinture pour commencer !</p>
      </header>

      <!-- SECTEUR DEGRES (7H / 8H) -->
      <section style="display: flex; gap: 12px;">
        <button
          on:click={() => selectedGrade = '7H'}
          style="flex: 1; padding: 15px; font-size: 22px; font-weight: 900; border: 4px solid #0f172a; border-radius: 20px; cursor: pointer; background-color: {selectedGrade === '7H' ? '#22d3ee' : '#ffffff'}; box-shadow: 0 6px 0 #0f172a; transform: {selectedGrade === '7H' ? 'translateY(-2px)' : 'none'};"
        >
          Niveau 7H
        </button>

        <button
          on:click={() => selectedGrade = '8H'}
          style="flex: 1; padding: 15px; font-size: 22px; font-weight: 900; border: 4px solid #0f172a; border-radius: 20px; cursor: pointer; background-color: {selectedGrade === '8H' ? '#a855f7' : '#ffffff'}; color: {selectedGrade === '8H' ? 'white' : 'black'}; box-shadow: 0 6px 0 #0f172a; transform: {selectedGrade === '8H' ? 'translateY(-2px)' : 'none'};"
        >
          Niveau 8H
        </button>
      </section>

      <!-- GRILLE DES CEINTURES -->
      <section style="display: flex; flex-direction: column; gap: 12px;">
        <div style="font-size: 13px; font-weight: 900; text-transform: uppercase; color: #4f46e5; text-align: center;">
          Ceintures disponibles en {selectedGrade} :
        </div>

        {#each belts as belt}
          <button
            on:click={() => launchBelt(belt.id as Belt)}
            style="background: {belt.color}; color: {belt.textColor}; border: 4px solid #0f172a; border-radius: 20px; padding: 18px; text-align: left; cursor: pointer; box-shadow: 0 6px 0 #0f172a; display: flex; align-items: center; justify-content: space-between;"
          >
            <div>
              <div style="font-size: 18px; font-weight: 900;">{belt.label}</div>
              <div style="font-size: 12px; font-weight: 700; opacity: 0.85;">{belt.desc}</div>
            </div>
            <div style="font-size: 24px; font-weight: 900;">➔</div>
          </button>
        {/each}
      </section>

    <!-- ================= ÉCRAN 2 : EXERCICES & PARCOURS ================= -->
    {:else}
      <!-- HEADER JEU AVEC BOUTON RETOUR -->
      <header style="background: #ffffff; border: 4px solid #0f172a; border-radius: 20px; padding: 12px 18px; box-shadow: 0 5px 0 #0f172a; display: flex; align-items: center; justify-content: space-between;">
        <button
          on:click={() => currentScreen = 'selection'}
          style="background: #e2e8f0; border: 3px solid #0f172a; border-radius: 12px; padding: 6px 12px; font-weight: 900; font-size: 13px; cursor: pointer; box-shadow: 0 3px 0 #0f172a;"
        >
          ⬅️ CEINTURES
        </button>

        <div style="font-size: 14px; font-weight: 900; text-transform: uppercase; color: #4f46e5;">
          {selectedGrade} — {selectedBelt}
        </div>

        <div style="display: flex; align-items: center; gap: 6px;">
          <button on:click={() => showTableModal = true} style="background-color: #38bdf8; border: 3px solid #0f172a; border-radius: 12px; padding: 6px 10px; font-weight: 900; font-size: 12px; cursor: pointer; box-shadow: 0 3px 0 #0f172a;">
            📊
          </button>
          <div style="background-color: #f97316; color: white; border: 3px solid #0f172a; padding: 5px 8px; border-radius: 10px; font-weight: 900; font-size: 14px;">
            🔥 {streak}
          </div>
        </div>
      </header>

      <!-- CONTENU EXERCICE / COURS -->
      <section style="background: #ffffff; border: 4px solid #0f172a; border-radius: 20px; padding: 20px; box-shadow: 0 6px 0 #0f172a;">
        {#if currentContent}

          <!-- THÉORIE -->
          {#if currentStep === 'theory'}
            <div style="display: flex; flex-direction: column; gap: 15px; text-align: center;">
              <div style="background: #e0e7ff; border: 3px solid #0f172a; border-radius: 16px; padding: 15px;">
                <span style="font-size: 40px;">{currentContent.theory.illustration}</span>
                <h2 style="font-size: 20px; font-weight: 900; margin: 8px 0;">{currentContent.theory.title}</h2>
                <p style="font-size: 14px; font-weight: 700; line-height: 1.4;">{currentContent.theory.text}</p>
              </div>
              <button on:click={() => currentStep = 'flash'} style="background: #10b981; color: white; border: 4px solid #0f172a; border-radius: 14px; padding: 12px; font-size: 16px; font-weight: 900; cursor: pointer; box-shadow: 0 4px 0 #0f172a;">
                J'AI COMPRIS ! QUESTION FLASH ⚡
              </button>
            </div>

          <!-- QUESTION FLASH -->
          {:else if currentStep === 'flash'}
            <div style="display: flex; flex-direction: column; gap: 12px;">
              <div style="font-size: 11px; font-weight: 900; color: #6366f1; text-transform: uppercase;">Question Flash Obligatoire</div>
              <div style="font-size: 16px; font-weight: 900;">{currentContent.flashCheck.question}</div>
              <div style="display: flex; flex-direction: column; gap: 8px;">
                {#each currentContent.flashCheck.options as opt, idx}
                  <button on:click={() => handleFlashAnswer(idx)} style="border: 3px solid #0f172a; background: #f8fafc; padding: 10px; border-radius: 12px; font-weight: 800; font-size: 15px; cursor: pointer; text-align: left; box-shadow: 0 3px 0 #0f172a;">
                    {opt}
                  </button>
                {/each}
              </div>
            </div>

          <!-- EXERCICES -->
          {:else if currentStep === 'practice'}
            {#if currentEx}
              <div style="display: flex; flex-direction: column; gap: 15px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span style="background: #facc15; border: 2px solid #0f172a; padding: 2px 8px; border-radius: 8px; font-size: 11px; font-weight: 900;">
                    EXERCICE {currentExIndex + 1} / {availableExercises.length}
                  </span>
                  <button on:click={() => showHint = !showHint} style="background: none; border: none; color: #4f46e5; font-weight: 800; cursor: pointer; font-size: 13px;">
                    💡 Indice
                  </button>
                </div>

                {#if showHint}
                  <div style="background: #fffbeb; border: 2px solid #0f172a; border-radius: 10px; padding: 8px; font-size: 12px; font-weight: 700; color: #92400e;">
                    {currentEx.hint}
                  </div>
                {/if}

                <div style="font-size: 16px; font-weight: 800; text-align: center;">{currentEx.instruction}</div>

                {#if currentEx.type === 'conversion'}
                  <div style="background: #e0e7ff; border: 3px solid #0f172a; border-radius: 14px; padding: 15px; font-size: 24px; font-weight: 900; text-align: center;">
                    {currentEx.givenValue} {currentEx.givenUnit} = <span style="color: #ec4899;">?</span> {currentEx.targetUnit}
                  </div>
                  <input type="text" bind:value={userAnswer} placeholder="Ta réponse..." style="border: 3px solid #0f172a; border-radius: 12px; padding: 10px; font-size: 18px; font-weight: 900; text-align: center;" />

                {:else if currentEx.type === 'estimation'}
                  <div style="display: flex; flex-direction: column; gap: 8px;">
                    {#each currentEx.options as opt}
                      <button on:click={() => { userAnswer = opt; validatePractice(); }} style="border: 3px solid #0f172a; background: {userAnswer === opt ? '#38bdf8' : '#f8fafc'}; padding: 10px; border-radius: 12px; font-weight: 800; font-size: 15px; cursor: pointer; box-shadow: 0 3px 0 #0f172a;">
                        {opt}
                      </button>
                    {/each}
                  </div>

                {:else if currentEx.type === 'order'}
                  <div style="display: flex; flex-direction: column; gap: 8px;">
                    {#each currentOrderList as item, idx}
                      <div style="display: flex; align-items: center; justify-content: space-between; background: #e0e7ff; border: 3px solid #0f172a; border-radius: 12px; padding: 8px 12px; font-weight: 900;">
                        <span>{item}</span>
                        <div style="display: flex; gap: 4px;">
                          <button on:click={() => moveItem(idx, idx - 1)} disabled={idx === 0} style="border: 2px solid #0f172a; border-radius: 6px; padding: 2px 8px; font-weight: 900; cursor: pointer;">⬆️</button>
                          <button on:click={() => moveItem(idx, idx + 1)} disabled={idx === currentOrderList.length - 1} style="border: 2px solid #0f172a; border-radius: 6px; padding: 2px 8px; font-weight: 900; cursor: pointer;">⬇️</button>
                        </div>
                      </div>
                    {/each}
                  </div>
                {/if}

                {#if currentEx.type !== 'estimation'}
                  <button on:click={validatePractice} style="background: #10b981; color: white; border: 3px solid #0f172a; border-radius: 12px; padding: 12px; font-weight: 900; font-size: 16px; cursor: pointer; box-shadow: 0 4px 0 #0f172a;">
                    VALIDER 👍
                  </button>
                {/if}
              </div>
            {/if}

          <!-- MINI-BOSS (7H) -->
          {:else if currentStep === 'boss'}
            <div style="text-align: center; display: flex; flex-direction: column; gap: 15px; align-items: center;">
              <div style="font-size: 50px;">👾</div>
              <h2 style="font-size: 20px; font-weight: 900; margin: 0;">MINI-BOSS DE RANGEMENT !</h2>
              <div style="font-weight: 800; font-size: 14px;">PV du Boss : {'❤️'.repeat(bossHp)}</div>
              <button on:click={attackBoss} style="background: #ef4444; color: white; border: 4px solid #0f172a; border-radius: 16px; padding: 15px 30px; font-size: 20px; font-weight: 900; cursor: pointer; box-shadow: 0 5px 0 #0f172a;">
                ⚔️ ATTAQUER !
              </button>
            </div>

          <!-- CHRONO (8H) -->
          {:else if currentStep === 'chrono'}
            <div style="text-align: center; display: flex; flex-direction: column; gap: 15px; align-items: center;">
              <div style="font-size: 40px;">⏱️ {chronoTimeLeft}s</div>
              <h2 style="font-size: 20px; font-weight: 900; margin: 0;">DÉFI CHRONO 8H !</h2>
            </div>

          <!-- VICTOIRE -->
          {:else if currentStep === 'final'}
            <div style="text-align: center; display: flex; flex-direction: column; gap: 12px; align-items: center;">
              <div style="font-size: 60px;">🏆</div>
              <h2 style="font-size: 22px; font-weight: 900; margin: 0;">CEINTURE RÉUSSIE !</h2>
              <button on:click={() => currentScreen = 'selection'} style="background: #facc15; border: 3px solid #0f172a; border-radius: 14px; padding: 10px 20px; font-weight: 900; font-size: 16px; cursor: pointer; box-shadow: 0 4px 0 #0f172a;">
                MENU DES CEINTURES 🥋
              </button>
            </div>
          {/if}

          {#if feedbackMessage}
            <div style="margin-top: 12px; padding: 10px; border: 3px solid #0f172a; border-radius: 12px; text-align: center; font-weight: 900; background: {isCorrect ? '#4ade80' : '#f87171'}; color: {isCorrect ? '#0f172a' : 'white'};">
              {feedbackMessage}
            </div>
          {/if}

        <!-- CEINTURE EN CONSTRUCTION -->
        {:else}
          <div style="text-align: center; padding: 30px 15px; display: flex; flex-direction: column; align-items: center; gap: 12px;">
            <div style="font-size: 50px;">🚧</div>
            <h2 style="font-size: 20px; font-weight: 900; margin: 0;">PAGE EN CONSTRUCTION</h2>
            <p style="font-size: 14px; font-weight: 700; color: #64748b;">
              La ceinture <strong style="color: #0f172a;">{selectedBelt.toUpperCase()}</strong> pour le niveau <strong style="color: #0f172a;">{selectedGrade}</strong> sera disponible très bientôt !
            </p>
            <button
              on:click={() => currentScreen = 'selection'}
              style="background: #22d3ee; color: #0f172a; border: 3px solid #0f172a; border-radius: 12px; padding: 10px 20px; font-weight: 900; cursor: pointer; box-shadow: 0 3px 0 #0f172a; margin-top: 10px;"
            >
              RETOURNER AUX CEINTURES 🥋
            </button>
          </div>
        {/if}
      </section>
    {/if}

  </div>
</main>

<!-- POPUP MODALE : TABLEAU INTERACTIF -->
{#if showTableModal}
  <div style="position: fixed; inset: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; padding: 10px; z-index: 50;">
    <div style="background: white; border: 4px solid #0f172a; border-radius: 20px; padding: 15px; max-width: 620px; width: 100%; box-shadow: 0 8px 0 #0f172a;">
      <div style="display: flex; justify-between; align-items: center; margin-bottom: 10px;">
        <h3 style="font-size: 16px; font-weight: 900; margin: 0;">📊 Tableau de conversion</h3>
        <button on:click={() => showTableModal = false} style="background: #f87171; color: white; border: 2px solid #0f172a; border-radius: 6px; font-weight: 900; cursor: pointer; padding: 2px 8px;">X</button>
      </div>

      <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 3px; background: #0f172a; padding: 4px; border-radius: 10px; text-align: center;">
        {#each units as unit}
          <div style="background: #38bdf8; color: #0f172a; font-weight: 900; padding: 4px 2px; font-size: 11px; border-radius: 4px;">{unit}</div>
        {/each}

        {#each units as unit}
          <input
            type="text"
            maxlength="1"
            bind:value={conversionDigits[unit]}
            style="width: 100%; height: 36px; border: none; text-align: center; font-size: 16px; font-weight: 900; border-radius: 4px; box-sizing: border-box;"
          />
        {/each}

        {#each units as unit}
          <button
            on:click={() => commaPosition = (commaPosition === unit ? '' : unit)}
            style="background: {commaPosition === unit ? '#ec4899' : '#e2e8f0'}; color: {commaPosition === unit ? 'white' : '#0f172a'}; border: none; border-radius: 4px; font-size: 10px; font-weight: 900; cursor: pointer; padding: 2px 0;"
          >
            {commaPosition === unit ? ', (Virgule)' : 'Poser ,'}
          </button>
        {/each}
      </div>

      <div style="margin-top: 12px; text-align: center;">
        <button on:click={() => showTableModal = false} style="background: #10b981; color: white; border: 3px solid #0f172a; border-radius: 10px; padding: 6px 16px; font-weight: 900; cursor: pointer;">FERMER</button>
      </div>
    </div>
  </div>
{/if}