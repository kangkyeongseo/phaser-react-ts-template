import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Video, { VideoJsPlayer } from "./Video";
import useWindowWidth from "../hooks/useWindowSize";
import { EventBus } from "../game/utils/EventBus";
import "video.js/dist/video-js.css";
import "videojs-markers/dist/videojs.markers.css";
import "videojs-markers";

interface Props {
    isGameReady: boolean;
    isPlayerVisible: boolean;
    setIsPlayerVisible: React.Dispatch<React.SetStateAction<boolean>>;
    triggerPoints: { time: number; scene: string }[];
    typeOnStart: "game" | "video" | null;
    url: string;
}

const SEEKING_SENSITIVITY = 1000;

const VideoContainer = ({
    isGameReady,
    isPlayerVisible,

    setIsPlayerVisible,
    triggerPoints,
    typeOnStart,
    url,
}: Props) => {
    const width = useWindowWidth();

    const playerRef = useRef<VideoJsPlayer | null>(null);
    const executedRef = useRef(new Set<number>([0]));
    const isSeekingRef = useRef(false);
    const playerCurrentTime = useRef(0);

    const [isPlayerReady, setIsPlayerReady] = useState(false);

    const videoJsOptions = useMemo(
        () => ({
            autoplay: typeOnStart === "video" ? true : false,
            controls: true,
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

    const triggerMap = useMemo(() => {
        const map = new Map<number, string>();
        for (const point of triggerPoints) {
            map.set(point.time, point.scene);
        }
        return map;
    }, [triggerPoints]);

    const handlePlayerReady = useCallback(
        (player: VideoJsPlayer) => {
            playerRef.current = player;

            (playerRef.current as any).markers({
                markers: triggerPoints.map((p) => ({
                    time: p.time,
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
                onMarkerClick: function (marker: { time: number; text: string }) {
                    const point = { time: marker.time, scene: marker.text };
                    stopPlayerForPlayGame(point);
                },
            });

            setIsPlayerReady(true);
        },
        [triggerPoints],
    );

    const stopPlayerForPlayGame = useCallback((point: { time: number; scene: string }) => {
        if (!playerRef.current) return;

        const currentTime = playerRef.current.currentTime();

        playerRef.current.pause();

        setIsPlayerVisible(false);
        playerCurrentTime.current = currentTime || 0;

        EventBus.emit("start-game", point.scene);

        executedRef.current.add(point.time);
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
        const floored = Math.floor(currentTime);

        if (!executedRef.current.has(floored) && triggerMap.has(floored)) {
            stopPlayerForPlayGame({ time: floored, scene: triggerMap.get(floored)! });
        }
    }, [isPlayerReady]);

    const backToPlayer = useCallback(() => {
        if (!playerRef.current) return;

        setIsPlayerVisible(true);
        playerRef.current.currentTime(playerCurrentTime.current);
        playerRef.current.play();
    }, []);

    useEffect(() => {
        if (!typeOnStart) return;
        if (!isGameReady) return;

        switch (typeOnStart) {
            case "video":
                setIsPlayerVisible(true);
                break;
            case "game":
                EventBus.emit("start-game", triggerPoints[0].scene);
                break;
        }
    }, [typeOnStart, isGameReady]);

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
