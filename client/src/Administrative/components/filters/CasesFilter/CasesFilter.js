import "./CasesFilter.css";
import Overlay from "../../../../shared/components/aydi/overlay/Overlay";
import { useCallback, useState, useEffect } from "react";
import Input from "../../../../shared/components/FormElements/aydi/Input";
import Button from "../../../../shared/components/Button2/Button";
import Select from "../../../../shared/components/FormElements/aydi/select/Select";

const state_list = ["الكل", "ongoing", "closed", "non-assigned"];

const CasesFilter = ({
  applyFilterHandler,
  applySearchHandler,
  court_names,
  types_names,
  exportHandler,
}) => {
  const [filterState, setFilterState] = useState({
    court_branch: "",
    caseType: "",
    caseState: "",
    from: "",
    to: "",
  });

  const [showFilter, setShowFilter] = useState(false);
  const [idInputVal, setIdInputVal] = useState(false);

  const closeOverlayHandler = () => {
    setShowFilter(false);
  };
  const showOverlayHandler = () => {
    setShowFilter(true);
  };

  const applyHandler = () => {
    applyFilterHandler(filterState);
  };

  const inputHandler = useCallback((id, val, isValid) => {
    if (id === "date1") {
      setFilterState((pre) => {
        return { ...pre, from: new Date(val) };
      });
    } else if (id === "date2") {
      setFilterState((pre) => {
        return { ...pre, to: new Date(val) };
      });
    } else if (id === "caseId") {
      setIdInputVal(val);
    }
  }, []);

  const submitSearchHandler = () => {
    applySearchHandler(idInputVal);
  };

  const SelectHandler = (event) => {
    const id = event.target.id;
    let val = event.target.value;
    if (val === "الكل") {
      val = "";
    }

    if (id === "courtBranch") {
      setFilterState((pre) => {
        return { ...pre, court_branch: val };
      });
    } else if (id === "caseType") {
      setFilterState((pre) => {
        return { ...pre, caseType: val };
      });
    } else if (id === "caseState") {
      setFilterState((pre) => {
        return { ...pre, caseState: val };
      });
    }
  };

  return (
    <div className="casesItems-container-filter">
      {showFilter && (
        <Overlay
          closeOverlayHandler={closeOverlayHandler}
          id="casesFilterOverlay"
        >
          <div className="casesItems-container-filter-body">
            <Select
              label="Court Branch"
              placeholder="Court Branch"
              id="courtBranch"
              options={["الكل", ...court_names]}
              value={filterState.court_branch}
              onChange={SelectHandler}
            />
            <Select
              label="Case Type"
              placeholder="Case Type"
              id="caseType"
              options={["الكل", ...types_names]}
              value={filterState.caseType}
              onChange={SelectHandler}
            />
            <Select
              label="Case State"
              placeholder="Case State"
              id="caseState"
              options={[...state_list]}
              value={filterState.caseState}
              onChange={SelectHandler}
            />
            <Input
              label="from"
              id="date1"
              name="date1"
              onInput={inputHandler}
              type="date"
              className="filter-searchbar"
              errorMsg=""
            />
            <Input
              label="to"
              id="date2"
              name="date2"
              onInput={inputHandler}
              type="date"
              className="filter-searchbar"
              errorMsg=""
            />
            <Button
              id="caseFapply"
              size="2"
              color="black"
              type="button"
              onClick={applyHandler}
            >
              apply
            </Button>
          </div>
        </Overlay>
      )}
      <div className="casesItems-container-filter__searchbar">
        <Input
          //   label="Case Id"
          id="caseId"
          name="caseId"
          onInput={inputHandler}
          type="text"
          placeholder="insert a case id"
          className="filter-searchbar"
          errorMsg=""
        />
      </div>
      <div className="casesItems-container-filter__buttons">
        <Button
          id="caseFBtn"
          size="2"
          type="button"
          onClick={submitSearchHandler}
        >
          <i className="fa-solid fa-magnifying-glass"></i>
        </Button>
        <Button
          id="caseFBtn"
          size="2"
          type="button"
          onClick={showOverlayHandler}
        >
          <i className="fa-solid fa-filter"></i>
        </Button>

        <Button
          id="caseFExport"
          color="gold"
          size="1"
          type="button"
          onClick={exportHandler}
        >
          <i className="fa-solid fa-caret-up"></i> Export
        </Button>
      </div>
    </div>
  );
};

export default CasesFilter;
