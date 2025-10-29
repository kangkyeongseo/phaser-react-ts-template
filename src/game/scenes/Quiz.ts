import { BaseScene } from "../class/BaseScene";
import { EventBus } from "../utils/EventBus";

export class Quiz extends BaseScene {
    constructor() {
        super("Quiz");
    }

    create() {
        console.log("quiz");
        const replay = this.add.image(this.centerX, this.centerY, "replay");
        replay.setInteractive();
        replay.on("pointerdown", () => {
            this.scene.stop(this.scene.key);
            EventBus.emit("start-player");
        });
    }
}
