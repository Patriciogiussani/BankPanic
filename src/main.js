// src/main.js

import Boot from './scenes/Boot.js';
import Preloader from './scenes/Preloader.js';
import MainMenu from './scenes/MainMenu.js';
import Nivel1 from './scenes/Nivel1.js';
import RoundStartScene from  './scenes/RoundStartScene.js';
import Nivel2 from './scenes/Nivel2.js';
import IntroAnimScene from './scenes/IntroAnimScene.js';
import GameOver from './scenes/GameOver.js';
import LifeLostScene from './scenes/LifeLostScene.js';
import HUDScene from './scenes/HUDScene.js';

// src/main.js

const config = {
    type: Phaser.AUTO,
    width: 800 , 
    height: 600,
    parent: 'game-container',
    backgroundColor: '#000000',
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
        }
    },
    scene: [Boot, Preloader, MainMenu, Nivel1, RoundStartScene, Nivel2, IntroAnimScene, GameOver, LifeLostScene, HUDScene],

    input: {
        gamepad: true // 👈 ESTO ES CLAVE
    }
};

const game = new Phaser.Game(config);
