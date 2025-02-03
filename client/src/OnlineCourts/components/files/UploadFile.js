import Overlay from "../../../shared/components/aydi/overlay/Overlay";
import Button from "../../../shared/components/Button2/Button";
import { useState, useContext } from "react";
import { AuthContext } from "../../../shared/context/auth";
import { useLocation } from "react-router-dom";
import Alert from "../../../shared/components/aydi/alert/Alert";
import "./UploadFile.css";

const REACT_APP_API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const UploadFile = ({ showUploadOverlay, closeUploadOverlayHandler }) => {
  const location = useLocation();
  const ctx = useContext(AuthContext);

  const [fileValid, setFileValid] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");

  const fileChangeHandler = (e) => {
    const allowedTypes = [
      "application/json",
      "application/pdf",
      "image/png",
      "image/jpeg",
      "text/plain",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "video/mp4",
      "audio/mpeg",
    ];
    console.log("file uploaded successfully");
    const file = e.target.files[0];
    if (!file) {
      setFileValid(false);
    } else if (allowedTypes.includes(file.type)) {
      setFileValid(true);
    } else {
      setFileValid(false);
    }
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    let formData = new FormData(document.getElementById("uploadForm"));
    formData.append("case_id", String(location.state.court.caseId));
    formData.append("uploaded_by", ctx.user.ssid);

    console.log(location.state.court.caseId);

    try {
      const response = await fetch(
        `${REACT_APP_API_BASE_URL}/admin/evidence/add`,
        {
          method: "POST",
          body: formData,
        }
      );

      const response_data = await response.json();
      if (response.ok === true) {
        setAlertMsg("file has been uploaded successfully");
        setShowAlert(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const closeAlertHandler = () => {
    setShowAlert(false);
  };

  return (
    <>
      {showAlert && (
        <Alert closeAlertHandler={closeAlertHandler} title="Success">
          {alertMsg}
        </Alert>
      )}
      {showUploadOverlay && (
        <Overlay closeOverlayHandler={closeUploadOverlayHandler}>
          <div className="onlinecourt-uploadFile-container">
            <header>Upload Evidence</header>
            <form id="uploadForm" onSubmit={submitHandler}>
              <div className="new-judge__file">
                <label htmlFor="evidence">Evidence</label>
                <input
                  type="file"
                  id="file"
                  name="file"
                  onChange={fileChangeHandler}
                />
              </div>
              <div>
                <Button
                  id="subFile"
                  color="gold"
                  size="2"
                  type="submit"
                  disabled={!fileValid}
                >
                  submit file
                </Button>
              </div>
            </form>
          </div>
        </Overlay>
      )}
    </>
  );
};

export default UploadFile;
