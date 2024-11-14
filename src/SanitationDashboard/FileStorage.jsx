import { message, Select } from "antd";
import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import URLS from "../urils/URLS";

const FileStorage = ({ title, series, total, dropdownType }) => {
  const [dropdownValue, setDropdownValue] = useState("");
  const [selectedSector, setSelectedSector] = useState(null);
  const [sectorData, setSectorData] = useState([]);

  const chartOptions = {
    chart: {
      type: "donut",
    },
    labels: ["SLA", "Photo", "Video"],
    colors: ["#775DD0", "#00E396", "#FF4560"],

    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      pie: {
        donut: {
          size: "60%",
          labels: {
            show: true,
            total: {
              show: true,
              showAlways: true,
              label: "Total Incidents",
              fontSize: "16px",
              fontWeight: "bold",
              formatter: () => `${total}`,
            },
          },
        },
      },
    },
    legend: {
      show: false,
    },
  };

  const headers = {
    "Content-Type": "application/json",
    "x-api-key": "YunHu873jHds83hRujGJKd873",
    "x-api-version": "1.0.1",
    "x-platform": "Web",
    "x-access-token": localStorage.getItem("sessionToken") || "",
  };

  useEffect(() => {
    const fetchSectorData = async () => {
      try {
        const response = await fetch(
         `${URLS.baseUrl}/sector`,
          {
            method: "GET",
            headers: headers,
          }
        );
        const result = await response.json();

        if (result.success) {
          setSectorData(result.data.sectors);
        } else {
          message.error("Failed to load details.");
        }
      } catch (error) {
        message.error("Error fetching details.");
      }
    };
    fetchSectorData();
  }, []);

  const renderDropdown = () => {
    switch (dropdownType) {
      case "zone":
        return (
          <Select
            value={dropdownValue}
            onChange={(e) => setDropdownValue(e.target.value)}
          >
            <option value="">Select Zone</option>
            <option value="Zone 1">Zone 1</option>
            <option value="Zone 2">Zone 2</option>
            <option value="Zone 3">Zone 3</option>
          </Select>
        );
      case "sector":
        return (
          <Select
            value={selectedSector}
            onChange={(value) => setSelectedSector(value)}
            placeholder="Select Sector"
            style={{ width: "130px" }}
          >
            {sectorData.map((sector) => (
              <Select.Option key={sector.sector_id} value={sector.name}>
                {sector.name}
              </Select.Option>
            ))}
          </Select>
        );
      case "circle":
        return (
          <Select
            value={dropdownValue}
            onChange={(e) => setDropdownValue(e.target.value)}
          >
            <option value="">Select Circle</option>
            <option value="Circle 1">Circle 1</option>
            <option value="Circle 2">Circle 2</option>
            <option value="Circle 3">Circle 3</option>
          </Select>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative bg-white p-3 rounded-lg shadow-md">
      <div className="absolute top-2 right-2">{renderDropdown()}</div>

      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <Chart options={chartOptions} series={series} type="donut" height={300} />

      <div className="mt-4 flex justify-around">
        <div className="flex items-center">
          <div
            className="w-4 h-4 mr-2 rounded-full flex-none"
            style={{ backgroundColor: "#775DD0" }}
          ></div>
          <div>
            <div className="text-xs lg:text-sm font-semibold">High Priority</div>
          </div>
        </div>

        <div className="flex items-center">
          <div
            className="w-4 h-4 mr-2 rounded-full flex-none"
            style={{ backgroundColor: "#00E396" }}
          ></div>
          <div>
            <div className="text-xs lg:text-sm font-semibold">Med Priority</div>
          </div>
        </div>

        <div className="flex items-center">
          <div
            className="w-4 h-4 mr-2 rounded-full flex-none"
            style={{ backgroundColor: "#FF4560" }}
          ></div>
          <div>
            <div className="text-xs lg:text-sm font-semibold">Low Priority</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileStorage;
