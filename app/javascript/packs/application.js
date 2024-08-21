import React from "react";
import { createRoot } from "react-dom/client";
import { ApolloProvider } from "@apollo/client";
import client from "./apolloClient";
import Registration from "../components/Registration";
import Login from "../components/Login";

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("root");
  if (container) {
    const root = createRoot(container);
    root.render(
      <ApolloProvider client={client}>
        <div>
          <h1>Base</h1>
          <Registration />
          <Login />
        </div>
      </ApolloProvider>
    );
  }
});
