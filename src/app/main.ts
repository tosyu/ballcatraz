import 'p2';
import 'pixi';
import 'phaser';

import '../sass/main.scss';

const WIDTH = 320;
const HEIGHT = WIDTH * 0.75;

class Ballcatraz{
  game: Phaser.Game;

  constructor() {
    this.game = new Phaser.Game(
      320,
      240,
      Phaser.AUTO,
      '', {
        preload: () => this.preload(),
        create: () => this.create(),
        update: () => this.update(),
      },
    );
  }

  preload() {
    console.log('preload');
  }

  create() {
    console.log('create');
    this.game.canvas.setAttribute('width', `${WIDTH}`);
    this.game.canvas.setAttribute('height', `${HEIGHT}`);
  }

  update() {
    // console.log('update');
  }
}

(function start() {
  const main = new Ballcatraz();
}());
