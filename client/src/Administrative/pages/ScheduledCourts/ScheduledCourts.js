import "./ScheduledCourts.css";
import { useFetch } from "../../../shared/hooks/useFetch";
import { useState, useEffect } from "react";
import ScheduledCourtsList from "../../components/scheduledCourtsList/ScheduledCourtsList";

const REACT_APP_API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const ScheduledCourts = () => {
  const [courts, setCourts] = useState([]);
  const [data, isLoading] = useFetch(
    "GET",
    `${REACT_APP_API_BASE_URL}/admin/court/all`
  );

  useEffect(() => {
    if (!isLoading && data) {
      console.log(data);
      setCourts(data.data);
    }
  }, [data, isLoading]);
  return (
    <div className="admin-scheduledCourts-container">
      <ScheduledCourtsList courts={courts} />
    </div>
  );
};

export default ScheduledCourts;
