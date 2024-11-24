import React, { useState, useEffect } from "react";
import { DatePicker, Select, message, Tooltip, Button } from "antd";
import { useDispatch } from "react-redux";
import { useOutletContext } from "react-router";
import lines from "../assets/Dashboard/lines.png";
import URLS from "../urils/URLS";
import { priorityToiletTypes } from "../constant/const";
import { getFormData } from "../urils/getFormData";
import { getSanitationDashData } from "../SanitationDashboard/Slice/sanitationDashboard";
import SanitationDashSelector from "../SanitationDashboard/Slice/sanitationDashboardSelector";

const Details = () => {
  const [dict, lang] = useOutletContext();
  const [assetData, setAssetData] = useState([]);
  const [showAll, setShowAll] = useState(false);

  const dispatch = useDispatch();
  const { SanitationDash_data, loading } = SanitationDashSelector(); // sanitation dashboard
  const toiletData = assetData?.asset_types || [];
  const RoleId = localStorage.getItem("role_id");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (RoleId === "8") {
      const finalData = {
        vendor_id: userId,
      };
      const formData = getFormData(finalData);
      dispatch(getSanitationDashData(formData));
    } else {
      dispatch(getSanitationDashData());
    }
  }, [RoleId, userId]);

  useEffect(() => {
    if (SanitationDash_data) {
      setAssetData(SanitationDash_data?.data); // sanitation data
    }
  }, [SanitationDash_data]);

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

      {toiletData?.length > 0 ? (
        !showAll ? (
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
        )
      ) : null}
    </div>
  );
};

export default Details;
