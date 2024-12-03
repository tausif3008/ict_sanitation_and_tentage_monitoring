import React from "react";
import Chart from "react-apexcharts";

const TotalDocuments = () => {
  const totalDocuments = 70000;
  const categories = [
    { name: "Email", count: 25000, color: "#FF5733" },
    { name: "Photo", count: 30000, color: "#FFC300" },
    { name: "Video", count: 15000, color: "#DAF7A6" },
  ];

  const chartOptions = {
    chart: {
      type: "bar",
      height: 250,
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: "50%", // Lower this percentage to reduce the bar height, try '30%', '20%', etc.
        shape: "rounded",
      },
    },
    colors: categories.map((cat) => cat.color),
    dataLabels: {
      enabled: true,

      formatter: (val, opts) => {
        const label = opts.w.globals.labels[opts.dataPointIndex];
        return `${label}`;
      },
      style: {
        fontSize: "12px",
        colors: ["#fff"], // White text on the bars
      },
    },
    yaxis: {
      labels: {
        show: false, // Hide y-axis labels if you don't want them
      },
    },
    xaxis: {
      categories: categories.map((cat) => cat.name),
    },
  };

  const chartSeries = [
    {
      name: "Documents",
      data: categories.map((cat) => cat.count),
    },
  ];

  return (
    <div className="bg-gray-100 flex flex-col items-center w-full">
      <div className="w-full bg-white rounded-lg p-3">
        <div className="flex justify-between items-center mt">
          <div>
            <h2 className="text-xl font-bold text-[#4B465C]">
              Total Documents
            </h2>
          </div>
        </div>

        <hr className="mt-0 border-dashed" />
        <div className="flex flex-col md:flex-row gap-2 w-full ">
          <div className="flex flex-col  text-[#4B465C]">
            <div className="flex flex-col gap-2">
              <span className="text-lg font-semibold">
                {totalDocuments.toLocaleString()}
              </span>{" "}
              <span className="text-sm">Total Documents</span>
            </div>
            <div className="h-3"></div>
            <div className="flex md:hidden md:flex-row gap-3">
              {categories.map((category, index) => (
                <div key={index} className="flex items-center">
                  <div
                    className="w-8 h-8 mr-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <div>
                    <div className="">{category.name}</div>
                    <div className="">{category.count.toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex-col hidden md:flex gap-3">
              {categories.map((category, index) => (
                <div key={index} className="flex items-center">
                  <div
                    className="w-8 h-8 mr-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <div>
                    <div className="">{category.name}</div>
                    <div className="">{category.count.toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full">
            <div className="w-full">
              <h3 className="text-lg font-semibold">Recent Document</h3>
              <span className="text-sm">
                Recently uploaded or modified documents in last week
              </span>
            </div>
            <Chart
              options={chartOptions}
              series={chartSeries}
              type="bar"
              height={200}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TotalDocuments;
