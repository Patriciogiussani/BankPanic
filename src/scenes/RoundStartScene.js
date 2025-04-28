import Phaser from 'phaser';

export default class RoundStartScene extends Phaser.Scene {
    constructor() {
        super('RoundStart');
    }

    create(data) {
        this.scene.launch('HUDScene');

        this.add.image(0, 0, 'fondoround').setOrigin(0).setScrollFactor(1);

        this.round = data.round || 1;
        this.lives = data.lives || 3;
        this.score = data.score || 0;

        if (data.round === 'win') {
            this.add.text(400, 200, '¡FELICITACIONES!', { fontFamily: '"Press Start 2P"', fontSize: '30px', color: '#000' }).setOrigin(0.5);
            this.add.text(400, 300, '¡GANASTE EL JUEGO!', { fontFamily: '"Press Start 2P"', fontSize: '24px', color: '#000' }).setOrigin(0.5);
            this.add.text(400, 400, `PUNTAJE FINAL: ${data.score}`, { fontFamily: '"Press Start 2P"', fontSize: '20px', color: '#000' }).setOrigin(0.5);
        
            // Ahora permite continuar infinitamente
            this.add.text(400, 500, 'PRESS OPTIONS TO CONTINUE', { fontFamily: '"Press Start 2P"', fontSize: '20px', color: '#000' }).setOrigin(0.5);

            this.input.gamepad.once('down', (pad, button) => {
                if (button.index === 9) { // Botón Options en PS4
                    this.scene.start('RoundStart', { round: 3, lives: this.lives, score: this.score });
                }
            });
        } else {
       
        this.add.text(400, 200, 'READY !', { fontFamily: '"Press Start 2P"', fontSize: '40px', color: '#000' }).setOrigin(0.5);
        this.add.text(400, 300, `ROUND... ${data.round.toString().padStart(2, '0')}`, { fontFamily: '"Press Start 2P"', fontSize: '30px', color: '#000' }).setOrigin(0.5);

        for (let i = 0; i < this.lives; i++) {
            this.add.image(300 + i * 100, 400, 'vida_icono').setScale(1.3);
        }

        this.add.text(400, 500, 'NEXT EXTRA POINT', { fontFamily: '"Press Start 2P"', fontSize: '20px', color: '#000' }).setOrigin(0.5);
        this.add.text(400, 550, '70000', { fontFamily: '"Press Start 2P"', fontSize: '20px', color: '#000' }).setOrigin(0.5);

        this.time.delayedCall(3000, () => {
            if (this.round === 1) {
                this.scene.start('Nivel1', { lives: this.lives, score: this.score });
            } else if (this.round === 2) {
                this.scene.start('Nivel2', { lives: this.lives, score: this.score });
            } else {
                this.scene.start('Nivel3', { round: this.round, lives: this.lives, score: this.score });
            }
        });
    }
}
}