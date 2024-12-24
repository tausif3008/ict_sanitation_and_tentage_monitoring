import React, { useEffect, useState } from "react";
import { Form, Input, Button, Select, Divider } from "antd";
// import { postData } from "../../Fetch/Axios";
// import URLS from "../../urils/URLS";
// import { getFormData } from "../../urils/getFormData";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";

const AddRouteForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);

    values.status = 1;

    // if (vehicleUpdateElSelector) {
    //   values.vehicle_id = vehicleUpdateElSelector.vehicle_id;
    // }

    // const res = await postData(
    //   getFormData(values),
    //   vehicleUpdateElSelector ? URLS.editVehicle.path : URLS.addVehicle.path,
    //   {
    //     version: URLS.addVehicle.version,
    //   }
    // );

    // if (res?.data?.success) {
    //   form.resetFields();
    //   navigate("/route-list");
    // }
    setLoading(false);
  };

  return (
    <div className="mt-3">
      <div className="mx-auto p-3 bg-white shadow-md rounded-lg mt-3 w-full">
        <div className="flex gap-2 items-center">
          <Button
            className="bg-gray-200 rounded-full w-9 h-9"
            onClick={() => {
              navigate("/route-list");
            }}
          >
            <ArrowLeftOutlined></ArrowLeftOutlined>
          </Button>
          <div className="text-d9 text-2xl  w-full flex items-end justify-between ">
            <div className="font-bold">
              {false ? "Update Route" : "Add Route"}
            </div>
            <div className="text-xs">All * marks fields are mandatory</div>
          </div>
        </div>

        <Divider className="bg-d9 h-2/3 mt-1"></Divider>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-3">
            <Form.Item
              label="Route Name"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Please enter name!",
                },
              ]}
            >
              <Input placeholder="Route Name" className="rounded-none" />
            </Form.Item>
            <Form.Item label="Start Point" name="start point">
              <Input placeholder="enter start point" className="rounded-none" />
            </Form.Item>
            <Form.Item label="End Point" name="end point">
              <Input placeholder="enter end point" className="rounded-none" />
            </Form.Item>
            <Form.Item label="Middle Points" name="middle_points">
              <Select
                mode="multiple"
                placeholder="Select middle points"
                className="rounded-none"
                options={[
                  { value: "point1", label: "Point 1" },
                  { value: "point2", label: "Point 2" },
                  { value: "point3", label: "Point 3" },
                  { value: "point4", label: "Point 4" },
                ]}
              />
            </Form.Item>
            <Form.Item label="Distance" name="rc">
              <Input
                placeholder="add distance in meters"
                className="rounded-none"
              />
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
                {false ? "Update Route" : "Add Route"}
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default AddRouteForm;
