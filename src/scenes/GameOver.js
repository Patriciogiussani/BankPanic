import Phaser from 'phaser';

export default class GameOver extends Phaser.Scene {
    constructor() {
        super('GameOver');
    }

    
    create() {

        this.scene.stop('HUDScene');

        const video = this.add.video(400, 300, 'gameover_video').setScale(1.5); // ajustá el scale si hace falta

        video.play(true);

        video.on('complete', () => {
            this.scene.start('MainMenu'); // O donde quieras volver después del game over
        });
    }
}
