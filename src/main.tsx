import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./poc-web-app/browser/App.js";
createRoot(document.getElementById("root")!).render(<StrictMode><App /></StrictMode>);
