import Phaser from 'phaser';

export default class IntroAnimScene extends Phaser.Scene {
    constructor() {
        super('IntroAnim');
    }

    create(data) {

        this.scene.launch('HUDScene');

        this.add.image(0, 0, 'fondojuego').setOrigin(0).setScrollFactor(1).setScale;
        this.nivel = data.nivel; // guardamos si es 1 o 2

        this.player = this.add.sprite(400, 320, 'player').setScale(0.8).setFrame(0); // Frame inicial

        // 🎵 Reproducir música de intro
       // this.musica = this.sound.add('musica_intro', { loop: false });
       // this.musica.play();

        this.time.delayedCall(500, () => {
            this.player.setFrame(1); // Disparo
            this.add.sprite(this.player.x - 50, this.player.y - 10, 'disparo').play('disparo_anim');
        });

        this.time.delayedCall(1500, () => {
          //  this.musica.stop(); // 🔇 Detener música cuando pase de escena
            this.scene.start('RoundStart', { round: this.nivel, lives: 3 });
        });
    }
}
