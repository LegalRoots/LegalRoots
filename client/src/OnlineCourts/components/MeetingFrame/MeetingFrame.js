import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  MeetingProvider,
  MeetingConsumer,
  useMeeting,
  useParticipant,
} from "@videosdk.live/react-sdk";
import MeetingView from "../MeetingView/MeetingView";
import { authToken, createMeeting } from "../VideocallAPI/VideoCallAPI";
import { useLocation } from "react-router-dom";

function MeetingFrame() {
  const metaData = {
    id: "3",
    userType: "Judge",
    name: "Mohammed Aydii",
    role: "Master Judge",
  };
  const [meetingId, setMeetingId] = useState(null);
  const LOCATION = useLocation();

  const InitializeMeeting = async () => {
    const mid = await createMeeting({ token: authToken });
    setMeetingId(mid);
  };

  const onMeetingLeave = () => {
    setMeetingId(null);
  };

  useEffect(() => {
    if (LOCATION.state.role === "admin") {
      InitializeMeeting();
    } else {
      setMeetingId(LOCATION.state.roomId);
    }
  }, [LOCATION.state.roomId, LOCATION.state.role]);

  return authToken && meetingId ? (
    <MeetingProvider
      config={{
        meetingId,
        micEnabled: true,
        webcamEnabled: true,
        name: "Mohammed Aydi",
        metaData: metaData,
      }}
      token={authToken}
    >
      <MeetingView
        meetingId={meetingId}
        onMeetingLeave={onMeetingLeave}
        metaData={metaData}
      />
    </MeetingProvider>
  ) : (
    <p>Loading...</p>
  );
}

export default MeetingFrame;
