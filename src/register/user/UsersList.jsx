import React, { useContext, useEffect, useState } from "react";
import { Table, Image, Button } from "antd";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import UserRegistrationForm from "./UserRegistrationForm";
import CommonTable from "../../commonComponents/CommonTable";
import CommonDivider from "../../commonComponents/CommonDivider";
import { getData } from "../../Fetch/Axios";
import URLS from "../../urils/URLS";
import { EditOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { setUpdateUserEl, setUserListIsUpdated } from "./userSlice";
import CommonSearchForm from "../../commonComponents/CommonSearchForm";
import UserTypeDropDown from "./UserTypeDropDown";

const getVal = (val) => {
  if (val === "undefined" || val === null) {
    return "-";
  } else {
    return val;
  }
};

const columns = [
  {
    title: "User Type",
    dataIndex: "user_type",
    key: "user_type",
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Phone (Username)",
    dataIndex: "phone",
    key: "Phone",
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
    width: 250,
  },
  {
    title: "Country",
    dataIndex: "country_name",
    key: "country_name",
    render: getVal,
  },
  {
    title: "State",
    dataIndex: "state_name",
    key: "state_name",
    render: getVal,
  },
  {
    title: "City",
    dataIndex: "city_name",
    key: "city_type",
    render: getVal,
  },

  {
    title: "Address",
    dataIndex: "address",
    width: 300,
    key: "address",
    render: (val) => {
      if (val === "undefined") {
        return "-";
      } else {
        return val;
      }
    },
  },

  {
    title: "Action",
    dataIndex: "action",
    key: "action",
    fixed: "right",
    width: 80,
  },
];

const UserList = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const isUpdatedSelector = useSelector(
    (state) => state.userUpdateEl?.isUpdated
  );

  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState({
    list: [],
    pageLength: 25,
    currentPage: 1,
  });

  const params = useParams();

  const [searchQuery, setSearchQuery] = useState();

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
          action: (
            <Button
              className="bg-blue-100 border-blue-500 focus:ring-blue-500 hover:bg-blue-200 rounded-full "
              key={el.name + index}
              onClick={() => {
                dispatch(setUpdateUserEl({ updateElement: el }));
                navigate("/user-registration");
              }}
            >
              <EditOutlined></EditOutlined>
            </Button>
          ),
        };
      });

      setUserDetails(() => {
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
      dispatch(setUserListIsUpdated({ isUpdated: false }));
    }
  }, [params, isUpdatedSelector, searchQuery]);

  useEffect(() => {
    dispatch(setUpdateUserEl({ updateElement: null }));
  }, []);

  const [form, setForm] = useState();

  return (
    <div className="">
      <CommonDivider
        label={"User List"}
        compo={
          <Button
            onClick={() => navigate("/user-registration")}
            className="bg-orange-300 mb-1"
          >
            Add User
          </Button>
        }
      ></CommonDivider>
      <CommonSearchForm
        setForm={setForm}
        setSearchQuery={setSearchQuery}
        searchQuery={searchQuery}
        fields={[
          { name: "name", label: "Name" },
          { name: "email", label: "Email" },
          { name: "phone", label: "Phone" },
          { name: "company", label: " Company" },
        ]}
        dropdown={
          <UserTypeDropDown
            required={false}
            form={form}
            showLabel // means not visible
          ></UserTypeDropDown>
        }
      ></CommonSearchForm>
      <div className="h-3"></div>
      <CommonTable
        loading={loading}
        uri={"users"}
        columns={columns}
        details={userDetails}
        setUserDetails={setUserDetails}
      ></CommonTable>
    </div>
  );
};

export default UserList;
