import "./Item.css";
import { Link } from "react-router-dom";
const Item = (props) => {
  return (
    <div className="shared-item-container">
      <Link to={props.link}>
        <i className={props.icon}></i>
        <p>{props.text}</p>
      </Link>
    </div>
  );
};

export default Item;
