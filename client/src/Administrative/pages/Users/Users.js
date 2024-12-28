import Overlay from "../../../shared/components/aydi/overlay/Overlay";
import { useFetch } from "../../../shared/hooks/useFetch";
import AssignmentsTable from "../../components/assignmentsTable/AssignmentsTable";
import { useState, useEffect } from "react";
import UsersTable from "../../components/usersTable/UsersTable";

const REACT_APP_API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Users = () => {
  const [allLawyers, setAllLawyers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [showOverlay, setShowOverlay] = useState(false);
  const [lawyerId, setLawyerId] = useState("");
  const [tableState, setTableState] = useState(1);

  const [lData, isLDataLoading] = useFetch(
    "GET",
    `${REACT_APP_API_BASE_URL}/JusticeRoots/lawyers`
  );
  const [uData, isUDataLoading] = useFetch(
    "GET",
    `${REACT_APP_API_BASE_URL}/JusticeRoots/users`
  );

  useEffect(() => {
    if (!isLDataLoading && lData) {
      console.log(lData);
      setAllLawyers(lData.data.lawyers);
    }
  }, [lData, isLDataLoading]);

  useEffect(() => {
    if (!isUDataLoading && uData) {
      console.log(uData);
      setAllUsers(uData.data.users);
    }
  }, [uData, isUDataLoading]);

  const closeOverlayHandler = () => {
    setShowOverlay(false);
  };

  const tableStateHandler = (f) => {
    setTableState(f);
  };

  return (
    <div className="admin-assignments-container">
      {showOverlay && (
        <Overlay closeOverlayHandler={closeOverlayHandler}>s</Overlay>
      )}
      <UsersTable
        users={tableState === 1 ? allUsers : allLawyers}
        tableStateHandler={tableStateHandler}
      />
    </div>
  );
};

export default Users;
