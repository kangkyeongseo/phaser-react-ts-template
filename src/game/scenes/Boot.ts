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
        // shared image
        this.load.image("shared-spinner", "shared/img-shared-spinner.webp");
    }

    create() {
        this.scene.start("Preloader");
    }
}
