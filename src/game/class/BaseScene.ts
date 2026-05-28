import { Scene } from "phaser";
import { SoundManager } from "./SoundManager";
import { EventBus } from "./EventBus";
import { Loading } from "./Loading";
import { ConfigType } from "../../types/config";

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
    loading!: Loading;
    isLoading!: boolean;
    isNextSceneReady!: boolean;
    soundManager!: SoundManager;
    isPortrait!: boolean;
    config!: ConfigType;

    constructor(key: string) {
        super(key);
    }

    init(data?: any) {
        EventBus.emit("scene-create", this);

        this.isDesktop = this.sys.game.device.os.desktop;

        this.centerX = this.scale.width / 2;
        this.centerY = this.scale.height / 2;

        this.loading = new Loading(this);
        this.isLoading = false;
        this.isNextSceneReady = false;

        const isConfigPreload = this.cache.json.exists("config");
        if (isConfigPreload) {
            this.config = this.cache.json.get("config");
        }

        this.soundManager = new SoundManager(this, this.config.module.defaultsSound);

        this.updateOrientation();

        const media = window.matchMedia("(orientation: portrait)");

        media.addEventListener("change", () => {
            this.updateOrientation();
            this.applyLayout();
        });
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

    addImage({
        x = 0,
        y = 0,
        key,
        scale,
        origin,
    }: {
        x?: number;
        y?: number;
        key: string;
        scale?: { x: number; y: number };
        origin?: { x: number; y: number };
    }) {
        const defaultsImage = this.config.module.defaultsImage;
        const setting = { scale: { ...defaultsImage.scale, ...scale }, origin: { ...defaultsImage.origin, ...origin } };

        return this.add
            .image(x, y, key)
            .setScale(setting.scale.x, setting.scale.y)
            .setOrigin(setting.origin.x, setting.origin.y);
    }

    addSprite({
        x = 0,
        y = 0,
        key,
        index = 0,
        scale,
        origin,
    }: {
        x?: number;
        y?: number;
        key: string;
        index?: number;
        scale?: { x: number; y: number };
        origin?: { x: number; y: number };
    }) {
        const defaultsImage = this.config.module.defaultsImage;
        const setting = { scale: { ...defaultsImage.scale, ...scale }, origin: { ...defaultsImage.origin, ...origin } };

        return this.add
            .sprite(x, y, key, index)
            .setScale(setting.scale.x, setting.scale.y)
            .setOrigin(setting.origin.x, setting.origin.y);
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
