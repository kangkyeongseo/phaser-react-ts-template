import { Scene } from "phaser";
import { EventBus } from "../EventBus";

export class Preloader extends Scene {
    constructor() {
        super("Preloader");
    }

    init() {}

    preload() {
        this.load.setPath("assets");
    }

    create() {
        EventBus.emit("game-ready", this);
        EventBus.emit("scene-create", this);
        // this.scene.start("MainMenu");
    }
}

