const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

class ApiError extends Error {
    readonly statusCode: number
    constructor(message: string, statusCode: number) {
        super(message)
        this.name = 'ApiError'
        this.statusCode = statusCode
    }
}

async function request<T>(
    method: HttpMethod,
    path: string,
    payload?: unknown
): Promise<T> {
    const token = localStorage.getItem("token");

    const url = `${API_BASE_URL}${path}`;

    let res = await fetch(url, {
        method,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: payload !== undefined ? JSON.stringify(payload) : undefined,
    });

    if (res.status === 401) {
        const refreshToken = localStorage.getItem("refresh_token");
        if (refreshToken) {
            try {
                const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ refresh_token: refreshToken })
                });

                if (refreshRes.ok) {
                    const data = await refreshRes.json();
                    localStorage.setItem("token", data.access_token);
                    localStorage.setItem("refresh_token", data.refresh_token);

                    // Retry original request
                    res = await fetch(url, {
                        method,
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${data.access_token}`
                        },
                        body: payload !== undefined ? JSON.stringify(payload) : undefined,
                    });
                } else {
                    localStorage.removeItem("token");
                    localStorage.removeItem("refresh_token");
                    window.dispatchEvent(new Event("auth:unauthorized"));
                }
            } catch (error) {
                localStorage.removeItem("token");
                localStorage.removeItem("refresh_token");
                window.dispatchEvent(new Event("auth:unauthorized"));
            }
        } else {
            localStorage.removeItem("token");
            window.dispatchEvent(new Event("auth:unauthorized"));
        }
    }

    if (!res.ok) {
        throw new ApiError(`Erro ${res.status}: ${res.statusText}`, res.status)
    }

    if (res.status === 204) {
        return null as T;
    }

    return res.json() as Promise<T>;
}

export const api = {
    get: <T>(path: string) => request<T>("GET", path),
    post: <T>(path: string, body: unknown) => request<T>("POST", path, body),
    put: <T>(path: string, body: unknown) => request<T>("PUT", path, body),
    patch: <T>(path: string, body: unknown) => request<T>("PATCH", path, body),
    delete: <T>(path: string) => request<T>("DELETE", path),
};

export { ApiError };

export function toQueryString(params?: Record<string, unknown>): string {
    if (!params) return "";
    const filtered = Object.entries(params).filter(
        ([, v]) => v !== undefined && v !== null && v !== ""
    );
    if (!filtered.length) return "";
    return "?" + new URLSearchParams(filtered.map(([k, v]) => [k, String(v)])).toString();
}