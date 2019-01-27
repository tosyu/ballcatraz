import 'phaser';

export class BlockObject extends Phaser.Graphics {
  constructor(game: Phaser.Game, x: number, y: number) {
    super(game, x, y);

    this.beginFill(0xff0000);
    this.lineStyle(1, 0);
    this.drawRect(0, 0, 32, 10);
  }

  destroy() {
    this.parent.removeChild(this);
    super.destroy();
  }
}
