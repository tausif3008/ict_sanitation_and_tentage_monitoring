import React, { useEffect, useState } from "react";
import { Form, Input, Button, Divider, Select } from "antd";
import { useLocation, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { ArrowLeftOutlined } from "@ant-design/icons";
import CountryStateCity from "../../commonComponents/CountryStateCity";
import { getVendorList } from "./Slice/VendorSupervisorSlice";
import URLS from "../../urils/URLS";
import VendorSupervisorSelector from "./Slice/VendorSupervisorSelector";
import { postData } from "../../Fetch/Axios";
import { getFormData } from "../../urils/getFormData";
const { TextArea } = Input;

const VendorSupervisorForm = () => {
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const key = location.state?.key;
  const record = location.state?.record;

  const [form] = Form.useForm();
  const { VendorListDrop } = VendorSupervisorSelector();

  const onFinish = async (values) => {
    const finalData = {
      ...values,
      user_type_id: 13,
      status: 1,
      password: values?.phone,
      ...(key === "UpdateKey" && { user_id: record?.user_id }),
    };
    setLoading(true);

    const res = await postData(
      getFormData(finalData),
      key === "UpdateKey" ? URLS.editUser.path : URLS.register.path,
      {
        version: URLS.register.version,
      }
    );

    if (res) {
      if (res.data.success) {
        form.resetFields();
        navigate("/vendor-supervisor-registration");
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    dispatch(getVendorList()); // vendor list

    return () => {};
  }, []);

  // set value
  useEffect(() => {
    if (key === "UpdateKey") {
      form.setFieldsValue({
        vendor_id: Number(record?.vendor_id) === 0 ? null : record?.vendor_id,
        name: record?.name,
        phone: record?.phone,
        email: record?.email,
        address: record?.address,
        user_type_id: record?.user_type_id,
        password: record?.password,
        // country: record?.country,
        // state: record?.state,
        // city: record?.city,
      });
    }
  }, [record, key]);

  return (
    <>
      <div className="mt-3">
        <div className="mx-auto p-3 bg-white shadow-md rounded-lg mt-3 w-full">
          <div className="flex gap-2 items-center">
            <Button
              className="bg-gray-200 rounded-full w-9 h-9"
              onClick={() => {
                navigate("/vendor-supervisor-registration");
              }}
            >
              <ArrowLeftOutlined />
            </Button>
            <div className="text-d9 text-2xl w-full flex items-end justify-between ">
              <div className="font-bold">
                {key === "UpdateKey" ? "Update Supervisor" : "Add Supervisor"}
              </div>
              <div className="text-xs">All * marks fields are mandatory</div>
            </div>
          </div>
          <Divider className="bg-d9 h-2/3 mt-1" />

          <Form form={form} layout="vertical" onFinish={onFinish}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-5">
              <Form.Item
                name={"vendor_id"}
                label={"Select Vendor"}
                rules={[
                  {
                    required: true,
                    message: "Please select an asset main type", // Customize the error message
                  },
                ]}
              >
                <Select placeholder="Select Vendor" className="rounded-none">
                  {VendorListDrop?.map((option) => (
                    <Select.Option key={option?.value} value={option?.value}>
                      {option?.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label={<div className="font-semibold">Supervisor Name</div>}
                name="name"
                rules={[{ required: true, message: "Please enter name" }]}
                className="mb-4"
              >
                <Input placeholder="Enter name" className="rounded-none" />
              </Form.Item>
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
              {/* <CountryStateCity
                form={form}
                country_id={record?.country_id}
                state_id={record?.state_id}
                city_id={record?.city_id}
              /> */}
              <Form.Item
                label={<div className="font-semibold">Address</div>}
                name="address"
                className="mb-6"
                rules={[
                  { required: true, message: "Please enter the address" },
                ]}
              >
                <TextArea rows={1} />
              </Form.Item>

              {key === "AddKey" && (
                <Form.Item
                  label={
                    <div className="font-semibold">
                      Password ( mobile no is password)
                    </div>
                  }
                  name="phone"
                  rules={[
                    { required: true, message: "Please enter the password" },
                    {
                      min: 6,
                      message: "Password must be at least 6 characters long",
                    },
                  ]}
                  className="mb-4"
                >
                  <Input.Password
                    placeholder="Enter password"
                    className="rounded-none"
                    disabled
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
                  {key === "UpdateKey" ? "Update" : "Register"}
                </Button>
              </Form.Item>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
};

export default VendorSupervisorForm;
