<script>
	import { page } from '$app/stores';
</script>

<div class="container">
	<h1>Fractions Tower</h1>
	<p>Bienvenue dans la tour des fractions !</p>
	<a href="/fractionstower2/play" class="btn">Commencer l'aventure</a>
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100vh;
		font-family: sans-serif;
		gap: 20px;
	}
	h1 {
		font-size: 3rem;
		color: #333;
	}
	.btn {
		padding: 10px 20px;
		background: #4CAF50;
		color: white;
		text-decoration: none;
		border-radius: 8px;
		font-weight: bold;
	}
</style>
