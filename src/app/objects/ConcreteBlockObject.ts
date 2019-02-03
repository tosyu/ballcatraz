import 'phaser';

import { AbstractBlockObject } from './AbstractBlockObject';

export class ConcreteBlockObject extends AbstractBlockObject {
  constructor(game: Phaser.Game, x: number, y: number) {
    super(game, x, y);

    this.beginFill(0x4c4c4c);
    this.lineStyle(1, 0);
    this.drawRect(0, 0, 32, 10);

    this.lifePoints = 4;
  }
}
