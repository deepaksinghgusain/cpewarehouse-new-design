import { gql } from "@apollo/client";
import { apiFetch } from "./http";
import { client } from "@/lib/apollo-client";

export async function getCart(cartId: any) {
    const url = process.env.NEXT_PUBLIC_API_BASE_URL + `/api/carts/${cartId}?populate=deep`;
    return await apiFetch(url)
}

function normalizeCartPayload(cartData: any) {
  return cartData?.data ? cartData : { data: cartData };
}

export async function createCart(cartData: any) {
  const url = process.env.NEXT_PUBLIC_API_BASE_URL + `/api/carts`;
  return await apiFetch(url, { method: "POST", body: normalizeCartPayload(cartData) });
}

export async function getCheckoutUrl(data: any) {
  const url = process.env.NEXT_PUBLIC_API_BASE_URL + `/api/checkout`;
  return await apiFetch(url, { method: "POST", body: normalizeCartPayload(data) });
}

export async function updateOrderStatus(data: any) {
  const url = process.env.NEXT_PUBLIC_API_BASE_URL + `/api/orderUpdate`;
  return await apiFetch(url, { method: "POST", body: normalizeCartPayload(data) });
}

export async function addOrderApi(data: any) {
  const url = process.env.NEXT_PUBLIC_API_BASE_URL + `/api/orders`;
  return await apiFetch(url, { method: "POST", body: normalizeCartPayload(data) });
}

export async function applyCouponApi(couponCode: any) {
  const url = process.env.NEXT_PUBLIC_API_BASE_URL + `/api/validateCoupon/${couponCode.trim()}`;
  return await apiFetch(url);
}

export async function updateCartAPI(cartId: number | string, cartData: any) {
  const url = process.env.NEXT_PUBLIC_API_BASE_URL + `/api/carts/${cartId}`;
  return await apiFetch(url, { method: "PUT", body: normalizeCartPayload(cartData) });
}

export async function checkAlreadyCoursePurchased(id: number, email: string) {
    const { data }: { data: any } = await client.query({
        query: getAlreadyCoursePurchasedGQL(id, email),
        fetchPolicy: "network-only",
    });

    if (!data) return {};

    return data;
}




function getAlreadyCoursePurchasedGQL(id: number, email: string) {
    return gql`query{
      userCourses( sort: ["purchasedOn:desc"],
       pagination:{limit:-1},
       filters:
       {
         user:{email :{ eq: "${email}" }}
         course:{id :{ eq: ${id}}}
       }){
        data{
         id
           attributes{
             status
             completedOn
             joinUrl
             course{
               data{
                 id
                   attributes{
                     title
                     startDate
                     slug
                     webinarId
                     videoUrl
                     
                       category{
                         data{
                           attributes{
                             title
                           }
                         }
                       }
                   }
               }
             }
             user{
               data{
                 id
                 attributes{
                   username
                 }
               }
             }
            }
           }  
         }
       }`;
}