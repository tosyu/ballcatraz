import 'phaser';

import { AbstractBlockObject } from './AbstractBlockObject';

export class WoodBlockObject extends AbstractBlockObject {
  constructor(game: Phaser.Game, x: number, y: number) {
    super(game, x, y);

    this.beginFill(0x583710);
    this.lineStyle(1, 0);
    this.drawRect(0, 0, 32, 10);

    this.lifePoints = 3;
  }
}
