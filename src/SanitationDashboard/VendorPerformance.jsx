import React from "react";
import { useOutletContext } from "react-router";

const VendorPerformance = ({ performanceData = [] }) => {
  const [dict, lang] = useOutletContext();

  return (
    <div className="bg-white p-2 rounded-md">
      <div className="flex justify-between items-center mb-4">
        <div className="text-xl font-bold">
          {dict.vendor_performance_overview[lang]}
        </div>
        <span className="text-gray-500">{dict.last_24_hrs[lang]}</span>
      </div>
      <div className="">
        <div className="p-4 border rounded-md shadow-md">
          <div className="text-start">
            <div className="text-green-600 font-semibold flex gap-1 mb-2">
              <span>{dict.high_performing_vendors[lang]}</span>
            </div>
            <ul className="mt-2">
              <li className="flex justify-between font-semibold border-b pb-1">
                <span className="w-[60%]">{dict.vendor[lang]}</span>
                <span className="w-[20%]">{dict.task_done[lang]}</span>
                <span className="w-[20%]">{dict.task_overdue[lang]}</span>
              </li>
              {performanceData?.highperformingvendors
                ?.slice(0, 3)
                ?.map((vendor, index) => (
                  <li
                    key={index}
                    className="flex justify-between py-2 border-b last:border-b-0"
                  >
                    <span className="w-[60%]">
                      {lang === "en"
                        ? vendor?.vendor_name_en
                        : vendor?.vendor_name_hi}
                    </span>
                    <span className="font-semibold w-[20%]">
                      {vendor?.incidents || 0}
                    </span>
                    <span className="font-semibold w-[20%]">
                      {vendor?.sla_baunces || 0}
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
            <div className="text-red-600 font-semibold flex gap-1 mb-2">
              <span>{dict.low_performing_vendors[lang]}</span>
            </div>
            <ul className="mt-2">
              <li className="flex justify-between font-semibold border-b pb-1">
                <span className="w-[60%]">{dict.vendor[lang]}</span>
                <span className="w-[20%]">{dict.task_done[lang]}</span>
                <span className="w-[20%]">{dict.task_overdue[lang]}</span>
              </li>
              {performanceData?.lowperformingvendors
                ?.slice(0, 3)
                ?.map((vendor, index) => (
                  <li
                    key={index}
                    className="flex justify-between py-2 border-b last:border-b-0"
                  >
                    <span className="w-[60%]">
                      {lang === "en"
                        ? vendor?.vendor_name_en
                        : vendor?.vendor_name_hi}
                    </span>
                    <span className="font-semibold w-[20%]">
                      {vendor?.incidents || 0}
                    </span>
                    <span className="font-semibold w-[20%]">
                      {vendor?.sla_baunces || 0}
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

export default VendorPerformance;
