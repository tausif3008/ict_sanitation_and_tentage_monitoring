import React from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import card_orange from "../../assets/Dashboard/card_orange.png";
// import card_orange from "../assets/Dashboard/card_orange.png";

const UserCard = () => {
  const Role = localStorage.getItem("role");
  const name = localStorage.getItem("name");

  return (
    <div className="p-3 mx-auto bg-white rounded-xl space-y-4 b">
      <div className="grid grid-cols-1 lg:grid-cols-1 md:grid-cols-2 sm:grid-cols-2 gap-4">
        <div className="relative p-3 border rounded-md shadow-md bg-blue-50">
          <div className="text-start">
            <div className="text-blue-600 font-semibold flex flex-col gap-2 items-start relative">
              <div className="flex items-center gap-2">
                {/* <UserOutlined className="text-green absolute right-[5px]" /> */}
                <Icon
                  icon="fa-solid:user-tie"
                  width="30"
                  height="30"
                  className="text-green absolute right-[5px]"
                />
                <span className="text-orange-600">{"Welcome"}</span>
              </div>
              <h2 className="text-2xl font-bold ">{`${name || ""}`}</h2>
              <i>{Role}</i>
            </div>
          </div>
          <img
            src={card_orange}
            alt="Total Toilets Icon"
            className="absolute bottom-0 right-0 h-full w-auto object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default UserCard;
