import { useEffect, useLayoutEffect, useRef, useState } from "react";
import StartGame from "../game/main";
import { EventBus } from "../game/EventBus";
import PauseSceneScreen from "./PauseSceneScreen";

export interface PhaserGameRef {
    game: Phaser.Game | null;
    scene: Phaser.Scene | null;
}

interface PhaserGameProps {
    ref: React.Ref<PhaserGameRef | null>;
    isGameReady: boolean;
}

const PhaserGame = ({ ref, isGameReady }: PhaserGameProps) => {
    const game = useRef<Phaser.Game | null>(null!);

    const [isPause, setIsPause] = useState(false);

    const pauseScene = () => {
        setIsPause(true);
        game.current?.pause();
        game.current?.sound.pauseAll();
    };

    const resumeScene = () => {
        setIsPause(false);
        game.current?.resume();
        game.current?.sound.resumeAll();
    };

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
        if (isGameReady && game.current?.sound instanceof Phaser.Sound.WebAudioSoundManager) {
            const soundManager = game.current.sound;
            const handleStateChange = () => {
                if (soundManager.context.state === "suspended") {
                    pauseScene();
                }
            };
            soundManager.context.onstatechange = handleStateChange;

            return () => {
                soundManager.context.onstatechange = null;
            };
        }
    }, [isGameReady]);

    return (
        <>
            {isPause && <PauseSceneScreen resumeScene={resumeScene} />}
            <div id="game-container"></div>
        </>
    );
};

export default PhaserGame;
