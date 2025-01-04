import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { Form, Button, Divider } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";

import CustomInput from "../../commonComponents/CustomInput";
import RouteSelector from "./routeSelector";
import { getFormData } from "../../urils/getFormData";
import { postData } from "../../Fetch/Axios";
import URLS from "../../urils/URLS";

const AddPickUpPointForm = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const key = location.state?.key;
  const record = location.state?.record;

  const { loading } = RouteSelector();

  const onFinish = async (values) => {
    const finalData = {
      ...values,
    };

    if (key === "UpdateKey") {
      finalData.pickup_point_id = record?.pickup_point_id;
    }

    const res = await postData(
      getFormData(finalData),
      key === "UpdateKey"
        ? URLS?.editPickUpPoint?.path
        : URLS?.addPickUpPoint?.path,
      {
        version: URLS?.addPickUpPoint?.version,
      }
    );
    if (res?.data?.success) {
      form.resetFields();
      navigate("/pickup-point");
    }
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
              navigate("/pickup-point");
            }}
          >
            <ArrowLeftOutlined></ArrowLeftOutlined>
          </Button>
          <div className="text-d9 text-2xl  w-full flex items-end justify-between ">
            <div className="font-bold">
              {key === "UpdateKey"
                ? "Update Pick Up Point"
                : "Add Pick Up Point"}
            </div>
            <div className="text-xs">All * marks fields are mandatory</div>
          </div>
        </div>

        <Divider className="bg-d9 h-2/3 mt-1"></Divider>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-3">
            <CustomInput
              label="Point Name"
              placeholder="Point Name"
              name="point_name"
              rules={[
                {
                  required: true,
                  message: "Please Add Point Name!",
                },
              ]}
            />
            <CustomInput
              label="Latitude"
              placeholder="Latitude"
              name="latitude"
              type="number"
            />
            <CustomInput
              label="Longitude"
              placeholder="Longitude"
              name="longitude"
              type="number"
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
                {key === "UpdateKey"
                  ? "Update Pick Up Point"
                  : "Add Pick Up Point"}
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default AddPickUpPointForm;
