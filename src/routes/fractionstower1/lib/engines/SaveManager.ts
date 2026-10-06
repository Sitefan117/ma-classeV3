// -----------------------------------------------------------------------------
// RÔLE DU FICHIER : SaveManager.ts
// Exportation et importation des données de progression (.fracsave).
// -----------------------------------------------------------------------------

import { MasteryEngine, type CompetencyProgress } from './MasteryEngine';

export interface PlayerSaveData {
  version: string;
  studentName: string;
  currentFloor: string;
  unlockedFloors: string[];
  masteryData: Record<string, CompetencyProgress>;
  savedAt: string;
}

export class SaveManager {
  private static SAVE_VERSION = '1.0.0';

  // Génère l'objet de sauvegarde complet
  public static generateSaveObject(studentName: string = 'Élève'): PlayerSaveData {
    const unlocked = JSON.parse(localStorage.getItem('fraction_tower_unlocked_floors') || '["floor_01"]');
    const currentFloor = localStorage.getItem('fraction_tower_current_floor') || 'floor_01';
    
    // Récupération de l'historique de maîtrise
    const masteryDataRaw = localStorage.getItem('fraction_tower_mastery');
    const masteryData = masteryDataRaw ? JSON.parse(masteryDataRaw) : {};

    return {
      version: this.SAVE_VERSION,
      studentName,
      currentFloor,
      unlockedFloors: unlocked,
      masteryData,
      savedAt: new Date().toISOString()
    };
  }

  // Télécharge le fichier .fracsave
  public static exportSaveFile(studentName: string = 'Eleve'): void {
    const saveData = this.generateSaveObject(studentName);
    const jsonString = JSON.stringify(saveData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${studentName.toLowerCase().replace(/\s+/g, '_')}_progression.fracsave`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Importe et restaure les données depuis un fichier .fracsave
  public static importSaveData(fileContent: string): boolean {
    try {
      const data: PlayerSaveData = JSON.parse(fileContent);
      if (!data.version || !data.masteryData) return false;

      localStorage.setItem('fraction_tower_unlocked_floors', JSON.stringify(data.unlockedFloors));
      localStorage.setItem('fraction_tower_current_floor', data.currentFloor);
      localStorage.setItem('fraction_tower_mastery', JSON.stringify(data.masteryData));
      return true;
    } catch {
      return false;
    }
  }
}