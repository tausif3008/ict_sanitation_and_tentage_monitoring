import React from "react";
import { useOutletContext } from "react-router";
import { Icon } from "@iconify/react/dist/iconify.js";
import card_purple from "../../assets/Dashboard/card_purple.png";

const OffMonitoring = ({ total = 0 }) => {
  const [dict, lang] = useOutletContext();

  const formatNumber = (number) => {
    return new Intl.NumberFormat("en-IN").format(number);
  };

  return (
    <>
      <div className="relative p-3 border rounded-md shadow-md bg-purple-50">
        <div className="text-start">
          <div className="text-blue-600 font-semibold flex flex-col gap-2 items-start relative">
            <div className="flex items-center gap-2">
              {/* <ExclamationCircleOutlined className="text-violet-600 absolute right-[5px]" /> */}
              <Icon
                icon="lucide:monitor-off"
                width="24"
                height="24"
                className="text-violet-600 absolute right-[5px]"
              />
              <span className="text-purple-600">
                {dict.off_monitoring[lang]}
              </span>
            </div>
            <h2 className="text-2xl font-bold">{formatNumber(total)}</h2>
          </div>
        </div>
        <img
          src={card_purple}
          alt="Off Monitoring Icon"
          className="absolute bottom-0 right-0 h-full w-auto object-cover"
        />
      </div>
    </>
  );
};

export default OffMonitoring;
