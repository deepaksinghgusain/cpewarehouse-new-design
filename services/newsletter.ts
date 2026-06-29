import { apiFetch } from "./http";


export async function addNewLetter(data: any) {
    const url = process.env.NEXT_PUBLIC_API_BASE_URL + "/api/subscriptions";
    return await apiFetch(url, {
        method: "POST",
        body: data
    })
}