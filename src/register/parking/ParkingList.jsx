import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { Table, Input, Button } from "antd";
import CommonDivider from "../../commonComponents/CommonDivider"; // Adjust path as necessary
import { getParkingData } from "./parkingSlice";
import URLS from "../../urils/URLS";
import ParkingSelector from "./parkingSelector";

const { Search } = Input; // Import Search component from antd

const ParkingList = () => {
  const [searchText, setSearchText] = useState(""); // State for search input
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { parkingData } = ParkingSelector(); // parking data

  useEffect(() => {
    const url = URLS?.parking?.path;
    dispatch(getParkingData(url)); // get parking data
  }, []);

  const columns = [
    {
      title: "Sr. No.",
      dataIndex: "sr_no",
      key: "sr_no",
      width: 100,
      render: (text, record, index) => index + 1,
    },
    { title: "Parking Name", dataIndex: "name", key: "name" },
  ];

  const filteredParkings = parkingData?.data?.parkings?.filter((parking) =>
    parking?.name?.toLowerCase().includes(searchText.toLowerCase())
  );

  const footer = () => (
    <div className="flex justify-between p-2 px-4">
      <strong>Total Parking Count: {filteredParkings?.length}</strong>
    </div>
  );

  return (
    <div>
      <CommonDivider
        label={"Parking List"}
        compo={
          <Button
            onClick={() =>
              navigate("/add-parking-form", {
                state: {
                  key: "AddKey",
                },
              })
            }
            className="bg-orange-300 mb-1"
          >
            Add Parking
          </Button>
        }
      ></CommonDivider>
      <Search
        placeholder="Search by Parking Name"
        onSearch={(value) => setSearchText(value)} // Update search text on search
        enterButton
        className="mb-4"
      />
      <Table
        columns={columns}
        dataSource={filteredParkings} // Use filtered parkings for display
        rowKey="parking_id"
        pagination={{ pageSize: 10 }}
        bordered
        footer={footer}
      />
    </div>
  );
};

export default ParkingList;
