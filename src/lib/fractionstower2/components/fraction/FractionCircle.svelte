<script lang="ts">
	// -----------------------------------------------------------------------------
	// COMPOSANT CERCLE DE FRACTION
	// Représente visuellement une fraction sous forme de disque (camembert).
	// -----------------------------------------------------------------------------

	import Fraction from '$lib/fractionstower2/components/fraction/Fraction.svelte';

	let { numerator = 0, denominator = 1, color = '#3498db', size = 150, showLabel = true } = $props<{
		numerator?: number;
		denominator?: number;
		color?: string;
		size?: number;
		showLabel?: boolean;
	}>();

	// Fonction pour calculer le chemin SVG d'une tranche
	function getSlicePath(startAngle: number, endAngle: number, radius: number): string {
		const startX = radius + radius * Math.cos((Math.PI * startAngle) / 180);
		const startY = radius + radius * Math.sin((Math.PI * startAngle) / 180);
		const endX = radius + radius * Math.cos((Math.PI * endAngle) / 180);
		const endY = radius + radius * Math.sin((Math.PI * endAngle) / 180);
		
		const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
		
		return `M ${radius},${radius} L ${startX},${startY} A ${radius},${radius} 0 ${largeArcFlag} 1 ${endX},${endY} Z`;
	}

	let radius = $derived(size / 2);
	let sliceAngle = $derived(360 / denominator);
</script>

<div class="fraction-circle-container" style="width: {size}px; height: {size}px;">
	<svg width={size} height={size} viewBox="0 0 {size} {size}">
		<!-- Fond du cercle (unité vide) -->
		<circle cx={radius} cy={radius} r={radius} fill="white" stroke="#333" stroke-width="2" />
		
		<!-- Tranches remplies -->
		{#each Array(numerator) as _, i}
			<path 
				d={getSlicePath(i * sliceAngle, (i + 1) * sliceAngle, radius)} 
				fill={color} 
				stroke="#333" 
				stroke-width="1" 
			/>
		{/each}

		<!-- Lignes de séparation (pour toutes les parts) -->
		{#each Array(denominator) as _, i}
			<line 
				x1={radius} y1={radius} 
				x2={radius + radius * Math.cos((Math.PI * (i * sliceAngle)) / 180)} 
				y2={radius + radius * Math.sin((Math.PI * (i * sliceAngle)) / 180)} 
				stroke="#333" 
				stroke-width="1" 
			/>
		{/each}
	</svg>
	{#if showLabel}
		<div class="label">
			<Fraction numerator={numerator} denominator={denominator} />
		</div>
	{/if}
</div>

<style>
	.fraction-circle-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
		margin: 10px 0;
	}

	.label {
		font-weight: bold;
		font-family: monospace;
		font-size: 1.1rem;
		display: flex;
		justify-content: center;
	}
</style>
