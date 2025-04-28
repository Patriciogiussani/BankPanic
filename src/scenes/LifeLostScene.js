// src/scenes/LifeLostScene.js
import Phaser from 'phaser';

export default class LifeLostScene extends Phaser.Scene {
    constructor() {
        super('LifeLost');
    }

    create(data) {
        this.scene.launch('HUDScene');

        this.add.image(0, 0, 'fondojuego').setOrigin(0).setScrollFactor(1).setScale;
        this.player = this.add.sprite(400, 320, 'player').setScale(0.8).setFrame(0);

        this.time.delayedCall(300, () => {
            this.player.setFrame(2); // Impactado
            this.add.sprite(this.player.x - 50, this.player.y - 30, 'disparo').play('disparo_anim');
            this.add.sprite(this.player.x + 50, this.player.y - 10, 'disparo').play('disparo_anim');
        });

        this.time.delayedCall(1000, () => {
            this.player.setFrame(3); // Caído
        });

        this.time.delayedCall(2000, () => {
            if (data.gameover) {
                // <<< Si es Game Over, ir a GameOver
                this.scene.start('GameOver');
            } else {
                // <<< Si no, seguir a RoundStart y pasar todo
                this.scene.start('RoundStart', {
                    round: data.round,
                    lives: data.lives,
                    score: data.score,
                    puertasEstado: data.puertasEstado
                });
            }
        });
    }
}