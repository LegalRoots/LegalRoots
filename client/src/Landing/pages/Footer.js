import React from "react";
import "./Footer.css";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/Button/Button";
const Footer = () => {
  return (
    <footer className="footer-section">
      <h2>Contact Us</h2>
      <div className="contact-container">
        <div className="contact-form">
          <form action="">
            <Input labelText="Name" />
            <Input labelText="Email" />
            <Button value="Send" />
          </form>
        </div>
        <div className="right-col">
          <div className="another-contact">
            <span className="contact-icon material-symbols-outlined">call</span>
            <p>+972 0599342112</p>
          </div>
          <div className="another-contact">
            <span className="contact-icon material-symbols-outlined">mail</span>
            <p>s12027880@stu.najah.edu</p>
          </div>
          <div className="another-contact">
            <span className="contact-icon material-symbols-outlined">
              location_on
            </span>
            <p>Nablus - Palestine</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
