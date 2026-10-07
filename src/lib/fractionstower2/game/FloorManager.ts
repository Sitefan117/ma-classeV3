// -----------------------------------------------------------------------------
// GESTION DES ÉTAGES
// Fournit les données de configuration pour chaque niveau de la tour.
// -----------------------------------------------------------------------------

import { type FloorData } from '$lib/fractionstower2/types/world';

export class FloorManager {
	private static floors: Record<string, FloorData> = {};

	// Mots de passe pour l'ascenseur (un par étage)
	static readonly elevatorPasswords: Record<string, string> = {
		'floor-1': 'Arcanin',
		'floor-2': 'Bulbizarre',
		'floor-3': 'Carapuce',
		'floor-4': 'Dracaufeu',
		'floor-5': 'Ectoplasma',
		'floor-6': 'Flagadoss',
		'floor-7': 'Grotadmorv',
		'floor-8': 'Ho-Oh'
	};

	// Générateur de template basé sur l'étage 1
	private static createFloorTemplate(id: string, name: string, floorNum: number): FloorData {
		return {
			id,
			name,
			width: 1000,
			height: 800,
			spawnPoint: { x: 100, y: 100 },
			collisions: [
				{ id: 'wall-top', x: 0, y: 0, width: 1000, height: 20 },
				{ id: 'wall-bottom', x: 0, y: 780, width: 1000, height: 20 },
				{ id: 'wall-left', x: 0, y: 0, width: 20, height: 800 },
				{ id: 'wall-right', x: 980, y: 0, width: 20, height: 800 },
				{ id: 'obs-1', x: 400, y: 300, width: 200, height: 200 },
			],
			interactions: [
				{ 
					id: `stairs-up-${floorNum}`, 
					type: 'stairs', 
					x: 920, y: 700, width: 40, height: 40, 
					destination: `floor-${floorNum + 1}` 
				},
				{ 
					id: `stairs-down-${floorNum}`, 
					type: 'stairs', 
					x: 860, y: 700, width: 40, height: 40, 
					destination: `floor-${floorNum - 1}` 
				},
				{ 
					id: `elevator-${floorNum}`, 
					type: 'elevator', 
					x: 50, y: 700, width: 60, height: 60, 
					destination: 'floor-select' 
				},
				{
					id: `mission-course-${floorNum}`,
					type: 'pedagogical',
					x: 150, y: 300, width: 60, height: 60,
					action: 'course-intro'
				},
				{
					id: `mission-training-${floorNum}`,
					type: 'pedagogical',
					x: 600, y: 150, width: 60, height: 60,
					action: 'training-intro'
				},
				{
					id: `mission-boss-${floorNum}`,
					type: 'pedagogical',
					x: 800, y: 150, width: 60, height: 60,
					action: 'boss-intro'
				}
			],
			visuals: []
		};
	}

	static {
		const floorNames = [
			'Premier Étage - Découverte',
			'Deuxième Étage - Entraînement',
			'Troisième Étage - Pratique',
			'Quatrième Étage - Consolidation',
			'Cinquième Étage - Maîtrise',
			'Sixième Étage - Expertise',
			'Septième Étage - Défi',
			'Huitième Étage - Sommet'
		];

		for (let i = 1; i <= 8; i++) {
			const id = `floor-${i}`;
			this.floors[id] = this.createFloorTemplate(id, floorNames[i-1], i);
		}
	}

	static getFloor(id: string): FloorData | undefined {
		return this.floors[id];
	}

	static getAllFloors() {
		return Object.values(this.floors);
	}
}
