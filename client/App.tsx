import React from "react";
import { Outlet } from 'react-router-dom';
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import "../public/style.css";

function App() {
  return (
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
