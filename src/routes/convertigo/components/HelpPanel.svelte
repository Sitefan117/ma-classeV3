<script lang="ts">
  import AudioButton from './AudioButton.svelte';
  export let text = '';
  export let animation: 'length'|'area'|'volume'|'mass'|'time'|'angle'|'point' = 'length';
  export let close: () => void = () => {};
</script>

<div class="help">
  <div class="help-head">
    <div>
      <span class="tag">💡 AIDE</span>
      <h3>On reprend autrement</h3>
    </div>
    <button type="button" on:click={close}>✕</button>
  </div>

  <p>{text}</p>
  <AudioButton text={text} />

  {#if animation === 'length'}
    <div class="anim ruler"><span>km</span><span>hm</span><span>dam</span><b>m</b><span>dm</span><span>cm</span><span>mm</span></div>
    <small>Une colonne = ×10 vers la droite, ÷10 vers la gauche.</small>
  {:else if animation === 'area'}
    <div class="anim square"><div></div><span>surface = longueur × largeur</span></div>
  {:else if animation === 'volume'}
    <div class="anim cube"><div></div><span>volume = longueur × largeur × hauteur</span></div>
  {:else if animation === 'mass'}
    <div class="anim scale">⚖️ <span>Comparer → même unité → décider</span></div>
  {:else if animation === 'time'}
    <div class="anim scale">⏱️ <span>60 s = 1 min · 60 min = 1 h</span></div>
  {:else if animation === 'angle'}
    <div class="anim angle">∠ <span>l’ouverture se mesure en degrés</span></div>
  {:else}
    <div class="anim circles">A ◯ <span>intersection</span> ◯ B</div>
  {/if}
</div>

<style>
  .help { background:#fffbeb; border:3px solid #0f172a; border-radius:16px; padding:1rem; display:flex; flex-direction:column; gap:.7rem; }
  .help-head { display:flex; justify-content:space-between; gap:1rem; }
  .help-head h3 { margin:.25rem 0 0; font-size:1rem; }
  .help-head button { border:2px solid #0f172a; background:#fff; border-radius:8px; font-weight:900; cursor:pointer; width:34px; height:34px; }
  .tag { font-size:.65rem; font-weight:1000; color:#92400e; }
  p { margin:0; font-weight:700; line-height:1.45; color:#451a03; }
  .anim { min-height:72px; border:2px solid #f59e0b; border-radius:12px; background:#fff; display:flex; align-items:center; justify-content:center; gap:.5rem; font-weight:900; overflow:hidden; }
  .ruler span,.ruler b { padding:.7rem .25rem; min-width:40px; text-align:center; animation:pulse 1.5s infinite; }
  .ruler b { background:#38bdf8; border-radius:6px; }
  .square div { width:55px;height:55px;border:4px solid #6366f1; animation:grow 1.5s infinite alternate; }
  .cube div { width:50px;height:50px;background:#a78bfa; transform:skewY(-15deg) rotate(30deg); animation:float 1.5s infinite alternate; }
  .scale,.angle,.circles { flex-wrap:wrap; padding:1rem; }
  small { color:#92400e; font-weight:700; }
  @keyframes pulse { 50%{transform:translateY(-3px)} }
  @keyframes grow { to{transform:scale(1.12)} }
  @keyframes float { to{transform:skewY(-15deg) rotate(30deg) translateY(-5px)} }
</style>
