import React, { useEffect, useState } from "react";
import optionsMaker from "../../urils/OptionMaker";
import { getData } from "../../Fetch/Axios";
import URLS from "../../urils/URLS";
import { Form, Select } from "antd";
import { staticUserRole } from "../../constant/const";

const BeforeLoginUserTypeDropDown = ({ form, required = true, showLabel }) => {
  // const [userTypesOnLogin, setUserTypes] = useState([]);

  // useEffect(() => {
  //   optionsMaker(
  //     "userTypeLogin",
  //     "user_type",
  //     "user_type",
  //     setUserTypes,
  //     "",
  //     "user_type_id"
  //   );
  // }, [form]);

  return (
    <Form.Item
      name="user_type_id"
      rules={[{ required: required, message: "Please select User Type" }]}
      className="mb-4"
    >
      <Select
        placeholder="Select a User Type"
        className="rounded-none w-full" // Ensure full width
        options={staticUserRole || []}
        // options={userTypesOnLogin || []}
        allowClear
        showSearch={true}
        filterOption={(input, option) => {
          return option?.label?.toLowerCase()?.includes(input?.toLowerCase());
        }}
      />
    </Form.Item>
  );
};

export default BeforeLoginUserTypeDropDown;
