import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
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
import { getValueLabel } from "../../constant/const";
import VendorSupervisorSelector from "../../vendor/VendorSupervisorRegistration/Slice/VendorSupervisorSelector";
import { getVendorList } from "../../vendor/VendorSupervisorRegistration/Slice/VendorSupervisorSlice";
import { getSectorsList } from "./Slice/vendorSectorSlice";
import VendorSectorSelectors from "./Slice/vendorSectorSelectors";

// sector allocation
const VendorSectorAllocation = () => {
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
  const { SectorListDrop } = VendorSectorSelectors();

  const getUsers = async () => {
    setLoading(true);

    let uri = URLS.getAllocate_Sector.path + "/?";
    if (params.page) {
      uri = uri + params.page;
    }

    if (params.per_page) {
      uri = uri + "&" + params.per_page;
    }

    if (searchQuery) {
      uri = uri + searchQuery;
    }

    const extraHeaders = {
      "x-api-version": URLS.getAllocate_Supervisor.version,
    };
    const res = await getData(uri, extraHeaders);

    if (res) {
      const data = res.data;
      setLoading(false);

      const list = data.listings.map((el, index) => {
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
    dispatch(getSectorsList()); // sector list
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
      title: "Supervisor Name",
      dataIndex: "supervisor_name",
      key: "supervisor_name",
    },
    // {
    //   title: "Email",
    //   dataIndex: "email",
    //   key: "email",
    // },
    {
      title: "Mobile No.",
      dataIndex: "supervisor_phone",
      key: "supervisor_phone",
    },
    {
      title: "Sector Name",
      dataIndex: "sector_id",
      key: "sector_id",
      render: (text, record) => {
        return text ? getValueLabel(text, SectorListDrop, "NA") : "";
      },
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
              navigate("/sector-allocation-form", {
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
          label={"Allocate Sectors"}
          compo={
            <Button
              className="bg-orange-300 mb-1"
              onClick={() =>
                navigate("/sector-allocation-form", {
                  state: {
                    key: "AddKey",
                  },
                })
              }
            >
              Add
            </Button>
          }
        ></CommonDivider>
        {/* <CommonSearchForm
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
        ></CommonSearchForm> */}

        <CommonTable
          columns={columns}
          uri={"sector-allocation"}
          loading={loading}
          details={details}
          setUserDetails={setDetails}
        ></CommonTable>
      </>
    </div>
  );
};

export default VendorSectorAllocation;
