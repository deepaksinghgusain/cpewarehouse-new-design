import { apiFetch } from "./http";

export interface ApiResponse {
    data: any;
}

export async function getHeader() {
    const url = process.env.NEXT_PUBLIC_API_BASE_URL + "/api/global?populate=deep";
    return await apiFetch(url)
}

export async function getCommonData() {
    const url = process.env.NEXT_PUBLIC_API_BASE_URL + "/api/global?populate=deep";
    return await apiFetch(url)
}

export async function getHomePageSection() {
    const url = process.env.NEXT_PUBLIC_API_BASE_URL + "/api/homepage?populate=deep";
    return await apiFetch(url)
}

export async function getAboutus() {
    const url = process.env.NEXT_PUBLIC_API_BASE_URL + "/api/pages?populate=deep&filters[slug][$eq]=about-us";
    return await apiFetch(url)
}

export async function getPageContent(slug: string) {
    const url = process.env.NEXT_PUBLIC_API_BASE_URL + `/api/pages?populate=deep&filters[slug][$eq]=${slug}`;
    return await apiFetch(url)
}
