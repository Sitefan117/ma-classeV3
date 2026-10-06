<script lang="ts">
  import { SaveManager, type PlayerSaveData } from '../lib/engines/SaveManager';
  import { ExcelExporter } from '../lib/engines/ExcelExporter';

  let studentSaves = $state<PlayerSaveData[]>([]);
  let fileInput: HTMLInputElement;

  function handleFileUpload(event: Event) {
    const target = event.target as HTMLInputElement;
    if (!target.files || target.files.length === 0) return;

    Array.from(target.files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        if (content) {
          try {
            const data: PlayerSaveData = JSON.parse(content);
            studentSaves = [...studentSaves.filter(s => s.studentName !== data.studentName), data];
          } catch (err) {
            console.error('Fichier invalide', err);
          }
        }
      };
      reader.readAsText(file);
    });
  }

  function handleExportExcel() {
    ExcelExporter.exportClassReportToExcel(studentSaves);
  }

  function getStatusBadge(status?: string) {
    switch (status) {
      case 'mastered': return { text: '🟢 Maîtrisé', class: 'badge-green' };
      case 'consolidating': return { text: '🟠 Consolidation', class: 'badge-orange' };
      default: return { text: '🔴 À reprendre', class: 'badge-red' };
    }
  }
</script>

<div class="teacher-dashboard">
  <header class="dashboard-header">
    <h1>🎓 Espace Enseignant — La Tour des Fractions</h1>
    <p>Analyse de la maîtrise des compétences PER (7H–8H)</p>
  </header>

  <section class="action-bar">
    <label class="btn-import">
      📂 Importer des fichiers .fracsave
      <input type="file" accept=".fracsave,.json" multiple bind:this={fileInput} onchange={handleFileUpload} hidden />
    </label>

    {#if studentSaves.length > 0}
      <button class="btn-export-excel" onclick={handleExportExcel}>
        📊 Exporter le Bilan Classe (.csv / Excel)
      </button>
    {/if}

    <a href="/fractionstower1" class="btn-back">🎮 Retour au Jeu</a>
  </section>

  <main class="dashboard-content">
    {#if studentSaves.length === 0}
      <div class="empty-state">
        <p>Aucune sauvegarde d'élève chargée. Importez un ou plusieurs fichiers <code>.fracsave</code> pour afficher le bilan.</p>
      </div>
    {:else}
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Élève</th>
              <th>Étage Max</th>
              <th>Étage 1 (Parts)</th>
              <th>Étage 2 (Équiv.)</th>
              <th>Étage 3 (Quantités)</th>
              <th>Étage 4 (Simplif.)</th>
              <th>Étage 6 (Décimales)</th>
              <th>Dernière activité</th>
            </tr>
          </thead>
          <tbody>
            {#each studentSaves as save}
              <tr>
                <td><strong>{save.studentName}</strong></td>
                <td><span class="floor-pill">Étage {save.unlockedFloors ? save.unlockedFloors.length : 1}</span></td>
                
                {#each ['frac_01', 'frac_02', 'frac_03', 'frac_04', 'frac_06'] as compId}
                  {@const status = getStatusBadge(save.masteryData?.[compId]?.status)}
                  <td><span class="status-badge {status.class}">{status.text}</span></td>
                {/each}

                <td class="date-col">{new Date(save.savedAt).toLocaleDateString('fr-CH')}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </main>
</div>

<style>
  .teacher-dashboard {
    min-height: 100vh;
    background-color: #0f172a;
    color: #f8fafc;
    padding: 2rem;
    font-family: system-ui, -apple-system, sans-serif;
  }

  .dashboard-header {
    margin-bottom: 2rem;
    border-bottom: 2px solid #334155;
    padding-bottom: 1rem;
  }

  .dashboard-header h1 { color: #38bdf8; margin: 0 0 0.5rem 0; font-size: 1.8rem; }
  .dashboard-header p { color: #94a3b8; margin: 0; }

  .action-bar {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .btn-import {
    background-color: #0284c7;
    color: white;
    padding: 0.75rem 1.25rem;
    border-radius: 8px;
    font-weight: bold;
    cursor: pointer;
    display: inline-block;
  }

  .btn-export-excel {
    background-color: #10b981;
    color: #0f172a;
    padding: 0.75rem 1.25rem;
    border-radius: 8px;
    font-weight: bold;
    border: none;
    cursor: pointer;
  }

  .btn-back {
    background-color: #334155;
    color: #f8fafc;
    padding: 0.75rem 1.25rem;
    border-radius: 8px;
    text-decoration: none;
    font-weight: bold;
  }

  .empty-state {
    background-color: #1e293b;
    border: 2px dashed #475569;
    padding: 3rem;
    text-align: center;
    border-radius: 12px;
    color: #94a3b8;
  }

  .table-container {
    overflow-x: auto;
    background-color: #1e293b;
    border-radius: 12px;
    border: 1px solid #334155;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
    font-size: 0.9rem;
  }

  th, td {
    padding: 1rem;
    border-bottom: 1px solid #334155;
  }

  th {
    background-color: #0f172a;
    color: #38bdf8;
    font-weight: bold;
  }

  .floor-pill {
    background-color: #0284c7;
    color: white;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: bold;
  }

  .status-badge {
    padding: 4px 8px;
    border-radius: 6px;
    font-size: 0.8rem;
    font-weight: bold;
  }

  .badge-green { background-color: rgba(16, 185, 129, 0.2); color: #34d399; border: 1px solid #10b981; }
  .badge-orange { background-color: rgba(245, 158, 11, 0.2); color: #fbbf24; border: 1px solid #f59e0b; }
  .badge-red { background-color: rgba(239, 68, 68, 0.2); color: #fca5a5; border: 1px solid #ef4444; }

  .date-col { font-size: 0.8rem; color: #94a3b8; }
</style>