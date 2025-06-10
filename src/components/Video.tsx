import { useEffect, useRef } from "react";
import videojs from "video.js";
import Player from "video.js/dist/types/player";
import "video.js/dist/video-js.css";

export type VideoJsPlayer = Player;

interface VideoProps {
    options: typeof videojs.options;
    onReady: (player: VideoJsPlayer) => void;
}

const Video = ({ options, onReady }: VideoProps) => {
    const videoRef = useRef<HTMLDivElement | null>(null);
    const playerRef = useRef<VideoJsPlayer | null>(null);

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
    }, [options, videoRef]);

    useEffect(() => {
        const player = playerRef.current;

        return () => {
            if (player && !player.isDisposed()) {
                player.dispose();
                playerRef.current = null;
            }
        };
    }, [playerRef]);

    return (
        <div data-vjs-player className="w-100">
            <div ref={videoRef} />
        </div>
    );
};

export default Video;
