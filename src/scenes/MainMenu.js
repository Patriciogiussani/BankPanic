// src/scenes/MainMenu.js
import Phaser from 'phaser';

export default class MainMenu extends Phaser.Scene {
    constructor() {
        super('MainMenu');
    }

    create() {

        this.scene.stop('HUDScene');

        // Fondo del menú
        this.add.image(1180, 720, 'fondo_menu').setOrigin(1);
        this.add.image(745, 520, 'titulo').setOrigin(1);

        // Botón Nivel 1
        const nivel1Button = this.add.text(456, 500, 'JUGAR NIVEL 1', {
            fontSize: '32px',
            color: '#00ff00',
            backgroundColor: '#000000',
            padding: { x: 20, y: 10 },
            fontFamily: 'Arial',
        }).setOrigin(0.5)
          .setInteractive({ useHandCursor: true })
          .on('pointerdown', () => {
            this.scene.start('IntroAnim', { nivel: 1 }); // mandamos el nivel elegido
        })
        
          .on('pointerover', () => {
              nivel1Button.setStyle({ backgroundColor: '#222222' });
          })
          .on('pointerout', () => {
              nivel1Button.setStyle({ backgroundColor: '#000000' });
          });

        // Botón Nivel 2
        const nivel2Button = this.add.text(456, 580, 'JUGAR NIVEL 2', {
            fontSize: '32px',
            color: '#00ffff',
            backgroundColor: '#000000',
            padding: { x: 20, y: 10 },
            fontFamily: 'Arial',
        }).setOrigin(0.5)
          .setInteractive({ useHandCursor: true })
          .on('pointerdown', () => {
            this.scene.start('IntroAnim', { nivel: 2 }); // mandamos el nivel elegido
        })
        
          .on('pointerover', () => {
              nivel2Button.setStyle({ backgroundColor: '#222222' });
          })
          .on('pointerout', () => {
              nivel2Button.setStyle({ backgroundColor: '#000000' });
          });
    }
}
