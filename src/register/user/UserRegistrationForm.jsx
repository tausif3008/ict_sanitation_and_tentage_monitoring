import React, { useContext, useEffect, useState } from "react";
import { Form, Input, Button, Select, Divider } from "antd";
import CountryStateCity from "../../commonComponents/CountryStateCity";
import optionsMaker from "../../urils/OptionMaker";
import { getData, postData } from "../../Fetch/Axios";
import URLS from "../../urils/URLS";
import { getFormData } from "../../urils/getFormData";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { setUserListIsUpdated } from "./userSlice";
import UserTypeDropDown from "./UserTypeDropDown";

const UserRegistrationForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const userUpdateElSelector = useSelector(
    (state) => state.userSlice?.userUpdateEl
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (userUpdateElSelector) {
      form.setFieldsValue(userUpdateElSelector);
    }
  }, [userUpdateElSelector, form]);

  const onFinish = async (values) => {
    setLoading(true);

    values.status = 1;

    if (userUpdateElSelector) {
      values.user_id = userUpdateElSelector.user_id;
    }

    const res = await postData(
      getFormData(values),
      userUpdateElSelector ? URLS.editUser.path : URLS.register.path,
      {
        version: URLS.register.version,
      }
    );

    if (res) {
      setLoading(false);
      dispatch(setUserListIsUpdated({ isUpdated: true }));

      if (res.data.success) {
        form.resetFields();
        if (userUpdateElSelector) {
          navigate("/users");
        }
      }
    }
  };

  const [userTypes, setUserTypes] = useState([]);

  useEffect(() => {
    optionsMaker(
      "userType",
      "user_type",
      "user_type",
      setUserTypes,
      "",
      "user_type_id"
    );

    getData(URLS.userType.path, { "x-api-version": URLS.userType.version });
  }, [form]);

  return (
    <div className="mt-3">
      <div className="mx-auto p-3 bg-white shadow-md rounded-lg mt-3 w-full">
        <div className="flex gap-2 items-center">
          <Button
            className="bg-gray-200 rounded-full w-9 h-9"
            onClick={() => {
              navigate("/users");
            }}
          >
            <ArrowLeftOutlined></ArrowLeftOutlined>
          </Button>
          <div className="text-d9 text-2xl  w-full flex items-end justify-between ">
            <div className="font-bold">
              {userUpdateElSelector
                ? "Update User Details"
                : "User Registration"}
            </div>
            <div className="text-xs">All * marks fields are mandatory</div>
          </div>
        </div>
        <Divider className="bg-d9 h-2/3 mt-1"></Divider>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-5">
            <UserTypeDropDown form={form}></UserTypeDropDown>

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

            {!userUpdateElSelector && (
              <Form.Item
                label={<div className="font-semibold">Password</div>}
                name="password"
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
                  className="rounded-none "
                />
              </Form.Item>
            )}

            <Form.Item
              label={<div className="font-semibold">Name (Display Name) </div>}
              name="name"
              rules={[{ required: true, message: "Please enter name" }]}
              className="mb-4"
            >
              <Input placeholder="Enter name" className="rounded-none " />
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
              <Input placeholder="Enter email" className="rounded-none " />
            </Form.Item>

            {/* <Form.Item
              label={<div className="font-semibold">Company</div>}
              name="company"
              rules={[{ required: true, message: "Please enter the company" }]}
              className="mb-4"
            >
              <Input placeholder="Company Name" className="rounded-none " />
            </Form.Item> */}

            <CountryStateCity
              form={form}
              country_id={userUpdateElSelector?.country_id}
              state_id={userUpdateElSelector?.state_id}
              city_id={userUpdateElSelector?.city_id}
            ></CountryStateCity>

            <Form.Item
              label={<div className="font-semibold">Address</div>}
              name="address"
              className="mb-6"
            >
              <TextArea rows={2} />
            </Form.Item>
          </div>

          <div className="flex justify-end">
            <Form.Item>
              <Button
                loading={loading}
                type="primary"
                htmlType="submit"
                className="w-fit rounded-none bg-5c"
              >
                {userUpdateElSelector ? "Update" : "Register"}
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default UserRegistrationForm;
const { TextArea } = Input;
