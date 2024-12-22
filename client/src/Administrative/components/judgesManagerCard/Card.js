import "./Card.css";
import ph from "../../../shared/assets/dummy.jpg";
const Card = (props) => {
  return (
    <div className="judge-card">
      <div className="judge-card__image">
        <img src={ph} alt="personal p." />
      </div>
      <div className="judge-card__data">
        <h3>{props.name}</h3>
        <p>{props.job}</p>
      </div>
      <div className="judge-card__actions">
        {props.action !== "details" ? (
          <p id={props.id} onClick={props.actionHandler}>
            {props.action}
          </p>
        ) : (
          <p id={props.id}>details</p>
        )}
      </div>
    </div>
  );
};

export default Card;
