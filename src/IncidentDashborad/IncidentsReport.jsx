import React from "react";
import { DatePicker, Progress } from "antd";
import moment from "moment";
import Chart from "react-apexcharts";
import processIcon from "./../assets/Dashboard/InprogressIcon.png";
import resolvedIcon from "./../assets/Dashboard/ResolvedIcon.png";
import openIcon from "./../assets/Dashboard/OpenIcon.png";

const IncidentsReport = () => {
  const totalIncidents = 468;
  const percentageChange = 4.2;
  const resolved = 300;
  const inProgress = 68;
  const open = 100;

  const chartOptions = {
    chart: {
      type: "pie",
    },
    labels: ["Resolved", "Inprogress", "Open"],
    colors: ["#00E396", "#008FFB", "#FEB019"],
    legend: {
      position: "bottom",
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return val.toFixed(1) + "%"; // Display percentage with 1 decimal place
      },
      style: {
        colors: ["#000"],
      },
      dropShadow: {
        enabled: false,
      },
    },
    plotOptions: {
      pie: {
        dataLabels: {
          offset: -12, // Adjust this to move the labels closer or further from the center
        },
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 300,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };
  const chartSeries = [resolved, inProgress, open];

  return (
    <div className="p-4  mx-auto bg-white rounded-xl shadow-md space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Incidents Report</h3>
        <DatePicker defaultValue={moment()}></DatePicker>
      </div>
      <div className="flex flex-col sm:flex-row justify-between">
        <div>
          <div className="flex items-center mt-4">
            <h1 className="text-5xl font-bold">{totalIncidents}</h1>
            <div className="ml-3 text-green-500 text-sm font-semibold">
              +{percentageChange}%
            </div>
          </div>
          <p className="text-gray-600">Total number of incidents</p>
        </div>
        {/* Pie chart */}
        <div className="flex justify-center">
          <Chart
            options={chartOptions}
            series={chartSeries}
            type="pie"
            width="270"
          />
        </div>
      </div>

      {/* Stats section */}
      <div className="grid grid-cols-3 gap-3 p-2 justify-around mt-6 border rounded-md">
        <div className="text-start">
          <div className="text-green-600 font-semibold flex gap-1">
            <img src={resolvedIcon} alt="" className="h-5 w-5" />
            <span>Resolved</span>
          </div>
          <h2 className="text-2xl font-bold">{resolved}</h2>
          <Progress
            percent={30}
            showInfo={false}
            size="small"
            strokeColor="green" // Custom color for the progress bar
          />
        </div>
        <div className="text-start">
          <div className="text-green-600 font-semibold flex gap-1">
            <img src={processIcon} alt="" className="h-5 w-5" />
            <span>Inprocess</span>
          </div>{" "}
          <h2 className="text-2xl font-bold">{inProgress}</h2>
          <Progress percent={50} size="small" showInfo={false} />
        </div>
        <div className="text-start">
          <div className="text-green-600 font-semibold flex gap-1">
            <img src={openIcon} alt="" className="h-5 w-5" />
            <span>Open</span>
          </div>{" "}
          <h2 className="text-2xl font-bold">{open}</h2>
          <Progress
            percent={30}
            size="small"
            strokeColor="red"
            showInfo={false}
          />
        </div>
      </div>
    </div>
  );
};

export default IncidentsReport;
