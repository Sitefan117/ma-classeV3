// -----------------------------------------------------------------------------
// GESTION DES ÉTAGES
// Fournit les données de configuration pour chaque niveau de la tour.
// -----------------------------------------------------------------------------

import { type FloorData } from '$lib/fractionstower2/types/world';

export class FloorManager {
	private static floors: Record<string, FloorData> = {
		'floor-1': {
			id: 'floor-1',
			name: 'Premier Étage - Découverte',
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
					id: 'stairs-up-1', 
					type: 'stairs', 
					x: 900, y: 700, width: 40, height: 40, 
					destination: 'floor-2' 
				},
				{ 
					id: 'elevator-1', 
					type: 'elevator', 
					x: 50, y: 700, width: 60, height: 60, 
					destination: 'floor-select' 
				},
				{
					id: 'mission-course',
					type: 'pedagogical',
					x: 150, y: 300, width: 60, height: 60,
					action: 'course-intro'
				},
				{
					id: 'mission-training',
					type: 'pedagogical',
					x: 600, y: 150, width: 60, height: 60,
					action: 'training-intro'
				},
				{
					id: 'mission-boss',
					type: 'pedagogical',
					x: 800, y: 150, width: 60, height: 60,
					action: 'boss-intro'
				}
			],
			visuals: []
		},
		'floor-2': {
			id: 'floor-2',
			name: 'Deuxième Étage - Entraînement',
			width: 800,
			height: 600,
			spawnPoint: { x: 100, y: 400 },
			collisions: [
				{ id: 'wall-top', x: 0, y: 0, width: 800, height: 20 },
				{ id: 'wall-bottom', x: 0, y: 580, width: 800, height: 20 },
				{ id: 'wall-left', x: 0, y: 0, width: 20, height: 600 },
				{ id: 'wall-right', x: 780, y: 0, width: 20, height: 600 },
				{ id: 'pillar-1', x: 400, y: 100, width: 40, height: 300 },
			],
			interactions: [
				{ 
					id: 'stairs-down-2', 
					type: 'stairs', 
					x: 720, y: 500, width: 40, height: 40, 
					destination: 'floor-1' 
				},
				{ 
					id: 'elevator-2', 
					type: 'elevator', 
					x: 50, y: 500, width: 60, height: 60, 
					destination: 'floor-select' 
				},
			],
			visuals: []
		}
	};

	static getFloor(id: string): FloorData | undefined {
		return this.floors[id];
	}

	static getAllFloors() {
		return Object.values(this.floors);
	}
}
