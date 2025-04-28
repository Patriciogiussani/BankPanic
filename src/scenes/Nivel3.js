import Door from '../objects/doors.js';
import Player from '../objects/player.js';
import Bomb from '../objects/bomb.js';
import { InputManager } from '../scenes/inputManager.js';

export default class Nivelbonus extends Phaser.Scene {
    constructor() {
        super('Nivel3');
    }

    create(data) {
        const fondoAncho = 3200;
        this.round = data.round || 3;
        this.roundCompleted = false;

        // Fondo
        this.add.image(0, 0, 'fondojuego').setOrigin(0).setScrollFactor(1).setScale(fondoAncho / 800, 1);

        // HUD
        this.scene.launch('HUDScene');
        this.hudScene = this.scene.get('HUDScene');

        this.cameras.main.setBounds(0, 0, fondoAncho, 540);
        this.physics.world.setBounds(0, 0, fondoAncho, 540);

        // Puertas
        this.puertas = [];
        this.scene.get('HUDScene').setPuertas(this.puertas);
        for (let i = 0; i < 12; i++) {
            const x = 160 + i * 320;
            const puerta = new Door(this, x, 300, i, null);
            puerta.setHUD(this.hudScene);
            puerta.setActive(true);
            this.puertas.push(puerta);
        }

        // HUD
this.scene.launch('HUDScene');
this.hudScene = this.scene.get('HUDScene');
this.hudScene.setPuertas(this.puertas);

        this.player = new Player(this, data.lives || 3);
        this.player.score = data.score || 0;

        // Bombas
        this.time.addEvent({
            delay: Math.max(8000 - (this.round - 3) * 500, 3000),
            loop: true,
            callback: () => {
                const puertasDisponibles = this.puertas.filter(p => p.active && !p.npc && !p.bomba);
                if (puertasDisponibles.length > 0) {
                    const puertaAleatoria = Phaser.Utils.Array.GetRandom(puertasDisponibles);
                    new Bomb(this, puertaAleatoria);
                }
            }
        });

        this.valla = this.add.tileSprite(0, 370, fondoAncho, 100, 'valla')
            .setOrigin(0)
            .setScrollFactor(0.5)
            .setScale(2.5)
            .setDepth(1);

        this.banquero = this.add.sprite(480, 510, 'banquero')
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
        const todasCobradas = this.puertas.every(p => p.cobradoUnaVez === true);
        if (todasCobradas && !this.roundCompleted) {
            this.roundCompleted = true;
            this.scene.start('RoundStart', { round: this.round + 1, lives: this.player.lives, score: this.player.score });
        }
    }
}
