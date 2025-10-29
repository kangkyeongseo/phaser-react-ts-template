import { useCallback, useState } from "react";

function useFetch<T>() {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = useCallback(async (url: string, options: RequestInit) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(url, options);

            if (!response.ok) {
                throw new Error(`Error : ${response.status}`);
            }

            const isNoContent = response.status === 204;
            const json = isNoContent ? {} : await response.json();

            setData(json);
        } catch (error: any) {
            const asError = error instanceof Error ? error : new Error(String(error));
            setError(asError);
        } finally {
            setLoading(false);
        }
    }, []);

    return { data, loading, error, fetchData };
}

export default useFetch;
