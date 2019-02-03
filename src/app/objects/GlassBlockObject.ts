import 'phaser';

import { AbstractBlockObject } from './AbstractBlockObject';

export class GlassBlockObject extends AbstractBlockObject {
  constructor(game: Phaser.Game, x: number, y: number) {
    super(game, x, y);

    this.beginFill(0x81a5d8);
    this.lineStyle(1, 0);
    this.drawRect(0, 0, 32, 10);

    this.lifePoints = 2;
  }
}
