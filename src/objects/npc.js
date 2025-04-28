// src/objects/npc.js
export default class NPC extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, type, door, player) {
        const texture = (type === 'cliente' || type === 'clienta') ? type : (type === 'bandido2' ? 'bandido2' : 'bandido');
        super(scene, x, y, texture, 0);

        this.scene = scene;
        this.type = type;
        this.door = door;
        this.player = player;
        this.alreadyShot = false;

        this.setScale(0.5);
        this.setOrigin(0.5, 0.5);
        scene.add.existing(this);

        if (type === 'bandido2') {
            this.health = 2;
            this.scoreValue = 200;
            this.play('bandido2_idle');
        } else if (type === 'bandido') {
            this.health = 1;
            this.scoreValue = 100;
            this.play('bandido_idle');
        } else if (type === 'cliente') {
            this.health = 1;
            this.scoreValue = 50;
            this.play('cliente_idle');
        } else if (type === 'clienta') {
            this.health = 1;
            this.scoreValue = 70; // ¡clienta da más puntos!
            this.play('clienta_idle');
        }

        if (type === 'bandido' || type === 'bandido2') {
            this.startBanditTimer();
        } else {
            this.startClientTimer();
        }
    }

    startBanditTimer() {
        const tiempo = this.scene.scene.key === 'Nivel1' ? 3000 : 2000;
        this.timer = this.scene.time.delayedCall(tiempo, () => {
            if (!this.alreadyShot) {
                this.playShootAnimation();
            }
        });
    }
    

    startClientTimer() {
        this.timer = this.scene.time.delayedCall(2000, () => {
            if (!this.alreadyShot && this.scene.player) {
                this.scene.player.addScore(this.scoreValue);
                this.play(this.type === 'cliente' ? 'cliente_entrega' : 'clienta_entrega');

                // 🔥 Marcar como cobrada en HUD
                if (this.door) {
                    this.door.cobrar();
                }

                this.scene.time.delayedCall(500, () => this.closeDoor());
            }
        });
    }

    playShootAnimation() {
        if (this.type === 'bandido') {
            this.play('bandido_shoot');
        } else if (this.type === 'bandido2') {
            this.play('bandido2_shoot');
        }

        if (this.scene.player) {
            this.scene.player.loseLife();
        }
        this.scene.time.delayedCall(500, () => this.closeDoor());
    }

    shotByPlayer() {
        if (this.alreadyShot) return;
        this.health--;
    
        if (this.health > 0) {
            if (this.type === 'bandido2') {
                this.play('bandido2_hit');
            }
            return;
        }
    
        this.alreadyShot = true;
        if (this.timer) this.timer.remove();
    
        if (this.type === 'bandido' || this.type === 'bandido2') {
       //     this.scene.sound.play('sonido_hit'); // 💥 Sonido de impacto en bandido
        }
    
        if (this.type === 'bandido') {
            this.play('bandido_die');
            this.once('animationcomplete', () => this.closeDoor());
        } else if (this.type === 'bandido2') {
            this.play('bandido2_die');
            this.once('animationcomplete', () => this.closeDoor());
        } else if (this.type === 'cliente' || this.type === 'clienta') {
            if (this.scene.player) this.scene.player.loseLife(true);
            this.play(this.type === 'cliente' ? 'cliente_die' : 'clienta_die');
            this.scene.scene.pause();
    
            this.scene.time.delayedCall(3000, () => {
                this.scene.scene.start('RoundStart', {
                    round: this.scene.scene.key === 'Nivel1' ? 1 : 2,
                    lives: this.scene.player.lives,
                    score: this.scene.player.score
                });
            });
        }
    }

    closeDoor() {
        if (this.door) {
            this.door.alerta.setVisible(false);
            this.door.sprite.play('puerta_cerrar');
            this.door.npc = null;
            this.door.startTimer();
        }
        this.destroy();
    }

    destroy() {
        if (this.timer) this.timer.remove();
        super.destroy();
    }
}
