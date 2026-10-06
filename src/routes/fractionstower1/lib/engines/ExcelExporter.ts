// -----------------------------------------------------------------------------
// RÔLE DU FICHIER : ExcelExporter.ts
// Génération et téléchargement d'un rapport de classe au format Excel (.xls / .csv)
// -----------------------------------------------------------------------------

import type { PlayerSaveData } from './SaveManager';

export class ExcelExporter {
  public static exportClassReportToExcel(studentSaves: PlayerSaveData[]): void {
    if (studentSaves.length === 0) {
      alert('Aucune donnée d\'élève à exporter.');
      return;
    }

    // En-têtes du tableau
    const headers = [
      'Nom de l\'élève',
      'Étage maximum débloqué',
      'Dernière activité',
      'Étage 1 (Parts d\'un tout)',
      'Étage 2 (Fractions équivalentes)',
      'Étage 3 (Fraction d\'une quantité)',
      'Étage 4 (Simplification)',
      'Étage 6 (Fractions décimales)'
    ];

    const competencyKeys = ['frac_01', 'frac_02', 'frac_03', 'frac_04', 'frac_06'];

    // Helper pour formater le statut de maîtrise
    const formatStatus = (status?: string) => {
      switch (status) {
        case 'mastered': return 'Maîtrisé (🟢)';
        case 'consolidating': return 'Consolidation (🟠)';
        case 'needs_review': return 'À reprendre (🔴)';
        default: return 'Non évalué';
      }
    };

    // Construction des lignes CSV avec BOM UTF-8 pour ouverture directe dans Excel
    let csvContent = '\uFEFF'; // BOM UTF-8
    csvContent += headers.map(h => `"${h}"`).join(';') + '\n';

    studentSaves.forEach(save => {
      const row = [
        `"${save.studentName}"`,
        `"Étage ${save.unlockedFloors ? save.unlockedFloors.length : 1}"`,
        `"${new Date(save.savedAt).toLocaleDateString('fr-CH')}"`,
        ...competencyKeys.map(key => `"${formatStatus(save.masteryData?.[key]?.status)}"`)
      ];
      csvContent += row.join(';') + '\n';
    });

    // Création du Blob et déclenchement du téléchargement
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const dateStr = new Date().toISOString().split('T')[0];
    link.download = `bilan_classe_fractions_${dateStr}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}