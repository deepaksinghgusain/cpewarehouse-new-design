"use client";

import { useEffect } from "react";
import { client } from "@/lib/apollo-client";
import { ApolloProvider } from "@apollo/client/react";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { userLoginRequest } from "@/store/actions/user-actions";

function StoreHydrator() {
    useEffect(() => {
        const storedUser = localStorage.getItem("userData");

        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                store.dispatch(userLoginRequest(parsedUser));
            } catch {
                localStorage.removeItem("userData");
            }
        }
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