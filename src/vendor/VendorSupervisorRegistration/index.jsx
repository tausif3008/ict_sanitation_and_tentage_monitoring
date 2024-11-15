import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
// import { Button } from "antd";
import {
  Collapse,
  Form,
  Input,
  Button,
  Select,
  notification,
  Row,
  Col,
} from "antd";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import CommonDivider from "../../commonComponents/CommonDivider";
import CommonSearchForm from "../../commonComponents/CommonSearchForm";
import CommonTable from "../../commonComponents/CommonTable";
import URLS from "../../urils/URLS";
import { getData } from "../../Fetch/Axios";
import { getVendorList } from "./Slice/VendorSupervisorSlice";
import VendorSupervisorSelector from "./Slice/VendorSupervisorSelector";
import { getValueLabel } from "../../constant/const";

const VendorSupervisorRegistration = () => {
  const params = useParams();
  const [searchQuery, setSearchQuery] = useState();
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState({
    list: [],
    pageLength: 25,
    currentPage: 1,
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { VendorListDrop } = VendorSupervisorSelector();

  const getUsers = async () => {
    setLoading(true);

    let uri = URLS.users.path + "/?";
    if (params.page) {
      uri = uri + params.page;
    }

    if (params.per_page) {
      uri = uri + "&" + params.per_page;
    }

    if (searchQuery) {
      uri = uri + searchQuery;
    }

    const extraHeaders = { "x-api-version": URLS.users.version };
    const res = await getData(uri, extraHeaders);

    if (res) {
      const data = res.data;
      setLoading(false);

      const list = data.users.map((el, index) => {
        return {
          ...el,
          sr: index + 1,
        };
      });

      setDetails(() => {
        return {
          list: list,
          pageLength: res?.data?.paging[0].length,
          currentPage: res?.data?.paging[0].currentPage,
          totalRecords: res?.data?.paging[0].totalrecords,
        };
      });
    }
  };

  useEffect(() => {
    getUsers(); // users
    dispatch(getVendorList()); // vendor list
  }, [params, searchQuery]);

  const columns = [
    {
      title: "Sr.No", // Asset main type
      dataIndex: "sr",
      key: "sr",
      width: 70,
    },
    {
      title: "Vendor Name",
      dataIndex: "vendor_id",
      key: "vendor_id",
      render: (text, record) => {
        return text ? getValueLabel(text, VendorListDrop, "NA") : "";
      },
    },
    {
      title: "Supervisor Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Mobile No.",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      fixed: "right",
      width: 80,
      render: (text, record) => {
        return (
          <Button
            className="bg-blue-100 border-blue-500 focus:ring-blue-500 hover:bg-blue-200 rounded-full"
            onClick={() => {
              navigate("/vendor-supervisor-form", {
                state: {
                  key: "UpdateKey",
                  record: record, // Pass the record as part of the state
                },
              });
            }}
          >
            <EditOutlined />
          </Button>
        );
      },
    },
  ];

  return (
    <div className="">
      <>
        <CommonDivider
          label={"Vendor Supervisor List"}
          compo={
            <Button
              className="bg-orange-300 mb-1"
              onClick={() =>
                navigate("/vendor-supervisor-form", {
                  state: {
                    key: "AddKey",
                  },
                })
              }
            >
              Add Supervisor
            </Button>
          }
        ></CommonDivider>
        <CommonSearchForm
          setSearchQuery={setSearchQuery}
          searchQuery={searchQuery}
          dropFields={[
            {
              name: "vendor_id",
              label: "Vendor Name",
              options: VendorListDrop || [],
            },
          ]}
          fields={[
            { name: "name", label: "Supervisor Name" },
            { name: "email", label: "Email" },
            { name: "phone", label: "Phone" },
          ]}
        ></CommonSearchForm>

        <CommonTable
          columns={columns}
          uri={"vendor-supervisor-registration"}
          loading={loading}
          details={details}
          setUserDetails={setDetails}
        ></CommonTable>
      </>
    </div>
  );
};

export default VendorSupervisorRegistration;
