// src/objects/doors.js
import NPC from './npc.js';

export default class Door {
    constructor(scene, x, y, index, npcData) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.index = index;

        this.container = scene.add.container(x, y);

        // Número de la puerta
        this.numberBox = scene.add.rectangle(0, -70, 32, 24, 0x00ff00)
            .setOrigin(0.5)
            .setStrokeStyle(2, 0xffffff);
        this.numberText = scene.add.text(0, -70, (index + 1).toString(), {
            fontFamily: '"Press Start 2P"',
            fontSize: '16px',
            color: '#0000ff'
        }).setOrigin(0.5);

        // Sprite de puerta
        this.sprite = scene.add.sprite(0, 0, 'puerta', 0)
            .setScale(0.4)
            .setOrigin(0.5, 0.5);

        this.container.add([
            this.sprite,
            this.numberBox,
            this.numberText
        ]);

        this.alerta = scene.add.image(x, y - 50, 'alerta').setVisible(false).setScale(0.6);
        this.timer = null;
        this.active = false;
        this.hud = null;
        this.npc = null;
        this.bomba = null;
        this.cobrada = false;
        this.esperandoVisibilidad = null;
    }

    setHUD(hud) {
        this.hud = hud;
    }

    setActive(active) {
        this.active = active;
        if (active) {
            this.startTimer();
        } else if (this.timer) {
            this.timer.remove();
        }
    }

    startTimer() {
        if (!this.active) return;

        const duration = this.scene.scene.key === 'Nivel1' ? Phaser.Math.Between(3000, 6000) : Phaser.Math.Between(1500, 4000);
        this.timer = this.scene.time.delayedCall(duration, () => this.tryToOpen());
    }

    tryToOpen() {
        if (this.cobrada) return;

        const cam = this.scene.cameras.main;
        const visible = this.x >= cam.scrollX && this.x < cam.scrollX + cam.width;

        if (visible) {
            this.openDoor();
        } else {
            this.esperandoVisibilidad = this.scene.time.addEvent({
                delay: 200,
                loop: true,
                callback: () => {
                    const cam = this.scene.cameras.main;
                    const visible = this.x >= cam.scrollX && this.x < cam.scrollX + cam.width;

                    if (visible) {
                        this.openDoor();
                        this.esperandoVisibilidad.remove();
                    }
                }
            });
        }

        if (this.scene.updatePuertaHUD && !this.cobradoUnaVez) {
            this.scene.updatePuertaHUD(this.index, 'alerta');
        }
    }

    openDoor() {
        if (!this.active) return;
        if (this.bomba) return;
        if (this.cobrada) return;
    
        let tipo;
        if (this.scene.scene.key === 'Nivel1') {
            const random = Phaser.Math.Between(0, 9);
            if (random === 4) {
                tipo = 'clienta';
            } else if (random <= 6) {
                tipo = 'cliente';
            } else {
                tipo = 'bandido';
            }
        } else if (this.scene.scene.key === 'Nivel2') {
            tipo = Phaser.Math.Between(0, 1) === 0 ? 'cliente' : 'bandido';
            if (tipo === 'bandido' && Phaser.Math.Between(0, 1) === 0) {
                tipo = 'bandido2';
            }
        } else if (this.scene.scene.key === 'Nivel3') {
            const random = Phaser.Math.Between(0, 3);
            if (random === 0) {
                tipo = 'clienta';
            } else if (random === 1) {
                tipo = 'cliente';
            } else if (random === 2) {
                tipo = 'bandido';
            } else {
                tipo = 'bandido2';
            }
        }
    
        this.sprite.play('puerta_abrir');
        this.alerta.setVisible(true);
    
        this.npc = new NPC(this.scene, this.x, this.y, tipo, this, this.scene.player);
    
        if (this.scene.updatePuertaHUD && !this.cobradoUnaVez) {
            this.scene.updatePuertaHUD(this.index, 'npc');
        }
    }
    receiveShot() {
        if (this.npc) {
            this.npc.shotByPlayer();
        }
    }

    cobrar() {
        if (!this.cobradoUnaVez) {
            this.cobradoUnaVez = true;
            if (this.scene.updatePuertaHUD) {
                this.scene.updatePuertaHUD(this.index, 'cobrado');
            }
            this.scene.verificarFinDeRonda();
        }
    }

    setBomba() {
       if (this.scene.updatePuertaHUD && !this.cobradoUnaVez) {
    this.scene.updatePuertaHUD(this.index, 'bomba');
}
    }
}
