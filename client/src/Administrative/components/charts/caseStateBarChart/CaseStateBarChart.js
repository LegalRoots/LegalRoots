import { useEffect, useState } from "react";
import { useFetch } from "../../../../shared/hooks/useFetch";
import BarChart from "../barChart/BarChart";

const CHART_HEADERS = ["Closed Cases", "Ongoing", "Non-Assigned"];
const CHART_DATASET = [
  {
    label: "# of cases",
    data: [0, 0, 0],
    borderWidth: 1,
    backgroundColor: [
      "rgba(0,0,0,0.8)",
      "rgba(200,200,200,0.5)",
      "rgba(255,0,0,0.7)",
    ],
  },
];

const REACT_APP_API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const CaseStateBarChart = () => {
  const [dataset, setDataset] = useState(CHART_DATASET);
  const [dataValid, setDataValid] = useState(false);

  const [data, isLoading] = useFetch(
    "GET",
    `${REACT_APP_API_BASE_URL}/chart/case/case-state/count`
  );

  useEffect(() => {
    if (!isLoading) {
      let counts = [data.closed, data.active, data.nonAssigned];

      setDataset((prev) => {
        let f = prev;
        f[0].data = counts;
        return f;
      });

      setDataValid(true);
    }
  }, [data, isLoading]);

  return (
    <>{dataValid && <BarChart headers={CHART_HEADERS} datasets={dataset} />}</>
  );
};

export default CaseStateBarChart;
