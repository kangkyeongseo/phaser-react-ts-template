import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import PhaserGame, { PhaserGameRef } from "./components/PhaserGame";
import Video, { VideoJsPlayer } from "./components/Video";
import PauseSceneScreen from "./components/PauseSceneScreen";
import usePauseScene from "./hooks/usePauseScene";
import useGameReady from "./hooks/useGameReady";
import { EventBus } from "./game/utils/EventBus";

const START_PHASER_TIME = 2;

function App() {
    const [isPlayerVisible, setIsPlayerVisible] = useState(false);
    const [playerCurrentTime, setPlayerCurrentTime] = useState<number>(0);

    const playerRef = useRef<VideoJsPlayer | null>(null);
    const phaserRef = useRef<PhaserGameRef | null>(null);
    const startPhaserTimeRef = useRef(START_PHASER_TIME);
    const isStartedGameRef = useRef(false);

    const isGameReady = useGameReady();
    const { isPause, resumeScene } = usePauseScene(phaserRef, isGameReady, isPlayerVisible);

    const videoJsOptions = useMemo(
        () => ({
            autoplay: true,
            controls: true,
            fluid: true,
            playbackRates: [0.5, 1, 1.5, 2],
            sources: [
                {
                    src: "/assets/game/video/38230.mp4",
                    type: "video/mp4",
                },
            ],
        }),
        [],
    );

    const handlePlayerReady = useCallback((player: VideoJsPlayer) => {
        playerRef.current = player;

        player.on("timeupdate", () => {
            const currentTime = player.currentTime();
            if (isStartedGameRef.current) return;
            if (currentTime && Math.floor(currentTime) === startPhaserTimeRef.current) {
                setIsPlayerVisible(false);
                setPlayerCurrentTime(currentTime);
                player.pause();
                EventBus.emit("start-game");
                isStartedGameRef.current = true;
            }
        });
    }, []);

    useEffect(() => {
        if (isGameReady) {
            setIsPlayerVisible(true);
        }
    }, [isGameReady]);

    useEffect(() => {
        if (playerCurrentTime === 0) return;
        const backToPlayer = () => {
            setIsPlayerVisible(true);
            playerRef.current?.currentTime(playerCurrentTime);
            playerRef.current?.play();
        };

        EventBus.once("start-player", backToPlayer);

        return () => {
            EventBus.off("start-player", backToPlayer);
        };
    }, [playerCurrentTime]);

    return (
        <div id="app">
            {!isPlayerVisible && isPause && <PauseSceneScreen resumeScene={resumeScene} />}
            <div className={`fixed w-[100%] items-center justify-center ${isPlayerVisible ? "flex" : "hidden"}`}>
                <Video options={videoJsOptions} onReady={handlePlayerReady} />
            </div>
            <PhaserGame ref={phaserRef} />
        </div>
    );
}

export default App;
