import { useLayoutEffect, useState } from "react";

function useMaxVideoWidth() {
    const [maxWidth, setMaxWidth] = useState(() => {
        const { innerWidth: width, innerHeight: height } = window;
        return (width / 16) * 9 < height ? width : (height / 9) * 12;
    });

    useLayoutEffect(() => {
        const handleResize = () => {
            const { innerWidth: width, innerHeight: height } = window;
            const newMaxWidth = (width / 16) * 9 < height ? width : (height / 9) * 16;

            setMaxWidth((prev) => (prev !== newMaxWidth ? newMaxWidth : prev));
        };

        window.addEventListener("resize", handleResize);

        handleResize();

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return maxWidth;
}

export default useMaxVideoWidth;
