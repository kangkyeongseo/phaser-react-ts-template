import { useCallback, useEffect, useState } from "react";
import { PhaserGameRef } from "../components/PhaserGame";

interface usePauseSceneProps {
    phaserRef: React.RefObject<PhaserGameRef | null>;
    isModuleReady: boolean;
    isPlayerVisible: boolean;
    isGameReady: boolean;
}

function usePauseScene({ phaserRef, isModuleReady, isPlayerVisible, isGameReady }: usePauseSceneProps) {
    const [isPause, setIsPause] = useState(false);

    const pauseScene = useCallback(() => {
        const game = phaserRef.current?.game;
        if (isModuleReady && game) {
            setIsPause(true);
            game.pause();
            game.sound.pauseAll();
        }
    }, [isModuleReady]);

    const resumeScene = useCallback(() => {
        const game = phaserRef.current?.game;
        if (isModuleReady && game) {
            setIsPause(false);
            game.resume();
            game.sound.resumeAll();
        }
    }, [isModuleReady]);

    useEffect(() => {
        const game = phaserRef.current?.game;
        if (isPlayerVisible) return;
        if (!isModuleReady) return;
        if (!isGameReady) return;
        if (!game) return;

        if (game && game.sound instanceof Phaser.Sound.WebAudioSoundManager) {
            const soundManager = game.sound;
            const handleStateChange = () => {
                if (soundManager.context?.state === "suspended") {
                    pauseScene();
                }
            };

            handleStateChange();
            soundManager.context.onstatechange = handleStateChange;
        }
    }, [isModuleReady, isPlayerVisible, isGameReady]);

    return { isPause, pauseScene, resumeScene };
}

export default usePauseScene;
