import React from "react";
import { createRoot } from "react-dom/client";
import HelloWorld from "../components/HelloWorld";

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("root");
  if (container) {
    const root = createRoot(container); // createRoot(container!) if you use TypeScript
    root.render(<HelloWorld />);
  }
});
