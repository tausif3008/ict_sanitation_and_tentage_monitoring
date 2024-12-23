import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Form, Button, Divider } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { postData } from "../../Fetch/Axios";
import URLS from "../../urils/URLS";
import { getFormData } from "../../urils/getFormData";
import CountryStateCity from "../../commonComponents/CountryStateCity";
import CustomInput from "../../commonComponents/CustomInput";

const VendorRegistrationForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const key = location.state?.key;
  const record = location.state?.record;

  const onFinish = async (values) => {
    setLoading(true);
    values.status = 1;
    values.user_type_id = 8;
    if (key === "UpdateKey") {
      values.user_id = record.user_id;
    }
    const res = await postData(
      getFormData(values),
      key === "UpdateKey" ? URLS.editUser.path : URLS.register.path,
      {
        version: URLS.register.version,
      }
    );
    if (res) {
      if (res.data.success) {
        form.resetFields();
        navigate("/vendor");
      }
    }
    setLoading(false);
  };

  // set value
  useEffect(() => {
    if (key === "UpdateKey") {
      form.setFieldsValue(record);
    }
  }, [record, key]);

  return (
    <div className="mt-3">
      <div className="mx-auto p-3 bg-white shadow-md rounded-lg mt-3 w-full">
        <div className="flex gap-2 items-center">
          <Button
            className="bg-gray-200 rounded-full w-9 h-9"
            onClick={() => {
              navigate("/vendor");
            }}
          >
            <ArrowLeftOutlined />
          </Button>
          <div className="text-d9 text-2xl w-full flex items-end justify-between ">
            <div className="font-bold">
              {key === "UpdateKey"
                ? "Update Vendor Details"
                : "Vendor Registration"}
            </div>
            <div className="text-xs">All * marks fields are mandatory</div>
          </div>
        </div>
        <Divider className="bg-d9 h-2/3 mt-1" />
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-5">
            <CustomInput
              label={
                <div className="font-semibold">Mobile Number (Username)</div>
              }
              name="phone"
              placeholder="Mobile Number"
              maxLength={10} // by default type is text
              autoComplete="off"
              accept={"onlyNumber"}
              rules={[
                {
                  required: true,
                  message: "Please enter the mobile number!",
                },
                {
                  pattern: /^[0-9]{10}$/,
                  message: "Please enter a valid 10-digit mobile number",
                },
              ]}
            />
            <CustomInput
              label={<div className="font-semibold">Vendor Name</div>}
              name="name"
              rules={[{ required: true, message: "Please enter name" }]}
              placeholder={"Vendor Name"}
            />
            <CustomInput
              label={<div className="font-semibold">Email ID</div>}
              name="email"
              rules={[
                { required: true, message: "Please enter the email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
              placeholder={"Email ID"}
            />
            <CountryStateCity
              form={form}
              country_id={record?.country_id}
              state_id={record?.state_id}
              city_id={record?.city_id}
            />
            <CustomInput
              type="textarea"
              label={<div className="font-semibold">Address</div>}
              name="address"
              rules={[{ required: true, message: "Please enter the address" }]}
              placeholder={"Address"}
            />
            {!key === "UpdateKey" && (
              <CustomInput
                label={<div className="font-semibold">Password</div>}
                name="password"
                placeholder="Password"
                maxLength={15}
                autoComplete="off"
                isPassword={true}
                rules={[
                  {
                    required: true,
                    message: "Please enter your password!",
                  },
                  {
                    min: 6,
                    message: "Password must be at least 6 characters.",
                  },
                ]}
              />
            )}
          </div>
          <div className="flex justify-end">
            <Form.Item>
              <Button
                loading={loading}
                type="primary"
                htmlType="submit"
                className="w-fit rounded-none bg-5c"
              >
                {key === "UpdateKey" ? "Update" : "Register"}
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default VendorRegistrationForm;
