// UserAddressContext.js
import React, { createContext, useState, useContext } from "react";

const UserAddressContext = createContext();

export const UserAddressProvider = ({ children }) => {
  const [userAddress, setUserAddress] = useState("");

  return (
    <UserAddressContext.Provider value={{ userAddress, setUserAddress }}>
      {children}
    </UserAddressContext.Provider>
  );
};

export const useUserAddress = () => {
  return useContext(UserAddressContext);
};
