import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Typography, Input } from "antd";
import CommonDivider from "../../commonComponents/CommonDivider"; // Adjust path as necessary

const { Title } = Typography;
const { Search } = Input; // Import Search component from antd

const ParkingList = () => {
  const [parkings, setParkings] = useState([]);
  const [searchText, setSearchText] = useState(""); // State for search input

  const headers = {
    "Content-Type": "application/json",
    "x-api-key": "YunHu873jHds83hRujGJKd873",
    "x-api-version": "1.0.1",
    "x-platform": "Web",
    "x-access-token": localStorage.getItem("sessionToken") || "",
  };

  useEffect(() => {
    const fetchParkingData = async () => {
      try {
        const response = await axios.get(
          `https://kumbhtsmonitoring.in/php-api/parking`,
          {
            headers,
          }
        );

        if (response.data.success) {
          const parkingData = response.data.data.parkings;
          setParkings(parkingData);
        } else {
          console.error("Failed to fetch parking data:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching parking data:", error);
      }
    };

    fetchParkingData();
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

  const filteredParkings = parkings.filter((parking) =>
    parking.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const footer = () => (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "8px 16px",
      }}
    >
      <strong>Total Parking Count: {filteredParkings.length}</strong>
    </div>
  );

  return (
    <div style={{ padding: "24px" }}>
      <CommonDivider label={"Parking List"} />
      <Search
        placeholder="Search by Parking Name"
        onSearch={(value) => setSearchText(value)} // Update search text on search
        enterButton
        style={{ marginBottom: "16px" }}
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
