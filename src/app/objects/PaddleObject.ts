import 'phaser';

export class PaddleObject extends Phaser.Graphics {
  constructor(game: Phaser.Game, x: number, y: number) {
    super(game, x, y);

    this.beginFill(0x0000ff);
    this.drawRect(0, 0, 32, 10);
  }
}
