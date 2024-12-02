import { Table } from "antd";
import React from "react";
import DashboardClock from "./../../assets/MonitoringImages/Dashboard/DashboardClock.png";
import clenderIcon from "./../../assets/MonitoringImages/Dashboard/DachboardCalenderIcon.png";
import requireCleaning from "./../../assets/MonitoringImages/Dashboard/requireCleaning_b_icon.png";
import cleanedIcon from "./../../assets/MonitoringImages/Dashboard/cleaned_bucket_icon.png";
import maintenance_icon from "./../../assets/MonitoringImages/Dashboard/maintenance_bucket_icon.png";

const FacilityDetailsTable = ({ columnss, dataSourcee }) => {
  const dataSource = dataSourcee || [
    {
      key: "1",
      facilityId: "T1023",
      route_name: "Pune_chakan",
      start_point: "Pune",
      middle_point: "Dehu",
      end_point: "Chakan",
      location: "Section 5, Zone B",
      type: "Toilet with Septic Tank",
      currentStatus: (
        <div className="flex w-full justify-center items-center">
          <img src={cleanedIcon} alt="cleanedIcon"></img>
        </div>
      ),
      lastCleanTime: "08:15 AM",
      nextSchedule: "In 2 hrs",
      maintenance: "Done",
      vendor: "Team Alpha",
    },
    {
      key: "2",
      facilityId: "T1024",
      route_name: "Pune Mumbai",
      start_point: "Pune",
      middle_point: "Lonavala",
      end_point: "Mumbai",
      location: "Section 4, Zone A",
      type: "Composting Toilet",
      currentStatus: (
        <div className="flex w-full justify-center items-center">
          <img src={cleanedIcon} alt="cleanedIcon"></img>
        </div>
      ),
      lastCleanTime: "06:15 AM",
      nextSchedule: "In 2.3 hrs",
      maintenance: "Pending",
      vendor: "Team Beta",
    },
    {
      key: "3",
      facilityId: "T1028",
      route_name: "Pune Solapur",
      start_point: "Pune",
      middle_point: "Hadapsar",
      end_point: "Solapur",
      location: "Section 4, Zone B",
      type: "Smart Toilet",
      currentStatus: (
        <div className="flex w-full justify-center items-center">
          <img src={requireCleaning} alt="requireCleaning"></img>
        </div>
      ),
      lastCleanTime: "06:15 AM",
      nextSchedule: "In 4 hrs",
      maintenance: "Pending",
      vendor: "Team Beta",
    },
    {
      key: "4",
      facilityId: "T1030",
      route_name: "Delhi",
      start_point: "Agra",
      middle_point: "Lucknow",
      end_point: "Chakan",
      location: "Section 3, Zone D",
      type: "Squat Toilet",
      currentStatus: (
        <div className="flex w-full justify-center items-center">
          <img src={cleanedIcon} alt="cleanedIcon"></img>
        </div>
      ),
      lastCleanTime: "07:15 AM",
      nextSchedule: "NA",
      maintenance: "Pending",
      vendor: "Team Beta",
    },
    {
      key: "5",
      facilityId: "T1032",
      route_name: "Kolkatta",
      start_point: "Uti",
      middle_point: "Benglore",
      end_point: "Chakan",
      location: "Section 5, Zone D",
      type: "Portable Chemical Toilet",
      currentStatus: (
        <div className="flex w-full justify-center items-center">
          <img src={cleanedIcon} alt="cleanedIcon"></img>
        </div>
      ),
      lastCleanTime: "07:15 AM",
      nextSchedule: "In 2 hrs",
      maintenance: "Pending",
      vendor: "Team Beta",
    },
    {
      key: "6",
      facilityId: "T1040",
      location: "Section 6, Zone A",
      type: "Smart Toilet",
      currentStatus: (
        <div className="flex w-full justify-center items-center">
          <img src={requireCleaning} alt="requireCleaning"></img>
        </div>
      ),
      lastCleanTime: "09:15 AM",
      nextSchedule: "In 5 hrs",
      maintenance: "Pending",
      vendor: "Team Gamma",
    },
    {
      key: "7",
      facilityId: "T1045",
      location: "Section 7, Zone C",
      type: "Portable Chemical Toilet",
      currentStatus: (
        <div className="flex w-full justify-center items-center">
          <img src={cleanedIcon} alt="cleanedIcon"></img>
        </div>
      ),
      lastCleanTime: "08:45 AM",
      nextSchedule: "In 1.5 hrs",
      maintenance: "Pending",
      vendor: "Team Alpha",
    },
    {
      key: "8",
      facilityId: "T1050",
      location: "Section 2, Zone D",
      type: "Toilet with Septic Tank",
      currentStatus: (
        <div className="flex w-full justify-center items-center">
          <img src={cleanedIcon} alt="cleanedIcon"></img>
        </div>
      ),
      lastCleanTime: "10:15 AM",
      nextSchedule: "In 3 hrs",
      maintenance: "Done",
      vendor: "Team Delta",
    },
    {
      key: "9",
      facilityId: "T1055",
      location: "Section 3, Zone B",
      type: "Composting Toilet",
      currentStatus: (
        <div className="flex w-full justify-center items-center">
          <img src={requireCleaning} alt="requireCleaning"></img>
        </div>
      ),
      lastCleanTime: "09:05 AM",
      nextSchedule: "In 2 hrs",
      maintenance: "Pending",
      vendor: "Team Beta",
    },
    {
      key: "10",
      facilityId: "T1060",
      location: "Section 1, Zone A",
      type: "Squat Toilet",
      currentStatus: (
        <div className="flex w-full justify-center items-center">
          <img src={cleanedIcon} alt="cleanedIcon"></img>
        </div>
      ),
      lastCleanTime: "08:55 AM",
      nextSchedule: "NA",
      maintenance: "Done",
      vendor: "Team Gamma",
    },
    {
      key: "11",
      facilityId: "T1065",
      location: "Section 2, Zone B",
      type: "Portable Chemical Toilet",
      currentStatus: (
        <div className="flex w-full justify-center items-center">
          <img src={requireCleaning} alt="requireCleaning"></img>
        </div>
      ),
      lastCleanTime: "07:30 AM",
      nextSchedule: "In 4 hrs",
      maintenance: "Pending",
      vendor: "Team Beta",
    },
    {
      key: "12",
      facilityId: "T1070",
      location: "Section 5, Zone C",
      type: "Smart Toilet",
      currentStatus: (
        <div className="flex w-full justify-center items-center">
          <img src={cleanedIcon} alt="cleanedIcon"></img>
        </div>
      ),
      lastCleanTime: "10:30 AM",
      nextSchedule: "In 3.5 hrs",
      maintenance: "Pending",
      vendor: "Team Alpha",
    },
    {
      key: "13",
      facilityId: "T1075",
      location: "Section 4, Zone A",
      type: "Toilet with Septic Tank",
      currentStatus: (
        <div className="flex w-full justify-center items-center">
          <img src={cleanedIcon} alt="cleanedIcon"></img>
        </div>
      ),
      lastCleanTime: "09:00 AM",
      nextSchedule: "In 2 hrs",
      maintenance: "Done",
      vendor: "Team Delta",
    },
    {
      key: "14",
      facilityId: "T1080",
      location: "Section 1, Zone D",
      type: "Composting Toilet",
      currentStatus: (
        <div className="flex w-full justify-center items-center">
          <img src={requireCleaning} alt="requireCleaning"></img>
        </div>
      ),
      lastCleanTime: "07:50 AM",
      nextSchedule: "In 1.5 hrs",
      maintenance: "Pending",
      vendor: "Team Beta",
    },
    {
      key: "15",
      facilityId: "T1085",
      location: "Section 2, Zone C",
      type: "Squat Toilet",
      currentStatus: (
        <div className="flex w-full justify-center items-center">
          <img src={cleanedIcon} alt="cleanedIcon"></img>
        </div>
      ),
      lastCleanTime: "08:35 AM",
      nextSchedule: "NA",
      maintenance: "Pending",
      vendor: "Team Gamma",
    },
  ];

  const columns = columnss || [
    {
      title: "Facility ID",
      dataIndex: "facilityId",
      key: "facilityId",
    },
    {
      title: "Route Name",
      dataIndex: "route_name",
      key: "route_name",
    },
    {
      title: "Start Point",
      dataIndex: "start_point",
      key: "start_point",
    },
    {
      title: "Middle Point",
      dataIndex: "middle_point",
      key: "middle_point",
    },
    {
      title: "End Point",
      dataIndex: "end_point",
      key: "end_point",
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Current Status",
      dataIndex: "currentStatus",
      key: "currentStatus",
    },
    {
      title: "Last Clean Time",
      dataIndex: "lastCleanTime",
      key: "lastCleanTime",
      render: (val) => {
        return (
          <div className="flex gap-2 items-center">
            <span>
              <img className="h-4" src={clenderIcon} alt="" />
            </span>
            <span>{val}</span>{" "}
          </div>
        );
      },
    },
    {
      title: "Next Schedule",
      dataIndex: "nextSchedule",
      key: "nextSchedule",
      render: (val) => {
        return (
          <div className="flex gap-2 items-center">
            <span>
              <img className="h-5" src={DashboardClock} alt="" />
            </span>
            <span>{val}</span>{" "}
          </div>
        );
      },
    },
    {
      title: "Maintenance",
      dataIndex: "maintenance",
      key: "maintenance",
    },
    {
      title: "Vendor",
      dataIndex: "vendor",
      key: "vendor",
    },
  ];

  return (
    <div className="p-2">
      {!columnss && (
        <div className="flex gap-3 w-full justify-end mb-2 font-semibold text-xs">
          <span className="flex gap-1  items-center">
            <img src={requireCleaning} className="h-6" alt="" />
            <div>Requires Cleaning</div>
          </span>
          <span className="flex gap-1 items-center">
            <img src={cleanedIcon} alt="" className="h-6" />
            <div>Cleaned</div>
          </span>
          <span className="flex gap-1 items-center">
            <img src={maintenance_icon} className="h-6" alt="" />
            <div>Under Maintenance</div>
          </span>
        </div>
      )}
      <Table
        bordered
        dataSource={dataSource}
        columns={columns}
        pagination={{ pageSize: 5 }}
        scroll={{ x: 400 }}
      />
    </div>
  );
};

export default FacilityDetailsTable;
