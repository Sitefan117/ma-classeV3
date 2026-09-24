<script lang="ts">
	import { onMount } from 'svelte';
	import { clearStudentName, getStudentName, storeStudentName } from '$lib/client/activity';
	import { worlds } from '$lib/worlds';

	let ready = false;
	let studentName = '';
	let nameInput = '';
	let selectedCategory = 'TOUS';

	const categories = ['TOUS', 'MATHS', 'FRANÇAIS', 'SCIENCES', 'AUTRES'];

	onMount(() => {
		const stored = getStudentName('');
		studentName = stored;
		nameInput = stored;
		ready = true;
	});

	function login() {
		const nextName = nameInput.trim();
		if (nextName.length < 2) return;
		studentName = nextName;
		storeStudentName(nextName);
	}

	function logout() {
		clearStudentName();
		studentName = '';
		nameInput = '';
	}

	function routeFor(route: string): string {
		return `${route}?eleve=${encodeURIComponent(studentName)}`;
	}

	// Détection temporaire locale basée sur le titre et le sous-titre
	function getCategory(world: { title: string; subtitle: string }): string {
		const text = `${world.title} ${world.subtitle}`.toLowerCase();
		if (text.includes('math') || text.includes('calcul') || text.includes('géométrie') || text.includes('nombre') || text.includes('fractions')) {
			return 'MATHS';
		}
		if (text.includes('français') || text.includes('grammaire') || text.includes('conjugaison') || text.includes('orthographe') || text.includes('lecture') || text.includes('verbe') || text.includes('conju')) {
			return 'FRANÇAIS';
		}
		if (text.includes('science') || text.includes('physique') || text.includes('chimie') || text.includes('svt') || text.includes('espace') || text.includes('nature') || text.includes('atome')) {
			return 'SCIENCES';
		}
		return 'AUTRES';
	}

	$: filteredWorlds = worlds.filter((world) => {
		if (selectedCategory === 'TOUS') return true;
		return getCategory(world) === selectedCategory;
	});
</script>

<svelte:head>
	<title>LEARNING HUB — QG Gaming</title>
	<meta name="description" content="Learning Hub : Launcher de jeux éducatifs interactifs." />
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">
	<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
</svelte:head>

<!-- FOND VIVANT GAMING -->
<div class="bg-container" aria-hidden="true">
	<div class="bg-grid"></div>
	<div class="glow halo-cyan"></div>
	<div class="glow halo-purple"></div>
	<div class="glow halo-green"></div>
</div>

<div class="hub-wrapper">
	<!-- HEADER STICKY PLATFORME GAMING -->
	<header class="hub-header">
		<div class="header-inner">
			<div class="brand">
				<span class="brand-bolt">⚡</span>
				<div class="brand-text">
					<h1 class="brand-title">LEARNING HUB</h1>
					<p class="brand-subtitle">Ton espace pour apprendre en mode jeu</p>
				</div>
			</div>

			<div class="header-actions">
				{#if studentName}
					<div class="profile-badge">
						<span class="profile-label">PROFIL ÉLÈVE</span>
						<span class="profile-name">{studentName}</span>
					</div>
				{/if}
				<a class="btn-teacher" href="/teacher">
					<span class="icon">⚙</span> Espace enseignant
				</a>
			</div>
		</div>
	</header>

	<main class="hub-main">
		{#if !ready}
			<div class="loading-box">
				<div class="spinner"></div>
				<p>INITIALISATION DU HUB...</p>
			</div>
		{:else if !studentName}
			<!-- ÉCRAN DE CONNEXION ÉLÈVE -->
			<section class="login-wrapper">
				<div class="login-card">
					<div class="login-badge">ACCÈS JOUEUR</div>
					<div class="avatar-portal">🎮</div>
					<h2>Bienvenue sur le <span class="gradient-text">Learning Hub</span></h2>
					<p class="login-desc">Inscris ton prénom pour débloquer tes accès et accéder à tes défis.</p>

					<form on:submit|preventDefault={login} class="login-form">
						<div class="input-group">
							<label for="student-name-input">Identifiant Joueur</label>
							<input
								id="student-name-input"
								class="gaming-input"
								bind:value={nameInput}
								required
								minlength="2"
								placeholder="Ex: Lucas, Léa..."
								autocomplete="off"
							/>
						</div>
						<button class="btn-primary-gaming" type="submit">
							LANCER LE HUB <span class="btn-arrow">➔</span>
						</button>
					</form>
				</div>
			</section>
		{:else}
			<!-- DASHBOARD ET ACCUEIL -->
			<section class="welcome-hero">
				<div class="hero-content">
					<div class="hero-tag">QG • CENTRE D'APPRENTISSAGE</div>
					<h2 class="hero-title">
						Choisis ton <span class="gradient-text">prochain défi.</span>
					</h2>
					<p class="hero-subtitle">
						Salut <strong class="player-highlight">{studentName}</strong> ! Explore les jeux, relève les défis et construis ta progression.
					</p>
				</div>

				<button class="btn-logout" type="button" on:click={logout} title="Se déconnecter">
					<span class="logout-icon">🔄</span> Changer de compte
				</button>
			</section>

			<!-- PROGRESSION DU HUB (Architecture ready pour XP, Badges, etc.) -->
			<section class="progression-block">
				<div class="progression-header">
					<div class="progression-title">
						<span class="prog-icon">📊</span>
						<h3>PROGRESSION DU HUB</h3>
					</div>
					<span class="badge-wip">EN PRÉPARATION</span>
				</div>

				<div class="progression-body">
					<div class="xp-bar-container">
						<div class="xp-bar-fill" style="width: 25%;"></div>
					</div>
					<div class="progression-stats">
						<div class="stat-pill">
							<span class="stat-label">NIVEAU</span>
							<span class="stat-val">1</span>
						</div>
						<div class="stat-pill">
							<span class="stat-label">XP TOTAL</span>
							<span class="stat-val">--- / ---</span>
						</div>
						<div class="stat-pill">
							<span class="stat-label">BADGES</span>
							<span class="stat-val">🔒 VERROUILLÉ</span>
						</div>
						<div class="stat-pill">
							<span class="stat-label">STATUT</span>
							<span class="stat-val status-active">PRÊT</span>
						</div>
					</div>
				</div>
			</section>

			<!-- BIBLIOTHÈQUE DE JEUX DATA-DRIVEN -->
			<section class="library-section">
				<div class="library-header">
					<div>
						<h2 class="library-title">TA BIBLIOTHÈQUE</h2>
						<p class="library-subtitle">Les défis disponibles</p>
					</div>

					<!-- FILTRES -->
					<div class="filters-bar" role="tablist">
						{#each categories as cat}
							<button
								class="filter-chip"
								class:active={selectedCategory === cat}
								type="button"
								role="tab"
								aria-selected={selectedCategory === cat}
								on:click={() => (selectedCategory = cat)}
							>
								{cat}
							</button>
						{/each}
					</div>
				</div>

				<!-- TUILES/CARTES DES JEUX -->
				{#if filteredWorlds.length === 0}
					<div class="empty-state">
						<p>Aucun défi disponible dans cette catégorie pour le moment.</p>
					</div>
				{:else}
					<div class="grid-games">
						{#each filteredWorlds as world}
							{@const category = getCategory(world)}
							<article class="game-card" data-category={category}>
								<div class="card-inner">
									<div class="card-top">
										<div class="card-icon">{world.emoji}</div>
										<div class="card-tags">
											<span class="cat-tag {category.toLowerCase()}">{category}</span>
											<span class="status-tag available">AVAILABLE</span>
										</div>
									</div>

									<div class="card-body">
										<h3 class="game-title">{world.title}</h3>
										<p class="game-desc">{world.subtitle}</p>
									</div>

									<div class="card-footer">
										<div class="card-info-strip">
											<span class="info-item">
												<span class="dot-green"></span> ACTIVITÉ
											</span>
											<span class="info-item ready-text">PRÊT À JOUER</span>
										</div>

										<a class="btn-play" href={routeFor(world.route)}>
											<span>JOUER</span>
											<span class="play-arrow">➔</span>
										</a>
									</div>
								</div>
							</article>
						{/each}
					</div>
				{/if}
			</section>
		{/if}
	</main>

	<footer class="hub-footer">
		<p>© 2026 LEARNING HUB — Système de launcher de jeux éducatifs</p>
	</footer>
</div>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		background-color: #060913;
		color: #f1f5f9;
		font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
		overflow-x: hidden;
	}

	:global(h1, h2, h3, h4) {
		font-family: 'Outfit', sans-serif;
	}

	/* FOND AMBIANT */
	.bg-container {
		position: fixed;
		inset: 0;
		z-index: 0;
		pointer-events: none;
		overflow: hidden;
		background: #060913;
	}

	.bg-grid {
		position: absolute;
		inset: 0;
		background-image: 
			linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
			linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
		background-size: 40px 40px;
	}

	.glow {
		position: absolute;
		border-radius: 50%;
		filter: blur(120px);
		opacity: 0.35;
		animation: floatGlow 18s ease-in-out infinite alternate;
	}

	.halo-cyan {
		width: 500px;
		height: 500px;
		background: #06b6d4;
		top: -100px;
		left: -100px;
	}

	.halo-purple {
		width: 600px;
		height: 600px;
		background: #8b5cf6;
		bottom: -150px;
		right: -100px;
		animation-delay: -6s;
	}

	.halo-green {
		width: 400px;
		height: 400px;
		background: #10b981;
		top: 40%;
		left: 50%;
		transform: translate(-50%, -50%);
		opacity: 0.15;
		animation-delay: -12s;
	}

	@keyframes floatGlow {
		0% { transform: translate(0, 0) scale(1); }
		100% { transform: translate(40px, 30px) scale(1.1); }
	}

	@media (prefers-reduced-motion: reduce) {
		.glow {
			animation: none;
		}
	}

	/* WRAPPER ET HEADER */
	.hub-wrapper {
		position: relative;
		z-index: 1;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	.hub-header {
		position: sticky;
		top: 0;
		z-index: 100;
		background: rgba(10, 15, 30, 0.75);
		backdrop-filter: blur(16px);
		-webkit-backdrop-filter: blur(16px);
		border-bottom: 1px solid rgba(255, 255, 255, 0.08);
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
	}

	.header-inner {
		max-width: 1280px;
		margin: 0 auto;
		padding: 0.85rem 1.5rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.brand {
		display: flex;
		align-items: center;
		gap: 0.85rem;
	}

	.brand-bolt {
		font-size: 1.8rem;
		background: linear-gradient(135deg, #38bdf8, #a855f7);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		filter: drop-shadow(0 0 8px rgba(56, 189, 248, 0.5));
	}

	.brand-title {
		margin: 0;
		font-size: 1.35rem;
		font-weight: 900;
		letter-spacing: 1.5px;
		background: linear-gradient(90deg, #ffffff, #cbd5e1);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.brand-subtitle {
		margin: 0;
		font-size: 0.78rem;
		color: #94a3b8;
	}

	.header-actions {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.profile-badge {
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 8px;
		padding: 0.35rem 0.85rem;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
	}

	.profile-label {
		font-size: 0.62rem;
		font-weight: 700;
		color: #38bdf8;
		letter-spacing: 1px;
	}

	.profile-name {
		font-size: 0.95rem;
		font-weight: 700;
		color: #f8fafc;
	}

	.btn-teacher {
		color: #cbd5e1;
		text-decoration: none;
		font-size: 0.85rem;
		font-weight: 600;
		padding: 0.5rem 0.9rem;
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.04);
		border: 1px solid rgba(255, 255, 255, 0.08);
		transition: all 0.2s ease;
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
	}

	.btn-teacher:hover {
		background: rgba(255, 255, 255, 0.1);
		color: #ffffff;
		border-color: rgba(255, 255, 255, 0.2);
		transform: translateY(-1px);
	}

	/* CONTAINER PRINCIPAL */
	.hub-main {
		max-width: 1280px;
		margin: 0 auto;
		width: 100%;
		box-sizing: border-box;
		padding: 2rem 1.5rem;
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.loading-box {
		text-align: center;
		padding: 5rem 1rem;
		color: #94a3b8;
		font-weight: 600;
		letter-spacing: 1px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
	}

	.spinner {
		width: 40px;
		height: 40px;
		border: 3px solid rgba(56, 189, 248, 0.1);
		border-top-color: #38bdf8;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		to { transform: rotate(360deg); }
	}

	/* CONNEXION */
	.login-wrapper {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 3rem 0;
	}

	.login-card {
		background: rgba(15, 23, 42, 0.75);
		border: 1px solid rgba(56, 189, 248, 0.2);
		box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1);
		backdrop-filter: blur(12px);
		border-radius: 20px;
		padding: 2.5rem;
		max-width: 440px;
		width: 100%;
		text-align: center;
	}

	.login-badge {
		display: inline-block;
		font-size: 0.68rem;
		font-weight: 800;
		letter-spacing: 1.5px;
		color: #38bdf8;
		background: rgba(56, 189, 248, 0.1);
		border: 1px solid rgba(56, 189, 248, 0.3);
		padding: 0.25rem 0.75rem;
		border-radius: 20px;
		margin-bottom: 1.25rem;
	}

	.avatar-portal {
		font-size: 3rem;
		margin-bottom: 0.75rem;
		filter: drop-shadow(0 0 15px rgba(168, 85, 247, 0.5));
	}

	.login-card h2 {
		margin: 0 0 0.5rem;
		font-size: 1.75rem;
		font-weight: 800;
	}

	.login-desc {
		color: #94a3b8;
		font-size: 0.9rem;
		margin: 0 0 1.75rem;
		line-height: 1.5;
	}

	.login-form {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		text-align: left;
	}

	.input-group label {
		display: block;
		font-size: 0.75rem;
		font-weight: 700;
		color: #cbd5e1;
		margin-bottom: 0.4rem;
		letter-spacing: 0.5px;
		text-transform: uppercase;
	}

	.gaming-input {
		width: 100%;
		box-sizing: border-box;
		background: rgba(6, 9, 19, 0.8);
		border: 1px solid rgba(255, 255, 255, 0.15);
		border-radius: 10px;
		padding: 0.85rem 1rem;
		color: #ffffff;
		font-size: 1rem;
		outline: none;
		transition: all 0.2s ease;
	}

	.gaming-input:focus {
		border-color: #38bdf8;
		box-shadow: 0 0 15px rgba(56, 189, 248, 0.3);
		background: rgba(6, 9, 19, 0.95);
	}

	.btn-primary-gaming {
		background: linear-gradient(135deg, #2563eb, #7c3aed);
		color: #ffffff;
		border: none;
		border-radius: 10px;
		padding: 0.9rem 1.5rem;
		font-size: 0.95rem;
		font-weight: 800;
		letter-spacing: 1px;
		cursor: pointer;
		transition: all 0.25s ease;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		box-shadow: 0 4px 15px rgba(37, 99, 235, 0.4);
	}

	.btn-primary-gaming:hover {
		transform: translateY(-2px);
		box-shadow: 0 6px 20px rgba(124, 58, 237, 0.6);
		background: linear-gradient(135deg, #1d4ed8, #6d28d9);
	}

	/* HERO BANNER */
	.welcome-hero {
		background: linear-gradient(135deg, rgba(30, 41, 59, 0.5), rgba(15, 23, 42, 0.8));
		border: 1px solid rgba(255, 255, 255, 0.08);
		border-radius: 16px;
		padding: 1.75rem 2rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1.5rem;
		backdrop-filter: blur(10px);
	}

	.hero-tag {
		font-size: 0.68rem;
		font-weight: 800;
		letter-spacing: 1.5px;
		color: #38bdf8;
		margin-bottom: 0.35rem;
	}

	.hero-title {
		margin: 0;
		font-size: 2rem;
		font-weight: 800;
		line-height: 1.2;
	}

	.gradient-text {
		background: linear-gradient(90deg, #38bdf8, #ffffff, #c084fc);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.hero-subtitle {
		margin: 0.4rem 0 0;
		color: #94a3b8;
		font-size: 0.95rem;
	}

	.player-highlight {
		color: #f1f5f9;
		font-weight: 700;
	}

	.btn-logout {
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.1);
		color: #cbd5e1;
		border-radius: 10px;
		padding: 0.6rem 1rem;
		font-size: 0.82rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s ease;
		white-space: nowrap;
		display: flex;
		align-items: center;
		gap: 0.4rem;
	}

	.btn-logout:hover {
		background: rgba(239, 68, 68, 0.15);
		border-color: rgba(239, 68, 68, 0.3);
		color: #fca5a5;
	}

	/* BLOC PROGRESSION */
	.progression-block {
		background: rgba(15, 23, 42, 0.6);
		border: 1px solid rgba(255, 255, 255, 0.08);
		border-radius: 16px;
		padding: 1.25rem 1.5rem;
	}

	.progression-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 1rem;
	}

	.progression-title {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.progression-title h3 {
		margin: 0;
		font-size: 0.95rem;
		font-weight: 800;
		letter-spacing: 1px;
		color: #e2e8f0;
	}

	.badge-wip {
		font-size: 0.65rem;
		font-weight: 800;
		letter-spacing: 1px;
		color: #f59e0b;
		background: rgba(245, 158, 11, 0.1);
		border: 1px solid rgba(245, 158, 11, 0.3);
		padding: 0.2rem 0.6rem;
		border-radius: 12px;
	}

	.xp-bar-container {
		height: 8px;
		background: rgba(255, 255, 255, 0.06);
		border-radius: 10px;
		overflow: hidden;
		margin-bottom: 1rem;
	}

	.xp-bar-fill {
		height: 100%;
		background: linear-gradient(90deg, #38bdf8, #8b5cf6);
		border-radius: 10px;
	}

	.progression-stats {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
		gap: 0.75rem;
	}

	.stat-pill {
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid rgba(255, 255, 255, 0.05);
		border-radius: 8px;
		padding: 0.5rem 0.75rem;
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
	}

	.stat-label {
		font-size: 0.62rem;
		font-weight: 700;
		color: #64748b;
		letter-spacing: 0.5px;
	}

	.stat-val {
		font-size: 0.85rem;
		font-weight: 700;
		color: #cbd5e1;
	}

	.status-active {
		color: #10b981;
	}

	/* BIBLIOTHÈQUE & FILTRES */
	.library-header {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 1rem;
		margin-bottom: 1.25rem;
	}

	.library-title {
		margin: 0;
		font-size: 1.4rem;
		font-weight: 800;
		letter-spacing: 1px;
	}

	.library-subtitle {
		margin: 0.2rem 0 0;
		font-size: 0.85rem;
		color: #94a3b8;
	}

	.filters-bar {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.filter-chip {
		background: rgba(255, 255, 255, 0.04);
		border: 1px solid rgba(255, 255, 255, 0.08);
		color: #94a3b8;
		padding: 0.4rem 0.85rem;
		border-radius: 8px;
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.5px;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.filter-chip:hover {
		background: rgba(255, 255, 255, 0.08);
		color: #f1f5f9;
	}

	.filter-chip.active {
		background: rgba(56, 189, 248, 0.15);
		border-color: rgba(56, 189, 248, 0.4);
		color: #38bdf8;
		box-shadow: 0 0 10px rgba(56, 189, 248, 0.2);
	}

	.empty-state {
		text-align: center;
		padding: 3rem 1rem;
		color: #64748b;
		background: rgba(15, 23, 42, 0.4);
		border-radius: 16px;
		border: 1px dashed rgba(255, 255, 255, 0.1);
	}

	/* CARTES DES JEUX ET GRILLE RESPONSIVE */
	.grid-games {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1.25rem;
	}

	@media (max-width: 1024px) {
		.grid-games {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 640px) {
		.grid-games {
			grid-template-columns: 1fr;
		}

		.welcome-hero {
			flex-direction: column;
			align-items: flex-start;
		}

		.header-inner {
			padding: 0.75rem 1rem;
		}

		.brand-subtitle {
			display: none;
		}
	}

	.game-card {
		position: relative;
		background: rgba(15, 23, 42, 0.75);
		border: 1px solid rgba(255, 255, 255, 0.08);
		border-radius: 16px;
		overflow: hidden;
		transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.25s ease, box-shadow 0.25s ease;
		backdrop-filter: blur(8px);
		display: flex;
		flex-direction: column;
	}

	.card-inner {
		padding: 1.35rem;
		display: flex;
		flex-direction: column;
		height: 100%;
		box-sizing: border-box;
		position: relative;
		z-index: 2;
	}

	.card-top {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		margin-bottom: 1rem;
	}

	.card-icon {
		font-size: 2.5rem;
		line-height: 1;
		transition: transform 0.25s ease;
		filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
	}

	.card-tags {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 0.3rem;
	}

	.cat-tag {
		font-size: 0.6rem;
		font-weight: 800;
		letter-spacing: 0.8px;
		padding: 0.2rem 0.5rem;
		border-radius: 4px;
		text-transform: uppercase;
		background: rgba(255, 255, 255, 0.08);
		color: #cbd5e1;
	}

	.cat-tag.maths {
		background: rgba(56, 189, 248, 0.15);
		color: #38bdf8;
		border: 1px solid rgba(56, 189, 248, 0.3);
	}

	.cat-tag.français {
		background: rgba(236, 72, 153, 0.15);
		color: #f472b6;
		border: 1px solid rgba(236, 72, 153, 0.3);
	}

	.cat-tag.sciences {
		background: rgba(16, 185, 129, 0.15);
		color: #34d399;
		border: 1px solid rgba(16, 185, 129, 0.3);
	}

	.status-tag {
		font-size: 0.58rem;
		font-weight: 800;
		letter-spacing: 0.5px;
		padding: 0.15rem 0.4rem;
		border-radius: 4px;
		opacity: 0.7;
	}

	.status-tag.available {
		background: rgba(255, 255, 255, 0.05);
		color: #94a3b8;
	}

	.card-body {
		flex: 1;
		margin-bottom: 1.25rem;
	}

	.game-title {
		margin: 0 0 0.4rem;
		font-size: 1.2rem;
		font-weight: 800;
		color: #f8fafc;
		line-height: 1.3;
	}

	.game-desc {
		margin: 0;
		font-size: 0.85rem;
		color: #94a3b8;
		line-height: 1.45;
	}

	.card-footer {
		display: flex;
		flex-direction: column;
		gap: 0.85rem;
		margin-top: auto;
	}

	.card-info-strip {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 0.7rem;
		font-weight: 700;
		color: #64748b;
		padding-top: 0.75rem;
		border-top: 1px solid rgba(255, 255, 255, 0.05);
	}

	.info-item {
		display: flex;
		align-items: center;
		gap: 0.35rem;
	}

	.dot-green {
		width: 6px;
		height: 6px;
		background: #10b981;
		border-radius: 50%;
		box-shadow: 0 0 6px #10b981;
	}

	.ready-text {
		color: #10b981;
		letter-spacing: 0.5px;
	}

	.btn-play {
		text-decoration: none;
		background: linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.03));
		border: 1px solid rgba(255, 255, 255, 0.12);
		color: #f1f5f9;
		padding: 0.75rem 1rem;
		border-radius: 10px;
		font-size: 0.85rem;
		font-weight: 800;
		letter-spacing: 1px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		transition: all 0.25s ease;
	}

	/* EFFETS HOVER */
	@media (hover: hover) {
		.game-card:hover {
			transform: translateY(-6px) scale(1.02);
			border-color: rgba(56, 189, 248, 0.4);
			box-shadow: 0 12px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(56, 189, 248, 0.2);
		}

		.game-card:hover .card-icon {
			transform: scale(1.1) rotate(-3deg);
		}

		.game-card:hover .btn-play {
			background: linear-gradient(135deg, #0284c7, #7c3aed);
			border-color: transparent;
			color: #ffffff;
			box-shadow: 0 4px 15px rgba(2, 132, 199, 0.4);
		}

		.game-card:hover .play-arrow {
			transform: translateX(4px);
		}
	}

	.play-arrow {
		transition: transform 0.2s ease;
	}

	/* TACTILE & FOOTER */
	.game-card:active {
		transform: scale(0.98);
	}

	.btn-play:active {
		background: rgba(56, 189, 248, 0.3);
	}

	.hub-footer {
		text-align: center;
		padding: 2rem 1.5rem;
		font-size: 0.75rem;
		color: #475569;
		border-top: 1px solid rgba(255, 255, 255, 0.05);
		margin-top: auto;
	}
</style>
