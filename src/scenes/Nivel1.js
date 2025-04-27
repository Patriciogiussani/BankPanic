// src/scenes/Nivel1.js
import Door from '../objects/doors.js';
import Player from '../objects/player.js';
import { InputManager } from '../scenes/inputManager.js';

export default class Nivel1 extends Phaser.Scene {
    constructor() {
        super('Nivel1');
    }

    create() {
        const fondoAncho = 3200;
        this.roundCompleted = false;

        // Fondo
        this.add.image(0, 0, 'fondojuego').setOrigin(0).setScrollFactor(1).setScale(fondoAncho / 800, 1);

        // 🚀 Lanzar HUD
        this.scene.launch('HUDScene');
        this.hudScene = this.scene.get('HUDScene');

        this.cameras.main.setBounds(0, 0, fondoAncho, 600);
        this.physics.world.setBounds(0, 0, fondoAncho, 600);

        // Puertas
        this.puertas = [];
        for (let i = 0; i < 12; i++) {
            const x = 120 + i * 250;
            const puerta = new Door(this, x, 300, i, null);
            puerta.setHUD(this.hudScene);
            puerta.setActive(true);
            this.puertas.push(puerta);
        }

        this.player = new Player(this, this.scene.settings.data.lives || 3);

        this.valla = this.add.tileSprite(0, 370, fondoAncho, 100, 'valla')
            .setOrigin(0)
            .setScrollFactor(0.5)
            .setScale(2.5)
            .setDepth(1);

        this.banquero = this.add.sprite(350, 550, 'banquero')
            .setOrigin(0.5, 0.8)
            .setScale(0.8)
            .setScrollFactor(0);
        this.banquero.play('banquero_idle');

        this.cursors = this.input.keyboard.createCursorKeys();
        this.inputManager = new InputManager(this);
        this.inputManager.setup();
    }

    update() {
        const cam = this.cameras.main;
        const maxScrollX = this.physics.world.bounds.width - cam.width;

        this.inputManager.update();
        const movimiento = this.inputManager.getMovement();

        if (movimiento.x < 0) {
            cam.scrollX -= 8;
            if (cam.scrollX < 0) cam.scrollX = maxScrollX;
        } else if (movimiento.x > 0) {
            cam.scrollX += 8;
            if (cam.scrollX > maxScrollX) cam.scrollX = 0;
        }

        this.valla.tilePositionX = cam.scrollX * 0.5;
        const botones = this.inputManager.getBotonesDisparo();
        this.player.update(this.puertas, botones);
    }

    updateHUD(score, lives) {
        if (this.hudScene) {
            this.hudScene.updateHUD(score, lives);
        }
    }

    updatePuertaHUD(index, estado) {
        if (this.hudScene) {
            this.hudScene.updatePuerta(index, estado);
        }
    }

    verificarFinDeRonda() {
        const todasCobradas = this.puertas.every(p => p.cobrada === true);
        if (todasCobradas && !this.roundCompleted) {
            this.roundCompleted = true;
            this.scene.start('RoundStart', { round: 2, lives: this.player.lives, score: this.player.score });
        }
    }
    
}
