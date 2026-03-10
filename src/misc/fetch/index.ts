import { logger } from "../../utils/logging.js";

export class APIError extends Error {
    constructor(
        public message: string,
        public status: number,
        public statusText: string | undefined = undefined,
        public data: any = null,
    ) {
        super(message);
        this.name = "APIError";
    }
}

type Options = RequestInit & { asBlob?: boolean; asArrayBuffer?: boolean; handleHeaders?: (headers: Headers) => void };

class Fetch {
    private baseUrl: string;
    private defaultOptions: RequestInit;

    constructor(baseUrl: string = "") {
        this.baseUrl = baseUrl;
        this.defaultOptions = {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            credentials: "include",
        };
    }

    /**
     * Centralized request handler to manage errors and JSON parsing
     */
    private async request<T>(url: string, options: Options): Promise<T> {
        const fullUrl = url.startsWith("http") ? url : `${this.baseUrl}${url}`;

        try {
            const response = await fetch(fullUrl, {
                ...this.defaultOptions,
                ...options,
                headers: {
                    ...this.defaultOptions.headers,
                    ...options.headers,
                },
            });

            // Handle 4xx and 5xx errors
            if (!response.ok) {
                let errorData;
                try {
                    errorData = await response.json();
                } catch {
                    errorData = null;
                }

                logger.error("FetchError: ", {
                    status: response.status,
                    statusText: response.statusText,
                    url: response.url,
                    data: errorData,
                });

                throw new APIError(
                    `Request failed with status ${response.status}`,
                    response.status,
                    response.statusText,
                    errorData,
                );
            }

            // Return empty for 204 No Content
            if (response.status === 204) {
                return {} as T;
            }

            if (options.handleHeaders) {
                options.handleHeaders(response.headers);
            }

            if (options.asArrayBuffer) {
                return (await response.arrayBuffer()) as unknown as T;
            }

            if (options.asBlob) {
                return (await response.blob()) as unknown as T;
            }

            return (await response.json()) as T;
        } catch (error) {
            // Re-throw if it's already an APIError, otherwise wrap it
            if (error instanceof APIError) throw error;

            throw new Error(error instanceof Error ? error.message : "Unknown Network Error");
        }
    }

    async get<T>(url: string, options?: Options): Promise<T> {
        return this.request<T>(url, { ...options, method: "GET" });
    }

    async post<T, D = unknown>(url: string, data: D, options?: Options): Promise<T> {
        return this.request<T>(url, {
            ...options,
            method: "POST",
            body: JSON.stringify(data),
        });
    }

    async put<T, D = unknown>(url: string, data: D, options?: Options): Promise<T> {
        return this.request<T>(url, {
            ...options,
            method: "PUT",
            body: JSON.stringify(data),
        });
    }

    async delete<T>(url: string, options?: Options): Promise<T> {
        return this.request<T>(url, { ...options, method: "DELETE" });
    }
}

export const f = new Fetch();
export default Fetch;
