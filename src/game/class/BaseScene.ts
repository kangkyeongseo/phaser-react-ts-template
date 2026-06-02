import { Scene } from "phaser";
import { SoundManager } from "./SoundManager";
import { EventBus } from "./EventBus";
import { Loading } from "./Loading";
import { preloadAssets } from "../utils/preloadAssets";
import { ConfigType } from "../../types/config";

declare global {
    interface Window {
        gCloseWindow: () => void;
        gClearGame: () => void;
    }
}

interface ImageOptionType {
    x?: number;
    y?: number;
    key: string;
    scale?: { x: number; y: number };
    origin?: { x: number; y: number };
    depth?: number;
}

interface SpriteOptionType extends ImageOptionType {
    frame?: number;
}

export class BaseScene extends Scene {
    // state
    isDesktop!: boolean;
    centerX!: number;
    centerY!: number;
    loading!: Loading;
    isLoading!: boolean;
    isNextSceneReady!: boolean;
    // config
    config!: ConfigType;
    // soundManager
    soundManager!: SoundManager;
    // portraitMode
    isPortrait!: boolean;

    constructor(key: string) {
        super(key);
    }

    init(data?: any) {
        EventBus.emit("scene-create", this);
        // state
        this.isDesktop = this.sys.game.device.os.desktop;
        this.centerX = this.scale.width / 2;
        this.centerY = this.scale.height / 2;
        this.loading = new Loading(this);
        this.isLoading = false;
        this.isNextSceneReady = false;
        // config
        const isConfigPreload = this.cache.json.exists("config");
        if (isConfigPreload) {
            this.config = this.cache.json.get("config");
        }
        // soundManager
        this.soundManager = new SoundManager(this, this.config.module.defaultsSound);
        if (data.bgm) {
            this.soundManager.bgm.bgm = data.bgm;
        }
        // portraitMode
        if (this.config.portraitMode) {
            this.updateOrientation();

            const media = window.matchMedia("(orientation: portrait)");

            media.addEventListener("change", () => {
                this.updateOrientation();
                this.applyLayout();
            });
        } else {
            this.isPortrait = false;
        }
    }

    updateOrientation() {
        this.isPortrait = window.innerHeight > window.innerWidth;

        const width = this.isPortrait ? 1080 : 1920;
        const height = this.isPortrait ? 1920 : 1080;

        this.scale.setGameSize(width, height);
        this.scale.refresh();

        this.centerX = this.scale.width / 2;
        this.centerY = this.scale.height / 2;
    }

    applyLayout() {}

    addImage({ x = 0, y = 0, key, scale, origin, depth }: ImageOptionType) {
        const defaultsImage = this.config.module.defaultsImage;
        const setting = {
            scale: { ...defaultsImage.scale, ...scale },
            origin: { ...defaultsImage.origin, ...origin },
            depth: depth || defaultsImage.depth,
        };

        return this.add
            .image(x, y, key)
            .setScale(setting.scale.x, setting.scale.y)
            .setOrigin(setting.origin.x, setting.origin.y)
            .setDepth(setting.depth);
    }

    addSprite({ x = 0, y = 0, key, frame = 0, scale, origin, depth }: SpriteOptionType) {
        const defaultsImage = this.config.module.defaultsImage;
        const setting = {
            scale: { ...defaultsImage.scale, ...scale },
            origin: { ...defaultsImage.origin, ...origin },
            depth: depth || defaultsImage.depth,
        };

        return this.add
            .sprite(x, y, key, frame)
            .setScale(setting.scale.x, setting.scale.y)
            .setOrigin(setting.origin.x, setting.origin.y)
            .setDepth(setting.depth);
    }

    nextScenePreLoad(netxScene: string) {
        const { file } = this.config;

        this.load.setPath("assets");

        preloadAssets(this, file[netxScene]);

        this.load.start();
        if (this.load.totalToLoad === 0) {
            this.isNextSceneReady = true;
        } else {
            this.load.once("complete", () => {
                this.isNextSceneReady = true;
                if (this.isLoading) {
                    this.loading.remove();
                    this.startNextScene(netxScene);
                }
            });
        }
    }

    startNextScene(netxScene: string) {
        if (this.isNextSceneReady) {
            this.cameras.main.fadeOut(300);
            this.cameras.main.once("camerafadeoutcomplete", () => {
                this.scene.start(netxScene, { bgm: this.soundManager.bgm.bgm });
            });
        } else {
            this.isLoading = true;
            this.loading.add();
        }
    }
}
