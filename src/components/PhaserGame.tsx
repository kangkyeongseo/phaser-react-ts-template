import { useEffect, useLayoutEffect, useRef, useState } from "react";
import StartGame from "../game/main";
import { EventBus } from "../game/utils/EventBus";
import RelatedVideo from "./RelatedVideo";

export interface PhaserGameRef {
    game: Phaser.Game | null;
    scene: Phaser.Scene | null;
}

interface PhaserGameProps {
    ref: React.Ref<PhaserGameRef | null>;
}

const PhaserGame = ({ ref }: PhaserGameProps) => {
    const game = useRef<Phaser.Game | null>(null!);
    const [isEnding, setIsEnding] = useState(false);

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

    useEffect(() => {
        const handleRelatedCreate = (type: "block" | "hidden") => {
            if (type === "block") {
                setIsEnding(true);
            } else {
                setIsEnding(false);
            }
        };

        EventBus.on("related-create", handleRelatedCreate);

        return () => {
            EventBus.off("related-create", handleRelatedCreate);
        };
    }, []);

    return <div id="game-container">{isEnding && <RelatedVideo />}</div>;
};

export default PhaserGame;
