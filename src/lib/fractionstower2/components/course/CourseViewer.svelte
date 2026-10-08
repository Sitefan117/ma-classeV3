<script lang="ts">
	import { onMount } from 'svelte';
	import { languageState } from '$lib/fractionstower2/persistence/LanguageManager';

	let { floorId, onClose } = $props<{
		floorId: string,
		onClose: () => void
	}>();

	const courseContent: Record<string, { title: { fr: string, ru: string }, content: string }> = {
		'floor-1': {
			title: { fr: 'Module 1 : Introduction aux Fractions', ru: 'Модуль 1: Введение в дроби' },
			content: `
				<div class="bloc-theorie">
					<h2 class="print-title">Théorie / Теория</h2>
					<p>Une <strong class="mot-cle-vert">fraction</strong> représente une partie d'un tout partagé en parts égales.</p>
					<p><i class="consigne-ru">Дробь представляет собой часть целого, разделенного на равные части.</i></p>
					<div class="fraction-display">
						<div class="num"><span class="mot-cle-bleu">Numérateur (числитель)</span> : Nombre de parts choisies</div>
						<div class="line"></div>
						<div class="den"><span class="mot-cle-vert">Dénominateur (знаменатель)</span> : Nombre total de parts égales</div>
					</div>
				</div>
				<div class="bloc-exemple">
					<h2 class="print-title">Exemple / Пример</h2>
					<p>Si une pizza est coupée en 4 parts égales et que vous mangez 3 parts, vous avez mangé 3/4 de la pizza.</p>
					<p><i class="consigne-ru">Если пицца разрезана на 4 равные части и вы съели 3 части, вы съели 3/4 пиццы.</i></p>
				</div>
			`
		},
		'floor-2': {
			title: { fr: 'Module 2 : La Droite Graduée', ru: 'Модуль 2: Числовая прямая' },
			content: `
				<div class="bloc-theorie">
					<h2 class="print-title">Théorie / Теория</h2>
					<p>On peut représenter une fraction sur une droite graduée en divisant l'unité (entre 0 et 1) en parts égales selon le dénominateur.</p>
					<p><i class="consigne-ru">Дробь можно представить на числовой прямой, разделив единицу (от 0 до 1) на равные части в соответствии со знаменателем.</i></p>
				</div>
				<div class="bloc-exemple">
					<h2 class="print-title">Exemple / Пример</h2>
					<p>Pour placer 1/2, on coupe la distance entre 0 et 1 en deux parts égales et on prend la première marque.</p>
					<p><i class="consigne-ru">Чтобы отметить 1/2, нужно разделить расстояние от 0 до 1 пополам и поставить отметку на первой части.</i></p>
				</div>
			`
		},
		'floor-3': {
			title: { fr: 'Module 3 : Surfaces et Aires', ru: 'Модуль 3: Площади и поверхности' },
			content: `
				<div class="bloc-theorie">
					<h2 class="print-title">Théorie / Теория</h2>
					<p>L'aire d'une surface peut s'exprimer avec des fractions décimales (ex: 0.1, 0.25) quand on divise la surface totale en 10 ou 100 parts égales.</p>
					<p><i class="consigne-ru">Площадь поверхности может быть выражена десятичными дробями (например, 0,1, 0,25), когда общая площадь делится на 10 или 100 равных частей.</i></p>
				</div>
			`
		},
		'floor-4': {
			title: { fr: 'Module 4 : Fractions Décimales', ru: 'Модуль 4: Десятичные дроби' },
			content: `
				<div class="bloc-theorie">
					<h2 class="print-title">Théorie / Теория</h2>
					<p>Une fraction décimale est une fraction dont le dénominateur est 10, 100, 1000...</p>
					<p><i class="consigne-ru">Десятичная дробь — это дробь, знаменатель которой равен 10, 100, 1000...</i></p>
				</div>
			`
		},
		'floor-5': {
			title: { fr: 'Module 5 : Le Pont Décimal', ru: 'Модуль 5: Десятичный мост' },
			content: `
				<div class="bloc-theorie">
					<h2 class="print-title">Théorie / Теория</h2>
					<p>On peut passer d'une fraction décimale à un nombre à virgule. Exemple : 75/100 = 0,75.</p>
					<p><i class="consigne-ru">Можно переходить от десятичной дроби к десятичному числу. Пример: 75/100 = 0,75.</i></p>
				</div>
			`
		},
		'floor-6': {
			title: { fr: 'Module 6 : Décomposition', ru: 'Модуль 6: Разложение' },
			content: `
				<div class="bloc-theorie">
					<h2 class="print-title">Théorie / Теория</h2>
					<p>Tout nombre peut être décomposé en unités, dixièmes, centièmes et millièmes.</p>
					<p><i class="consigne-ru">Любое число можно разложить на единицы, десятые, сотые и тысячные.</i></p>
				</div>
			`
		},
		'floor-7': {
			title: { fr: 'Module 7 : Comparer les Fractions', ru: 'Модуль 7: Сравнение дробей' },
			content: `
				<div class="bloc-theorie">
					<h2 class="print-title">Théorie / Теория</h2>
					<p>Pour comparer deux fractions, on peut les mettre sur le même dénominateur ou les transformer en nombres décimaux.</p>
					<p><i class="consigne-ru">Чтобы сравнить две дроби, можно привести их к общему знаменателю или перевести в десятичные числа.</i></p>
				</div>
			`
		},
		'floor-8': {
			title: { fr: 'Module 8 : Expertise et Ordre', ru: 'Модуль 8: Экспертиза и порядок' },
			content: `
				<div class="bloc-theorie">
					<h2 class="print-title">Théorie / Теория</h2>
					<p>L'encadrement consiste à trouver deux fractions dont l'une est plus petite et l'autre plus grande que la fraction cible.</p>
					<p><i class="consigne-ru">Ограничение — это поиск двух дробей, одна из которых меньше, а другая больше заданной дроби.</i></p>
				</div>
			`
		}
	};

	const currentCourse = $derived(courseContent[floorId] || courseContent['floor-1']);

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null = null;
	let drawing = false;

	function startDrawing(e: MouseEvent | TouchEvent) {
		drawing = true;
		const pos = getPos(e);
		ctx!.beginPath();
		ctx!.moveTo(pos.x, pos.y);
	}

	function stopDrawing() {
		drawing = false;
	}

	function draw(e: MouseEvent | TouchEvent) {
		if (!drawing) return;
		const pos = getPos(e);
		ctx!.lineTo(pos.x, pos.y);
		ctx!.stroke();
	}

	function getPos(e: MouseEvent | TouchEvent) {
		const rect = canvas.getBoundingClientRect();
		let clientX, clientY;
		if (e instanceof MouseEvent) {
			clientX = e.clientX;
			clientY = e.clientY;
		} else {
			clientX = e.touches[0].clientX;
			clientY = e.touches[0].clientY;
		}
		return { x: clientX - rect.left, y: clientY - rect.top };
	}

	function clearCanvas() {
		ctx!.clearRect(0, 0, canvas.width, canvas.height);
	}

	onMount(() => {
		if (canvas) {
			ctx = canvas.getContext('2d');
			if (ctx) {
				ctx.strokeStyle = '#ffcc00';
				ctx.lineWidth = 2;
				ctx.lineCap = 'round';
			}
		}
	});
</script>

<div class="course-overlay">
	<div class="course-window">
		<header>
			<h1>{languageState.current === 'fr-FR' ? 'Guide Académique' : 'Академический гид'}</h1>
			<button class="close-btn" onclick={onClose}>✕</button>
		</header>

		<div class="main-layout">
			<div class="content-area">
				<div class="course-header">
					<h2>{currentCourse.title[languageState.current]}</h2>
				</div>
				<div class="html-content">
					{@html currentCourse.content}
				</div>
				<div class="input-zone">
					<p>{languageState.current === 'fr-FR' ? 'Notes et réflexions :' : 'Заметки и размышления:'}</p>
					<textarea placeholder="Ecris ici..."></textarea>
				</div>
			</div>

			<div class="scribble-area">
				<div class="scribble-header">
					<span>{languageState.current === 'fr-FR' ? 'Zone de brouillon' : 'Зона черновика'}</span>
					<button class="clear-btn" onclick={clearCanvas}>🗑️</button>
				</div>
				<canvas 
					bind:this={canvas} 
					width="400" 
					height="600" 
					onmousedown={startDrawing} 
					onmousemove={draw} 
					onmouseup={stopDrawing}
					ontouchstart={startDrawing} 
					ontouchmove={draw} 
					ontouchend={stopDrawing}
				></canvas>
			</div>
		</div>
	</div>
</div>

<style>
	.course-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background: rgba(0,0,0,0.8);
		z-index: 3000;
		display: flex;
		justify-content: center;
		align-items: center;
		backdrop-filter: blur(5px);
	}
	.course-window {
		background: #fdfdfd;
		color: #333;
		width: 90%;
		max-width: 1100px;
		height: 90vh;
		border-radius: 12px;
		display: flex;
		flex-direction: column;
		box-shadow: 0 20px 50px rgba(0,0,0,0.5);
		overflow: hidden;
	}
	header {
		background: #1a237e;
		color: white;
		padding: 1rem 2rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	header h1 { margin: 0; font-size: 1.5rem; }
	.close-btn {
		background: transparent;
		border: none;
		color: white;
		font-size: 1.5rem;
		cursor: pointer;
	}
	.main-layout {
		display: flex;
		flex: 1;
		overflow: hidden;
	}
	.content-area {
		flex: 1;
		padding: 2rem;
		overflow-y: auto;
		background: white;
	}
	.course-header h2 {
		color: #1a237e;
		border-bottom: 2px solid #1a237e;
		padding-bottom: 10px;
		margin-bottom: 20px;
	}
	.input-zone {
		margin-top: 30px;
		padding: 15px;
		background: #f5f5f5;
		border-radius: 8px;
	}
	.input-zone textarea {
		width: 100%;
		height: 100px;
		margin-top: 10px;
		border: 1px solid #ccc;
		border-radius: 4px;
		padding: 10px;
		font-family: inherit;
	}
	.scribble-area {
		width: 420px;
		background: #eee;
		border-left: 2px solid #ccc;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 10px;
	}
	.scribble-header {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 10px;
		font-weight: bold;
		color: #666;
	}
	.clear-btn {
		background: white;
		border: 1px solid #ccc;
		border-radius: 4px;
		cursor: pointer;
		padding: 2px 8px;
	}
	canvas {
		background: white;
		border: 1px solid #999;
		border-radius: 4px;
		cursor: crosshair;
		box-shadow: inset 0 0 10px rgba(0,0,0,0.1);
	}

	@media print {
		.close-btn, .scribble-area, .input-zone, .aid-btn, .save-controls, .ui-overlay, .touch-controls {
			display: none !important;
		}
		.course-window {
			width: 100%;
			height: auto;
			box-shadow: none;
			border: none;
			background: white;
		}
		.course-overlay {
			background: transparent;
			position: static;
		}
		.main-layout {
			display: block;
		}
		.content-area {
			width: 100%;
			padding: 0;
		}
		.bloc-theorie, .bloc-exemple {
			page-break-inside: avoid;
			margin-bottom: 20px;
			border: 1px solid #ccc;
			padding: 15px;
		}
	}

	:global(.bloc-theorie) {
		background-color: #f1f8e9;
		border-left: 5px solid #2e7d32;
		padding: 15px;
		margin-bottom: 20px;
		border-radius: 6px;
	}
	:global(.bloc-exemple) {
		background-color: #e3f2fd;
		border-left: 5px solid #1976d2;
		padding: 15px;
		margin-bottom: 20px;
		border-radius: 6px;
	}
	:global(.fraction-display) {
		display: inline-flex;
		flex-direction: column;
		vertical-align: middle;
		text-align: center;
		padding: 0 10px;
		margin: 10px 0;
	}
	:global(.fraction-display .line) {
		border-bottom: 2px solid #000;
		width: 100%;
	}
	:global(.consigne-ru) {
		font-style: italic;
		color: #555;
	}
</style>
