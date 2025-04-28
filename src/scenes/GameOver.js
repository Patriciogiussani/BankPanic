import Phaser from 'phaser';

export default class GameOver extends Phaser.Scene {
    constructor() {
        super('GameOver');
    }

    
    create() {

        this.scene.stop('HUDScene');

        this.add.image(0, 0, 'fondoover').setOrigin(0).setScrollFactor(1).setScale;

        this.add.text(400, 250, 'GAME OVER', { fontFamily: '"Press Start 2P"', fontSize: '40px', color: '#000' }).setOrigin(0.5);

        this.time.delayedCall(3000, () => {
            this.scene.start('MainMenu');
        });

    }
}
