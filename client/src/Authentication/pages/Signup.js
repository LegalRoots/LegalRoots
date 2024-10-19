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
import {
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  Box,
} from "@chakra-ui/react";

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

    if (value !== "lawyer") {
      setFieldValue("cv", "");
      setFieldValue("specialization", "");
      setFieldValue("practicingCertificate", "");
      setFieldValue("consultationPrice", "");
    }

    handleChange(event);
  };
  return (
    <div className="personal-data">
      <div className={values.userType === "lawyer" ? "col" : "col-span"}>
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
            { value: "lawyer", label: "Lawyer" },
            { value: "user", label: "Normal User" },
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

      {values.userType === "lawyer" && (
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
              setFieldValue("practicingCertificate", file);
            }}
            id="practicingCertificate"
            type="file"
            labelText="Practicing Certificate (PDF)"
            accept="application/pdf"
            onBlur={handleBlur}
            errors={errors}
            touched={touched}
            error={
              errors.practicingCertificate && touched.practicingCertificate
            }
          />
          <Input
            value={values.consultationPrice}
            onChange={handleChange}
            id="consultationPrice"
            type="number"
            labelText="Consultation Price"
            placeholder="Enter your consultation price"
            onBlur={handleBlur}
            errors={errors}
            touched={touched}
            error={errors.consultationPrice && touched.consultationPrice}
          />
          <Input
            value={values.assessment}
            onChange={handleChange}
            id="assessment"
            type="text"
            labelText="Assessment"
            placeholder="Enter your assessment"
            onBlur={handleBlur}
            errors={errors}
            touched={touched}
            error={errors.assessment && touched.assessment}
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
  const { login } = useContext(AuthContext);

  const onSubmit = async (values, actions) => {
    try {
      const response = await fetch(
        "http://localhost:3000/JusticeRoots/users/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      if (!response.ok) {
        throw new Error("Signup failed");
      }
      console.log("TEST");
      const user = await response.json();
      login(user);
      navigate("/dashboard");
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
      practicingCertificate: "",
      consultationPrice: "",
      assessment: "",
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
        !errors.assessment &&
        !errors.cv &&
        !errors.specialization &&
        !errors.practicingCertificate &&
        !errors.consultationPrice &&
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

  return (
    <div className="signup-page">
      <Stepper className="stepper" colorScheme="yellow" index={activeStep}>
        {steps.map((step, index) => (
          <Step key={index}>
            <StepIndicator>
              <StepStatus
                complete={<StepIcon />}
                incomplete={<StepNumber />}
                active={<StepNumber />}
              />
            </StepIndicator>

            <Box flexShrink="0">
              <StepTitle>{step}</StepTitle>
              <StepDescription>{step} Details</StepDescription>
            </Box>

            <StepSeparator />
          </Step>
        ))}
      </Stepper>
      {activeStep === 0 && <h1>Step 1: Personal Information</h1>}
      {activeStep === 1 && <h1>Step 2: Contact Information</h1>}
      {activeStep === 2 && <h1>Step 3: Account Information</h1>}
      <div className="middle">
        <form onSubmit={handleSubmit} autoComplete="off">
          {activeStep === 0 && (
            <>
              <PersonalInfo
                values={values}
                errors={errors}
                touched={touched}
                handleChange={handleChange}
                handleBlur={handleBlur}
                setFieldValue={setFieldValue}
              />
            </>
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
