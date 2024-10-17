import React, { useEffect, useState } from "react";
import CommonTable from "../../commonComponents/CommonTable";
import CommonDivider from "../../commonComponents/CommonDivider";
import { message } from "antd";
import { useParams } from "react-router-dom";
import URLS from "../../urils/URLS";
import { getData } from "../../Fetch/Axios";

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
  const [loading, setLoading] = useState(false);
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
        const response = await fetch(
          "https://kumbhtsmonitoring.in/php-api/sector",
          {
            method: "GET",
            headers: headers,
          }
        );
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

  const getSectors = async () => {
    setLoading(true);

    let uri = URLS.sectors.path + "/?";
    if (params.page) {
      uri = uri + params.page;
    } else if (params.per_page) {
      uri = uri + "&" + params.per_page;
    }

    const extraHeaders = { "x-api-version": URLS.users.version };
    const res = await getData(uri, extraHeaders);

    if (res) {
      const data = res.data;
      setLoading(false);

      const list = data.sectors?.map((sector) => ({
        name: sector.name,
        // circles: sector.circles,
      }));

      setDetails(() => {
        return {
          list,
          pageLength: data.paging[0].length,
          currentPage: data.paging[0].currentPage,
          totalRecords: data.paging[0].totalrecords,
        };
      });
    }
  };

  useEffect(() => {
    // getSectors();
  }, [params]);

  return (
    <div>
      <>
        <CommonDivider label={"Sectors List"} />
        <CommonTable
          loading={loading}
          columns={columns}
          uri={"sectors-listing"}
          details={details}
          setDetails={setDetails}
          scroll={{ x: 300, y: 400 }}
        />
      </>
    </div>
  );
};

export default SectorsListing;
