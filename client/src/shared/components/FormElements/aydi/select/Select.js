import "./Select.css";

const Select = ({ id, label, value, options, placeholder, onChange }) => {
  return (
    <div className="custom-select">
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        onChange={onChange}
        value={value}
        className="custom-select"
      >
        {placeholder && (
          <option disabled value={placeholder.toLowerCase()}>
            {placeholder}
          </option>
        )}
        {options?.map((option, index) => (
          <option key={index} value={option.toLowerCase()}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
