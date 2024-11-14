import React, { useState, useEffect } from "react";
import { DatePicker, Select, message, Tooltip, Button } from "antd";
import lines from "../assets/Dashboard/lines.png";
import URLS from "../urils/URLS";

const Details = () => {
 
  const [assetData, setAssetData] = useState([]);
  const [showAll, setShowAll] = useState(false);

  const toiletData = assetData?.asset_types;

  const headers = {
    "Content-Type": "application/json",
    "x-api-key": "YunHu873jHds83hRujGJKd873",
    "x-api-version": "1.0.1",
    "x-platform": "Web",
    "x-access-token": localStorage.getItem("sessionToken") || "",
  };

  const fetchAssetData = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await fetch(`${URLS.baseUrl}/dashboard/sanitation`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          vendor_id: userId,
        }),
      });
      const result = await response.json();
      if (result.success) {
        setAssetData(result.data);
      } else {
        message.error("Failed to load asset details.");
      }
    } catch (error) {
      message.error("Error fetching asset details.");
    }
  };

  useEffect(() => {
    fetchAssetData();
  }, []);

  const priorityToiletTypes = [
    "Type-1 FRP Septic Tank",
    "Type-2 FRP Soak Pit",
    "Type-3 FRP Urinals",
    "Type-4 Prefab Steel Septic Tank",
    "Type-5 Prefab Steel Soak Pit",
  ];

  const priorityToilets = toiletData?.filter((item) =>
    priorityToiletTypes.includes(item.type)
  );

  const otherToilets = toiletData?.filter(
    (item) => !priorityToiletTypes.includes(item.type)
  );

  const combinedToilets = [...(priorityToilets || []), ...(otherToilets || [])];

  const displayedToilets = showAll
    ? combinedToilets
    : combinedToilets.slice(0, 5);

  return (
    <div className="p-4 bg-white rounded-xl space-y-4">
      <div className="text-xl font-bold">Sanitation Toilet Details</div>

      <div className="flex justify-start items-center space-x-6 mb-1">
        <div className="flex items-center mb-4 mr-6">
          <div className="flex items-center mr-6">
            <div className="h-3 w-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm">Clean</span>
          </div>
          <div className="flex items-center mr-6">
            <div className="h-3 w-3 bg-red-500 rounded-full mr-2"></div>
            <span className="text-sm">Unclean</span>
          </div>
        </div>
      </div>
      <div
        className={`grid ${
          showAll
            ? "grid-cols-2 sm:grid-cols-2 md:grid-cols-4"
            : "sm:grid-cols-2 xl:grid-cols-3 md:grid-cols-3"
        } gap-2 sm:gap-3 md:gap-4 lg:gap-4`}
      >
        {displayedToilets.length > 0 ? (
          displayedToilets.map((item, index) => (
            <Tooltip
              key={index}
              title={
                <div>
                  <strong>{item.name}</strong>
                  <div>Total Quantity: {item.total}</div>
                  <div>Registered Quantity: {item.registered}</div>
                </div>
              }
              placement="top"
              arrowPointAtCenter
            >
              <div
                className={`relative p-3 border rounded-md shadow-md flex flex-col justify-between bg-gray-50 ${
                  showAll ? "" : "h-40"
                }`}
                style={{
                  minHeight: "100px",
                }}
              >
                <div className="text-start flex-1">
                  <div className="text-sm text-gray-500 font-bold">
                    {item.name}
                  </div>
                </div>
                <div className="absolute bottom-4 left-3 right-3 flex justify-between">
                  <div className="flex items-center">
                    <div className="h-3 w-3 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm font-semibold">{item.clean}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="h-3 w-3 bg-red-500 rounded-full mr-2"></div>
                    <span className="text-sm font-semibold">
                      {item.unclean}
                    </span>
                  </div>
                </div>
                <img
                  src={lines}
                  alt="Card Icon"
                  className="absolute bottom-0 right-0 h-full w-auto"
                />
              </div>
            </Tooltip>
          ))
        ) : (
          <div className="col-span-full flex justify-center items-center h-32">
            No data available
          </div>
        )}
      </div>

      {!showAll ? (
        <Button
          size="medium"
          type="primary"
          onClick={() => setShowAll(true)}
          className="w-32 bg-orange-400 font-semibold"
          style={{ flexShrink: 0 }}
        >
          See More
        </Button>
      ) : (
        <Button
          size="medium"
          type="primary"
          onClick={() => setShowAll(false)}
          className="w-32 bg-orange-400 font-semibold"
          style={{ flexShrink: 0 }}
        >
          Show Less
        </Button>
      )}
    </div>
  );
};

export default Details;
