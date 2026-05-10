// services/web/src/context/LanguageContext.js
import React, { createContext, useContext, useState } from "react";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("en"); // default language

  // return without JSX so file can remain .js
  return React.createElement(
    LanguageContext.Provider,
    { value: { lang, setLang } },
    children
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
