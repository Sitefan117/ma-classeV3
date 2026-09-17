<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	let canvasContainer: HTMLDivElement;
	let gameState = $state<'MENU' | 'PLAYING' | 'REPLAY' | 'GAMEOVER'>('MENU');
	let score = $state(0);
	let lives = $state(3);
	let combo = $state(0);
	let targetQuestionText = $state('7 × 8');
	let feedbackBannerText = $state('7 × 8 = 56');
	let showFeedbackBanner = $state(false);

	// Options de configuration
	let notionLivrets = $state(true);
	let notionDoubles = $state(true);
	let notionComplements = $state(true);
	let notionQuadruples = $state(false);
	let notionTrous = $state(false);
	let formatType = $state<'A' | 'B'>('A');
	let gameMode = $state<'endless' | 'target'>('endless');

	let selectedNotions: string[] = [];
	const LANES = [-3.5, 0, 3.5];
	let currentLane = 1;
	let speed = 0.35;

	// Variables moteur Three.js
	let THREE: any;
	let scene: any;
	let camera: any;
	let renderer: any;
	let carGroup: any;
	let activeGates: any[] = [];
	let nextGateZ = -50;
	let animationFrameId: number;
	let currentQuestion: any = null;

	onMount(async () => {
		// Import dynamique de Three.js pour éviter les erreurs SSR
		THREE = await import('three');

		// Initialisation scène
		scene = new THREE.Scene();
		scene.fog = new THREE.FogExp2(0x0a0a1a, 0.015);

		camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
		camera.position.set(0, 18, 12);
		camera.lookAt(0, 0, -8);

		renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		renderer.shadowMap.enabled = true;
		canvasContainer.appendChild(renderer.domElement);

		// Lumières
		const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
		scene.add(ambientLight);

		const dirLight = new THREE.DirectionalLight(0x00f0ff, 0.8);
		dirLight.position.set(10, 20, 10);
		dirLight.castShadow = true;
		scene.add(dirLight);

		// Route
		const roadGroup = new THREE.Group();
		const roadGeo = new THREE.PlaneGeometry(12, 300);
		const roadMat = new THREE.MeshStandardMaterial({ color: 0x151522, roughness: 0.8 });
		const roadMesh = new THREE.Mesh(roadGeo, roadMat);
		roadMesh.rotation.x = -Math.PI / 2;
		roadMesh.position.z = -100;
		roadMesh.receiveShadow = true;
		roadGroup.add(roadMesh);

		for (let x of [-1.75, 1.75]) {
			const lineGeo = new THREE.PlaneGeometry(0.1, 300);
			const lineMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, opacity: 0.4, transparent: true });
			const lineMesh = new THREE.Mesh(lineGeo, lineMat);
			lineMesh.rotation.x = -Math.PI / 2;
			lineMesh.position.set(x, 0.01, -100);
			roadGroup.add(lineMesh);
		}
		scene.add(roadGroup);

		// Voiture
		carGroup = new THREE.Group();
		const bodyGeo = new THREE.BoxGeometry(1.6, 0.7, 2.8);
		const bodyMat = new THREE.MeshStandardMaterial({ color: 0xff0050, roughness: 0.2, metalness: 0.5 });
		const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
		bodyMesh.position.y = 0.5;
		bodyMesh.castShadow = true;
		carGroup.add(bodyMesh);

		const cabinGeo = new THREE.BoxGeometry(1.2, 0.5, 1.4);
		const cabinMat = new THREE.MeshStandardMaterial({ color: 0x00f0ff, roughness: 0.1 });
		const cabinMesh = new THREE.Mesh(cabinGeo, cabinMat);
		cabinMesh.position.set(0, 0.9, -0.2);
		carGroup.add(cabinMesh);

		carGroup.position.set(LANES[currentLane], 0, 0);
		scene.add(carGroup);

		// Gestion du redimensionnement
		const handleResize = () => {
			if (!camera || !renderer) return;
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(window.innerWidth, window.innerHeight);
		};
		window.addEventListener('resize', handleResize);

		// Boucle de rendu
		const animate = () => {
			animationFrameId = requestAnimationFrame(animate);

			if (gameState === 'PLAYING') {
				// Animation fluide de la voiture vers la voie cible
				carGroup.position.x += (LANES[currentLane] - carGroup.position.x) * 0.2;

				// Déplacement des portes
				for (let i = activeGates.length - 1; i >= 0; i--) {
					const gate = activeGates[i];
					gate.position.z += speed;

					// Collision
					if (!gate.userData.passed && gate.position.z >= carGroup.position.z - 1) {
						gate.userData.passed = true;
						checkCollision(gate);
					}

					// Nettoyage après passage
					if (gate.position.z > 10) {
						scene.remove(gate);
						activeGates.splice(i, 1);
					}
				}

				// Générer de nouvelles portes
				if (activeGates.length < 3) {
					spawnGateSet();
				}
			}

			renderer.render(scene, camera);
		};
		animate();

		return () => {
			window.removeEventListener('resize', handleResize);
			if (animationFrameId) cancelAnimationFrame(animationFrameId);
		};
	});

	function generateMathProblem() {
		const notion = selectedNotions[Math.floor(Math.random() * selectedNotions.length)] || 'livrets';
		let qText = '', correctAns = 0, distractors: number[] = [];

		if (notion === 'livrets') {
			let a = Math.floor(Math.random() * 10) + 3;
			let b = Math.floor(Math.random() * 9) + 2;
			correctAns = a * b;
			qText = `${a} × ${b}`;
			distractors = [correctAns + a, correctAns - b, (a + 1) * b, (a - 1) * b].filter((v) => v > 0 && v !== correctAns);
		} else if (notion === 'doubles') {
			let isDouble = Math.random() > 0.5;
			let val = Math.floor(Math.random() * 30) + 5;
			if (isDouble) {
				qText = `Double de ${val}`;
				correctAns = val * 2;
				distractors = [correctAns + 2, correctAns - 2, val * 3];
			} else {
				let evenVal = val * 2;
				qText = `Moitié de ${evenVal}`;
				correctAns = val;
				distractors = [val + 2, val - 1, val * 2];
			}
		} else if (notion === 'complements') {
			let target = Math.random() > 0.5 ? 100 : 10;
			let current = Math.floor(Math.random() * (target - 1)) + 1;
			qText = `Complément à ${target} de ${current}`;
			correctAns = target - current;
			distractors = [correctAns + 10, correctAns - 5, correctAns + 2].filter((v) => v > 0);
		} else {
			let a = 6, b = 7;
			correctAns = 42;
			qText = `6 × 7`;
			distractors = [36, 48, 40];
		}

		distractors = [...new Set(distractors)];
		while (distractors.length < 2) {
			let offset = (Math.floor(Math.random() * 5) + 1) * (Math.random() > 0.5 ? 1 : -1);
			let fake = correctAns + offset;
			if (fake > 0 && fake !== correctAns && !distractors.includes(fake)) distractors.push(fake);
		}

		const correctLaneIndex = Math.floor(Math.random() * 3);
		const gateValues = [];
		let distIdx = 0;

		for (let i = 0; i < 3; i++) {
			if (i === correctLaneIndex) {
				gateValues.push({ text: formatType === 'A' ? `${correctAns}` : qText, isCorrect: true });
			} else {
				let dVal = distractors[distIdx++];
				gateValues.push({ text: formatType === 'A' ? `${dVal}` : `${dVal} × 2`, isCorrect: false });
			}
		}

		return {
			questionText: formatType === 'A' ? qText : `Trouve : ${correctAns}`,
			fullFormula: `${qText} = ${correctAns}`,
			gates: gateValues
		};
	}

	function createGateTexture(text: string) {
		const canvas = document.createElement('canvas');
		canvas.width = 256;
		canvas.height = 256;
		const ctx = canvas.getContext('2d')!;

		ctx.fillStyle = '#101025';
		ctx.fillRect(0, 0, 256, 256);

		ctx.lineWidth = 12;
		ctx.strokeStyle = '#ffffff';
		ctx.strokeRect(6, 6, 244, 244);

		ctx.fillStyle = '#ffffff';
		ctx.font = 'Bold 42px Arial';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillText(text, 128, 128);

		return new THREE.CanvasTexture(canvas);
	}

	function spawnGateSet() {
		currentQuestion = generateMathProblem();
		targetQuestionText = currentQuestion.questionText;

		const gateGroup = new THREE.Group();
		gateGroup.position.z = nextGateZ;

		gateGroup.userData = { questionData: currentQuestion, passed: false };

		for (let i = 0; i < 3; i++) {
			const gData = currentQuestion.gates[i];
			const texture = createGateTexture(gData.text);
			const mat = new THREE.MeshStandardMaterial({ map: texture, roughness: 0.3 });
			const geo = new THREE.BoxGeometry(2.8, 3, 0.4);
			const mesh = new THREE.Mesh(geo, mat);
			mesh.position.set(LANES[i], 1.5, 0);
			mesh.userData = { isCorrect: gData.isCorrect, lane: i };
			gateGroup.add(mesh);
		}

		scene.add(gateGroup);
		activeGates.push(gateGroup);
		nextGateZ -= 45;
	}

	function checkCollision(gateGroup: any) {
		const chosenGate = gateGroup.children.find((g: any) => g.userData.lane === currentLane);
		if (chosenGate && chosenGate.userData.isCorrect) {
			score += 100 * (combo + 1);
			combo++;
		} else {
			lives--;
			combo = 0;
			feedbackBannerText = gateGroup.userData.questionData.fullFormula;
			showFeedbackBanner = true;
			setTimeout(() => { showFeedbackBanner = false; }, 1500);

			if (lives <= 0 && gameMode === 'endless') {
				gameState = 'GAMEOVER';
			}
		}
	}

	function moveLeft() {
		if (gameState === 'PLAYING' && currentLane > 0) currentLane--;
	}

	function moveRight() {
		if (gameState === 'PLAYING' && currentLane < 2) currentLane++;
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'q') moveLeft();
		if (e.key === 'ArrowRight' || e.key === 'd') moveRight();
	}

	function startGame() {
		selectedNotions = [];
		if (notionLivrets) selectedNotions.push('livrets');
		if (notionDoubles) selectedNotions.push('doubles');
		if (notionComplements) selectedNotions.push('complements');
		if (notionQuadruples) selectedNotions.push('quadruples');
		if (notionTrous) selectedNotions.push('trous');

		if (selectedNotions.length === 0) selectedNotions = ['livrets'];

		score = 0;
		lives = 3;
		combo = 0;
		currentLane = 1;
		nextGateZ = -50;

		// Vider les anciennes portes
		for (let g of activeGates) scene.remove(g);
		activeGates = [];

		gameState = 'PLAYING';
	}

	function showStartMenu() {
		gameState = 'MENU';
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="game-wrapper">
	<div bind:this={canvasContainer} id="canvas-container"></div>

	<!-- Touch zones pour mobile/iPad -->
	<div id="touch-controls">
		<button type="button" class="touch-zone" aria-label="Déplacer à gauche" onclick={moveLeft}></button>
		<button type="button" class="touch-zone" aria-label="Déplacer à droite" onclick={moveRight}></button>
	</div>

	<div id="hud">
		<div class="top-bar">
			<div class="stat-box">
				<div>VIES</div>
				<div style="color: #ff0050;">{'❤️'.repeat(Math.max(0, lives))}</div>
			</div>

			<div id="target-box">
				<div id="target-label">Calcul Cible</div>
				<div id="target-question">{targetQuestionText}</div>
			</div>

			<div class="stat-box">
				<div>SCORE</div>
				<div style="color: #00f0ff;">{score}</div>
				<div id="combo-container">
					<span style="font-size: 0.8rem;">x{combo + 1}</span>
				</div>
			</div>
		</div>
	</div>

	{#if showFeedbackBanner}
		<div id="feedback-banner">
			<h2>Dommage !</h2>
			<p>{feedbackBannerText}</p>
		</div>
	{/if}

	<!-- Modal de départ -->
	{#if gameState === 'MENU'}
		<div class="modal">
			<h1>Math Racer 3D</h1>

			<div class="config-group">
				<h3>1. Choisir les notions :</h3>
				<div class="checkbox-grid">
					<label><input type="checkbox" bind:checked={notionLivrets} /> Livrets (1 à 12)</label>
					<label><input type="checkbox" bind:checked={notionDoubles} /> Doubles / Triples / Moitiés</label>
					<label><input type="checkbox" bind:checked={notionComplements} /> Compléments (10, 100)</label>
					<label><input type="checkbox" bind:checked={notionQuadruples} /> Quadruples / Quarts</label>
					<label><input type="checkbox" bind:checked={notionTrous} /> Opérations à trous</label>
				</div>
			</div>

			<div class="config-group">
				<h3>2. Format d'affichage :</h3>
				<div class="checkbox-grid">
					<label><input type="radio" bind:group={formatType} value="A" /> Calcul en haut ➔ Voies</label>
					<label><input type="radio" bind:group={formatType} value="B" /> Cible ➔ Voies</label>
				</div>
			</div>

			<div class="config-group">
				<h3>3. Mode de Jeu :</h3>
				<div class="checkbox-grid">
					<label><input type="radio" bind:group={gameMode} value="endless" /> Course Infinie (3 Vies)</label>
					<label><input type="radio" bind:group={gameMode} value="target" /> Sprint (20 Réponses)</label>
				</div>
			</div>

			<button type="button" class="modal-btn" onclick={startGame}>C'EST PARTI !</button>
		</div>
	{/if}

	<!-- Game Over -->
	{#if gameState === 'GAMEOVER'}
		<div class="modal">
			<h1>FIN DE COURSE</h1>
			<p style="font-size: 1.5rem;">Score : {score}</p>
			<button type="button" class="modal-btn" onclick={showStartMenu}>REJOUER</button>
		</div>
	{/if}
</div>

<style>
	:global(body, html) {
		width: 100%;
		height: 100%;
		overflow: hidden;
		margin: 0;
		padding: 0;
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
		background-color: #111;
		color: #fff;
	}

	.game-wrapper {
		width: 100vw;
		height: 100vh;
		position: relative;
		overflow: hidden;
	}

	#canvas-container {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		z-index: 1;
	}

	#hud {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 10;
		pointer-events: none;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: 20px;
		box-sizing: border-box;
	}

	.top-bar {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
	}

	.stat-box {
		background: rgba(0, 0, 0, 0.6);
		backdrop-filter: blur(5px);
		border: 2px solid #fff;
		border-radius: 12px;
		padding: 10px 20px;
		text-align: center;
		font-size: 1.2rem;
		font-weight: bold;
	}

	#target-box {
		background: rgba(20, 20, 40, 0.85);
		border: 3px solid #00f0ff;
		border-radius: 16px;
		padding: 15px 30px;
		text-align: center;
		box-shadow: 0 0 20px rgba(0, 240, 255, 0.4);
	}

	#target-label {
		font-size: 0.9rem;
		text-transform: uppercase;
		color: #00f0ff;
		letter-spacing: 2px;
	}

	#target-question {
		font-size: 2.5rem;
		font-weight: 900;
		color: #fff;
		text-shadow: 0 0 10px #00f0ff;
	}

	#combo-container {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		margin-top: 5px;
	}

	.modal {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 100;
		background: rgba(0, 0, 0, 0.85);
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 20px;
		pointer-events: auto;
	}

	.modal h1 {
		font-size: 3rem;
		color: #00f0ff;
		text-transform: uppercase;
		text-shadow: 0 0 15px #00f0ff;
		text-align: center;
	}

	.modal-btn {
		background: linear-gradient(135deg, #00f0ff, #7000ff);
		border: none;
		padding: 15px 40px;
		border-radius: 30px;
		color: #fff;
		font-size: 1.5rem;
		font-weight: bold;
		cursor: pointer;
		transition: transform 0.2s, box-shadow 0.2s;
		box-shadow: 0 0 15px rgba(0, 240, 255, 0.5);
	}

	.modal-btn:hover {
		transform: scale(1.05);
		box-shadow: 0 0 25px rgba(0, 240, 255, 0.8);
	}

	.config-group {
		background: rgba(255, 255, 255, 0.05);
		padding: 15px;
		border-radius: 12px;
		width: 90%;
		max-width: 500px;
		display: flex;
		flex-direction: column;
		gap: 10px;
		border: 1px solid rgba(255, 255, 255, 0.1);
	}

	.config-group h3 {
		color: #00f0ff;
		font-size: 1.1rem;
	}

	.checkbox-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 10px;
		font-size: 0.9rem;
	}

	.checkbox-grid label {
		display: flex;
		align-items: center;
		gap: 8px;
		cursor: pointer;
	}

	#feedback-banner {
		position: absolute;
		top: 35%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 50;
		background: rgba(255, 0, 80, 0.9);
		border: 3px solid #fff;
		border-radius: 16px;
		padding: 20px 40px;
		text-align: center;
		box-shadow: 0 0 30px #ff0050;
	}

	#feedback-banner h2 {
		font-size: 1.8rem;
		text-transform: uppercase;
		margin-bottom: 5px;
	}

	#feedback-banner p {
		font-size: 2.2rem;
		font-weight: bold;
		color: #fff;
	}

	#touch-controls {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 5;
		display: flex;
		pointer-events: auto;
	}

	.touch-zone {
		flex: 1;
		height: 100%;
		background: transparent;
		border: none;
		cursor: pointer;
	}
</style>