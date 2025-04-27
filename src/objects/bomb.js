export default class Bomb extends Phaser.GameObjects.Sprite {
    constructor(scene, door) {
        super(scene, door.x, door.y - 40, 'bomba', 0);

        this.scene = scene;
        this.door = door;
        door.bomba = this; // <<< Importante

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setScale(0.6);
        this.setDepth(1);

        // Marcar la puerta como bloqueada
        door.bloqueada = true;
        door.npc = null;
        door.sprite.setTexture('puerta'); // Asegurarse que sigue usando 'puerta'
door.sprite.setFrame(0); // Mostrar frame 0 (cerrada)

        // Mostrar ícono de bomba en el HUD
        if (scene.hudBombas && scene.hudBombas[door.index]) {
            scene.hudBombas[door.index].setVisible(true);
        }

        this.desactivada = false;

        // Timer de explosión
        this.timer = scene.time.delayedCall(30000, () => {
            if (!this.desactivada) {
                this.explotar();
            }
        });
    }

    desactivar() {
        if (this.desactivada) return;

        this.desactivada = true;
        this.play('bomba_explosion');
        this.scene.player.addScore(300); // puntos por desactivarla

        this.once('animationcomplete', () => {
            this.remover();
        });
    }

    explotar() {
        if (this.desactivada) return;

        this.desactivada = true;
        this.play('bomba_explosion');

        this.once('animationcomplete', () => {
            this.scene.player.loseAllLives();
            this.remover();
        });
    }

    remover() {
        // Ocultar ícono en HUD
        if (this.scene.hudBombas && this.scene.hudBombas[this.door.index]) {
            this.scene.hudBombas[this.door.index].setVisible(false);
        }

        this.door.bloqueada = false;
        this.door.bomba = null; // <<< Limpia la referencia
        this.door.startTimer();

        if (this.timer) this.timer.remove();
        this.destroy();
    }

    receiveShot() {
        this.desactivar();
    }

    destroy() {
        if (this.timer) this.timer.remove();
        super.destroy();
    }
}
