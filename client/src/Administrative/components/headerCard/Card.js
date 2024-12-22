import "./Card.css";

const Card = ({ children, header }) => {
  return (
    <div className="admin-header-card">
      <header>
        <h1>{header}</h1>
      </header>
      <div className="admin-header-card-container">{children}</div>
    </div>
  );
};

export default Card;
