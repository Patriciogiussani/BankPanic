import Phaser from 'phaser';

export default class LifeLostScene extends Phaser.Scene {
    constructor() {
        super('LifeLost');
    }

    create(data) {

        this.scene.launch('HUDScene');

        this.add.image(0, 0, 'fondojuego').setOrigin(0).setScrollFactor(1).setScale;
        this.player = this.add.sprite(400, 320, 'player').setScale(0.8).setFrame(0);
        
          // 🎵 Reproducir música de life lost
   // this.musica = this.sound.add('musica_life_lost', { loop: false });
   // this.musica.play();

        this.time.delayedCall(300, () => {
            this.player.setFrame(2); // Impactado
            this.add.sprite(this.player.x - 50, this.player.y - 30, 'disparo').play('disparo_anim');
            this.add.sprite(this.player.x + 50, this.player.y - 10, 'disparo').play('disparo_anim');
        });

        this.time.delayedCall(1000, () => {
            this.player.setFrame(3); // Caído
        });

        this.time.delayedCall(2000, () => {
          //  this.musica.stop(); // 🔇 Detener música al cambiar de escena
            if (data.gameover) {
                this.scene.start('GameOver');
            } else {
                this.scene.start('RoundStart', { round: data.round, lives: data.lives });
            }
        });
    }
}
