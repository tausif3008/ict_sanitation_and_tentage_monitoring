import React, { useEffect, useState } from "react";
import { Button } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { EditOutlined } from "@ant-design/icons";

import CommonTable from "../../commonComponents/CommonTable";
import CommonDivider from "../../commonComponents/CommonDivider";
import { getData } from "../../Fetch/Axios";
import URLS from "../../urils/URLS";
import RouteSelector from "./routeSelector";

const RouteList = () => {
  const [details, setDetails] = useState({
    list: [],
    pageLength: 25,
    currentPage: 1,
  });

  const navigate = useNavigate();
  const params = useParams();
  const { loading } = RouteSelector();

  const getDatas = async () => {
    const queryString = params?.page ? params?.page : params?.per_page;
    const urlParam = new URLSearchParams(queryString);
    const page = urlParam.get("page"); // "1"
    const perPage = urlParam.get("per_page"); // "50"

    const finalData = {
      date_format: "Date Range",
      page: page?.toString() || "1",
      per_page: perPage?.toString() || "100",
    };

    // setColumnDate(() => ({
    //   start: moment(finalData?.form_date).format("DD-MMM-YYYY"),
    //   end: moment(finalData?.to_date).format("DD-MMM-YYYY"),
    // }));

    // const formData = getFormData(finalData);
    // finalData?.form_date && dispatch(getInspectionReportData(formData)); // Fetch the data
  };

  const getUsers = async () => {
    let uri = URLS?.routes?.path + "/?";
    if (params.page) {
      uri = uri + params.page;
    } else if (params.per_page) {
      uri = uri + "&" + params.per_page;
    }

    const extraHeaders = { "x-api-version": URLS?.routes?.version };
    const res = await getData(uri, extraHeaders);

    if (res) {
      const data = res?.data;
      setDetails(() => {
        return {
          list: data.routes,
          pageLength: data.paging[0].length,
          currentPage: data.paging[0].currentPage,
          totalRecords: data.paging[0].totalrecords,
        };
      });
    }
  };

  useEffect(() => {
    getUsers();
  }, [params]);

  const columns = [
    {
      title: "Sr. No",
      dataIndex: "sr",
      key: "sr",
      width: 80,
    },
    {
      title: "Route Name",
      dataIndex: "route_name",
      key: "route_name",
    },
    {
      title: "Start Point",
      dataIndex: "start_point",
      key: "start_point",
    },
    {
      title: "End Point",
      dataIndex: "end_point",
      key: "end_point",
    },
    {
      title: "Distance (meters)",
      dataIndex: "distance",
      key: "distance",
    },
    {
      title: "Sector",
      dataIndex: "sector",
      key: "sector",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      fixed: "right",
      width: 80,
      render: (text, record) => (
        <>
          <div className="flex justify-between">
            <Button
              className="bg-blue-100 border-blue-500 focus:ring-blue-500 hover:bg-blue-200 rounded-full"
              onClick={() => {
                navigate(`/add-route`, {
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
    <div className="">
      <CommonDivider
        label={"GPS - Route List"}
        compo={
          <Button
            onClick={() => {
              navigate(`/add-route`, {
                state: {
                  key: "AddKey",
                },
              });
            }}
            className="mb-1 bg-green-400"
          >
            Add Route
          </Button>
        }
      ></CommonDivider>

      <CommonTable
        loading={loading}
        uri={"route-list"}
        columns={columns || []}
        details={details || []}
        scroll={{ x: 300, y: 400 }}
      ></CommonTable>
    </div>
  );
};

export default RouteList;
