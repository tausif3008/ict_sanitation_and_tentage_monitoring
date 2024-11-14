
import React, { useEffect, useState } from "react";
import card_green from "../assets/Dashboard/card_green.png";
import card_orange from "../assets/Dashboard/card_orange.png";
import card_red from "../assets/Dashboard/card_red.png";
import card_purple from "../assets/Dashboard/card_purple.png";
import { message } from "antd";

const Counts = () => {
  const [totalAssets, setTotalAssets] = useState(0);
  const [registeredAssets, setRegisteredAssets] = useState(0);
  const [assetsUnderMonitoring, setAssetsUnderMonitoring] = useState(0);
  const [assetsOffMonitoring, setAssetsOffMonitoring] = useState(0);

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
          `${URLS.baseUrl}/dashboard/sanitation`,
          {
            method: "POST",
            headers: headers,
          }
        );
        const result = await response.json();

        if (result.success && result.data) {
          const { total, registered, under_monitoring, off_monitoring } =
            result.data.asset_counts;

          setTotalAssets(total || 0);
          setRegisteredAssets(registered || 0);
          setAssetsUnderMonitoring(under_monitoring || 0);
          setAssetsOffMonitoring(off_monitoring || 0);
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div className="relative p-3 border rounded-md shadow-md bg-blue-50">
          <div className="text-start">
            <div className="text-blue-600 font-semibold flex flex-col gap-2 items-start relative">
              <div className="flex items-center gap-2">
                <span className="text-green-600">
                  Number Of Toilets Cesspool Not Done In 24 hrs
                </span>
              </div>
              <h2 className="text-2xl font-bold">{255}</h2>
            </div>
          </div>
          <img
            src={card_green}
            alt="Total Toilets Icon"
            className="absolute bottom-0 right-0 h-full w-auto object-cover"
          />
        </div>

        <div className="relative p-3 border rounded-md shadow-md bg-orange-50">
          <div className="text-start">
            <div className="text-blue-600 font-semibold flex flex-col gap-2 items-start relative">
              <div className="flex items-center gap-2">
                <span className="text-[#eab308]">
                  Number Of Toilets JetSpray Not Deployed
                </span>
              </div>
              <h2 className="text-2xl font-bold">{100}</h2>
            </div>
          </div>
          <img
            src={card_orange}
            alt="Registered Toilets Icon"
            className="absolute bottom-0 right-0 h-full w-auto object-cover"
          />
        </div>

        <div className="relative p-3 border rounded-md shadow-md bg-red-50">
          <div className="text-start">
            <div className="text-blue-600 font-semibold flex flex-col gap-2 items-start relative">
              <div className="flex items-center gap-2">
                <span className="text-[#db2777]">
                  Number Of Toilets Manpower Not Deployed
                </span>
              </div>
              <h2 className="text-2xl font-bold">{300}</h2>
            </div>
          </div>
          <img
            src={card_red}
            alt="Under Monitoring Icon"
            className="absolute bottom-0 right-0 h-full w-auto object-cover"
          />
        </div>

        <div className="relative p-3 border rounded-md shadow-md bg-purple-50">
          <div className="text-start">
            <div className="text-blue-600 font-semibold flex flex-col gap-2 items-start relative">
              <div className="flex items-center gap-2">
                <span className="text-purple-600">
                  Number Of Toilets Order Free
                </span>
              </div>
              <h2 className="text-2xl font-bold">{400}</h2>
            </div>
          </div>
          <img
            src={card_purple}
            alt="Off Monitoring Icon"
            className="absolute bottom-0 right-0 h-full w-auto object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Counts;
