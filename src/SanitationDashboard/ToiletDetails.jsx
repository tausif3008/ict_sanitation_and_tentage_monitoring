import React, { useState, useEffect } from "react";
import { DatePicker, Select, message, Tooltip, Button } from "antd";
import lines from "../assets/Dashboard/lines.png";

const ToiletDetails = () => {

  const [selectedVendor, setSelectedVendor] = useState(null);
  const [selectedSector, setSelectedSector] = useState(null);
  const [selectedToilet, setSelectedToilet] = useState(null);
  const [vendorData, setVendorData] = useState([]);
  const [sectorData, setSectorData] = useState([]);
  const [assetData, setAssetData] = useState([]);
  const [showAll, setShowAll] = useState(false);

  const toiletData = assetData?.asset_count;

  const headers = {
    "Content-Type": "application/json",
    "x-api-key": "YunHu873jHds83hRujGJKd873",
    "x-api-version": "1.0.1",
    "x-platform": "Web",
    "x-access-token": localStorage.getItem("sessionToken") || "",
  };

  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        const response = await fetch(
          "https://kumbhtsmonitoring.in/php-api/vendor-details",
          { method: "GET", headers: headers }
        );
        const result = await response.json();
        if (result.success) {
          setVendorData(result.data.userdetails);
        } else {
          message.error("Failed to load details.");
        }
      } catch (error) {
        message.error("Error fetching details.");
      }
    };
    fetchVendorData();
  }, []);

  useEffect(() => {
    const fetchSectorData = async () => {
      try {
        const response = await fetch(
          "https://kumbhtsmonitoring.in/php-api/sector",
          { method: "GET", headers: headers }
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

  useEffect(() => {
    const fetchAssetData = async () => {
      try {
        const response = await fetch(
          "https://kumbhtsmonitoring.in/php-api/dashboard/sanitation",
          { method: "POST", headers: headers }
        );
        const result = await response.json();
        if (result.success) {
          setAssetData(result.data);
        } else {
          message.error("Failed to load details.");
        }
      } catch (error) {
        message.error("Error fetching details.");
      }
    };
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

      <div className="flex flex-wrap gap-3 mt-0">
        <DatePicker size="middle" />
        <Select
          value={selectedSector}
          onChange={(value) => setSelectedSector(value)}
          placeholder="Select Sector"
          style={{ minWidth: "120px", flex: "1" }}
        >
          {sectorData.map((sector) => (
            <Select.Option key={sector.sector_id} value={sector.name}>
              {sector.name}
            </Select.Option>
          ))}
        </Select>

        <Select
          value={selectedVendor}
          onChange={(value) => setSelectedVendor(value)}
          placeholder="Select Vendor"
          style={{ minWidth: "150px", flex: "1" }}
        >
          {vendorData.map((vendor) => (
            <Select.Option
              key={vendor.vendor_detail_id}
              value={vendor.user_name}
            >
              {vendor.user_name}
            </Select.Option>
          ))}
        </Select>

        <Select
          value={selectedToilet}
          onChange={(value) => setSelectedToilet(value)}
          placeholder="Select Toilet"
          style={{ minWidth: "150px", flex: "1" }}
        >
          {toiletData?.map((toilet) => (
            <Select.Option key={toilet.asset_type_id} value={toilet.type}>
              {toilet.type}
            </Select.Option>
          ))}
        </Select>

        <Button
          size="medium"
          type="primary"
          htmlType="submit"
          className="w-32 bg-orange-400 font-semibold"
          style={{ flexShrink: 0 }}
        >
          Search
        </Button>
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
                  <strong>{item.type}</strong>
                  <div>Response Time: {item.response_time}</div>
                  <div>Total Quantity: {item.total_quantity}</div>
                  <div>Registered Quantity: {item.registered_quantity}</div>
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
                    {item.type}
                  </div>
                </div>
                <div className="absolute bottom-4 left-3 right-3 flex justify-between">
                  <div className="flex items-center">
                    <div className="h-3 w-3 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm font-semibold">
                      {item.total_quantity}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="h-3 w-3 bg-red-500 rounded-full mr-2"></div>
                    <span className="text-sm font-semibold">
                      {item.registered_quantity}
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
          <div>No data available</div>
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

export default ToiletDetails;
