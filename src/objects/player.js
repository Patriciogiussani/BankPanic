export default class Player {
    constructor(scene, lives = 3) { // <<< Acá recibimos las vidas
        this.scene = scene;
        this.lives = lives; // <<< Ahora usamos las vidas recibidas
        this.score = 0;

        this.teclas = scene.input.keyboard.addKeys({
            A: 'A',
            S: 'S',
            D: 'D'
        });

        this.shotImage = scene.add.sprite(0, 0, 'disparo').setVisible(false).setScale(1);
    }

    update(puertas) {
        const camera = this.scene.cameras.main;
        const visibles = puertas.filter(p => p.x >= camera.scrollX && p.x < camera.scrollX + camera.width);
        visibles.sort((a, b) => a.x - b.x);

        const pad = this.scene.inputManager?.pad;
        if (pad) {
            if (pad.buttons[2].pressed && visibles[0]) this.disparar(visibles[0]);
            if (pad.buttons[0].pressed && visibles[1]) this.disparar(visibles[1]);
            if (pad.buttons[1].pressed && visibles[2]) this.disparar(visibles[2]);
        }
    }

    disparar(puerta) {
        if (puerta.bomba && puerta.bomba.active) {
            puerta.bomba.receiveShot();
        } else {
            puerta.receiveShot();
        }

        //this.scene.sound.play('sonido_disparo'); // 🔫 Reproducir sonido disparo

        this.shotImage.setPosition(puerta.x, puerta.y - 40);
        this.shotImage.setVisible(true);
        this.shotImage.play('disparo_anim');
    }

    addScore(puntos = 100) {
        this.score += puntos;
        this.scene.updateHUD(this.score, this.lives);
    }
    loseLife() {
        this.lives--;
        this.scene.updateHUD(this.score, this.lives);
    
        const puertasEstado = this.scene.puertas.map(puerta => puerta.cobradoUnaVez); // <<< Agregar esta línea
        
        if (this.lives > 0) {
            this.scene.scene.start('LifeLost', { 
                round: this.scene.scene.key === 'Nivel1' ? 1 : 2,
                lives: this.lives,
                score: this.score,
                puertasEstado: puertasEstado // <<< Pasarlo
            });
        } else {
            this.scene.scene.start('LifeLost', { 
                round: this.scene.scene.key === 'Nivel1' ? 1 : 2,
                lives: this.lives,
                gameover: true,
                puertasEstado: puertasEstado // <<< Pasarlo
            });
        }
    }
    

    loseAllLives() {
        this.lives = 0;
        this.scene.updateHUD(this.score, this.lives);
        this.scene.scene.start('GameOver');
    }
}
