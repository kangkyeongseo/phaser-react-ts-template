import { useEffect, useRef, useState } from "react";

type relatedVideo = { conId: number; conGroupId: number; type: "video" | "module" | "flash" };

interface Config {
    name: string;
    conId: number;
    conGroupId: number;
    relatedVideos: relatedVideo[];
    recordPoint: { [stage: string]: [number, number] };
}

const RelatedVideo = () => {
    const [config, setConfig] = useState<Config | null>(null);
    const [isDev, setIsDev] = useState(true);
    const [action, setAction] = useState("");
    const [conId, setConId] = useState(0);
    const [conGroupId, setConGroupId] = useState(0);
    const [canvasHeight, setCanvasHeight] = useState(0);

    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        fetch("assets/game/config.json")
            .then((response) => response.json())
            .then((config) => setConfig(config));
    }, []);

    useEffect(() => {
        const origin = window.location.origin;
        const url = new URL(origin);
        const cleanUrl = `${url.protocol}/${url.hostname}`;

        if (cleanUrl.includes("genikids")) {
            setIsDev(false);
        } else {
            setIsDev(true);
        }
    }, []);

    useEffect(() => {
        if (conId === 0) return;
        if (conGroupId === 0) return;
        formRef.current?.submit();
        setConId(0);
        setConGroupId(0);
    }, [conId, conGroupId]);

    useEffect(() => {
        let observer: ResizeObserver;
        const checkCanvas = setInterval(() => {
            const canvas = document.querySelector("canvas");

            if (canvas) {
                clearInterval(checkCanvas);

                const updateSize = () => {
                    const rect = canvas.getBoundingClientRect();
                    setCanvasHeight(rect.height);
                };

                updateSize();

                observer = new ResizeObserver(() => {
                    updateSize();
                });

                observer.observe(canvas);
            }
        }, 100);

        return () => {
            clearInterval(checkCanvas);
            if (observer) observer.disconnect();
        };
    }, []);

    const onImgClick = (relatedVideo: relatedVideo) => {
        setConId(relatedVideo.conId);
        setConGroupId(relatedVideo.conGroupId);
        const url = isDev ? "https://devm.genikids.com/" : "/";

        switch (relatedVideo.type) {
            case "video":
                setAction(url + "Player/");
                break;
            case "module":
                setAction(url + "Player/html5.asp");
                break;
            case "flash":
                setAction(url + "Player/");
                break;
        }
    };

    return (
        <div className="fixed top-0 left-1/2 flex h-[100%] -translate-x-1/2 items-center">
            <div className="flex items-end" style={{ height: canvasHeight !== 0 ? canvasHeight : 0 }}>
                {config && (
                    <form className="hidden" method="POST" action={action} ref={formRef} target="_blank">
                        <input type="hidden" name="conid" value={conId} />
                        <input type="hidden" name="ConGroupId" value={conGroupId} />
                    </form>
                )}
                <div className="flex" style={{ marginBottom: canvasHeight / 11 }}>
                    {config?.relatedVideos?.map((relatedVideo, index) => (
                        <div className="relative" key={relatedVideo.conId}>
                            <img
                                src="assets/game/image/img-ending-pointer.webp"
                                className={`absolute ${canvasHeight > 0 ? "animate-pointer" : ""}`}
                                style={{ height: canvasHeight !== 0 ? `${canvasHeight / 15}px` : 0 }}
                            />
                            <img
                                style={{ height: canvasHeight !== 0 ? `${canvasHeight / 3.2}px` : 0 }}
                                src={`assets/game/image/img-ending-related-${(index + 1).toString().padStart(2, "0")}.webp`}
                                onClick={() => onImgClick(relatedVideo)}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RelatedVideo;
