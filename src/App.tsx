import { useRef } from "react";
import PhaserGame, { PhaserGameRef } from "./components/PhaserGame";

function App() {
    const phaserRef = useRef<PhaserGameRef | null>(null);

    return (
        <div id="app">
            <PhaserGame ref={phaserRef} />
        </div>
    );
}

export default App;
