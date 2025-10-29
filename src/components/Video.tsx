import { memo, useEffect, useRef, useState } from "react";
import videojs from "video.js";
import Player from "video.js/dist/types/player";
import SpeedingAlert from "./SpeedingAlert";
import useMaxVideoWidth from "../hooks/useMaxVideoWidth";
import "video.js/dist/video-js.css";

export type VideoJsPlayer = Player;

interface VideoProps {
    options: typeof videojs.options;
    onReady: (player: VideoJsPlayer) => void;
}

const Video = ({ options, onReady }: VideoProps) => {
    const HOLD_DELAY = 2000;

    const [isSpeeding, setIsSpeeding] = useState(false);

    const maxwidth = useMaxVideoWidth();

    const videoRef = useRef<HTMLDivElement | null>(null);
    const playerRef = useRef<VideoJsPlayer | null>(null);
    const holdTimerRef = useRef<number | null>(null);
    const isSpeedingUpRef = useRef(false);

    useEffect(() => {
        if (!playerRef.current) {
            const videoElement = document.createElement("video-js");

            videoElement.classList.add("vjs-big-play-centered");

            videoRef?.current?.appendChild(videoElement);

            const player = (playerRef.current = videojs(videoElement, options, () => {
                onReady && onReady(player);
            }));
        } else {
            const player = playerRef.current;

            player.autoplay(options.autoplay);
            player.src(options.sources);
        }
    }, [options]);

    useEffect(() => {
        const player = playerRef.current;
        const element = player?.el();

        const handlePress = () => {
            holdTimerRef.current = setTimeout(() => {
                isSpeedingUpRef.current = true;
                setIsSpeeding(true);
                player?.playbackRate(2);
            }, HOLD_DELAY);
        };

        const handleRelease = () => {
            if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
            player?.playbackRate(1);

            const wasFast = isSpeedingUpRef.current;
            isSpeedingUpRef.current = false;
            setIsSpeeding(false);

            setTimeout(() => {
                if (wasFast && player?.paused()) {
                    player?.play();
                }
            }, 0);
        };

        const handleMobliePlayToggle = (e: any) => {
            if (e.target.nodeName === "VIDEO") {
                if (player?.paused()) {
                    player?.play();
                } else {
                    player?.pause();
                }
            }
        };

        element?.addEventListener("touchstart", handleMobliePlayToggle);
        element?.addEventListener("mousedown", handlePress);
        element?.addEventListener("mouseup", handleRelease);
        element?.addEventListener("mouseleave", handleRelease);
        element?.addEventListener("touchstart", handlePress);
        element?.addEventListener("touchend", handleRelease);
        element?.addEventListener("touchcancel", handleRelease);

        return () => {
            element?.removeEventListener("touchstart", handleMobliePlayToggle);
            element?.removeEventListener("mousedown", handlePress);
            element?.removeEventListener("mouseup", handleRelease);
            element?.removeEventListener("mouseleave", handleRelease);
            element?.removeEventListener("touchstart", handlePress);
            element?.removeEventListener("touchend", handleRelease);
            element?.removeEventListener("touchcancel", handleRelease);

            if (player && !player.isDisposed()) {
                player.dispose();
                playerRef.current = null;
            }
        };
    }, []);

    return (
        <div
            data-vjs-player
            className="relative"
            style={{ width: maxwidth < window.innerWidth ? `${maxwidth}px` : "100%" }}
        >
            <div ref={videoRef} />
            {isSpeeding && <SpeedingAlert />}
        </div>
    );
};

export default memo(Video);
