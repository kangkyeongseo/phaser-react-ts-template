import { Scene } from "phaser";
import { SoundManager } from "./SoundManager";
import { EventBus } from "../utils/EventBus";
import { Loading } from "./Loading";

declare global {
    interface Window {
        gCloseWindow: () => void;
        gClearGame: () => void;
    }
}

export class BaseScene extends Scene {
    isDesktop!: boolean;
    centerX!: number;
    centerY!: number;
    isNextSceneReady!: boolean;
    isLoading!: boolean;
    loading!: Loading;
    soundManager!: SoundManager;
    config!: {
        name: string;
        conId: number;
        conGroupId: number;
        relatedVideos: { conId: number; conGroupId: number }[];
        recordPoint: { [stage: string]: [number, number] };
    };

    constructor(key: string) {
        super(key);
    }

    init(data?: any) {
        EventBus.emit("scene-create", this);

        this.isDesktop = this.sys.game.device.os.desktop;

        this.centerX = this.scale.width / 2;
        this.centerY = this.scale.height / 2;

        this.loading = new Loading(this);
        this.isNextSceneReady = false;
        this.isLoading = false;

        this.soundManager = new SoundManager(this);

        const isConfigPreload = this.cache.json.exists("config");
        if (isConfigPreload) {
            this.config = this.cache.json.get("config");
        }
    }

    nextScenePreLoad(callback: () => void) {
        this.load.start();
        if (this.load.totalToLoad === 0) {
            this.isNextSceneReady = true;
        } else {
            this.load.once("complete", () => {
                this.isNextSceneReady = true;
                if (this.isLoading) {
                    this.loading.remove();
                    callback();
                }
            });
        }
    }

    nextSceneLoadCheck(callback: () => void) {
        if (this.isNextSceneReady) {
            callback();
        } else {
            this.isLoading = true;
            this.loading.add();
        }
    }
}
