import 'phaser';

const max = Math.max;
const min = Math.min;

export class PaddleObject extends Phaser.Graphics {
  private dragging: boolean;
  private leftKey: Phaser.Key;
  private rightKey: Phaser.Key;
  private pad1: Phaser.SinglePad;

  constructor(game: Phaser.Game, x: number, y: number) {
    super(game, x, y);

    this.beginFill(0x0000ff);
    this.drawRect(0, 0, 32, 10);

    game.input.addMoveCallback(this.onMove, this);
    game.input.onDown.add(this.onDown, this);
    game.input.onUp.add(this.onUp, this);

    this.leftKey = game.input.keyboard.addKey(Phaser.KeyCode.LEFT);
    this.rightKey = game.input.keyboard.addKey(Phaser.KeyCode.RIGHT);

    game.input.gamepad.start();
    this.pad1 = game.input.gamepad.pad1;

    this.dragging = false;
  }

  destroy() {
    this.game.input.deleteMoveCallback(this.onMove, this);
    this.game.input.onDown.remove(this.onDown, this);
    this.game.input.onUp.remove(this.onUp, this);
    this.game.input.keyboard.removeKey(Phaser.KeyCode.LEFT);
    this.game.input.keyboard.removeKey(Phaser.KeyCode.RIGHT);
    super.destroy();
  }

  onKeyDown(event: KeyboardEvent) {
    let x = this.position.x;
    switch (event.keyCode) {
      case Phaser.KeyCode.LEFT:
        x -= 10;
        break;
      case Phaser.KeyCode.RIGHT:
        x += 10;
        break;
    }

  }

  update() {
    super.update();

    if (this.leftKey.isDown) {
      this.position.x -= 3;
    }

    if (this.rightKey.isDown) {
      this.position.x += 3;
    }

    if (this.game.input.gamepad.supported
      && this.game.input.gamepad.active
      && this.pad1.connected) {
      if (this.pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT)
        || this.pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -.1) {
        this.position.x -= 3;
      }

      if (this.pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT)
        || this.pad1.axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_X) > .1) {
        this.position.x += 3;
      }
    }

    this.position.x = max(0, min(this.game.width, this.position.x));
  }

  isDragging() {
    return this.dragging;
  }

  onDown(pointer: Phaser.Pointer) {
    if (this.getBounds().contains(pointer.x, pointer.y)) {
      this.dragging = true;
    }
  }

  onUp() {
    // this needs to be timed out
    setTimeout(() => this.dragging = false, 200);
  }

  onMove(pointer: Phaser.Pointer, x: number, y: number) {
    if (!this.game.paused && (this.game.device.desktop ||
      (!this.game.device.desktop && this.dragging))) {
      this.position.x = x - this.width / 2;
    }
  }
}
