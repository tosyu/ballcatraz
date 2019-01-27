import 'phaser';

import { BlockObject, PaddleObject, BallObject } from '../objects';

export class GameState extends Phaser.State {

  blocks: Phaser.Group;
  paddle: Phaser.Graphics;
  ball: Phaser.Graphics;

  preload() {}

  create() {
    this.physics.startSystem(Phaser.Physics.ARCADE);

    this.blocks = this.game.add.group();
    this.blocks.enableBody = true;
    this.blocks.physicsBodyType = Phaser.Physics.ARCADE;
    for (let i = 0; i < 10; i += 1) {
      for (let j = 0; j < 32; j += 1) {
        const block = new BlockObject(this.game, j * 32, i * 10);

        this.physics.enable(block);
        (block.body as Phaser.Physics.Arcade.Body).immovable = true;

        this.blocks.add(block);
      }
    }
    this.world.add(this.blocks);

    const centerX = this.game.width / 2;

    this.paddle = this.world.add(new PaddleObject(this.game, centerX - 16, this.game.height - 32));
    this.physics.enable(this.paddle);
    this.paddle.body.immovable = true;

    this.ball = this.world.add(new BallObject(this.game, centerX, this.game.height - 40));
    this.physics.enable(this.ball);

    const ballBody = (this.ball.body as Phaser.Physics.Arcade.Body);
    ballBody.collideWorldBounds = true;
    ballBody.velocity.set(centerX + 5, this.game.height / 2);
    ballBody.bounce.set(1);
  }

  update() {
    this.physics.arcade.collide(this.ball, this.paddle);
    this.physics.arcade.collide(this.ball, this.blocks, this.onBallCollide);
  }

  onBallCollide(ball: BallObject, block: BlockObject) {
    block.destroy();
  }
}
