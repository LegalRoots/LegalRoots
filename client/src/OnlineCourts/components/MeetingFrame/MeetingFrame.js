import React, { useEffect, useMemo, useRef, useState, useContext } from "react";
import {
  MeetingProvider,
  MeetingConsumer,
  useMeeting,
  useParticipant,
} from "@videosdk.live/react-sdk";
import MeetingView from "../MeetingView/MeetingView";
import { authToken, createMeeting } from "../VideocallAPI/VideoCallAPI";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../../../shared/context/auth";

const REACT_APP_API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function MeetingFrame({
  populateParticipants,
  closeShareOverlayHandler,
  showShareOverlay,
}) {
  const LOCATION = useLocation();

  const { user, type } = useContext(AuthContext);
  const metaData = {
    id: user._id,
    userType: type,
    name: user.first_name + " " + user.last_name,
    role: LOCATION.state.role,
    ssid: user.ssid,
  };
  const [meetingId, setMeetingId] = useState(null);
  const [court, setCourt] = useState(null);

  const InitializeMeeting = async () => {
    const mid = await createMeeting({ token: authToken });
    //here set meeting as started and set meeting id
    const FORM_DATA = {
      meeting_id: mid,
      courtId: LOCATION.state.court._id,
    };
    try {
      const response = await fetch(
        `${REACT_APP_API_BASE_URL}/admin/court/meeting_id`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(FORM_DATA),
        }
      );

      const response_data = await response.json();
      if (response.ok === true) {
        setMeetingId(mid);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onMeetingLeave = () => {
    setMeetingId(null);
  };

  useEffect(() => {
    if (LOCATION.state?.roomId && LOCATION.state?.role) {
      if (LOCATION.state.role === "admin") {
        InitializeMeeting();
      } else {
        setMeetingId(LOCATION.state.roomId);
      }
    }
  }, [LOCATION.state.roomId, LOCATION.state.role]);

  useEffect(() => {
    if (LOCATION.state.court) {
      setCourt(LOCATION.state.court);
    }
  }, [LOCATION.state.court]);

  return authToken && meetingId ? (
    <MeetingProvider
      config={{
        meetingId,
        micEnabled: true,
        webcamEnabled: true,
        name: user.first_name + " " + user.last_name,
        metaData: metaData,
      }}
      token={authToken}
    >
      <MeetingView
        meetingId={meetingId}
        onMeetingLeave={onMeetingLeave}
        metaData={metaData}
        courtId={court._id}
        role={LOCATION.state.role}
        populateParticipants={populateParticipants}
        closeShareOverlayHandler={closeShareOverlayHandler}
        showShareOverlay={showShareOverlay}
      />
    </MeetingProvider>
  ) : (
    <p>Loading...</p>
  );
}

export default MeetingFrame;
