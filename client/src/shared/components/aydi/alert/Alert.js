import Overlay from "../overlay/Overlay";
import Button from "../../Button2/Button";
import "./Alert.css";

const Alert = ({ closeAlertHandler, title, children }) => {
  return (
    <Overlay closeOverlayHandler={closeAlertHandler}>
      <div className="aydi-custom-alert-wrapper">
        <div className="aydi-custom-alert">
          <header>
            <h2>{title}</h2>
          </header>
          <div className="aydi-custom-alert-body">
            <p>{children}</p>
          </div>
          <div className="aydi-custom-alert-buttons">
            <Button
              color="black"
              size="1"
              type="button"
              onClick={closeAlertHandler}
            >
              close
            </Button>
          </div>
        </div>
      </div>
    </Overlay>
  );
};

export default Alert;
