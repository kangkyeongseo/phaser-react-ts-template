import { DefaultSoundType, SoundType } from "../../types/config";

interface VoiceSoundConfig extends Phaser.Types.Sound.SoundConfig {
    nextWait?: number;
}

class BgmManager {
    private scene: Phaser.Scene;
    public bgm?: Phaser.Sound.BaseSound;
    private bgmKey?: string;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
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
            volume: startVolume,
            loop: true,
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
    private voice?: Phaser.Sound.BaseSound;
    private isStop: boolean;

    constructor(scene: Phaser.Scene, defaultsSound: DefaultSoundType) {
        this.scene = scene;
        this.defaultsSound = defaultsSound;
        this.isStop = false;
    }

    async play(key: string, config?: VoiceSoundConfig) {
        return new Promise<void>((resolve) => {
            const { nextWait = this.defaultsSound.nextWait, ...soundConfig } = config ?? {};

            this.voice = this.scene.sound.add(key);

            const cleanup = () => {
                this.voice?.removeAllListeners();
                this.voice?.destroy();
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

            this.voice.once("complete", complete);

            this.voice.play({
                volume: this.defaultsSound.volume,
                delay: this.defaultsSound.delay,
                ...soundConfig,
            });
        });
    }

    async sequentialPlay(sounds: SoundType[]) {
        for (const sound of sounds) {
            if (this.isStop) break;
            await this.play(sound.key, {
                volume: sound.volume ?? this.defaultsSound.volume,
                delay: sound.delay ?? this.defaultsSound.delay,
                nextWait: sound.nextWait ?? this.defaultsSound.nextWait,
            });
        }
    }

    stop() {
        if (this.isStop) return;
        this.isStop = true;
        this.voice?.stop();
    }
}

export class SoundManager {
    public bgm: BgmManager;
    public sfx: SfxManager;
    public voice: VoiceManager;

    constructor(scene: Phaser.Scene, defaultsSound: DefaultSoundType) {
        this.bgm = new BgmManager(scene);
        this.sfx = new SfxManager(scene, defaultsSound);
        this.voice = new VoiceManager(scene, defaultsSound);

        scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            this.voice.stop();
        });

        scene.events.once(Phaser.Scenes.Events.DESTROY, () => {
            this.voice.stop();
        });
    }
}
