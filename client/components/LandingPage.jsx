import React from "react";
import Button from "@mui/material/Button";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import LogoCollection from "../src/LogoCollection";
import Divider from "../src/Divider";
import Footer from "../src/Footer";
import Features from "../src/Features";
import Highlights from "../src/Highlights";
import Hero from "../src/Hero";
import Header from "./Header.tsx";

const LandingPage = () => {
  return (
    <div>
      <Header />
      {/* <Hero/> */}
      <LogoCollection />
      <Features />
      <Highlights />
      <Button variant="contained">Hello world</Button>
    </div>
  );
};

export default LandingPage;
