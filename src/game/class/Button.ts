type ButtonTweenConfig = Omit<Phaser.Types.Tweens.TweenBuilderConfig, "targets">;

interface ButtonConfig {
    x: number;
    y: number;
    texture: string;
    frame?: number;
    scale?: number;
    depth?: number;
    isInterActive?: boolean;
    tweensConfig?: ButtonTweenConfig;
    onStart?: () => void;
    onComplete?: () => void;
}

export class Button {
    private scene!: Phaser.Scene;
    private config!: ButtonConfig;
    private isDesktop!: boolean;
    private button!: Phaser.GameObjects.Image;
    private initScale!: number;

    constructor(scene: Phaser.Scene, config: ButtonConfig) {
        this.scene = scene;
        this.config = config;
        this.isDesktop = this.scene.sys.game.device.os.desktop;

        const { x, y, texture, frame, scale = 1, depth = 1, isInterActive = false } = this.config;

        this.button = frame ? this.scene.add.sprite(x, y, texture, frame) : this.scene.add.image(x, y, texture);
        this.button.scale = scale;
        this.button.depth = depth;
        this.initScale = scale;
        if (isInterActive) this.button.setInteractive({ cursor: "pointer" });
        this.setDefaultActive();
    }

    setDefaultActive() {
        const { tweensConfig, onStart = () => {}, onComplete = () => {} } = this.config;
        let tweens: Phaser.Tweens.Tween | null;
        let pointerOutTween: Phaser.Tweens.Tween | null;

        if (tweensConfig) {
            tweens = this.scene.tweens.add({
                targets: this.button,
                ...tweensConfig,
            });
        }

        this.button.on("pointerover", () => {
            if (tweens) {
                tweens.pause();
            }
            if (pointerOutTween) {
                pointerOutTween.pause();
            }
            this.button.setScale(this.initScale * 1.1);
        });
        this.button.on("pointerout", () => {
            if (tweens) {
                pointerOutTween = this.scene.tweens.add({
                    targets: this.button,
                    scale: this.initScale * 1,
                    ease: "Sine.easeInOut",
                    duration: 300,
                    onComplete: () => {
                        if (tweens) tweens.restart();
                    },
                });
            } else {
                this.button.setScale(this.initScale);
            }
        });
        this.button.on("pointerdown", () => {
            onStart();
            this.button.removeInteractive();
            !this.isDesktop && tweens
                ? onComplete()
                : this.scene.tweens.chain({
                      targets: this.button,
                      tweens: [
                          {
                              scale: this.isDesktop ? this.initScale * 1 : this.initScale * 0.9,
                              ease: "Sine.easeInOut",
                              duration: 100,
                          },
                          {
                              scale: this.isDesktop ? this.initScale * 1.1 : this.initScale * 1,
                              ease: "Sine.easeInOut",
                              duration: 100,
                          },
                      ],
                      onComplete,
                  });
        });
    }

    get object() {
        return this.button;
    }
}
