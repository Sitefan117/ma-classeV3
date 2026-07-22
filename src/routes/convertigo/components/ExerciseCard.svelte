<h1>Coucou c'est la carte !</h1>
<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Exercise } from '../types/exercise';
  import { validateAnswer } from '../engines/correctionEngine';
  import HintButton from './HintButton.svelte';

  export let exercise: Exercise;

  let userAnswer = '';
  let feedbackMessage = '';
  let isCorrect = false;
  let usedHint = false;

  const dispatch = createEventDispatcher();

  // Réinitialiser la saisie lors du changement d'exercice
  $: if (exercise) {
    userAnswer = '';
    feedbackMessage = '';
    isCorrect = false;
    usedHint = false;
  }

  function handleHintUsed() {
    usedHint = true;
  }

  function handleSubmit() {
    if (userAnswer.trim() === '') return;

    const isValid = validateAnswer(userAnswer, exercise.expectedValue);

    if (isValid) {
      isCorrect = true;
      feedbackMessage = 'Bravo ! Bonne réponse 🎉';
      dispatch('success', { usedHint });
    } else {
      isCorrect = false;
      feedbackMessage = 'Oups, ce n\'est pas tout à fait ça. Réessaye !';
    }
  }
</script>

<div class="bg-white rounded-xl shadow-md p-6 border border-slate-200 flex flex-col gap-4">
  <div class="text-sm font-semibold text-indigo-600 uppercase tracking-wide">
    {exercise.instruction}
  </div>

  <div class="text-2xl font-bold text-slate-800 text-center py-4 bg-slate-50 rounded-lg">
    {exercise.givenValue} {exercise.givenUnit} = <span class="text-indigo-600">?</span> {exercise.targetUnit}
  </div>

  <form on:submit|preventDefault={handleSubmit} class="flex flex-col gap-4">
    <div class="flex gap-2">
      <input
        type="text"
        bind:value={userAnswer}
        placeholder="Ta réponse..."
        disabled={isCorrect}
        class="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:bg-slate-100"
      />
      <button
        type="submit"
        disabled={isCorrect}
        class="px-5 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
      >
        Valider
      </button>
    </div>
  </form>

  <HintButton hintText={exercise.hint} on:hintUsed={handleHintUsed} />

  {#if feedbackMessage}
    <div
      class={`p-3 rounded-lg text-center text-sm font-medium ${
        isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
      }`}
    >
      {feedbackMessage}
    </div>
  {/if}
</div>