import React, { useEffect, useState } from "react";
import { Button } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { EditOutlined } from "@ant-design/icons";

import CommonTable from "../../commonComponents/CommonTable";
import CommonDivider from "../../commonComponents/CommonDivider";
import { getData } from "../../Fetch/Axios";
import URLS from "../../urils/URLS";
import RouteSelector from "./routeSelector";

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
    width: 100,
  },
];

const RouteList = () => {
  const navigate = useNavigate();
  const [details, setDetails] = useState({
    list: [],
    pageLength: 25,
    currentPage: 1,
  });

  const { loading } = RouteSelector();

  const params = useParams();

  const getUsers = async () => {
    // setLoading(true);

    let uri = URLS?.routes?.path + "/?";
    if (params.page) {
      uri = uri + params.page;
    } else if (params.per_page) {
      uri = uri + "&" + params.per_page;
    }

    const extraHeaders = { "x-api-version": URLS?.routes?.version };
    const res = await getData(uri, extraHeaders);

    if (res) {
      const data = res.data;
      // setLoading(false);

      const list = data.routes?.map((el, index) => {
        return {
          ...el,
          sr: index + 1,
          action: (
            <Button
              className="bg-blue-100 border-blue-500 focus:ring-blue-500 hover:bg-blue-200 rounded-full "
              key={el.name + index}
              onClick={() => {
                navigate("/add-route");
              }}
            >
              <EditOutlined></EditOutlined>
            </Button>
          ),
        };
      });

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
    getUsers();
  }, [params]);

  return (
    <div className="">
      <CommonDivider
        label={"GPS - Route List"}
        compo={
          <Button
            onClick={() => navigate("/add-route")}
            className="mb-1 bg-green-400"
          >
            Add Route
          </Button>
        }
      ></CommonDivider>

      <CommonTable
        loading={loading}
        uri={"routes"}
        columns={columns}
        details={details}
        scroll={{ x: 300, y: 400 }}
      ></CommonTable>
    </div>
  );
};

export default RouteList;
