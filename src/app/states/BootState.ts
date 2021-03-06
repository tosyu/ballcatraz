import 'pixi';

export class BootState extends Phaser.State {
  preload() {}
  create() {
    this.scale.minWidth = 320;
    this.scale.maxWidth = window.screen.width;
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
  }
  update() {
    this.state.start('game', true, true, '00-test');
  }
}
