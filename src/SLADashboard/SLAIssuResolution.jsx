import React, { useState } from "react";
import Chart from "react-apexcharts";

const SLAResolution = () => {
  const [chartOptions] = useState({
    chart: {
      type: "pie",
    },
    labels: ["Cleaned", "Under Maintenance", "Unresolved"],
    colors: ["#00E396", "#775DD0", "#FF4560"],
    dataLabels: {
      enabled: true,
      formatter: (val, opts) => {
        return `${Math.round(val)}%`;
      },
      style: {
        fontSize: "16px",
        fontWeight: "bold",
        colors: ["#fff"],
      },
      dropShadow: {
        enabled: true,
        top: 1,
        left: 1,
        blur: 2,
        opacity: 0.5,
      },
    },
    legend: {
      show: true,
      position: "bottom",
      labels: {
        colors: "#000",
        useSeriesColors: true,
      },
      markers: {
        width: 12,
        height: 12,
      },
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: function (val) {
          return `${val} tasks`;
        },
      },
    },
  });

  const [chartSeries] = useState([80, 22, 9]);

  return (
    <div className="p-4 rounded-lg w-full bg-white">
      <div className="text-xl font-bold mb-4">Total Number Of Toilets</div>
      <Chart
        options={chartOptions}
        series={chartSeries}
        type="pie"
        height={300}
      />
    </div>
  );
};

export default SLAResolution;
