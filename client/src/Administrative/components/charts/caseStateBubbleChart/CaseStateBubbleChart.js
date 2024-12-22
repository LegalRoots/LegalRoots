import { useEffect, useState } from "react";
import { useFetch } from "../../../../shared/hooks/useFetch";
import BubbleChart from "../bubbleChart/BubbleChart";
import "./CaseStateBubbleChart.css";
import Select from "../../../../shared/components/FormElements/aydi/select/Select";

const REACT_APP_API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const CaseStateBubbleChart = () => {
  const [ratios, setRatios] = useState(null);
  const [dataValid, setDataValid] = useState(false);
  const [courtOptions, setCourtOptions] = useState([]);
  const [courtBranch, setCourtBranch] = useState("all");
  const [urlExtension, setUrlExtension] = useState(
    "chart/case/case-state/count"
  );

  const [data, isLoading] = useFetch(
    "GET",
    `${REACT_APP_API_BASE_URL}/${urlExtension}`
  );

  const [options, OptionsLoading] = useFetch(
    "GET",
    `${REACT_APP_API_BASE_URL}/admin/court-branch`
  );

  useEffect(() => {
    if (!OptionsLoading) {
      let ops = options.map((option) => option.name);
      let allOps = ["all"].concat(ops);
      setCourtOptions(allOps);
    }
  }, [options, OptionsLoading]);

  useEffect(() => {
    if (!isLoading) {
      let counts = {
        red: data.nonAssigned,
        white: data.active,
        black: data.closed,
      };
      setRatios(counts);
      setDataValid(true);
    }
  }, [data, isLoading]);

  const courtBranchChangeHandler = (event) => {
    setCourtBranch(event.target.value);

    if (event.target.value === "all") {
      setUrlExtension("chart/case/case-state/count");
      return;
    }
    //get the id
    const chosenCourt = options.find((option) => {
      return option.name === event.target.value;
    });
    setUrlExtension(`chart/case/case-state/count/${chosenCourt._id}`);
  };

  return (
    <div className="casesItems-container-bubblechart-wrapper">
      {dataValid && <BubbleChart ratios={ratios} />}
      <div>
        <Select
          label={"Court branch"}
          onChange={courtBranchChangeHandler}
          value={courtBranch}
          options={courtOptions}
        />
      </div>
    </div>
  );
};

export default CaseStateBubbleChart;
