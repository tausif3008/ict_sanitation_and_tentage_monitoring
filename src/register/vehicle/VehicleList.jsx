import React, { useEffect, useState } from "react";
import { Button } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { EditOutlined } from "@ant-design/icons";
import CommonTable from "../../commonComponents/CommonTable";
import CommonDivider from "../../commonComponents/CommonDivider";
import { getData } from "../../Fetch/Axios";
import URLS from "../../urils/URLS";

const VehicleList = () => {
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState({
    list: [],
    pageLength: 25,
    currentPage: 1,
  });

  const navigate = useNavigate();
  const params = useParams();

  const getUsers = async () => {
    setLoading(true);
    let uri = URLS.vehicles.path + "/?";
    if (params.page) {
      uri = uri + params.page;
    } else if (params.per_page) {
      uri = uri + "&" + params.per_page;
    }

    const extraHeaders = { "x-api-version": URLS.vehicles.version };
    const res = await getData(uri, extraHeaders);

    if (res) {
      const data = res?.data;
      setLoading(false);
      setDetails(() => {
        return {
          list: data?.vehicles,
          pageLength: data?.paging[0].length,
          currentPage: data?.paging[0].currentPage,
          totalRecords: data?.paging[0].totalrecords,
        };
      });
    }
  };

  useEffect(() => {
    getUsers();
  }, [params]);

  const columns = [
    {
      title: "Sr. No", // Asset main type
      dataIndex: "sr",
      key: "sr",
      width: 80,
    },
    {
      title: "Vendor Name",
      dataIndex: "user_name",
      key: "user_name",
    },
    {
      title: "Vehicle Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Vehicle Number",
      dataIndex: "number",
      key: "number",
    },
    {
      title: "IMEI Number",
      dataIndex: "imei",
      key: "imei",
    },
    {
      title: "Chassis Number",
      dataIndex: "chassis_no",
      key: "chassis_no",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      fixed: "right",
      width: 100,
      render: (text, record) => (
        <>
          <div className="flex justify-between">
            <Button
              className="bg-blue-100 border-blue-500 focus:ring-blue-500 hover:bg-blue-200 rounded-full"
              onClick={() => {
                navigate(`/vehicle-registration`, {
                  state: {
                    key: "UpdateKey",
                    record: record, // Pass the record as part of the state
                  },
                });
              }}
            >
              <EditOutlined />
            </Button>
          </div>
        </>
      ),
    },
  ];

  return (
    <div className="container mx-auto px-4">
      <CommonDivider
        label={"Vehicle List"}
        compo={
          <Button
            onClick={() => navigate("/vehicle-registration")}
            // className="mb-1 bg-green-400"
            className="bg-orange-300 mb-1"
          >
            Add Vehicle
          </Button>
        }
      />

      <CommonTable
        loading={loading}
        uri={"vehicle"}
        columns={columns || []}
        details={details}
        scroll={{ x: 1200, y: 400 }}
        tableSubheading={{
          "Total Records": details?.totalRecords || 0,
        }}
      />
    </div>
  );
};

export default VehicleList;
