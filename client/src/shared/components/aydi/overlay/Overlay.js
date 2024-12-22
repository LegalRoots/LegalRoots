import ReactDom from "react-dom";

import "./Overlay.css";

const Overlay = ({ children, closeOverlayHandler, id }) => {
  const propagationHandler = (event) => {
    event.stopPropagation();
  };

  let content = (
    <div onClick={closeOverlayHandler} className="aydi-custom-overlay" id={id}>
      <div onClick={propagationHandler}>{children}</div>
    </div>
  );
  return ReactDom.createPortal(content, document.getElementById("overlays"));
};

export default Overlay;
