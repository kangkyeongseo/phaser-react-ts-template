export class Loading {
    private scene!: Phaser.Scene;
    private depth!: number;
    private loadingSpinner!: Phaser.GameObjects.Image;
    private loadingTween!: Phaser.Tweens.Tween;

    constructor(scene: Phaser.Scene, depth?: number) {
        this.scene = scene;
        this.depth = depth ? depth : 100;
    }

    add() {
        const width = this.scene.scale.width;
        const height = this.scene.scale.height;

        this.loadingSpinner = this.scene.add.image(width / 2, height / 2, "shared-spinner");
        this.loadingSpinner.setDepth(this.depth);

        this.loadingTween = this.scene.tweens.add({
            targets: this.loadingSpinner,
            angle: { from: 0, to: 360 },
            duration: 1000,
            repeat: -1,
        });
    }

    pause() {
        this.loadingSpinner.setVisible(false);
        this.loadingTween.pause();
    }

    restart() {
        this.loadingSpinner.setVisible(true);
        this.loadingTween.restart();
    }

    remove() {
        this.loadingSpinner.destroy();
        this.loadingTween.destroy();
    }
}
