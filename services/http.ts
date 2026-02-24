type FetchOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  headers?: HeadersInit;
  body?: any;
  cache?: RequestCache;
  revalidate?: number;
};

export async function apiFetch<T>(
  url: string,
  options: FetchOptions = {}
): Promise<T> {
  const {
    method = "GET",
    headers = {},
    body,
    cache = "no-store",
    revalidate,
  } = options;

  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    cache,
    next: revalidate ? { revalidate } : undefined,
  });

  if (!res.ok) {
    throw new Error(`Error: ${res.status}`);
  }

  return res.json();
}