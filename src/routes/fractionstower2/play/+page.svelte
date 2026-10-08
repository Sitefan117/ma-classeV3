<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { base } from '$app/paths';
	import { createGameState } from '$lib/fractionstower2/game/GameState.svelte';
	import { CollisionEngine } from '$lib/fractionstower2/game/CollisionEngine';
	import { InteractionEngine } from '$lib/fractionstower2/game/InteractionEngine';
	import { FloorManager } from '$lib/fractionstower2/game/FloorManager';
	import ActivityModal from '$lib/fractionstower2/components/exercises/ActivityModal.svelte';
	import BossBattle from '$lib/fractionstower2/components/exercises/BossBattle.svelte';
	import CourseViewer from '$lib/fractionstower2/components/course/CourseViewer.svelte';
	import { languageState } from '$lib/fractionstower2/persistence/LanguageManager';
	import { SaveManager } from '$lib/fractionstower2/persistence/SaveManager';
	import { AudioManager } from '$lib/fractionstower2/audio/AudioManager';

	const game = createGameState();
	let floor = $derived(FloorManager.getFloor(game.player.currentFloorId));
	let activeActivityId = $state<string | null>(null);
	let activeBossFloorId = $state<string | null>(null);
	let activeCourseFloorId = $state<string | null>(null);
	let keys = new Set<string>();
	let isWalking = $state(false);

	const interactionLabels: Record<string, string> = {
		'stairs': 'S',
		'elevator': 'A',
		'door': 'P',
		'npc': 'P',
		'course-intro': 'T',
		'classic-course-intro': 'C',
		'training-intro': 'E',
		'boss-intro': 'B'
	};

	const npcColors: Record<string, string> = {
		'course-intro': '#ffcc00', // Jaune pour le Guide Académique
		'classic-course-intro': '#7c3aed', // Violet pour le parcours classique
		'training-intro': '#4caf50', // Vert pour l'Entraîneur
		'boss-intro': '#f44336'    // Rouge pour le Boss
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
		AudioManager.loadSound('step', `${base}/assets/audio/step.mp3`);
		AudioManager.loadSound('interact', `${base}/assets/audio/interact.mp3`);
		AudioManager.loadSound('floor_change', `${base}/assets/audio/floor_change.mp3`);
		AudioManager.playBGM(`${base}/assets/audio/bgm_main.mp3`);

		const handleKeyDown = (e: KeyboardEvent) => {
			keys.add(e.key);
			if (e.key.toLowerCase() === 'e') {
				handleInteraction();
			}
		};
		const handleKeyUp = (e: KeyboardEvent) => keys.delete(e.key);
		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('keyup', handleKeyUp);

		function loop() {
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
		if (!floor || game.isTransitioning) return;
		const interaction = InteractionEngine.checkInteraction(game.player.position, floor.interactions);
		if (interaction) {
			AudioManager.playSound('interact');
			if (interaction.type === 'pedagogical') {
				if (interaction.action === 'boss-intro') {
					activeBossFloorId = game.player.currentFloorId;
				} else if (interaction.action === 'course-intro') {
					activeCourseFloorId = game.player.currentFloorId;
				} else {
					activeActivityId = interaction.action || interaction.id;
				}
			} else if (interaction.type === 'stairs') {
				handleStairs(interaction);
			} else if (interaction.type === 'elevator') {
				handleElevator();
			} else if (interaction.destination) {
				AudioManager.playSound('floor_change');
				game.changeFloor(interaction.destination);
			}
		}
	}

	function handleStairs(interaction: any) {
		if (!interaction.destination) return;
		const currentNum = parseInt(game.player.currentFloorId.split('-')[1]);
		const destNum = parseInt(interaction.destination.split('-')[1]);

		if (destNum > currentNum) {
			if (game.defeatedBosses.has(game.player.currentFloorId)) {
				AudioManager.playSound('floor_change');
				game.changeFloor(interaction.destination);
			} else {
				alert(languageState.current === 'fr-FR' 
					? "L'escalier est bloqué ! Tu dois d'abord battre le Boss de cet étage pour monter." 
					: "Лестница заблокирована! Сначала вы должны победить Босса этого этажа, чтобы подняться.");
			}
		} else {
			AudioManager.playSound('floor_change');
			game.changeFloor(interaction.destination);
		}
	}

	function handleElevator() {
		const target = prompt(languageState.current === 'fr-FR' 
			? "Vers quel étage souhaites-tu aller ? (1-8)" 
			: "На какой этаж вы хотите отправиться? (1-8)");
		if (!target) return;
		const floorNum = parseInt(target);
		if (isNaN(floorNum) || floorNum < 1 || floorNum > 8) {
			alert(languageState.current === 'fr-FR' ? "Numéro d'étage invalide." : "Неверный номер этажа.");
			return;
		}
		const floorId = `floor-${floorNum}`;
		const correctPassword = FloorManager.elevatorPasswords[floorId];
		if (!correctPassword) {
			alert("Erreur de configuration de l'ascenseur.");
			return;
		}
		const userPassword = prompt(languageState.current === 'fr-FR' 
			? `Entre le code secret pour l'étage ${floorNum} :` 
			: `Введите секретный код для ${floorNum}-го этажа:`);
		if (userPassword && userPassword.toLowerCase() === correctPassword.toLowerCase()) {
			AudioManager.playSound('floor_change');
			game.changeFloor(floorId);
		} else if (userPassword !== null) {
			alert(languageState.current === 'fr-FR' ? "Code incorrect !" : "Неверный код!");
		}
	}

	function saveGame() {
		const studentId = prompt(languageState.current === 'fr-FR' 
			? "Entre ton nom ou ID pour sauvegarder :" 
			: "Введите ваше имя или ID для сохранения:");
		if (!studentId) return;
		SaveManager.exportSave(studentId, game.player, game.defeatedBosses, game.hasElevatorAccess);
	}

	function loadGame(e: Event) {
		const target = e.target as HTMLInputElement;
		if (!target.files) return;
		const files = Array.from(target.files);
		for (const file of files) {
			SaveManager.importSave(file).then(data => {
				if (data) {
					game.loadSave(data.player, data.defeatedBosses, data.hasElevatorAccess);
					alert(languageState.current === 'fr-FR' ? "Sauvegarde chargée avec succès !" : "Сохранение успешно загружено!");
				}
			});
		}
	}

	function update() {
		if (!floor || activeActivityId || activeBossFloorId || activeCourseFloorId || game.isTransitioning) return;
		let dx = 0; let dy = 0;
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
		isWalking = (dx !== 0 || dy !== 0);
		if (dx !== 0) {
			const nextX = { x: game.player.position.x + dx, y: game.player.position.y };
			if (CollisionEngine.isPositionValid(nextX, floor.collisions, floor.width, floor.height)) {
				game.updatePosition(dx, 0);
			}
		}
		if (dy !== 0) {
			const nextY = { x: game.player.position.x, y: game.player.position.y + dy };
			if (CollisionEngine.isPositionValid(nextY, floor.collisions, floor.width, floor.height)) {
				game.updatePosition(0, dy);
			}
		}
	}
</script>

{#if activeActivityId}
	<ActivityModal activityId={activeActivityId} onClose={() => activeActivityId = null} {game} />
{/if}
{#if activeBossFloorId}
	<BossBattle floorId={activeBossFloorId} {game} onClose={() => activeBossFloorId = null} />
{/if}
{#if activeCourseFloorId}
	<CourseViewer floorId={activeCourseFloorId} onClose={() => activeCourseFloorId = null} />
{/if}

{#if game.isTransitioning}
	<div class="transition-overlay"></div>
{/if}

<div class="game-container">
	<div class="ui-overlay">
		<div class="floor-info"><strong>{game.currentFloorName}</strong></div>
		<div class="stats">Pos: {Math.round(game.player.position.x)}, {Math.round(game.player.position.y)} | Dir: {game.player.direction}</div>
		<div class="controls-hint">Déplacement: ZQSD / Flèches <br/> Interaction: Touche <strong>E</strong></div>
		<div class="lang-switch">
			<button class="lang-btn" onclick={changeLanguage}>{languageState.current === 'fr-FR' ? '🇷🇺 RU' : '🇫🇷 FR'}</button>
		</div>
		<div class="save-controls">
			<button class="save-btn" onclick={saveGame}>{languageState.current === 'fr-FR' ? '💾 Sauvegarder' : '💾 Сохранить'}</button>
			<label class="load-label">
				{languageState.current === 'fr-FR' ? '📂 Charger' : '📂 Загрузить'}
				<input type="file" accept=".fracsave" onchange={loadGame} />
			</label>
		</div>
		<label class="debug-toggle">
			<input type="checkbox" bind:checked={game.debugMode} /> Mode Debug
		</label>
	</div>

	{#if floor}
		<div class="world" style="width: {floor.width}px; height: {floor.height}px;">
			<div class="player" class:walking={isWalking} style="left: {game.player.position.x}px; top: {game.player.position.y}px;">
				<div class="sprite {game.player.direction}"></div>
			</div>
			{#each floor.interactions as inter}
				{#if inter.type === 'pedagogical'}
					<div class="npc" style="left: {inter.x}px; top: {inter.y}px; background-color: {npcColors[inter.action ?? ''] || '#fff'}">
						<div class="npc-sprite"></div>
						<div class="npc-label">{getLabel(inter)}</div>
					</div>
				{/if}
				<div class="interaction-label" style="left: {inter.x + inter.width/2}px; top: {inter.y + inter.height/2}px;">
					{getLabel(inter)}
				</div>
			{/each}
			{#if game.debugMode}
				{#each floor.collisions as col}
					<div class="debug-collision" style="left: {col.x}px; top: {col.y}px; width: {col.width}px; height: {col.height}px;">{col.id}</div>
				{/each}
				{#each floor.interactions as inter}
					<div class="debug-interaction" style="left: {inter.x}px; top: {inter.y}px; width: {inter.width}px; height: {inter.height}px;">{inter.type}</div>
				{/each}
			{/if}
		</div>
	{:else}
		<div class="error">Étage non trouvé : {game.player.currentFloorId}</div>
	{/if}

	<div class="touch-controls">
		<div class="dpad">
			<button class="touch-btn up" onmousedown={() => keys.add('ArrowUp')} onmouseup={() => keys.delete('ArrowUp')} ontouchstart={() => keys.add('ArrowUp')} ontouchend={() => keys.delete('ArrowUp')}>▲</button>
			<div class="dpad-mid">
				<button class="touch-btn left" onmousedown={() => keys.add('ArrowLeft')} onmouseup={() => keys.delete('ArrowLeft')} ontouchstart={() => keys.add('ArrowLeft')} ontouchend={() => keys.delete('ArrowLeft')}>◀</button>
				<button class="touch-btn right" onmousedown={() => keys.add('ArrowRight')} onmouseup={() => keys.delete('ArrowRight')} ontouchstart={() => keys.add('ArrowRight')} ontouchend={() => keys.delete('ArrowRight')}>▶</button>
			</div>
			<button class="touch-btn down" onmousedown={() => keys.add('ArrowDown')} onmouseup={() => keys.delete('ArrowDown')} ontouchstart={() => keys.add('ArrowDown')} ontouchend={() => keys.delete('ArrowDown')}>▼</button>
		</div>
		<div class="action-area">
			<button class="action-btn" onclick={handleInteraction}>{languageState.current === 'fr-FR' ? 'INTERAGIR' : 'ВЗАИМОДЕЙСТВОВАТЬ'}</button>
		</div>
	</div>
</div>

<style>
	.game-container { position: relative; width: 100vw; height: 100vh; background: #222; display: flex; justify-content: center; align-items: center; overflow: hidden; font-family: sans-serif; }
	.ui-overlay { position: absolute; top: 20px; left: 20px; z-index: 100; color: white; display: flex; flex-direction: column; gap: 10px; background: rgba(0, 0, 0, 0.6); padding: 15px; border-radius: 8px; border: 1px solid #555; }
	.floor-info { font-size: 1.2rem; border-bottom: 1px solid #555; padding-bottom: 5px; margin-bottom: 5px; color: #ffcc00; }
	.stats { font-size: 0.9rem; opacity: 0.8; }
	.controls-hint { font-size: 0.8rem; opacity: 0.7; margin: 10px 0; }
	.lang-switch { display: flex; justify-content: center; margin: 5px 0; }
	.lang-btn { background: #444; color: white; border: 1px solid #777; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 0.8rem; }
	.lang-btn:hover { background: #666; }
	.save-controls { display: flex; flex-direction: column; gap: 8px; margin: 10px 0; border-top: 1px solid #555; padding-top: 10px; }
	.save-btn { background: #2e7d32; color: white; border: none; padding: 8px; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 0.8rem; }
	.save-btn:hover { background: #388e3c; }
	.load-label { background: #1976d2; color: white; border: none; padding: 8px; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 0.8rem; text-align: center; display: block; }
	.load-label input { display: none; }
	.debug-toggle { color: white; font-size: 0.8rem; display: flex; align-items: center; gap: 5px; cursor: pointer; }
	.world { position: relative; background: #444; border: 4px solid #000; box-shadow: 0 0 20px rgba(0,0,0,0.5); }
	.player { position: absolute; width: 32px; height: 32px; transition: transform 0.1s linear; z-index: 10; }
	.sprite { width: 100%; height: 100%; background: #3498db; border-radius: 4px; }
	.player.walking .sprite { animation: walk-bob 0.3s infinite ease-in-out; }
	@keyframes walk-bob { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05, 0.95); } }
	.sprite.up { border-bottom: 4px solid #2980b9; }
	.sprite.down { border-top: 4px solid #2980b9; }
	.sprite.left { border-right: 4px solid #2980b9; }
	.sprite.right { border-left: 4px solid #2980b9; }
	.interaction-label { position: absolute; width: 20px; height: 20px; background: rgba(255, 255, 255, 0.7); color: #333; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-weight: bold; font-size: 12px; transform: translate(-50%, -50%); pointer-events: none; border: 1px solid #333; z-index: 5; }
	.npc { position: absolute; width: 32px; height: 32px; border-radius: 4px; z-index: 8; display: flex; flex-direction: column; align-items: center; justify-content: center; border: 2px solid #fff; }
	.npc-sprite { width: 100%; height: 100%; border-radius: 2px; }
	.npc-label { position: absolute; top: -20px; font-size: 12px; font-weight: bold; color: white; text-shadow: 1px 1px 2px black; }
	.debug-collision { position: absolute; background: rgba(255, 0, 0, 0.3); border: 1px solid red; color: red; font-size: 10px; pointer-events: none; }
	.debug-interaction { position: absolute; background: rgba(0, 255, 0, 0.3); border: 1px solid green; color: green; font-size: 10px; pointer-events: none; }
	.error { color: white; font-size: 2rem; }
	.transition-overlay { position: absolute; top: 0; left: 0; width: 100vw; height: 100vh; background: black; z-index: 2000; pointer-events: none; animation: fade-out 0.5s forwards; }
	@keyframes fade-out { from { opacity: 0; } to { opacity: 1; } }
	.touch-controls { position: absolute; bottom: 30px; left: 0; right: 0; display: flex; justify-content: space-between; align-items: flex-end; padding: 0 40px; pointer-events: none; z-index: 1000; }
	.dpad { display: flex; flex-direction: column; align-items: center; gap: 10px; pointer-events: auto; }
	.dpad-mid { display: flex; gap: 10px; }
	.touch-btn { width: 60px; height: 60px; background: rgba(255, 255, 255, 0.2); border: 2px solid rgba(255, 255, 255, 0.5); border-radius: 12px; color: white; font-size: 1.5rem; cursor: pointer; display: flex; justify-content: center; align-items: center; user-select: none; -webkit-user-select: none; touch-action: manipulation; }
	.touch-btn:active { background: rgba(255, 255, 255, 0.4); transform: scale(0.95); }
	.action-area { pointer-events: auto; }
	.action-btn { width: 100px; height: 100px; background: #ffcc00; color: #000; border: 4px solid #fff; border-radius: 50%; font-weight: bold; cursor: pointer; box-shadow: 0 4px 10px rgba(0,0,0,0.5); user-select: none; -webkit-user-select: none; touch-action: manipulation; }
	.action-btn:active { transform: scale(0.9); background: #ffaa00; }
</style>
