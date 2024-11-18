import React from "react";
import { useOutletContext } from "react-router";


const IncidentReportAnalysis = () => {
  const [dict, lang] = useOutletContext();

  const highFrequencySectors = [
    { sector: "Sector A", circle: "Circle 1", count: 50 },
    { sector: "Sector B", circle: "Circle 2", count: 35 },
    { sector: "Sector C", circle: "Circle 3", count: 70 },
  ];

  const lowFrequencySectors = [
    { sector: "Sector D", circle: "Circle 4", count: 10 },
    { sector: "Sector E", circle: "Circle 5", count: 5 },
    { sector: "Sector F", circle: "Circle 6", count: 15 },
  ];

  return (
    <div className="bg-white p-2 rounded-md">
      <div className="flex justify-between items-center mb-4">
        <div className="text-xl font-bold">{dict.incident_report_analysis[lang]}</div>
        <span className="text-gray-500">{dict.last_24_hrs[lang]}</span>
      </div>

      <div className="">
        <div className="p-4 border rounded-md shadow-md">
          <div className="text-start">
            <div className="text-red-600 font-semibold flex gap-1 mb-2">
              <span>{dict.high_frequency_sector[lang]}</span>
            </div>
            <ul className="mt-2">
              <li className="flex justify-between font-semibold border-b pb-1">
                <span>{dict.sector[lang]}</span>
                <span>{dict.incidents[lang]}</span>
              </li>
              {highFrequencySectors.map((item, index) => (
                <li
                  key={index}
                  className="flex justify-between py-2 border-b last:border-b-0"
                >
                  <span>{item.sector}</span>
                  <span className="font-semibold">{item.count}{dict.incidents[lang]}</span>
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
              <span>{dict.low_frequency_sector[lang]}</span>
            </div>
            <ul className="mt-2">
              <li className="flex justify-between font-semibold border-b pb-1">
                <span>{dict.sector[lang]}</span>
                <span>{dict.incidents[lang]}</span>
              </li>
              {lowFrequencySectors.map((item, index) => (
                <li
                  key={index}
                  className="flex justify-between py-2 border-b last:border-b-0"
                >
                  <span>{item.sector}</span>
                  <span className="font-semibold">{item.count}{dict.incidents[lang]}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentReportAnalysis;
