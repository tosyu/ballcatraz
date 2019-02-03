import 'phaser';

import { createBlock, PaddleObject, BallObject, IBlockObject } from '../objects';
import { Physics } from 'phaser-ce';

const pow = Math.pow;
const max = Math.max;
const min = Math.min;
const abs = Math.abs;

function clamp(v: number, vmin: number, vmax: number): number {
  return min(vmax, max(vmin, v));
}

const DEFAULT_BALL_SPEED = 100;

export class GameState extends Phaser.State {

  blocks: Phaser.Group;
  paddle: Phaser.Graphics;
  ball: Phaser.Graphics;

  levelName: string;

  init(levelName: string) {
    this.levelName = levelName;
    this.load.onLoadStart.add(() => console.log('loading'));
    this.load.onLoadComplete.add(() => console.log('loaded'));
  }

  preload() {
    this.load.text(this.levelName, ['/assets/maps', `${this.levelName}.map`].join('/'));
  }

  create() {
    this.physics.startSystem(Phaser.Physics.ARCADE);

    const map: number[] = this.cache.getText(this.levelName)
      .replace(/[^0-9]+/gi, '')
      .split('')
      .map(c => parseFloat(c.trim()));

    this.blocks = this.game.add.group();
    this.blocks.enableBody = true;
    this.blocks.physicsBodyType = Phaser.Physics.ARCADE;
    let c = 0;
    for (let i = 0; i < 10; i += 1) {
      for (let j = 0; j < 10; j += 1) {
        if (map[c] > 0) {
          const block = createBlock(map[c], this.game, j * 32, i * 10);

          this.physics.enable(block);
          (block.body as Phaser.Physics.Arcade.Body).immovable = true;

          this.blocks.add(block);
        }
        c += 1;
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
    const ballWidth = this.ball.width;
    ballBody.setCircle(ballWidth / 2, -(ballWidth / 2), -(ballWidth / 2));
    ballBody.allowRotation = false;
    ballBody.collideWorldBounds = true;
    ballBody.velocity.set(1, 1);
    ballBody.velocity.setMagnitude(100);
    ballBody.bounce.set(1);

    ballBody.onWorldBounds = new Phaser.Signal();
    ballBody.onWorldBounds.add(this.onBallCollideWithBounds, this);
  }

  render() {
    this.game.debug.body(this.ball);
    this.game.debug.body(this.paddle);
  }

  update() {
    this.physics.arcade.collide(this.ball, this.paddle, this.onBallCollideWithPaddle, null, this);
    this.physics.arcade.collide(this.ball, this.blocks, this.onBallCollideWithBlock, null, this);
  }

  private onBallCollideWithBounds(ball: BallObject, up: boolean, down: boolean) {
    if (down) {
      this.state.start('game', true, true, this.levelName);
    }
  }

  private onBallCollideWithPaddle(ball: BallObject, paddle: PaddleObject) {
    // this efectively modifies the direction of the bounce so that is a little more
    // to the side as it approaches the end of the paddle, gives the user more control
    const diff = paddle.centerX + 2 - ball.centerX;
    const amount = (abs(diff) / (paddle.width / 2)) / 0.8;
    const ease = pow(clamp(amount, 0, 1), 2);
    const force = (diff > 0 ? -1 : 1) * ease;

    const velocity = ball.body.velocity;
    const magnitude = velocity.getMagnitude();

    velocity.normalize().add(force, 0);
    this.resetBallSpeed();
  }

  private onBallCollideWithBlock(ball: BallObject, block: IBlockObject) {
    this.resetBallSpeed();
    block.hit();
    if (block.isDead()) {
      block.destroy();
    }
  }

  private resetBallSpeed(speed: number = DEFAULT_BALL_SPEED) {
    this.ball.body.velocity.setMagnitude(DEFAULT_BALL_SPEED);
  }
}
