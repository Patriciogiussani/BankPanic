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

        // 🎮 Crear input manager para capturar el joystick
        this.inputManager = new InputManager(this);
        this.inputManager.setup();

        // Texto para indicar que hay que presionar Options
        this.add.text(400, 600, 'PRESIONA OPTIONS PARA COMENZAR', {
            fontSize: '24px',
            color: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 20, y: 10 },
            fontFamily: 'Arial',
        }).setOrigin(0.5);
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
