import React from "react";
import { useOutletContext } from "react-router";

const PerformingSectors = ({ performanceData = [] }) => {
  const [dict, lang] = useOutletContext();

  return (
    <div className="bg-white p-2 rounded-md">
      <div className="flex justify-between items-center mb-4">
        <div className="text-xl font-bold">
          {dict.sector_performance_overview[lang]}
        </div>
        <span className="text-gray-500">{dict.last_24_hrs[lang]}</span>
      </div>
      <div className="">
        <div className="p-4 border rounded-md shadow-md">
          <div className="text-start">
            <div className="text-red-600 font-semibold flex gap-1 mb-2">
              <span>{dict.high_performing_sector[lang]}</span>
            </div>
            <ul className="mt-2">
              <li className="flex justify-between font-semibold border-b pb-1">
                <span>{dict.sector[lang]}</span>
                <span>{dict.not_Complaint[lang]}</span>
              </li>
              {performanceData?.highperformingsectors
                ?.slice(0, 3)
                ?.map((item, index) => (
                  <li
                    key={index}
                    className="flex justify-between py-2 border-b last:border-b-0"
                  >
                    <span>
                      {lang === "en"
                        ? item?.sector_name_en
                        : item?.sector_name_hi}
                    </span>
                    <span className="font-semibold">
                      {item?.not_compliant}
                      {/* {` ${dict.not_Complaint[lang]}`} */}
                    </span>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="mt-2">
        <div className="p-4 border rounded-md shadow-md">
          <div className="text-start">
            <div className="text-green-600 font-semibold flex gap-1 mb-2">
              <span>{dict.low_performing_sector[lang]}</span>
            </div>
            <ul className="mt-2">
              <li className="flex justify-between font-semibold border-b pb-1">
                <span>{dict.sector[lang]}</span>
                <span>{dict.not_Complaint[lang]}</span>
              </li>
              {performanceData?.lowperformingsectors
                ?.slice(0, 3)
                ?.map((item, index) => (
                  <li
                    key={index}
                    className="flex justify-between py-2 border-b last:border-b-0"
                  >
                    <span>
                      {lang === "en"
                        ? item?.sector_name_en
                        : item?.sector_name_hi}
                    </span>
                    <span className="font-semibold">
                      {item?.not_compliant}
                      {/* {` ${dict.not_Complaint[lang]}`} */}
                    </span>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformingSectors;
