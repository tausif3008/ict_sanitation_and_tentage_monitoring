import React, { useEffect, useState } from "react";
import { Button } from "antd";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { getConfigSettings } from "./configSettingSlice/configSlice";
import ConfigSettingSelector from "./configSettingSlice/configSelector";
import CommonTable from "../commonComponents/CommonTable";
import CommonDivider from "../commonComponents/CommonDivider";
import { EditOutlined } from "@ant-design/icons";
import { getUsersList } from "../register/user/userSlice";
import { getValueLabel } from "../constant/const";

const ConfigSetting = () => {
  const dispatch = useDispatch();
  const { ConfigSettingData, loading } = ConfigSettingSelector();
  // const { UsersDropdown } = UserSelectors();

  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState();
  const [details, setDetails] = useState({
    list: [],
    pageLength: 25,
    currentPage: 1,
  });

  useEffect(() => {
    if (ConfigSettingData) {
      setDetails(() => {
        return {
          list: ConfigSettingData?.data?.settings,
          pageLength: 0,
        };
      });
    }
  }, [ConfigSettingData]);

  useEffect(() => {
    dispatch(getConfigSettings()); // get config setting data
    // dispatch(getUsersList()); // get users list

    return () => {};
  }, []);

  const columns = [
    {
      title: "Sr. No", // Asset main type
      dataIndex: "sr",
      key: "sr",
      width: 70,
    },
    {
      title: "Name",
      dataIndex: "user_id",
      key: "user_id",
      // render: (text) => {
      //   return text ? getValueLabel(text, UsersDropdown, "user") : "";
      // },
      width: 200,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 250,
    },

    {
      title: "Mobile No.",
      dataIndex: "phone",
      key: "phone",
      width: 110,
    },
    {
      title: "Geofencing Value",
      dataIndex: "geofencing_meter_value",
      key: "geofencing_meter_value",
      width: 120,
    },
    {
      title: "Complaint on",
      dataIndex: "complaint_contact_number",
      key: "complaint_contact_number",
      width: 120,
    },
    {
      title: "Complaint mail id",
      dataIndex: "complaint_email_id",
      key: "complaint_email_id",
      width: 120,
    },
    {
      title: "Helpline No",
      dataIndex: "help_line_number",
      key: "help_line_number",
      width: 300,
    },
    {
      title: "Monitoring Per Day",
      dataIndex: "allow_monitoring_per_day",
      key: "allow_monitoring_per_day",
      width: 160,
    },
    {
      title: "Status",
      dataIndex: "allow_offline",
      key: "allow_offline",
      width: 160,
      render: (text) => {
        return text === "1" ? "Online" : "Offline";
      },
    },
    {
      title: "App Version",
      dataIndex: "app_version",
      key: "app_version",
      width: 170,
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      fixed: "right",
      width: 100,
      render: (text, record) => {
        return (
          <Button
            className="bg-blue-100 border-blue-500 focus:ring-blue-500 hover:bg-blue-200 rounded-full"
            onClick={() => {
              navigate("/config-setting-form", {
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
          label={"Configuration Settings"}
          // compo={
          //   <Button
          //     className="bg-orange-300 mb-1"
          //     onClick={() => {
          //       navigate("/vendor-registration");
          //     }}
          //   >
          //     Add Vendor
          //   </Button>
          // }
        ></CommonDivider>

        {/* <CommonSearchForm
          setSearchQuery={setSearchQuery}
          searchQuery={searchQuery}
          fields={[
            { name: "name", label: "Name" },
            { name: "email", label: "Email" },
            { name: "phone", label: "Phone" },
            // { name: "index_no", label: "Index No." },
          ]}
        ></CommonSearchForm> */}

        <CommonTable
          columns={columns}
          uri={"config-setting"}
          details={details}
          loading={loading}
        ></CommonTable>
      </>
    </div>
  );
};

export default ConfigSetting;
