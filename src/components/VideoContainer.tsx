import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Video, { VideoJsPlayer } from "./Video";
import useWindowWidth from "../hooks/useWindowSize";
import { EventBus } from "../game/utils/EventBus";
import "video.js/dist/video-js.css";
import "videojs-markers/dist/videojs.markers.css";
import "videojs-markers";

interface Props {
    isModuleReady: boolean;
    isPlayerVisible: boolean;
    setIsPlayerVisible: React.Dispatch<React.SetStateAction<boolean>>;
    setIsGame: React.Dispatch<React.SetStateAction<boolean>>;
    setIsGameReady: React.Dispatch<React.SetStateAction<boolean>>;
    triggerPoints: { time: number; restartTime: number; scene: string }[];
    typeOnStart: "game" | "video" | null;
    url: string;
}

const SEEKING_SENSITIVITY = 1000;
const TOLERANCE = 0.2;

const VideoContainer = ({
    isModuleReady,
    isPlayerVisible,
    setIsPlayerVisible,
    setIsGame,
    setIsGameReady,
    triggerPoints,
    typeOnStart,
    url,
}: Props) => {
    const width = useWindowWidth();

    const playerRef = useRef<VideoJsPlayer | null>(null);
    const isSeekingRef = useRef(false);
    const isGameStarting = useRef(false);
    const playerCurrentTime = useRef(0);

    const [isPlayerReady, setIsPlayerReady] = useState(false);

    const videoJsOptions = useMemo(
        () => ({
            autoplay: typeOnStart === "video" ? true : false,
            controls: true,
            controlBar: {
                fullscreenToggle: false,
            },
            playsinline: true,
            html5: {
                nativeControlsForTouch: false,
            },
            fluid: true,
            playbackRates: [0.5, 1, 1.5, 2],
            userActions: {
                click: true,
            },
            sources: [
                {
                    src: url,
                    type: "video/mp4",
                },
            ],
        }),
        [typeOnStart, url],
    );

    const handlePlayerReady = useCallback(
        (player: VideoJsPlayer) => {
            playerRef.current = player;

            (playerRef.current as any).markers({
                markers: triggerPoints.map((p) => ({
                    time: p.time,
                    restartTime: p.restartTime,
                    text: p.scene,
                })),
                markerStyle: {
                    width: width > 768 ? "12px" : "4px",
                    height: width > 768 ? "12px" : "100%",
                    bottom: width > 768 ? "-5px" : "0",
                    "border-radius": width > 768 ? "100%" : "0",
                    "background-color": "white",
                },
                markerTip: {
                    display: false,
                },
                onMarkerClick: function (marker: { time: number; restartTime: number; text: string }) {
                    const point = { time: marker.time, restartTime: marker.restartTime, scene: marker.text };
                    stopPlayerForPlayGame(point);
                },
            });

            setIsPlayerReady(true);
        },
        [triggerPoints],
    );

    const stopPlayerForPlayGame = useCallback((point: { time: number; restartTime: number; scene: string }) => {
        if (!playerRef.current) return;
        if (isGameStarting.current) return;
        isGameStarting.current = true;

        playerCurrentTime.current = point.restartTime || 0;

        setIsGame(true);

        const handleGameReady = () => {
            setTimeout(() => {
                setIsGameReady(true);
                setIsPlayerVisible(false);
                playerRef.current?.pause();
                EventBus.emit("start-game", point.scene);
                isGameStarting.current = false;
            }, 100);
        };

        EventBus.off("game-ready");
        EventBus.once("game-ready", handleGameReady);
    }, []);

    const handleTimeUpdate = useCallback(() => {
        if (!playerRef.current) return;
        if (triggerPoints.length === 0) return;
        if (playerRef.current.seeking()) {
            isSeekingRef.current = true;
            setTimeout(() => {
                isSeekingRef.current = false;
            }, SEEKING_SENSITIVITY);
            return;
        }
        if (isSeekingRef.current) {
            return;
        }
        const currentTime = playerRef.current.currentTime() as number;

        for (const { time, restartTime, scene } of triggerPoints) {
            if (Math.abs(time - currentTime) <= TOLERANCE) {
                stopPlayerForPlayGame({ time, restartTime, scene });
                break;
            }
        }
    }, [isPlayerReady]);

    const backToPlayer = useCallback(() => {
        if (!playerRef.current) return;

        setIsPlayerVisible(true);
        setIsGame(false);
        setIsGameReady(false);

        playerRef.current.currentTime(playerCurrentTime.current);
        playerRef.current.play();
    }, []);

    useEffect(() => {
        if (!typeOnStart) return;
        if (!isModuleReady) return;

        switch (typeOnStart) {
            case "video":
                setIsPlayerVisible(true);
                break;
            case "game":
                playerCurrentTime.current = triggerPoints[0].restartTime;
                setIsGame(true);
                const handleGameReady = () => {
                    setTimeout(() => {
                        setIsGameReady(true);
                        EventBus.emit("start-game", triggerPoints[0].scene);
                    }, 100);
                    EventBus.off("game-ready", handleGameReady);
                };
                EventBus.once("game-ready", handleGameReady);
                break;
        }
    }, [typeOnStart, isModuleReady]);

    useEffect(() => {
        if (!playerRef.current) return;

        const player = playerRef.current;
        player.on("timeupdate", handleTimeUpdate);

        return () => {
            player.off("timeupdate", handleTimeUpdate);
        };
    }, [handleTimeUpdate]);

    useEffect(() => {
        EventBus.on("start-player", backToPlayer);

        return () => {
            EventBus.off("start-player", backToPlayer);
        };
    }, [backToPlayer]);

    return (
        <div className={`fixed w-full items-center justify-center ${isPlayerVisible ? "flex" : "hidden"}`}>
            <Video options={videoJsOptions} onReady={handlePlayerReady} />
        </div>
    );
};

export default VideoContainer;
