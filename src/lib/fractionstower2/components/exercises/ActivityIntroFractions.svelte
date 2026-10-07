<script lang="ts">
	// -----------------------------------------------------------------------------
	// ACTIVITÉ : INTRODUCTION AUX FRACTIONS
	// Utilise les composants de visualisation pour enseigner la notion de part.
	// -----------------------------------------------------------------------------

	import FractionBar from '$lib/fractionstower2/components/fraction/FractionBar.svelte';
	import FractionCircle from '$lib/fractionstower2/components/fraction/FractionCircle.svelte';
	import { FractionEngine } from '$lib/fractionstower2/engines/FractionEngine';

	let { onComplete } = $props<{
		onComplete: () => void;
	}>();

	let step = $state(0);
	let userAnswer = $state(0);
	let feedback = $state("");

	const targetFraction = { numerator: 1, denominator: 4 };

	function checkAnswer() {
		if (userAnswer === targetFraction.numerator) {
			feedback = "✅ Parfait ! 1 part sur 4, c'est bien un quart.";
			setTimeout(() => {
				step += 1;
				feedback = "";
			}, 2000);
		} else {
			feedback = "❌ Essaie encore ! Regarde bien combien de parts sont colorées.";
		}
	}
</script>

<div class="activity-container">
	{#if step === 0}
		<div class="step">
			<h3>Qu'est-ce qu'une fraction ?</h3>
			<p>Une fraction représente une partie d'un tout divisé en parts égales.</p>
			<div class="viz-group">
				<FractionBar numerator={1} denominator={2} color="#e74c3c" />
				<span>C'est un demi (1/2)</span>
			</div>
			<div class="viz-group">
				<FractionBar numerator={1} denominator={4} color="#3498db" />
				<span>C'est un quart (1/4)</span>
			</div>
			<button class="btn" onclick={() => step++}>J'ai compris !</button>
		</div>
	{:else if step === 1}
		<div class="step">
			<h3>À toi de jouer !</h3>
			<p>Combien de parts sont colorées dans ce cercle ?</p>
			<div class="viz-group">
				<FractionCircle numerator={1} denominator={4} />
			</div>
			<div class="input-group">
				<input type="number" bind:value={userAnswer} min="0" max="4" />
				<span> / 4</span>
			</div>
			<button class="btn" onclick={checkAnswer}>Vérifier</button>
			<p class="feedback">{feedback}</p>
		</div>
	{:else}
		<div class="step">
			<h3>Félicitations !</h3>
			<p>Tu sais maintenant lire une fraction simple.</p>
			<button class="btn success" onclick={onComplete}>Terminer l'activité</button>
		</div>
	{/if}
</div>

<style>
	.activity-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 20px;
		text-align: center;
		padding: 20px;
		font-family: sans-serif;
	}
	.step {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 20px;
	}
	.viz-group {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 5px;
		margin: 10px 0;
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
	.btn {
		padding: 10px 20px;
		background: #3498db;
		color: white;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		font-size: 1.1rem;
	}
	.btn.success {
		background: #2ecc71;
	}
	.feedback {
		font-weight: bold;
		min-height: 1.5em;
	}
</style>
