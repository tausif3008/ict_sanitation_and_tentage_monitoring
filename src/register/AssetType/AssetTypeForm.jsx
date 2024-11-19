import React, { useEffect, useState } from "react";
import { Form, Input, Button, Select, Divider } from "antd";
import { postData } from "../../Fetch/Axios";
import URLS from "../../urils/URLS";
import { getFormData } from "../../urils/getFormData";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
  getAssetMainTypes,
  getSLATypes,
  setAssetTypeListIsUpdated,
} from "./AssetTypeSlice";
import AssetTypeSelectors from "./assetTypeSelectors";
import { getQuestionList } from "../questions/questionSlice";
import QuestionSelector from "../questions/questionSelector";

const AssetTypeForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { AssetMainTypeDrop, SLATypeDrop } = AssetTypeSelectors();
  const { QuestionDrop } = QuestionSelector();

  const assetUpdateElSelector = useSelector(
    (state) => state.assetTypeUpdateEl?.assetUpdateEl
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (assetUpdateElSelector) {
      const questionId = assetUpdateElSelector?.questions?.map((data) => {
        return data?.question_id;
      });

      let slasArray =
        Number(assetUpdateElSelector?.slas) === 0
          ? []
          : assetUpdateElSelector?.slas?.split(",").map((item) => item?.trim());

      form.setFieldsValue({
        asset_main_type_id: assetUpdateElSelector?.asset_main_type_id,
        name: assetUpdateElSelector?.name,
        asset_type_id: assetUpdateElSelector?.asset_type_id,
        name_hi: assetUpdateElSelector?.name_hi,
        description: assetUpdateElSelector?.description,
        questions: questionId,
        slas: slasArray,
      });
    }
  }, [assetUpdateElSelector, form]);

  const onFinish = async (values) => {
    const stringQuestions = values?.questions
      ? values?.questions?.map((data) => String(data)).join(", ")
      : "No questions available";
    const stringSla = values?.slas
      ? values?.slas?.map((data) => String(data)).join(", ")
      : "No slas available";

    const finalData = {
      ...values,
      status: 1,
      questions: stringQuestions,
      slas: stringSla,
    };
    setLoading(true);

    if (assetUpdateElSelector) {
      finalData.asset_type_id = assetUpdateElSelector?.asset_type_id;
    }

    const res = await postData(
      getFormData(finalData),
      assetUpdateElSelector
        ? URLS.editAssetType.path
        : URLS.assetTypeEntry.path,
      {
        version: URLS.register.version,
      }
    );

    if (res) {
      dispatch(setAssetTypeListIsUpdated({ isUpdated: true }));

      if (res.data.success) {
        form.resetFields();
        navigate("/asset-type-list");
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    // asset main type
    const assetMainTypeUrl = URLS?.assetMainTypePerPage?.path;
    dispatch(getAssetMainTypes(assetMainTypeUrl));

    // question
    const question = URLS?.questions?.path;
    dispatch(getQuestionList(question));

    // sla types
    const sla_url = URLS?.slaTypes?.path;
    dispatch(getSLATypes(sla_url));
  }, []);

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
              {assetUpdateElSelector
                ? "Update Toilets & Tentage Type"
                : "Add Toilets & Tentage Type"}
            </div>
            <div className="text-xs">All * marks fields are mandatory</div>
          </div>
        </div>
        <Divider className="bg-d9 h-2/3 mt-1"></Divider>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 mb-3">
            <Form.Item
              name={"asset_main_type_id"}
              label={"Asset Main Type"}
              rules={[
                {
                  required: true,
                  message: "Please select an asset main type", // Customize the error message
                },
              ]}
            >
              <Select placeholder="Select status" className="rounded-none">
                {AssetMainTypeDrop?.map((option) => (
                  <Select.Option key={option?.value} value={option?.value}>
                    {option?.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="name"
              label={
                <div className="font-semibold">Toilets & Tentage Type Name</div>
              }
              rules={[
                {
                  required: true,
                  message: "Please enter an toilets & tentage type",
                },
              ]}
            >
              <Input
                placeholder="Enter asset type name"
                className="rounded-none"
              />
            </Form.Item>
            <Form.Item
              name="name_hi"
              label={<div className="font-semibold">Hindi</div>}
              rules={[
                {
                  required: true,
                  message: "Please enter hindi text",
                },
              ]}
            >
              <Input
                placeholder="Enter asset type name"
                className="rounded-none"
              />
            </Form.Item>
            <Form.Item
              name="description"
              label={<div className="font-semibold">Description</div>}
            >
              <Input
                placeholder="Toilets & Tentage Type Description"
                className="rounded-none"
              />
            </Form.Item>
            <Form.Item name={"questions"} label={"Select Questions"}>
              <Select
                placeholder="Select Questions"
                className="rounded-none"
                mode="multiple" // Enable multiple selection
              >
                {QuestionDrop?.map((option) => (
                  <Select.Option key={option?.value} value={option?.value}>
                    {option?.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name={"slas"}
              label={"Select SLAS Type"}
              rules={[
                {
                  required: true,
                  message: "Please select slas type",
                },
              ]}
            >
              <Select
                placeholder="Select SLA Type"
                className="rounded-none"
                mode="multiple" // Enable multiple selection
              >
                {SLATypeDrop?.map((option) => (
                  <Select.Option key={option?.value} value={option?.value}>
                    {option?.label}
                  </Select.Option>
                ))}
              </Select>
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
