import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import "../public/style.css";

function App() {
  const [mode, setMode] = useState<"light" | "dark">("light");
  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === "dark" ? "light" : "dark"));
  };
  return (
    <div>
      <Header mode={mode} toggleColorMode={toggleColorMode} />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default App;
