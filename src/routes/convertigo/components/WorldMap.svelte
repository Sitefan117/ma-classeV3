<script lang="ts">
	import { onMount } from 'svelte';

	let { grade, onEnterHouse } = $props<{
		grade: '7H' | '8H';
		onEnterHouse: (beltId: string) => void;
	}>();

	const GRID_COLS = 20;
	const GRID_ROWS = 15;
	const TILE_SIZE = 36;

	type TileType =
		| 'G' // Herbe
		| 'F' // Fleurs
		| 'P' // Chemin
		| 'W' // Eau
		| 'B' // Pont
		| 'T' // Arbre
		| 'H' // Maison (Mur/Toit)
		| 'D' // Porte
		| 'N'; // PNJ

	// CARTE FIXÉE : Lignes 11, 12, 13 totalement dégagées avec chemin direct vers les portes D
	const TILE_MAP: TileType[][] = [
		['T','T','T','T','T','T','T','T','T','T','T','T','T','T','T','T','T','T','T','T'],
		['T','G','F','G','T','H','H','H','T','G','G','T','H','H','H','T','F','G','G','T'],
		['T','G','N','P','T','H','H','H','T','G','G','T','H','H','H','T','G','G','G','T'],
		['T','P','P','P','P','H','D','H','P','P','P','P','H','D','H','P','P','P','G','T'], // Porte Blanche (6,3), Jaune (13,3)
		['T','P','G','G','P','P','P','P','P','P','P','P','P','P','P','P','G','P','G','T'],
		['T','P','G','G','P','G','G','G','P','P','G','G','G','G','G','P','G','P','G','T'],
		['T','P','G','G','P','G','T','H','H','H','T','G','G','G','G','P','G','P','G','T'],
		['T','P','G','G','P','G','T','H','H','H','T','G','F','G','G','P','G','P','G','T'],
		['T','P','G','G','P','P','P','H','D','H','P','P','P','P','P','P','P','P','G','T'], // Porte Verte (8,8)
		['T','W','W','W','W','W','W','P','B','B','P','W','W','W','W','W','W','W','W','T'], // Pont (8,9) et (9,9)
		['T','G','F','G','G','G','G','P','P','P','P','G','G','G','G','G','G','F','G','T'],
		['T','G','G','G','T','H','H','H','T','G','T','H','H','H','T','G','G','G','G','T'], // Maisons du bas
		['T','G','G','G','T','H','D','H','T','G','T','H','D','H','T','G','G','G','G','T'], // Portes Bleue (6,12) et Noire (12,12)
		['T','G','P','P','P','P','P','P','P','P','P','P','P','P','P','P','P','G','G','T'], // Chemin dégagé devant les portes du bas
		['T','T','T','T','T','T','T','T','T','T','T','T','T','T','T','T','T','T','T','T']
	];

	const DOOR_MAPPING: Record<string, string> = {
		'6,3': 'white',   // Maison Blanche
		'13,3': 'yellow', // Maison Jaune
		'8,8': 'green',   // Maison Verte
		'6,12': 'blue',   // Maison Bleue
		'12,12': 'black'  // Maison Noire
	};

	let playerX = $state(3);
	let playerY = $state(3);
	let playerDirection = $state<'up' | 'down' | 'left' | 'right'>('down');
	let isWalking = $state(false);

	let showNpcDialog = $state(false);
	let npcMessage = $state('');

	function isTileWalkable(col: number, row: number): boolean {
		if (col < 0 || col >= GRID_COLS || row < 0 || row >= GRID_ROWS) return false;
		const tile = TILE_MAP[row][col];
		return tile === 'G' || tile === 'F' || tile === 'P' || tile === 'B' || tile === 'D';
	}

	function movePlayer(dx: number, dy: number, dir: 'up' | 'down' | 'left' | 'right') {
		playerDirection = dir;
		const targetX = playerX + dx;
		const targetY = playerY + dy;

		if (TILE_MAP[targetY]?.[targetX] === 'N') {
			npcMessage = `Bienvenue en ${grade} ! Toutes les maisons sont maintenant facilement accessibles. Traverse le pont pour aller au bas du village !`;
			showNpcDialog = true;
			return;
		}

		if (isTileWalkable(targetX, targetY)) {
			playerX = targetX;
			playerY = targetY;
			isWalking = true;
			setTimeout(() => (isWalking = false), 120);

			const doorKey = `${targetX},${targetY}`;
			if (DOOR_MAPPING[doorKey]) {
				onEnterHouse(DOOR_MAPPING[doorKey]);
			}
		}
	}

	function handleKeyDown(e: KeyboardEvent) {
		switch (e.key) {
			case 'ArrowUp': case 'w': case 'W': case 'z': case 'Z':
				e.preventDefault(); movePlayer(0, -1, 'up'); break;
			case 'ArrowDown': case 's': case 'S':
				e.preventDefault(); movePlayer(0, 1, 'down'); break;
			case 'ArrowLeft': case 'a': case 'A': case 'q': case 'Q':
				e.preventDefault(); movePlayer(-1, 0, 'left'); break;
			case 'ArrowRight': case 'd': case 'D':
				e.preventDefault(); movePlayer(1, 0, 'right'); break;
			case ' ': case 'Enter':
				if (showNpcDialog) showNpcDialog = false; break;
		}
	}

	onMount(() => {
		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	});
</script>

<div class="map-viewport-wrapper">
	<div class="pixel-world-container" style="width: {GRID_COLS * TILE_SIZE}px; height: {GRID_ROWS * TILE_SIZE}px;">
		<div class="tile-grid" style="grid-template-columns: repeat({GRID_COLS}, {TILE_SIZE}px); grid-template-rows: repeat({GRID_ROWS}, {TILE_SIZE}px);">
			{#each TILE_MAP as row, rowIndex}
				{#each row as tile, colIndex}
					<div class="tile tile-{tile}">
						{#if tile === 'F'}<span class="flower-icon">🌸</span>
						{:else if tile === 'T'}<div class="tree-sprite"></div>
						{:else if tile === 'W'}<div class="water-ripple"></div>
						{:else if tile === 'B'}<div class="bridge-wood"></div>
						{:else if tile === 'D'}<div class="door-frame"><div class="door-knob"></div></div>
						{:else if tile === 'N'}<div class="npc-character animate-bounce">🧙‍♂️</div>
						{/if}

						{#if rowIndex === 1 && colIndex === 6}<div class="belt-badge badge-white">1. BLANCHE</div>
						{:else if rowIndex === 1 && colIndex === 13}<div class="belt-badge badge-yellow">2. JAUNE</div>
						{:else if rowIndex === 6 && colIndex === 8}<div class="belt-badge badge-green">3. VERTE</div>
						{:else if rowIndex === 11 && colIndex === 6}<div class="belt-badge badge-blue">4. BLEUE</div>
						{:else if rowIndex === 11 && colIndex === 12}<div class="belt-badge badge-black">5. NOIRE</div>
						{/if}
					</div>
				{/each}
			{/each}
		</div>

		<!-- SPRITE JOUEUR -->
		<div
			class="player-character-sprite"
			class:is-walking={isWalking}
			style="left: {playerX * TILE_SIZE}px; top: {playerY * TILE_SIZE}px; width: {TILE_SIZE}px; height: {TILE_SIZE}px;"
		>
			<div class="player-body dir-{playerDirection}">
				<div class="player-head"></div>
				<div class="player-eyes"></div>
			</div>
			<div class="player-shadow"></div>
		</div>

		{#if showNpcDialog}
			<div class="npc-dialog-box">
				<div class="dialog-avatar">🧙‍♂️</div>
				<div class="dialog-content">
					<strong class="dialog-title">Guide du Village</strong>
					<p>{npcMessage}</p>
				</div>
				<button class="dialog-close-btn" onclick={() => (showNpcDialog = false)}>Fermer</button>
			</div>
		{/if}
	</div>

	<!-- D-PAD TACTILE -->
	<div class="dpad-touch-controls">
		<div class="dpad-grid">
			<div></div>
			<button class="dpad-btn" onclick={() => movePlayer(0, -1, 'up')}>▲</button>
			<div></div>
			<button class="dpad-btn" onclick={() => movePlayer(-1, 0, 'left')}>◀</button>
			<button class="dpad-btn" onclick={() => movePlayer(0, 1, 'down')}>▼</button>
			<button class="dpad-btn" onclick={() => movePlayer(1, 0, 'right')}>▶</button>
		</div>
	</div>
</div>

<style>
	.map-viewport-wrapper { display: flex; flex-direction: column; align-items: center; gap: 12px; user-select: none; }
	.pixel-world-container { position: relative; border: 4px solid #1e293b; border-radius: 12px; overflow: hidden; background-color: #2e7d32; }
	.tile-grid { display: grid; width: 100%; height: 100%; }
	.tile { position: relative; display: flex; align-items: center; justify-content: center; }

	.tile-G { background-color: #4caf50; }
	.tile-F { background-color: #43a047; }
	.tile-P { background-color: #d7ccc8; border: 1px dashed #b0bec5; }
	.tile-W { background-color: #0288d1; }
	.tile-B { background-color: #8d6e63; }
	.tile-H { background-color: #4e342e; border: 1px solid #3e2723; }
	.tile-D { background-color: #3e2723; }
	.tile-T { background-color: #2e7d32; }

	.flower-icon { font-size: 14px; }
	.water-ripple { width: 100%; height: 100%; background: linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%); background-size: 8px 8px; }
	.tree-sprite { width: 26px; height: 26px; background-color: #1b5e20; border-radius: 50%; border: 2px solid #0a3a0a; }
	.door-frame { width: 20px; height: 28px; background: #d84315; border: 2px solid #bf360c; border-radius: 4px 4px 0 0; position: relative; }
	.door-knob { width: 4px; height: 4px; background: #ffb300; border-radius: 50%; position: absolute; right: 3px; top: 12px; }
	.bridge-wood { width: 100%; height: 100%; background: #6d4c41; border-left: 2px solid #3e2723; border-right: 2px solid #3e2723; }
	.npc-character { font-size: 20px; }

	.belt-badge { position: absolute; top: -20px; left: 50%; transform: translateX(-50%); font-size: 9px; font-weight: 900; padding: 2px 5px; border-radius: 4px; white-space: nowrap; z-index: 10; font-family: monospace; }
	.badge-white { background: #ffffff; color: #000; border: 1px solid #000; }
	.badge-yellow { background: #ffeb3b; color: #000; border: 1px solid #f57f17; }
	.badge-green { background: #4caf50; color: #fff; border: 1px solid #1b5e20; }
	.badge-blue { background: #2196f3; color: #fff; border: 1px solid #0d47a1; }
	.badge-black { background: #212121; color: #fff; border: 1px solid #fff; }

	.player-character-sprite { position: absolute; display: flex; flex-direction: column; align-items: center; justify-content: center; transition: all 0.1s linear; z-index: 20; }
	.player-body { width: 22px; height: 22px; background-color: #ff9800; border: 2px solid #e65100; border-radius: 50%; position: relative; }
	.player-eyes { width: 4px; height: 4px; background-color: #212121; border-radius: 50%; position: absolute; top: 6px; left: 5px; box-shadow: 8px 0 0 #212121; }
	.dir-up .player-eyes { display: none; }
	.dir-left .player-eyes { left: 2px; box-shadow: none; }
	.dir-right .player-eyes { left: 12px; box-shadow: none; }
	.player-shadow { width: 18px; height: 5px; background: rgba(0,0,0,0.25); border-radius: 50%; margin-top: -2px; }

	.npc-dialog-box { position: absolute; bottom: 12px; left: 12px; right: 12px; background: rgba(15, 23, 42, 0.95); border: 2px solid #ffb300; border-radius: 8px; padding: 10px; display: flex; align-items: center; gap: 10px; z-index: 30; color: white; }
	.dialog-avatar { font-size: 22px; }
	.dialog-content { flex: 1; }
	.dialog-title { font-size: 11px; color: #ffb300; display: block; }
	.dialog-content p { font-size: 11px; margin: 0; }
	.dialog-close-btn { background: #ffb300; color: #000; border: none; font-weight: bold; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 10px; }

	.dpad-touch-controls { margin-top: 4px; }
	.dpad-grid { display: grid; grid-template-columns: repeat(3, 44px); gap: 6px; }
	.dpad-btn { height: 44px; background: #334155; border: 1px solid #64748b; border-radius: 8px; color: white; font-size: 18px; display: flex; align-items: center; justify-content: center; cursor: pointer; }
	.dpad-btn:active { background: #ff9800; color: black; }
</style>