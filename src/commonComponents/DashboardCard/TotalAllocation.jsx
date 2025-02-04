import React from "react";
import { useOutletContext } from "react-router";
import { Icon } from "@iconify/react/dist/iconify.js";
import card_green from "../../assets/Dashboard/card_green.png";
import { getFormatedNumber } from "../../constant/const";

const TotalAllocation = ({ total = 0 }) => {
  const [dict, lang] = useOutletContext();

  return (
    <>
      <div className="relative p-3 border rounded-md shadow-md bg-purple-50">
        <div className="text-start">
          <div className="text-blue-600 font-semibold flex flex-col gap-2 items-start relative">
            <div className="flex items-center gap-2">
              <Icon
                icon="tabler:server-bolt"
                width="24"
                height="24"
                className="text-green-500 absolute right-[5px]"
              />
              <span className="text-green-600">
                {dict.total_allocation[lang]}
              </span>
            </div>
            <h2 className="text-2xl font-bold">{getFormatedNumber(total)}</h2>
          </div>
        </div>
        <img
          src={card_green}
          alt="Total Toilets Icon"
          className="absolute bottom-0 right-0 h-full w-auto object-cover"
        />
      </div>
    </>
  );
};

export default TotalAllocation;
