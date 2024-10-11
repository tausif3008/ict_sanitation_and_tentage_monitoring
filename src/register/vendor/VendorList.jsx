import React, { useEffect, useState } from "react";
import { Button } from "antd";
import CommonTable from "../../commonComponents/CommonTable";
import CommonDivider from "../../commonComponents/CommonDivider";
import URLS from "../../urils/URLS";
import { useNavigate, useParams } from "react-router";
import { getData } from "../../Fetch/Axios";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { setUpdateVendorEl, setVendorListIsUpdated } from "./vendorSlice";
import { Link } from "react-router-dom";

const columns = [
  // {
  //   title: "SrNo",
  //   dataIndex: "srno",
  //   key: "srno",
  //   width:75,
  // },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    width: 200,
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
    width: 250,
  },

  {
    title: "Phone",
    dataIndex: "phone",
    key: "phone",
    width: 110,
  },
  {
    title: "Company",
    dataIndex: "company",
    key: "company",
    width: 200,
  },
  // {
  //   title: "Code",
  //   dataIndex: "code",
  //   key: "code",
  //   width: 160,
  // },
  // {
  //   title: "Pin",
  //   dataIndex: "pin",
  //   key: "pin",
  // },
  {
    title: "Country",
    dataIndex: "country_name",
    key: "country_name",
    width: 100,
  },
  {
    title: "State",
    dataIndex: "state_name",
    key: "state_name",
    width: 120,
  },
  {
    title: "City",
    dataIndex: "city_name",
    key: "city_name",
    width: 120,
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
    width: 300,
  },
  {
    title: "Action",
    dataIndex: "action",
    key: "action",
    fixed: "right",
    width: 170,
  },
];

const VendorList = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState({
    list: [],
    pageLength: 25,
    currentPage: 1,
  });

  const isUpdatedSelector = useSelector(
    (state) => state.vendorUpdateEl?.isUpdated
  );

  const params = useParams();
  const navigate = useNavigate();

  const getDetails = async () => {
    setLoading(true);

    let uri = URLS.vendors.path + "&";
    if (params.page) {
      uri = uri + params.page;
    } else if (params.per_page) {
      uri = uri + "&" + params.per_page;
    }

    const extraHeaders = { "x-api-version": URLS.users.version };
    const res = await getData(uri, extraHeaders);

    if (res) {
      const data = res.data;
      setLoading(false);

      const list = data.users.map((el, index) => {
        return {
          ...el,
          action: (
            <div className="flex gap-2">
              <Button
                className="bg-blue-100 border-blue-500 focus:ring-blue-500 hover:bg-blue-200 rounded-full "
                key={el.name + index}
                onClick={() => {
                  dispatch(setUpdateVendorEl({ updateElement: el }));
                  navigate("/vendor-registration");
                }}
              >
                <EditOutlined></EditOutlined>
              </Button>

              <Link to={"/vendor/add-vendor-details/" + el.user_id}>
                <Button
                  className="bg-blue-100 border-blue-500 focus:ring-blue-500 hover:bg-blue-200 rounded-full "
                  key={el.name + index}
                >
                  <PlusOutlined></PlusOutlined> Details
                </Button>
              </Link>
            </div>
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
    getDetails();
    if (isUpdatedSelector) {
      dispatch(setVendorListIsUpdated({ isUpdated: false }));
    }
  }, [params, isUpdatedSelector]);

  useEffect(() => {
    dispatch(setUpdateVendorEl({ updateElement: null }));
  }, []);

  return (
    <div className="">
      <>
        <CommonDivider
          label={"Vendor List- Sanitation"}
          compo={
            <Button
              className="bg-orange-300 mb-1"
              onClick={() => {
                navigate("/vendor-registration");
              }}
            >
              Add Vendor
            </Button>
          }
        ></CommonDivider>

        <CommonTable
          columns={columns}
          uri={"vendor"}
          details={details}
          loading={loading}
        ></CommonTable>
      </>
    </div>
  );
};

export default VendorList;
