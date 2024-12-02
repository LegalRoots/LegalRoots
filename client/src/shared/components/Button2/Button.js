import "./Button.css";

const Button = ({ children, color, size, onClick, type, id, disabled }) => {
  return (
    <button
      className={`custom-button custom-button-${size} custom-button-${color}`}
      onClick={onClick}
      type={type}
      id={id}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
