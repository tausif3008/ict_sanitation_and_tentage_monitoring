import React, { useEffect, useState } from "react";
import CommonTable from "../../commonComponents/CommonTable";
import CommonDivider from "../../commonComponents/CommonDivider";
import { message } from "antd";
import { useParams } from "react-router-dom";
import { basicUrl } from "../../Axios/commonAxios";

const columns = [
  {
    title: "Sector Name",
    dataIndex: "name",
    key: "name",
    width: 200,
  },
  {
    title: "Circles",
    dataIndex: "circles",
    key: "circles",
    width: 200,
  },
];

const SectorsListing = () => {
  const [sectorData, setSectorData] = useState([]);
  const [details, setDetails] = useState({
    list: [],
    pageLength: 25,
    currentPage: 1,
    totalRecords: 0,
  });

  const params = useParams();

  const headers = {
    "Content-Type": "application/json",
    "x-api-key": "YunHu873jHds83hRujGJKd873",
    "x-api-version": "1.0.1",
    "x-platform": "Web",
    "x-access-token": localStorage.getItem("sessionToken") || "",
  };

  useEffect(() => {
    const fetchSectorData = async () => {
      try {
        const response = await fetch(`${basicUrl}/sector`, {
          method: "GET",
          headers: headers,
        });
        const result = await response.json();

        if (result.success) {
          setSectorData(result.data.sectors || []);
          setDetails((prevDetails) => ({
            ...prevDetails,
            list: result.data.sectors || [],
            totalRecords: result.data.sectors.length,
          }));
        } else {
          message.error("Failed to load details.");
        }
      } catch (error) {
        message.error("Error fetching details.");
      }
    };
    fetchSectorData();
  }, []);

  return (
    <div>
      <>
        <CommonDivider label={"Sectors List"} />
        <CommonTable columns={columns} details={details} />
      </>
    </div>
  );
};

export default SectorsListing;
