import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "antd";
import { EditOutlined } from "@ant-design/icons";

import CommonTable from "../../commonComponents/CommonTable";
import CommonDivider from "../../commonComponents/CommonDivider";
import URLS from "../../urils/URLS";
import RouteSelector from "./routeSelector";
import { getRoutePickUpPoint } from "./routeSlice";

const PickUpPoint = () => {
  const [details, setDetails] = useState({
    list: [],
    pageLength: 25,
    currentPage: 1,
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();
  const { loading, PickUpPoint } = RouteSelector();

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
      URLS?.getPickUpPoint?.path +
      `?page=${finalData?.page}&per_page=${finalData?.per_page}`;

    dispatch(getRoutePickUpPoint(uri)); // Fetch the data
  };

  useEffect(() => {
    if (PickUpPoint) {
      const data = PickUpPoint?.data;
      setDetails(() => {
        return {
          list: data?.pickuppoints,
          pageLength: data?.paging[0].length,
          currentPage: data?.paging[0].currentPage,
          totalRecords: data?.paging[0].totalrecords,
        };
      });
    }
  }, [PickUpPoint]);

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
      title: "Point Name",
      dataIndex: "point_name",
      key: "point_name",
    },
    {
      title: "Latitude",
      dataIndex: "latitude",
      key: "latitude",
    },
    {
      title: "Longitude",
      dataIndex: "longitude",
      key: "longitude",
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
                navigate(`/pickup-point-form`, {
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
        label={"GPS -Pick Up Point"}
        compo={
          <Button
            onClick={() => {
              navigate(`/pickup-point-form`, {
                state: {
                  key: "AddKey",
                },
              });
            }}
            className="mb-1 bg-green-400"
          >
            Add Pickup Point
          </Button>
        }
      ></CommonDivider>

      <CommonTable
        loading={loading}
        uri={"pickup-point"}
        columns={columns || []}
        details={details || []}
        scroll={{ x: 300, y: 400 }}
      ></CommonTable>
    </div>
  );
};

export default PickUpPoint;
