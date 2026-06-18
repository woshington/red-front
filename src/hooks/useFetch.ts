import { useCallback, useEffect, useState } from "react";

interface State<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
}

export function useFetch<T>(fetcher: () => Promise<T>, deps: unknown[] = []) {
    const [state, setState] = useState<State<T>>({
        data: null,
        loading: false,
        error: null,
    });


    const load = useCallback(async () => {
        setState((s) => ({ ...s, loading: true, error: null }))
        try {
            const data = await fetcher()
            setState({ data, loading: false, error: null })
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erro desconhecido'
            setState({ data: null, loading: false, error: message });

        }
    }, deps);

    useEffect(() => { load(); }, [load]);

    return { ...state, reload: load };

}