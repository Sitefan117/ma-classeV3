<script lang="ts">
  export let text = '';
  export let label = '🔊 Écouter';

  let speaking = false;

  function speak() {
    if (typeof window === 'undefined' || !text) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    utterance.rate = 0.9;

    utterance.onstart = () => (speaking = true);
    utterance.onend = () => (speaking = false);
    utterance.onerror = () => (speaking = false);

    window.speechSynthesis.speak(utterance);
  }

  function stop() {
    window.speechSynthesis?.cancel();
    speaking = false;
  }
</script>

<button class="audio-button" type="button" on:click={speaking ? stop : speak}>
  {speaking ? '⏹ Arrêter' : label}
</button>

<style>
  .audio-button {
    border: 2px solid #0f172a;
    background: #fef3c7;
    color: #0f172a;
    border-radius: 10px;
    padding: 0.55rem 0.8rem;
    font-weight: 900;
    cursor: pointer;
    font-size: 0.82rem;
  }
  .audio-button:hover { background: #fde68a; }
</style>
