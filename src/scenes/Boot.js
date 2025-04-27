// src/scenes/Boot.js
import Phaser from 'phaser';

export default class Boot extends Phaser.Scene {
    constructor() {
        super('Boot');
    }

    preload() {
        // Podés cargar un logo de carga u otras cosas básicas acá si querés
        this.load.image('logo', 'assets/logo.png');
    }

    create() {
        // Configuraciones iniciales del juego
        this.scale.scaleMode = Phaser.Scale.FIT;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;

        // Fondo negro por defecto
        this.cameras.main.setBackgroundColor('#000');

        // Pasamos a la siguiente escena
        this.scene.start('Preloader');
    }
}
