import {
  CheckCircleOutlined,
  SyncOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import card_green from "../assets/Dashboard/card_green.png";
import card_orange from "../assets/Dashboard/card_orange.png";
import card_red from "../assets/Dashboard/card_red.png";
import card_purple from "../assets/Dashboard/card_purple.png";
import { message } from "antd";

const ToiletsCount = () => {
  const [assetData, setAssetData] = useState(null);
  const [totalRegistered, setTotalRegistered] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalMonitoring, setTotalMonitoring] = useState(0);

  const headers = {
    "Content-Type": "application/json",
    "x-api-key": "YunHu873jHds83hRujGJKd873",
    "x-api-version": "1.0.1",
    "x-platform": "Web",
    "x-access-token": localStorage.getItem("sessionToken") || "",
  };

  useEffect(() => {
    const fetchAssetData = async () => {
      try {
        const response = await fetch(
          "https://kumbhtsmonitoring.in/php-api/dashboard",
          {
            method: "POST",
            headers: headers,
          }
        );
        const result = await response.json();

        if (result.success && result.data) {
          setAssetData(result.data);

          // Calculate total quantity
          const totalAssetQuantity = result.data.asset_count.reduce(
            (sum, asset) => sum + (Number(asset.total_quantity) || 0),
            0
          );

          setTotalRegistered(result.data.assets.length || 0);
          setTotalQuantity(totalAssetQuantity || 0);
          setTotalMonitoring(0);
        } else {
          message.error("Failed to load details.");
        }
      } catch (error) {
        message.error("Error fetching details.");
      }
    };

    fetchAssetData();
  }, []);

  return (
    <div className="p-3 mx-auto bg-white rounded-xl space-y-4">
      <div className="text-xl font-bold mb-4">Sanitation Toilets Count</div>

      <div className="grid grid-cols-1 lg:grid-cols-1 md:grid-cols-2 sm:grid-cols-2 gap-4">
        {/* Total Asset Quantity Section */}
        <div className="relative p-3 border rounded-md shadow-md bg-blue-50">
          <div className="text-start">
            <div className="text-blue-600 font-semibold flex flex-col gap-2 items-start relative">
              <div className="flex items-center gap-2">
                <CheckCircleOutlined className="text-green absolute right-[5px]" />
                <span className="text-green-600">Total Toilets To Install</span>
              </div>
              <h2 className="text-2xl font-bold">{totalQuantity}</h2>
            </div>
          </div>
          <img
            src={card_green}
            alt="Resolved Icon"
            className="absolute bottom-0 right-0 h-full w-auto object-cover"
          />
        </div>

        {/* Asset Registered Section */}
        <div className="relative p-3 border rounded-md shadow-md bg-orange-50">
          <div className="text-start">
            <div className="text-blue-600 font-semibold flex flex-col gap-2 items-start relative">
              <div className="flex items-center gap-2">
                <SyncOutlined
                  className="text-orange-600 absolute right-[5px]"
                  spin
                />
                <span className="text-[#eab308]">Total Toilets Registered</span>
              </div>
              <h2 className="text-2xl font-bold">{totalRegistered}</h2>
            </div>
          </div>
          <img
            src={card_orange}
            alt="In Progress Icon"
            className="absolute bottom-0 right-0 h-full w-auto object-cover"
          />
        </div>

        {/* Asset Monitoring Section */}
        <div className="relative p-3 border rounded-md shadow-md bg-red-50">
          <div className="text-start">
            <div className="text-blue-600 font-semibold flex flex-col gap-2 items-start relative">
              <div className="flex items-center gap-2">
                <EyeOutlined className="text-violet-600 absolute right-[5px]" />{" "}
                <span className="text-[#db2777]">Under Monitoring</span>
              </div>
              <h2 className="text-2xl font-bold">{totalMonitoring}</h2>
            </div>
          </div>
          <img
            src={card_red}
            alt="Open Icon"
            className="absolute bottom-0 right-0 h-full w-auto object-cover"
          />
        </div>
        <div className="relative p-3 border rounded-md shadow-md bg-purple-50">
          <div className="text-start">
            <div className="text-blue-600 font-semibold flex flex-col gap-2 items-start relative">
              <div className="flex items-center gap-2">
                <ExclamationCircleOutlined className="text-violet-600 absolute right-[5px]" />
                <span className="text-purple-600">Off Monitoring</span>
              </div>
              <h2 className="text-2xl font-bold">{totalMonitoring}</h2>
            </div>
          </div>
          <img
            src={card_purple}
            alt="Open Icon"
            className="absolute bottom-0 right-0 h-full w-auto object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default ToiletsCount;
