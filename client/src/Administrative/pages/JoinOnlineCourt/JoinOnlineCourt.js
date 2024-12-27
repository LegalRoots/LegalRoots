import { useEffect, useRef, useState } from "react";
import Button from "../../../shared/components/Button2/Button";
import "./JoinOnlineCourt.css";
import JoinMeeting from "../../../shared/components/JoinMeeting/JoinMeeting";
import Card from "../../components/headerCard/Card";
import MyCourts from "../../components/myCourts/MyCourts";

const JoinOnlineCourt = () => {
  return (
    <div className="admin-online-court-main">
      <JoinMeeting />
      <div className="admin-online-court-mycourts">
        <Card header="My Courts">
          <MyCourts />
        </Card>
      </div>
    </div>
  );
};

export default JoinOnlineCourt;
