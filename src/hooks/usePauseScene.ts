import { useCallback, useEffect, useState } from "react";
import { PhaserGameRef } from "../components/PhaserGame";

function usePauseScene(
    phaserRef: React.RefObject<PhaserGameRef | null>,
    isGameReady: boolean,
    isPlayerVisible: boolean,
) {
    const [isPause, setIsPause] = useState(false);

    const pauseScene = useCallback(() => {
        const game = phaserRef.current?.game;
        if (isGameReady && game) {
            setIsPause(true);
            game.pause();
            game.sound.pauseAll();
        }
    }, [isGameReady]);

    const resumeScene = useCallback(() => {
        const game = phaserRef.current?.game;
        if (isGameReady && game) {
            setIsPause(false);
            game.resume();
            game.sound.resumeAll();
        }
    }, [isGameReady]);

    useEffect(() => {
        const game = phaserRef.current?.game;
        if (isPlayerVisible) return;
        if (!isGameReady) return;
        if (game && game.sound instanceof Phaser.Sound.WebAudioSoundManager) {
            const soundManager = game.sound;
            const handleStateChange = () => {
                if (soundManager.context?.state === "suspended") {
                    pauseScene();
                }
            };

            handleStateChange();
            soundManager.context.onstatechange = handleStateChange;

            return () => {
                soundManager.context.onstatechange = null;
            };
        }
    }, [isGameReady, isPlayerVisible]);

    return { isPause, pauseScene, resumeScene };
}

export default usePauseScene;
