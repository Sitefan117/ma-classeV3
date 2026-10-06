<script lang="ts">
  import { onMount } from 'svelte';
  import { SoundEngine } from '../../game/SoundEngine';

  let { studentId, score, completedCount, onExport, onClose }: {
    studentId: string;
    score: number;
    completedCount: number;
    onExport: () => void;
    onClose: () => void;
  } = $props();

  onMount(() => {
    SoundEngine.playVictoryFanfare();
  });
</script>

<div class="victory-backdrop">
  <div class="victory-card">
    <div class="confetti-container">
      {#each Array(20) as _, i}
        <div class="confetti" style="--i: {i};">✨</div>
      {/each}
    </div>

    <h1>👑 VICTOIRE SUPRÊME ! 👑</h1>
    <p class="subtitle">Félicitations <strong>{studentId}</strong> ! Tu as dompté la Tour des Fractions !</p>

    <div class="stats-grid">
      <div class="stat-box">
        <span class="stat-label">Score Total</span>
        <span class="stat-value">{score} PTS</span>
      </div>
      <div class="stat-box">
        <span class="stat-label">Épreuves Gagnées</span>
        <span class="stat-value">{completedCount} / 8</span>
      </div>
    </div>

    <div class="actions">
      <button class="btn-primary" onclick={onExport}>📥 Télécharger mon Bilan</button>
      <button class="btn-secondary" onclick={onClose}>Retour au Jeu</button>
    </div>
  </div>
</div>

<style>
  .victory-backdrop {
    position: fixed;
    top: 0; left: 0; width: 100vw; height: 100vh;
    background-color: rgba(15, 23, 42, 0.9);
    display: flex; align-items: center; justify-content: center;
    z-index: 100;
  }

  .victory-card {
    position: relative;
    background-color: #1e293b;
    border: 3px solid #f59e0b;
    border-radius: 16px;
    padding: 2.5rem;
    text-align: center;
    color: #f8fafc;
    max-width: 480px;
    box-shadow: 0 0 30px rgba(245, 158, 11, 0.3);
    overflow: hidden;
  }

  h1 { color: #fbbf24; font-size: 1.8rem; margin-bottom: 0.5rem; }
  .subtitle { color: #94a3b8; font-size: 1rem; margin-bottom: 1.5rem; }

  .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 2rem; }
  .stat-box { background-color: #0f172a; padding: 1rem; border-radius: 8px; border: 1px solid #334155; }
  .stat-label { display: block; font-size: 0.75rem; color: #94a3b8; }
  .stat-value { font-size: 1.4rem; font-weight: bold; color: #38bdf8; }

  .actions { display: flex; gap: 1rem; justify-content: center; }
  .btn-primary { background-color: #10b981; color: #0f172a; border: none; padding: 0.75rem 1.25rem; border-radius: 8px; font-weight: bold; cursor: pointer; }
  .btn-secondary { background-color: #334155; color: #f8fafc; border: none; padding: 0.75rem 1.25rem; border-radius: 8px; font-weight: bold; cursor: pointer; }

  /* Animation Confetti */
  .confetti-container { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; }
  .confetti {
    position: absolute;
    top: -10px;
    left: calc(var(--i) * 5%);
    font-size: 1.2rem;
    animation: fall 3s infinite ease-in-out;
    animation-delay: calc(var(--i) * 0.15s);
  }

  @keyframes fall {
    0% { transform: translateY(0) rotate(0deg); opacity: 1; }
    100% { transform: translateY(350px) rotate(360deg); opacity: 0; }
  }
</style>