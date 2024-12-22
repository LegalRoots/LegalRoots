import { useEffect, useRef, useState } from "react";
import Button from "../../../shared/components/Button2/Button";
import "./JoinOnlineCourt.css";
import JoinMeeting from "../../../shared/components/JoinMeeting/JoinMeeting";

const JoinOnlineCourt = () => {
  return (
    <div className="admin-online-court-main">
      <JoinMeeting />
    </div>
  );
};

export default JoinOnlineCourt;
