import { useState, useEffect } from "react";
import { useMeeting, useParticipant } from "@videosdk.live/react-sdk";
import ParticipantView from "../ParticipantView/ParticipantView";
import { useNavigate } from "react-router-dom";
import "./MeetingView.css";

function Controls(props) {
  const { leave, toggleMic, toggleWebcam } = useMeeting();
  const { id, userType } = props.metaData;
  const { webcamOn, micOn, isLocal, displayName, metaData } = useParticipant(
    props.participantId
  );

  return (
    <div className="meetingView-body-controls">
      <button
        onClick={() => {
          leave();
        }}
      >
        <i className="fa-solid fa-right-from-bracket"></i>
      </button>
      <button>
        <i className="fa-solid fa-user-group"></i>
      </button>
      <button id="uploadfile" onClick={() => leave()}>
        Upload File
      </button>
      <button onClick={() => toggleMic()}>
        {micOn ? (
          <i className="fa-solid fa-microphone" style={{ color: "#888" }}></i>
        ) : (
          <i
            className="fa-solid fa-microphone-slash"
            style={{ color: "red" }}
          ></i>
        )}
      </button>
      <button onClick={() => toggleWebcam()}>
        {webcamOn ? (
          <i className="fa-solid fa-video" style={{ color: "#888" }}></i>
        ) : (
          <i className="fa-solid fa-video-slash" style={{ color: "red" }}></i>
        )}
      </button>
      <button>
        <i className="fa-solid fa-display"></i>
      </button>
    </div>
  );
}

const MeetingView = (props) => {
  const [joined, setJoined] = useState(null);
  const navigate = useNavigate();
  const [myId, setMyId] = useState();

  const { join, participants } = useMeeting({
    //callback when user joins the meeting
    onMeetingJoined: () => {
      setJoined("JOINED");
    },
    //callback for when meeting is left
    onMeetingLeft: () => {
      props.onMeetingLeave();
      navigate("/");
    },
  });

  const joinMeeting = () => {
    setJoined("JOINING");
    join();
  };

  useEffect(() => {
    setTimeout(() => {
      joinMeeting();
    }, 2000);
  }, []);

  useEffect(() => {
    participants.forEach((item) => {
      if (item.local) {
        setMyId(item.id);
      }
    });
  }, [participants]);

  let pageContent = <p>Joining the meeting...</p>;

  if (joined && joined == "JOINED") {
    pageContent = (
      <div className="meetingView-body">
        <div className="meetingView-body-layout">layout</div>
        <div className="meetingView-body-videos">
          {[...participants.keys()].map((participantId) => (
            <ParticipantView
              participantId={participantId}
              key={participantId}
            />
          ))}
        </div>
        <Controls participantId={myId} metaData={props.metaData} />
      </div>
    );
  }

  return (
    <div className="meetingView-container">
      <header className="meetingView-header">
        <h3>Title goes here</h3>
      </header>
      {pageContent}
    </div>
  );
};

export default MeetingView;
