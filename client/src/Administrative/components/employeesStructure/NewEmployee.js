import Button from "../../../shared/components/Button2/Button";
import { useState, useEffect } from "react";
import Input from "../../../shared/components/FormElements/aydi/Input";
import useForm from "../../../shared/hooks/useForm";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_EQUALLENGTH,
  VALIDATOR_FULLNAME,
  VALIDATOR_EMAIL,
} from "../../../shared/util/validators";
import Select from "../../../shared/components/FormElements/aydi/select/Select";
import { useFetch } from "../../../shared/hooks/useFetch";
import { useNavigate } from "react-router-dom";

import "./NewEmployee.css";
const REACT_APP_API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const NewEmployeee = () => {
  const navigate = useNavigate();
  const [photo, setPhoto] = useState();
  const [idPhoto, setIdPhoto] = useState();
  const formData = {
    ssid: { value: "", isValid: false },
    first_name: { value: "", isValid: false },
    second_name: { value: "", isValid: false },
    third_name: { value: "", isValid: false },
    last_name: { value: "", isValid: false },
    job: { value: "", isValid: false },
    birthdate: { value: "", isValid: false },
    email: { value: "", isValid: false },
    password: { value: "", isValid: false },
    phone: { value: "", isValid: false },
    court_branch: { value: "", isValid: true },
  };

  const fileChangeHandler = (event) => {
    if (event.target.id === "photo") {
      setPhoto(event.target.files[0]);
    } else if (event.target.id === "idPhoto") {
      setIdPhoto(event.target.files[0]);
    }
  };

  const [formState, inputHandler, setFormData] = useForm(formData, false);
  const [courtsList, setCourtsList] = useState([]);
  const [jobsList, setJobsList] = useState([]);

  const [courtData, isCourtDataLoading] = useFetch(
    "GET",
    `${REACT_APP_API_BASE_URL}/admin/court-branch`
  );

  const [jobsData, isJobDataLoading] = useFetch(
    "GET",
    `${REACT_APP_API_BASE_URL}/admin/job`
  );
  useEffect(() => {
    if (!isJobDataLoading && jobsData) {
      let tmp = jobsData.jobs.map((j) => j.title);
      setJobsList(tmp);

      setFormData({
        ...formData,
        job: { value: tmp[0], isValid: true },
      });
    }
  }, [jobsData, isJobDataLoading]);

  useEffect(() => {
    if (!isCourtDataLoading && courtData) {
      let tmpArray = courtData.map((court) => court.name);
      setCourtsList(tmpArray);
    }
  }, [courtData, isCourtDataLoading]);

  const onSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(document.getElementById("forms"));
    //setting the court value
    let court = courtData.find(
      (c) => c.name === formState.inputs.court_branch.value
    );
    if (court) {
      formData.set("court_branch", court._id);
    } else {
      formData.set("court_branch", "");
    }

    //setting the job value
    let job = jobsData.jobs.find((j) => j.title === formState.inputs.job.value);
    formData.set("job", job._id);

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
        navigate("/admin/emp");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const SelectHandler = (event) => {
    const val = event.target.value;
    if (event.target.id === "court_branch") {
      inputHandler("court_branch", val, true);
    } else if (event.target.id === "job") {
      inputHandler("job", val, true);
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
        <div className="new-employee-selects">
          <Select
            label="Court Branch"
            placeholder="Court Branch"
            id="court_branch"
            options={["", ...courtsList]}
            value={formState.inputs.court_branch.value}
            onChange={SelectHandler}
          />
          <Select
            label="Job"
            placeholder="job title"
            id="job"
            options={jobsList}
            value={formState.inputs.job.value}
            onChange={SelectHandler}
          />
        </div>

        <Input
          label="First Name"
          id="first_name"
          name="first_name"
          onInput={inputHandler}
          type="text"
          placeholder="the employee's first name"
          className="new-employee__input"
          errorMsg="invalid name"
          validators={VALIDATOR_MINLENGTH(1)}
        />
        <Input
          label="Second Name"
          id="second_name"
          name="second_name"
          onInput={inputHandler}
          type="text"
          placeholder="the employee's second name"
          className="new-employee__input"
          errorMsg="invalid name"
          validators={VALIDATOR_MINLENGTH(1)}
        />
        <Input
          label="Third Name"
          id="third_name"
          name="third_name"
          onInput={inputHandler}
          type="text"
          placeholder="the employee's third name"
          className="new-employee__input"
          errorMsg="invalid name"
          validators={VALIDATOR_MINLENGTH(1)}
        />
        <Input
          label="Last Name"
          id="last_name"
          name="last_name"
          onInput={inputHandler}
          type="text"
          placeholder="the employee's last name"
          className="new-employee__input"
          errorMsg="invalid name"
          validators={VALIDATOR_MINLENGTH(1)}
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
            required
          />
        </div>
        <div className="new-employee__file">
          <label htmlFor="idPhoto">Photo</label>
          <input
            type="file"
            id="idPhoto"
            name="idPhoto"
            required
            onChange={fileChangeHandler}
            accept=".png , .jpg"
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
