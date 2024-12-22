import useForm from "../../../shared/hooks/useForm";
import { useFetch } from "../../../shared/hooks/useFetch";
import { useEffect, useRef, useState } from "react";
import logo from "../../../shared/assets/palgov-gold.png";
import Page1 from "../judgeNewPages/Page1";
import Page2 from "../judgeNewPages/Page2";
import Page3 from "../judgeNewPages/Page3";
import { useNavigate } from "react-router-dom";

import "./NewJudge.css";

const REACT_APP_API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const court_types = [
  "المحكمة العليا",
  "محكمة الاستئناف",
  "محكمة البداية",
  "محكمة الصلح",
];

const court_names = [
  "محكمة بداية وصلح نابلس",
  "محكمة الاستئناف رام الله",
  "محكمة النقض",
  "محكمة جنين",
];

const NewJudge = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const formRef = useRef();
  const sideRef = useRef();
  const normalRef = useRef();
  const successRef = useRef();
  const pageRef = useRef();

  const [photo, setPhoto] = useState();
  const [idPhoto, setIdPhoto] = useState();
  const [ppPhoto, setPpPhoto] = useState();
  const [courtsList, setCourtsList] = useState();
  const [courtData, isCourtDataLoading] = useFetch(
    "GET",
    `${REACT_APP_API_BASE_URL}/admin/court-branch`
  );

  useEffect(() => {
    if (!isCourtDataLoading && courtData) {
      let tmpArray = courtData.map((court) => court.name);
      setCourtsList(tmpArray);
    }
  }, [courtData, isCourtDataLoading]);

  const navigate = useNavigate();

  const exitAnimation = () => {
    formRef.current.style = "flex:0;width: 0px;padding: 0";
    sideRef.current.style = "flex: 1;border-radius:20px";

    normalRef.current.style = "display: none";
    successRef.current.style = "display: block; opacity:0";
    pageRef.current.style = "animation: fadeOut 1.5s ease-out 1s forwards";

    setTimeout(() => {
      navigate("/admin/judges");
    }, 1800);
  };
  const currentPageHandler = (event) => {
    const id = event.target.id;
    if (id === "page1Btn") {
      setCurrentPage(2);
    } else if (id === "page2Btn_backwards") {
      setCurrentPage(1);
    } else if (id === "page2Btn_forward") {
      setCurrentPage(3);
    } else if (id === "page3Btn_backwards") {
      setCurrentPage(2);
    }
  };
  const formData = {
    ssid: { value: "", isValid: false },
    first_name: { value: "", isValid: false },
    second_name: { value: "", isValid: false },
    third_name: { value: "", isValid: false },
    last_name: { value: "", isValid: false },
    address_st: { value: "", isValid: false },
    city: { value: "", isValid: false },
    birthdate: { value: "", isValid: false },
    email: { value: "", isValid: false },
    password: { value: "", isValid: false },
    phone: { value: "", isValid: false },
    court_name: { value: "", isValid: false },
    qualifications: { value: "", isValid: false },
    experience: { value: "", isValid: false },
    gender: { value: "", isValid: false },
  };
  const [formState, inputHandler] = useForm(formData, false);

  const SelectHandler = (event) => {
    inputHandler(event.target.id, event.target.value, true);
  };

  const fileChangeHandler = (event) => {
    const id = event.target.id;
    if (id === "photo") {
      setPhoto(event.target.files[0]);
    } else if (id === "idPhoto") {
      setIdPhoto(event.target.files[0]);
    } else if (id === "ppPhoto") {
      setPpPhoto(event.target.files[0]);
    }
  };

  const RadioHandler = (event) => {
    const value = event.target.value;
    if (event.target.name === "gender") {
      const isValid = value === "male" || value === "female";
      inputHandler("gender", event.target.value, isValid);
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const formData2 = new FormData(document.getElementById("newJudgeForm"));

    //map the correct court id
    const chosenCourt = courtData.find(
      (court) => court.name === formState.inputs.court_name.value
    );

    //add fields
    Object.entries(formState.inputs).forEach(([key, ob]) => {
      formData2.set(key, ob.value);
    });

    formData2.set("court_name", chosenCourt._id);

    try {
      const response = await fetch(`${REACT_APP_API_BASE_URL}/admin/judges`, {
        method: "POST",
        body: formData2,
      });

      const response_data = await response.json();
      if (response.ok === true) {
        console.log(response_data);
        exitAnimation();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div ref={pageRef} className="new-judge">
      <form ref={formRef} onSubmit={onSubmit} id="newJudgeForm">
        {currentPage === 1 && (
          <Page1
            inputHandler={inputHandler}
            formState={formState}
            currentPageHandler={currentPageHandler}
            RadioHandler={RadioHandler}
          />
        )}
        {currentPage === 2 && (
          <Page2
            inputHandler={inputHandler}
            formState={formState}
            currentPageHandler={currentPageHandler}
            court_types={court_types}
            court_names={courtsList}
            SelectHandler={SelectHandler}
          />
        )}
        {currentPage === 3 && (
          <Page3
            inputHandler={inputHandler}
            formState={formState}
            currentPageHandler={currentPageHandler}
            fileChangeHandler={fileChangeHandler}
          />
        )}
      </form>
      <div className="new-judge-side" ref={sideRef}>
        <div className="new-judge-side__header">
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
        <h1 ref={normalRef}>Judge Registration Form</h1>
        <div ref={successRef} className="new-judge-side__success fade-in">
          <h3>Judge added successfully</h3>
          <i className="fa-solid fa-circle-check"></i>
        </div>
      </div>
    </div>
  );
};

export default NewJudge;
