import React from "react";
import { useOutletContext } from "react-router";
import { Icon } from "@iconify/react/dist/iconify.js";
// import card_red from "../../assets/Dashboard/card_red.png"

const UnderMonitoring = ({ total = 0, today = 0 }) => {
  const [dict, lang] = useOutletContext();

  const formatNumber = (number) => {
    return new Intl.NumberFormat("en-IN").format(number);
  };

  return (
    <>
      <div className="relative p-3 border rounded-md shadow-md bg-red-50">
        <div className="text-start">
          <div className="text-blue-600 font-semibold flex flex-col gap-2 items-start relative">
            <div className="flex items-center gap-2">
              {/* <EyeOutlined className="text-violet-600 absolute right-[5px]" /> */}
              <Icon
                icon="wpf:todo-list"
                width="24"
                height="24"
                className="text-orange-600 absolute right-[5px]"
              />
              <span className="text-[#db2777]">
                {dict.under_monitoring[lang]}
              </span>
            </div>
            <h2 className="text-2xl font-bold">{formatNumber(total)}</h2>
          </div>
        </div>
        <div className="absolute bottom-0 right-0 h-full w-auto object-cover">
          <div className="bg-white mt-10">
            <h6 className="text-center p-1 text-[#db2777] mr-2">
              {dict.todays_under_monitoring[lang]}
            </h6>
            <p className="text-l text-center text-blue-600 font-bold">
              {formatNumber(today)}
            </p>
          </div>
        </div>
        {/* <img
          src={card_red}
          alt="Under Monitoring Icon"
          className="absolute bottom-0 right-0 h-full w-auto object-cover"
        /> */}
      </div>
    </>
  );
};

export default UnderMonitoring;
