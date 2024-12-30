import "./Login.css";
import { useFormik } from "formik";
import Input from "../../shared/components/FormElements/Input";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../shared/components/Button/Button";
import { Link } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import { AuthContext } from "../../shared/context/auth";
import Select from "../../shared/components/FormElements/Select";
const Login = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [errorMessage, setErrorMessage] = useState("");
  const { login } = useContext(AuthContext);

  const onSubmit = async (values, actions) => {
    try {
      const { email, password, checkbox, type, ssid } = values;

      const response = await fetch(
        "http://localhost:5000/JusticeRoots/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password, type, ssid }),
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          setErrorMessage("Invalid email or password. Please try again.");
        } else {
          setErrorMessage("An error occurred. Please try again later.");
        }
        return;
      }

      toast({
        title: "Logged in.",
        description: "Logged in Successfully",
        status: "success",
        duration: 6000,
        isClosable: true,
      });

      const user = await response.json();
      if (
        user.data.userType === "Lawyer" &&
        user.data.user.isVerified === false
      ) {
        navigate(`/not-verified`);
        return;
      }

      login(user, checkbox, type);
      setErrorMessage("");
      console.log(type);
      if (type === "Judge") {
        navigate("/Admin/");
        console.log("fff");
      } else {
        navigate(`/${type}/`);
      }

      actions.resetForm();
    } catch (error) {
      console.error("Error during signup:", error);
      setErrorMessage("An unexpected error occurred. Please try again.");
    }
  };

  const {
    values,
    handleChange,
    isSubmitting,
    handleSubmit,
    handleBlur,
    touched,
    errors,
  } = useFormik({
    initialValues: {
      email: "",
      password: "",
      checkbox: false,
      type: "User",
      ssid: "",
    },
    onSubmit,
  });

  const isSSIDRequired = ["Lawyer", "Judge", "Admin"].includes(values.type);

  return (
    <div className="login-container">
      <div>
        <img className="bg-img" src="/images/judge.jpg" alt="" />
      </div>
      <div className="login-info">
        <h1>Login to your account</h1>
        {errorMessage && <p className="error-text">{errorMessage}</p>}
        <form onSubmit={handleSubmit}>
          {isSSIDRequired ? (
            <Input
              value={values.ssid}
              onChange={handleChange}
              id="ssid"
              type="text"
              labelText="Id"
            />
          ) : (
            <Input
              value={values.email}
              onChange={handleChange}
              id="email"
              type="email"
              labelText="Email"
            />
          )}
          <Input
            value={values.password}
            onChange={handleChange}
            id="password"
            type="password"
            labelText="Password"
          />
          <Select
            id="type"
            name="type"
            label="Login As"
            options={[
              { value: "User", label: "User" },
              { value: "Lawyer", label: "Lawyer" },
              { value: "Judge", label: "Judge" },
              { value: "Admin", label: "Admin" },
            ]}
            value={values.type}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.type}
            touched={touched.type}
          />
          <div className="checkbox-label">
            <label htmlFor="checkbox">
              <Input
                labelClassName="remember"
                onChange={handleChange}
                id="checkbox"
                type="checkbox"
                value={values.checkbox}
              />
              <span>Remember Me</span>
            </label>
          </div>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="login-btn"
            value={isSubmitting ? "Logging in.." : "Login"}
          />
          <Link to="/forgotPassword" className="forgot">
            Forgot Password?
          </Link>
          <p className="new-here">
            New Here? <Link className="register-link">Create an Account</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
