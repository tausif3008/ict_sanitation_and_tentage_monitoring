import React, { useEffect, useState } from "react";
import { Form, Input, Button, Divider } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { postData } from "../../Fetch/Axios";
import URLS from "../../urils/URLS";
import { getFormData } from "../../urils/getFormData";
import CountryStateCity from "../../commonComponents/CountryStateCity";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { setVendorListIsUpdated } from "./vendorSlice";
const { TextArea } = Input;

const VendorRegistrationForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const vendorUpdateElSelector = useSelector(
    (state) => state.vendorSlice?.vendorUpdateEl
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (vendorUpdateElSelector) {
      form.setFieldsValue(vendorUpdateElSelector);
    }
  }, [vendorUpdateElSelector, form]);

  const onFinish = async (values) => {
    setLoading(true);

    values.status = 1;
    values.user_type_id = 8;

    if (vendorUpdateElSelector) {
      values.user_id = vendorUpdateElSelector.user_id;
    }

    const res = await postData(
      getFormData(values),
      vendorUpdateElSelector ? URLS.editUser.path : URLS.register.path,
      {
        version: URLS.register.version,
      }
    );

    if (res) {
      setLoading(false);
      if (res.data.success) {
        form.resetFields();
        dispatch(setVendorListIsUpdated({ isUpdated: true }));

        if (vendorUpdateElSelector) {
          navigate("/vendor");
        }
      }
    }
  };

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
              {vendorUpdateElSelector
                ? "Update Vendor Details"
                : "Vendor Registration"}
            </div>
            <div className="text-xs">All * marks fields are mandatory</div>
          </div>
        </div>

        <Divider className="bg-d9 h-2/3 mt-1" />

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-5">
            <Form.Item
              label={
                <div className="font-semibold">Mobile Number (Username)</div>
              }
              name="phone"
              rules={[
                { required: true, message: "Please enter the mobile number" },
                {
                  pattern: /^[0-9]{10}$/,
                  message: "Please enter a valid 10-digit mobile number",
                },
              ]}
              className="mb-4"
            >
              <Input
                placeholder="Enter mobile number"
                className="rounded-none "
              />
            </Form.Item>

            <Form.Item
              label={<div className="font-semibold">Vendor Name</div>}
              name="name"
              rules={[{ required: true, message: "Please enter name" }]}
              className="mb-4"
            >
              <Input placeholder="Enter name" className="rounded-none" />
            </Form.Item>

            <Form.Item
              label={<div className="font-semibold">Email ID</div>}
              name="email"
              rules={[
                { required: true, message: "Please enter the email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
              className="mb-4"
            >
              <Input placeholder="Enter email" className="rounded-none" />
            </Form.Item>

            <CountryStateCity
              form={form}
              country_id={vendorUpdateElSelector?.country_id}
              state_id={vendorUpdateElSelector?.state_id}
              city_id={vendorUpdateElSelector?.city_id}
            />

            <Form.Item
              label={<div className="font-semibold">Address</div>}
              name="address"
              className="mb-6"
              rules={[{ required: true, message: "Please enter the address" }]}
            >
              <TextArea rows={1} />
            </Form.Item>

            {/* <Form.Item
              label={<div className="font-semibold">Company</div>}
              name="company"
              rules={[{ required: true, message: "Please enter the company" }]}
              className="mb-4"
            >
              <Input placeholder="Company Name" className="rounded-none" />
            </Form.Item> */}

            {!vendorUpdateElSelector && (
              <Form.Item
                label={<div className="font-semibold">Password</div>}
                name="password"
                rules={[
                  { required: true, message: "Please enter the password" },
                  {
                    min: 8,
                    message: "Password must be at least 8 characters long",
                  },
                ]}
                className="mb-4"
              >
                <Input.Password
                  placeholder="Enter password"
                  className="rounded-none"
                />
              </Form.Item>
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
                {vendorUpdateElSelector ? "Update" : "Register"}
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default VendorRegistrationForm;
