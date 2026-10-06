<script lang="ts">
  import type { InteractionZone } from '$lib/types/interaction';

  export let zone: InteractionZone;
  export let onClose: () => void;

  let userAnswer = '';
  let feedback = '';
  let isSuccess = false;

  function validateAnswer() {
    if (userAnswer.trim() === '3/4' || userAnswer.trim() === '3 / 4') {
      feedback = '🎉 Bravo ! Tu as correctement identifié la fraction 3/4.';
      isSuccess = true;
    } else {
      feedback = '💡 Indice CUA : L\'unité est partagée en 4 parts égales. 3 parts sont colorées.';
      isSuccess = false;
    }
  }
</script>

<div class="modal-backdrop">
  <div class="modal-card">
    <header class="modal-header">
      <h2>📜 {zone.label}</h2>
      <button class="close-btn" on:click={onClose}>✕</button>
    </header>

    <main class="modal-body">
      <p class="instruction">
        <strong>Consigne :</strong> Quelle est la fraction représentée par la partie verte ci-dessous ?
      </p>

      <!-- Représentation visuelle CUA (Barre) -->
      <div class="fraction-visual">
        <div class="segment filled">1/4</div>
        <div class="segment filled">1/4</div>
        <div class="segment filled">1/4</div>
        <div class="segment empty">1/4</div>
      </div>

      <div class="input-group">
        <input
          type="text"
          bind:value={userAnswer}
          placeholder="Ex: 3/4"
          class="answer-input"
        />
        <button class="btn-validate" on:click={validateAnswer}>Valider</button>
      </div>

      {#if feedback}
        <div class="feedback-box {isSuccess ? 'success' : 'hint'}">
          {feedback}
        </div>
      {/if}
    </main>

    <footer class="modal-footer">
      {#if isSuccess}
        <button class="btn-continue" on:click={onClose}>Retour au Monde 2D ➔</button>
      {:else}
        <button class="btn-secondary" on:click={onClose}>Quitter la mission</button>
      {/if}
    </footer>
  </div>
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
    max-width: 500px;
    padding: 1.5rem;
    color: #f8fafc;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid #334155;
    padding-bottom: 0.75rem;
    margin-bottom: 1rem;
  }

  .modal-header h2 {
    font-size: 1.2rem;
    margin: 0;
    color: #38bdf8;
  }

  .close-btn {
    background: none;
    border: none;
    color: #94a3b8;
    font-size: 1.25rem;
    cursor: pointer;
  }

  .fraction-visual {
    display: flex;
    height: 48px;
    border: 2px solid #f8fafc;
    border-radius: 6px;
    overflow: hidden;
    margin: 1.5rem 0;
  }

  .segment {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    border-right: 2px dashed #0f172a;
  }

  .segment:last-child {
    border-right: none;
  }

  .segment.filled {
    background-color: #10b981;
    color: #0f172a;
  }

  .segment.empty {
    background-color: #334155;
    color: #94a3b8;
  }

  .input-group {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .answer-input {
    flex: 1;
    background-color: #0f172a;
    border: 2px solid #475569;
    border-radius: 6px;
    padding: 0.5rem 0.75rem;
    color: #ffffff;
    font-size: 1rem;
  }

  .btn-validate {
    background-color: #38bdf8;
    color: #0f172a;
    border: none;
    font-weight: bold;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    cursor: pointer;
  }

  .feedback-box {
    padding: 0.75rem;
    border-radius: 6px;
    font-size: 0.9rem;
    margin-top: 1rem;
  }

  .feedback-box.success {
    background-color: rgba(16, 185, 129, 0.2);
    border: 1px solid #10b981;
    color: #34d399;
  }

  .feedback-box.hint {
    background-color: rgba(245, 158, 11, 0.2);
    border: 1px solid #f59e0b;
    color: #fbbf24;
  }

  .modal-footer {
    margin-top: 1.5rem;
    display: flex;
    justify-content: flex-end;
  }

  .btn-continue, .btn-secondary {
    padding: 0.5rem 1rem;
    border-radius: 6px;
    font-weight: bold;
    cursor: pointer;
    border: none;
  }

  .btn-continue {
    background-color: #10b981;
    color: #0f172a;
  }

  .btn-secondary {
    background-color: #334155;
    color: #f8fafc;
  }
</style>