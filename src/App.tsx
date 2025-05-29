import { useRef } from "react";
import PhaserGame, { PhaserGameRef } from "./components/PhaserGame";
import usePauseScene from "./hooks/usePauseScene";
import PauseSceneScreen from "./components/PauseSceneScreen";
import useGameReady from "./hooks/useGameReady";

function App() {
    const phaserRef = useRef<PhaserGameRef | null>(null);
    const isGameReady = useGameReady();
    const { isPause, resumeScene } = usePauseScene(phaserRef, isGameReady);

    return (
        <div id="app">
            {isPause && <PauseSceneScreen resumeScene={resumeScene} />}
            <PhaserGame ref={phaserRef} />
        </div>
    );
}

export default App;
