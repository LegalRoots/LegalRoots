import { forwardRef } from "react";
import "./EmployeeCard.css";

const Section = (props) => {
  return (
    <div className="employees-section">
      <div className="employees-section__title">
        <p>{props.title}</p>
      </div>
      <div className="employees-section__value">
        <p>{props.value}</p>
      </div>
    </div>
  );
};

const EmployeeCard = forwardRef((props, ref) => {
  const map = new Map([
    ["ssid", "SSID"],
    ["employee_id", "Employee ID"],
    ["full_name", "Name"],
    ["job", "Job"],
    ["gender", "Gender"],
    ["birthdate", "Birthdate"],
    ["email", "Email"],
    ["phone", "Phone number"],
  ]);
  let sections = [];
  for (let key in props.employee.data) {
    if (map.has(key)) {
      sections.push(
        <Section
          key={key}
          title={map.get(key)}
          value={props.employee.data[key]}
        />
      );
    }
  }

  return (
    <div className="employees-card" ref={ref}>
      <div className="employees-card__image">
        {props.employee && (
          <img
            src={`data:image/jpeg;base64,${props.employee.image}`}
            alt="sss"
          />
        )}
      </div>
      <div className="employees-card__data">{sections}</div>
    </div>
  );
});

export default EmployeeCard;
