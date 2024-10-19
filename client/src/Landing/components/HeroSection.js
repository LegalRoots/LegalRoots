import React from "react";
import "./HeroSection.css";

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <img className="hero-logo" src="../images/logo.png" alt="" />
        <h1>Welcome to JusticeRoots</h1>
        <p>Your source for justice, transparency, and fair legal processes.</p>
        <a href="#services" className="cta-button">
          Explore Services &gt;
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
