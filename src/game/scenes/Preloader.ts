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
        this.load.image("shared-spinner", "shared/img-shared-spinner.webp");

        this.load.image("replay", "game/image/img-quiz-replay-button.webp");
    }

    create() {
        EventBus.emit("game-ready", this);
        EventBus.emit("scene-create", this);
        EventBus.on("start-game", (scene: string) => {
            this.scene.stop(this.scene.key);
            this.scene.start(scene);
        });
    }
}
