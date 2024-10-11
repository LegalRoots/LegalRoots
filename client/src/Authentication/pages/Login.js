import "./Login.css";
import { useFormik } from "formik";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/Button/Button";
import { login } from "../services/authService";

const Login = () => {
  const onSubmit = async (values, actions) => {
    login(values);
    actions.resetForm();
    actions.setSubmitting(false);
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
    <div className="login flex h-screen items-center justify-center">
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
              onChange={handleChange}
              id="checkbox"
              type="checkbox"
              value={values.toggle}
            />
            Remember Me
          </label>
        </div>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="login-btn"
          value={isSubmitting ? "Logging in.." : "Login"}
        />
      </form>
    </div>
  );
};

export default Login;
