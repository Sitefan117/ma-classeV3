// -----------------------------------------------------------------------------
// MOTEUR DE COMBAT BOSS
// Gère la logique des phases, des questions et de la santé du Boss.
// -----------------------------------------------------------------------------

import { type FloorData } from '$lib/fractionstower2/types/world';
import { ExerciseGenerator } from './ExerciseGenerator';

export interface BossState {
    currentPhase: number;     // 1, 2 ou 3
    currentQuestionIndex: number; // 0 à 5 (6 questions par phase)
    bossHP: number;           // Points de vie du boss
    playerHP: number;         // Points de vie du joueur
    isDefeated: boolean;
    isPlayerDefeated: boolean;
}

export class BossEngine {
    private static QUESTIONS_PER_PHASE = 6;
    // Augmentation des HP pour forcer le passage par plusieurs phases
    // 300 HP / 20 dégâts = 15 bonnes réponses nécessaires sur 18.
    private static MAX_BOSS_HP = 300; 
    private static MAX_PLAYER_HP = 100;

    /**
     * Initialise l'état d'un combat de Boss.
     */
    static createInitialState(): BossState {
        return {
            currentPhase: 1,
            currentQuestionIndex: 0,
            bossHP: this.MAX_BOSS_HP,
            playerHP: this.MAX_PLAYER_HP,
            isDefeated: false,
            isPlayerDefeated: false
        };
    }

    /**
     * Génère la question correspondant à la phase et l'indice actuel.
     */
    static generateQuestion(floorId: string, phase: number, index: number) {
        const difficulty = phase === 1 ? 'easy' : phase === 2 ? 'medium' : 'hard';
        
        return ExerciseGenerator.generate({
            floorId,
            difficulty,
            type: phase === 3 ? 'comparison' : 'standard',
            index
        });
    }

    /**
     * Calcule le résultat d'une réponse.
     */
    static processAnswer(state: BossState, isCorrect: boolean) {
        if (isCorrect) {
            // Le joueur inflige des dégâts au Boss
            state.bossHP -= 20; 
            if (state.bossHP <= 0) {
                state.bossHP = 0;
                state.isDefeated = true;
            }
        } else {
            // Le Boss inflige des dégâts au joueur
            state.playerHP -= 15;
            if (state.playerHP <= 0) {
                state.playerHP = 0;
                state.isPlayerDefeated = true;
            }
        }

        // Avancement des questions
        state.currentQuestionIndex++;

        // Changement de phase si on a atteint 6 questions
        if (state.currentQuestionIndex >= this.QUESTIONS_PER_PHASE) {
            state.currentQuestionIndex = 0;
            state.currentPhase++;
            
            // Victoire automatique si on survit à la fin de la Phase 3
            if (state.currentPhase > 3) {
                if (!state.isPlayerDefeated) {
                    state.isDefeated = true;
                }
            }
        }
    }
}
