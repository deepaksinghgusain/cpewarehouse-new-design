import { apiFetch } from "./http";

export async function getCommonData() {
    const url = process.env.NEXT_PUBLIC_API_BASE_URL + "/api/global?populate=deep";

    return await apiFetch(url)
}