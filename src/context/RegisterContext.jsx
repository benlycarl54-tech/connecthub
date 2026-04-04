import { createContext, useContext, useState } from "react";

const RegisterContext = createContext(null);

export function RegisterProvider({ children }) {
  const [data, setData] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("fbRegister") || "{}");
    } catch {
      return {};
    }
  });

  const update = (newData) => {
    setData(prev => {
      const merged = { ...prev, ...newData };
      localStorage.setItem("fbRegister", JSON.stringify(merged));
      return merged;
    });
  };

  return (
    <RegisterContext.Provider value={{ data, update }}>
      {children}
    </RegisterContext.Provider>
  );
}

export function useRegister() {
  return useContext(RegisterContext);
}