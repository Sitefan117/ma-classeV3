<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte';
  import { GRID_COLS, GRID_ROWS, TILE_SIZE, COLLISION_GRID, HOUSES, NPCS } from '../data/mapData';

  const dispatch = createEventDispatcher();

  // Position du joueur en cases de grille (36px)
  let player = { x: 9, y: 7, dir: 'down', isMoving: false, frame: 0 };
  let activeDialogue: string | null = null;

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D | null;

  onMount(() => {
    ctx = canvas.getContext('2d');
    if (ctx) ctx.imageSmoothingEnabled = false; // Effet Pixel-Art net

    window.addEventListener('keydown', handleKeyDown);
    const interval = setInterval(gameLoop, 1000 / 60); // 60 FPS

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearInterval(interval);
    };
  });

  function handleKeyDown(e: KeyboardEvent) {
    if (activeDialogue) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
        activeDialogue = null;
      }
      return;
    }

    let targetX = player.x;
    let targetY = player.y;
    let newDir = player.dir;

    if (e.key === 'ArrowUp' || e.key === 'z' || e.key === 'Z') {
      targetY--; newDir = 'up';
    } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
      targetY++; newDir = 'down';
    } else if (e.key === 'ArrowLeft' || e.key === 'q' || e.key === 'Q') {
      targetX--; newDir = 'left';
    } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
      targetX++; newDir = 'right';
    } else if (e.key === 'Enter' || e.key === ' ') {
      interact();
      return;
    } else {
      return;
    }

    player.dir = newDir;

    // Vérification des limites et des collisions
    if (
      targetX >= 0 && targetX < GRID_COLS &&
      targetY >= 0 && targetY < GRID_ROWS &&
      COLLISION_GRID[targetY][targetX] !== 1
    ) {
      player.x = targetX;
      player.y = targetY;
      player.frame = (player.frame + 1) % 4;

      // Vérifier si le joueur marche sur la porte d'une maison
      const houseEntered = HOUSES.find(h => h.doorX === player.x && h.doorY === player.y);
      if (houseEntered) {
        dispatch('enterHouse', houseEntered);
      }
    }
  }

  function interact() {
    // Vérifier PNJ à proximité
    const npc = NPCS.find(n => Math.abs(n.x - player.x) + Math.abs(n.y - player.y) <= 1);
    if (npc) {
      activeDialogue = `${npc.name}: "${npc.dialogue}"`;
    }
  }

  function gameLoop() {
    if (!ctx) return;

    // Fond herbe de base
    ctx.fillStyle = '#8bc34a';
    ctx.fillRect(0, 0, GRID_COLS * TILE_SIZE, GRID_ROWS * TILE_SIZE);

    // Rivière
    ctx.fillStyle = '#29b6f6';
    ctx.fillRect(0, 8 * TILE_SIZE, GRID_COLS * TILE_SIZE, TILE_SIZE);

    // Pont
    ctx.fillStyle = '#8d6e63';
    ctx.fillRect(9 * TILE_SIZE, 8 * TILE_SIZE, 2 * TILE_SIZE, TILE_SIZE);

    // Chemins principaux
    ctx.fillStyle = '#d7ccc8';
    ctx.fillRect(9 * TILE_SIZE, 0, 2 * TILE_SIZE, GRID_ROWS * TILE_SIZE);

    // Dessin des 5 Maisons
    HOUSES.forEach(h => {
      ctx!.fillStyle = '#ffffff';
      ctx!.fillRect(h.x * TILE_SIZE, h.y * TILE_SIZE, 3 * TILE_SIZE, 2 * TILE_SIZE);

      // Toit selon la ceinture
      const colors = { white: '#e0e0e0', yellow: '#fbc02d', green: '#4caf50', blue: '#1e88e5', black: '#37474f' };
      ctx!.fillStyle = colors[h.belt];
      ctx!.fillRect(h.x * TILE_SIZE, h.y * TILE_SIZE, 3 * TILE_SIZE, 24);

      // Porte
      ctx!.fillStyle = '#5d4037';
      ctx!.fillRect(h.doorX * TILE_SIZE + 10, h.doorY * TILE_SIZE - 12, 16, 20);
    });

    // Dessin du Joueur
    const px = player.x * TILE_SIZE + 8;
    const py = player.y * TILE_SIZE + 4;
    ctx.fillStyle = '#e53935'; // Tête/Casquette
    ctx.fillRect(px, py, 20, 16);
    ctx.fillStyle = '#1565c0'; // Vêtement
    ctx.fillRect(px, py + 16, 20, 16);
  }
</script>

<div class="relative flex flex-col items-center">
  <canvas
    bind:this={canvas}
    width={GRID_COLS * TILE_SIZE}
    height={GRID_ROWS * TILE_SIZE}
    class="border-4 border-amber-800 rounded-lg shadow-2xl bg-black cursor-pointer"
  ></canvas>

  {#if activeDialogue}
    <div class="absolute bottom-4 left-6 right-6 bg-slate-900/95 border-2 border-amber-500 p-4 rounded-md text-white font-mono shadow-lg">
      <p>{activeDialogue}</p>
      <span class="text-xs text-amber-400 mt-2 block">Appuyez sur Entrée pour fermer</span>
    </div>
  {/if}
</div>