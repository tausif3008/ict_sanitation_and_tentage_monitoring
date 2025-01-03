import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";

const LineChartWithArea = () => {
  const [data, setData] = useState([
    {
      type: "Type 1",
      "Toilet With Septic Tank": 530,
      "Fully Functional": 520,
      "Cleanliness Index": 520,
      "Avg. Response Time": "1.30 hrs",
      "Incident Reported": 5,
    },
    {
      type: "Type 2",
      "Toilet With Septic Tank": 550,
      "Fully Functional": 550,
      "Cleanliness Index": 550,
      "Avg. Response Time": "1.30 hrs",
      "Incident Reported": 5,
    },
    {
      type: "Type 3",
      "Toilet With Septic Tank": 530,
      "Fully Functional": 520,
      "Cleanliness Index": 520,
      "Avg. Response Time": "1.30 hrs",
      "Incident Reported": 5,
    },
    {
      type: "Type 4",
      "Toilet With Septic Tank": 530,
      "Fully Functional": 520,
      "Cleanliness Index": 520,
      "Avg. Response Time": "1.30 hrs",
      "Incident Reported": 5,
    },
    {
      type: "Type 5",
      "Toilet With Septic Tank": 530,
      "Fully Functional": 520,
      "Cleanliness Index": 520,
      "Avg. Response Time": "1.30 hrs",
      "Incident Reported": 5,
    },
    {
      type: "Type 6",
      "Toilet With Septic Tank": 530,
      "Fully Functional": 520,
      "Cleanliness Index": 520,
      "Avg. Response Time": "1.30 hrs",
      "Incident Reported": 5,
    },
    {
      type: "Type 7",
      "Toilet With Septic Tank": 530,
      "Fully Functional": 520,
      "Cleanliness Index": 520,
      "Avg. Response Time": "1.30 hrs",
      "Incident Reported": 5,
    },
    {
      type: "Type 8",
      "Toilet With Septic Tank": 530,
      "Fully Functional": 520,
      "Cleanliness Index": 520,
      "Avg. Response Time": "1.30 hrs",
      "Incident Reported": 5,
    },
    {
      type: "Type 9",
      "Toilet With Septic Tank": 530,
      "Fully Functional": 520,
      "Cleanliness Index": 520,
      "Avg. Response Time": "1.30 hrs",
      "Incident Reported": 5,
    },
    {
      type: "Type 9",
      "Toilet With Septic Tank": 530,
      "Fully Functional": 520,
      "Cleanliness Index": 520,
      "Avg. Response Time": "1.30 hrs",
      "Incident Reported": 5,
    },
    {
      type: "Type 10",
      "Toilet With Septic Tank": 530,
      "Fully Functional": 520,
      "Cleanliness Index": 520,
      "Avg. Response Time": "1.30 hrs",
      "Incident Reported": 5,
    },
  ]);

  const chartData = {
    series: [
      {
        name: "Total",
        data: [
          54000, 53000, 55000, 52000, 54000, 50000, 53000, 52000, 53000, 52000,
        ], // Replace with your actual data
      },
      {
        name: "Operational",
        data: [
          52000, 49000, 52000, 49000, 52000, 48000, 50000, 50000, 49000, 46000,
        ], // Replace with your actual data
      },
    ],
    options: {
      chart: {
        type: "area",
        height: 350,
        animations: {
          enabled: false,
        },
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
        width: 2,
      },
      colors: ["#91caff", "#4096ff"], // Line colors, also applied to the fill automatically
      title: {
        text: "Sanitation",
        align: "left",
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
        // title: {
        //   text: "Facility Type",
        // },
      },
      markers: {
        size: 5,
        hover: {
          size: 9,
        },
      },
      yaxis: {
        // title: {
        //   text: "Number of Facilities",
        // },
        min: 45000,
      },
      tooltip: {
        // shared: false, // Disable shared tooltip
        y: {
          formatter: (val, opts) => {
            const dataPointIndex = opts.dataPointIndex;

            // Replace these values with actual data as needed
            const facilityDetails = data[dataPointIndex];

            return `
            <div style="border-radius: 5px; padding: 3px; width:200px ">
              <div>
                <div style="display: flex; justify-content: space-between; gap-2">
                  <span>Toilet with septic tank</span>
                  <span>${facilityDetails["Toilet With Septic Tank"]}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span>Fully Functional</span>
                  <span>${facilityDetails["Fully Functional"]}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span>Cleanliness Index</span>
                  <span>${facilityDetails["Cleanliness Index"]}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span>Avg. Response time</span>
                  <span style="">${facilityDetails["Avg. Response Time"]}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span>Incident reported</span>
                  <span>${facilityDetails["Incident Reported"]}</span>
                </div>
              </div>
            </div>`;
          },
        },
      },
      legend: {
        position: "top", // Legend position at the top
        horizontalAlign: "left", // Alig
      },
    },
  };

  return (
    <div className="rounded-md">
      <div className="pr-2 pt-2">
        <style>
          {`
          .apexcharts-tooltip-text-y-label {
            display: none !important;
          }
        `}
        </style>
        <ReactApexChart
          options={chartData.options}
          series={chartData.series}
          type="area"
          height={350}
          className="mt-[-5px]"
        />
      </div>
    </div>
  );
};

export default LineChartWithArea;
