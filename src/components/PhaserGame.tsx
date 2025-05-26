import { useLayoutEffect, useRef } from "react";
import StartGame from "../game/main";

export interface PhaserGameRef {
    game: Phaser.Game | null;
    scene: Phaser.Scene | null;
}

interface PhaserGameProps {
    ref: React.Ref<PhaserGameRef | null>;
}

const PhaserGame = ({ ref }: PhaserGameProps) => {
    const game = useRef<Phaser.Game | null>(null!);

    useLayoutEffect(() => {
        if (game.current === null) {
            game.current = StartGame("game-container");
            if (typeof ref === "function") {
                ref({ game: game.current, scene: null });
            } else if (ref) {
                ref.current = { game: game.current, scene: null };
            }
        }

        return () => {
            if (game.current) {
                game.current.destroy(true);
                if (game.current !== null) {
                    game.current = null;
                }
            }
        };
    }, [ref]);

    return <div id="game-container"></div>;
};

export default PhaserGame;
