import React, { ReactElement } from "react";
import { FC } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ToggleColorMode from "../src/ToggleColorMode";

//add code for landing page toggle
interface HeaderProps {
  mode: "light" | "dark";
  toggleColorMode: () => void;
}

const Header: FC<HeaderProps> = ({ mode, toggleColorMode }): ReactElement => {
  // const Header : FC = (): ReactElement => {
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
          <ToggleColorMode mode={mode} toggleColorMode={toggleColorMode} />
        </div>
      </div>
    </header>
  );
};
export default Header;
