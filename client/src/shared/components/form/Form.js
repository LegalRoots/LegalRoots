import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/palgov-gold.png";

import "./Form.css";

const Form = ({ children, successMsg, title }) => {
  const formRef = useRef();
  const sideRef = useRef();
  const normalRef = useRef();
  const successRef = useRef();
  const pageRef = useRef();

  const navigate = useNavigate();

  const exitAnimation = () => {
    formRef.current.style = "flex:0;width: 0px;padding: 0";
    sideRef.current.style = "flex: 1;border-radius:20px";

    normalRef.current.style = "display: none";
    successRef.current.style = "display: block; opacity:0";
    pageRef.current.style = "animation: fadeOut 1.5s ease-out 1s forwards";

    setTimeout(() => {
      navigate("/admin/cases");
    }, 1800);
  };

  return (
    <div ref={pageRef} className="admin-custom-form">
      <form ref={formRef}>{children}</form>
      <div ref={sideRef} className="admin-custom-form-side">
        <div className="admin-custom-form-side__header">
          <div>
            <p>State of Palestine</p>
            <p>Ministry of Justice</p>
          </div>
          <img src={logo} alt="palgov" />
          <div>
            <p>دولة فلسطين</p>
            <p>وزارة العدل</p>
          </div>
        </div>
        <h1 ref={normalRef}>{title}</h1>
        <div
          ref={successRef}
          className="admin-custom-form-side__success fade-in"
        >
          <h3>{successMsg}</h3>
          <i className="fa-solid fa-circle-check"></i>
        </div>
      </div>
    </div>
  );
};

export default Form;
