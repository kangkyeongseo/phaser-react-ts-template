import { BaseScene } from "../class/BaseScene";

interface FadeTweenType {
    targets: Phaser.GameObjects.Image | Phaser.GameObjects.Sprite;
    duration?: number;
    callback?: () => void;
}

interface ChangeTextureType extends FadeTweenType {
    texture: string;
}

interface ChangeFrameType extends FadeTweenType {
    x?: number;
    y?: number;
    frame: number;
}

export function fadeIn(scene: BaseScene, config: FadeTweenType) {
    const { targets, duration = 500, callback } = config;
    if (targets.alpha !== 0) targets.setAlpha(0);
    if (!targets.visible) targets.setVisible(true);

    scene.tweens.add({
        targets,
        alpha: 1,
        duration,
        ease: "Sine.easeInOut",
        onComplete: () => {
            if (callback) callback();
        },
    });
}

export function fadeOut(scene: BaseScene, config: FadeTweenType) {
    const { targets, duration = 500, callback } = config;

    scene.tweens.add({
        targets,
        alpha: 0,
        duration,
        ease: "Sine.easeInOut",
        onComplete: () => {
            targets.setVisible(false);
            if (callback) callback();
        },
    });
}

export function chageTexture(scene: BaseScene, config: ChangeTextureType) {
    const { targets, duration = 500, texture, callback } = config;

    const newTargets = scene.addImage({ x: targets.x, y: targets.y, key: texture });
    newTargets.setAlpha(0);

    scene.tweens.add({
        targets,
        alpha: 0,
        duration,
        ease: "Sine.easeInOut",
        onComplete: () => {
            targets.setTexture(texture);
            targets.setAlpha(1);
            if (callback) callback();
        },
    });

    scene.tweens.add({
        targets: newTargets,
        alpha: 1,
        duration,
        ease: "Sine.easeInOut",
        onComplete: () => {
            newTargets.destroy();
        },
    });
}

export function chageFrame(scene: BaseScene, config: ChangeFrameType) {
    const { targets, duration = 500, x = targets.x, y = targets.y, frame, callback } = config;

    const newTargets = scene.addSprite({ x, y, key: targets.texture.key, frame });
    newTargets.setAlpha(0);

    scene.tweens.add({
        targets,
        alpha: 0,
        duration,
        ease: "Sine.easeInOut",
        onComplete: () => {
            targets.setFrame(frame);
            targets.setAlpha(1);
            if (callback) callback();
        },
    });

    scene.tweens.add({
        targets: newTargets,
        alpha: 1,
        duration,
        ease: "Sine.easeInOut",
        onComplete: () => {
            newTargets.destroy();
        },
    });
}
