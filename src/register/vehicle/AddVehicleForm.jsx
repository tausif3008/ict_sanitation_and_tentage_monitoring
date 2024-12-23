import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { Form, Button, Divider } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";

import { postData } from "../../Fetch/Axios";
import URLS from "../../urils/URLS";
import { getFormData } from "../../urils/getFormData";
import CustomSelect from "../../commonComponents/CustomSelect";
import VendorSupervisorSelector from "../../vendor/VendorSupervisorRegistration/Slice/VendorSupervisorSelector";
import { getVendorList } from "../../vendor/VendorSupervisorRegistration/Slice/VendorSupervisorSlice";
import { vehicleType } from "../../constant/const";
import CustomInput from "../../commonComponents/CustomInput";

const AddVehicleForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const key = location.state?.key;
  const record = location.state?.record;

  const { VendorListDrop } = VendorSupervisorSelector(); // vendor

  const onFinish = async (values) => {
    setLoading(true);
    values.status = 1;
    if (key === "UpdateKey") {
      values.vehicle_id = record.vehicle_id;
    }
    const res = await postData(
      getFormData(values),
      key === "UpdateKey" ? URLS.editVehicle.path : URLS.addVehicle.path,
      {
        version: URLS.addVehicle.version,
      }
    );
    if (res?.data?.success) {
      form.resetFields();
      navigate("/vehicle");
    }
    setLoading(false);
  };

  useEffect(() => {
    dispatch(getVendorList()); // vendor list
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
              navigate("/vehicle");
            }}
          >
            <ArrowLeftOutlined />
          </Button>
          <div className="text-d9 text-2xl w-full flex items-end justify-between">
            <div className="font-bold">
              {key === "UpdateKey" ? "Update Vehicle" : "Add Vehicle"}
            </div>
            <div className="text-xs">All * marks fields are mandatory</div>
          </div>
        </div>
        <Divider className="bg-d9 h-2/3 mt-1" />
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-3">
            <CustomSelect
              name={"user_id"}
              label={"Select Vendor"}
              placeholder={"Select Vendor"}
              options={VendorListDrop || []}
              rules={[{ required: true, message: "Please select Vendor" }]}
            />
            <CustomSelect
              label="Vehicle Type"
              name="type"
              placeholder={"Select Vehicle Type"}
              options={vehicleType || []}
            />
            <CustomInput
              label="Vehicle Number"
              name="number"
              placeholder="enter vehicle number"
            />
            <CustomInput
              label="IMEI Number"
              name="imei"
              placeholder="enter imei number"
            />
            <CustomInput
              label="Chassis Number"
              name="chassis_no"
              placeholder="enter chassis number"
            />
            <div className="flex w-full justify-end items-end">
              <Form.Item>
                <div className="flex w-full justify-end">
                  <Button
                    loading={loading}
                    type="primary"
                    htmlType="submit"
                    className="w-fit rounded-none bg-5c"
                  >
                    {key === "UpdateKey" ? "Update Vehicle" : "Add Vehicle"}
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
