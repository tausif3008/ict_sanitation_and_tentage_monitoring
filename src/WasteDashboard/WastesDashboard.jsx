    import React from "react";
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
import phone from "../assets/Dashboard/phone.png";
import phoneIcon from "../assets/Dashboard/phone-alt.png";
import PerformanceMatrix from "./PerformanceMatrix/PerformanceMatrix";
import CompactorsTippers from "./CompactorTippers/CompactorsTipers";
import AverageCollectionTimeChart from "./AverageCollectionTime";
import VehiclePerformanceChart from "./VehiclePerformanceChart";
import VehicleTrackingMapData from "./VehicleTrackingMapData";


const columns = [
  {
    title: "Route",
    dataIndex: "route",
    key: "route",
    sorter: (a, b) => a.route.localeCompare(b.route),
  },
  {
    title: "Location",
    dataIndex: "location",
    key: "location",
    sorter: (a, b) => a.location.localeCompare(b.location),
  },
  {
    title: "Schedule",
    dataIndex: "schedule",
    key: "schedule",
  },
  {
    title: "Total Bins Collected",
    dataIndex: "binsCollected",
    key: "binsCollected",
    sorter: (a, b) => a.binsCollected - b.binsCollected,
  },
  {
    title: "Type of Vehicle",
    dataIndex: "vehicle",
    key: "vehicle",
  },
  {
    title: "Time",
    dataIndex: "time",
    key: "time",
  },
  {
    title: "Team",
    dataIndex: "team",
    key: "team",
  },
];

const dataSource = [
  {
    key: "1",
    route: "Route 1",
    location: "Section 5, Zone B",
    schedule: "9 am, 4pm, 8pm",
    binsCollected: 45,
    vehicle: "Tipper",
    time: "In 2 hrs",
    team: "Omega",
  },
  {
    key: "2",
    route: "Route 2",
    location: "Section 4, Zone A",
    schedule: "9 am, 4pm, 8pm",
    binsCollected: 15,
    vehicle: "Compactors",
    time: "In 2.3 hrs",
    team: "Sigma",
  },
  {
    key: "3",
    route: "Route 3",
    location: "Section 4, Zone B",
    schedule: "9 am, 4pm, 8pm",
    binsCollected: 8,
    vehicle: "Compactors",
    time: "In 4 hrs",
    team: "Delta",
  },
  {
    key: "4",
    route: "Route 4",
    location: "Section 3, Zone D",
    schedule: "9 am, 4pm, 8pm",
    binsCollected: 15,
    vehicle: "Tipper",
    time: "NA",
    team: "Phoenix",
  },
  {
    key: "5",
    route: "Route 5",
    location: "Section 5, Zone D",
    schedule: "9 am, 4pm, 8pm",
    binsCollected: 32,
    vehicle: "Tipper",
    time: "In 2 hrs",
    team: "Titan",
  },
];

const WastesDashboard = () => {
  return (
    <div className="grid grid-cols-4 mx-3 mt-3 gap-3">
      <div className="col-span-4 grid lg:grid-cols-7 gap-3">
        <div className="lg:col-span-3 col-span-4 border shadow-md bg-white rounded-md w-full">
          <CompactorsTippers></CompactorsTippers>
        </div>
        <div className="w-full border lg:col-span-4 col-span-4 shadow-md bg-white rounded-md">
          <VehiclePerformanceChart></VehiclePerformanceChart>
        </div>
      </div>
      <div className="col-span-4 shadow-md bg-white h-auto rounded-md">
        <FacilityDetails></FacilityDetails>
      </div>
      <div className="col-span-4 shadow-md bg-white rounded-md">
        <VehicleTrackingMapData></VehicleTrackingMapData>
      </div>
      {/* <div className="lg:col-span-2 col-span-4 bg-white shadow-md rounded-md">
        <VehiclePerformanceChart></VehiclePerformanceChart>
      </div>
      <div className="lg:col-span-2  lg:flex col-span-4 bg-white shadow-md mb-3 lg:mb-0 h-full rounded-md">
        <AverageCollectionTimeChart
          title={"Average Downtime Time"}
        ></AverageCollectionTimeChart>
      </div>
      <div className="col-span-4 shadow-md bg-white h-auto rounded-md">
        <FacilityDetails
          title={"Facility Status & Details Panel "}
          columns={columns}
          dataSource={dataSource}
        ></FacilityDetails>
      </div> */}
      {/* <div className="col-span-4 mt-10 sm:mt-0 w-full rounded-md ">
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
      <div className="col-span-4 shadow-md bg-white h-auto rounded-md">
        <PerformanceMatrix></PerformanceMatrix>
      </div>
       */}
      <div className="col-span-4 ">
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
      </div>
    </div>
  );
};

export default WastesDashboard;
