import type { PlayerState, RoomMap } from '$lib/fractionstower1/types/world';
import type { InteractionZone } from '$lib/fractionstower1/types/interaction';
import { CollisionEngine } from './CollisionEngine';
import { InteractionEngine } from './InteractionEngine';

export class GameStateController {
  public player: PlayerState = {
    x: 100,
    y: 100,
    width: 32,
    height: 32,
    speed: 3,
    direction: 'down',
    isMoving: false
  };

  public currentMap: RoomMap | null = null;
  public debugMode: boolean = false;
  public activeInteraction: InteractionZone | null = null;

  constructor(initialMap?: RoomMap) {
    if (initialMap) {
      this.loadMap(initialMap);
    }
  }

  public loadMap(map: RoomMap): void {
    this.currentMap = map;
    this.player.x = map.spawnPoint.x;
    this.player.y = map.spawnPoint.y;
    this.activeInteraction = null;
  }

  public toggleDebugMode(): void {
    this.debugMode = !this.debugMode;
  }

  public movePlayer(deltaX: number, deltaY: number): void {
    if (!this.currentMap) return;

    if (deltaX < 0) this.player.direction = 'left';
    else if (deltaX > 0) this.player.direction = 'right';
    else if (deltaY < 0) this.player.direction = 'up';
    else if (deltaY > 0) this.player.direction = 'down';

    const nextX = this.player.x + deltaX * this.player.speed;
    const nextY = this.player.y + deltaY * this.player.speed;

    const canMove = CollisionEngine.canMoveTo(
      nextX,
      nextY,
      this.player.width,
      this.player.height,
      this.currentMap.width,
      this.currentMap.height,
      this.currentMap.collisions
    );

    if (canMove) {
      this.player.x = nextX;
      this.player.y = nextY;
      this.player.isMoving = true;
    } else {
      this.player.isMoving = false;
    }

    this.activeInteraction = InteractionEngine.getActiveInteraction(
      this.player,
      this.currentMap.interactions
    );
  }

  public stopPlayer(): void {
    this.player.isMoving = false;
  }
}