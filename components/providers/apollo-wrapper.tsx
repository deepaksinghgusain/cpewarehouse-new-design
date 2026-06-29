"use client";

import { useEffect } from "react";
import { client } from "@/lib/apollo-client";
import { ApolloProvider } from "@apollo/client/react";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { userLoginRequest } from "@/store/actions/user-actions";
import { setCart } from "@/store/reducers/cart-reducer";
import { getCart } from "@/services/cart";

function StoreHydrator() {
    useEffect(() => {
        const storedUser = localStorage.getItem("userData");
        const storedCart = localStorage.getItem("cartData");
        const storedCartId = localStorage.getItem("cartId");

        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                store.dispatch(userLoginRequest(parsedUser));
            } catch {
                localStorage.removeItem("userData");
            }
        }

        if (storedCart) {
            try {
                const parsedCart = JSON.parse(storedCart);
                store.dispatch(setCart(parsedCart));
            } catch {
                localStorage.removeItem("cartData");
            }
        }

        async function hydrateStoredCart() {
            if (!storedCartId) return;
            try {
                const freshCart = await getCart(storedCartId);
                console.log("Fetched fresh cart from server:", freshCart);
                if (freshCart) {
                    store.dispatch(setCart(freshCart));
                }
            } catch {
                localStorage.removeItem("cartId");
            }
        }

        hydrateStoredCart();
    }, []);

    return null;
}

export default function ApolloWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <Provider store={store}>
            <StoreHydrator />
            <ApolloProvider client={client}>{children}</ApolloProvider>
        </Provider>
    );
}