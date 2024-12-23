import React from "react";
import { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./dashboardCalender.css";
import {
  Button,
  Checkbox,
  Calendar as Cal,
  theme,
  DatePicker,
  Table,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import DashboardTitle from "./DashboardTitle";

const dataSource = [
  {
    key: "Omega",
    team: "Omega",
    time: 12,
    overdue: "+5m",
  },
  {
    key: "Sigma",
    team: "Sigma",
    time: 9,
    overdue: "-2m",
  },
  {
    key: "Delta",
    team: "Delta",
    time: 19,
    overdue: "+8m",
  },
  {
    key: "Phoenix",
    team: "Phoenix",
    time: 20,
    overdue: "+15m",
  },
  {
    key: "Titan",
    team: "Titan",
    time: 15,
    overdue: "+6m",
  },
  {
    key: "Vortex",
    team: "Vortex",
    time: 17,
    overdue: "+9m",
  },
  {
    key: "Nova",
    team: "Nova",
    time: 9,
    overdue: "-2m",
  },
  {
    key: "Eclipse",
    team: "Eclipse",
    time: 7,
    overdue: "-3m",
  },
  {
    key: "Quantum",
    team: "Quantum",
    time: 7,
    overdue: "-2m",
  },
  {
    key: "Zenith",
    team: "Zenith",
    time: 10,
    overdue: "+2m",
  },
  {
    key: "Hydra",
    team: "Hydra",
    time: 17,
    overdue: "-5m",
  },
  {
    key: "Apex",
    team: "Apex",
    time: 19,
    overdue: "+9m",
  },
  {
    key: "Fusion",
    team: "Fusion",
    time: 13,
    overdue: "+3m",
  },
  {
    key: "Inferno",
    team: "Inferno",
    time: 11,
    overdue: "+1m",
  },
  {
    key: "Maverick",
    team: "Maverick",
    time: 15,
    overdue: "+5m",
  },
];

const columns = [
  {
    title: "Team",
    dataIndex: "team",
    key: "Team",
  },
  {
    title: "Time(min)",
    dataIndex: "time",
    key: "Time",
  },
  {
    title: "Overdue",
    dataIndex: "overdue",
    key: "Overdue",
  },
];

const onPanelChange = (value, mode) => {};
const localizer = momentLocalizer(moment);

const DashboardCalender = () => {
  const [value, onChangeDate] = useState();

  const [events, setEvents] = useState([
    {
      title: (
        <div className="bg-orange-200 text-orange-500 w-full p-1 rounded-md text-xs">
          Cleaning 1
        </div>
      ),
      start: new Date(),
      end: new Date(),
      allDay: false,
    },
    {
      title: (
        <div className="bg-green-200 text-green-500 w-full p-1 rounded-md text-xs">
          Cleaning 2
        </div>
      ),
      start: new Date("2024-09-10T12:00:00"),
      end: new Date("2024-09-10T13:00:00"),
      allDay: false,
    },
    {
      title: (
        <div className="bg-teal-200 text-teal-500 w-full p-1 rounded-md text-xs">
          Cleaning 3
        </div>
      ),
      start: new Date("2024-09-11T12:00:00"),
      end: new Date("2024-09-11T13:00:00"),
      allDay: false,
    },
    {
      title: (
        <div className="bg-blue-200 text-blue-500 w-full p-1 rounded-md text-xs">
          Cleaning 4
        </div>
      ),
      start: new Date("2024-09-11T12:00:00"),
      end: new Date("2024-09-11T13:00:00"),
      allDay: false,
    },
  ]);

  const eventStyleGetter = (event) => {
    return {
      style: {
        backgroundColor: "transparent", // Remove background color
        border: "none",
        color: "black",
        padding: "none",
      },
    };
  };

  const onChange = (checkedValues) => {};

  const { token } = theme.useToken();
  const wrapperStyle = {
    width: 300,
    border: `1px solid ${token.colorBorderSecondary}`,
    borderRadius: token.borderRadiusLG,
  };

  const [selectedDate, setSelectedDate] = useState("05/10/2025");

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <div className="grid gap-2 lg:grid-cols-7 -mt-12 sm:mt-0 w-full rounded-md">
      <div className="bg-white p-2 w-full lg:col-span-5 shadow-md rounded-md">
        <div className="bg-white p-2 rounded w-full border mb-2 flex items-center justify-between gap-3 flex-row-reverse">
          <Button className="bg-lime-500 text-white">
            <PlusOutlined></PlusOutlined> Add Tasks
          </Button>
          <div>
            <div>Filter</div>
            <Checkbox.Group
              onChange={onChange}
              className="flex lsm:flex-col  overflow-y-scroll w-full"
            >
              <div id="all">
                <Checkbox value="all">View All</Checkbox>
              </div>
              <div id="omega">
                <Checkbox value="omega">Team Omega</Checkbox>
              </div>
              <div id="sigma">
                <Checkbox value="sigma">Team Sigma</Checkbox>
              </div>
              <div id="delta">
                <Checkbox value="delta">Team Delta</Checkbox>
              </div>
              <div id="phoenix">
                <Checkbox value="phoenix">Team Phoenix</Checkbox>
              </div>
              <div id="titan">
                <Checkbox value="titan">Team Titan</Checkbox>
              </div>
            </Checkbox.Group>
          </div>
        </div>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "550px", width: "100%" }}
          eventPropGetter={eventStyleGetter} // Apply custom styles to events
        />
      </div>

      <div className="hidden lg:flex w-full  col-span-2 xl:col-span-2 shadow-md rounded-md">
        <div
          className="bg-white flex flex-col w-full rounded-md"
          style={{ height: "640px" }}
        >
          <DashboardTitle title="Response Time"></DashboardTitle>
          <div className="border-b mb-2"></div>
          <div className="px-2 flex flex-col gap-2">
            <DatePicker onChange={handleDateChange} />
            <Table
              dataSource={dataSource}
              columns={columns}
              pagination={{
                defaultCurrent: 20,
                current: 1,
                total: dataSource.length,
                pageSize: 14,
              }}
              scroll={{ x: 200 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCalender;
