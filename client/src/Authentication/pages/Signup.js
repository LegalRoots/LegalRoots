import "./Signup.css";
import React, { useState, useContext } from "react";
import { useFormik } from "formik";
import { SignUpSchema } from "../schema";
import { useNavigate } from "react-router-dom";
import Input from "../../shared/components/FormElements/Input";
import Select from "../../shared/components/FormElements/Select";
import Button from "../../shared/components/Button/Button";
import { useToast } from "@chakra-ui/react";
import { AuthContext } from "../../shared/context/auth";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
const PersonalInfo = ({
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  setFieldValue,
}) => {
  const handleUserTypeChange = (event) => {
    const { value } = event.target;

    if (value !== "Lawyer") {
      setFieldValue("cv", "");
      setFieldValue("specialization", "");
      setFieldValue("practicing_certificate", "");
      setFieldValue("consultation_price", "");
    }

    handleChange(event);
  };
  return (
    <div className="personal-data">
      <div className={values.userType === "Lawyer" ? "col" : "col-span"}>
        <Input
          value={values.SSID}
          onChange={handleChange}
          id="SSID"
          type="text"
          labelText="Id"
          onBlur={handleBlur}
          className={errors.SSID && touched.SSID ? "input-error" : ""}
          errors={errors}
          touched={touched}
          error={errors.SSID && touched.SSID}
        />
        <Input
          value={values.first_name}
          onChange={handleChange}
          id="first_name"
          type="text"
          labelText="First Name"
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
          value={values.last_name}
          onChange={handleChange}
          id="last_name"
          type="text"
          labelText="Last Name"
          placeholder="Doe"
          onBlur={handleBlur}
          className={errors.last_name && touched.last_name ? "input-error" : ""}
          errors={errors}
          touched={touched}
          error={errors.last_name && touched.last_name}
        />
        <Input
          value={values.birthday}
          onChange={handleChange}
          id="birthday"
          type="date"
          labelText="Birthday"
          onBlur={handleBlur}
          className={errors.birthday && touched.birthday ? "input-error" : ""}
          errors={errors}
          touched={touched}
          error={errors.birthday && touched.birthday}
        />
        <Select
          id="gender"
          name="gender"
          label="Gender"
          options={[
            { value: "male", label: "Male" },
            { value: "female", label: "Female" },
          ]}
          value={values.gender}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.gender}
          touched={touched.gender}
        />{" "}
        <Select
          id="userType"
          name="userType"
          label="User Type"
          options={[
            { value: "Lawyer", label: "Lawyer" },
            { value: "User", label: "Normal User" },
          ]}
          value={values.userType}
          onChange={(event) => {
            handleUserTypeChange(event);
          }}
          onBlur={handleBlur}
          error={errors.userType}
          touched={touched.userType}
        />
      </div>

      {values.userType === "Lawyer" && (
        <div className="col">
          <Input
            onChange={(event) => {
              const file = event.currentTarget.files[0];
              setFieldValue("cv", file);
            }}
            id="cv"
            type="file"
            labelText="CV (PDF)"
            accept="application/pdf"
            onBlur={handleBlur}
            errors={errors}
            touched={touched}
            error={errors.cv && touched.cv}
          />
          <Input
            value={values.specialization}
            onChange={handleChange}
            id="specialization"
            type="text"
            labelText="Specialization"
            placeholder="Enter your specialization"
            onBlur={handleBlur}
            errors={errors}
            touched={touched}
            error={errors.specialization && touched.specialization}
          />
          <Input
            onChange={(event) => {
              const file = event.currentTarget.files[0];
              setFieldValue("practicing_certificate", file);
            }}
            id="practicing_certificate"
            type="file"
            labelText="Practicing Certificate (PDF)"
            accept="application/pdf"
            onBlur={handleBlur}
            errors={errors}
            touched={touched}
            error={
              errors.practicing_certificate && touched.practicing_certificate
            }
          />
          <Input
            value={values.consultation_price}
            onChange={handleChange}
            id="consultation_price"
            type="number"
            labelText="Consultation Price"
            placeholder="Enter your consultation price"
            onBlur={handleBlur}
            errors={errors}
            touched={touched}
            error={errors.consultation_price && touched.consultation_price}
          />
        </div>
      )}
    </div>
  );
};

const AddressInfo = ({ values, errors, touched, handleChange, handleBlur }) => (
  <div>
    <Input
      value={values.phone}
      onChange={handleChange}
      id="phone"
      type="tel"
      labelText="Phone Number"
      placeholder="05xxxxxxxx"
      onBlur={handleBlur}
      className={errors.phone && touched.phone ? "input-error" : ""}
      errors={errors}
      touched={touched}
      error={errors.phone && touched.phone}
    />
    <Input
      value={values.city}
      onChange={handleChange}
      id="city"
      type="text"
      labelText="City"
      placeholder="City Name"
      onBlur={handleBlur}
      className={errors.city && touched.city ? "input-error" : ""}
      errors={errors}
      touched={touched}
      error={errors.city && touched.city}
    />
    <Input
      value={values.street}
      onChange={handleChange}
      id="street"
      type="text"
      labelText="Street"
      placeholder="Street Name"
      onBlur={handleBlur}
      className={errors.street && touched.street ? "input-error" : ""}
      errors={errors}
      touched={touched}
      error={errors.street && touched.street}
    />
  </div>
);

const AccountInfo = ({ values, errors, touched, handleChange, handleBlur }) => (
  <div>
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

    <Input
      value={values.password}
      onChange={handleChange}
      id="password"
      type="password"
      labelText="Password"
      onBlur={handleBlur}
      className={errors.password && touched.password ? "input-error" : ""}
      errors={errors}
      touched={touched}
      error={errors.password && touched.password}
    />
    <Input
      value={values.passwordConfirm}
      onChange={handleChange}
      id="passwordConfirm"
      type="password"
      labelText="Confirm Password"
      onBlur={handleBlur}
      className={
        errors.passwordConfirm && touched.passwordConfirm ? "input-error" : ""
      }
      errors={errors}
      touched={touched}
      error={errors.passwordConfirm && touched.passwordConfirm}
    />
  </div>
);

const Signup = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const steps = ["Personal Info", "Contact Info", "Account Info"];
  const onSubmit = async (values, actions) => {
    try {
      const formData = new FormData();
      formData.append("SSID", values.SSID);
      formData.append("first_name", values.first_name);
      formData.append("last_name", values.last_name);
      formData.append("email", values.email);
      formData.append("birthday", values.birthday);
      formData.append("password", values.password);
      formData.append("passwordConfirm", values.passwordConfirm);
      formData.append("phone", values.phone);
      formData.append("gender", values.gender);
      formData.append("city", values.city);
      formData.append("street", values.street);
      formData.append("userType", values.userType);
      console.log("formData", formData);
      if (values.cv) {
        formData.append("cv", values.cv);
      }
      if (values.practicing_certificate) {
        formData.append(
          "practicing_certificate",
          values.practicing_certificate
        );
      }
      if (values.specialization) {
        formData.append("specialization", values.specialization);
      }
      if (values.consultation_price) {
        formData.append("consultation_price", values.consultation_price);
      }

      const response = await fetch(
        "http://localhost:5000/JusticeRoots/users/signup",
        {
          method: "POST",
          body: formData, // Use FormData object
        }
      );

      if (!response.ok) {
        throw new Error("Signup failed");
      }
      navigate("/login");
      toast({
        title: "Account created.",
        description: "You have been registered successfully",
        status: "success",
        duration: 6000,
        isClosable: true,
      });
      actions.resetForm();
    } catch (error) {
      console.error("Error during signup:", error);
      alert("An error occurred. Please try again.");
    }
  };
  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
  } = useFormik({
    initialValues: {
      SSID: "",
      first_name: "",
      last_name: "",
      email: "",
      birthday: "",
      password: "",
      passwordConfirm: "",
      phone: "",
      gender: "",
      city: "",
      street: "",
      userType: "",
      cv: "",
      specialization: "",
      practicing_certificate: "",
      consultation_price: "",
    },
    validationSchema: SignUpSchema,
    validateOnChange: true,
    onSubmit,
  });

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      if (activeStep === 1) {
        setFieldValue("first_name", values.first_name);
        setFieldValue("last_name", values.last_name);
        setFieldValue("email", values.email);
        setFieldValue("password", values.password);
        setFieldValue("passwordConfirm", values.passwordConfirm);
      } else if (activeStep === 2) {
        setFieldValue("phone", values.phone);
        setFieldValue("city", values.city);
        setFieldValue("street", values.street);
      }
      setActiveStep(activeStep - 1);
    }
  };
  const isNextDisabled = () => {
    if (activeStep === 0) {
      return !(
        !errors.first_name &&
        !errors.last_name &&
        !errors.SSID &&
        !errors.birthday &&
        !errors.gender &&
        !errors.userType &&
        !errors.cv &&
        !errors.specialization &&
        !errors.practicing_certificate &&
        !errors.consultation_price &&
        touched.first_name &&
        touched.last_name &&
        touched.SSID &&
        touched.birthday
      );
    }
    if (activeStep === 1) {
      return !(
        !errors.phone &&
        !errors.city &&
        !errors.street &&
        touched.phone &&
        touched.city
      );
    }
    return false;
  };

  const canSubmit = () => {
    return !(
      !errors.email &&
      !errors.password &&
      !errors.passwordConfirm &&
      touched.email &&
      touched.password
    );
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <div className="signup-page">
      <Box sx={{ width: "100%", padding: 4 }}>
        <Stepper activeStep={activeStep}>
          {steps.map((step, index) => {
            const stepProps = {};
            const labelProps = {};
            return (
              <Step key={step} {...stepProps}>
                <StepLabel {...labelProps}>{step}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
        {activeStep === steps.length ? (
          <React.Fragment>
            <Typography sx={{ mt: 2, mb: 1 }}>
              All steps completed - you&apos;re finished
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Box sx={{ flex: "1 1 auto" }} />
              <Button onClick={handleReset}>Reset</Button>
            </Box>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Typography sx={{ mt: 2, mb: 1, textAlign: "center" }}>
              Step {activeStep + 1}
            </Typography>
          </React.Fragment>
        )}
      </Box>

      <div className="middle">
        <form
          onSubmit={handleSubmit}
          autoComplete="off"
          encType="multipart/form-data"
        >
          {activeStep === 0 && (
            <PersonalInfo
              values={values}
              errors={errors}
              touched={touched}
              handleChange={handleChange}
              handleBlur={handleBlur}
              setFieldValue={setFieldValue}
            />
          )}
          {activeStep === 1 && (
            <AddressInfo
              values={values}
              errors={errors}
              touched={touched}
              handleChange={handleChange}
              handleBlur={handleBlur}
            />
          )}
          {activeStep === 2 && (
            <AccountInfo
              values={values}
              errors={errors}
              touched={touched}
              handleChange={handleChange}
              handleBlur={handleBlur}
            />
          )}

          <div className="button-group">
            {activeStep < steps.length - 1 && (
              <Button
                disabled={isNextDisabled()}
                onClick={handleNext}
                value="Next"
              />
            )}
            {activeStep === steps.length - 1 && (
              <Button disabled={canSubmit()} type="submit" value="Signup" />
            )}
            {activeStep > 0 && <Button onClick={handleBack} value="Back" />}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
