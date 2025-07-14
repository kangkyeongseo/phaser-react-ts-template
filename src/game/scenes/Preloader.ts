import { Scene } from "phaser";
import { EventBus } from "../utils/EventBus";

export class Preloader extends Scene {
    constructor() {
        super("Preloader");
    }

    init() {}

    preload() {
        this.load.setPath("assets");
        // shared image
        this.load.image("shared-spinner", "shared/img-shared-spinner.png");
    }

    create() {
        EventBus.emit("game-ready", this);
        EventBus.emit("scene-create", this);
        EventBus.on("start-game", () => this.scene.start("Quiz"));
    }
}
