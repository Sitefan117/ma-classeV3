import type { RoomMap } from '../types/world';

export const DEMO_FLOOR_01: RoomMap = {
  id: 'floor_01', name: 'Hall d\'entrée - Étage 1', floorNumber: 1, width: 800, height: 600, spawnPoint: { x: 400, y: 500 },
  visualTiles: [{ id: 'w1', x: 0, y: 0, width: 800, height: 80, color: '#1e293b', layer: 'structure' }],
  collisions: [{ id: 'c1', x: 0, y: 0, width: 800, height: 80 }, { id: 'c2', x: 0, y: 0, width: 20, height: 600 }, { id: 'c3', x: 780, y: 0, width: 20, height: 600 }, { id: 'c4', x: 0, y: 580, width: 800, height: 20 }],
  interactions: [
    { id: 's1_up', type: 'stairs', label: 'Escalier vers Étage 2', x: 120, y: 20, width: 60, height: 60, targetMapId: 'floor_02', targetSpawn: { x: 120, y: 100 }, actionPrompt: 'Appuie sur E pour monter' },
    { id: 'm1', type: 'mission_zone', label: 'Épreuve 1', x: 200, y: 280, width: 80, height: 80, competencyId: 'frac_01', actionPrompt: 'Appuie sur E pour l\'épreuve 1' }
  ]
};

export const DEMO_FLOOR_02: RoomMap = {
  id: 'floor_02', name: 'Laboratoire - Étage 2', floorNumber: 2, width: 800, height: 600, spawnPoint: { x: 120, y: 120 },
  visualTiles: [{ id: 'w2', x: 0, y: 0, width: 800, height: 80, color: '#0f766e', layer: 'structure' }],
  collisions: [{ id: 'c1', x: 0, y: 0, width: 800, height: 80 }, { id: 'c2', x: 0, y: 0, width: 20, height: 600 }, { id: 'c3', x: 780, y: 0, width: 20, height: 600 }, { id: 'c4', x: 0, y: 580, width: 800, height: 20 }],
  interactions: [
    { id: 's2_down', type: 'stairs', label: 'Vers Étage 1', x: 120, y: 20, width: 60, height: 60, targetMapId: 'floor_01', targetSpawn: { x: 120, y: 100 }, actionPrompt: 'Descendre à l\'Étage 1' },
    { id: 's2_up', type: 'stairs', label: 'Vers Étage 3', x: 620, y: 20, width: 60, height: 60, targetMapId: 'floor_03', targetSpawn: { x: 620, y: 100 }, actionPrompt: 'Monter à l\'Étage 3' },
    { id: 'm2', type: 'mission_zone', label: 'Épreuve 2', x: 400, y: 250, width: 80, height: 80, competencyId: 'frac_02', actionPrompt: 'Démarrer l\'épreuve 2' }
  ]
};

export const DEMO_FLOOR_03: RoomMap = {
  id: 'floor_03', name: 'Observatoire - Étage 3', floorNumber: 3, width: 800, height: 600, spawnPoint: { x: 620, y: 120 },
  visualTiles: [{ id: 'w3', x: 0, y: 0, width: 800, height: 80, color: '#6b21a8', layer: 'structure' }],
  collisions: [{ id: 'c1', x: 0, y: 0, width: 800, height: 80 }, { id: 'c2', x: 0, y: 0, width: 20, height: 600 }, { id: 'c3', x: 780, y: 0, width: 20, height: 600 }, { id: 'c4', x: 0, y: 580, width: 800, height: 20 }],
  interactions: [
    { id: 's3_down', type: 'stairs', label: 'Vers Étage 2', x: 620, y: 20, width: 60, height: 60, targetMapId: 'floor_02', targetSpawn: { x: 620, y: 100 }, actionPrompt: 'Descendre à l\'Étage 2' },
    { id: 's3_up', type: 'stairs', label: 'Vers Étage 4', x: 120, y: 20, width: 60, height: 60, targetMapId: 'floor_04', targetSpawn: { x: 120, y: 100 }, actionPrompt: 'Monter à l\'Étage 4' },
    { id: 'm3', type: 'mission_zone', label: 'Épreuve 3', x: 350, y: 250, width: 80, height: 80, competencyId: 'frac_03', actionPrompt: 'Démarrer l\'épreuve 3' }
  ]
};

export const DEMO_FLOOR_04: RoomMap = {
  id: 'floor_04', name: 'Bibliothèque - Étage 4', floorNumber: 4, width: 800, height: 600, spawnPoint: { x: 120, y: 120 },
  visualTiles: [{ id: 'w4', x: 0, y: 0, width: 800, height: 80, color: '#b45309', layer: 'structure' }],
  collisions: [{ id: 'c1', x: 0, y: 0, width: 800, height: 80 }, { id: 'c2', x: 0, y: 0, width: 20, height: 600 }, { id: 'c3', x: 780, y: 0, width: 20, height: 600 }, { id: 'c4', x: 0, y: 580, width: 800, height: 20 }],
  interactions: [
    { id: 's4_down', type: 'stairs', label: 'Vers Étage 3', x: 120, y: 20, width: 60, height: 60, targetMapId: 'floor_03', targetSpawn: { x: 120, y: 100 }, actionPrompt: 'Descendre à l\'Étage 3' },
    { id: 's4_up', type: 'stairs', label: 'Vers Étage 5', x: 620, y: 20, width: 60, height: 60, targetMapId: 'floor_05', targetSpawn: { x: 400, y: 480 }, actionPrompt: 'Monter au Boss 1-5' },
    { id: 'm4', type: 'mission_zone', label: 'Épreuve 4', x: 400, y: 250, width: 80, height: 80, competencyId: 'frac_04', actionPrompt: 'Démarrer l\'épreuve 4' }
  ]
};

export const DEMO_FLOOR_05: RoomMap = {
  id: 'floor_05', name: 'Trône Intermédiaire - Étage 5', floorNumber: 5, width: 800, height: 600, spawnPoint: { x: 400, y: 480 },
  visualTiles: [{ id: 'w5', x: 0, y: 0, width: 800, height: 80, color: '#991b1b', layer: 'structure' }],
  collisions: [{ id: 'c1', x: 0, y: 0, width: 800, height: 80 }, { id: 'c2', x: 0, y: 0, width: 20, height: 600 }, { id: 'c3', x: 780, y: 0, width: 20, height: 600 }, { id: 'c4', x: 0, y: 580, width: 800, height: 20 }],
  interactions: [
    { id: 's5_down', type: 'stairs', label: 'Vers Étage 4', x: 120, y: 20, width: 60, height: 60, targetMapId: 'floor_04', targetSpawn: { x: 620, y: 100 }, actionPrompt: 'Descendre à l\'Étage 4' },
    { id: 's5_up', type: 'stairs', label: 'Vers Étage 6', x: 620, y: 20, width: 60, height: 60, targetMapId: 'floor_06', targetSpawn: { x: 120, y: 100 }, actionPrompt: 'Monter à l\'Étage 6' },
    { id: 'mboss1', type: 'mission_zone', label: 'Boss Synthèse 1-5', x: 360, y: 180, width: 90, height: 90, competencyId: 'frac_05', actionPrompt: 'Affronter le Boss 1-5' }
  ]
};

export const DEMO_FLOOR_06: RoomMap = {
  id: 'floor_06', name: 'Sanctuaire Décimal - Étage 6', floorNumber: 6, width: 800, height: 600, spawnPoint: { x: 120, y: 120 },
  visualTiles: [{ id: 'w6', x: 0, y: 0, width: 800, height: 80, color: '#0369a1', layer: 'structure' }],
  collisions: [{ id: 'c1', x: 0, y: 0, width: 800, height: 80 }, { id: 'c2', x: 0, y: 0, width: 20, height: 600 }, { id: 'c3', x: 780, y: 0, width: 20, height: 600 }, { id: 'c4', x: 0, y: 580, width: 800, height: 20 }],
  interactions: [
    { id: 's6_down', type: 'stairs', label: 'Vers Étage 5', x: 120, y: 20, width: 60, height: 60, targetMapId: 'floor_05', targetSpawn: { x: 620, y: 100 }, actionPrompt: 'Descendre à l\'Étage 5' },
    { id: 's6_up', type: 'stairs', label: 'Vers Étage 7', x: 620, y: 20, width: 60, height: 60, targetMapId: 'floor_07', targetSpawn: { x: 120, y: 100 }, actionPrompt: 'Monter à l\'Étage 7' },
    { id: 'm6', type: 'mission_zone', label: 'Épreuve 6', x: 400, y: 250, width: 80, height: 80, competencyId: 'frac_06', actionPrompt: 'Démarrer l\'épreuve 6' }
  ]
};

export const DEMO_FLOOR_07: RoomMap = {
  id: 'floor_07', name: 'Chambre de Conversion - Étage 7', floorNumber: 7, width: 800, height: 600, spawnPoint: { x: 120, y: 120 },
  visualTiles: [{ id: 'w7', x: 0, y: 0, width: 800, height: 80, color: '#4338ca', layer: 'structure' }],
  collisions: [{ id: 'c1', x: 0, y: 0, width: 800, height: 80 }, { id: 'c2', x: 0, y: 0, width: 20, height: 600 }, { id: 'c3', x: 780, y: 0, width: 20, height: 600 }, { id: 'c4', x: 0, y: 580, width: 800, height: 20 }],
  interactions: [
    { id: 's7_down', type: 'stairs', label: 'Vers Étage 6', x: 120, y: 20, width: 60, height: 60, targetMapId: 'floor_06', targetSpawn: { x: 620, y: 100 }, actionPrompt: 'Descendre à l\'Étage 6' },
    { id: 's7_up', type: 'stairs', label: 'Vers Étage 8 (Boss)', x: 620, y: 20, width: 60, height: 60, targetMapId: 'floor_08', targetSpawn: { x: 400, y: 480 }, actionPrompt: 'Monter au Boss Final !' },
    { id: 'm7', type: 'mission_zone', label: 'Épreuve 7', x: 400, y: 250, width: 80, height: 80, competencyId: 'frac_07', actionPrompt: 'Démarrer l\'épreuve 7' }
  ]
};

export const DEMO_FLOOR_08: RoomMap = {
  id: 'floor_08', name: 'Sommet de la Tour - Étage 8', floorNumber: 8, width: 800, height: 600, spawnPoint: { x: 400, y: 480 },
  visualTiles: [{ id: 'w8', x: 0, y: 0, width: 800, height: 80, color: '#4c1d95', layer: 'structure' }],
  collisions: [{ id: 'c1', x: 0, y: 0, width: 800, height: 80 }, { id: 'c2', x: 0, y: 0, width: 20, height: 600 }, { id: 'c3', x: 780, y: 0, width: 20, height: 600 }, { id: 'c4', x: 0, y: 580, width: 800, height: 20 }],
  interactions: [
    { id: 's8_down', type: 'stairs', label: 'Vers Étage 7', x: 120, y: 20, width: 60, height: 60, targetMapId: 'floor_07', targetSpawn: { x: 620, y: 100 }, actionPrompt: 'Descendre à l\'Étage 7' },
    { id: 'm8_boss', type: 'mission_zone', label: '👑 BOSS FINAL', x: 360, y: 180, width: 90, height: 90, competencyId: 'frac_08', actionPrompt: 'Affronter le Boss Final !' }
  ]
};

export const ALL_FLOORS: Record<string, RoomMap> = {
  floor_01: DEMO_FLOOR_01,
  floor_02: DEMO_FLOOR_02,
  floor_03: DEMO_FLOOR_03,
  floor_04: DEMO_FLOOR_04,
  floor_05: DEMO_FLOOR_05,
  floor_06: DEMO_FLOOR_06,
  floor_07: DEMO_FLOOR_07,
  floor_08: DEMO_FLOOR_08
};