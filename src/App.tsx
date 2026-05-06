import { useEffect, useRef, useState } from "react";
import PhaserGame, { PhaserGameRef } from "./components/PhaserGame";
import PauseSceneScreen from "./components/PauseSceneScreen";
import VideoContainer from "./components/VideoContainer";
import usePauseScene from "./hooks/usePauseScene";
import useModuleReady from "./hooks/useModuleReady";
import useFetch from "./hooks/useFetch";

function App() {
    const phaserRef = useRef<PhaserGameRef | null>(null);

    const [isPlayerVisible, setIsPlayerVisible] = useState(false);
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);
    const [isGame, setIsGame] = useState(false);
    const [isGameReady, setIsGameReady] = useState(false);
    const [conId, setConId] = useState<number | null>();
    const [triggerPoints, setTriggerPoints] = useState<{ time: number; restartTime: number; scene: string }[]>([]);
    const [typeOnStart, setTypeOnStart] = useState<"game" | "video" | null>(null);
    const [url, setUrl] = useState<string | null>();

    const isModuleReady = useModuleReady(isVideoLoaded);
    const { isPause, resumeScene } = usePauseScene({ phaserRef, isModuleReady, isPlayerVisible, isGameReady });
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
            setIsVideoLoaded(true);
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
        setIsVideoLoaded(true);
    }, [data]);

    if (!url) return;

    return (
        <div id="app">
            {!isPlayerVisible && isPause && <PauseSceneScreen resumeScene={resumeScene} />}
            <VideoContainer
                isModuleReady={isModuleReady}
                isPlayerVisible={isPlayerVisible}
                setIsPlayerVisible={setIsPlayerVisible}
                setIsGame={setIsGame}
                setIsGameReady={setIsGameReady}
                triggerPoints={triggerPoints}
                typeOnStart={typeOnStart}
                url={url}
            />
            {isGame && <PhaserGame ref={phaserRef} />}
        </div>
    );
}

export default App;
