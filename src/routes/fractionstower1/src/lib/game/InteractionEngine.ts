import type { BoundingBox, PlayerState } from '$lib/fractionstower1/types/world';
import type { InteractionZone } from '$lib/fractionstower1/types/interaction';
import { CollisionEngine } from './CollisionEngine';

export class InteractionEngine {
  public static getActiveInteraction(
    player: PlayerState,
    interactions: InteractionZone[]
  ): InteractionZone | null {
    const detectionBox: BoundingBox = {
      x: player.x - 4,
      y: player.y - 4,
      width: player.width + 8,
      height: player.height + 8
    };

    for (const zone of interactions) {
      if (CollisionEngine.intersects(detectionBox, zone)) {
        return zone;
      }
    }

    return null;
  }
}