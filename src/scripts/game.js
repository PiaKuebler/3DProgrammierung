import 'phaser'
import '@babel/polyfill'

import DamScene from './scenes/damScene';

const DEFAULT_WIDTH = 1921
const DEFAULT_HEIGHT = 1081


var config = {
  type: Phaser.AUTO,
  backgroundColor: '#ffffff',
  scale: {
    parent: 'phaser-game',
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
    scaleY: DEFAULT_HEIGHT/1081,
    scaleX: DEFAULT_WIDTH/1921
  },
  scene: [DamScene],
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
      gravity: { y: 400 }
    }
  },
  audio: {
    disableWebAudio: true
}
}

window.addEventListener('load', () => {
  const game = new Phaser.Game(config)
})

export { config };
