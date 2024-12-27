import Overlay from "../../../../shared/components/aydi/overlay/Overlay";
import { useCallback, useState, useEffect } from "react";
import Input from "../../../../shared/components/FormElements/aydi/Input";
import Button from "../../../../shared/components/Button2/Button";
import Select from "../../../../shared/components/FormElements/aydi/select/Select";

import "./JudgesFilter.css";

const JudgesFilter = ({
  applyFilterHandler,
  applySearchHandler,
  court_names,
  exportHandler,
}) => {
  const [filterState, setFilterState] = useState({
    court_branch: "",
  });

  const [showFilter, setShowFilter] = useState(false);
  const [idInputVal, setIdInputVal] = useState(false);
  const [searchBy, setSearchBy] = useState("");

  const closeOverlayHandler = () => {
    setShowFilter(false);
  };
  const showOverlayHandler = () => {
    setShowFilter(true);
  };

  const applyHandler = () => {
    applyFilterHandler(filterState.court_branch);
  };

  const inputHandler = useCallback((id, val, isValid) => {
    if (id === "searchData") {
      setIdInputVal(val);
    }
  }, []);

  const submitSearchHandler = () => {
    applySearchHandler(idInputVal, searchBy);
  };

  const SelectHandler = (event) => {
    const id = event.target.id;
    let val = event.target.value;

    if (id === "courtBranch") {
      if (val === "الكل") {
        val = "";
      }

      setSearchBy(val);
      setFilterState((pre) => {
        return { ...pre, court_branch: val };
      });
    } else if (id === "searchBy") {
      setSearchBy(val);
    }
  };

  useEffect(() => {
    applySearchHandler(idInputVal, searchBy);
  }, [idInputVal, searchBy]);

  return (
    <div className="judges-container-filter">
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
      <div className="judges-container-filter__searchbar">
        <Select
          placeholder="search by"
          id="searchBy"
          options={["ssid", "judge id", "name"]}
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

export default JudgesFilter;
