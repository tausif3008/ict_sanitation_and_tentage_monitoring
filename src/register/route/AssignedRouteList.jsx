import React, { useEffect, useState } from "react";
import { Button } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import CommonTable from "../../commonComponents/CommonTable";
import CommonDivider from "../../commonComponents/CommonDivider";
import { getData } from "../../Fetch/Axios";
import URLS from "../../urils/URLS";
import { EditOutlined } from "@ant-design/icons";

const columns = [
  {
    title: "Sr. No",
    dataIndex: "sr",
    key: "sr",
    width: 80,
  },
  {
    title: "Vehicle Number",
    dataIndex: "vehicle_number",
    key: "vehicle_number",
  },

  {
    title: "Assigned Route",
    dataIndex: "route_name",
    key: "route_name",
  },

  {
    title: "Action",
    dataIndex: "action",
    key: "action",
    fixed: "right",
    width: 100,
  },
];

const AssignedRouteList = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState({
    list: [],
    pageLength: 25,
    currentPage: 1,
  });

  const params = useParams();

  const getUsers = async () => {
    setLoading(true);

    let uri = URLS?.assignroutes?.path + "/?";
    if (params.page) {
      uri = uri + params.page;
    } else if (params.per_page) {
      uri = uri + "&" + params.per_page;
    }

    const extraHeaders = { "x-api-version": URLS?.assignroutes?.version };
    const res = await getData(uri, extraHeaders);

    if (res) {
      const data = res.data;
      setLoading(false);

      const list = data.assignroutes?.map((el, index) => {
        return {
          ...el,
          sr: index + 1,
          action: (
            <Button
              className="bg-blue-100 border-blue-500 focus:ring-blue-500 hover:bg-blue-200 rounded-full "
              key={el.name + index}
              onClick={() => {
                navigate("/assign-route");
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
        label={"Assigned Route List"}
        compo={
          <Button
            onClick={() => navigate("/assign-route")}
            className="mb-1 bg-green-400"
          >
            Assign Route
          </Button>
        }
      ></CommonDivider>

      <CommonTable
        loading={loading}
        uri={"assignroutes"}
        columns={columns}
        details={details}
        scroll={{ x: 300, y: 400 }}
      ></CommonTable>
    </div>
  );
};

export default AssignedRouteList;
