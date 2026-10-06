<script lang="ts">
  import { onMount } from 'svelte';
  import { SaveManager } from '../../engines/SaveManager';

  let { currentFloorName, onSaveLoaded }: { currentFloorName: string; onSaveLoaded?: () => void } = $props();

  let studentName = $state('Élève');
  let isEditingName = $state(false);
  let isDysMode = $state(false);
  let fileInput: HTMLInputElement;

  onMount(() => {
    const savedName = localStorage.getItem('fraction_tower_student_name');
    if (savedName) studentName = savedName;

    const savedDys = localStorage.getItem('fraction_tower_dys_mode');
    if (savedDys === 'true') {
      isDysMode = true;
      document.body.classList.add('dys-mode');
    }
  });

  function toggleDysMode() {
    isDysMode = !isDysMode;
    if (isDysMode) {
      document.body.classList.add('dys-mode');
      localStorage.setItem('fraction_tower_dys_mode', 'true');
    } else {
      document.body.classList.remove('dys-mode');
      localStorage.setItem('fraction_tower_dys_mode', 'false');
    }
  }

  function saveName() {
    localStorage.setItem('fraction_tower_student_name', studentName);
    isEditingName = false;
  }

  function handleDownloadSave() {
    SaveManager.exportSaveFile(studentName);
  }

  function handleFileImport(event: Event) {
    const target = event.target as HTMLInputElement;
    if (!target.files || target.files.length === 0) return;

    const file = target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        const success = SaveManager.importSaveData(content);
        if (success) {
          alert('💾 Progression chargée avec succès !');
          if (onSaveLoaded) onSaveLoaded();
        } else {
          alert('❌ Fichier .fracsave invalide.');
        }
      }
    };
    reader.readAsText(file);
  }
</script>

<div class="hud-container">
  <div class="hud-left">
    <div class="student-profile">
      <span class="icon">👤</span>
      {#if isEditingName}
        <input
          type="text"
          bind:value={studentName}
          class="name-input"
          onblur={saveName}
          onkeydown={(e) => e.key === 'Enter' && saveName()}
        />
      {:else}
        <button class="name-btn" onclick={() => (isEditingName = true)}>
          {studentName} ✏️
        </button>
      {/if}
    </div>

    <div class="floor-badge">
      🏰 {currentFloorName}
    </div>
  </div>

  <div class="hud-right">
    <!-- Bouton Bascule Mode DYS (Phase 14 / 15) -->
    <button
      class="hud-btn dys-btn {isDysMode ? 'active' : ''}"
      onclick={toggleDysMode}
      title="Activer la police adaptée DYS"
    >
      👁️ {isDysMode ? 'Mode DYS (Actif)' : 'Police DYS'}
    </button>

    <button class="hud-btn save-btn" onclick={handleDownloadSave} title="Sauvegarder ma progression">
      💾 Sauvegarder
    </button>

    <label class="hud-btn load-btn" title="Charger un fichier .fracsave">
      📂 Charger
      <input type="file" accept=".fracsave,.json" bind:this={fileInput} onchange={handleFileImport} hidden />
    </label>
  </div>
</div>

<style>
  /* [Inclusion des styles HUD précédents + style du bouton DYS] */
  .hud-container {
    position: fixed;
    top: 12px;
    left: 12px;
    right: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: rgba(15, 23, 42, 0.95);
    border: 2px solid #334155;
    padding: 8px 16px;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
    z-index: 50;
  }

  .hud-left, .hud-right { display: flex; align-items: center; gap: 10px; }

  .student-profile {
    display: flex; align-items: center; gap: 6px;
    background-color: #1e293b; padding: 4px 10px;
    border-radius: 8px; border: 1px solid #475569;
  }

  .name-btn { background: none; border: none; color: #f8fafc; font-weight: bold; cursor: pointer; }
  .name-input { background-color: #0f172a; border: 1px solid #38bdf8; color: #38bdf8; padding: 2px 6px; border-radius: 4px; font-weight: bold; width: 120px; }
  .floor-badge { background-color: #0284c7; color: #ffffff; font-weight: bold; font-size: 0.85rem; padding: 4px 12px; border-radius: 8px; }

  .hud-btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 6px 12px; border-radius: 8px; font-size: 0.85rem;
    font-weight: bold; cursor: pointer; border: none;
  }

  .dys-btn { background-color: #334155; color: #38bdf8; border: 1px solid #38bdf8; }
  .dys-btn.active { background-color: #0284c7; color: #ffffff; border-color: #38bdf8; }

  .save-btn { background-color: #10b981; color: #0f172a; }
  .load-btn { background-color: #334155; color: #f8fafc; border: 1px solid #475569; }
</style>