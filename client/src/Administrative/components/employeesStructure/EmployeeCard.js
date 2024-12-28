import { forwardRef, useEffect, useState } from "react";
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

const EmployeeCard = forwardRef(({ employees, id }, ref) => {
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
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    const tmp = employees.find((emp) => {
      return parseInt(emp.data.employee_id) === id;
    });
    setEmployee(tmp);
  }, [employees, id]);

  if (employee) {
    for (let key in employee.data) {
      if (map.has(key)) {
        if (key === "job") {
          sections.push(
            <Section
              key={key}
              title={map.get(key)}
              value={employee.data[key].title}
            />
          );
        } else {
          sections.push(
            <Section
              key={key}
              title={map.get(key)}
              value={employee.data[key]}
            />
          );
        }
      }
    }
  }

  return (
    <>
      {employee && (
        <div className="employees-card" ref={ref}>
          <div className="employees-card__image">
            <img src={`data:image/jpeg;base64,${employee.image}`} alt="sss" />
          </div>
          <div className="employees-card__data">{sections}</div>
        </div>
      )}
    </>
  );
});

export default EmployeeCard;
