import React, { useEffect, useState } from "react";
import { Table, Button } from "antd";
import { useNavigate } from "react-router-dom";
import CommonDivider from "../commonComponents/CommonDivider";
import { getData, postData } from "../Fetch/Axios";
import URLS from "../urils/URLS";
import { basicUrl } from "../Axios/commonAxios";

const columns = [
  {
    title: "Sr. No",
    dataIndex: "sr",
    key: "sr",
    width: 80,
  },
  {
    title: "Circle Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Sector ID",
    dataIndex: "sector_id",
    key: "sector_id",
  },
  {
    title: "Registered",
    dataIndex: "registered",
    key: "registered",
  },
  {
    title: "Clean",
    dataIndex: "clean",
    key: "clean",
  },
  {
    title: "Unclean",
    dataIndex: "unclean",
    key: "unclean",
  },
];

const VendorWiseReport = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [circleDetails, setCircleDetails] = useState({
    list: [],
    pageLength: 50,
    currentPage: 1,
  });

  const getCircleData = async () => {
    setLoading(true);
    const uri = URLS.vendorReporting.path;
    const r = basicUrl + uri;
    const res = await postData(r);

    if (res && res.data && res.data.circles) {
      const data = res.data;
      const list = data.circles.map((circle, index) => ({
        ...circle,
        sr: index + 1,
      }));

      setCircleDetails({
        list,
        pageLength: data.paging[0].length,
        currentPage: data.paging[0].currentpage,
        totalRecords: data.paging[0].totalrecords,
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    getCircleData();
  }, []);

  return (
    <div>
      <CommonDivider
        label={"Vendor-Wise Report"}
        compo={
          <Button
            onClick={() => navigate("/circle-registration")}
            className="bg-orange-300 mb-1"
          >
            Add Vendor report
          </Button>
        }
      />
      <div className="h-3"></div>
      <Table
        loading={loading}
        columns={columns}
        dataSource={circleDetails.list}
        pagination={{
          pageSize: circleDetails.pageLength,
          current: circleDetails.currentPage,
          total: circleDetails.totalRecords,
        }}
        rowKey="circle_id"
      />
    </div>
  );
};

export default VendorWiseReport;
