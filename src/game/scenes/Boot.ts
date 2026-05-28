import { Scene } from "phaser";

export class Boot extends Scene {
    constructor() {
        super("Boot");
    }

    preload() {
        this.load.setPath("assets");
        // config
        this.load.json("config", "game/config.json");
        this.load.on("loaderror", (file: any) => {
            if (file.key === "config") {
                this.cache.json.add("config", {});
            }
        });
    }

    create() {
        this.scene.start("Preloader");
    }
}
