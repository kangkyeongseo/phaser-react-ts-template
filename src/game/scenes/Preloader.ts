import { Scene } from "phaser";
import { EventBus } from "../class/EventBus";
import { preloadAssets } from "../utils/preloadAssets";
import { ConfigType } from "../../types/config";

export class Preloader extends Scene {
    constructor() {
        super("Preloader");
    }

    init() {}

    preload() {
        // config
        const config = this.cache.json.get("config");
        const {
            file: { Common },
        } = config as ConfigType;

        this.load.setPath("assets");

        preloadAssets(this, Common);
    }

    create() {
        EventBus.emit("game-ready", this);
        EventBus.emit("scene-create", this);
        this.scene.start("first-scene-name");
    }
}
