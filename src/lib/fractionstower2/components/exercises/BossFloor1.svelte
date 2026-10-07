<script lang="ts">
	// -----------------------------------------------------------------------------
	// COMPOSANT BOSS ÉTAGE 1
	// Examen final de l'étage composé de plusieurs phases.
	// -----------------------------------------------------------------------------

	import { onMount } from 'svelte';
	import { ExerciseGenerator } from '$lib/fractionstower2/engines/ExerciseGenerator';
	import { FractionEngine } from '$lib/fractionstower2/engines/FractionEngine';
	import FractionBar from '$lib/fractionstower2/components/fraction/FractionBar.svelte';
	import FractionCircle from '$lib/fractionstower2/components/fraction/FractionCircle.svelte';
	import { AudioManager } from '$lib/fractionstower2/audio/AudioManager';
	import { t } from '$lib/fractionstower2/persistence/LanguageManager';
	import { MasteryEngine } from '$lib/fractionstower2/engines/MasteryEngine';

	let { onComplete, game } = $props<{
		onComplete: () => void;
		game: any;
	}>();

	let phase = $state(1); // 1: Lire, 2: Représenter, 3: Comparer, 4: Victoire
	let score = $state(0);
	let feedback = $state("");
	let uNum = $state("");
	let uDen = $state("");
	let selectedOption = $state<number | null>(null);
	let currentExercise: any = $state(null);
	let totalBossQuestions = 10;

	function initPhase1() {
		currentExercise = {
			fraction: ExerciseGenerator.generateRandomFraction({
				minNumerator: 1, maxNumerator: 10, denominators: Array.from({length: 10}, (_, i) => i + 1)
			}),
			type: Math.random() > 0.5 ? 'circle' : 'bar'
		};
	}

	function initPhase2() {
		const target = ExerciseGenerator.generateRandomFraction({
			minNumerator: 1, maxNumerator: 10, denominators: Array.from({length: 10}, (_, i) => i + 1)
		});
		const options = [target];
		while (options.length < 3) {
			const rand = ExerciseGenerator.generateRandomFraction({
				minNumerator: 1, maxNumerator: 10, denominators: Array.from({length: 10}, (_, i) => i + 1)
			});
			if (!FractionEngine.areEquivalent(rand, target)) {
				options.push(rand);
			}
		}
		currentExercise = {
			target,
			options: options.sort(() => Math.random() - 0.5),
			type: Math.random() > 0.5 ? 'circle' : 'bar'
		};
	}

	function initPhase3() {
		const f1 = ExerciseGenerator.generateRandomFraction({
			minNumerator: 1, maxNumerator: 10, denominators: Array.from({length: 10}, (_, i) => i + 1)
		});
		const f2 = ExerciseGenerator.generateRandomFraction({
			minNumerator: 1, maxNumerator: 10, denominators: Array.from({length: 10}, (_, i) => i + 1)
		});
		if (FractionEngine.areEquivalent(f1, f2)) {
			return initPhase3();
		}
		currentExercise = { f1, f2, type: Math.random() > 0.5 ? 'circle' : 'bar' };
	}

	function checkPhase1() {
		const num = parseInt(uNum);
		const den = parseInt(uDen);

		if (isNaN(num) || isNaN(den)) {
			feedback = "S'il te plaît, remplis les deux cases.";
			return;
		}

		const target = currentExercise.fraction;
		
		if (num === target.numerator && den === target.denominator) {
			feedback = t('feedback.correct');
			score += 1;
			setTimeout(() => {
				if (score < totalBossQuestions) {
					uNum = "";
					uDen = "";
					initPhase1();
					feedback = "";
				} else {
					phase = 2;
					feedback = "✅ Phase 1 validée ! Passage à la phase 2.";
					setTimeout(() => {
						feedback = "";
						initPhase2();
					}, 1500);
				}
			}, 1500);
		} else {
			if (num === target.denominator && den === target.numerator) {
				feedback = "Attention, tu as inversé le numérateur et le dénominateur !";
			} else if (num !== target.numerator && den === target.denominator) {
				feedback = "Le dénominateur est juste, mais le numérateur est faux.";
			} else if (num === target.numerator && den !== target.denominator) {
				feedback = "Le numérateur est juste, mais le dénominateur est faux.";
			} else {
				feedback = t('feedback.wrong');
			}
		}
	}

	function checkPhase2(idx: number) {
		if (FractionEngine.areEquivalent(currentExercise.options[idx], currentExercise.target)) {
			feedback = t('feedback.correct');
			score += 1;
			setTimeout(() => {
				if (score < totalBossQuestions * 2) {
					initPhase2();
					feedback = "";
				} else {
					phase = 3;
					feedback = "✅ Phase 2 validée ! Passage à la phase 3.";
					setTimeout(() => {
						feedback = "";
						initPhase3();
					}, 1500);
				}
			}, 1500);
		} else {
			feedback = t('feedback.wrong');
		}
	}

	function checkPhase3(choice: 'f1' | 'f2') {
		const result = FractionEngine.compare(currentExercise.f1, currentExercise.f2);
		const correct = (choice === 'f1' && result > 0) || (choice === 'f2' && result < 0);
		
		if (correct) {
			feedback = t('feedback.correct');
			score += 1;
			setTimeout(() => {
				if (score < totalBossQuestions * 3) {
					initPhase3();
					feedback = "";
				} else {
					const compId = 'lecture-fractions-1';
					const currentState = game.competencies[compId] || {
						successes: 0, failures: 0, lastStatus: 'RED', history: []
					};
					game.competencies[compId] = {
						...MasteryEngine.updateCompetence(currentState, true),
						lastStatus: 'GREEN'
					};
					phase = 4;
				}
			}, 1500);
		} else {
			feedback = t('feedback.wrong');
		}
	}

	function readInstruction() {
		let text = "";
		if (phase === 1) text = t('training.question');
		else if (phase === 2) text = "Laquelle de ces images représente la fraction ?";
		else if (phase === 3) text = "Laquelle de ces deux fractions est la plus grande ?";
		AudioManager.speak(text);
	}

	onMount(() => {
		initPhase1();
		const handleKey = (e: KeyboardEvent) => {
			if (e.key === 'Enter') {
				if (phase === 1) checkPhase1();
			}
		};
		window.addEventListener('keydown', handleKey);
		return () => window.removeEventListener('keydown', handleKey);
	});
</script>

<div class="boss-container">
	<div class="boss-header">
		<h2 style="margin: 0;">BOSS ÉTAGE 1</h2>
		<div class="phase-indicator">Phase {phase}/3 | Score : {score} / {phase === 1 ? totalBossQuestions : phase === 2 ? totalBossQuestions * 2 : totalBossQuestions * 3}</div>
	</div>

	<div class="boss-body">
		{#if !currentExercise}
			<div class="loading">Chargement du défi...</div>
		{:else if phase === 1}
			<div class="phase">
				<div class="header-row">
					<h3>Phase 1 : Lecture</h3>
					<button class="audio-btn" onclick={readInstruction}>🔊</button>
				</div>
				<p>{t('training.question')}</p>
				<div class="viz">
					{#if currentExercise.type === 'circle'}
						<FractionCircle numerator={currentExercise.fraction.numerator} denominator={currentExercise.fraction.denominator} showLabel={false} />
					{:else}
						<FractionBar numerator={currentExercise.fraction.numerator} denominator={currentExercise.fraction.denominator} showLabel={false} width={200} />
					{/if}
				</div>
				<div class="input-group">
					<input type="text" inputmode="numeric" bind:value={uNum} />
					<span class="sep"> / </span>
					<input type="text" inputmode="numeric" bind:value={uDen} />
				</div>
				<button class="btn" onclick={checkPhase1}>Valider</button>
			</div>
		{:else if phase === 2}
			<div class="phase">
				<div class="header-row">
					<h3>Phase 2 : Représentation</h3>
					<button class="audio-btn" onclick={readInstruction}>🔊</button>
				</div>
				<p>Laquelle de ces images représente {currentExercise.target.numerator}/{currentExercise.target.denominator} ?</p>
				<div class="options-grid">
					{#each currentExercise.options as opt, i}
						<button class="option-btn" onclick={() => checkPhase2(i)}>
							{#if currentExercise.type === 'circle'}
								<FractionCircle numerator={opt.numerator} denominator={opt.denominator} showLabel={false} size={100} />
							{:else}
								<FractionBar numerator={opt.numerator} denominator={opt.denominator} width={100} showLabel={false} />
							{/if}
						</button>
					{/each}
				</div>
			</div>
		{:else if phase === 3}
			<div class="phase">
				<div class="header-row">
					<h3>Phase 3 : Comparaison</h3>
					<button class="audio-btn" onclick={readInstruction}>🔊</button>
				</div>
				<p>Laquelle de ces deux fractions est la plus GRANDE ?</p>
				<div class="compare-grid">
					<button class="comp-btn" onclick={() => checkPhase3('f1')}>
						{#if currentExercise.type === 'circle'}
							<FractionCircle numerator={currentExercise.f1.numerator} denominator={currentExercise.f1.denominator} showLabel={false} size={100} />
						{:else}
							<FractionBar numerator={currentExercise.f1.numerator} denominator={currentExercise.f1.denominator} showLabel={false} width={150} />
						{/if}
					</button>
					<span class="vs">VS</span>
					<button class="comp-btn" onclick={() => checkPhase3('f2')}>
						{#if currentExercise.type === 'circle'}
							<FractionCircle numerator={currentExercise.f2.numerator} denominator={currentExercise.f2.denominator} showLabel={false} size={100} />
						{:else}
							<FractionBar numerator={currentExercise.f2.numerator} denominator={currentExercise.f2.denominator} showLabel={false} width={150} />
						{/if}
					</button>
				</div>
			</div>
		{:else}
			<div class="victory">
				<h2 class="win-title">{t('boss.victory')}</h2>
				<p>Tu as maîtrisé les bases des fractions.</p>
				<button class="btn success" onclick={onComplete}>Rentrer dans la tour</button>
			</div>
		{/if}
	</div>

	{#if feedback}
		<div class="feedback">{feedback}</div>
	{/if}
</div>

<style>
	.boss-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		font-family: sans-serif;
		width: 100%;
	}
	.boss-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		padding: 10px;
		border-bottom: 2px solid #ddd;
		margin-bottom: 20px;
	}
	.phase-indicator {
		background: #333;
		color: white;
		padding: 5px 10px;
		border-radius: 4px;
		font-weight: bold;
	}
	.boss-body {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 300px;
		width: 100%;
	}
	.phase {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 20px;
		text-align: center;
	}
	.header-row {
		display: flex;
		align-items: center;
		gap: 10px;
	}
	.audio-btn {
		background: #eee;
		border: 1px solid #ccc;
		border-radius: 50%;
		width: 30px;
		height: 30px;
		cursor: pointer;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 1rem;
	}
	.viz {
		padding: 20px;
		background: #fff;
		border-radius: 12px;
		box-shadow: 0 4px 10px rgba(0,0,0,0.1);
	}
	.input-group {
		display: flex;
		align-items: center;
		gap: 10px;
		font-size: 1.5rem;
		font-weight: bold;
	}
	input {
		width: 60px;
		font-size: 1.5rem;
		text-align: center;
		padding: 5px;
	}
	.sep {
		color: #888;
	}
	.btn {
		padding: 10px 20px;
		background: #3498db;
		color: white;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		font-weight: bold;
	}
	.options-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 20px;
	}
	.option-btn {
		background: white;
		border: 2px solid #ddd;
		border-radius: 8px;
		cursor: pointer;
		padding: 10px;
		transition: border-color 0.2s;
	}
	.option-btn:hover {
		border-color: #3498db;
	}
	.compare-grid {
		display: flex;
		align-items: center;
		gap: 30px;
	}
	.comp-btn {
		background: white;
		border: 2px solid #ddd;
		border-radius: 12px;
		cursor: pointer;
		padding: 15px;
		transition: transform 0.2s;
	}
	.comp-btn:hover {
		transform: scale(1.05);
		border-color: #3498db;
	}
	.vs {
		font-weight: bold;
		font-size: 1.5rem;
		color: #e74c3c;
	}
	.victory {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 20px;
		text-align: center;
	}
	.win-title {
		font-size: 3rem;
		color: #2ecc71;
		margin: 0;
	}
	.btn.success {
		background: #2ecc71;
	}
	.feedback {
		margin-top: 20px;
		font-weight: bold;
		color: #444;
		min-height: 1.5em;
	}
	.loading {
		font-family: sans-serif;
		color: #666;
	}
</style>
