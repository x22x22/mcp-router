import "@mcp_router/tailwind-config/base.css";
import "@/renderer/utils/i18n";
import "./platform-api-web"; // Initialize web platform API
import React from "react";
import ReactDOM from "react-dom/client";
import App from "@/renderer/components/App";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <div className="h-screen flex flex-col">
        <div className="flex-1 overflow-hidden">
          <App />
        </div>
      </div>
    </BrowserRouter>
  </React.StrictMode>,
);
