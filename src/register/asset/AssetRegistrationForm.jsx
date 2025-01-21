import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { Form, Button, Divider } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";

import CustomSelect from "../../commonComponents/CustomSelect";
import { postData } from "../../Fetch/Axios";
import { getFormData } from "../../urils/getFormData";
import URLS from "../../urils/URLS";
import VendorSectorSelectors from "../../vendor-section-allocation/vendor-sector/Slice/vendorSectorSelectors";
import { getSectorsList } from "../../vendor-section-allocation/vendor-sector/Slice/vendorSectorSlice";
import { getAssetMainTypes, getAssetTypes } from "../AssetType/AssetTypeSlice";
import AssetTypeSelectors from "../AssetType/assetTypeSelectors";
import { getParkingData } from "../parking/parkingSlice";
import ParkingSelector from "../parking/parkingSelector";
import VendorSupervisorSelector from "../../vendor/VendorSupervisorRegistration/Slice/VendorSupervisorSelector";
import MonitoringSelector from "../../complaince/monitoringSelector";
import { getMonitoringAgent } from "../../complaince/monitoringSlice";
import { getAssetTypeWiseVendorList } from "../../vendor/VendorSupervisorRegistration/Slice/VendorSupervisorSlice";
import CustomInput from "../../commonComponents/CustomInput";

const AssetRegistrationForm = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const key = location.state?.key;
  const record = location.state?.record;
  const userRoleId = localStorage.getItem("role_id");

  const { SectorListDrop } = VendorSectorSelectors(); // all sector dropdown
  const { parkingDrop } = ParkingSelector(); // Parking
  const { AssetMainTypeDrop, AssetTypeDrop } = AssetTypeSelectors(); // asset main type & asset type
  const { AssetTypeVendorDrop } = VendorSupervisorSelector(); // asset type wise vendor
  const { monitoringAgentDrop } = MonitoringSelector(); // monitoring agent drop

  // handle category
  const handleSelect = (value) => {
    form.setFieldsValue({
      asset_type_id: null,
    });
    const url = URLS?.assetType?.path + value;
    dispatch(getAssetTypes(url)); // get assset type
  };

  const handleTypeSelect = (value) => {
    form.setFieldsValue({
      vendor_id: null,
    });
    value && userRoleId !== "8" && dispatch(getAssetTypeWiseVendorList(value)); // asset type wise vendor list
  };

  const onFinish = async (values) => {
    setLoading(true);
    const finalData = {
      ...values,
    };
    if (key === "UpdateKey") {
      finalData.assets_id = record?.assets_id;
    }
    const res = await postData(
      getFormData(finalData),
      key === "UpdateKey" ? URLS?.edtAssetList?.path : URLS?.addAssetList?.path,
      {
        version: URLS?.edtAssetList?.version,
      }
    );
    if (res?.data?.success) {
      form.resetFields();
      navigate("/asset-list");
    }
    setLoading(false);
  };

  useEffect(() => {
    dispatch(getSectorsList()); // all sectors
    const assetMainTypeUrl = URLS?.assetMainTypePerPage?.path;
    dispatch(getAssetMainTypes(assetMainTypeUrl)); // asset main type

    // get parking data
    const url = URLS?.parking?.path;
    dispatch(getParkingData(url));
  }, []);

  // set value
  useEffect(() => {
    if (key === "UpdateKey") {
      if (record?.asset_main_type_id) {
        handleSelect(Number(record?.asset_main_type_id));
      }
      if (record?.asset_type_id) {
        handleTypeSelect(Number(record?.asset_type_id));
      }
      if (record?.created_by) {
        const urls =
          URLS?.monitoringAgent?.path +
          `&keywords=${record?.agent_name?.split(" ")[0]}`;
        dispatch(getMonitoringAgent(urls)); // monitoring agent list
      }
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
              navigate("/asset-list");
            }}
          >
            <ArrowLeftOutlined></ArrowLeftOutlined>
          </Button>
          <div className="text-d9 text-2xl  w-full flex items-end justify-between ">
            <div className="font-bold">
              {key === "UpdateKey" ? "Update Asset" : "Add Asset"}
            </div>
            <div className="text-xs">All * marks fields are mandatory</div>
          </div>
        </div>

        <Divider className="bg-d9 h-2/3 mt-1"></Divider>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-3">
            <CustomSelect
              name={"asset_main_type_id"}
              label={"Category"}
              rules={[
                {
                  required: true,
                  message: "Please select category", // Customize the error message
                },
              ]}
              onSelect={handleSelect}
              placeholder={"Select Category"}
              options={AssetMainTypeDrop || []}
            />
            <CustomSelect
              name={"asset_type_id"}
              label={"Select Type"}
              placeholder={"Select Type"}
              options={AssetTypeDrop || []}
              rules={[{ required: true, message: "Please Select Asset Type" }]}
              onSelect={handleTypeSelect}
            />
            <CustomSelect
              name={"vendor_id"}
              label={"Select Vendor"}
              placeholder={"Select Vendor"}
              options={AssetTypeVendorDrop || []}
            />
            <CustomSelect
              name={"created_by"}
              label={"Select GSD"}
              placeholder={"Select GSD"}
              options={monitoringAgentDrop || []}
              // search dropdown
              isOnSearchFind={true}
              apiAction={getMonitoringAgent}
              onSearchUrl={`${URLS?.monitoringAgent?.path}&keywords=`}
            />
            <CustomInput
              name={"code"}
              label={"Asset Code"}
              placeholder={"Asset Code"}
              rules={[
                {
                  required: true,
                  message: "Please Add Asset Code!",
                },
              ]}
            />
            <CustomSelect
              name={"sector_id"}
              label={"Select Sector"}
              placeholder={"Select Sector"}
              rules={[{ required: true, message: "Please select Sector" }]}
              options={SectorListDrop || []}
            />
            <CustomSelect
              name={"parking_id"}
              label={"Select Parking"}
              placeholder={"Select Parking"}
              rules={[{ required: true, message: "Please select Parking" }]}
              options={parkingDrop || []}
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
                {key === "UpdateKey" ? "Update Asset" : "Add Asset"}
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default AssetRegistrationForm;
