import React, { useEffect, useState } from "react";
import { Form, Input, Button, Select, Divider } from "antd";
import { postData } from "../../Fetch/Axios";
import URLS from "../../urils/URLS";
import { getFormData } from "../../urils/getFormData";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { setVehicleListIsUpdated } from "./vehicleSlice";
import CommonFormDropDownMaker from "../../commonComponents/CommonFormDropDownMaker";

const { Option } = Select;

const AddVehicleForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const vehicleUpdateElSelector = useSelector(
    (state) => state.vehicleSlice?.vehicleUpdateEl
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (vehicleUpdateElSelector) {
      form.setFieldsValue(vehicleUpdateElSelector);
    }
  }, [vehicleUpdateElSelector, form]);

  const onFinish = async (values) => {
    setLoading(true);

    values.status = 1;

    if (vehicleUpdateElSelector) {
      values.vehicle_id = vehicleUpdateElSelector.vehicle_id;
    }

    const res = await postData(
      getFormData(values),
      vehicleUpdateElSelector ? URLS.editVehicle.path : URLS.addVehicle.path,
      {
        version: URLS.addVehicle.version,
      }
    );

    if (res) {
      setLoading(false);
      dispatch(setVehicleListIsUpdated({ isUpdated: true }));

      if (res.data.success) {
        form.resetFields();

        if (vehicleUpdateElSelector) {
          navigate("/vehicle");
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
              navigate("/vehicle");
            }}
          >
            <ArrowLeftOutlined />
          </Button>
          <div className="text-d9 text-2xl w-full flex items-end justify-between">
            <div className="font-bold">
              {vehicleUpdateElSelector ? "Update Vehicle" : "Add Vehicle"}
            </div>
            <div className="text-xs">All * marks fields are mandatory</div>
          </div>
        </div>

        <Divider className="bg-d9 h-2/3 mt-1" />
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-3">
            <CommonFormDropDownMaker
              uri={"vendors"}
              responseListName="users"
              responseLabelName="name"
              responseIdName="user_id"
              selectLabel={"Vendor"}
              selectName={"user_id"}
              // required={true}
              RequiredMessage={"Main type is required!"}
            />
            <Form.Item
              label="Vehicle Type"
              name="type"
              // rules={[{ required: true, message: "Vehicle type is required!" }]}
            >
              <Select
                placeholder="Select vehicle type"
                className="rounded-none"
              >
                <Option value="Compactor">Compactor</Option>
                <Option value="Tipper">Tipper</Option>
              </Select>
            </Form.Item>

            <Form.Item label="Vehicle Number" name="number">
              <Input
                placeholder="enter vehicle number"
                className="rounded-none"
              />
            </Form.Item>
            <Form.Item label="IMEI Number" name="imei">
              <Input placeholder="enter imei number" className="rounded-none" />
            </Form.Item>
            <Form.Item label="Chassis Number" name="chassis_no">
              <Input
                placeholder="enter chassis number"
                className="rounded-none"
              />
            </Form.Item>
            <div className="flex w-full justify-end items-end">
              <Form.Item>
                <div className="flex w-full justify-end">
                  <Button
                    loading={loading}
                    type="primary"
                    htmlType="submit"
                    className="w-fit rounded-none bg-5c"
                  >
                    {vehicleUpdateElSelector ? "Update Vehicle" : "Add Vehicle"}
                  </Button>
                </div>
              </Form.Item>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default AddVehicleForm;
