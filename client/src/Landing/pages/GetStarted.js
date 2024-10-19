import React from "react";
import "./GetStarted.css";
import Button from "../../../src/shared/components/Button/Button";
import { Link } from "react-router-dom";
const GetStarted = () => {
  return (
    <section className="getstarted-section">
      <h2>Get Started</h2>
      <p>You will have to follow these steps to register your account</p>
      <div className="steps">
        <div className="step">
          <span className="number material-symbols-outlined">counter_1</span>
          <h3>Personal Information</h3>
          <p>
            Choose whether you are a lawyer or a regular user, and provide your
            basic personal details.
          </p>
        </div>
        <div className="step">
          <span className="number material-symbols-outlined">counter_2</span>
          <h3>Contact Information</h3>
          <p>
            Enter your contact details, including your phone number, location,
            country, and street address.
          </p>
        </div>
        <div className="step">
          <span className="number material-symbols-outlined">counter_3</span>
          <h3>Account Information</h3>
          <p>
            Set up your account by providing your email address and creating a
            secure password.
          </p>
        </div>
      </div>
      <Button clasName="register-btn" value="Regsiter Now >" />
      <p className="alreadyRegistered">
        Already have an account?{" "}
        <Link to="/login" className="login">
          Login
        </Link>
      </p>
    </section>
  );
};

export default GetStarted;
