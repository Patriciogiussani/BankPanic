// src/scenes/Nivel2.js
import Door from '../objects/doors.js';
import Player from '../objects/player.js';
import Bomb from '../objects/bomb.js';
import { InputManager } from '../scenes/inputManager.js';

export default class Nivel2 extends Phaser.Scene {
    constructor() {
        super('Nivel2');
    }

    create() {
        const fondoAncho = 3200;
        this.roundCompleted = false;

         // 🎵 Música de fondo nivel 2
   // this.musica = this.sound.add('musica_nivel2', { loop: true });
    //this.musica.play();

        // Fondo
        this.add.image(0, 0, 'fondojuego').setOrigin(0).setScrollFactor(1).setScale(fondoAncho / 800, 1);

                // Agregar recuadro de extra time (parallax)
this.extraTimePanel = this.add.image(0, 0, 'extra_time_panel')
.setOrigin(0)
.setScrollFactor(0) // Fijo en pantalla
.setDepth(10); // Detrás de todo
// Agregar barra roja de extra time
this.extraTimeBar = this.add.rectangle(580, 583, 300, 20, 0xff0000)
    .setOrigin(0.5)
    .setScrollFactor(0) // Fijo en pantalla
    .setDepth(11); // Detrás de todo
    this.add.text(200, 575, 'EXTRA TIME', { fontFamily: '"Press Start 2P"', fontSize: '20px', color: '#000255' }).setScrollFactor(0).setDepth(11);

        // 🚀 Lanzar HUD
        this.scene.launch('HUDScene');
        this.hudScene = this.scene.get('HUDScene');

        this.cameras.main.setBounds(0, 0, fondoAncho, 600);
        this.physics.world.setBounds(0, 0, fondoAncho, 600);

        // Puertas
        this.puertas = [];
        this.scene.get('HUDScene').setPuertas(this.puertas);
        for (let i = 0; i < 12; i++) {
            const x = 120 + i * 250;
            const puerta = new Door(this, x, 300, i, null);
            puerta.setHUD(this.hudScene);
            puerta.setActive(true);
            this.puertas.push(puerta);
        }

        this.time.addEvent({
            delay: 30000,
            loop: true,
            callback: () => {
                const puertasDisponibles = this.puertas.filter(p => p.active && !p.npc);
                if (puertasDisponibles.length > 0) {
                    const puertaAleatoria = Phaser.Utils.Array.GetRandom(puertasDisponibles);
                    new Bomb(this, puertaAleatoria);
                }
            }
        });

        this.player = new Player(this, this.scene.settings.data.lives || 3);
        this.player.score = this.scene.settings.data.score || 0;

        this.valla = this.add.tileSprite(0, 370, fondoAncho, 100, 'valla')
            .setOrigin(0)
            .setScrollFactor(0.5)
            .setScale(2.5)
            .setDepth(1);

        this.banquero = this.add.sprite(500, 550, 'banquero')
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

        if (this.extraTimeBar && this.extraTimeBar.width > 0) {
            this.extraTimeBar.width -= 0.1; // velocidad de reducción
        }
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
            if (this.extraTimeBar) {
                const puntosExtra = Math.floor(this.extraTimeBar.width) * 10; // Cada pixel 10 puntos
                this.player.addScore(puntosExtra);
            }
           // this.musica.stop(); // 🔇 Detener música
           this.scene.start('RoundStart', { round: 'win', lives: this.player.lives, score: this.player.score });
        }
    }
    
}
