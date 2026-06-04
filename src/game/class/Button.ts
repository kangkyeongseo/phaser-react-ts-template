type ButtonTweenConfig = Omit<Phaser.Types.Tweens.TweenBuilderConfig, "targets">;

type ButtonObject = Phaser.GameObjects.Image | Phaser.GameObjects.Sprite | Phaser.GameObjects.Container;

interface BaseButtonConfig {
    scale?: number;
    depth?: number;
    isInterActive?: boolean;
    tweensConfig?: ButtonTweenConfig;
    onStart?: () => void;
    onComplete?: () => void;
}

interface ButtonConfig extends BaseButtonConfig {
    x?: number;
    y?: number;
    key: string;
    frame?: number;
}

interface ContainerButtonConfig extends BaseButtonConfig {
    width: number;
    height: number;
    container: Phaser.GameObjects.Container;
}

abstract class BaseButton<T extends ButtonObject> {
    protected scene: Phaser.Scene;
    protected button: T;
    protected config: BaseButtonConfig;
    protected isDesktop: boolean;
    protected initScale: number;

    constructor(scene: Phaser.Scene, button: T, config: BaseButtonConfig, scale: number) {
        this.scene = scene;
        this.button = button;
        this.config = config;
        this.initScale = scale;
        this.isDesktop = scene.sys.game.device.os.desktop;

        this.setDefaultActive();
    }

    protected setDefaultActive() {
        const { tweensConfig, onStart = () => {}, onComplete = () => {} } = this.config;

        let tweens: Phaser.Tweens.Tween | null = null;
        let pointerOutTween: Phaser.Tweens.Tween | null = null;

        if (tweensConfig) {
            tweens = this.scene.tweens.add({
                targets: this.button,
                ...tweensConfig,
            });
        }

        this.button.on("pointerover", () => {
            if (tweens && tweens.isActive()) {
                tweens.pause();
            }
            if (pointerOutTween && pointerOutTween.isActive()) {
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
                              scale: this.initScale * 0.9,
                              ease: "Sine.easeInOut",
                              duration: 100,
                          },
                          {
                              scale: this.initScale * 1,
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

export class Button extends BaseButton<Phaser.GameObjects.Image | Phaser.GameObjects.Sprite> {
    constructor(scene: Phaser.Scene, config: ButtonConfig) {
        const { x = 0, y = 0, key, frame, scale = 1, depth = 1, isInterActive = false } = config;

        const button = frame ? scene.add.sprite(x, y, key, frame) : scene.add.image(x, y, key);

        button.setScale(scale);
        button.setDepth(depth);

        if (isInterActive) {
            button.setInteractive({ cursor: "pointer" });
        }

        super(scene, button, config, scale);
    }
}

export class ContainerButton extends BaseButton<Phaser.GameObjects.Container> {
    constructor(scene: Phaser.Scene, config: ContainerButtonConfig) {
        const { width, height, container, scale = 1, depth = 1, isInterActive = false } = config;

        container.setSize(width, height);
        container.setScale(scale);
        container.setDepth(depth);

        if (isInterActive) {
            container.setInteractive({
                hitArea: new Phaser.Geom.Rectangle(0, 0, width, height),
                hitAreaCallback: Phaser.Geom.Rectangle.Contains,
                useHandCursor: true,
            });
        }

        super(scene, container, config, scale);
    }
}
