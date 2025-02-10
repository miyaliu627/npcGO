import { createContext, useContext, useState } from "react";

export const ConfigurationContext = createContext();

export function ConfigurationContextProvider({ children }) {
  const [configuration, setConfiguration] = useState({ worldConfiguration: "", characterConfiguration: [] });
  return (
    <ConfigurationContext.Provider value={{ configuration, setConfiguration }}>
      {children}
    </ConfigurationContext.Provider>
  );
}
