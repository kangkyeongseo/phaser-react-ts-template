import { useEffect, useState } from "react";
import { EventBus } from "../game/utils/EventBus";

function useGameReady() {
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

    return isGameReady;
}

export default useGameReady;
