import React, { useEffect, useState } from "react";
import { Form, Input, Button, Select, Divider } from "antd";
import { postData } from "../../Fetch/Axios";
import URLS from "../../urils/URLS";
import { getFormData } from "../../urils/getFormData";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { setAssetTypeListIsUpdated } from "./AssetTypeSlice";
import CommonFormDropDownMaker from "../../commonComponents/CommonFormDropDownMaker";

const AssetTypeForm = () => {
  const { Option } = Select;

  const assetMainTypes = [
    { value: "1", label: "Sanitation" },
    { value: "2", label: "Tentage" },
  ];

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const assetUpdateElSelector = useSelector(
    (state) => state.assetTypeUpdateEl?.assetUpdateEl
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (assetUpdateElSelector) {
      form.setFieldsValue(assetUpdateElSelector);
    }
  }, [assetUpdateElSelector, form]);

  const onFinish = async (values) => {
    setLoading(true);

    values.status = 1;
    values.questions = 0;

    if (assetUpdateElSelector) {
      values.asset_type_id = assetUpdateElSelector.asset_type_id;
      values.questions = assetUpdateElSelector.questions;
    }

    const res = await postData(
      getFormData(values),
      assetUpdateElSelector
        ? URLS.editAssetType.path
        : URLS.assetTypeEntry.path,
      {
        version: URLS.register.version,
      }
    );

    if (res) {
      setLoading(false);
      dispatch(setAssetTypeListIsUpdated({ isUpdated: true }));

      if (res.data.success) {
        form.resetFields();

        if (assetUpdateElSelector) {
          navigate("/asset-type-list");
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
              navigate("/asset-type-list");
            }}
          >
            <ArrowLeftOutlined></ArrowLeftOutlined>
          </Button>
          <div className="text-d9 text-2xl  w-full flex items-end justify-between ">
            <div className="font-bold">
              {assetUpdateElSelector ? "Update Asset Type" : "Add Asset Type"}
            </div>
            <div className="text-xs">All * marks fields are mandatory</div>
          </div>
        </div>
        <Divider className="bg-d9 h-2/3 mt-1"></Divider>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 mb-3">
            <CommonFormDropDownMaker
              uri={"assetMainTypePerPage"}
              responseListName="assetmaintypes"
              responseLabelName="name"
              responseIdName="asset_main_type_id"
              selectLabel={"Asset Main Type"}
              selectName={"asset_main_type_id"}
              required={true}
              RequiredMessage={"Main type is required!"}
            ></CommonFormDropDownMaker>

            {/* Asset Sub Type Textbox */}
            <Form.Item
              name="name"
              label={<div className="font-semibold">Asset Type Name</div>}
              rules={[
                { required: true, message: "Please enter an asset type" },
              ]}
            >
              <Input
                placeholder="Enter asset type name"
                className="rounded-none"
              />
            </Form.Item>

            <Form.Item
              name="description"
              label={
                <div className="font-semibold">Asset Type Description</div>
              }
            >
              <Input
                placeholder="Asset type description"
                className="rounded-none"
              />
            </Form.Item>
          </div>

          <div className="flex justify-end">
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-fit rounded-none bg-5c"
                loading={loading} // Show loading spinner during API call
              >
                {assetUpdateElSelector ? "Update" : "Add"}
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default AssetTypeForm;
