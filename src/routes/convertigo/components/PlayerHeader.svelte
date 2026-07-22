<script lang="ts">
  export let xp: number = 0;
  export let level: number = 1;

  $: currentLevelXp = xp % 100;
  $: progressPercentage = (currentLevelXp / 100) * 100;
</script>

<div class="bg-white rounded-xl shadow-sm p-4 border border-slate-200 flex flex-col gap-2">
  <div class="flex justify-between items-center font-bold text-slate-700">
    <span class="text-indigo-600">Niveau {level}</span>
    <span class="text-xs text-slate-500">{xp} XP au total</span>
  </div>

  <!-- Barre de progression -->
  <div class="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200">
    <div
      class="bg-indigo-600 h-full transition-all duration-500 ease-out"
      style="width: {progressPercentage}%"
    ></div>
  </div>
</div>