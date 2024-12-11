import React from "react";
import SLAAnalysis from "./SLAAnalysis";
import TasksCompletedByVendor from "./TasksCompletedByVendor";
import SLAComplianceRate from "./SLAComplianceRate.jsx";
import AverageResolutionTime from "./AcerageResulutionTime.jsx";
import SLAResolution from "./SLAIssuResolution.jsx";
import TeamPerformance from "./TeamPerformance.jsx";
import AverageResponseTimeChart from "./AverageTeamPerformance.jsx";
import Notifications from "../dashboardNew/Notifications.jsx";
import Alerts from "./Alerts.jsx";
import TaskSchedule from "./TaskSchedule.jsx";
import MapData from "./MapData.jsx";
import NotificationLog from "./NotificationLog.jsx";
import SLASummary from "./SLASummary1.jsx";
import HelplineNo from "../SanitationDashboard/helplineNo.jsx";

const SLADashboard = () => {
  return (
    <div className="grid grid-cols-4 mx-3 mt-3 gap-3 ">
      <div className="col-span-4 md:col-span-2 shadow-md bg-white rounded-md">
        <TasksCompletedByVendor></TasksCompletedByVendor>
      </div>
      <div className="col-span-4 md:col-span-2 shadow-md bg-white rounded-md">
        <SLAAnalysis></SLAAnalysis>
      </div>
      <div className="col-span-4 rounded-md gap-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <AverageResolutionTime></AverageResolutionTime>
        <SLAComplianceRate></SLAComplianceRate>
        <SLAResolution></SLAResolution>
      </div>
      {/* <div className="col-span-4 lg:col-span-2 flex gap-2 flex-col rounded-md">
        <div className="">
          <TeamPerformance></TeamPerformance>
        </div>
        <div>
          <AverageResponseTimeChart></AverageResponseTimeChart>
        </div>
      </div>
      <div className="lg:col-span-1 col-span-4 sm:col-span-2 md:col-span-2 flex gap-2 flex-col">
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
      </div> */}
      {/* <div
        className="col-span-4 sm:col-span-2 flex lg:hidden w-full flex-wrap "
        style={{ height: "425px" }}
      >
        <Alerts></Alerts>
      </div>

      <div className="lg:col-span-1 col-span-4 ">
        <TaskSchedule></TaskSchedule>
      </div>
      <div className=" col-span-4 lg:col-span-3">
        <NotificationLog></NotificationLog>
      </div> 

      <div className="col-span-4 sm:col-span-2 lg:col-span-1">
        <SLASummary></SLASummary>
      </div>
      <HelplineNo />
    </div>
  );
};

export default SLADashboard;
