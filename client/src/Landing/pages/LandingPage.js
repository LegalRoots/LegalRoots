import React from "react";
import HeroSection from "../components/HeroSection";
import "./LandingPage.css";
import Features from "./Features";
import Footer from "./Footer";
import GetStarted from "./GetStarted";

const LandingPage = () => {
  return (
    <div className="landing-page">
      <HeroSection />
      <Features />
      <GetStarted />
      <Footer />
    </div>
  );
};

export default LandingPage;
