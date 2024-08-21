import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ApolloProvider } from "@apollo/client";
import client from "./apolloClient";
import Login from "../components/Login";
import Registration from "../components/Registration";
import "bootstrap/dist/css/bootstrap.min.css";

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("root");
  if (container) {
    const root = createRoot(container);
    root.render(
      <ApolloProvider client={client}>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Registration />} />
          </Routes>
        </Router>
      </ApolloProvider>
    );
  }
});
