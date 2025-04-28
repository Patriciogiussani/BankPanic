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
        this.timers = [];

        // Para recibir puertas visibles
        this.puertas = [];

        // --- Rectángulo beige de 1UP ---
        this.add.rectangle(78, 25, 80, 30, 0xf5deb3).setOrigin(0.5).setScrollFactor(0);
        this.add.rectangle(243, 25, 186, 30, 0xf5deb3).setOrigin(0.5).setScrollFactor(0);
        this.add.text(47, 18, '1UP', { fontFamily: '"Press Start 2P"', fontSize: '20px', color: '#000000' }).setScrollFactor(0);
        this.scoreText = this.add.text(245, 18, '000000', { fontFamily: '"Press Start 2P"', fontSize: '20px', color: '#000000' }).setOrigin(0.5, 0).setScrollFactor(0);

        // --- Rectángulo beige de TOP ---
        this.add.rectangle(667, 25, 186, 30, 0xf5deb3).setOrigin(0.5).setScrollFactor(0);
        this.add.rectangle(503, 25, 78, 30, 0xf5deb3).setOrigin(0.5).setScrollFactor(0);
        this.add.text(474, 18, 'TOP', { fontFamily: '"Press Start 2P"', fontSize: '20px', color: '#000000' }).setScrollFactor(0);
        this.highScoreText = this.add.text(680, 18, this.highScore.toString().padStart(6, '0'), { fontFamily: '"Press Start 2P"', fontSize: '20px', color: '#000000' }).setOrigin(0.5, 0).setScrollFactor(0);

        // --- Reloj en el medio ---
        this.clock = this.add.image(400, 50, 'clock')
            .setOrigin(0.5)
            .setScale(1)
            .setScrollFactor(0);

        // --- FAIR abajo del reloj ---
        this.add.rectangle(400, 115, 100, 30, 0xf5deb3).setOrigin(0.5).setScrollFactor(0);
        this.add.text(400, 115, 'BANK', { fontFamily: '"Press Start 2P"', fontSize: '14px', color: '#000000' }).setOrigin(0.5).setScrollFactor(0);

        // --- Puertas 1 a 6 (izquierda) y 7 a 12 (derecha) ---
        for (let i = 0; i < 12; i++) {
            const lado = (i < 6) ? -1 : 1; // -1 izquierda, 1 derecha
            const idx = (i < 6) ? i : i - 6; // índice de 0 a 5 en cada lado
        
            const baseX = 350;
            const espacioX = 55;
            const yBase = 120;
        
            let x;
            if (lado === -1) {
                x = 400 - (baseX - idx * espacioX); // IZQUIERDA: hacia la izquierda
            } else {
                x = 125 + (baseX + idx * espacioX); // DERECHA: hacia la derecha
            }

            // 5 rectángulos amarillos (timer visual)
            const timerRects = [];
            // CORRECTO: de arriba hacia abajo
             for (let j = 0; j < 5; j++) {
             const rect = this.add.rectangle(x, yBase - 75 + (j * 8), 20, 6, 0xffff00)
             .setOrigin(0.5)
             .setScrollFactor(0);
             timerRects.push(rect);
              }

            // Cuadrado blanco (ícono money o bomba)
            const iconBox = this.add.rectangle(x, yBase - 25, 24, 24, 0xffffff)
                .setOrigin(0.5)
                .setScrollFactor(0);

                const moneyIcon = this.add.image(x, yBase - 25, 'icon_money')
                .setVisible(false)
                .setScale(0.6)
                .setScrollFactor(0);
            
            const bombIcon = this.add.image(x, yBase - 25, 'icon_bomb')
                .setVisible(false)
                .setScale(0.6)
                .setScrollFactor(0);

            // Número de puerta
            const num = this.add.text(x, yBase, (i + 1).toString(), {
                fontFamily: '"Press Start 2P"',
                fontSize: '16px',
                color: '#ff0000' // rojo por defecto
            }).setOrigin(0.5).setScrollFactor(0);

            this.puertaIndicators.push({ num, iconBox, moneyIcon, bombIcon, timerRects, timerIndex: 0, timerEvent: null });
        }
    }

    update(time, delta) {
        this.updatePuertasVisibles();
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
    
        puerta.moneyIcon.setVisible(false);
        puerta.bombIcon.setVisible(false);
    
        if (estado === 'normal') {
            puerta.iconBox.setFillStyle(0xffffff);
        } else if (estado === 'alerta') {
            puerta.iconBox.setFillStyle(0xffffff);
            this.startTimerForDoor(index);
        } else if (estado === 'npc') {
            puerta.iconBox.setFillStyle(0xffffff);
            this.stopTimerForDoor(index);
        } else if (estado === 'cobrado') {
            puerta.moneyIcon.setVisible(true); // <<< MOSTRAR DINERO
            this.stopTimerForDoor(index);
        } else if (estado === 'bomba') {
            puerta.bombIcon.setVisible(true); // <<< MOSTRAR BOMBA
            // NO apagar el moneyIcon si estaba antes
        }
    }

    startTimerForDoor(index) {
        const puerta = this.puertaIndicators[index];
        if (!puerta) return;

        if (puerta.timerEvent) {
            puerta.timerEvent.remove(false);
        }

        puerta.timerIndex = 0;

        puerta.timerEvent = this.time.addEvent({
            delay: 400,
            loop: true,
            callback: () => {
                puerta.timerRects.forEach(rect => rect.setFillStyle(0xffff00));
                if (puerta.timerIndex < puerta.timerRects.length) {
                    puerta.timerRects[puerta.timerIndex].setFillStyle(0xff0000);
                    puerta.timerIndex++;
                } else {
                    puerta.timerIndex = 0;
                }
            }
        });
    }

    stopTimerForDoor(index) {
        const puerta = this.puertaIndicators[index];
        if (!puerta) return;
        if (puerta.timerEvent) {
            puerta.timerEvent.remove(false);
            puerta.timerEvent = null;
        }
        puerta.timerRects.forEach(rect => rect.setFillStyle(0xffff00));
    }

    updatePuertasVisibles() {
        if (!this.puertas) return;
        const cam = this.scene.get('Nivel1')?.cameras.main || this.scene.get('Nivel2')?.cameras.main;
        if (!cam) return;

        this.puertas.forEach((door, index) => {
            const puertaHUD = this.puertaIndicators[index];
            if (!puertaHUD) return;
            const visible = door.x >= cam.scrollX && door.x < cam.scrollX + cam.width;
            puertaHUD.num.setColor(visible ? '#0000ff' : '#ff0000');
        });
    }

    setPuertas(puertas) {
        this.puertas = puertas;
    }

    
}
