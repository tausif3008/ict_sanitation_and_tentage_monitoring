import React, { useEffect, useState } from "react";
import { Button } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import CommonTable from "../../commonComponents/CommonTable";
import CommonDivider from "../../commonComponents/CommonDivider";
import { getData } from "../../Fetch/Axios";
import URLS from "../../urils/URLS";
import { useDispatch, useSelector } from "react-redux";
import { setUpdateUserEl, setUserListIsUpdated } from "./parkingSlice";
import CommonSearchForm from "../../commonComponents/CommonSearchForm";

const columns = [
  {
    title: "Sr. No",
    dataIndex: "sr",
    key: "sr",
    width: 180,
  },
  {
    title: "Parking Name",
    dataIndex: "name",
    key: "name",
  },
];

const ParkingList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <div>
      <CommonDivider label={"Parking List"} />
      <CommonSearchForm
        // setForm={setSearchQuery}
        // setSearchQuery={setSearchQuery}
        // searchQuery={searchQuery}
        fields={[{ name: "name", label: "Name" }]}
      />
      {/* <div className="h-3"></div>
      <CommonTable
        loading={loading}
        uri={"parking"}
        columns={columns}
        details={userDetails}
        setUserDetails={setUserDetails}
      /> */}
    </div>
  );
};

export default ParkingList;
