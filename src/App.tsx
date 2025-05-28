import { useEffect, useRef } from "react";
import PhaserGame, { PhaserGameRef } from "./components/PhaserGame";
import { EventBus } from "./game/EventBus";

function App() {
    const phaserRef = useRef<PhaserGameRef | null>(null);

    useEffect(() => {
        EventBus.on("ready", () => {
            const loadingContainer =
                document.querySelector(".loading-container");
            loadingContainer?.remove();
        });

        return () => {
            EventBus.off("ready");
        };
    }, []);

    return (
        <div id="app">
            <PhaserGame ref={phaserRef} />
        </div>
    );
}

export default App;
