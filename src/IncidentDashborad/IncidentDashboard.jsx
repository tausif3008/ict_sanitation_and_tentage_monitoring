import React from "react";
import { Select } from "antd";
import AverageCollectionTimeChart from "./AverageCollectionTime";
import IncidentsReport from "./IncidentsReport";
import FacilityDetails from "../dashboardNew/FacilityDetails/FacilityDetails";
import IncidentTrends from "./IncidentsTrend";
import DailyFrequencyHeatmap from "./DailyFrequencyHeatMap";
import AverageTeamPerformance from "./TeamPerformance";
import HelplineNo from "../SanitationDashboard/helplineNo";
// import phone from "../assets/Dashboard/phone.png";
// import phoneIcon from "../assets/Dashboard/phone-alt.png";

const IncidentDashboard = () => {
  return (
    <div className=" mx-3 mt-2">
      <Select
        placeholder="Select an option"
        defaultValue="sanitation"
        style={{ width: 200 }}
      >
        <option key={1} value="sanitation">
          Sanitation
        </option>
        <option key={3} value="tentage">
          Tentage
        </option>
        <option key={2} value="wastes">
          Wastes
        </option>
      </Select>
      <div className="grid grid-cols-4 mt-2 gap-3">
        {/* <div className="col-span-4 grid lg:grid-cols-7 gap-3">
          <div className="lg:col-span-3 col-span-4 border shadow-md bg-white rounded-md w-full">
            <IncidentsReport></IncidentsReport>
          </div>
          <div className="w-full border lg:col-span-4 col-span-4 shadow-md bg-white rounded-md">
            <AverageCollectionTimeChart></AverageCollectionTimeChart>
          </div>
        </div> */}
        <div className="col-span-4 shadow-md bg-white h-auto rounded-md">
          <FacilityDetails></FacilityDetails>
        </div>

        {/* <div className="lg:col-span-1  lg:flex col-span-4 bg-white shadow-md mb-3 lg:mb-0 rounded-md">
          <IncidentTrends></IncidentTrends>
        </div>

        <div className="lg:col-span-3  lg:flex col-span-4 bg-white shadow-md mb-3 lg:mb-0  rounded-md">
          <DailyFrequencyHeatmap></DailyFrequencyHeatmap>
        </div> */}

        <div className=" lg:flex col-span-4 bg-white shadow-md mb-3 lg:mb-0  rounded-md">
          <AverageTeamPerformance></AverageTeamPerformance>
        </div>

        <HelplineNo />

        {/* <div className="col-span-4 ">
          <div className="flex flex-col  shadow-md  sm:flex-row text-center mt-3 items-center border-2 border-orange-500 w-fit p-3 m-auto ">
            <span className="mr-8 text-xl font-semibold text-orange-400">
              Prayagraj Kumbh Mela{" "}
              <span className="text-orange-600 font-bold">Helpline No.</span>
            </span>
            <div className="flex items-center bg-orange-400 h-12">
              <div className="flex justify-center items-center">
                <img className="h-10 absolute" src={phone} alt="" />
                <img className="h-6 absolute" src={phoneIcon} alt="" />
              </div>
              <div className="ml-5 p-2 text-xl font-semibold text-white">
                01334-224 457
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default IncidentDashboard;
