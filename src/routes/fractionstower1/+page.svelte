<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { GameStateController } from './lib/game/GameState';
  import { ProgressionManager } from './lib/game/ProgressionManager';
  import { ALL_FLOORS } from './lib/data/floors';
  import { MasteryEngine } from './lib/engines/MasteryEngine';
  import ActivityModal from './lib/components/exercises/ActivityModal.svelte';
  import VictoryModal from './lib/components/exercises/VictoryModal.svelte';
  import HUD from './lib/components/ui/HUD.svelte';
  import type { InteractionZone } from './lib/types/interaction';

  // Inclusion des styles globaux d'accessibilité (Phase 14)
  import './lib/styles/accessibility.css';

  const game = new GameStateController(ALL_FLOORS['floor_01']);
  const progression = new ProgressionManager();

  let playerX = $state(game.player.x);
  let playerY = $state(game.player.y);
  let currentMap = $state(game.currentMap);
  let activeInteraction = $state<InteractionZone | null>(null);
  let activeMissionZone = $state<InteractionZone | null>(null);
  let showVictoryModal = $state(false);

  let studentId = $state(progression.studentId);
  let score = $state(progression.progress.score);
  let completedCount = $state(progression.progress.completedExercises.length);
  let notification = $state<string | null>(null);

  let keysPressed: Record<string, boolean> = {};
  let gameLoopId: number;

  function refreshGame() {
    const savedFloor = localStorage.getItem('fraction_tower_current_floor') || 'floor_01';
    if (ALL_FLOORS[savedFloor]) {
      game.changeFloor(savedFloor, ALL_FLOORS[savedFloor].spawnPoint);
      currentMap = game.currentMap;
      playerX = game.player.x;
      playerY = game.player.y;
    }
  }

  function handleKeyDown(e: KeyboardEvent) {
    keysPressed[e.key] = true;
    if (e.key === 'e' || e.key === 'E' || e.key === ' ') triggerAction();
  }

  function handleKeyUp(e: KeyboardEvent) {
    keysPressed[e.key] = false;
  }

  function triggerAction() {
    if (!game.activeInteraction) return;
    const interaction = game.activeInteraction;

    if (interaction.type === 'mission_zone') {
      activeMissionZone = interaction;
    } else if ((interaction.type === 'stairs' || interaction.type === 'elevator') && interaction.targetMapId) {
      const targetMap = ALL_FLOORS[interaction.targetMapId];
      const targetFloorNum = targetMap ? targetMap.floorNumber : 1;
      
      if (targetFloorNum > 1 && !progression.isFloorUnlocked(targetFloorNum)) {
        showNotification(`🔒 Étage ${targetFloorNum} verrouillé ! Termine d'abord l'épreuve de cet étage.`);
        return;
      }

      const changed = game.changeFloor(interaction.targetMapId, interaction.targetSpawn);
      if (changed) {
        currentMap = game.currentMap;
        playerX = game.player.x;
        playerY = game.player.y;
        activeInteraction = null;
      }
    }
  }

  function handleExerciseSuccess(compId: string) {
    progression.completeExercise(compId);
    score = progression.progress.score;
    completedCount = progression.progress.completedExercises.length;
    
    if (completedCount >= 8) {
      showVictoryModal = true;
    } else {
      showNotification('⭐ Épreuve validée avec 10/10 ! Étage suivant débloqué !');
    }
  }

  function showNotification(msg: string) {
    notification = msg;
    setTimeout(() => { notification = null; }, 4000);
  }

  function update() {
    let dx = 0; let dy = 0;
    if (keysPressed['ArrowLeft'] || keysPressed['a'] || keysPressed['q'] || keysPressed['Q']) dx -= 1;
    if (keysPressed['ArrowRight'] || keysPressed['d'] || keysPressed['D']) dx += 1;
    if (keysPressed['ArrowUp'] || keysPressed['w'] || keysPressed['z'] || keysPressed['Z']) dy -= 1;
    if (keysPressed['ArrowDown'] || keysPressed['s'] || keysPressed['S']) dy += 1;

    if (dx !== 0 || dy !== 0) {
      game.movePlayer(dx, dy);
      playerX = game.player.x;
      playerY = game.player.y;
    } else {
      game.stopPlayer();
    }

    activeInteraction = game.activeInteraction;
    gameLoopId = requestAnimationFrame(update);
  }

  onMount(() => {
    refreshGame();
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    gameLoopId = requestAnimationFrame(update);
  });

  onDestroy(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(gameLoopId);
    }
  });

  // Récupère l'indicateur de maîtrise (🟢, 🟠, 🔴) pour l'afficher sur la carte
  function getMasteryBadge(compId?: string): string {
    if (!compId) return '';
    const progress = MasteryEngine.getProgress(compId);
    if (progress.status === 'mastered') return '🟢';
    if (progress.status === 'consolidating') return '🟠';
    return '🔴';
  }
</script>

<div class="game-page">
  <!-- HUD Élève (Nouveau bandeau supérieur interactif) -->
  <HUD
    currentFloorName={currentMap?.name || 'Étage 1'}
    onSaveLoaded={refreshGame}
  />

  <!-- Zone de jeu principale (Viewport 2D) -->
  <main class="viewport-wrapper">
    <div class="viewport" style="width: {currentMap?.width || 800}px; height: {currentMap?.height || 600}px;">
      
      {#if notification}
        <div class="notification-banner">{notification}</div>
      {/if}

      <!-- Décors et murs -->
      {#if currentMap}
        {#each currentMap.visualTiles as tile}
          <div
            class="tile {tile.layer}"
            style="
              left: {tile.x}px; top: {tile.y}px;
              width: {tile.width}px; height: {tile.height}px;
              background-color: {tile.color || '#1e293b'};
            "
          >
            {#if tile.label}<span class="tile-label">{tile.label}</span>{/if}
          </div>
        {/each}

        <!-- Zones d'interaction avec Badges de Maîtrise CUA -->
        {#each currentMap.interactions as zone}
          <div
            class="interaction-zone {zone.type}"
            style="
              left: {zone.x}px; top: {zone.y}px;
              width: {zone.width}px; height: {zone.height}px;
            "
          >
            <div class="zone-header">
              <span class="mastery-indicator">{getMasteryBadge(zone.competencyId)}</span>
              <span class="zone-icon">
                {zone.type === 'stairs' ? '🪜' : zone.type === 'mission_zone' ? '📜' : '🧙‍♂️'}
              </span>
            </div>
            <span class="zone-text">{zone.label}</span>
          </div>
        {/each}
      {/if}

      <!-- Joueur avec halo d'action -->
      <div
        class="player"
        style="
          left: {playerX}px; top: {playerY}px;
          width: {game.player.width}px; height: {game.player.height}px;
        "
      >
        <div class="player-avatar">🧙‍♂️</div>
      </div>

      <!-- Action Prompt à proximité d'un objet -->
      {#if activeInteraction}
        <button class="interaction-prompt" onclick={triggerAction}>
          {activeInteraction.actionPrompt || 'Appuie sur E pour interagir'}
        </button>
      {/if}
    </div>
  </main>

  <!-- Modales d'exercice et de victoire -->
  {#if activeMissionZone}
    <ActivityModal zone={activeMissionZone} onClose={() => (activeMissionZone = null)} onSuccess={handleExerciseSuccess} />
  {/if}

  {#if showVictoryModal}
    <VictoryModal
      {studentId}
      {score}
      {completedCount}
      onExport={() => progression.exportReportJSON()}
      onClose={() => (showVictoryModal = false)}
    />
  {/if}
</div>

<style>
  .game-page {
    min-height: 100vh;
    background-color: #0f172a;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .viewport-wrapper {
    margin-top: 70px;
    padding: 10px;
  }

  .viewport {
    position: relative;
    border: 3px solid #38bdf8;
    border-radius: 12px;
    overflow: hidden;
    background-color: #1e293b;
    box-shadow: 0 20px 30px rgba(0, 0, 0, 0.6);
  }

  .notification-banner {
    position: absolute;
    top: 16px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #f59e0b;
    color: #0f172a;
    padding: 8px 20px;
    border-radius: 20px;
    font-weight: bold;
    z-index: 40;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  }

  .tile {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #94a3b8;
    font-weight: bold;
  }

  .interaction-zone {
    position: absolute;
    border: 2px solid #38bdf8;
    background-color: rgba(56, 189, 248, 0.15);
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4px;
    text-align: center;
  }

  .zone-header { display: flex; align-items: center; gap: 4px; }
  .mastery-indicator { font-size: 0.75rem; }
  .zone-icon { font-size: 1.2rem; }
  .zone-text { color: #f8fafc; font-size: 0.7rem; font-weight: bold; margin-top: 2px; }

  .player {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 20;
    transition: transform 0.05s linear;
  }

  .player-avatar { font-size: 1.8rem; filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.5)); }

  .interaction-prompt {
    position: absolute;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #10b981;
    color: #0f172a;
    padding: 10px 24px;
    border: none;
    border-radius: 20px;
    font-weight: bold;
    font-size: 0.95rem;
    box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);
    z-index: 30;
    cursor: pointer;
  }
</style>