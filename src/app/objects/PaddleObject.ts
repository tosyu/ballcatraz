import 'phaser';

export class PaddleObject extends Phaser.Graphics {
  constructor(game: Phaser.Game, x: number, y: number) {
    super(game, x, y);

    this.beginFill(0x0000ff);
    this.drawRect(0, 0, 32, 10);

    game.input.addMoveCallback(this.mouseMove, this);
    game.input.onDown.add(this.mouseDown, this);

    game.paused = true;
  }

  destroy() {
    this.game.input.deleteMoveCallback(this.mouseMove, this);
    this.game.input.onDown.remove(this.mouseDown, this);
    super.destroy();
  }

  mouseDown() {
    this.game.paused = !this.game.paused;
  }

  mouseMove(pointer: Phaser.Pointer, x: number, y: number) {
    if (!this.game.paused) {
      this.position.x = x;
      this.position.clampX(0, this.game.width);
    }
  }
}
