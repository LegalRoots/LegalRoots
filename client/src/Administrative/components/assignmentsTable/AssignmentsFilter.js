import Overlay from "../../../shared/components/aydi/overlay/Overlay";
import { useCallback, useState, useEffect } from "react";
import Input from "../../../shared/components/FormElements/aydi/Input";
import Button from "../../../shared/components/Button2/Button";
import Select from "../../../shared/components/FormElements/aydi/select/Select";
import "./AssignmentsFilter.css";

const AssigmentsFilter = ({ filterAssignments }) => {
  const [idInputVal, setIdInputVal] = useState(false);
  const [searchBy, setSearchBy] = useState("employee id");

  const inputHandler = useCallback((id, val, isValid) => {
    setIdInputVal(val);
  }, []);
  const SelectHandler = (e) => {
    const { value } = e.currentTarget;
    setSearchBy(value);
  };

  useEffect(() => {
    filterAssignments(searchBy, idInputVal);
  }, [searchBy, idInputVal]);

  return (
    <div className="assigns-filter">
      <div className="judges-container-filter__searchbar">
        <Select
          placeholder="search by"
          id="searchBy"
          options={["employee id", "case id"]}
          value={searchBy}
          onChange={SelectHandler}
        />
        <Input
          id="searchData"
          name="searchData"
          onInput={inputHandler}
          type="text"
          placeholder="type text to search"
          className="filter-searchbar"
        />
      </div>
    </div>
  );
};

export default AssigmentsFilter;
