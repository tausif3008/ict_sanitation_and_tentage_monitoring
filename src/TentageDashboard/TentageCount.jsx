import React, { useEffect } from "react";
import { useOutletContext } from "react-router";
import { useDispatch } from "react-redux";
import {
  CheckCircleOutlined,
  SyncOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import card_green from "../assets/Dashboard/card_green.png";
import card_orange from "../assets/Dashboard/card_orange.png";
import card_red from "../assets/Dashboard/card_red.png";
import card_purple from "../assets/Dashboard/card_purple.png";
import { getTentageDashboardData } from "./Slice/tentageSlice";
import TentageSelector from "./Slice/tentageSelector";

const TentageCount = () => {
  const [dict, lang] = useOutletContext();

  const dispatch = useDispatch();
  const { TentageDash_data } = TentageSelector(); // tentage dashboard
  const { total, registered, under_monitoring, off_monitoring } =
    TentageDash_data?.data?.asset_counts || {};

  const formatNumber = (number) => {
    return new Intl.NumberFormat("en-IN").format(number);
  };

  return (
    <div className="p-3 mx-auto bg-white rounded-xl space-y-4">
      <div className="text-xl font-bold mb-4">{dict.tentage_count[lang]}</div>

      <div className="grid grid-cols-1 lg:grid-cols-1 md:grid-cols-2 sm:grid-cols-2 gap-4">
        <div className="relative p-3 border rounded-md shadow-md bg-blue-50">
          <div className="text-start">
            <div className="text-blue-600 font-semibold flex flex-col gap-2 items-start relative">
              <div className="flex items-center gap-2">
                <CheckCircleOutlined className="text-green absolute right-[5px]" />
                <span className="text-green-600">
                  {dict.total_tentage[lang]}
                </span>
              </div>
              <h2 className="text-2xl font-bold">{formatNumber(total)}</h2>
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
                <SyncOutlined
                  className="text-orange-600 absolute right-[5px]"
                  spin
                />
                <span className="text-[#eab308]">
                  {dict.registered_tentage[lang]}
                </span>
              </div>
              <h2 className="text-2xl font-bold">{formatNumber(registered)}</h2>
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
                <EyeOutlined className="text-violet-600 absolute right-[5px]" />
                <span className="text-[#db2777]">
                  {" "}
                  {dict.under_monitoring[lang]}
                </span>
              </div>
              <h2 className="text-2xl font-bold">
                {formatNumber(under_monitoring)}
              </h2>
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
                <ExclamationCircleOutlined className="text-violet-600 absolute right-[5px]" />
                <span className="text-purple-600">
                  {dict.off_monitoring[lang]}
                </span>
              </div>
              <h2 className="text-2xl font-bold">
                {formatNumber(off_monitoring)}
              </h2>
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

export default TentageCount;
