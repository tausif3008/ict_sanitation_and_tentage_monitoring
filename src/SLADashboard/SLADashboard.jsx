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
     
      </div>
  );
};

export default SLADashboard;
