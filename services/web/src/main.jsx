import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { LanguageProvider } from "./context/LanguageContext";
import "./styles.css";
import "./styles/theme.css";
import "./motion.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LanguageProvider>
    <App />
  </LanguageProvider>
  </React.StrictMode>
);
