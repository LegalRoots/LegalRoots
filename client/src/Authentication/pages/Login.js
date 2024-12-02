import "./Login.css";
import { useFormik } from "formik";
import Input from "../../shared/components/FormElements/Input";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../shared/components/Button/Button";
import { Link } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import { AuthContext } from "../../shared/context/auth";
const Login = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [errorMessage, setErrorMessage] = useState("");
  const { login } = useContext(AuthContext);
  const onSubmit = async (values, actions) => {
    try {
      const { email, password, checkbox } = values;

      const response = await fetch(
        "http://localhost:3000/JusticeRoots/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
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

      login(user, checkbox);
      setErrorMessage("");
      navigate("/dashboard");
      actions.resetForm();
    } catch (error) {
      console.error("Error during signup:", error);
      setErrorMessage("An unexpected error occurred. Please try again.");
    }
  };

  const { values, handleChange, isSubmitting, handleSubmit } = useFormik({
    initialValues: {
      email: "",
      password: "",
      checkbox: false,
    },
    onSubmit,
  });

  return (
    <div>
      <div className="login-container">
        <div>
          <img className="bg-img" src="/images/judge.jpg" alt="" />
        </div>
        <div className="login-info">
          <h1>Login to your account</h1>
          {errorMessage && <p className="error-text">{errorMessage}</p>}
          <form onSubmit={handleSubmit}>
            <Input
              value={values.email}
              onChange={handleChange}
              id="email"
              type="email"
              labelText="Email"
            />
            <Input
              value={values.password}
              onChange={handleChange}
              id="password"
              type="password"
              labelText="Password"
            />
            <div className="checkbox-label">
              <label htmlFor="checkbox">
                <Input
                  labelClassName="remember"
                  onChange={handleChange}
                  id="checkbox"
                  type="checkbox"
                  value={values.toggle}
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
    </div>
  );
};

export default Login;
