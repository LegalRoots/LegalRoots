import Button from "../../../../shared/components/Button2/Button";
import "./MyCourtsList.css";
const monthShortcuts = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const MyCourtsList = ({ courts, showDetailsHandler }) => {
  console.log(courts);
  return (
    <div className="court-cards-container">
      {courts.map((court, index) => (
        <div className="court-card court-card-minimized" key={index}>
          <div className="court-card-row">
            <div className="court-date">
              <span>{new Date(court.time).getDate()}</span>
              <span>{monthShortcuts[new Date(court.time).getMonth()]}</span>
              <span>{new Date(court.time).getFullYear()}</span>
            </div>
          </div>
          <div className="court-card-column">
            <span className="court-id">{court.caseId}</span>
            <span className="court-initiator">
              {`${court.initiator.first_name} ${court.initiator.second_name} ${court.initiator.third_name} ${court.initiator.last_name}`}
            </span>
            <p id={court._id} onClick={showDetailsHandler}>
              details
            </p>
          </div>
          <div className="court-card-row">
            <span className="court-time">
              {new Date(court.time).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyCourtsList;
