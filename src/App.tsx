import { useEffect, useRef, useState } from "react";
import PhaserGame, { PhaserGameRef } from "./components/PhaserGame";
import { EventBus } from "./game/utils/EventBus";
import usePauseScene from "./hooks/usePauseScene";
import PauseSceneScreen from "./components/PauseSceneScreen";

function App() {
    const phaserRef = useRef<PhaserGameRef | null>(null);
    const [isGameReady, setIsGameReady] = useState(false);
    const { isPause, resumeScene } = usePauseScene(phaserRef, isGameReady);

    useEffect(() => {
        const handleGameReady = () => {
            const loadingContainer = document.querySelector(".loading-container");
            loadingContainer?.remove();
            setIsGameReady(true);
        };
        EventBus.on("game-ready", handleGameReady);

        return () => {
            EventBus.off("game-ready", handleGameReady);
        };
    }, []);

    return (
        <div id="app">
            {isPause && <PauseSceneScreen resumeScene={resumeScene} />}
            <PhaserGame ref={phaserRef} />
        </div>
    );
}

export default App;
