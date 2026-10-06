import type { InteractionZone } from './interaction';

export interface Vector2D {
  x: number;
  y: number;
}

export interface Size2D {
  width: number;
  height: number;
}

export interface BoundingBox extends Vector2D, Size2D {}

export interface PlayerState {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  direction: 'up' | 'down' | 'left' | 'right';
  isMoving: boolean;
}

export interface VisualTile {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  assetUrl?: string;
  color?: string;
  label?: string;
  layer: 'ground' | 'structure' | 'decoration';
}

export interface CollisionZone extends BoundingBox {
  id: string;
  label?: string;
}

export interface RoomMap {
  id: string;
  name: string;
  floorNumber: number;
  width: number;
  height: number;
  spawnPoint: Vector2D;
  visualTiles: VisualTile[];
  collisions: CollisionZone[];
  interactions: InteractionZone[];
}