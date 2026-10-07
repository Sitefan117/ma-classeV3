<script lang="ts">
	// -----------------------------------------------------------------------------
	// COMPOSANT SESSION D'ENTRAÎNEMENT
	// -----------------------------------------------------------------------------

	import { onMount } from 'svelte';
	import { ExerciseGenerator } from '$lib/fractionstower2/engines/ExerciseGenerator';
	import { FractionEngine } from '$lib/fractionstower2/engines/FractionEngine';
	import FractionCircle from '$lib/fractionstower2/components/fraction/FractionCircle.svelte';
	import FractionBar from '$lib/fractionstower2/components/fraction/FractionBar.svelte';
	import Fraction from '$lib/fractionstower2/components/fraction/Fraction.svelte';
	import { AudioManager } from '$lib/fractionstower2/audio/AudioManager';
	import { t } from '$lib/fractionstower2/persistence/LanguageManager';

	let { onComplete, game } = $props<{
		onComplete: () => void;
		game: any;
	}>();

	let inputRef: HTMLInputElement | undefined = $state();

	const config = {
		minNumerator: 1,
		maxNumerator: 10,
		denominators: Array.from({length: 10}, (_, i) => i + 1)
	};

	let currentExercise = $state({
		fraction: ExerciseGenerator.generateRandomFraction(config),
		attempt: 0,
		type: 'circle' as 'circle' | 'bar'
	});
	
	let userAnswer = $state("");
	let feedback = $state("");
	let score = $state(0);
	let totalExercises = 10;

	function checkAnswer() {
		const val = parseInt(userAnswer);
		if (isNaN(val)) {
			feedback = "S'il te plaît, écris un nombre.";
			return;
		}

		if (val === currentExercise.fraction.numerator) {
			feedback = t('feedback.correct');
			score += 1;
			setTimeout(nextExercise, 1500);
		} else {
			feedback = t('feedback.wrong');
			currentExercise.attempt += 1;
		}
	}

	function nextExercise() {
		feedback = "";
		userAnswer = "";
		currentExercise = {
			fraction: ExerciseGenerator.generateRandomFraction(config),
			attempt: 0,
			type: Math.random() > 0.5 ? 'circle' : 'bar'
		};
		
		// Utilisation d'un délai court pour s'assurer que le DOM est mis à jour
		setTimeout(() => {
			if (inputRef) {
				inputRef.focus();
				inputRef.value = ""; // On force le vide
			}
		}, 50);

		if (score >= totalExercises) {
			const compId = 'lecture-fractions-1';
			const currentState = game.competencies[compId] || {
				successes: 0, failures: 0, lastStatus: 'RED', history: []
			};
			game.competencies[compId] = MasteryEngine.updateCompetence(currentState, true);
			onComplete();
		}
	}

	function readQuestion() {
		AudioManager.speak(t('training.question'));
	}

	onMount(() => {
		setTimeout(() => inputRef?.focus(), 100);
		const handleKey = (e: KeyboardEvent) => {
			if (e.key === 'Enter') {
				e.preventDefault();
				checkAnswer();
			}
		};
		window.addEventListener('keydown', handleKey);
		return () => window.removeEventListener('keydown', handleKey);
	});
</script>

<div class="training-container">
	<div class="score-board">
		Score : {score} / {totalExercises}
	</div>

	<div class="exercise-box">
		<div class="header-row">
			<h3 style="margin: 0;">{t('training.question')}</h3>
			<button class="audio-btn" onclick={readQuestion} title="Lire la consigne">
				🔊
			</button>
		</div>
		
		<div class="viz-box">
			{#key currentExercise}
				<div class="viz-wrapper">
					{#if currentExercise.type === 'circle'}
						<FractionCircle 
							numerator={currentExercise.fraction.numerator} 
							denominator={currentExercise.fraction.denominator} 
							showLabel={false}
						/>
					{:else}
						<FractionBar 
							numerator={currentExercise.fraction.numerator} 
							denominator={currentExercise.fraction.denominator} 
							showLabel={false}
							width={200}
						/>
					{/if}
				</div>
			{/key}
		</div>

		<div class="input-group">
			<input 
				type="text" 
				inputmode="numeric"
				bind:this={inputRef} 
				bind:value={userAnswer} 
				placeholder="?"
			/>
			<span class="den"> / <Fraction denominator={currentExercise.fraction.denominator} /></span>
		</div>

		<button class="btn" onclick={checkAnswer}>Vérifier</button>
		<p class="feedback">{feedback}</p>
	</div>
</div>

<style>
	.training-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 20px;
		font-family: sans-serif;
	}
	.score-board {
		font-weight: bold;
		font-size: 1.2rem;
		color: #666;
	}
	.exercise-box {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 20px;
		background: #fff;
		padding: 30px;
		border-radius: 16px;
		box-shadow: 0 4px 15px rgba(0,0,0,0.1);
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
	.viz-box {
		padding: 20px;
		background: #fdfdfd;
		border: 1px solid #eee;
		border-radius: 12px;
		min-height: 180px;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.viz-wrapper {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
	}
	.input-group {
		display: flex;
		align-items: center;
		gap: 10px;
		font-size: 2rem;
		font-weight: bold;
	}
	input {
		width: 70px;
		font-size: 2rem;
		text-align: center;
		padding: 5px;
		border: 2px solid #ddd;
		border-radius: 8px;
	}
	.den {
		display: inline-flex;
		align-items: center;
		color: #888;
	}
	.btn {
		padding: 12px 30px;
		background: #3498db;
		color: white;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		font-size: 1.1rem;
		font-weight: bold;
	}
	.btn:hover {
		background: #2980b9;
	}
	.feedback {
		font-weight: bold;
		min-height: 1.5em;
		color: #444;
	}
</style>
