"use client";

import { clearCartRequest } from "@/store/actions/cart-actions";
import { ApolloClient, InMemoryCache, HttpLink, ApolloLink, gql } from "@apollo/client";
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { useDispatch } from "react-redux";

const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_API_BASE_URL + "/graphql",
});

const authLink = new ApolloLink((operation, forward) => {

    const token = localStorage.getItem("token")

    operation.setContext(({ headers = {} }) => ({
        headers: {
            ...headers,
            Authorization: token ? `Bearer ${token}` : "",
        },
    }));

    return forward(operation);
});

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
});

async function getOrderBySessinId(sessionId: string) {
    const { data }: { data: any } = await client.query({
        query: getOrdersBySeesionIdGql(sessionId),
        fetchPolicy: "network-only",
    });

    if (!data) return {};

    return data;
}

function getOrdersBySeesionIdGql(sessionId: string) {
    return gql`query{
      orders(filters:{stripeSessionId:{eq:"${sessionId}"}}){
       data{
         id,
         attributes{
           OrderItems{
            title
            courseId
            packageId
            price
            finalPrice
            Enrolls{
              email
            }
          }
          totalPrice 
          finalPrice
           orderStatus
           stripeSessionId,
           userId
           email
          
         }
       }
     }
       }`
}


const SuccessMessage = ({ session_id }: { session_id: any }) => {

    const [orderId, setOrderId] = useState("")
    const dispatch = useDispatch();

    const getOrderDetail = async () => {
        const res = await getOrderBySessinId(session_id as string);
        let orderId = res.orders.data[0].id
        let title = `CPE Warehouse-success#${orderId}`;

        setOrderId(orderId)

        let itemsArray: any = [];

        if (res.orders.data.length > 0) {
            if (res.orders.data[0].attributes.orderStatus == 'succeeded' || res.orders.data[0].attributes.orderStatus == 'pending') {
                res.orders.data[0].attributes.OrderItems.map((od: any) => {
                    itemsArray.push({
                        "id": od.courseId > 0 ? od.courseId : od.packageId,
                        "name": od.title,
                        "quantity": od.Enrolls.length,
                        "price": od.price,
                        "category": 'TaxCourse',
                        "brand": "CPE",
                    })
                })
            }
        }

        dispatch(clearCartRequest())
        localStorage.removeItem("cartId")
    }

    useEffect(() => {
        getOrderDetail()
    }, [session_id])

    return (
        <div className="flex items-center justify-center bg-gray-50 px-4">
            <div className=" w-[80%] my-4 bg-white rounded-2xl shadow-lg p-8 text-center">
                {/* Success Icon */}
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                    <svg
                        className="h-10 w-10 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={3}
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                </div>

                {/* Heading */}
                <h1 className="mt-6 text-3xl font-bold text-gray-900">
                    Order Placed Successfully!
                </h1>

                {/* Description */}
                <p className="mt-4 text-gray-600">
                    Thank you for your purchase. We've received your order and it's now
                    being processed.
                </p>

                {/* Order Info */}
                <div className="mt-8 rounded-lg bg-gray-100 p-4 flex justify-between items-center">
                    <p className="text-sm text-gray-500">Order Number</p>
                    <p className="text-lg font-semibold">{orderId}</p>
                </div>

                {/* Buttons */}
                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                    <Link
                        href="/learner/dashboard"
                        className="flex-1 rounded-lg border border-gray-300 px-5 py-3 font-medium text-gray-700 transition hover:bg-gray-100"
                    >
                        Goto to Dashboard
                    </Link>
                </div>

                {/* Footer */}
                <p className="mt-6 text-sm text-gray-500">
                    A confirmation email has been sent to your registered email address.
                </p>
            </div>
        </div>
    )
}

export default SuccessMessage