// src/scenes/Preloader.js
import Phaser from 'phaser';

export default class Preloader extends Phaser.Scene {
    constructor() {
        super('Preloader');
    }

    preload() {
        const loadingText = this.add.text(240, 270, 'Cargando...', {
            fontSize: '24px',
            color: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        // Fondos
        this.load.image('fondo_menu', 'assets/fondo_menu.png');
        this.load.image('fondojuego', 'assets/fondojuego.png');
        this.load.image('valla', 'assets/valla.png');
        this.load.image('fondoround', 'assets/fondoround.png');
        this.load.image('fondoover', 'assets/fondoover.png');
        this.load.image('extra_time_panel', 'assets/extra_time_panel.png');

        // Spritesheets
        this.load.spritesheet('banquero', 'assets/banquero_spritesheet.png', { frameWidth: 165, frameHeight: 168 });
        this.load.spritesheet('bandido', 'assets/bandido_spritesheet.png', { frameWidth: 205, frameHeight: 545 });
        this.load.spritesheet('bandido2', 'assets/bandido2_spritesheet.png', { frameWidth: 205, frameHeight: 545 });
        this.load.spritesheet('cliente', 'assets/cliente_spritesheet.png', { frameWidth: 275, frameHeight: 545 });
        this.load.spritesheet('disparo', 'assets/disparo_spritesheet.png', { frameWidth: 85, frameHeight: 95 });
        this.load.spritesheet('clienta', 'assets/clienta_spritesheet.png', { frameWidth: 217, frameHeight: 545 });
         // Dentro de preload():
        this.load.spritesheet('player', 'assets/player_spritesheet.png', { frameWidth: 449, frameHeight: 445 });
        // Opcional: carga el icono de vida si querés
        this.load.image('vida_icono', 'assets/vida_icono.png');

        // Videos
        this.load.video('gameover_video', 'assets/gameover.mp4');


         // 🔥 Nueva carga: Puerta como spritesheet
         this.load.spritesheet('puerta', 'assets/puerta_spritesheet.png', {
            frameWidth: 513, // <-- poné el ancho correcto de tu sprite
            frameHeight: 790 // <-- poné el alto correcto de tu sprite
        });

        this.load.image('titulo', 'assets/titulo.png');
        this.load.image('alerta', 'assets/alerta.png');
        this.load.image('icon_money', 'assets/dinero.png');
        this.load.spritesheet('bomba', 'assets/bomba_spritesheet.png', { frameWidth: 125, frameHeight: 132 });
        this.load.image('clock', 'assets/clock.png');

        this.load.image('icon_bomb', 'assets/icono_bomba.png');

        // 🔥 Carga de sonidos
//this.load.audio('musica_intro', '/assets/musica_intro.mp3');
//this.load.audio('musica_life_lost', '/assets/musica_life_lost.mp3');
//this.load.audio('musica_nivel1', '/assets/musica_nivel1.mp3');
//this.load.audio('musica_nivel2', '/assets/musica_nivel2.mp3');
//this.load.audio('sonido_disparo', '/assets/sonido_disparo.mp3');
//this.load.audio('sonido_hit', '/assets/sonido_hit.mp3');
    }

    create() {
        // Crear las animaciones
        this.anims.create({
            key: 'banquero_idle',
            frames: this.anims.generateFrameNumbers('banquero', { start: 0, end: 1 }),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'bandido_idle',
            frames: [{ key: 'bandido', frame: 0 }]
        });
        this.anims.create({
            key: 'bandido_shoot',
            frames: [{ key: 'bandido', frame: 1 }]
        });
        this.anims.create({
            key: 'bandido_die',
            frames: this.anims.generateFrameNumbers('bandido', { start: 2, end: 3 }),
            frameRate: 5,
            hideOnComplete: true
        });

        this.anims.create({
            key: 'bandido2_idle',
            frames: [{ key: 'bandido2', frame: 0 }]
        });
        this.anims.create({
            key: 'bandido2_shoot',
            frames: [{ key: 'bandido2', frame: 1 }]
        });
        this.anims.create({
            key: 'bandido2_hit',
            frames: [{ key: 'bandido2', frame: 2 }]
        });
        this.anims.create({
            key: 'bandido2_die',
            frames: this.anims.generateFrameNumbers('bandido2', { start: 3, end: 4 }),
            frameRate: 15,
            hideOnComplete: true
        });

        this.anims.create({
            key: 'cliente_idle',
            frames: [{ key: 'cliente', frame: 0 }]
        });
        this.anims.create({
            key: 'cliente_entrega',
            frames: [{ key: 'cliente', frame: 1 }]
        });
        this.anims.create({
            key: 'cliente_die',
            frames: this.anims.generateFrameNumbers('cliente', { start: 4, end: 6 }),
            frameRate: 5,
            hideOnComplete: true
        });

        this.anims.create({
            key: 'clienta_idle',
            frames: [{ key: 'clienta', frame: 0 }]
        });
        this.anims.create({
            key: 'clienta_entrega',
            frames: [{ key: 'clienta', frame: 1 }]
        });
        this.anims.create({
            key: 'clienta_die',
            frames: this.anims.generateFrameNumbers('clienta', { start: 4, end: 6 }),
            frameRate: 5,
            hideOnComplete: true
        });

        this.anims.create({
            key: 'disparo_anim',
            frames: this.anims.generateFrameNumbers('disparo', { start: 0, end: 4 }),
            frameRate: 25,
            hideOnComplete: true
        });

     

        this.anims.create({
            key: 'bomba_explosion',
            frames: this.anims.generateFrameNumbers('bomba', { start: 1, end: 2 }),
            frameRate: 10,
            hideOnComplete: true
        });

         // 🔥 Nueva animaciones para PUERTA
         this.anims.create({
            key: 'puerta_abrir',
            frames: this.anims.generateFrameNumbers('puerta', { start: 0, end: 2 }),
            frameRate: 35,
            hideOnComplete: false
        });

        this.anims.create({
            key: 'puerta_cerrar',
            frames: this.anims.generateFrameNumbers('puerta', { start: 2, end: 0 }),
            frameRate: 35,
            hideOnComplete: false
        });

        this.scene.start('MainMenu');

        
    }
}
