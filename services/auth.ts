import { apiFetch } from "./http";

export async function login(data: { email: string, password: string, remember_me: boolean }) {

    const url = process.env.NEXT_PUBLIC_API_BASE_URL + "/api/auth/local";

    try {
        return await apiFetch(url, {
            method: "POST",
            body: data,
            headers: {
                "Content-Type": "application/json",
            }
        })
    } catch (error) {
        return false
    }
}

export async function registerUser(data: any) {

    const url = process.env.NEXT_PUBLIC_API_BASE_URL + "/api/auth/local/register";

    try {
        return await apiFetch(url, {
            method: "POST",
            body: data,
            headers: {
                "Content-Type": "application/json",
            }
        })
    } catch (error) {
        return false
    }
}
