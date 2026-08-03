import { ApiResponse } from "./common";

type FetchOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  headers?: HeadersInit;
  body?: any;
  cache?: RequestCache;
  revalidate?: number;
};

export async function apiFetch(
  url: string,
  options: FetchOptions = {}
): Promise<any> {
  const {
    method = "GET",
    headers = {},
    body,
    cache = "no-store",
    revalidate,
  } = options;

  
  // Get token from localStorage if available (client-side)
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token && { "Authorization": `Bearer ${token}` }),
      ...headers
    },
    body: body ? JSON.stringify(body) : undefined,
    cache,
    next: revalidate ? { revalidate } : undefined,
  });


  if (!res.ok) {
    console.log(`Error: ${res.status}`);
  }

  let result: ApiResponse = await res.json();

  return result
}