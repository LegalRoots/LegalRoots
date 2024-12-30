import Overlay from "../../../shared/components/aydi/overlay/Overlay";
import { useFetch } from "../../../shared/hooks/useFetch";
import AssignmentsTable from "../../components/assignmentsTable/AssignmentsTable";
import { useState, useEffect } from "react";
import AssignmentsReplace from "../../components/assignmentsReplace/AssignmentsReplace";
import "./Jobs.css";
import JobsTable from "../../components/jobsTable/JobsTable";
import JobProfile from "../../components/jobProfile/JobProfile";
import JobsNew from "../../components/jobsNew/JobsNew";
import JobsUpdate from "../../components/jobsUpdate/JobsUpdate";
const REACT_APP_API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [pickedJob, setPickedJob] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [showCreateOverlay, setShowCreateOverlay] = useState(false);
  const [showUpdateOverlay, setShowUpdateOverlay] = useState(false);

  const [data, isDataLoading] = useFetch(
    "GET",
    `${REACT_APP_API_BASE_URL}/admin/job`
  );

  useEffect(() => {
    if (!isDataLoading && data) {
      console.log(data);
      setJobs(data.jobs);
    }
  }, [data, isDataLoading]);

  const closeOverlayHandler = () => {
    setShowOverlay(false);
  };
  const detailsHandler = (event) => {
    const id = event.target.id;
    const j = data.jobs.find((j) => j._id === id);

    if (j) {
      setPickedJob(j);
      setShowOverlay(true);
    }
  };

  const createJobHandler = async (job) => {
    const FORM_DATA = job;
    try {
      const response = await fetch(`${REACT_APP_API_BASE_URL}/admin/job`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(FORM_DATA),
      });

      const response_data = await response.json();
      if (response.ok === true) {
        setShowCreateOverlay(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const updateJobHandler = async (job) => {
    const FORM_DATA = job;
    try {
      const response = await fetch(
        `${REACT_APP_API_BASE_URL}/admin/job/${job._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(FORM_DATA),
        }
      );

      const response_data = await response.json();
      if (response.ok === true) {
        setShowUpdateOverlay(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const closeCreateOverlayHandler = () => {
    setShowCreateOverlay(false);
  };
  const closeUpdateOverlayHandler = () => {
    setShowUpdateOverlay(false);
  };

  const onNewHandler = () => {
    setShowCreateOverlay(true);
  };

  const onUpdateHandler = () => {
    setShowUpdateOverlay(true);
  };

  return (
    <div className="admin-jobs-container">
      {showOverlay && (
        <Overlay closeOverlayHandler={closeOverlayHandler}>
          <JobProfile job={pickedJob} onUpdateHandler={onUpdateHandler} />
        </Overlay>
      )}

      <JobsTable
        jobs={jobs}
        detailsHandler={detailsHandler}
        onNewHandler={onNewHandler}
      />
      {showCreateOverlay && (
        <Overlay closeOverlayHandler={closeCreateOverlayHandler}>
          <JobsNew onSubmit={createJobHandler} />
        </Overlay>
      )}
      {showUpdateOverlay && (
        <Overlay closeOverlayHandler={closeUpdateOverlayHandler}>
          <JobsUpdate onSubmit={updateJobHandler} preJob={pickedJob} />
        </Overlay>
      )}
    </div>
  );
};

export default Jobs;
