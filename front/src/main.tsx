import React from "react";
import ReactDOM from "react-dom/client";

import { App } from "./App.tsx";
import "./index.css";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { DATAProvider } from "./DATAContexts.tsx";

const createUrl = () => {
  let URI;
  console.log(window.location.href)
  if (window.location.href.includes("dev.fastnote")) {
    URI = "https://api.dev.fastnote.website/";
  } else if (window.location.href.includes("localhost")) {
    URI = "http://localhost:5000";
  } else if (!window.location.href.includes("dev.fastnote")
    && !window.location.href.includes("localhost")) {
    URI = "https://api.prod.fastnote.website/";
  }
  console.log(URI)
  return URI;
};

const httpLink = createHttpLink({
  uri: createUrl(),
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem("token");
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <DATAProvider>
        <App />
      </DATAProvider>
    </ApolloProvider>
  </React.StrictMode>
);
