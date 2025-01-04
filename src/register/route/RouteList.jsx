import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { EditOutlined } from "@ant-design/icons";

import CommonTable from "../../commonComponents/CommonTable";
import CommonDivider from "../../commonComponents/CommonDivider";
import URLS from "../../urils/URLS";
import RouteSelector from "./routeSelector";
import { getRouteList } from "./routeSlice";

const RouteList = () => {
  const [details, setDetails] = useState({
    list: [],
    pageLength: 25,
    currentPage: 1,
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();
  const { RouteLists, loading } = RouteSelector();

  const getDatas = async () => {
    const queryString = params?.page ? params?.page : params?.per_page;
    const urlParam = new URLSearchParams(queryString);
    const page = urlParam.get("page"); // "1"
    const perPage = urlParam.get("per_page"); // "50"

    const finalData = {
      page: page?.toString() || "1",
      per_page: perPage?.toString() || "10",
    };

    let uri =
      URLS?.getPickUpRoute?.path +
      `?page=${finalData?.page}&per_page=${finalData?.per_page}`;

    dispatch(getRouteList(uri)); // Fetch the data
  };

  useEffect(() => {
    if (RouteLists) {
      const data = RouteLists?.data;
      setDetails(() => {
        return {
          list: data?.pickuproutes,
          pageLength: data?.paging[0].length,
          currentPage: data?.paging[0].currentPage,
          totalRecords: data?.paging[0].totalrecords,
        };
      });
    }
  }, [RouteLists]);

  useEffect(() => {
    getDatas();
  }, [params]);

  const columns = [
    {
      title: "Sr. No",
      dataIndex: "sr",
      key: "sr",
      width: 80,
    },
    {
      title: "Sector",
      dataIndex: "sector_id",
      key: "sector_id",
    },
    {
      title: "Vehicle Number",
      dataIndex: "vehicle_number",
      key: "vehicle_number",
    },
    {
      title: "Route Name",
      dataIndex: "route_name",
      key: "route_name",
    },
    {
      title: "Start Point",
      dataIndex: "start_point_name",
      key: "start_point_name",
    },
    {
      title: "End Point",
      dataIndex: "end_point_name",
      key: "end_point_name",
    },
    {
      title: "Distance (meters)",
      dataIndex: "distance",
      key: "distance",
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
