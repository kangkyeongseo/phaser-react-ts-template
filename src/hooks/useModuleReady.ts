import { useEffect, useState } from "react";

function useModuleReady(isVideoLoaded: boolean) {
    const [isModuleReady, setIsModuleReady] = useState(false);

    useEffect(() => {
        if (!isVideoLoaded) return;
        const loadingContainer = document.querySelector(".loading-container");
        loadingContainer?.remove();
        setIsModuleReady(true);
    }, [isVideoLoaded]);

    return isModuleReady;
}

export default useModuleReady;

