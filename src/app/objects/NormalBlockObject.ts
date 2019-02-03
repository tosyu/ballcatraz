import 'phaser';

import { AbstractBlockObject } from './AbstractBlockObject';
import { Physics } from 'phaser-ce';

export class NormalBlockObject extends AbstractBlockObject {
  constructor(game: Phaser.Game, x: number, y: number) {
    super(game, x, y);

    this.beginFill(0x5d1717);
    this.lineStyle(1, 0);
    this.drawRect(0, 0, 32, 10);

    this.lifePoints = 1;
  }
}
