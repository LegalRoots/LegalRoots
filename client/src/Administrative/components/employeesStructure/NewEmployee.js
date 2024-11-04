import Button from "../../../shared/components/Button2/Button";
import { useState } from "react";
import Input from "../../../shared/components/FormElements/aydi/Input";
import useForm from "../../../shared/hooks/useForm";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_EQUALLENGTH,
  VALIDATOR_FULLNAME,
  VALIDATOR_EMAIL,
} from "../../../shared/util/validators";

import "./NewEmployee.css";
const REACT_APP_API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const NewEmployeee = () => {
  const [photo, setPhoto] = useState();
  const [idPhoto, setIdPhoto] = useState();
  const formData = {
    employee_id: { value: "", isValid: false },
    ssid: { value: "", isValid: false },
    full_name: { value: "", isValid: false },
    job: { value: "", isValid: false },
    birthdate: { value: "", isValid: false },
    email: { value: "", isValid: false },
    password: { value: "", isValid: false },
    phone: { value: "", isValid: false },
  };

  const fileChangeHandler = (event) => {
    if (event.target.id === "photo") {
      setPhoto(event.target.files[0]);
    } else if (event.target.id === "idPhoto") {
      setIdPhoto(event.target.files[0]);
    }
  };

  const [formState, inputHandler, setFormData] = useForm(formData, false);

  const onSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(document.getElementById("forms"));
    // formData.append("photo", photo);
    // formData.append("idPhoto", idPhoto);
    console.log(photo);
    try {
      const response = await fetch(
        `${REACT_APP_API_BASE_URL}/admin/employees`,
        {
          method: "POST",
          body: formData,
        }
      );

      const response_data = await response.json();
      if (response.ok === true) {
        console.log(response_data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="new-employee">
      <form onSubmit={onSubmit} id="forms">
        <h1>Employee Registration</h1>
        <Input
          label="SSID"
          name="ssid"
          id="ssid"
          onInput={inputHandler}
          type="number"
          placeholder="enter the ssid"
          className="new-employee__input"
          errorMsg="invalid ssid"
          validators={VALIDATOR_EQUALLENGTH(9)}
        />
        <Input
          label="Employee ID"
          id="employee_id"
          name="employee_id"
          onInput={inputHandler}
          type="text"
          placeholder="insert a unique id"
          className="new-employee__input"
          errorMsg="invalid employee id"
          validators={VALIDATOR_EQUALLENGTH(3)}
        />
        <Input
          label="Full Name"
          id="full_name"
          name="full_name"
          onInput={inputHandler}
          type="text"
          placeholder="the employee's full name"
          className="new-employee__input"
          errorMsg="invalid name"
          validators={VALIDATOR_FULLNAME()}
        />
        <Input
          label="Job"
          id="job"
          name="job"
          onInput={inputHandler}
          type="text"
          placeholder="job title"
          className="new-employee__input"
          errorMsg="invalid job"
          validators={VALIDATOR_MINLENGTH(2)}
        />
        <div className="new-employee__radio">
          <label>Gender :</label>
          <div>
            <input type="radio" name="gender" id="genderMale" />
            <label htmlFor="genderMale">Male</label>
          </div>
          <div>
            <input type="radio" name="gender" id="genderFemale" />
            <label htmlFor="genderFemale">Female</label>
          </div>
        </div>
        <Input
          label="Birthdate"
          id="birthdate"
          name="birthdate"
          onInput={inputHandler}
          type="date"
          className="new-employee__input"
          errorMsg="invalid date"
        />
        <Input
          label="Email"
          id="email"
          name="email"
          onInput={inputHandler}
          type="email"
          placeholder="enter email"
          className="new-employee__input"
          errorMsg="invalid email address"
          validators={VALIDATOR_EMAIL()}
        />
        <Input
          label="Phone number"
          id="phone"
          name="phone"
          onInput={inputHandler}
          type="number"
          placeholder="enter phone number"
          className="new-employee__input"
          errorMsg="invalid phone number"
          validators={VALIDATOR_EQUALLENGTH(10)}
        />
        <Input
          label="Password"
          id="password"
          name="password"
          onInput={inputHandler}
          type="password"
          placeholder="insert a valid password"
          className="new-employee__input"
          errorMsg="password must be at least 8 character"
          validators={VALIDATOR_MINLENGTH(8)}
        />
        <div className="new-employee__file">
          <label htmlFor="photo">Photo</label>
          <input
            type="file"
            id="photo"
            name="photo"
            onChange={fileChangeHandler}
            accept=".png , .jpg"
          />
        </div>
        <div className="new-employee__file">
          <label htmlFor="idPhoto" required>
            Photo
          </label>
          <input
            type="file"
            id="idPhoto"
            name="idPhoto"
            required
            onChange={fileChangeHandler}
            accept=".png .jpg"
          />
        </div>
        <div className="new-employee__button">
          <Button
            color="gold"
            size="2"
            id="newEmployeeBtn"
            disabled={!formState.isValid}
          >
            submit
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NewEmployeee;
