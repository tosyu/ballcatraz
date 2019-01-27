import 'phaser';

export class GameState extends Phaser.State {

  blocks: Phaser.Group;
  paddle: Phaser.Graphics;
  ball: Phaser.Graphics;

  preload() {}

  create() {
    this.blocks = this.game.add.group();
    for (let i = 0; i < 10; i += 1) {
      for (let j = 0; j < 32; j += 1) {
        const block = this.game.add.graphics(j * 32, i * 10);

        block.beginFill(0xff0000);
        block.lineStyle(1, 0);
        block.drawRect(0, 0, 32, 10);

        this.blocks.add(block);
      }
    }

    const centerX = this.game.width / 2;

    this.paddle = this.game.add.graphics(centerX - 16, this.game.height - 32);
    this.paddle.beginFill(0x0000ff);
    this.paddle.drawRect(0, 0, 32, 10);

    this.ball = this.game.add.graphics(centerX, this.game.height - 40);
    this.ball.beginFill(0x00ff00);
    this.ball.drawCircle(0, 0, 5);
  }

  update() {
    this.input.position.clampX(0, this.game.width - this.paddle.width);
    this.paddle.position.x = this.input.position.x;
  }
}
