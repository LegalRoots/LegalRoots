import { useEffect, useRef, useState, useContext } from "react";
import Button from "../../../shared/components/Button2/Button";
import "./JoinMeeting.css";
import Input from "../FormElements/aydi/Input";
import Alert from "../aydi/alert/Alert";

import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/auth";

const JoinMeeting = ({
  headerText = "Join an Online Court",
  initialMic = false,
  initialCam = false,
  type = "normal",
}) => {
  const ctx = useContext(AuthContext);

  const mediaRef = useRef(null);
  const [camState, setCamState] = useState(initialCam);
  const [micState, setMicState] = useState(initialMic);
  const [roomId, setRoomId] = useState("");
  const [alertMsg, setAlertMsg] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [court, setCourt] = useState(null);
  const [adminValid, setAdminValid] = useState(false);

  const navigate = useNavigate();

  const inputHandler = (id, value, isValid) => {
    setRoomId(value);
  };
  const REACT_APP_API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const validateGuest = async () => {
    if (roomId === "") {
      return false;
    }
    const DATA = {
      ssid: ctx.user.ssid,
    };

    try {
      const response = await fetch(
        `${REACT_APP_API_BASE_URL}/admin/court/meeting/${roomId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(DATA),
        }
      );

      const response_data = await response.json();
      if (response.ok === true) {
        //here navigate
        navigate("/online/court", {
          state: { roomId: roomId, role: type, court: response_data.court },
        });
      } else if (response.status === 401) {
        setAlertMsg("you are not on the attendance list");
        setShowAlert(true);
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const validateInitiator = async () => {
    if (roomId === "") {
      return false;
    }

    try {
      const response = await fetch(
        `${REACT_APP_API_BASE_URL}/admin/court/courtId/${roomId}`
      );

      const response_data = await response.json();
      if (response.ok === true) {
        const init = response_data.data.initiator._id;

        if (ctx.user._id === init) {
          setCourt(response_data.data);
          return true;
        } else {
          setAlertMsg("you are not authorized to initiate this court");
          setShowAlert(true);
        }
      } else if (response.status === 404 || response.status === 400) {
        setAlertMsg("invalid id, no court is associated with this id");
        setShowAlert(true);
        return false;
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const startMeetingHandler = async () => {
    //here first check if user is authorized
    //--------
    if (type === "admin") {
      const valid = await validateInitiator();
      if (valid) {
        setAdminValid(true);
      }
    } else {
      //non initiator
      validateGuest();
    }
  };

  useEffect(() => {
    if (court && adminValid) {
      console.log(court);
      navigate("/online/court", {
        state: { roomId: roomId, role: type, court: court },
      });
    }
  }, [court, adminValid]);

  const toggleCamHandler = () => {
    setCamState((pre) => {
      return !pre;
    });
  };

  const toggleMicHandler = () => {
    setMicState((pre) => {
      return !pre;
    });
  };

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    if (mediaRef.current) {
      mediaRef.current.srcObject = stream;
      mediaRef.current.load();
      mediaRef.current.play();
    }
  };
  useEffect(() => {
    startCamera();
  }, []);

  useEffect(() => {
    if (camState) startCamera();
  }, [camState]);

  const closeAlertHandler = () => {
    setShowAlert(false);
  };

  return (
    <div className="online-court-joinMeeting">
      {showAlert && (
        <Alert title="Failed" closeAlertHandler={closeAlertHandler}>
          {alertMsg}
        </Alert>
      )}
      <div className="online-court-joinMeeting-video">
        {camState ? (
          <video
            ref={mediaRef}
            style={{ width: "400px", transform: "scaleX(-1)" }}
          />
        ) : (
          <div className="closed-cam">
            <i className="fa-solid fa-video-slash"></i>
            <p>camera is disabled</p>
          </div>
        )}
        <div className="online-court-joinMeeting-video__controls">
          <div>
            <p>Your camera is {camState ? "enabled" : "disabled"}</p>
            <Button onClick={toggleCamHandler}>
              {camState ? (
                <i className="fa-solid fa-video"></i>
              ) : (
                <i className="fa-solid fa-video-slash"></i>
              )}
            </Button>
          </div>
          <div>
            <p>Yor microphone is {micState ? "enabled" : "disabled"}</p>
            <Button onClick={toggleMicHandler}>
              {micState ? (
                <i className="fa-solid fa-microphone"></i>
              ) : (
                <i className="fa-solid fa-microphone-slash"></i>
              )}
            </Button>
          </div>
        </div>
      </div>
      <header>
        <h1>{headerText}</h1>
        <Input
          label="meeting id"
          name="cid"
          id="cid"
          onInput={inputHandler}
          type="text"
          placeholder="insert your meeting id"
          className="new-judge__input"
          errorMsg="invalid meeting id"
          //   validators={VALIDATOR_EQUALLENGTH(9)}
        />
        <Button color="gold" onClick={startMeetingHandler}>
          {type === "admin" ? "initiate" : "join"}
        </Button>
      </header>
    </div>
  );
};

export default JoinMeeting;
