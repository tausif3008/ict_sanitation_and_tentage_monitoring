import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { Form, Button, Divider } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";

import CustomInput from "../../commonComponents/CustomInput";
import CustomSelect from "../../commonComponents/CustomSelect";
import VendorSectorSelectors from "../../vendor-section-allocation/vendor-sector/Slice/vendorSectorSelectors";
import { getSectorsList } from "../../vendor-section-allocation/vendor-sector/Slice/vendorSectorSlice";

const AddRouteForm = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const key = location.state?.key;
  const record = location.state?.record;

  const { SectorListDrop } = VendorSectorSelectors(); // all sector dropdown

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

  useEffect(() => {
    dispatch(getSectorsList()); // all sectors
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
              navigate("/route-list");
            }}
          >
            <ArrowLeftOutlined></ArrowLeftOutlined>
          </Button>
          <div className="text-d9 text-2xl  w-full flex items-end justify-between ">
            <div className="font-bold">
              {key === "UpdateKey" ? "Update Route" : "Add Route"}
            </div>
            <div className="text-xs">All * marks fields are mandatory</div>
          </div>
        </div>

        <Divider className="bg-d9 h-2/3 mt-1"></Divider>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-3">
            <CustomSelect
              name={"sector_id"}
              label={"Select Sector"}
              placeholder={"Select Sector"}
              rules={[{ required: true, message: "Please select Sector" }]}
              options={SectorListDrop || []}
            />
            <CustomInput
              label="Route Name"
              placeholder="Route Name"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Please Add Route Name!",
                },
              ]}
            />
            <CustomInput
              label="Start Point"
              placeholder="Start Point"
              name="start_point"
            />
            <CustomInput
              label="End Point"
              placeholder="End Point"
              name="end_point"
            />
            <CustomSelect
              name={"middle_points"}
              label={"Select Middle Points"}
              mode="multiple"
              placeholder={"Select Middle Points"}
              options={
                [
                  { value: "point1", label: "Point 1" },
                  { value: "point2", label: "Point 2" },
                  { value: "point3", label: "Point 3" },
                  { value: "point4", label: "Point 4" },
                ] || []
              }
            />
            <CustomInput
              label="Distance"
              placeholder="Distance"
              name="distance"
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
                {key === "UpdateKey" ? "Update Route" : "Add Route"}
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default AddRouteForm;
