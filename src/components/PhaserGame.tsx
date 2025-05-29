import { useEffect, useLayoutEffect, useRef, useState } from "react";
import StartGame from "../game/main";
import { EventBus } from "../game/utils/EventBus";

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

    useEffect(() => {
        const handleSceneCreate = (scene: Phaser.Scene) => {
            if (typeof ref === "function") {
                ref({ game: game.current, scene });
            } else if (ref) {
                ref.current = { game: game.current, scene };
            }
        };

        EventBus.on("scene-create", handleSceneCreate);

        return () => {
            EventBus.off("scene-create", handleSceneCreate);
        };
    }, [ref]);

    return <div id="game-container"></div>;
};

export default PhaserGame;
