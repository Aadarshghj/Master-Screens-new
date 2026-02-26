import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./global.css";
import { GlobalProvider } from "./providers/index.ts";
import App from "./app.tsx";
import { LoadingProvider } from "./contexts/loading/LoadingProvider.tsx";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GlobalProvider>
      <LoadingProvider>
        <App />
      </LoadingProvider>
    </GlobalProvider>
  </StrictMode>
);
