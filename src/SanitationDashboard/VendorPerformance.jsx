import React from "react";
import { useOutletContext } from "react-router";

const VendorPerformance = () => {
  const [dict, lang] = useOutletContext();

  const highPerformingVendors = [
    { name: "Vendor A", tasksDone: 80, tasksOverdue: 5 },
    { name: "Vendor B", tasksDone: 75, tasksOverdue: 2 },
    { name: "Vendor E", tasksDone: 30, tasksOverdue: 15 },
  ];

  const lowPerformingVendors = [
    { name: "Vendor C", tasksDone: 40, tasksOverdue: 10 },
    { name: "Vendor D", tasksDone: 30, tasksOverdue: 15 },
    { name: "Vendor F", tasksDone: 30, tasksOverdue: 15 },
  ];

  return (
    <div className="bg-white p-2 rounded-md">
      <div className="flex justify-between items-center mb-4">
        <div className="text-xl font-bold">{dict.vendor_performance_overview[lang]}</div>
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
                <span>{dict.vendor[lang]}</span>
                <span>{dict.task_done[lang]}</span>
                <span>{dict.task_overdue[lang]}</span>
              </li>
              {highPerformingVendors.map((vendor, index) => (
                <li
                  key={index}
                  className="flex justify-between py-2 border-b last:border-b-0"
                >
                  <span>{vendor.name}</span>
                  <span className="font-semibold">{vendor.tasksDone}</span>
                  <span className="font-semibold">{vendor.tasksOverdue}</span>
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
                <span>{dict.vendor[lang]}</span>
                <span>{dict.task_done[lang]}</span>
                <span>{dict.task_overdue[lang]}</span>
              </li>
              {lowPerformingVendors.map((vendor, index) => (
                <li
                  key={index}
                  className="flex justify-between py-2 border-b last:border-b-0"
                >
                  <span>{vendor.name}</span>
                  <span className="font-semibold">{vendor.tasksDone}</span>
                  <span className="font-semibold">{vendor.tasksOverdue}</span>
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
