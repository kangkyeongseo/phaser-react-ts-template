import { FileType, SpriteFileType } from "../../types/config";

interface AssetsConfig {
    sound?: FileType[];
    image?: FileType[];
    sprite?: SpriteFileType[];
}

export function preloadAssets(scene: Phaser.Scene, assets: AssetsConfig) {
    assets.sound?.forEach((item) => {
        scene.load.audio(item.key, item.file);
    });
    assets.image?.forEach((item) => {
        scene.load.image(item.key, item.file);
    });
    assets.sprite?.forEach((item) => {
        scene.load.spritesheet(item.key, item.file, { frameWidth: item.frameWidth, frameHeight: item.frameHeight });
    });
}
