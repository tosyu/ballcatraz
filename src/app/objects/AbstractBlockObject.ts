import 'phaser';

import { IBlockObject } from './BlockObject.def';

export abstract class AbstractBlockObject
  extends Phaser.Graphics implements IBlockObject {

  lifePoints: number = 0;

  hit(what?: Phaser.Physics.Arcade.Body): void {
    this.lifePoints -= 1;
  }

  isDead(): boolean {
    return this.lifePoints <= 0;
  }

  destroy() {
    if (this.parent) {
      this.parent.removeChild(this);
    }
    super.destroy();
  }
}
