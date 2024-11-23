
import React, { useState, useEffect } from "react";
import { DatePicker, Select, message, Tooltip, Button } from "antd";
import dayjs from "dayjs";
import lines from "../assets/Dashboard/lines.png";
import URLS from "../urils/URLS";
import { useOutletContext } from "react-router";


const ToiletDetails = () => {
  const [dict, lang] = useOutletContext();
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [selectedSector, setSelectedSector] = useState(null);
  const [selectedToilet, setSelectedToilet] = useState(null);
  const [selectedDate, setSelectedDate] = useState(dayjs().format("YYYY-MM-DD")); 
  const [vendorData, setVendorData] = useState([]);
  const [sectorData, setSectorData] = useState([]);
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
  const headerspost = {
    "x-api-key": "YunHu873jHds83hRujGJKd873",
    "x-api-version": "1.0.1",
    "x-platform": "Web",
    "x-access-token": localStorage.getItem("sessionToken") || "",
  };

  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        const response = await fetch(`${URLS.baseUrl}/users?user_type_id=8`, {
          method: "GET",
          headers: headers,
        });
        const result = await response.json();
        if (result.success) {
          setVendorData(result.data.users);
          console.log(result.data.users);
          
        } else {
          message.error("Failed to load vendor details.");
        }
      } catch (error) {
        message.error("Error fetching vendor details.");
      }
    };
    fetchVendorData();
  }, []);

  useEffect(() => {
    const fetchSectorData = async () => {
      try {
        const response = await fetch(`${URLS.baseUrl}/sector`, {
          method: "GET",
          headers: headers,
        });
        const result = await response.json();
        if (result.success) {
          setSectorData(result.data.sectors);
        } else {
          message.error("Failed to load sector details.");
        }
      } catch (error) {
        message.error("Error fetching sector details.");
      }
    };
    fetchSectorData();
  }, []);

  const fetchAssetData = async (
   
  ) => {
    try {
      const response = await fetch(`${URLS.baseUrl}/dashboard/sanitation`, {
        method: "POST",
        headers: headers,
       
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

  const fetchAsset = async () => {
    const formData = new FormData();
    formData.append("date", selectedDate); 
    formData.append("sector_id", selectedSector); 
    formData.append("vendor_id", selectedVendor); 
    formData.append("asset_type_id", selectedToilet); 
  
    try {
      const response = await fetch(`${URLS.baseUrl}/dashboard/sanitation`, {
        method: "POST",
        headers: headerspost,
        body: formData,
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

  const handleSectorChange = (value) => {
    setSelectedSector(value);
    fetchAsset(value, selectedVendor, selectedToilet);
  };

  const handleVendorChange = (value) => {
    setSelectedVendor(value);
    fetchAsset(selectedSector, value, selectedToilet);
  };

  const handleToiletChange = (value) => {
    setSelectedToilet(value);
    fetchAsset(selectedSector, selectedVendor, value);
  };

  const handleDateChange = (date) => {
    const formattedDate = date ? date.format("YYYY-MM-DD") : dayjs().format("YYYY-MM-DD");
    setSelectedDate(formattedDate);
    fetchAsset(selectedSector, selectedVendor, selectedToilet);
  };

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
      <div className="text-xl font-bold">
        {dict.sanitation_toilet_details[lang]}
      </div>

      <div className="flex justify-start items-center space-x-6 mb-1">
        <div className="flex items-center mb-4 mr-6">
          <div className="flex items-center mr-6">
            <div className="h-3 w-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-lg">{dict.clean[lang]}</span>
          </div>
          <div className="flex items-center mr-6">
            <div className="h-3 w-3 bg-red-500 rounded-full mr-2"></div>
            <span className="text-lg">{dict.unclean[lang]}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mt-0">
        <DatePicker
          size="middle"
          defaultValue={dayjs()}
          onChange={handleDateChange}
        />
        <Select
          value={selectedSector}
          onChange={handleSectorChange}
          placeholder={dict.select_sector[lang]}
          style={{ minWidth: "120px", flex: "1" }}
        >
          {sectorData.map((sector) => (
            <Select.Option key={sector.sector_id} value={sector.sector_id}>
              {sector.name}
            </Select.Option>
          ))}
        </Select>

        <Select
          value={selectedVendor}
          onChange={handleVendorChange}
          placeholder={dict.select_vendor[lang]}
          style={{ minWidth: "150px", flex: "1" }}
        >
          {vendorData.map((vendor) => (
            <Select.Option key={vendor.user_id} value={vendor.user_id}>
              {vendor.name}
            </Select.Option>
          ))}
        </Select>

        <Select
          value={selectedToilet}
          onChange={handleToiletChange}
          placeholder={dict.select_toilet[lang]}
          style={{ minWidth: "150px", flex: "1" }}
        >
          {toiletData?.map((toilet) => (
            <Select.Option
              key={toilet.asset_type_id}
              value={toilet.asset_type_id}
            >
              {toilet.name}
            </Select.Option>
          ))}
        </Select>

        <Button
          size="medium"
          type="primary"
          className="w-32 bg-orange-400 font-semibold"
          style={{ flexShrink: 0 }}
          onClick={() =>
            fetchAssetData(selectedSector, selectedVendor, selectedToilet)
          }
        >
          {dict.search[lang]}
        </Button>
      </div>

      <div
        className={`grid ${
          showAll
            ? "grid-cols-2 sm:grid-cols-2 md:grid-cols-4"
            : "sm:grid-cols-2 xl:grid-cols-3 md:grid-cols-3"
        } gap-3 sm:gap-3 md:gap-4 lg:gap-4`}
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
                  minHeight: "110px",
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
                    <span className="text-md font-semibold">{item.clean}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="h-3 w-3 bg-red-500 rounded-full mr-2"></div>
                    <span className="text-md font-semibold">
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
           {dict.no_data_available[lang]}
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
         {dict.see_more[lang]}
        </Button>
      ) : (
        <Button
          size="medium"
          type="primary"
          onClick={() => setShowAll(false)}
          className="w-32 bg-orange-400 font-semibold"
          style={{ flexShrink: 0 }}
        >
           {dict.show_less[lang]}
        </Button>
      )}
          </div>
  );
};

export default ToiletDetails;
