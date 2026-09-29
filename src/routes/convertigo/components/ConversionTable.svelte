<script lang="ts">
  export type TableMode = 'length' | 'area' | 'capacity' | 'mass' | 'time' | 'angle';
  export let open = false;
  export let mode: TableMode = 'length';
  export let close: () => void = () => {};

  const tables: Record<TableMode, { title: string; units: string[]; note: string; examples: string[] }> = {
    length: { title: 'Longueurs', units: ['km','hm','dam','m','dm','cm','mm'], note: 'Une colonne = ×10 vers la droite ou ÷10 vers la gauche.', examples: ['m → cm : ×100', 'km → m : ×1000', 'cm → m : ÷100'] },
    area: { title: 'Aires', units: ['km²','hm²','dam²','m²','dm²','cm²','mm²'], note: 'Une colonne = ×100 vers la droite ou ÷100 vers la gauche.', examples: ['m² → dm² : ×100', 'dm² → cm² : ×100', 'cm² → m² : ÷10 000'] },
    capacity: { title: 'Capacités', units: ['kl','hl','dal','l','dl','cl','ml'], note: 'Pour les capacités, chaque colonne vaut ×10 ou ÷10.', examples: ['l → dl : ×10', 'l → cl : ×100', 'dl → l : ÷10'] },
    mass: { title: 'Masses', units: ['t','kg','hg','dag','g','dg','cg','mg'], note: 'Chaque colonne vaut ×10 ou ÷10.', examples: ['kg → g : ×1000', 'g → kg : ÷1000', 't → kg : ×1000'] },
    time: { title: 'Durées', units: ['h','min','s'], note: 'Les durées ne suivent pas un tableau décimal : 1 h = 60 min et 1 min = 60 s.', examples: ['1 h = 60 min', '2 h = 120 min', '3 min = 180 s'] },
    angle: { title: 'Angles', units: ['°'], note: 'Les angles se mesurent en degrés. Un angle droit mesure 90°.', examples: ['aigu < 90°', 'droit = 90°', 'obtus > 90°'] }
  };

  $: table = tables[mode] ?? tables.length;
</script>

{#if open}
  <div class="overlay" role="presentation" on:click={close}>
    <section class="table-card" role="dialog" aria-modal="true" aria-label="Tableau de conversion" on:click|stopPropagation>
      <div class="top">
        <div><span class="eyebrow">OUTIL D'AIDE</span><h2>📊 {table.title}</h2><p>{table.note}</p></div>
        <button class="close" type="button" on:click={close}>✕</button>
      </div>

      <div class="conversion-grid" class:short={table.units.length <= 3}>
        {#each table.units as unit}<div class="unit">{unit}</div>{/each}
      </div>

      {#if mode !== 'time' && mode !== 'angle'}
        <div class="arrow-row"><span>← ÷{mode === 'area' ? '100' : '10'}</span><strong>UNITÉS</strong><span>×{mode === 'area' ? '100' : '10'} →</span></div>
      {/if}

      <div class="examples">{#each table.examples as example}<div><b>{example}</b></div>{/each}</div>
      <button class="close-bottom" type="button" on:click={close}>J'AI COMPRIS</button>
    </section>
  </div>
{/if}

<style>
  .overlay{position:fixed;inset:0;z-index:100;background:rgba(2,6,23,.78);display:grid;place-items:center;padding:1rem}.table-card{width:min(720px,100%);background:#fff;color:#0f172a;border:4px solid #0f172a;border-radius:24px;padding:1.25rem;box-shadow:0 10px 0 #0f172a}.top{display:flex;justify-content:space-between;gap:1rem}.eyebrow{font-size:.7rem;font-weight:900;color:#6366f1}h2{margin:.2rem 0;font-size:1.35rem}p{margin:0;color:#475569;font-weight:600}.close{border:3px solid #0f172a;background:#f87171;color:#fff;border-radius:10px;font-weight:900;cursor:pointer;width:40px;height:40px}.conversion-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:4px;background:#0f172a;padding:4px;border-radius:14px;margin:1.2rem 0 .7rem}.conversion-grid.short{grid-template-columns:repeat(3,1fr)}.unit{text-align:center;padding:.75rem .2rem;background:#38bdf8;border-radius:8px;font-weight:1000}.arrow-row{display:flex;justify-content:space-between;gap:.5rem;font-size:.75rem;font-weight:900;color:#475569}.examples{display:grid;grid-template-columns:repeat(3,1fr);gap:.6rem;margin:1rem 0}.examples div{background:#eef2ff;border:2px solid #c7d2fe;border-radius:12px;padding:.7rem}.close-bottom{width:100%;border:3px solid #0f172a;background:#22c55e;color:#0f172a;border-radius:12px;padding:.75rem;font-weight:1000;cursor:pointer}@media(max-width:560px){.examples{grid-template-columns:1fr}.conversion-grid{gap:2px}.unit{font-size:.8rem}}
</style>
