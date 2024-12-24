import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Form, Button, Divider } from "antd";
import CountryStateCity from "../../commonComponents/CountryStateCity";
import { postData } from "../../Fetch/Axios";
import URLS from "../../urils/URLS";
import { getFormData } from "../../urils/getFormData";
import CustomInput from "../../commonComponents/CustomInput";
import CustomSelect from "../../commonComponents/CustomSelect";
import { getUserTypeList } from "../../permission/UserTypePermission/userTypeSlice";
import UserTypeSelector from "../../permission/UserTypePermission/userTypeSelector";

const UserRegistrationForm = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const key = location.state?.key;
  const record = location.state?.record;

  const { UserListDrop } = UserTypeSelector(); // user type list

  const onFinish = async (values) => {
    setLoading(true);
    values.status = 1;
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

    if (res?.data?.success) {
      form.resetFields();
      navigate("/users");
    }
    setLoading(false);
  };

  useEffect(() => {
    const uri = URLS?.allUserType?.path;
    dispatch(getUserTypeList(uri)); //  user type
  }, []);

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
              navigate("/users");
            }}
          >
            <ArrowLeftOutlined></ArrowLeftOutlined>
          </Button>
          <div className="text-d9 text-2xl  w-full flex items-end justify-between ">
            <div className="font-bold">
              {key === "UpdateKey"
                ? "Update User Details"
                : "User Registration"}
            </div>
            <div className="text-xs">All * marks fields are mandatory</div>
          </div>
        </div>
        <Divider className="bg-d9 h-2/3 mt-1"></Divider>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-5">
            <CustomSelect
              name={"user_type_id"}
              label={"Select User Type"}
              placeholder={"Select User Type"}
              rules={[{ required: true, message: "Please select User Type" }]}
              options={UserListDrop || []}
            />
            <CustomInput
              label={
                <div className="font-semibold">Mobile Number (Username)</div>
              }
              name="phone"
              placeholder="Mobile Number"
              maxLength={10}
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
            <CustomInput
              label={<div className="font-semibold">Name (Display Name) </div>}
              name="name"
              rules={[{ required: true, message: "Please enter name" }]}
              placeholder={"Name (Display Name)"}
            />
            <CustomInput
              label={<div className="font-semibold">Email ID </div>}
              name="email"
              rules={[
                { required: true, message: "Please enter the email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
              placeholder={"Email ID"}
            />
            {/* <CustomInput
              label={<div className="font-semibold">Company</div>}
              name="company"
              rules={[{ required: true, message: "Please enter the company" }]}
              placeholder={"Company"}
            /> */}
            <CountryStateCity
              form={form}
              country_id={record?.country_id}
              state_id={record?.state_id}
              city_id={record?.city_id}
            ></CountryStateCity>
            <CustomInput
              type="textarea"
              label={<div className="font-semibold">Address </div>}
              name="address"
              placeholder={"Address"}
            />
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

export default UserRegistrationForm;
