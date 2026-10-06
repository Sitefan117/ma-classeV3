<script lang="ts">
  let { beltId = 'white', onExit } = $props<{
    beltId?: string;
    onExit: () => void;
  }>();

  const info: Record<string, { title: string; subtitle: string; roof: string; description: string }> = {
    white:  { title: 'Ceinture Blanche', subtitle: 'Découvrir', roof: '#e7e4d8', description: 'Bienvenue dans le premier atelier. Ici, on découvre les grandeurs et les unités.' },
    yellow: { title: 'Ceinture Jaune', subtitle: 'Construire', roof: '#e4b83f', description: 'Atelier de construction : périmètres, aires et premières stratégies.' },
    green:  { title: 'Ceinture Verte', subtitle: 'Distinguer', roof: '#4d9b58', description: 'Atelier de distinction : comparer, choisir et justifier la bonne grandeur.' },
    blue:   { title: 'Ceinture Bleue', subtitle: 'Mesurer', roof: '#4f88cf', description: 'Atelier de mesure : capacités, volumes et outils de mesure.' },
    black:  { title: 'Ceinture Noire', subtitle: 'Maîtriser', roof: '#424752', description: 'Atelier final : mobiliser plusieurs grandeurs dans des situations complexes.' }
  };
  const current = $derived(info[beltId] ?? info.white);
</script>

<div class="interior-shell">
  <div class="room">
    <div class="wall back"></div>
    <div class="wall side left"></div><div class="wall side right"></div>
    <div class="floor"></div>
    <div class="rug"></div>

    <div class="window"><span></span><span></span></div>
    <div class="shelf"><i></i><i></i><i></i><i></i></div>
    <div class="table"><div></div></div>
    <div class="plant"><b></b><i></i><i></i><i></i></div>
    <div class="exit-door" style={`--roof:${current.roof}`} onclick={onExit} role="button" tabindex="0" onkeydown={(e)=>e.key==='Enter'&&onExit()}>
      <span>↩</span>
    </div>

    <div class="title-card">
      <div class="belt-dot" style={`background:${current.roof}`}></div>
      <div><strong>{current.title}</strong><small>{current.subtitle}</small></div>
    </div>

    <div class="content-card">
      <h2>Atelier</h2>
      <p>{current.description}</p>
      <button onclick={onExit}>← Retour au village</button>
    </div>
  </div>
</div>

<style>
  .interior-shell{width:100%;display:flex;justify-content:center;padding:12px;box-sizing:border-box}
  .room{position:relative;width:min(760px,100%);aspect-ratio:16/10;overflow:hidden;border:4px solid #29352d;border-radius:10px;background:#c9b58c;box-shadow:0 12px 30px rgba(0,0,0,.24);image-rendering:pixelated}
  .wall.back{position:absolute;inset:0 0 58% 0;background:#e9d9b5;border-bottom:5px solid #a9865a}
  .wall.side{position:absolute;top:0;bottom:42%;width:10%;background:#cbb58c}.wall.left{left:0}.wall.right{right:0}
  .floor{position:absolute;inset:42% 0 0;background:#b99062;background-image:linear-gradient(90deg,rgba(92,59,37,.12) 2px,transparent 2px),linear-gradient(rgba(92,59,37,.1) 2px,transparent 2px);background-size:36px 18px}
  .rug{position:absolute;left:28%;right:28%;bottom:10%;height:24%;background:#d6b66d;border:5px solid #755132;box-shadow:inset 0 0 0 3px #e9d18e}
  .window{position:absolute;left:13%;top:10%;width:18%;height:23%;background:#70bdd7;border:5px solid #704a31;box-shadow:inset 0 0 0 4px #d9e6d4}.window span{position:absolute;background:#fff}.window span:first-child{left:50%;top:0;bottom:0;width:3px}.window span:last-child{top:50%;left:0;right:0;height:3px}
  .shelf{position:absolute;right:14%;top:18%;width:22%;height:9%;border:4px solid #704a31;background:#9a6539}.shelf i{display:inline-block;width:18%;height:55%;margin:5% 3%;background:#6a8b7b;border:2px solid #40584e}
  .table{position:absolute;left:37%;top:47%;width:26%;height:17%;background:#8c5b35;border:4px solid #5c3924;border-radius:3px}.table:before,.table:after{content:"";position:absolute;top:100%;width:10%;height:60%;background:#5c3924}.table:before{left:8%}.table:after{right:8%}.table div{position:absolute;left:15%;right:15%;top:35%;height:5px;background:#c18b52}
  .plant{position:absolute;left:17%;bottom:13%;width:12%;height:22%}.plant b{position:absolute;left:25%;bottom:0;width:50%;height:28%;background:#a96c3c;border:3px solid #6e4327;border-radius:2px}.plant i{position:absolute;width:28%;height:48%;border-radius:70% 20% 70% 20%;background:#4d8d4c;bottom:23%;left:25%;transform:rotate(-28deg)}.plant i:nth-of-type(2){left:45%;transform:rotate(30deg)}.plant i:nth-of-type(3){left:36%;bottom:38%;transform:rotate(3deg)}
  .exit-door{position:absolute;right:6%;bottom:0;width:12%;height:38%;background:#70452c;border:5px solid #4d2e1d;cursor:pointer}.exit-door:before{content:"";position:absolute;left:-7px;right:-7px;top:-9px;height:12px;background:var(--roof);border:4px solid #4d2e1d}.exit-door span{position:absolute;left:8%;top:44%;font-size:18px;color:#f5df9c}
  .title-card{position:absolute;left:4%;top:4%;display:flex;gap:8px;align-items:center;padding:7px 10px;background:rgba(255,248,226,.95);border:3px solid #5d4630;border-radius:7px;color:#3b2d22;font-family:system-ui,sans-serif}.title-card strong{display:block;font-size:13px}.title-card small{display:block;font-size:9px}.belt-dot{width:12px;height:12px;border:2px solid #5d4630;border-radius:50%}
  .content-card{position:absolute;left:50%;bottom:5%;transform:translateX(-50%);width:42%;padding:10px 12px;background:rgba(255,248,226,.95);border:3px solid #5d4630;border-radius:8px;text-align:center;color:#3b2d22;font-family:system-ui,sans-serif}.content-card h2{margin:0 0 3px;font-size:14px}.content-card p{margin:0 0 7px;font-size:10px;line-height:1.35}.content-card button{border:2px solid #5d4630;border-radius:5px;background:#fff4cf;padding:5px 8px;font-weight:800;font-size:10px;cursor:pointer}
</style>
