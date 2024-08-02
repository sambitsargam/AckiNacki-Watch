// Header.js
import React, { useContext, useState } from "react";
import { SidebarContext } from "../context/SidebarContext";
import { WindmillContext } from "@windmill/react-ui";
import { useUserAddress } from "../context/UserAddressContext";
import { MoonIcon, SunIcon, MenuIcon } from "../icons";

function Header() {
  const { mode, toggleMode } = useContext(WindmillContext);
  const { toggleSidebar } = useContext(SidebarContext);
  const { userAddress, setUserAddress } = useUserAddress();

  const handleAddressChange = (event) => {
    setUserAddress(event.target.value);
  };

  return (
    <header className="z-30 w-full py-4 bg-white shadow-bottom dark:bg-gray-800">
      <div className="container flex items-center justify-between h-full px-6 mx-auto text-blue-600 dark:text-blue-300">
        {/* Mobile hamburger */}
        <button
          className="p-1 mr-5 -ml-1 rounded-md lg:hidden focus:outline-none focus:shadow-outline-blue"
          onClick={toggleSidebar}
          aria-label="Menu"
        >
          <MenuIcon className="w-6 h-6" aria-hidden="true" />
        </button>

        <div className="flex justify-center flex-1 lg:mr-39">
          <input
            type="text"
            className="pl-12 text-gray-700"
            placeholder="Enter your address"
            value={userAddress}
            onChange={handleAddressChange}
          />
        </div>

        <ul className="flex items-center flex-shrink-0 space-x-6">
          {/* Theme toggler */}
          <li className="flex">
            <button
              className="rounded-md focus:outline-none focus:shadow-outline-blue"
              onClick={toggleMode}
              aria-label="Toggle color mode"
            >
              {mode === "dark" ? (
                <SunIcon className="w-5 h-5" aria-hidden="true" />
              ) : (
                <MoonIcon className="w-5 h-5" aria-hidden="true" />
              )}
            </button>
          </li>
        </ul>
      </div>
    </header>
  );
}

export default Header;
