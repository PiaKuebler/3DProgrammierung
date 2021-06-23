import {config } from '../game.js';
import Hole from '../helpers/holes.js';

export default class DamScene extends Phaser.Scene {


holes = [null, null, null, null, null];

text;

amount = 0;

constructor(){
    super({ key: 'DamScene '});
}

//**********************************PRELOAD************************************************** 
preload() {
    this.load.image('background', 'assets/images/background.png');
    this.load.image('stones', 'assets/images/stones.png');
    this.load.image('hole1', 'assets/images/hole_1.png');
    this.load.image('hole2', 'assets/images/hole_2.png');
    this.load.image('hole3', 'assets/images/hole_3.png');
    this.load.spritesheet('waterfall', 'assets//images/waterfall.png',{ frameWidth: 345, frameHeight: 1729, endFrame: 60 });
    this.load.image('water', 'assets/images/water.png')
    this.load.spritesheet('watersplash', 'assets/images/splash.png',{ frameWidth: 438, frameHeight: 207, endFrame: 19 });

    this.load.audio('waterSound', ['assets/sounds/water.mp3']);
    this.load.audio('ambientSound', ['assets/sounds/ambient.mp3']);
}

//**********************************CREATE**************************************************
create() {
    const self = this;

    var background = this.add.image(config.scale.width/2, config.scale.height/2, 'background').setScale(config.scale.scaleY);
    var water = this.add.image(config.scale.width/2, config.scale.height/2, 'water').setScale(config.scale.scaleY).setDepth(2);
    var stones = this.add.image(config.scale.width/2, config.scale.height/2, 'stones').setScale(config.scale.scaleY).setDepth(10);

    var ambientSound =  this.sound.add('ambientSound').play({loop:true});

    this.anims.create({
        key: 'runningWater',
        frames: this.anims.generateFrameNumbers('waterfall'),
        frameRate: 50,
        repeat: -1
    });

    this.anims.create({
        key: 'splashingWater',
        frames: this.anims.generateFrameNumbers('watersplash'),
        frameRate: 20,
        repeat: -1
    });

    this.anims.create({
        key: 'comingHole',
        frames: this.anims.generateFrameNumbers('hole1','hole2', 'hole3'),
        frameRate: 30,
    });

    this.input.addPointer(5);

    var overlap = true;

    var timer = this.time.addEvent({ delay: 1000, callback: timerEvent, callbackScope: this, loop: true });

    var timedEvent = this.time.addEvent({ delay: 1000, callback: onEvent, callbackScope: this });

    function onEvent() {
        let xx;
        let yy;
        var overlap = true;

        timedEvent.reset({ delay: Phaser.Math.Between(1000, 2000), callback: onEvent, callbackScope: this, repeat: 1 });

        if (self.amount < 5) {
            for(var i = 0; i<5;i++){
               if (!overlap) 
               return;

                xx = Phaser.Math.Between(config.scale.width * .1, config.scale.width * .9);
                yy = Phaser.Math.Between(config.scale.height * .25, config.scale.height * .8);

                for (var i = 0; i < 5; i++) {
                    if (self.holes[i] != null) {
                        if ((xx < self.holes[i].x - 50 || xx > self.holes[i].x + 50) && (yy < self.holes[i].y - 50 || yy > self.holes[i].y + 50)) {
                            console.log(i, ': not overlapping');
                            overlap = false;
                        }
                        else {
                            overlap = true; console.log(i, ': overlapping');
                            console.log('--------------');
                            break;
                        }
                    }
                    else
                        overlap = false;
                }
             
            }
            
            console.log('**************************');
            for (var i = 0; i < 5; i++) {
                console.log('an Stelle ', i, ': ', self.holes[i]);
                if (self.holes[i] == null) {
                    self.holes[i] = this.add.existing(new Hole(this,xx,yy,config.scale.scaleY)).setScale(0.2);
                    //self.holes[i] = this.add.sprite(xx, yy, 'hole1').setInteractive().setScale(config.scale.scaleY);
                    // self.waterfall[i] = this.add.sprite(xx, yy, 'water1').setScale(config.scale.scaleY).setOrigin(0.5,0.05);    // setOrigin setzt den Wasserfall an das Loch hoch Muss auf 0 wenn die Sprites angespasst sin dund kaum Whitespace haben
                    // this.add.image(xx, yy, 'water1');
                    self.amount++;
                    break;
                }
            }
            console.log('**************************');
        }
        //_________________TIMER________________________________
        this.initialTime -= 1; // One second
        self.text.setText('Timer: ' + formatTime(this.initialTime));
        self.text.setFontSize(50);
        
    }

    this.input.on('gameobjectdown', function (pointer, gameObject, event) {
        console.log('pointerdown');
        if (gameObject != background) {
            var touchX = pointer.x;
            var touchY = pointer.y;
            for (var i = 0; i < 5; i++) {
                if (self.holes[i] == gameObject) {
                    self.holes[i].isHold = true;
                    self.holes[i].showWaterfall(false);
                     console.log('**',self.holes[i],'**');
                    break;
                }
            }
            gameObject.setTint(0xff0000);
        }


    });
    this.input.on('gameobjectup', function (pointer, gameObject, event) {
        console.log('gameobjectup')
        var touchX = pointer.x;
        var touchY = pointer.y;
        for (var i = 0; i < 5; i++) {
            if(gameObject == self.holes[i]){
                self.holes[i].showWaterfall(true);
                self.holes[i].isHold = false;
                self.holes[i].duration =0;
                }
        }
        gameObject.clearTint();

    });



    //_________________________________TIMER_________________________________________________
    function timerEvent() {
        for (var i = 0; i < 5; i++) {
            if(self.holes[i] == null) return;
            if(self.holes[i].isHold){
                self.holes[i].duration++;
            }
            if (self.holes[i].duration >= self.holes[i].holdTime) {
                self.holes[i].destroy();
                self.amount--;
                self.holes[i] = null;
            }           
        }
    }



    
    // 2:30 in seconds
    this.initialTime = 30;

    self.text = this.add.text(config.scale.width*0.8, config.scale.height*0.95, 'Timer: ' + formatTime(this.initialTime), {
        fontSize: 50
    });
    self.text.setDepth(11);

    // Each 1000 ms call onEvent
    timedEvent = this.time.addEvent({ delay: 1000, callback: onEvent, callbackScope: this, loop: true });

    function formatTime(seconds) {
        var minutes = Math.floor(seconds / 60);
        var partInSeconds = seconds % 60;
        partInSeconds = partInSeconds.toString().padStart(2, '0');
        return `${minutes}:${partInSeconds}`;
    }    
}






//**********************************UPDATE**************************************************
duration = 0
update() {
}

//**********************************RENDER**************************************************
render() {
    // this.game.debug.text(pointer.timeUp - pointer.timeDown, 32, 32);
}
}