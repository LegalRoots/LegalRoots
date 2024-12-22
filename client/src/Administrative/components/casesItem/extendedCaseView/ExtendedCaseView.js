import "./ExtendedCaseView.css";
import CaseView from "../caseView/CaseView";

const Item = ({ text, title }) => {
  return (
    <div className="caseview-container-item">
      {title && <p className="caseview-container-item__title">{title}</p>}
      <p className="caseview-container-item__text">{text}</p>
    </div>
  );
};

const withExtension = (InnerComponent) => {
  return function ExtendedComponent(props) {
    return (
      <div className="extended-caseview-container">
        <InnerComponent {...props} />
        {Object.keys(props.pickedCase.data).map((key) => {
          return (
            <Item text={props.pickedCase.data[key]} title={key} key={key} />
          );
        })}
        <Item text={props.pickedCase.caseType.name} title="plaintiff" />
      </div>
    );
  };
};

const ExtendedCaseView = withExtension(CaseView);

export default ExtendedCaseView;
