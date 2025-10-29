import { useEffect, useRef, useState } from "react";
import PhaserGame, { PhaserGameRef } from "./components/PhaserGame";
import PauseSceneScreen from "./components/PauseSceneScreen";
import VideoContainer from "./components/VideoContainer";
import usePauseScene from "./hooks/usePauseScene";
import useGameReady from "./hooks/useGameReady";
import useFetch from "./hooks/useFetch";

function App() {
    const phaserRef = useRef<PhaserGameRef | null>(null);

    const [isPlayerVisible, setIsPlayerVisible] = useState(false);
    const [conId, setConId] = useState<number | null>();
    const [triggerPoints, setTriggerPoints] = useState<{ time: number; scene: string }[]>([]);
    const [typeOnStart, setTypeOnStart] = useState<"game" | "video" | null>(null);
    const [url, setUrl] = useState<string | null>();

    const isGameReady = useGameReady();
    const { isPause, resumeScene } = usePauseScene(phaserRef, isGameReady, isPlayerVisible);
    const { data, fetchData } = useFetch<{ vodUrl: string }>();

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const res = await fetch("assets/game/config.json");
                const data = await res.json();
                setConId(data.conId);
                setTriggerPoints(data.triggerPoints);
                setTypeOnStart(data.triggerPoints[0].time === 0 ? "game" : "video");
            } catch (error) {
                console.error("Failed to fetch config:", error);
            }
        };

        fetchConfig();
    }, []);

    useEffect(() => {
        if (!conId) return;

        if (import.meta.env.DEV) {
            setUrl("/assets/game/video/38230.mp4");
        }

        if (import.meta.env.PROD) {
            const url = `/api/v1/contents/${conId}/url`;
            const option = {
                method: "GET",
            };
            fetchData(url, option);
        }
    }, [conId]);

    useEffect(() => {
        if (!data) return;
        setUrl(data.vodUrl);
    }, [data]);

    if (!url) return;

    return (
        <div id="app">
            {!isPlayerVisible && isPause && <PauseSceneScreen resumeScene={resumeScene} />}
            <VideoContainer
                isGameReady={isGameReady}
                isPlayerVisible={isPlayerVisible}
                setIsPlayerVisible={setIsPlayerVisible}
                triggerPoints={triggerPoints}
                typeOnStart={typeOnStart}
                url={url}
            />
            <PhaserGame ref={phaserRef} />
        </div>
    );
}

export default App;
