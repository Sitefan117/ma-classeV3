<script lang="ts">
	// -----------------------------------------------------------------------------
	// COMPOSANT MODAL D'ACTIVITÉ
	// -----------------------------------------------------------------------------

	import IntroCourse from '$lib/fractionstower2/components/course/IntroCourse.svelte';
	import TrainingSession from '$lib/fractionstower2/components/exercises/TrainingSession.svelte';
	import BossFloor1 from '$lib/fractionstower2/components/exercises/BossFloor1.svelte';

	let { activityId, onClose, game } = $props<{
		activityId: string;
		onClose: () => void;
		game: any;
	}>();

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			onClose();
		}
	}
</script>

<svelte:window onkeydown={handleKeyDown} />

<div class="modal-backdrop">
	<div class="modal-content">
		<div class="header">
			<h2 style="margin: 0; font-size: 1.5rem;">
				{#if activityId === 'course-intro' || activityId === 'mission-course'}
					Le Cours : Les Bases
				{:else if activityId === 'training-intro' || activityId === 'mission-training'}
					Entraînement : Lecture
				{:else if activityId === 'boss-intro' || activityId === 'mission-boss'}
					Le Défi du Boss
				{:else}
					Activité : {activityId}
				{/if}
			</h2>
			<button class="close-btn" onclick={onClose}>✕</button>
		</div>

		<div class="body">
			{#if activityId === 'course-intro' || activityId === 'mission-course'}
				<IntroCourse onComplete={onClose} />
			{:else if activityId === 'training-intro' || activityId === 'mission-training'}
				<TrainingSession onComplete={onClose} {game} />
			{:else if activityId === 'boss-intro' || activityId === 'mission-boss'}
				<BossFloor1 onComplete={onClose} {game} />
			{:else}
				<div class="fallback">
					<p>L'activité "{activityId}" est en cours de développement.</p>
					<button class="action-btn" onclick={onClose}>Retour</button>
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	.modal-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background: rgba(0, 0, 0, 0.85);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1000;
		backdrop-filter: blur(4px);
	}

	.modal-content {
		background: #f9f9f9;
		width: 90%;
		max-width: 700px;
		border-radius: 16px;
		overflow: hidden;
		box-shadow: 0 20px 40px rgba(0,0,0,0.4);
		display: flex;
		flex-direction: column;
	}

	.header {
		background: #3498db;
		color: white;
		padding: 20px;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.close-btn {
		background: transparent;
		border: none;
		color: white;
		font-size: 1.5rem;
		cursor: pointer;
		opacity: 0.7;
	}

	.close-btn:hover {
		opacity: 1;
	}

	.body {
		padding: 20px;
		min-height: 450px;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.fallback {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 20px;
		text-align: center;
		font-family: sans-serif;
	}

	.action-btn {
		padding: 10px 20px;
		background: #3498db;
		color: white;
		border: none;
		border-radius: 8px;
		cursor: pointer;
	}
</style>
