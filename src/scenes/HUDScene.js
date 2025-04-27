// src/scenes/HUDScene.js
import Phaser from 'phaser';

export default class HUDScene extends Phaser.Scene {
    constructor() {
        super('HUDScene');
    }

    create() {
        this.puertaIndicators = [];
        this.score = 0;
        this.lives = 3;
        this.highScore = 70000;

        // --- 1UP y High Score ---
        this.add.text(60, 10, '1UP', { fontFamily: 'PixelFont', fontSize: '16px', color: '#ffffff' }).setScrollFactor(0);
        this.scoreText = this.add.text(60, 30, '000000', { fontFamily: 'PixelFont', fontSize: '16px', color: '#ffffff' }).setScrollFactor(0);

        this.add.text(400, 10, 'HIGH SCORE', { fontFamily: 'PixelFont', fontSize: '16px', color: '#ffffff' }).setOrigin(0.5, 0).setScrollFactor(0);
        this.highScoreText = this.add.text(400, 30, this.highScore.toString().padStart(6, '0'), { fontFamily: 'PixelFont', fontSize: '16px', color: '#ffffff' }).setOrigin(0.5, 0).setScrollFactor(0);

        // --- Reloj como imagen fija ---
        this.clock = this.add.image(400, 80, 'clock')
            .setOrigin(0.5)
            .setScale(1)
            .setScrollFactor(0);

        // --- Rectángulos + Números + Íconos arriba ---
        for (let i = 0; i < 12; i++) {
            const x = 100 + i * 50;
            const y = 140;

            const box = this.add.rectangle(x, y, 32, 32, 0xffffff)
                .setOrigin(0.5)
                .setStrokeStyle(2, 0xffffff)
                .setScrollFactor(0);

            const num = this.add.text(x, y, (i + 1).toString(), {
                fontFamily: 'PixelFont',
                fontSize: '16px',
                color: '#000000'
            }).setOrigin(0.5).setScrollFactor(0);

            const icon = this.add.image(x, y - 25, 'icon_money')
                .setVisible(false)
                .setScale(0.6)
                .setScrollFactor(0);

            this.puertaIndicators.push({ box, num, icon, state: 'normal' });
        }
    }

    updateHUD(score, lives) {
        this.score = score;
        this.lives = lives;
        this.scoreText.setText(score.toString().padStart(6, '0'));

        if (score > this.highScore) {
            this.highScore = score;
            this.highScoreText.setText(score.toString().padStart(6, '0'));
        }
    }

    updatePuerta(index, estado) {
        const puerta = this.puertaIndicators[index];
        if (!puerta) return;

        puerta.icon.setVisible(false);

        if (estado === 'normal') {
            puerta.box.setFillStyle(0xffffff);
            puerta.num.setColor('#000000');
        } else if (estado === 'alerta') {
            puerta.box.setFillStyle(0xff0000);
            puerta.num.setColor('#ffffff');
        } else if (estado === 'npc') {
            puerta.box.setFillStyle(0xffff00);
            puerta.num.setColor('#000000');
        } else if (estado === 'cobrado') {
            puerta.box.setFillStyle(0x00ff00);
            puerta.num.setColor('#000000');
            puerta.icon.setTexture('icon_money');
            puerta.icon.setVisible(true);
        } else if (estado === 'bomba') {
            puerta.box.setFillStyle(0xff00ff);
            puerta.num.setColor('#000000');
            puerta.icon.setTexture('icon_bomb');
            puerta.icon.setVisible(true);
        }
    }
}
