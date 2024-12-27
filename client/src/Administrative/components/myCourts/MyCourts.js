import { useState, useEffect, useContext } from "react";
import { useFetch } from "../../../shared/hooks/useFetch";
import { AuthContext } from "../../../shared/context/auth";
import Overlay from "../../../shared/components/aydi/overlay/Overlay";

import MyCourtsList from "./myCourtsList/MyCourtsList";

import "./MyCourts.css";
import CourtDetails from "./courtDetails/CourtDetails";

const REACT_APP_API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const MyCourts = () => {
  const { user, userType } = useContext(AuthContext);
  const [courts, setCourts] = useState([]);
  const [showOverlay, setShowOverlay] = useState(false);
  const [courtId, setCourtId] = useState("");

  const [adminData, isAdminDataLoading] = useFetch(
    "GET",
    `${REACT_APP_API_BASE_URL}/admin/court/guestId/${user.ssid}`
  );

  const [JudgeData, isJudgeDataLoading] = useFetch(
    "GET",
    `${REACT_APP_API_BASE_URL}/admin/court/judgeId/${user.ssid}`
  );

  useEffect(() => {
    if (!isAdminDataLoading && adminData) {
      if (adminData.data.length) {
        setCourts(adminData.data);
      }
    }
  }, [adminData, isAdminDataLoading]);

  useEffect(() => {
    if (!isJudgeDataLoading && JudgeData) {
      if (JudgeData.data.length) {
        setCourts(JudgeData.data);
      }
    }
  }, [JudgeData, isJudgeDataLoading]);

  const showDetailsHandler = (event) => {
    const id = event.target.id;
    setCourtId(id);
    setShowOverlay(true);
  };

  const closeOverlayHandler = () => {
    setShowOverlay(false);
  };

  return (
    <div className="admin-mycourts-container">
      <MyCourtsList courts={courts} showDetailsHandler={showDetailsHandler} />
      {showOverlay && (
        <Overlay closeOverlayHandler={closeOverlayHandler}>
          <CourtDetails courtId={courtId} />
        </Overlay>
      )}
    </div>
  );
};
export default MyCourts;
