
import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from "@apollo/client";
import Cookies from "js-cookie";

const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_API_BASE_URL + "/graphql",
});

const authLink = new ApolloLink((operation, forward) => {
  const token = Cookies.get("token");

  console.log("Token:", token);

  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : "",
    },
  }));

  return forward(operation);
});

export const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
});