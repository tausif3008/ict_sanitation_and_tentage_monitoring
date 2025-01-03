import { DatePicker, Divider, Select } from "antd";
import React, { useState } from "react";

function TaskSchedule() {
  const [selectedTeam, setSelectedTeam] = useState("Team Alpha");

  const handleTeamChange = (event) => {
    setSelectedTeam(event.target.value);
  };

  const taskTime = [
    { time: "4 AM", task: "2 Tasks" },
    { time: "5 AM", task: "3 Tasks" },
    { time: "6 AM", task: "4 Tasks" },
    { time: "7 AM", task: "6 Tasks" },
    { time: "8 AM", task: "3 Tasks" },
    { time: "9 AM", task: "7 Tasks" },
    { time: "10 AM", task: "8 Tasks" },
    { time: "11 AM", task: "3 Tasks" },
    { time: "12 pM", task: "5 Tasks" },
    { time: "1 pM", task: "7 Tasks" },
    { time: "2 pM", task: "1 Tasks" },
    { time: "3 pM", task: "4 Tasks" },
    { time: "4 pM", task: "7 Tasks" },
    { time: "5 pM", task: "4 Tasks" },
    { time: "6 pM", task: "3 Tasks" },
    { time: "7 pM", task: "6 Tasks" },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-4 pt-2 h-full overflow-y-hidden  ">
      <h2 className="text-lg font-bold">Task Schedule</h2>
      <div className="flex flex-col justify-between items-center mb-3">
        <div className="flex items-center gap-2 justify-center flex-wrap">
          <Select size="large" value={selectedTeam} onChange={handleTeamChange}>
            <option value="Team Alpha">Team Alpha</option>
            <option value="Team Bravo">Team Bravo</option>
            <option value="Team Charlie">Team Charlie</option>
          </Select>
          <DatePicker size="large" />
        </div>
      </div>
      <div className="border-t ">
        <div className="flex  flex-col justify-between items-center py-2">
          {taskTime.map((el, index) => {
            return (
              <div className="w-full mt-2">
                <div
                  key={index}
                  className="flex items-center  text-sm justify-between w-full"
                >
                  <div>{el.time}</div>
                  <div className="text-gray-700 text-lg justify-center text-center m-auto font-semibold ">
                    {el.task}
                  </div>
                  <div className="flex justify-end">
                    <button className="ml-3 h-5 w-5 bg-orange-400 py-1 rounded-full flex justify-center items-center">
                      <span className="p-1 text-white">i</span>
                    </button>
                  </div>
                </div>
                <div className="border-1 border-orange  border-dashed"></div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default TaskSchedule;
