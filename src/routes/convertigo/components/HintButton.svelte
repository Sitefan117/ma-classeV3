<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let hintText: string = '';
  let showHint = false;

  const dispatch = createEventDispatcher();

  function toggleHint() {
    if (!showHint) {
      showHint = true;
      dispatch('hintUsed');
    } else {
      showHint = false;
    }
  }
</script>

<div class="flex flex-col items-center gap-2 my-2">
  <button
    type="button"
    on:click={toggleHint}
    class="px-3 py-1.5 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-300 rounded-lg hover:bg-amber-100 transition-colors flex items-center gap-1.5"
  >
    <span>💡</span> {showHint ? "Cacher l'indice" : "Besoin d'un indice ? (-10 XP)"}
  </button>

  {#if showHint}
    <p class="text-xs text-amber-800 bg-amber-50 p-3 rounded-md border border-amber-200 text-center max-w-sm">
      {hintText}
    </p>
  {/if}
</div>