import { DefaultSoundType, SoundType } from "../../types/config";

interface VoiceSoundConfig extends Phaser.Types.Sound.SoundConfig {
    nextWait?: number;
}

class BgmManager {
    private scene: Phaser.Scene;
    private defaultsSound: DefaultSoundType;
    private bgm?: Phaser.Sound.BaseSound;
    private bgmKey?: string;

    constructor(scene: Phaser.Scene, defaultsSound: DefaultSoundType) {
        this.scene = scene;
        this.defaultsSound = defaultsSound;
    }

    play({
        key,
        startVolume = 0,
        volume,
        duration = 1000,
        config,
    }: {
        key: string;
        startVolume?: number;
        volume: number;
        duration?: number;
        config?: Phaser.Types.Sound.SoundConfig;
    }) {
        if (this.bgmKey === key && this.bgm?.isPlaying) {
            return;
        }

        this.stop({ duration: 0 });

        this.bgmKey = key;

        this.bgm = this.scene.sound.add(key);

        this.bgm.play({
            loop: true,
            volume: startVolume,
            delay: this.defaultsSound.delay,
            ...config,
        });

        this.scene.tweens.add({
            targets: this.bgm,
            volume,
            duration,
            ease: "Sine.easeIn",
        });
    }

    stop({ duration = 1000 }: { duration?: number }) {
        if (!this.bgm) return;

        const targetBgm = this.bgm;

        this.scene.tweens.killTweensOf(targetBgm);

        const stopBgm = () => {
            targetBgm.stop();
            targetBgm.destroy();

            if (this.bgm === targetBgm) {
                this.bgm = undefined;
                this.bgmKey = undefined;
            }
        };

        if (duration > 0) {
            this.scene.tweens.add({
                targets: targetBgm,
                volume: 0,
                duration,
                ease: "Sine.easeOut",
                onComplete: stopBgm,
            });
        } else {
            stopBgm();
        }
    }

    destroy() {
        this.stop({ duration: 0 });
    }
}

class SfxManager {
    private scene: Phaser.Scene;
    private defaultsSound: DefaultSoundType;

    constructor(scene: Phaser.Scene, defaultsSound: DefaultSoundType) {
        this.scene = scene;
        this.defaultsSound = defaultsSound;
    }

    play(key: string, config?: Phaser.Types.Sound.SoundConfig) {
        this.scene.sound.play(key, {
            volume: this.defaultsSound.volume,
            delay: this.defaultsSound.delay,
            ...config,
        });
    }
}

class VoiceManager {
    private scene: Phaser.Scene;
    private defaultsSound: DefaultSoundType;

    constructor(scene: Phaser.Scene, defaultsSound: DefaultSoundType) {
        this.scene = scene;
        this.defaultsSound = defaultsSound;
    }

    async play(key: string, config?: VoiceSoundConfig) {
        return new Promise<void>((resolve) => {
            const { nextWait = this.defaultsSound.nextWait, ...soundConfig } = config ?? {};

            const sound = this.scene.sound.add(key);

            let finished = false;

            const cleanup = () => {
                if (finished) return;

                finished = true;

                sound.removeAllListeners();
                sound.destroy();
            };

            const complete = () => {
                cleanup();

                if (!this.scene.sys.isActive()) {
                    resolve();
                    return;
                }

                this.scene.time.delayedCall(nextWait, () => {
                    resolve();
                });
            };

            sound.once("complete", complete);

            sound.once("stop", () => {
                cleanup();
                resolve();
            });

            sound.play({
                volume: this.defaultsSound.volume,
                delay: this.defaultsSound.delay,
                ...soundConfig,
            });
        });
    }

    async sequentialPlay(sounds: SoundType[]) {
        for (const sound of sounds) {
            await this.play(sound.key, {
                volume: sound.volume ?? this.defaultsSound.volume,
                delay: sound.delay ?? this.defaultsSound.delay,
                nextWait: sound.nextWait ?? this.defaultsSound.nextWait,
            });
        }
    }
}

export class SoundManager {
    public bgm: BgmManager;
    public sfx: SfxManager;
    public voice: VoiceManager;

    constructor(scene: Phaser.Scene, defaultsSound: DefaultSoundType) {
        this.bgm = new BgmManager(scene, defaultsSound);
        this.sfx = new SfxManager(scene, defaultsSound);
        this.voice = new VoiceManager(scene, defaultsSound);
    }
}
