import { Scene } from "phaser";
import { EventBus } from "../EventBus";

export class Preloader extends Scene {
    constructor() {
        super("Preloader");
    }

    init() {}

    preload() {
        EventBus.emit("ready", this);
        this.load.setPath("assets");
    }

    create() {
        // this.scene.start("MainMenu");
    }
}

