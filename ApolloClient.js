import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { ApolloLink, Observable } from "apollo-link";
import { split } from "apollo-link";
import * as SecureStore from "expo-secure-store";
import { onError } from "apollo-link-error";

const BASE_URL = "http://192.000.00.0:5001/api/graphql";

// Apollo Client will determine whether to send auth token

const httpLink = new HttpLink({
  uri: BASE_URL,
  credentials: "include",
});

const request = async (operation) => {
  const token = await SecureStore.getItemAsync("userToken");
  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : "",
    },
  });
};

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );

  if (networkError) console.log(`[Network error]: ${networkError}`);
});
// add observer to each request,
// forward operations with existing context
// applies middleware, credentials (express)
const requestLink = new ApolloLink(
  (operation, forward) =>
    new Observable((observer) => {
      let handle;
      Promise.resolve(operation)
        .then((oper) => request(oper))
        .then(() => {
          handle = forward(operation).subscribe({
            next: observer.next.bind(observer),
            error: observer.error.bind(observer),
            complete: observer.complete.bind(observer),
          });
        })
        .catch(observer.error.bind(observer));
      return () => {
        if (handle) handle.unsubscribe();
      };
    })
);

// ApolloLink allows multiple links
const client = new ApolloClient({
  link: ApolloLink.from([errorLink, requestLink, httpLink]),
  cache: new InMemoryCache(),
});

export default client;
