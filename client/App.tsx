import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
// import "../public/style.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [mode, setMode] = useState<"light" | "dark">("light");
  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === "dark" ? "light" : "dark"));
  };
  return (
    <div className="w-full">
      <ToastContainer/>
      <Header mode={mode} toggleColorMode={toggleColorMode} />
      <div className="flex w-full">
        <Sidebar />
        <div className="flex-1 mx-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default App;
