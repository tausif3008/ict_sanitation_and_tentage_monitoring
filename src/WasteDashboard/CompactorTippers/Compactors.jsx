import React from "react";
import ReactApexChart from "react-apexcharts";

const Compactors = () => {
  const options = {
    chart: {
      type: "radialBar",
      offsetY: -20,
      sparkline: {
        enabled: true,
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        track: {
          background: "#F0F0F0", // Color of the non-remaining 22%
          strokeWidth: "97%",
          margin: 5, // margin is in pixels
          dropShadow: {
            enabled: true,
            top: 2,
            left: 0,
            color: "#F0F0F0	",
            opacity: 1,
            blur: 4,
          },
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            offsetY: -2,
            fontSize: "22px",
          },
        },
      },
    },
    grid: {
      padding: {
        top: -10,
      },
    },
    fill: {
      colors: ["#ff9900"], // Set the color of the radial bar to orange
    },
    labels: ["Average Results"],
  };

  const series = [90]; // Percentage value for the radial bar

  return (
    <div className="border flex justify-center text-start p-2 flex-col w-full">
      <div className=" font-semibold -mt-0">40</div>
      <div className="text-lg">Compactors</div>
      <ReactApexChart
        options={options}
        series={series}
        type="radialBar"
        height={160}
      />
      <div className="text-sm text-gray-400  -mt-2 text-center">
        40 Compactors are fully functional
      </div>
    </div>
  );
};

export default Compactors;
