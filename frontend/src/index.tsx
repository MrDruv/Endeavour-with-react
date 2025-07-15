import React from "react";
import ReactDOM from "react-dom/client";
import AppRoutes from "./Router.tsx";

// Import React Query essentials
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

//  Create a query client instance
const queryClient = new QueryClient();

const container = document.getElementById("root");
if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(
    <React.StrictMode>
      {/*Wrap your app in QueryClientProvider */}
      <QueryClientProvider client={queryClient}>
        <AppRoutes />
      </QueryClientProvider>
    </React.StrictMode>
  );
} else {
  console.error("No root element found in HTML!");
}
