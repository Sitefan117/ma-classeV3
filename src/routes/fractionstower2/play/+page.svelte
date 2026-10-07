<script lang="ts">
	import { onMount } from 'svelte';
	import { createGameState } from '$lib/fractionstower2/game/GameState.svelte';
	import { CollisionEngine } from '$lib/fractionstower2/game/CollisionEngine';
	import { InteractionEngine } from '$lib/fractionstower2/game/InteractionEngine';
	import { FloorManager } from '$lib/fractionstower2/game/FloorManager';
	import ActivityModal from '$lib/fractionstower2/components/exercises/ActivityModal.svelte';
	import { languageState, t } from '$lib/fractionstower2/persistence/LanguageManager';
	import type { LanguageCode } from '$lib/fractionstower2/persistence/LanguageManager';

	const game = createGameState();
	let floor = $derived(FloorManager.getFloor(game.player.currentFloorId));
	let activeActivityId = $state<string | null>(null);
	let keys = new Set<string>();

	const interactionLabels: Record<string, string> = {
		'stairs': 'S',
		'elevator': 'A',
		'door': 'P',
		'npc': 'P',
		'course-intro': 'T',
		'training-intro': 'E',
		'boss-intro': 'B'
	};

	function getLabel(interaction: any): string {
		if (interaction.action && interactionLabels[interaction.action]) {
			return interactionLabels[interaction.action];
		}
		return interactionLabels[interaction.type] || '?';
	}

	function changeLanguage() {
		languageState.current = languageState.current === 'fr-FR' ? 'ru-RU' : 'fr-FR';
	}

	onMount(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			keys.add(e.key);
			if (e.key.toLowerCase() === 'e') {
				handleInteraction();
			}
		};
		const handleKeyUp = (e: KeyboardEvent) => keys.delete(e.key);
		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('keyup', handleKeyUp);

		let lastTime = 0;
		function loop(time: number) {
			update();
			requestAnimationFrame(loop);
		}
		requestAnimationFrame(loop);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			window.removeEventListener('keyup', handleKeyUp);
		};
	});

	function handleInteraction() {
		if (!floor) return;
		const interaction = InteractionEngine.checkInteraction(game.player.position, floor.interactions);
		if (interaction) {
			if (interaction.type === 'pedagogical') {
				activeActivityId = interaction.action || interaction.id;
			} else if (interaction.destination) {
				game.changeFloor(interaction.destination);
			} else if (interaction.type === 'elevator') {
				alert("L'ascenseur s'ouvre...");
			}
		}
	}

	function update() {
		if (!floor || activeActivityId) return;

		let dx = 0;
		let dy = 0;
		if (keys.has('ArrowUp') || keys.has('z') || keys.has('w')) {
			dy = -game.player.speed;
			game.setDirection('up');
		} else if (keys.has('ArrowDown') || keys.has('s')) {
			dy = game.player.speed;
			game.setDirection('down');
		}
		if (keys.has('ArrowLeft') || keys.has('q') || keys.has('a')) {
			dx = -game.player.speed;
			game.setDirection('left');
		} else if (keys.has('ArrowRight') || keys.has('d')) {
			dx = game.player.speed;
			game.setDirection('right');
		}
		if (dx !== 0) {
			const nextX = { x: game.player.position.x + dx, y: game.player.position.y };
			if (CollisionEngine.isPositionValid(nextX, floor.collisions, floor.width, floor.height)) {
				game.updatePosition(dx, 0);
			}
		}
		if (dy !== 0) {
			const nextY = { x: game.player.position.x, y: game.player.position.y + dy };
			if (CollisionEngine.isPositionValid(nextY, floor.collisions, floor.width, floor.height)) {
				// L'APICollisionEngine.isPositionValid est utilisée ici
				game.updatePosition(0, dy);
			}
		}
	}
</script>

{#if activeActivityId}
	<ActivityModal 
		activityId={activeActivityId} 
		onClose={() => activeActivityId = null} 
		{game}
	/>
{/if}

<div class="game-container">
	<div class="ui-overlay">
		<div class="floor-info">
			<strong>{game.currentFloorName}</strong>
		</div>
		<div class="stats">
			Pos: {Math.round(game.player.position.x)}, {Math.round(game.player.position.y)} | 
			Dir: {game.player.direction}
		</div>
		<div class="controls-hint">
			Déplacement: ZQSD / Flèches <br/>
			Interaction: Touche <strong>E</strong>
		</div>
		<div class="lang-switch">
			<button class="lang-btn" onclick={changeLanguage}>
				{languageState.current === 'fr-FR' ? '🇷🇺 RU' : '🇫🇷 FR'}
			</button>
		</div>
		<label class="debug-toggle">
			<input type="checkbox" bind:checked={game.debugMode} /> 
			Mode Debug
		</label>
	</div>

	{#if floor}
		<div class="world" style="width: {floor.width}px; height: {floor.height}px;">
			<div 
				class="player" 
				style="left: {game.player.position.x}px; top: {game.player.position.y}px;"
			>
				<div class="sprite {game.player.direction}"></div>
			</div>

			{#each floor.interactions as inter}
				<div class="interaction-label" style="left: {inter.x + inter.width/2}px; top: {inter.y + inter.height/2}px;">
					{getLabel(inter)}
				</div>
			{/each}

			{#if game.debugMode}
				{#each floor.collisions as col}
					<div class="debug-collision" style="left: {col.x}px; top: {col.y}px; width: {col.width}px; height: {col.height}px;">
						{col.id}
					</div>
				{/each}
				{#each floor.interactions as inter}
					<div class="debug-interaction" style="left: {inter.x}px; top: {inter.y}px; width: {inter.width}px; height: {inter.height}px;">
						{inter.type}
					</div>
				{/each}
			{/if}
		</div>
	{:else}
		<div class="error">Étage non trouvé : {game.player.currentFloorId}</div>
	{/if}
</div>

<style>
	.game-container {
		position: relative;
		width: 100vw;
		height: 100vh;
		background: #222;
		display: flex;
		justify-content: center;
		align-items: center;
		overflow: hidden;
		font-family: sans-serif;
	}
	.ui-overlay {
		position: absolute;
		top: 20px;
		left: 20px;
		z-index: 100;
		color: white;
		display: flex;
		flex-direction: column;
		gap: 10px;
		background: rgba(0, 0, 0, 0.6);
		padding: 15px;
		border-radius: 8px;
		border: 1px solid #555;
	}
	.floor-info {
		font-size: 1.2rem;
		border-bottom: 1px solid #555;
		padding-bottom: 5px;
		margin-bottom: 5px;
		color: #ffcc00;
	}
	.stats {
		font-size: 0.9rem;
		opacity: 0.8;
	}
	.controls-hint {
		font-size: 0.8rem;
		opacity: 0.7;
		margin: 10px 0;
	}
	.lang-switch {
		display: flex;
		justify-content: center;
		margin: 5px 0;
	}
	.lang-btn {
		background: #444;
		color: white;
		border: 1px solid #777;
		padding: 5px 10px;
		border-radius: 4px;
		cursor: pointer;
		font-size: 0.8rem;
	}
	.lang-btn:hover {
		background: #666;
	}
	.world {
		position: relative;
		background: #444;
		border: 4px solid #000;
		box-shadow: 0 0 20px rgba(0,0,0,0.5);
	}
	.player {
		position: absolute;
		width: 32px;
		height: 32px;
		transition: transform 0.1s linear;
		z-index: 10;
	}
	.sprite {
		width: 100%;
		height: 100%;
		background: #3498db;
		border-radius: 4px;
	}
	.sprite.up { border-bottom: 4px solid #2980b9; }
	.sprite.down { border-top: 4px solid #2980b9; }
	.sprite.left { border-right: 4px solid #2980b9; }
	.sprite.right { border-left: 4px solid #2980b9; }
	.interaction-label {
		position: absolute;
		width: 20px;
		height: 20px;
		background: rgba(255, 255, 255, 0.7);
		color: #333;
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
		font-weight: bold;
		font-size: 12px;
		transform: translate(-50%, -50%);
		pointer-events: none;
		border: 1px solid #333;
		z-index: 5;
	}
	.debug-collision {
		position: absolute;
		background: rgba(255, 0, 0, 0.3);
		border: 1px solid red;
		color: red;
		font-size: 10px;
		pointer-events: none;
	}
	.debug-interaction {
		position: absolute;
		background: rgba(0, 255, 0, 0.3);
		border: 1px solid green;
		color: green;
		font-size: 10px;
		pointer-events: none;
	}
	.error {
		color: white;
		font-size: 2rem;
	}
</style>
