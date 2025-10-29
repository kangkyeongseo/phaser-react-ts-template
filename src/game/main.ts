import { AUTO, Game } from "phaser";
import { Boot } from "./scenes/Boot";
import { Preloader } from "./scenes/Preloader";
import { Quiz } from "./scenes/Quiz";

const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: 1920,
    height: 1080,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    parent: "game-container",
    scene: [Boot, Preloader, Quiz],
};

const StartGame = (parent: string) => {
    return new Game({ ...config, parent });
};

export default StartGame;
