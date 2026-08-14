import { apiFetch } from "./http";

export async function contactUs(data: any) {
    const url = process.env.NEXT_PUBLIC_API_BASE_URL + "/api/contact-uses";
    return await apiFetch(url, { method: "POST", body: {data} });
}