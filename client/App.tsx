import React from "react";
import { Outlet } from 'react-router-dom';
import Header from "./components/Header"; // Removed .jsx extension
import Sidebar from "./components/Sidebar"; // Changed to .tsx extension for TypeScript file
import "../public/style.css";

function App() {
  return(
    <div>
      <Header />
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
