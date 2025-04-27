import Phaser from 'phaser';

export default class RoundStartScene extends Phaser.Scene {
    constructor() {
        super('RoundStart');
    }

    create(data) {

        this.scene.launch('HUDScene');

        this.add.image(400, 300, 'fondo_menu').setScale(2);

        this.add.text(400, 100, 'READY !', { fontFamily: 'Arial', fontSize: '48px', color: '#000' }).setOrigin(0.5);
        this.add.text(400, 200, `ROUND... ${data.round.toString().padStart(2, '0')}`, { fontFamily: 'Arial', fontSize: '36px', color: '#000' }).setOrigin(0.5);

        for (let i = 0; i < data.lives; i++) {
            this.add.image(300 + i * 100, 300, 'vida_icono').setScale(1.5);
        }

        this.add.text(400, 400, 'NEXT EXTRA POINT', { fontFamily: 'Arial', fontSize: '24px', color: '#000' }).setOrigin(0.5);
        this.add.text(400, 450, '70000', { fontFamily: 'Arial', fontSize: '24px', color: '#000' }).setOrigin(0.5);

        this.round = data.round;
        this.lives = data.lives;

        this.time.delayedCall(3000, () => {
            if (this.round === 1) {
                this.scene.start('Nivel1', { lives: this.lives, score: this.score });
            } else {
                this.scene.start('Nivel2', { lives: this.lives, score: this.score });
            }
        });
        
    }
}
