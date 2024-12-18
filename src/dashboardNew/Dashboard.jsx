import React from "react";
import LineChartWithArea from "./LineChartWithArea";
import TypeList from "./TypeList";
import MapData from "./MapData";
import FacilityDetails from "./FacilityDetails/FacilityDetails";
import CleanlinessScoreGauge from "./CleanlinessScoreGauge";
import ResponseTimeChart from "./ResponseTimeChart";
import IncidentsReported from "./IncidentsReported";
import DashboardCalender from "./DashboardCalender";
import TeamPerformance from "./TeamPerformance";
import AverageResponseTimeChart from "./AverageTeamPerformance";
import Notifications from "./Notifications";
import Alerts from "./Alerts";
import TaskSchedule from "./TaskSchedule";
import PerformanceMatrix from "./PerformanceMatrix/PerformanceMatrix";
import HelplineNo from "../SanitationDashboard/helplineNo";
// import phone from "../assets/Dashboard/phone.png";
// import phoneIcon from "../assets/Dashboard/phone-alt.png";

const Dashboard = () => {
  return (
    <div className="grid grid-cols-4 mx-3 mt-3 gap-3 ">
      <div className="lg:col-span-3 col-span-4 border shadow-md bg-white rounded-md">
        <LineChartWithArea></LineChartWithArea>
      </div>
      <div className="w-full border lg:col-span-1 col-span-4 shadow-md bg-white rounded-md">
        <TypeList></TypeList>
      </div>
      <div className="col-span-4 shadow-md bg-white h-auto rounded-md">
        <FacilityDetails></FacilityDetails>
      </div>
      <div className="col-span-4 shadow-md bg-white rounded-md">
        <MapData></MapData>
      </div>
      <div className="sm:col-span-2 lg:col-span-1 col-span-4 bg-white shadow-md rounded-md">
        <CleanlinessScoreGauge></CleanlinessScoreGauge>
      </div>
      <div className="sm:col-span-2 lg:col-span-1 col-span-4 bg-white shadow-md rounded-md">
        <IncidentsReported></IncidentsReported>
      </div>
      <div className="lg:col-span-2  lg:flex col-span-4 bg-white shadow-md mb-3 lg:mb-0 h-full rounded-md">
        <ResponseTimeChart></ResponseTimeChart>
      </div>
      <div className="col-span-4 mt-10 sm:mt-0 w-full rounded-md ">
        <DashboardCalender></DashboardCalender>
      </div>
      <div className="col-span-4 lg:col-span-2 flex gap-2 flex-col rounded-md">
        <div className="">
          <TeamPerformance></TeamPerformance>
        </div>
        <div>
          <AverageResponseTimeChart></AverageResponseTimeChart>
        </div>
      </div>

      <div className="lg:col-span-1 lg:hidden col-span-4 sm:col-span-2 md:col-span-2 flex gap-2 flex-col">
        <div
          className="col-span-2 flex-wrap h-full  rounded-md "
          style={{ height: "424px" }}
        >
          <Notifications></Notifications>
        </div>
        <div
          className="col-span-2  hidden lg:flex w-full flex-wrap rounded-md"
          style={{ height: "375px" }}
        >
          <Alerts></Alerts>
        </div>
      </div>
      <div
        className="col-span-4 sm:col-span-2 flex lg:hidden w-full flex-wrap "
        style={{ height: "425px" }}
      >
        <Alerts></Alerts>
      </div>

      <div className="lg:col-span-1 col-span-4 ">
        <TaskSchedule></TaskSchedule>
      </div>

      <div className="lg:col-span-1 hidden lg:flex col-span-4 sm:col-span-2 md:col-span-2 gap-2 flex-col">
        <div
          className="col-span-2 flex-wrap h-full  rounded-md "
          style={{ height: "424px" }}
        >
          <Notifications></Notifications>
        </div>
        <div
          className="col-span-2  hidden lg:flex w-full flex-wrap rounded-md"
          style={{ height: "375px" }}
        >
          <Alerts></Alerts>
        </div>
      </div>
      <div className="col-span-4 shadow-md bg-white h-auto rounded-md">
        <PerformanceMatrix></PerformanceMatrix>
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
  );
};

export default Dashboard;
