import { useState, useEffect, useContext } from "react";
import {
  useMeeting,
  useParticipant,
  usePubSub,
} from "@videosdk.live/react-sdk";
import ParticipantView from "../ParticipantView/ParticipantView";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../shared/context/auth";
import { validateAction } from "../../services/auth";

import "./MeetingView.css";
import PresenterView from "../PresenterView/PresenterView";
import Overlay from "../../../shared/components/aydi/overlay/Overlay";

function Controls(props) {
  const {
    leave,
    toggleMic,
    toggleWebcam,
    toggleScreenShare,
    enableScreenShare,
  } = useMeeting();
  const { id, userType } = props.metaData;
  const location = useLocation();

  const { publish } = usePubSub("ADMIN_LEFT");
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
      <button
        onClick={() => {
          toggleScreenShare();
        }}
      >
        <i className="fa-solid fa-display"></i>
      </button>
      {location.state.role === "admin" && (
        <button
          id="uploadfile"
          onClick={() => {
            const isAdmin = location.state.role === "admin";
            if (isAdmin) {
              console.log("message published");
              publish(
                "Admin has left the meeting",
                { persist: true },
                null,
                null
              );
              console.log("message published after");
            }
            leave();
          }}
        >
          End meeting
        </button>
      )}

      <button
        onClick={() => {
          toggleMic();
          if (!micOn) {
            if (
              validateAction(
                props.courtId,
                props.role,
                "mic",
                props.ctx.user.ssid
              )
            ) {
              toggleMic();
            }
          } else {
            toggleMic();
          }
        }}
      >
        {micOn ? (
          <i className="fa-solid fa-microphone" style={{ color: "#888" }}></i>
        ) : (
          <i
            className="fa-solid fa-microphone-slash"
            style={{ color: "red" }}
          ></i>
        )}
      </button>
      <button
        onClick={() => {
          if (!webcamOn) {
            if (
              validateAction(
                props.courtId,
                props.role,
                "camera",
                props.ctx.user.ssid
              )
            ) {
              toggleWebcam();
            }
          } else {
            toggleWebcam();
          }
        }}
      >
        {webcamOn ? (
          <i className="fa-solid fa-video" style={{ color: "#888" }}></i>
        ) : (
          <i className="fa-solid fa-video-slash" style={{ color: "red" }}></i>
        )}
      </button>
    </div>
  );
}

const MeetingView = (props) => {
  const ctx = useContext(AuthContext);
  const [joined, setJoined] = useState(null);
  const navigate = useNavigate();
  const [myId, setMyId] = useState();
  const [pid, setPID] = useState(null);

  const { join, leave, participants, presenterId } = useMeeting({
    //callback when user joins the meeting
    onMeetingJoined: () => {
      setJoined("JOINED");
    },
    onPresenterChanged: (presenterId) => {
      console.log("Presenter changed:", presenterId);
      setPID(presenterId);
    },

    //callback for when meeting is left
    onMeetingLeft: () => {
      props.onMeetingLeave();

      navigate("/");
    },
  });
  function onMessageReceived(message) {
    console.log("New Message:", message);
    leave();
  }

  function onOldMessagesReceived(messages) {
    console.log("Old Messages:", messages);
  }
  const { messages } = usePubSub("ADMIN_LEFT", {
    onMessageReceived,
    onOldMessagesReceived,
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
    props.populateParticipants(participants);
  }, [participants]);

  let pageContent = <p>Joining the meeting...</p>;

  if (joined && joined == "JOINED") {
    pageContent = (
      <div className="meetingView-body">
        {props.showShareOverlay && (
          <Overlay closeOverlayHandler={props.closeShareOverlayHandler}>
            <div>{pid && <PresenterView presenterId={pid} />}</div>
          </Overlay>
        )}
        <div className="meetingView-body-layout"></div>
        <div className="meetingView-body-videos">
          {[...participants.keys()].map((participantId) => (
            <ParticipantView
              participantId={participantId}
              key={participantId}
            />
          ))}
        </div>
        <Controls
          participantId={myId}
          metaData={props.metaData}
          courtId={props.courtId}
          role={props.role}
          ctx={ctx}
        />
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
