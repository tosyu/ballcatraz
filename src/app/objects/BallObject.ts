import 'phaser';

export class BallObject extends Phaser.Graphics {
  constructor(game: Phaser.Game, x: number, y: number) {
    super(game, x, y);

    this.beginFill(0x00ff00);
    this.drawCircle(0, 0, 5);
  }
}
