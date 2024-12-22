import BarChart from "../barChart/BarChart";
import "./caseTypesBarChart.css";

const CHART_HEADERS = ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"];
const CHART_DATASET = [
  {
    label: "# of cases",
    data: [120, 19, 3, 5, 2, 3],
    borderWidth: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
  },
  {
    label: "# of people",
    data: [120, 19, 3, 5, 2, 3],
    borderWidth: 1,
  },
];

const CaseTypesBarChart = () => {
  return <BarChart headers={CHART_HEADERS} datasets={CHART_DATASET} />;
};

export default CaseTypesBarChart;
