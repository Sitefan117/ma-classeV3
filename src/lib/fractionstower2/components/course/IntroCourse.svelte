<script lang="ts">
	// -----------------------------------------------------------------------------
	// COURS INTERACTIF AMÉLIORÉ : INTRODUCTION AUX FRACTIONS
	// -----------------------------------------------------------------------------

	import FractionBar from '$lib/fractionstower2/components/fraction/FractionBar.svelte';
	import FractionCircle from '$lib/fractionstower2/components/fraction/FractionCircle.svelte';
	import Fraction from '$lib/fractionstower2/components/fraction/Fraction.svelte';
	import { AudioManager } from '$lib/fractionstower2/audio/AudioManager';
	import { t } from '$lib/fractionstower2/persistence/LanguageManager';

	let { onComplete } = $props<{
		onComplete: () => void;
	}>();

	let currentStep = $state(0);
	let showAnimation = $state(false);
	let isCorrect = $state<boolean | null>(null);
	let userAnswer = $state<number | undefined>(undefined);

	let demoDenominator = $state(4);
	let demoNumerator = $state(0);

	const steps = [
		{ id: 'course.unit', type: 'unit' },
		{ id: 'course.division', type: 'division' },
		{ id: 'course.filling', type: 'filling' },
		{ id: 'course.validation', type: 'validation' }
	];

	function handleNext() {
		if (currentStep < steps.length - 1) {
			currentStep += 1;
			showAnimation = false;
			isCorrect = null;
			userAnswer = undefined;
		} else {
			onComplete();
		}
	}

	function startAnimation() {
		showAnimation = true;
		if (steps[currentStep].type === 'filling') {
			let i = 0;
			const interval = setInterval(() => {
				i++;
				demoNumerator = i;
				if (i >= demoDenominator) clearInterval(interval);
			}, 500);
		}
	}

	function checkValidation() {
		if (userAnswer === 3) {
			isCorrect = true;
		} else {
			isCorrect = false;
		}
	}

	function readCurrentStep() {
		const text = t(steps[currentStep].id + '.text');
		AudioManager.speak(text);
	}

	// GESTION DU CLAVIER POUR LE COURS
	import { onMount } from 'svelte';
	onMount(() => {
		const handleKey = (e: KeyboardEvent) => {
			if (e.key === 'Enter') {
				// On ne passe au suivant que si on n'est pas en train de saisir une réponse
				// ou si la réponse est déjà correcte.
				if (steps[currentStep].type !== 'validation' || isCorrect) {
					handleNext();
				} else {
					checkValidation();
				}
			}
		};
		window.addEventListener('keydown', handleKey);
		return () => window.removeEventListener('keydown', handleKey);
	});
</script>

<div class="course-container">
	<div class="slide">
		<div class="header-row">
			<h3>{t(steps[currentStep].id + '.title')}</h3>
			<button class="audio-btn" onclick={readCurrentStep} title="Lire la consigne">
				🔊
			</button>
		</div>
		<p>{t(steps[currentStep].id + '.text')}</p>
		
		<div class="viz-box">
			{#if steps[currentStep].type === 'unit'}
				<FractionCircle numerator={1} denominator={1} color="#e74c3c" />
				<div class="caption">L'unité entière (1/1)</div>
			
			{:else if steps[currentStep].type === 'division'}
				<div class="interactive-area">
					<div class="viz-flex">
						<FractionCircle 
							numerator={0} 
							denominator={demoDenominator} 
							color="#3498db" 
							showLabel={false} 
						/>
						<div class="fraction-symbol">
							<Fraction numerator={undefined} denominator={demoDenominator} />
						</div>
					</div>
					<div class="control-panel">
						<span>Couper en : </span>
						<input type="number" bind:value={demoDenominator} min="2" max="12" />
					</div>
					{#if !showAnimation}
						<button class="btn-action" onclick={() => showAnimation = true}>Couper le gâteau !</button>
					{:else}
						<div class="animation-text">Regarde les lignes apparaître...</div>
					{/if}
				</div>

			{:else if steps[currentStep].type === 'filling'}
				<div class="interactive-area">
					<div class="viz-flex">
						<FractionCircle 
							numerator={demoNumerator} 
							denominator={demoDenominator} 
							color="#3498db" 
							showLabel={false} 
						/>
						<div class="fraction-symbol">
							<Fraction numerator={demoNumerator} denominator={demoDenominator} />
						</div>
					</div>
					<div class="control-panel">
						<span>Prendre : </span>
						<input type="number" bind:value={demoNumerator} min="0" max={demoDenominator} />
						<span class="frac-symbol"> / {demoDenominator}</span>
					</div>
					<button class="btn-action" onclick={startAnimation}>Lancer le remplissage</button>
				</div>

			{:else if steps[currentStep].type === 'validation'}
				<div class="validation-area">
					<FractionCircle numerator={3} denominator={4} color="#3498db" showLabel={false} />
					<div class="input-group">
						<input type="number" bind:value={userAnswer} />
						<span class="sep"> / </span>
						<span>4</span>
					</div>
					<button class="btn-check" onclick={checkValidation}>Vérifier</button>
					
					{#if isCorrect !== null}
						<div class="feedback {isCorrect ? 'correct' : 'wrong'}">
							{isCorrect ? "✅ Bravo ! C'est exactement ça." : "❌ Pas tout à fait, regarde bien le nombre de parts colorées."}
						</div>
					{/if}
				</div>
			{/if}
		</div>

		<div class="nav">
			<span>Étape {currentStep + 1} / {steps.length}</span>
			{#if steps[currentStep].type === 'validation' && isCorrect}
				<button class="btn-next" onclick={handleNext}>Continuer $\rightarrow$</button>
			{:else if steps[currentStep].type !== 'validation'}
				<button class="btn-next" onclick={handleNext}>Suivant $\rightarrow$</button>
			{:else}
				<button class="btn-next disabled" disabled>Saisis la bonne réponse pour continuer</button>
			{/if}
		</div>
	</div>
</div>

<style>
	.course-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		font-family: sans-serif;
		gap: 20px;
	}
	.slide {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 20px;
		max-width: 600px;
	}
	.header-row {
		display: flex;
		align-items: center;
		gap: 15px;
	}
	.audio-btn {
		background: #eee;
		border: 1px solid #ccc;
		border-radius: 50%;
		width: 35px;
		height: 35px;
		cursor: pointer;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 1.2rem;
		transition: background 0.2s;
	}
	.audio-btn:hover {
		background: #ddd;
	}
	.viz-box {
		background: #fff;
		padding: 30px;
		border-radius: 20px;
		box-shadow: 0 8px 20px rgba(0,0,0,0.1);
		margin: 20px 0;
		min-height: 300px;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
	}
	.interactive-area, .validation-area {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 20px;
	}
	.viz-flex {
		display: flex;
		align-items: center;
		gap: 20px;
	}
	.fraction-symbol {
		font-size: 2rem;
		font-weight: bold;
	}
	.control-panel {
		display: flex;
		align-items: center;
		gap: 10px;
		font-size: 1.2rem;
		font-weight: bold;
	}
	.control-panel input {
		width: 60px;
		font-size: 1.2rem;
		text-align: center;
		padding: 5px;
		border: 2px solid #ddd;
		border-radius: 5px;
	}
	.btn-action {
		padding: 10px 20px;
		background: #e67e22;
		color: white;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		font-weight: bold;
		transition: background 0.2s;
	}
	.btn-action:hover {
		background: #d35400;
	}
	.animation-text {
		font-style: italic;
		color: #666;
		font-size: 0.9rem;
	}
	.input-group {
		display: flex;
		align-items: center;
		gap: 10px;
		font-size: 2rem;
		font-weight: bold;
	}
	.input-group input {
		width: 80px;
		font-size: 2rem;
		text-align: center;
		padding: 5px;
		border: 3px solid #3498db;
		border-radius: 8px;
	}
	.btn-check {
		padding: 12px 30px;
		background: #3498db;
		color: white;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		font-size: 1.2rem;
		font-weight: bold;
	}
	.feedback {
		margin-top: 15px;
		font-weight: bold;
		padding: 10px;
		border-radius: 5px;
	}
	.feedback.correct {
		background: #d4edda;
		color: #155724;
	}
	.feedback.wrong {
		background: #f8d7da;
		color: #721c24;
	}
	.nav {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		margin-top: 20px;
	}
	.btn-next {
		padding: 10px 20px;
		background: #2ecc71;
		color: white;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		font-weight: bold;
		font-size: 1rem;
	}
	.btn-next.disabled {
		background: #ccc;
		cursor: not-allowed;
	}
	.caption {
		margin-top: 10px;
		font-style: italic;
		color: #666;
	}
</style>
