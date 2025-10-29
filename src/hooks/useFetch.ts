import { useCallback, useState } from "react";

function useFetch<T>() {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = useCallback(async (url: string, options?: RequestInit) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`Error : ${response.status}`);
            }
            const json = (await response.json()) as T;
            setData(json);
        } catch (error: any) {
            setError(error);
        } finally {
            setLoading(false);
        }
    }, []);

    return { data, loading, error, fetchData };
}

export default useFetch;
