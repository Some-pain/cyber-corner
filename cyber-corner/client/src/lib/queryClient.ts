import { QueryClient } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = await res.text();
    let message = `${res.status}: ${res.statusText}`;
    try {
      const json = JSON.parse(text);
      message = json.error || json.message || message;
    } catch {
      if (text) message = text;
    }
    throw new Error(message);
  }
}

export async function apiRequest(method: string, url: string, body?: unknown): Promise<Response> {
  const options: RequestInit = {
    method,
    credentials: "include",
    headers: body instanceof FormData ? {} : { "Content-Type": "application/json" },
    body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
  };
  const res = await fetch(url, options);
  await throwIfResNotOk(res);
  return res;
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});
