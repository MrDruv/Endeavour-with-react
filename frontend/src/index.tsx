import React from "react";
import ReactDOM from "react-dom/client";
import AppRoutes from "./Router.tsx";

const container = document.getElementById("root");
if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(
    <React.StrictMode>
      <AppRoutes />
    </React.StrictMode>
  );
} else {
  console.error("No root element found in HTML!");
}
