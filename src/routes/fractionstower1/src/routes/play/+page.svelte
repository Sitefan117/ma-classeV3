<!-- Vue principale du jeu 2D (Monde, Carte, Personnage et Interface) -->
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  // Cette route historique vit sous `fractionstower1/src/routes` : `$lib`
  // pointe vers la bibliothèque globale de l'application, pas vers celle-ci.
  import { GameStateController } from '../../../lib/game/GameState';
  import { DEMO_FLOOR_01 } from '../../../lib/data/floors';
  import ActivityModal from '../../../lib/components/exercises/ActivityModal.svelte';
  import type { InteractionZone } from '../../../lib/types/interaction';

  const game = new GameStateController(DEMO_FLOOR_01);

  let activeKeys: Record<string, boolean> = {};
  let gameLoopId: number;
  let activeMissionZone: InteractionZone | null = null;

  function handleKeyDown(e: KeyboardEvent) {
    activeKeys[e.key] = true;
    if (e.key === 'd' || e.key === 'D') {
      game.toggleDebugMode();
    }
    if ((e.key === ' ' || e.key === 'Enter') && game.activeInteraction) {
      triggerAction();
    }
  }

  function handleKeyUp(e: KeyboardEvent) {
    activeKeys[e.key] = false;
  }

  function updateGameLoop() {
    // Si une modal est ouverte, le joueur s'arrête
    if (activeMissionZone) {
      game.stopPlayer();
      gameLoopId = requestAnimationFrame(updateGameLoop);
      return;
    }

    let dx = 0;
    let dy = 0;

    if (activeKeys['ArrowLeft'] || activeKeys['q'] || activeKeys['Q']) dx -= 1;
    if (activeKeys['ArrowRight'] || activeKeys['d'] || activeKeys['D']) dx += 1;
    if (activeKeys['ArrowUp'] || activeKeys['z'] || activeKeys['Z']) dy -= 1;
    if (activeKeys['ArrowDown'] || activeKeys['s'] || activeKeys['S']) dy += 1;

    if (dx !== 0 || dy !== 0) {
      game.movePlayer(dx, dy);
    } else {
      game.stopPlayer();
    }

    gameLoopId = requestAnimationFrame(updateGameLoop);
  }

  onMount(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    gameLoopId = requestAnimationFrame(updateGameLoop);
  });

  onDestroy(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(gameLoopId);
    }
  });

  function triggerAction() {
    if (game.activeInteraction) {
      if (game.activeInteraction.type === 'mission_zone' || game.activeInteraction.type === 'npc') {
        activeMissionZone = game.activeInteraction;
      } else {
        alert(`Action : ${game.activeInteraction.label}`);
      }
    }
  }

  function closeModal() {
    activeMissionZone = null;
  }
</script>

<svelte:head>
  <title>Exploration 2D — Fractions Tower</title>
</svelte:head>

<div class="game-container">
  <header class="hud-header">
    <div class="info">
      <h1>🏰 FRACTIONS TOWER</h1>
      <span>{game.currentMap?.name}</span>
    </div>
    <div class="controls-info">
      <button class="btn-debug" on:click={() => game.toggleDebugMode()}>
        Mode Debug {game.debugMode ? '[ON]' : '[OFF]'}
      </button>
      <a href="/" class="btn-exit">Quitter</a>
    </div>
  </header>

  <main class="viewport" style="width: {game.currentMap?.width}px; height: {game.currentMap?.height}px;">
    <!-- LAYER 1 : VISUELS -->
    {#if game.currentMap}
      {#each game.currentMap.visualTiles as tile}
        <div
          class="tile layer-{tile.layer}"
          style="
            left: {tile.x}px;
            top: {tile.y}px;
            width: {tile.width}px;
            height: {tile.height}px;
            background-color: {tile.color};
          "
        >
          {tile.label || ''}
        </div>
      {/each}
    {/if}

    <!-- LAYER 2 : COLLISIONS -->
    {#if game.debugMode && game.currentMap}
      {#each game.currentMap.collisions as col}
        <div
          class="debug-collision"
          style="
            left: {col.x}px;
            top: {col.y}px;
            width: {col.width}px;
            height: {col.height}px;
          "
        >
          {col.label || 'COLLISION'}
        </div>
      {/each}
    {/if}

    <!-- LAYER 3 : INTERACTIONS -->
    {#if game.currentMap}
      {#each game.currentMap.interactions as inter}
        <div
          class="interaction-zone {game.debugMode ? 'debug-interaction' : ''}"
          style="
            left: {inter.x}px;
            top: {inter.y}px;
            width: {inter.width}px;
            height: {inter.height}px;
          "
        >
          {#if game.debugMode}
            <span>[{inter.type.toUpperCase()}] {inter.label}</span>
          {/if}
        </div>
      {/each}
    {/if}

    <!-- JOUEUR -->
    <div
      class="player-sprite {game.player.isMoving ? 'moving' : ''}"
      style="
        left: {game.player.x}px;
        top: {game.player.y}px;
        width: {game.player.width}px;
        height: {game.player.height}px;
      "
    >
      🧙‍♂️
    </div>

    <!-- BANNIÈRE D'ACTION PROXIMITÉ -->
    {#if game.activeInteraction && !activeMissionZone}
      <div class="action-banner">
        <span>⚡ {game.activeInteraction.actionPrompt || game.activeInteraction.label}</span>
        <button class="btn-action" on:click={triggerAction}>INTERAGIR (Espace)</button>
      </div>
    {/if}

    <!-- OVERLAY DEBUG -->
    {#if game.debugMode}
      <div class="debug-overlay">
        <h3>[DEBUG MODE]</h3>
        <p><strong>PLAYER:</strong> x: {Math.round(game.player.x)}, y: {Math.round(game.player.y)}</p>
        <p><strong>DIRECTION:</strong> {game.player.direction}</p>
        <p><strong>MOVING:</strong> {game.player.isMoving}</p>
        <p><strong>INTERACTION:</strong> {game.activeInteraction ? game.activeInteraction.id : 'Aucune'}</p>
      </div>
    {/if}
  </main>

  <!-- MODAL D'ACTIVITÉ PÉDAGOGIQUE -->
  {#if activeMissionZone}
    <ActivityModal zone={activeMissionZone} onClose={closeModal} />
  {/if}

  <!-- CONTROLES TACTILES TABLETTE (D-PAD) -->
  <footer class="touch-controls">
    <div class="dpad">
      <button class="dpad-btn up" on:touchstart={() => game.movePlayer(0, -1)} on:touchend={() => game.stopPlayer()}>▲</button>
      <div class="dpad-row">
        <button class="dpad-btn left" on:touchstart={() => game.movePlayer(-1, 0)} on:touchend={() => game.stopPlayer()}>◄</button>
        <button class="dpad-btn right" on:touchstart={() => game.movePlayer(1, 0)} on:touchend={() => game.stopPlayer()}>►</button>
      </div>
      <button class="dpad-btn down" on:touchstart={() => game.movePlayer(0, 1)} on:touchend={() => game.stopPlayer()}>▼</button>
    </div>
  </footer>
</div>

<style>
  .game-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #0f172a;
    color: #f8fafc;
    min-height: 100vh;
    padding: 1rem;
    font-family: system-ui, sans-serif;
  }

  .hud-header {
    width: 100%;
    max-width: 800px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .hud-header h1 {
    font-size: 1.25rem;
    margin: 0;
    color: #38bdf8;
  }

  .viewport {
    position: relative;
    border: 4px solid #334155;
    border-radius: 8px;
    background-color: #1e293b;
    overflow: hidden;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
  }

  .tile {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    color: #ffffff;
  }

  .debug-collision {
    position: absolute;
    background-color: rgba(239, 68, 68, 0.4);
    border: 2px dashed #ef4444;
    color: #ffffff;
    font-size: 0.65rem;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 20;
    pointer-events: none;
  }

  .interaction-zone {
    position: absolute;
    z-index: 10;
  }

  .debug-interaction {
    background-color: rgba(16, 185, 129, 0.3);
    border: 2px dashed #10b981;
    color: #ffffff;
    font-size: 0.65rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .player-sprite {
    position: absolute;
    background-color: #f59e0b;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
    z-index: 30;
  }

  .action-banner {
    position: absolute;
    bottom: 1rem;
    left: 50%;
    transform: translateX(-50%);
    background-color: #0284c7;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 9999px;
    display: flex;
    gap: 1rem;
    align-items: center;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
    z-index: 40;
  }

  .btn-action {
    background-color: #f59e0b;
    border: none;
    color: #0f172a;
    font-weight: bold;
    padding: 0.25rem 0.75rem;
    border-radius: 6px;
    cursor: pointer;
  }

  .debug-overlay {
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: rgba(0, 0, 0, 0.85);
    border: 1px solid #38bdf8;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    font-family: monospace;
    font-size: 0.75rem;
    color: #38bdf8;
    z-index: 50;
  }

  .touch-controls {
    margin-top: 1rem;
  }

  .dpad {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }

  .dpad-row {
    display: flex;
    gap: 20px;
  }

  .dpad-btn {
    width: 48px;
    height: 48px;
    background-color: #334155;
    color: white;
    border: 2px solid #475569;
    border-radius: 8px;
    font-size: 1.2rem;
  }

  .btn-debug {
    background-color: #334155;
    color: #f8fafc;
    border: 1px solid #475569;
    padding: 0.4rem 0.8rem;
    border-radius: 6px;
    cursor: pointer;
  }

  .btn-exit {
    color: #94a3b8;
    text-decoration: none;
    margin-left: 1rem;
  }
</style>
