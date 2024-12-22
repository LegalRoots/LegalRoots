import { useEffect, useRef, useState } from "react";
import Button from "../../../shared/components/Button2/Button";
import "./JoinMeeting.css";
import Input from "../FormElements/aydi/Input";
import { useNavigate } from "react-router-dom";

const JoinMeeting = ({
  headerText = "Join an Online Court",
  initialMic = false,
  initialCam = false,
  type = "normal",
}) => {
  const mediaRef = useRef(null);
  const [camState, setCamState] = useState(initialCam);
  const [micState, setMicState] = useState(initialMic);
  const [roomId, setRoomId] = useState("");

  const navigate = useNavigate();

  const inputHandler = (id, value, isValid) => {
    setRoomId(value);
  };

  const startMeetingHandler = () => {
    //here first check if user is authorized
    //--------
    //now forward the user to the video call
    navigate("/online/court", { state: { roomId: roomId, role: type } });
  };
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

  return (
    <div className="online-court-joinMeeting">
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
          join
        </Button>
      </header>
    </div>
  );
};

export default JoinMeeting;
