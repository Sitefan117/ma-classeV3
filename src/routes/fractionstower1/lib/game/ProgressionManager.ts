export interface StudentProgress {
  studentId: string;
  completedExercises: string[];
  unlockedFloors: number[];
  score: number;
  completedAt?: string;
}

export class ProgressionManager {
  public studentId: string = 'invité';
  public progress: StudentProgress;

  constructor() {
    this.studentId = this.getStudentIdFromURL();
    this.progress = this.loadProgress();
  }

  private getStudentIdFromURL(): string {
    if (typeof window === 'undefined') return 'invité';
    const params = new URLSearchParams(window.location.search);
    return params.get('eleve') || 'invité';
  }

  private loadProgress(): StudentProgress {
    if (typeof window === 'undefined') return this.getDefaultProgress();
    try {
      const saved = localStorage.getItem(`ft_progress_${this.studentId}`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Impossible de charger le stockage local:', e);
    }
    return this.getDefaultProgress();
  }

  private getDefaultProgress(): StudentProgress {
    return {
      studentId: this.studentId,
      completedExercises: [],
      unlockedFloors: [1],
      score: 0
    };
  }

  public saveProgress(): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(`ft_progress_${this.studentId}`, JSON.stringify(this.progress));
      } catch (e) {
        console.warn('Impossible de sauvegarder:', e);
      }
    }
  }

  public completeExercise(exerciseId: string): boolean {
    if (!this.progress.completedExercises.includes(exerciseId)) {
      this.progress.completedExercises.push(exerciseId);
      this.progress.score += 100;

      // Déblocage séquentiel jusqu'à l'étage 5
      if (exerciseId === 'frac_01' && !this.progress.unlockedFloors.includes(2)) {
        this.progress.unlockedFloors.push(2);
      } else if (exerciseId === 'frac_02' && !this.progress.unlockedFloors.includes(3)) {
        this.progress.unlockedFloors.push(3);
      } else if (exerciseId === 'frac_03' && !this.progress.unlockedFloors.includes(4)) {
        this.progress.unlockedFloors.push(4);
      } else if (exerciseId === 'frac_04' && !this.progress.unlockedFloors.includes(5)) {
        this.progress.unlockedFloors.push(5);
      }

      if (exerciseId === 'frac_boss' && !this.progress.completedAt) {
        this.progress.completedAt = new Date().toISOString();
      }

      this.saveProgress();
      return true;
    }
    return false;
  }

  public isFloorUnlocked(floorNumber: number): boolean {
    return this.progress.unlockedFloors.includes(floorNumber);
  }

  public exportReportJSON(): void {
    if (typeof window === 'undefined') return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.progress, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `rapport_fractions_${this.studentId}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }
}