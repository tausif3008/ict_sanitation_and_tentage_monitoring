import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { Form, Button, Divider } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";

import CustomInput from "../../commonComponents/CustomInput";
import CustomSelect from "../../commonComponents/CustomSelect";
import VendorSectorSelectors from "../../vendor-section-allocation/vendor-sector/Slice/vendorSectorSelectors";
import { getSectorsList } from "../../vendor-section-allocation/vendor-sector/Slice/vendorSectorSlice";
import { getRoutePickUpPointDrop } from "./routeSlice";
import RouteSelector from "./routeSelector";
import { postData } from "../../Fetch/Axios";
import { getFormData } from "../../urils/getFormData";
import URLS from "../../urils/URLS";

const AddRouteForm = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const key = location.state?.key;
  const record = location.state?.record;

  const { SectorListDrop } = VendorSectorSelectors(); // all sector dropdown
  const { PickUpPointDropdownData, loading } = RouteSelector(); // route pick up point

  const onFinish = async (values) => {
    const finalData = {
      ...values,
    };

    if (key === "UpdateKey") {
      finalData.pickup_route_id = record?.pickup_route_id;
    }

    const res = await postData(
      getFormData(finalData),
      key === "UpdateKey"
        ? URLS?.editPickUpRoute?.path
        : URLS?.addPickUpRoute?.path,
      {
        version: URLS?.editPickUpRoute?.version,
      }
    );
    if (res?.data?.success) {
      form.resetFields();
      navigate("/route-list");
    }
  };

  useEffect(() => {
    dispatch(getSectorsList()); // all sectors
    dispatch(getRoutePickUpPointDrop()); // get pickup point dropdown
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
              label="Vehicle Number"
              placeholder="Vehicle Number"
              name="vehicle_number"
            />
            <CustomInput
              label="Route Name"
              placeholder="Route Name"
              name="route_name"
              rules={[
                {
                  required: true,
                  message: "Please Add Route Name!",
                },
              ]}
            />
            <CustomSelect
              label="Start Point"
              placeholder="Start Point"
              name="start_point_id"
              options={PickUpPointDropdownData || []}
            />
            <CustomSelect
              name={"middle_point_id"}
              label={"Select Middle Points"}
              placeholder={"Select Middle Points"}
              options={PickUpPointDropdownData || []}
            />
            <CustomSelect
              label="End Point"
              placeholder="End Point"
              name="end_point_id"
              options={PickUpPointDropdownData || []}
            />
            <CustomInput
              label="Distance (meters)"
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
