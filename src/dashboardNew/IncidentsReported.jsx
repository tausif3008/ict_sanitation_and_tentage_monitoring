// import React from "react";
// import DashboardTitle from "./DashboardTitle";
// import ReactApexChart from "react-apexcharts";

// const IncidentsReported = () => {
//   const chartOptions = {
//     chart: {
//       type: "donut",
//     },
//     labels: ["A", "B", "C", "D"],
//     legend: {
//       show: false, // Hide the legend
//     },

//     responsive: [
//       {
//         breakpoint: 480,
//         options: {
//           legend: {
//             position: "bottom",
//           },
//         },
//       },
//     ],
//     plotOptions: {
//       pie: {
//         donut: {
//           // size: "60%", // Adjust this size to control the space for text
//         },
//       },
//     },

//     colors: ["#4CD78E", "#6FD9A6", "#92E3BF", "#B6EAD8"], // Lighter shades of #28C76F
//     dataLabels: {
//       enabled: true,
//       formatter: function (val, opts) {
//         if (opts.seriesIndex === 0) {
//           return "";
//         }
//         return "";
//       },
//       style: {
//         fontSize: "16px",
//         fontWeight: "bold",
//         colors: ["#000"],
//       },
//       dropShadow: {
//         enabled: false,
//       },
//     },
//   };

//   const chartSeries = [40, 20, 25, 15];

//   return (
//     <div className="pie-chart flex flex-col h-full w-full rounded-md">
//       <DashboardTitle title="Incidents Reported" />
//       <div className="flex justify-center items-center w-full">
//         <ReactApexChart
//           options={chartOptions}
//           series={chartSeries}
//           type="donut"
//           height={290}
//           width={280}
//         />
//       </div>
//       <div className="flex justify-center items-center text-center font-semibold p-2 mt-auto">
//         Number of sanitation related incidents reported in last 24hrs
//       </div>
//     </div>
//   );
// };

// export default IncidentsReported;
import React, { useState } from "react";
import Chart from "react-apexcharts";

const IncidentsReported = () => {
  // Chart options for pie chart
  const [chartOptions] = useState({
    chart: {
      type: "pie",
    },
    labels: ["Completed", "Pending", "Overdue"],
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

  const [chartSeries] = useState([80, 11, 9]); // Assuming these are percentages
  const totalIssues = 100; // Total issues reported
  const pendingIssues = 11; // Pending issues
  const unresolved24to48 = 9; // Unresolved issues within 24-48 hours

  return (
    <div className="p-4 rounded-lg w-full bg-white">
      <div className="text-xl font-bold mb-4">Types Of Toilets</div>

      {/* Card Section */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        {/* Card for Total Issues Reported */}
        <div className="p-4 rounded-lg shadow-md bg-blue-500 text-white text-center">
        <p>Type 1</p>
          <div className="text-2xl font-bold">{12000}</div>
          <div className="text-lg">FRP with Septic Tank</div>
         
        </div>

        {/* Card for Pending Issues */}
        <div className="p-4 rounded-lg shadow-md bg-blue-500 text-white text-center">
          <p>Type 2</p>
          <div className="text-2xl font-bold">{17000}</div>
          <div className="text-lg">FRP with Soak pit</div>
        </div>

        {/* Card for Unresolved Issues 24-48 hrs */}
        <div className="p-4 rounded-lg shadow-md bg-blue-500 text-white text-center">
          <p>Type 3</p>
          <div className="text-2xl font-bold">{20000}</div>
          <div className="text-lg">FRP Urinals With Septic Tank/Soak pit</div>
        </div>
        <div className="p-4 rounded-lg shadow-md bg-blue-500 text-white text-center">
          <p>Type 4</p>
          <div className="text-2xl font-bold">{9000}</div>
          <div className="text-lg">PreFabricated Steel Toilet With Septic Tank</div>
        </div>
        <div className="p-4 rounded-lg shadow-md bg-blue-500 text-white text-center">
          <p>Type 5</p>
          <div className="text-2xl font-bold">{23000}</div>
          <div className="text-lg">PreFabricated Steel Toilet With Soak pit</div>
        </div>
        <div className="p-4 rounded-lg shadow-md bg-blue-500 text-white text-center">
          <p>Type 6</p>
          <div className="text-2xl font-bold">{49000}</div>
          <div className="text-lg">Tentage/Kanath Toilet With Soak pit</div>
        </div>
        <div className="p-4 rounded-lg shadow-md bg-blue-500 text-white text-center">
          <p>Type 7</p>
          <div className="text-2xl font-bold">{1000}</div>
          <div className="text-lg">Tin Toilet With Soak pit</div>
        </div>
        <div className="p-4 rounded-lg shadow-md bg-blue-500 text-white text-center">
          <p>Type 8</p>
          <div className="text-2xl font-bold">{10000}</div>
          <div className="text-lg">Government Cementic Toilets</div>
        </div>
        <div className="p-4 rounded-lg shadow-md bg-blue-500 text-white text-center">
          <p>Type 9</p>
          <div className="text-2xl font-bold">{3500}</div>
          <div className="text-lg">Vehicle Mounted Mobile Toilet</div>
        </div>
        <div className="p-4 rounded-lg shadow-md bg-blue-500 text-white text-center">
          <p>Type 10</p>
          <div className="text-2xl font-bold">{5000}</div>
          <div className="text-lg">Special Toilets</div>
        </div>
      </div>

      {/* Pie Chart */}
    </div>
  );
};

export default IncidentsReported;
