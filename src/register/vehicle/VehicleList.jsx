import React, { useEffect, useState } from "react";
import { Button } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import CommonTable from "../../commonComponents/CommonTable";
import CommonDivider from "../../commonComponents/CommonDivider";
import { getData } from "../../Fetch/Axios";
import URLS from "../../urils/URLS";
import { EditOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { setVehicleListIsUpdated, setUpdateVehicleEl } from "./vehicleSlice";

const columns = [
  {
    title: "Sr. No", // Asset main type
    dataIndex: "sr",
    key: "sr",
    width: 80,
  },
  {
    title: "User Name",
    dataIndex: "user_name",
    key: "user_name",
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Type",
    dataIndex: "type",
    key: "type",
  },
  {
    title: "Number",
    dataIndex: "number",
    key: "number",
  },
  {
    title: "RC",
    dataIndex: "rc",
    key: "rc",
  },
  {
    title: "Action",
    dataIndex: "action",
    key: "action",
    fixed: "right",
    width: 100,
  },
];

const VehicleList = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState({
    list: [],
    pageLength: 25,
    currentPage: 1,
  });

  const dispatch = useDispatch();

  const isUpdatedSelector = useSelector(
    (state) => state.vehicleUpdateEl?.isUpdated
  );

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
      const data = res.data;
      setLoading(false);

      const list = data.vehicles.map((el, index) => {
        return {
          ...el,
          sr: index + 1,
          action: (
            <Button
              className="bg-blue-100 border-blue-500 focus:ring-blue-500 hover:bg-blue-200 rounded-full "
              key={el.name + index}
              onClick={() => {
                dispatch(setUpdateVehicleEl({ updateElement: el }));
                navigate("/vehicle-registration");
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
    if (isUpdatedSelector) {
      dispatch(setVehicleListIsUpdated({ isUpdated: false }));
    }
  }, [params, isUpdatedSelector]);

  useEffect(() => {
    dispatch(setUpdateVehicleEl({ updateElement: null }));
  }, []);

  return (
    <div className="">
      <CommonDivider
        label={"Vehicle List"}
        compo={
          <Button
            onClick={() => navigate("/vehicle-registration")}
            className="mb-1 bg-green-400"
          >
            Add Vehicle
          </Button>
        }
      ></CommonDivider>

      <CommonTable
        loading={loading}
        uri={"questions"}
        columns={columns}
        details={details}
        scroll={{ x: 300, y: 400 }}
      ></CommonTable>
    </div>
  );
};

export default VehicleList;
