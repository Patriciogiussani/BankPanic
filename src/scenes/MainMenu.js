// src/scenes/MainMenu.js
import Phaser from 'phaser';
import { InputManager } from './inputManager.js'; // AÑADIDO para usar el inputManager

export default class MainMenu extends Phaser.Scene {
    constructor() {
        super('MainMenu');
    }

    create() {
        this.scene.stop('HUDScene');

        // Fondo del menú
        this.add.image(1180, 720, 'fondo_menu').setOrigin(1);
        this.add.image(745, 520, 'titulo').setOrigin(1);
        this.add.text(445, 500, 'PUSH OPTIONS BOTTOM', { fontFamily: '"Press Start 2P"', fontSize: '20px', color: '#000' }).setOrigin(0.5);

        // 🎮 Crear input manager para capturar el joystick
        this.inputManager = new InputManager(this);
        this.inputManager.setup();

        
    }

    update() {
        this.inputManager.update();

        if (this.inputManager.pad) {
            if (this.inputManager.pad.buttons[9]?.pressed) { // BOTÓN OPTIONS es el 9
                this.scene.start('IntroAnim', { nivel: 1 }); // Arrancar Nivel 1
            }
        }
    }
}
