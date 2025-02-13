import * as Yup from "yup";

const passwordValidation = Yup.string().required("Password is required");
const checkEmailExists = async (email) => {
  const response = await fetch(
    `http://localhost:5000/JusticeRoots/users/check-email`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    }
  );
  const data = await response.json();
  return data.exists;
};
const checkSSIDExists = async (ssid) => {
  const response = await fetch(
    `http://localhost:5000/JusticeRoots/users/check-SSID`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ssid }),
    }
  );
  const data = await response.json();
  return data.exists;
};
export const SignUpSchema = Yup.object().shape({
  password: passwordValidation,
  passwordConfirm: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
  SSID: Yup.string()
    .required("SSID is required")
    .test("checkSSIDExists", "This SSID already exists", async (value) => {
      if (!value) return true;
      const isTaken = await checkSSIDExists(value);
      return !isTaken;
    }),
  first_name: Yup.string().required("First name is required"),
  last_name: Yup.string().required("Last name is required"),
  email: Yup.string()
    .email("Invalid email")
    .required("Email is required")
    .test("checkEmailExists", "Email already taken", async (value) => {
      if (!value) return true;
      const isTaken = await checkEmailExists(value);
      return !isTaken;
    }),
  phone: Yup.string()
    .matches(/^05\d{8}$/, "Invalid phone number")
    .required("Phone number is required"),
  gender: Yup.string()
    .oneOf(["male", "female"], "Select a valid gender")
    .required("Gender is required"),
  birthday: Yup.date().required("Birthday is required"),
  city: Yup.string().required("City is required"),
  street: Yup.string().required("Street is required"),
  userType: Yup.string().required("User Type is required"),
  cv: Yup.string().when("userType", {
    is: "Lawyer",
    then: (schema) =>
      Yup.mixed()
        .required()
        .test("fileType", "Only PDF files are allowed", (value) => {
          return value && value.type === "application/pdf";
        }),
  }),
  practicing_certificate: Yup.string().when("userType", {
    is: "Lawyer",
    then: (schema) =>
      Yup.mixed()
        .required()
        .test("fileType", "Only PDF files are allowed", (value) => {
          return value && value.type === "application/pdf";
        }),
  }),

  specialization: Yup.string().when("userType", {
    is: "Lawyer",
    then: (Yup) => Yup.required(),
  }),

  consultation_price: Yup.string().when("userType", {
    is: "Lawyer",
    then: (Yup) => Yup.required(),
  }),
});
