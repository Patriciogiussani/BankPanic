export class InputManager {
    constructor(scene) {
        this.scene = scene;
        this.pad = null;
        this.movement = { x: 0, y: 0 };
    }

    setup() {
        const pads = this.scene.input.gamepad.gamepads;
        if (pads.length > 0) {
            this.pad = pads[0];
        }

        this.scene.input.gamepad.once("connected", (pad) => {
            this.pad = pad;
        });
    }

    update() {
        if (!this.pad) return;

        const x = this.pad.axes.length > 0 ? this.pad.axes[0].getValue() : 0;
        this.movement.x = Math.abs(x) > 0.1 ? x : 0;

        // Mapear botones a disparos: Cuadrado (3), X (0), Círculo (1)
        this.botonDisparo = {
            cuadrado: this.pad.buttons[3].pressed, // Botón 3
            equis: this.pad.buttons[0].pressed,    // Botón 0
            circulo: this.pad.buttons[1].pressed   // Botón 1
        };
    }

    getMovement() {
        return this.movement;
    }

    getBotonesDisparo() {
        return this.botonDisparo;
    }
}
