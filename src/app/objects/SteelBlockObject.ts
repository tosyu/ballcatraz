import 'phaser';

import { AbstractBlockObject } from './AbstractBlockObject';
import { Physics } from 'phaser-ce';

export class SteelBlockObject extends AbstractBlockObject {
  constructor(game: Phaser.Game, x: number, y: number) {
    super(game, x, y);

    this.beginFill(0xc1c1c1);
    this.lineStyle(1, 0);
    this.drawRect(0, 0, 32, 10);
  }

  hit(what?: Phaser.Physics.Arcade.Body) {}

  isDead() {
    return false;
  }
}
