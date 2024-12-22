import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import "./BarChart.css";

const BarChart = ({ headers, datasets }) => {
  const canRef = useRef(null);

  useEffect(() => {
    if (canRef.current) {
      new Chart(canRef.current, {
        type: "bar",
        data: {
          labels: headers,
          datasets: datasets,
        },
        options: {
          animation: true,
          plugins: {
            tooltip: { enabled: false },
            legend: {
              display: false, // This hides the legend
            },
          },
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }
  }, [headers, datasets]);
  return (
    <div className="barchart-container">
      <canvas ref={canRef} id="myChart"></canvas>
    </div>
  );
};

export default BarChart;
