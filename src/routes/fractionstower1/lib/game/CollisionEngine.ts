
import type { BoundingBox, CollisionZone } from '../types/world';

export class CollisionEngine {
  public static intersects(a: BoundingBox, b: BoundingBox): boolean {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }

  public static canMoveTo(
    nextX: number,
    nextY: number,
    playerWidth: number,
    playerHeight: number,
    mapWidth: number,
    mapHeight: number,
    collisions: CollisionZone[]
  ): boolean {
    if (
      nextX < 0 ||
      nextY < 0 ||
      nextX + playerWidth > mapWidth ||
      nextY + playerHeight > mapHeight
    ) {
      return false;
    }

    const proposedBox: BoundingBox = {
      x: nextX,
      y: nextY,
      width: playerWidth,
      height: playerHeight
    };

    for (const obstacle of collisions) {
      if (this.intersects(proposedBox, obstacle)) {
        return false;
      }
    }

    return true;
  }
}