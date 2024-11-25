import React, { useEffect, useState } from "react";
import card_green from "../assets/Dashboard/card_green.png";
import card_orange from "../assets/Dashboard/card_orange.png";
import card_red from "../assets/Dashboard/card_red.png";
import card_purple from "../assets/Dashboard/card_purple.png";
import { useOutletContext } from "react-router";
import SanitationDashSelector from "../SanitationDashboard/Slice/sanitationDashboardSelector";

const IssueCount = () => {
  const [dict, lang] = useOutletContext();
  const { SanitationDash_data, loading } = SanitationDashSelector(); // sanitation dashboard ( api call in details page of vendor dashboard)
  const {
    off_monitoring = 0,
    under_monitoring = 0,
    total = 0,
    registered = 0,
  } = SanitationDash_data?.data?.asset_counts || {};

  const formatNumber = (number) => {
    return new Intl.NumberFormat("en-IN").format(number);
  };

  return (
    <div className="p-3 mx-auto bg-white rounded-xl space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative p-3 border rounded-md shadow-md bg-blue-50 flex flex-col justify-between">
          <div className="text-start">
            <div className="text-blue-600 font-semibold flex flex-col gap-2 items-start">
              <span className="text-green-600">
                {dict.number_of_toilets_cesspool[lang]}
              </span>
              <h2 className="text-2xl font-bold">{formatNumber(total)}</h2>
            </div>
          </div>
          <img
            src={card_green}
            alt="Total Toilets Icon"
            className="absolute bottom-0 right-0 h-16 w-16 object-cover"
          />
        </div>

        <div className="relative p-3 border rounded-md shadow-md bg-orange-50 flex flex-col justify-between">
          <div className="text-start">
            <div className="text-blue-600 font-semibold flex flex-col gap-2 items-start">
              <span className="text-[#eab308]">
                {dict.number_of_toilets_jetspray[lang]}
              </span>
              <h2 className="text-2xl font-bold">{formatNumber(registered)}</h2>
            </div>
          </div>
          <img
            src={card_orange}
            alt="Registered Toilets Icon"
            className="absolute bottom-0 right-0 h-16 w-16 object-cover"
          />
        </div>

        <div className="relative p-3 border rounded-md shadow-md bg-red-50 flex flex-col justify-between">
          <div className="text-start">
            <div className="text-blue-600 font-semibold flex flex-col gap-2 items-start">
              <span className="text-[#db2777]">
                {dict.number_of_toilets_manpower[lang]}
              </span>
              <h2 className="text-2xl font-bold">
                {formatNumber(under_monitoring)}
              </h2>
            </div>
          </div>
          <img
            src={card_red}
            alt="Under Monitoring Icon"
            className="absolute bottom-0 right-0 h-16 w-16 object-cover"
          />
        </div>

        <div className="relative p-3 border rounded-md shadow-md bg-purple-50 flex flex-col justify-between">
          <div className="text-start">
            <div className="text-blue-600 font-semibold flex flex-col gap-2 items-start">
              <span className="text-purple-600">
                {dict.number_of_toilets_odor_free[lang]}
              </span>
              <h2 className="text-2xl font-bold">
                {formatNumber(off_monitoring)}
              </h2>
            </div>
          </div>
          <img
            src={card_purple}
            alt="Off Monitoring Icon"
            className="absolute bottom-0 right-0 h-16 w-16 object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default IssueCount;
