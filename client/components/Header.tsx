import React, { ReactElement } from "react";
import { FC } from "react";

interface HeaderProps {
  mode: "light" | "dark";
  toggleColorMode: () => void;
}

const Header: FC<HeaderProps> = ({ mode, toggleColorMode }): ReactElement => {
  return (
    <header className="bg-black text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-xl font-bold">RADISH</span>
        </div>
        <div className="flex space-x-4">
          <button className="text-gray-300 hover:text-white">Log In</button>
          <button className="text-gray-300 hover:text-white">Log Out</button>
          <button className="text-gray-300 hover:text-white">Register</button>
          <button onClick={toggleColorMode} className="text-gray-300 hover:text-white">
            Toggle to {mode === "light" ? "dark" : "light"} mode
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
