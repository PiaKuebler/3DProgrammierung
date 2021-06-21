import { config } from '../game.js'

export default class Hole extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y, scale){

        var texture;
       
        switch(Phaser.Math.Between(0,2)){
            case 0: texture = 'hole1';
            break;
            case 1: texture = 'hole2';
            break;
            case 2: texture = 'hole3';
            break;
        }
        
        super(scene, x, y, texture);
        this.setScale(scale);
        
        this.setInteractive();

        this.duration = 0;
        this.isHold = false;
        this.holdTime = Phaser.Math.Between(1,5);
        
        this.waterfall = scene.add.sprite(x, y, 'waterfall').setScale(config.scale.scaleY).setOrigin(0.45,0.04).setDepth(1);    // setOrigin setzt den Wasserfall an das Loch hoch Muss auf 0 wenn die Sprites angespasst sin dund kaum Whitespace haben
        this.waterfall.play('runningWater');

        this.watersplash = scene.add.sprite(x, 0.94*config.scale.height, 'watersplash').setScale(config.scale.scaleY).setOrigin(0.5,1).setDepth(3);    // setOrigin setzt den Wasserfall an das Loch hoch Muss auf 0 wenn die Sprites angespasst sin dund kaum Whitespace haben
        this.watersplash.play('splashingWater');

      //  this.waterSound = this.sound.add('waterSound', {loop:true});
    }
    showWaterfall(hide){
        this.waterfall.setVisible(hide);
        this.watersplash.setVisible(hide);
    }

}
