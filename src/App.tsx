import { useEffect, useRef, useState } from "react";
import PhaserGame, { PhaserGameRef } from "./components/PhaserGame";
import { EventBus } from "./game/utils/EventBus";

function App() {
    const phaserRef = useRef<PhaserGameRef | null>(null);
    const [isGameReady, setIsGameReady] = useState(false);

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
            <PhaserGame ref={phaserRef} isGameReady={isGameReady} />
        </div>
    );
}

export default App;
