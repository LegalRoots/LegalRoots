import "./Signup.css";
import React from "react";
import { useFormik } from "formik";
import { SignUpSchema } from "../schema";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/Button/Button";

const Signup = () => {
  const onSubmit = async (values, actions) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    actions.resetForm();
  };
  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleBlur,
    isValid,
    handleChange,
    handleSubmit,
  } = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      age: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: SignUpSchema,
    validateOnChange: true,
    onSubmit,
  });

  return (
    <div className="signup-page">
      <form onSubmit={handleSubmit} autoComplete="off">
        <Input
          value={values.first_name}
          onChange={handleChange}
          id="first_name"
          type="first_name"
          labelText="first_name"
          placeholder="John"
          onBlur={handleBlur}
          className={
            errors.first_name && touched.first_name ? "input-error" : ""
          }
          errors={errors}
          touched={touched}
          error={errors.first_name && touched.first_name}
        />

        <Input
          value={values.email}
          onChange={handleChange}
          id="email"
          type="email"
          labelText="Email"
          placeholder="example@example.com"
          onBlur={handleBlur}
          className={errors.email && touched.email ? "input-error" : ""}
          errors={errors}
          touched={touched}
          error={errors.email && touched.email}
        />
        <Button value="Signup" />
      </form>
    </div>
  );
};

export default Signup;
