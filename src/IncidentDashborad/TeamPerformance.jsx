import React from "react";
import ReactApexChart from "react-apexcharts";
import DashboardTitle from "./DashboardTitle";
import { DatePicker, Select } from "antd";

const ResponseTimeChart = () => {
  const options = {
    chart: {
      type: "bar",
      height: "100%",
      stacked: true, // Enable stacking
      toolbar: {
        show: true, // Hide toolbar if not needed
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        endingShape: "rounded",
        columnWidth: "30%", // Adjust the width of the bars
        dataLabels: {
          position: "top",
        },

        borderRadius: 4, // Rounded corners for bars
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: [
        "Type 1",
        "Type 2",
        "Type 3",
        "Type 4",
        "Type 5",
        "Type 6",
        "Type 7",
        "Type 8",
        "Type 9",
        "Type 10",
      ],
    },
    yaxis: {
      title: {
        text: "Time (Mins)",
      },
    },
    fill: {
      opacity: 1,
    },
    colors: ["#ff4560", "#3f8f29"], // Colors for the series
    stroke: {
      show: true,
      colors: ["#e0e0e0"], // Gray shadow color
      width: 0, // Width of the shadow
    },
    grid: {
      show: true, // Hide grid lines if not needed
    },
  };

  const series = [
    {
      name: "Assigned Time",
      data: [30, 40, 45, 50, 49, 60, 70, 50, 20, 70], // Replace with actual data for Assigned Time
    },
    {
      name: "Overdue Time",
      data: [0, 0, 0, 10, 0, 4, 10, 0, 0, 10], // Replace with actual data for Overdue Time
    },
  ];
  return (
    <div className="w-full p-2 rounded-md">
      <div className="flex justify-between flex-wrap">
        <DashboardTitle title="Team Performance"></DashboardTitle>
        <div className="flex gap-3 ">
          <div>
            <DatePicker></DatePicker>
          </div>
        </div>
      </div>
      <Select
        placeholder="Select Sector"
        className="rounded-none"
        defaultValue={"Sector 1"}
      >
        <Select.Option value="Sector 1">Sector 1</Select.Option>
      </Select>

      <ReactApexChart
        options={options}
        series={series}
        type="bar"
        height={300}
      />
    </div>
  );
};

export default ResponseTimeChart;
