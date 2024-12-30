import "./ScheduledCourts.css";
import { useFetch } from "../../../shared/hooks/useFetch";
import { useState, useEffect, useCallback } from "react";
import ScheduledCourtsList from "../../components/scheduledCourtsList/ScheduledCourtsList";
import Input from "../../../shared/components/FormElements/aydi/Input";
import Card from "../../components/headerCard/Card";
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

  const filterCourts = async (d) => {
    try {
      const response = await fetch(
        `${REACT_APP_API_BASE_URL}/admin/court/filter?date=${d}`
      );

      const response_data = await response.json();

      if (response.ok === true) {
        setCourts(response_data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const inputHandler = useCallback((id, val, isValid) => {
    filterCourts(new Date(val));
  }, []);

  return (
    <div className="admin-scheduledCourts-container">
      <Card header="Scheduled Courts">
        <div className="admin-scheduledCourts-filter">
          <Input
            label="Date"
            id="date1"
            name="date1"
            onInput={inputHandler}
            type="date"
            className="filter-searchbar"
          />
        </div>
        <ScheduledCourtsList courts={courts} />
      </Card>
    </div>
  );
};

export default ScheduledCourts;
