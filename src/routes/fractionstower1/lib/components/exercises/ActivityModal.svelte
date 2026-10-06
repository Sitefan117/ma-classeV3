<script lang="ts">
  import { onMount } from 'svelte';
  import type { InteractionZone } from '../../types/interaction';
  import { ExerciseGenerator, type DynamicExercise } from '../../engines/ExerciseGenerator';
  import { MasteryEngine } from '../../engines/MasteryEngine';
  import { BossManager } from '../../game/BossManager';
  import { SoundEngine } from '../../game/SoundEngine';

  let { zone, onClose, onSuccess }: { zone: InteractionZone; onClose: () => void; onSuccess?: (exerciseId: string) => void } = $props();

  const TARGET_SUCCESS_COUNT = 10;

  let exercise = $state<DynamicExercise | null>(null);
  let userAnswer = $state('');
  let feedback = $state('');
  let isSuccess = $state(false);
  let streak = $state(0);
  let bossHp = $state(10);
  let hintIndex = $state(0);

  function loadNextQuestion() {
    const compId = zone?.competencyId || 'frac_01';

    if (compId === 'frac_05') {
      exercise = BossManager.generateBossPhase(5);
    } else if (compId === 'frac_08') {
      exercise = BossManager.generateBossPhase(8);
    } else {
      exercise = ExerciseGenerator.generate(compId);
    }

    userAnswer = '';
    feedback = '';
    hintIndex = 0;
  }

  onMount(() => {
    loadNextQuestion();
  });

  function validateAnswer() {
    if (!exercise) return;

    const normalizedInput = userAnswer.trim().toLowerCase().replace(/\s+/g, '');
    const normalizedTarget = exercise.correctAnswer.trim().toLowerCase().replace(/\s+/g, '');

    const isCorrect = normalizedInput === normalizedTarget;
    MasteryEngine.recordAttempt(exercise.competencyId, isCorrect);

    if (isCorrect) {
      streak += 1;

      if (exercise.type === 'boss_battle') {
        bossHp -= 1;
        if (bossHp > 0) {
          feedback = `💥 Coup critique ! ${bossHp} PV restants au Boss (${streak}/${TARGET_SUCCESS_COUNT})`;
          setTimeout(loadNextQuestion, 1000);
          return;
        }
      if (isCorrect) {
  SoundEngine.playSuccess(); // 🔊 Son de réussite
  
  streak += 1;
  if (streak >= TARGET_SUCCESS_COUNT) {
    SoundEngine.playVictoryFanfare(); // 🎺 Fanfare de victoire 10/10 !
    feedback = `🎉 Bravo ! Épreuve validée avec 10/10 réussites !`;
    isSuccess = true;
    if (onSuccess) onSuccess(zone.competencyId || 'frac_01');
  } else {
    // ...
  }
} else {
  SoundEngine.playError(); // 🔊 Son d'erreur
  // ...
}
      }

      if (streak >= TARGET_SUCCESS_COUNT) {
        feedback = `🎉 Bravo ! Épreuve validée avec 10/10 réussites !`;
        isSuccess = true;
        if (onSuccess) onSuccess(zone.competencyId || 'frac_01');
      } else {
        feedback = `✅ Bonne réponse ! Continues (${streak}/${TARGET_SUCCESS_COUNT})`;
        setTimeout(loadNextQuestion, 1000);
      }
    } else {
      if (exercise.hints && exercise.hints.length > 0) {
        feedback = `💡 Indice : ${exercise.hints[hintIndex % exercise.hints.length]}`;
        hintIndex += 1;
      } else {
        feedback = '❌ Réponse incorrecte. Analyse l\'exercice et réessaie !';
      }
      isSuccess = false;
    }
  }

  function selectOption(opt: string) {
    userAnswer = opt;
    validateAnswer();
  }
</script>

<div class="modal-backdrop">
  {#if exercise}
    <div class="modal-card {exercise.type === 'boss_battle' ? 'boss-theme' : ''}">
      <header class="modal-header">
        <div>
          <h2>📜 {exercise.title}</h2>
          <div class="progress-bar-container">
            <span class="progress-text">Série : {streak} / {TARGET_SUCCESS_COUNT}</span>
            <div class="progress-bar-bg">
              <div class="progress-bar-fill" style="width: {(streak / TARGET_SUCCESS_COUNT) * 100}%;"></div>
            </div>
          </div>
        </div>
        <button class="close-btn" onclick={onClose}>✕</button>
      </header>

      <main class="modal-body">
        {#if exercise.type === 'boss_battle'}
          <div class="boss-hud">
            <div class="boss-avatar">👹</div>
            <div class="boss-hp-container">
              <span class="boss-name">Gardien des Fractions</span>
              <div class="hp-bar-bg">
                <div class="hp-bar-fill" style="width: {(bossHp / 10) * 100}%;"></div>
              </div>
            </div>
          </div>
        {/if}

        <p class="instruction">
          <strong>Question {streak + 1} / {TARGET_SUCCESS_COUNT} :</strong> {exercise.instruction}
        </p>

        {#if exercise.type === 'visual_rect' || exercise.type === 'boss_battle'}
          <div class="fraction-visual">
            {#each Array(exercise.data.totalParts || 4) as _, i}
              <div class="segment {i < (exercise.data.numerator || 0) ? 'filled' : 'empty'}">
                1/{exercise.data.denominator}
              </div>
            {/each}
          </div>

          <div class="input-group">
            <input
              type="text"
              bind:value={userAnswer}
              placeholder="Ex: {exercise.correctAnswer}"
              class="answer-input"
              onkeydown={(e) => e.key === 'Enter' && validateAnswer()}
            />
            <button class="btn-validate" onclick={validateAnswer}>Valider</button>
          </div>
        {:else if exercise.type === 'equivalent' || exercise.type === 'quantity'}
          {#if exercise.type === 'quantity'}
            <div class="quantity-visual">
              <span class="quantity-badge">📦 Total : {exercise.data.totalQuantity} objets</span>
            </div>
          {/if}

          <div class="options-grid">
            {#each exercise.data.options || [] as option}
              <button
                class="option-btn {userAnswer === option ? 'selected' : ''}"
                onclick={() => selectOption(option)}
              >
                {option}
              </button>
            {/each}
          </div>
        {/if}

        {#if feedback}
          <div class="feedback-box {isSuccess ? 'success' : streak > 0 ? 'info' : 'hint'}">
            {feedback}
          </div>
        {/if}
      </main>

      <footer class="modal-footer">
        {#if isSuccess}
          <button class="btn-continue" onclick={onClose}>Étage Validé ! ➔</button>
        {:else}
          <button class="btn-secondary" onclick={onClose}>Quitter</button>
        {/if}
      </footer>
    </div>
  {/if}
</div>

<style>
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(15, 23, 42, 0.85);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
  }

  .modal-card {
    background-color: #1e293b;
    border: 3px solid #38bdf8;
    border-radius: 12px;
    width: 90%;
    max-width: 520px;
    padding: 1.5rem;
    color: #f8fafc;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
  }

  .modal-card.boss-theme {
    border-color: #ef4444;
    background-color: #2a0a0a;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    border-bottom: 2px solid #334155;
    padding-bottom: 0.75rem;
    margin-bottom: 1rem;
  }

  .modal-header h2 { font-size: 1.1rem; margin: 0 0 6px 0; color: #38bdf8; }

  .progress-bar-container { display: flex; align-items: center; gap: 8px; }
  .progress-text { font-size: 0.75rem; font-weight: bold; color: #10b981; }
  .progress-bar-bg { width: 140px; height: 10px; background-color: #0f172a; border-radius: 5px; overflow: hidden; border: 1px solid #334155; }
  .progress-bar-fill { height: 100%; background-color: #10b981; transition: width 0.3s ease; }

  .close-btn { background: none; border: none; color: #94a3b8; font-size: 1.25rem; cursor: pointer; }

  .boss-hud {
    display: flex;
    align-items: center;
    gap: 1rem;
    background-color: rgba(0, 0, 0, 0.4);
    padding: 0.75rem;
    border-radius: 8px;
    border: 1px solid #ef4444;
    margin-bottom: 1rem;
  }

  .boss-avatar { font-size: 2.5rem; }
  .boss-hp-container { flex: 1; }
  .boss-name { display: block; font-size: 0.85rem; font-weight: bold; color: #fca5a5; margin-bottom: 4px; }

  .hp-bar-bg { width: 100%; height: 14px; background-color: #450a0a; border-radius: 7px; overflow: hidden; border: 1px solid #ef4444; }
  .hp-bar-fill { height: 100%; background-color: #ef4444; transition: width 0.3s ease; }

  .fraction-visual { display: flex; height: 48px; border: 2px solid #f8fafc; border-radius: 6px; overflow: hidden; margin: 1.25rem 0; }
  .quantity-visual { display: flex; justify-content: center; margin: 1rem 0; }

  .quantity-badge { background-color: #0f172a; border: 1px solid #f59e0b; color: #fbbf24; padding: 8px 16px; border-radius: 20px; font-weight: bold; }

  .segment { flex: 1; display: flex; align-items: center; justify-content: center; font-weight: bold; border-right: 2px dashed #0f172a; }
  .segment:last-child { border-right: none; }
  .segment.filled { background-color: #10b981; color: #0f172a; }
  .segment.empty { background-color: #334155; color: #94a3b8; }

  .options-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; margin: 1.25rem 0; }

  .option-btn { background-color: #0f172a; border: 2px solid #3b82f6; color: #f8fafc; padding: 0.75rem; border-radius: 8px; font-size: 1.1rem; font-weight: bold; cursor: pointer; }

  .input-group { display: flex; gap: 0.5rem; margin-bottom: 1rem; }

  .answer-input { flex: 1; background-color: #0f172a; border: 2px solid #475569; border-radius: 6px; padding: 0.5rem 0.75rem; color: #ffffff; font-size: 1rem; }

  .btn-validate { background-color: #38bdf8; color: #0f172a; border: none; font-weight: bold; padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer; }

  .feedback-box { padding: 0.75rem; border-radius: 6px; font-size: 0.9rem; margin-top: 1rem; }
  .feedback-box.success { background-color: rgba(16, 185, 129, 0.2); border: 1px solid #10b981; color: #34d399; }
  .feedback-box.info { background-color: rgba(56, 189, 248, 0.2); border: 1px solid #38bdf8; color: #38bdf8; }
  .feedback-box.hint { background-color: rgba(245, 158, 11, 0.2); border: 1px solid #f59e0b; color: #fbbf24; }

  .modal-footer { margin-top: 1.25rem; display: flex; justify-content: flex-end; }
  .btn-continue { background-color: #10b981; color: #0f172a; padding: 0.5rem 1rem; border-radius: 6px; font-weight: bold; border: none; cursor: pointer; }
  .btn-secondary { background-color: #334155; color: #f8fafc; padding: 0.5rem 1rem; border-radius: 6px; font-weight: bold; border: none; cursor: pointer; }
</style>