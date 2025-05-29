export class SoundManager {
    private scene: Phaser.Scene;
    private sounds: Record<string, Phaser.Sound.BaseSound> = {};

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }

    load(key: string, config?: Phaser.Types.Sound.SoundConfig) {
        this.sounds[key] = this.scene.sound.add(key, config);
    }

    play(key: string, config?: Phaser.Types.Sound.SoundConfig) {
        if (!this.sounds[key]) {
            this.load(key);
        }
        this.sounds[key].play(config);
    }

    stop(key: string) {
        if (this.sounds[key] && this.sounds[key].isPlaying) {
            this.sounds[key].stop();
        }
    }

    loop(key: string, { volume = 1, delay = 0 }) {
        if (!this.sounds[key]) {
            this.load(key, { loop: true, volume });
        }
        this.sounds[key].play({ loop: true, volume, delay });
    }

    isPlaying(key: string) {
        return this.sounds[key]?.isPlaying ?? false;
    }
}
