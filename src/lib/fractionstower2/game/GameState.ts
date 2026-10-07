// -----------------------------------------------------------------------------
// GESTION DE L'ÉTAT DU JEU
// Centralise la position du joueur, l'étage actuel et la maîtrise.
// -----------------------------------------------------------------------------

import { type PlayerState, type Vector2 } from '$lib/fractionstower2/types/world';
import { FloorManager } from '$lib/fractionstower2/game/FloorManager';
import { type CompetenceState } from '$lib/fractionstower2/engines/MasteryEngine';

export function createGameState() {
	// État réactif du joueur
	let player = $state<PlayerState>({
		position: { x: 100, y: 100 },
		direction: 'down',
		currentFloorId: 'floor-1',
		speed: 4
	});

	// Suivi de la maîtrise par compétence (ID de la compétence -> État)
	let competencies = $state<Record<string, CompetenceState>>({});

	let debugMode = $state(false);
	let currentFloorName = $state('');

	// Initialisation du nom de l'étage
	const initialFloor = FloorManager.getFloor(player.currentFloorId);
	if (initialFloor) currentFloorName = initialFloor.name;

	return {
		get player() { return player; },
		set player(val) { player = val; },
		
		get debugMode() { return debugMode; },
		set debugMode(val) { debugMode = val; },

		get currentFloorName() { return currentFloorName; },
		set currentFloorName(val) { currentFloorName = val; },

		get competencies() { return competencies; },
		set competencies(val) { competencies = val; },

		// Mise à jour de la position
		updatePosition(dx: number, dy: number) {
			player.position.x += dx;
			player.position.y += dy;
		},

		setDirection(dir: PlayerState['direction']) {
			player.direction = dir;
		},

		// Changement d'étage
		changeFloor(floorId: string) {
			const nextFloor = FloorManager.getFloor(floorId);
			if (nextFloor) {
				player.currentFloorId = floorId;
				player.position = { ...nextFloor.spawnPoint };
				currentFloorName = nextFloor.name;
			}
		}
	};
}
