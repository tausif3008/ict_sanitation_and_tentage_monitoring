import React from "react";
import { useOutletContext } from "react-router";
import { Icon } from "@iconify/react/dist/iconify.js";
// import card_orange from "../../assets/Dashboard/card_orange.png"

const TotalRegister = ({ handleRegister, registered = 0, today = 0 }) => {
  const [dict, lang] = useOutletContext();

  const formatNumber = (number) => {
    return new Intl.NumberFormat("en-IN").format(number);
  };

  return (
    <>
      <div
        className="relative p-3 border rounded-md shadow-md bg-orange-50"
        onClick={handleRegister}
      >
        <div className="text-start">
          <div className="text-blue-600 font-semibold flex flex-col gap-2 items-start relative">
            <div className="flex items-center gap-2">
              {/* <CheckOutlined className="text-orange-600 absolute right-[5px]" /> */}
              <Icon
                icon="wpf:qr-code"
                width="26"
                height="26"
                className="text-orange-600 absolute right-[5px]"
              />
              <span className="text-[#eab308]">
                {dict.total_registered[lang]}
              </span>
            </div>
            <h2 className="text-2xl font-bold">{formatNumber(registered)}</h2>
          </div>
        </div>
        <div className="absolute bottom-0 right-0 h-full w-auto object-cover">
          <div className="bg-white mt-10">
            <h6 className="text-center p-1 text-[#eab308] mr-2">
              {dict.todays_registered[lang]}
            </h6>
            <p className="text-l text-center text-blue-600 font-bold">
              {formatNumber(today)}
            </p>
          </div>
        </div>
        {/* <img
          src={card_orange}
          alt="Registered Toilets Icon"
          className="absolute bottom-0 right-0 h-full w-auto object-cover"
        /> */}
      </div>
    </>
  );
};

export default TotalRegister;
