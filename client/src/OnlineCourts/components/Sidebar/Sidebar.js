import { useRef } from "react";
import "./Sidebar.css";

const Sidebar = () => {
  const activeRef = useRef();
  const optionsRef = useRef([]);

  const manageActiveHandler = (event) => {
    const positions = [0, 56, 112, 168, 224];
    const index = parseInt(event.currentTarget.id.slice(-1)) - 1;
    if (activeRef.current) {
      activeRef.current.style = `top: ${positions[index]}px`;

      optionsRef.current.forEach((option, i) => {
        if (option) {
          if (index === i) {
            setTimeout(() => {
              option.style = "color: white";
            }, 200);
          } else {
            setTimeout(() => {
              option.style = "color: #b4bac4";
            }, 200);
          }
        }
      });
    }
    console.log(index);
  };

  return (
    <div className="onlinecourt-sidebar">
      <div className="onlinecourt-sidebar-upper">
        <div className="onlinecourt-sidebar-upper-container">
          <div>
            <i className="fa-solid fa-scale-balanced"></i>
          </div>
          <div>
            <i className="fa-solid fa-bell"></i>
          </div>
          <div>
            <i className="fa-solid fa-gear"></i>
          </div>
        </div>
      </div>
      <div className="onlinecourt-sidebar-lower">
        <div
          onClick={manageActiveHandler}
          id="option1"
          ref={(el) => (optionsRef.current[0] = el)}
        >
          <i className="fa-solid fa-user"></i>
        </div>
        <div
          onClick={manageActiveHandler}
          id="option2"
          ref={(el) => (optionsRef.current[1] = el)}
        >
          <i className="fa-solid fa-message"></i>
        </div>
        <div
          onClick={manageActiveHandler}
          id="option3"
          ref={(el) => (optionsRef.current[2] = el)}
        >
          <i className="fa-solid fa-video"></i>
        </div>
        <div
          onClick={manageActiveHandler}
          id="option4"
          ref={(el) => (optionsRef.current[3] = el)}
        >
          <i className="fa-solid fa-arrow-up-right-from-square"></i>
        </div>
        <div
          onClick={manageActiveHandler}
          id="option5"
          ref={(el) => (optionsRef.current[4] = el)}
        >
          <i className="fa-solid fa-hard-drive"></i>
        </div>
        <div
          className="onlinecourt-sidebar-lower__active"
          ref={activeRef}
        ></div>
      </div>
      <div className="onlinecourt-sidebar-dummy"></div>
    </div>
  );
};

export default Sidebar;
