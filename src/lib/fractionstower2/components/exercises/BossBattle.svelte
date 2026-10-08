<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { BossEngine, type BossState } from '$lib/fractionstower2/engines/BossEngine';
	import { languageState } from '$lib/fractionstower2/persistence/LanguageManager';
	import FractionBar from '$lib/fractionstower2/components/fraction/FractionBar.svelte';
	import { AudioManager } from '$lib/fractionstower2/audio/AudioManager';

	let { floorId, game, onClose } = $props<{
		floorId: string,
		game: any,
		onClose: () => void
	}>();

	let state = $state<BossState>(BossEngine.createInitialState());
	function generateCurrentExercise() {
		return BossEngine.generateQuestion(floorId, state.currentPhase, state.currentQuestionIndex);
	}
	let currentExercise = $state(generateCurrentExercise());
	
	let userInputNum = $state<string>('');
	let userInputDen = $state<string>('');
	let comparisonChoice = $state<string>('');
	let showAid = $state(false);
	let isSubmitting = $state(false);

	let numInputRef = $state<HTMLInputElement | null>(null);

	async function handleAnswer() {
		if (isSubmitting) return;
		isSubmitting = true;
		let isCorrect = false;

		if (currentExercise.type === 'input') {
			const ans = currentExercise.correctAnswer as any;
			const num = parseInt(userInputNum);
			const den = parseInt(userInputDen);
			
			if (!isNaN(num) && !isNaN(den)) {
				if (num === ans.numerator && den === ans.denominator) {
					isCorrect = true;
				}
			}
		} else if (currentExercise.type === 'comparison') {
			if (comparisonChoice === currentExercise.correctAnswer) {
				isCorrect = true;
			}
		}

		// Sound effects
		if (isCorrect) {
			AudioManager.playSound('correct');
		} else {
			AudioManager.playSound('wrong');
		}

		BossEngine.processAnswer(state, isCorrect);

		if (state.isDefeated) {
			AudioManager.playSound('boss_win');
			game.markBossDefeated(floorId);
			alert(languageState.current === 'fr-FR' ? "VICTOIRE ! Le Boss est vaincu !" : "ПОБЕДА! Босс побежден!");
			onClose();
			return;
		}

		if (state.isPlayerDefeated) {
			AudioManager.playSound('boss_lose');
			alert(languageState.current === 'fr-FR' ? "DÉFAITE ! Tu as été vaincu par le Boss." : "ПОРАЖЕНИЕ! Вы были побеждены Боссом.");
			onClose();
			return;
		}

		currentExercise = generateCurrentExercise();
		userInputNum = '';
		userInputDen = '';
		comparisonChoice = '';
		showAid = false;

		await tick();
		numInputRef?.focus();
		isSubmitting = false;
	}

	function readQuestion() {
		AudioManager.speak(currentExercise.question, languageState.current);
	}

	onMount(() => {
		// Start boss music
		AudioManager.playMusic('bg_boss');
		void tick().then(() => numInputRef?.focus());

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Enter') {
				e.preventDefault();
				void handleAnswer();
			}
		};
		window.addEventListener('keydown', handleKeyDown);
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			AudioManager.stopMusic();
		};
	});
</script>

<div class="boss-container">
	<div class="boss-header">
		<div class="hp-bar-container">
			<div class="label">BOSS HP</div>
			<div class="hp-bar"><div class="hp-fill" style="width: {(state.bossHP / 300) * 100}%"></div></div>
		</div>
		<div class="phase-info">Phase {state.currentPhase} - Question {state.currentQuestionIndex + 1}/6</div>
		<div class="hp-bar-container">
			<div class="label">PLAYER HP</div>
			<div class="hp-bar"><div class="hp-fill player" style="width: {state.playerHP}%"></div></div>
		</div>
	</div>

	<div class="question-area">
		<h2 class="question-text">{currentExercise.question}</h2>
		<button class="audio-btn" onclick={readQuestion} title="Lire la consigne">🔊</button>
		
		<button class="aid-btn" onclick={() => showAid = !showAid}>
			{showAid 
				? (languageState.current === 'fr-FR' ? 'Masquer l\'aide' : 'Скрыть помощь') 
				: (languageState.current === 'fr-FR' ? 'Besoin d\'aide ? 💡' : 'Нужна помощь? 💡')
			}
		</button>

		{#if showAid && currentExercise.type === 'comparison'}
			<div class="visual-aid">
				{#if currentExercise.fractions}
					{#each currentExercise.fractions as frac, i}
						<div class="aid-item">
							<FractionBar numerator={frac.numerator} denominator={frac.denominator} />
							<span class="frac-label">{frac.numerator}/{frac.denominator}</span>
						</div>
					{/each}
				{/if}
			</div>
		{/if}

		{#if currentExercise.type === 'input'}
			<div class="fraction-input">
				<input type="number" bind:this={numInputRef} bind:value={userInputNum} placeholder="Num" />
				<div class="line"></div>
				<input type="number" bind:value={userInputDen} placeholder="Den" />
			</div>
		{:else if currentExercise.type === 'comparison'}
			<div class="comparison-input">
				<button onclick={() => comparisonChoice = '<'}> &lt; </button>
				<button onclick={() => comparisonChoice = '='}> = </button>
				<button onclick={() => comparisonChoice = '>'}> &gt; </button>
				<div class="selected">{comparisonChoice}</div>
			</div>
		{/if}

		<button class="submit-btn" onclick={handleAnswer} disabled={isSubmitting}>
			{languageState.current === 'fr-FR' ? 'Valider (Entrée)' : 'Подтвердить (Enter)'}
		</button>
	</div>
</div>

<style>
	.boss-container {
		background: #1a1a1a;
		color: white;
		padding: 2rem;
		border-radius: 12px;
		border: 4px solid #ff0000;
		text-align: center;
		max-width: 600px;
		margin: auto;
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
		box-shadow: 0 0 50px rgba(255, 0, 0, 0.3);
	}
	.boss-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2rem;
		gap: 20px;
	}
	.hp-bar-container {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.label { font-weight: bold; margin-bottom: 5px; font-size: 0.8rem; }
	.hp-bar {
		width: 100%;
		height: 20px;
		background: #333;
		border: 2px solid #555;
		border-radius: 10px;
		overflow: hidden;
	}
	.hp-fill {
		height: 100%;
		background: linear-gradient(90deg, #ff0000, #ff6666);
		transition: width 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
	}
	.hp-fill.player {
		background: linear-gradient(90deg, #00ff00, #66ff66);
		transition: width 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
	}
	.phase-info {
		font-size: 1.2rem;
		font-weight: bold;
		color: #ffcc00;
	}
	.question-area {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5rem;
	}
	.question-text {
		font-size: 1.5rem;
		margin: 0;
		animation: fadeIn 0.5s ease-out;
	}
	@keyframes fadeIn {
		from { opacity: 0; transform: translateY(-10px); }
		to { opacity: 1; transform: translateY(0); }
	}
	.aid-btn {
		background: #444;
		color: #ffcc00;
		border: 1px solid #ffcc00;
		padding: 5px 15px;
		border-radius: 20px;
		cursor: pointer;
		font-size: 0.9rem;
		transition: all 0.2s;
	}
	.audio-btn {
		background: #444;
		color: white;
		border: 1px solid #aaa;
		border-radius: 50%;
		width: 36px;
		height: 36px;
		cursor: pointer;
		font-size: 1rem;
	}
	.aid-btn:hover {
		background: #ffcc00;
		color: #000;
	}
	.fraction-input {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 5px;
	}
	.fraction-input input {
		width: 60px;
		text-align: center;
		font-size: 1.5rem;
		background: #333;
		color: white;
		border: 1px solid #555;
		border-radius: 4px;
		padding: 5px;
	}
	.line {
		width: 80px;
		height: 3px;
		background: white;
	}
	.visual-aid {
		display: flex;
		gap: 30px;
		justify-content: center;
		margin-bottom: 1rem;
		animation: slideDown 0.3s ease-out;
	}
	@keyframes slideDown {
		from { opacity: 0; transform: scale(0.9); }
		to { opacity: 1; transform: scale(1); }
	}
	.aid-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
	}
	.frac-label {
		font-weight: bold;
		font-size: 1.2rem;
		color: #ffcc00;
	}
	.comparison-input {
		display: flex;
		gap: 10px;
		align-items: center;
	}
	.comparison-input button {
		width: 50px;
		height: 50px;
		font-size: 1.5rem;
		cursor: pointer;
		background: #333;
		color: white;
		border: 2px solid #555;
		border-radius: 8px;
		transition: all 0.1s;
	}
	.comparison-input button:active { transform: scale(0.9); }
	.comparison-input button:hover { background: #444; }
	.selected {
		font-size: 2rem;
		font-weight: bold;
		min-width: 30px;
		text-align: center;
		color: #ffcc00;
	}
	.submit-btn {
		padding: 10px 30px;
		font-size: 1.2rem;
		background: #ff0000;
		color: white;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		font-weight: bold;
		transition: background 0.2s;
	}
	.submit-btn:hover { background: #cc0000; }
</style>
