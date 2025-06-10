import { useEffect, useRef, useState } from "react";
import PhaserGame, { PhaserGameRef } from "./components/PhaserGame";
import Video, { VideoJsPlayer } from "./components/Video";
import PauseSceneScreen from "./components/PauseSceneScreen";
import usePauseScene from "./hooks/usePauseScene";
import useGameReady from "./hooks/useGameReady";

function App() {
    const [isPlayer, setIsPlayer] = useState(false);

    const playerRef = useRef<VideoJsPlayer | null>(null);
    const phaserRef = useRef<PhaserGameRef | null>(null);

    const isGameReady = useGameReady();
    const { isPause, resumeScene } = usePauseScene(phaserRef, isGameReady);

    useEffect(() => {
        if (isGameReady) {
            setIsPlayer(true);
        }
    }, [isGameReady]);

    const videoJsOptions = {
        autoplay: true,
        controls: true,
        fluid: true,
        playbackRates: [0.5, 1, 1.5, 2],
        sources: [
            {
                src: "/assets/game/video/38229.mp4",
                type: "video/mp4",
            },
        ],
    };

    const handlePlayerReady = (player: VideoJsPlayer) => {
        playerRef.current = player;
    };

    return (
        <div id="app">
            {!isPlayer && isPause && <PauseSceneScreen resumeScene={resumeScene} />}
            {isPlayer ? <Video options={videoJsOptions} onReady={handlePlayerReady} /> : <PhaserGame ref={phaserRef} />}
        </div>
    );
}

export default App;
