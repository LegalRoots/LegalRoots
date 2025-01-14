import Overlay from "../../../shared/components/aydi/overlay/Overlay";
import { useState, useEffect } from "react";
import EvidencesList from "../../../Administrative/components/caseProfileWrapper/CaseProfile/evidencesList/EvidencesList";
import { useFetch } from "../../../shared/hooks/useFetch";
import { useLocation } from "react-router-dom";
import { manageAction } from "../../services/auth";

import "./PermissionsPage.css";

const REACT_APP_API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const PermissionsPage = ({ ssid, showOverlay, closeOverlayHandler }) => {
  //map the data to list

  const location = useLocation();
  const [perm, setPerm] = useState(null);
  const [dataValid, setDataValid] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [data, setData] = useState([
    { name: "camera", field: "camera", valid: false },
    { name: "microphone", field: "mic", valid: false },
    { name: "evidences", field: "files", valid: false },
    { name: "upload", field: "upload", valid: false },
    { name: "share screen", field: "share", valid: false },
  ]);

  const isAllowed = (field) => {
    return perm.permissions.includes(field);
  };

  const fetchData = async () => {
    try {
      const response = await fetch(
        `${REACT_APP_API_BASE_URL}/admin/court/courtId/${location.state.court._id}`
      );

      const response_data = await response.json();
      if (response.ok === true) {
        const p = response_data.data.permissions.find((p) => p.userId === ssid);
        setPerm(p);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchData();
  }, [showOverlay]);

  useEffect(() => {
    if (perm) {
      console.log("fetched");
      setDataValid(true);

      data.forEach((item, i) => {
        setData((pre) => {
          pre[i].isValid = isAllowed(item.field);
          return pre;
        });
      });
    }
  }, [perm]);

  const updatePermissions = (type, field) => {
    console.log(type);
    console.log(field);
    console.log(ssid);
    console.log(location.state.court._id);

    let res = manageAction(location.state.court._id, field, ssid, type);
    if (res) {
      setAlertMsg(`the process completed successfully`);
      setShowAlert(true);
      setTimeout(() => {
        setAlertMsg(``);
        setShowAlert(false);
      }, 3000);
    }
  };

  return (
    <>
      {showOverlay && dataValid && (
        <Overlay closeOverlayHandler={closeOverlayHandler}>
          <div className="permissions-page-container">
            <header>Permissions</header>
            <ul className="permissions-page-list">
              {data.map((item) => (
                <li key={item.field}>
                  <div>
                    <p
                      className={`pointed-p ${
                        item.isValid ? "selected" : "non"
                      }`}
                    >
                      {item.name}
                    </p>
                  </div>
                  <div>
                    <span
                      onClick={() => {
                        updatePermissions("add", item.field);
                      }}
                    >
                      <i className="fa-solid fa-check"></i>
                    </span>
                    <span
                      onClick={() => {
                        updatePermissions("remove", item.field);
                      }}
                    >
                      <i className="fa-solid fa-x"></i>
                    </span>
                  </div>
                </li>
              ))}
            </ul>
            {showAlert && <p className="alert-message">{alertMsg}</p>}
          </div>
        </Overlay>
      )}
    </>
  );
};

export default PermissionsPage;
