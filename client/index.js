import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import store from "./Redux/store.ts";
import App from "./App.tsx";
import Main from "./container/Main";
import PricingPage from "./Pages/PricingPage.jsx";
import PricingForm from "./components/PricingForm.jsx";
import Performance from "./components/Performance.tsx";
import "../public/style.css";
import Register from "./components/Register.jsx";
import Login from "./components/Login.jsx";
import "react-tooltip/dist/react-tooltip.css";
import LandingPage from "./components/LandingPage.jsx";
import Slider from "./components/Slider";

const container = document.getElementById("app");
const root = createRoot(container);

root.render(
  <Provider store={store}>
    <Router>
      <Routes>
        <Route index element={<LandingPage />} />

        <Route path="/" element={<App />}>
          <Route path="/configuration" element={<Main />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/pricing" element={<PricingForm />} />
          <Route path="/performance" element={<Performance />} />
        </Route>
      </Routes>
    </Router>
  </Provider>
);
