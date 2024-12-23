import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { Form, Button, Divider } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { postData } from "../../Fetch/Axios";
import URLS from "../../urils/URLS";
import { getFormData } from "../../urils/getFormData";
import {
  getAssetMainTypes,
  getSLATypes,
  setAssetTypeListIsUpdated,
} from "./AssetTypeSlice";
import AssetTypeSelectors from "./assetTypeSelectors";
import { getQuestionList } from "../questions/questionSlice";
import QuestionSelector from "../questions/questionSelector";
import CustomSelect from "../../commonComponents/CustomSelect";
import CustomInput from "../../commonComponents/CustomInput";

const AssetTypeForm = () => {
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const key = location.state?.key;
  const record = location.state?.record;

  const { AssetMainTypeDrop, SLATypeDrop } = AssetTypeSelectors(); // asset main type
  const { QuestionDrop } = QuestionSelector();

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

    if (key === "UpdateKey") {
      finalData.asset_type_id = record?.asset_type_id;
    }

    const res = await postData(
      getFormData(finalData),
      key === "UpdateKey" ? URLS.editAssetType.path : URLS.assetTypeEntry.path,
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
    dispatch(getQuestionList()); // get question
    // sla types
    const sla_url = URLS?.slaTypes?.path;
    dispatch(getSLATypes(sla_url));
  }, []);

  // set value
  useEffect(() => {
    if (record) {
      const questionId = record?.questions?.map((data) => {
        return data?.question_id;
      });

      let slasArray =
        Number(record?.slas) === 0
          ? []
          : record?.slas?.split(",").map((item) => item?.trim());

      form.setFieldsValue({
        asset_main_type_id: record?.asset_main_type_id,
        name: record?.name,
        asset_type_id: record?.asset_type_id,
        name_hi: record?.name_hi,
        description: record?.description,
        questions: questionId,
        slas: slasArray,
      });
    }
  }, [record, key]);

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
              {key === "UpdateKey"
                ? "Update Toilets & Tentage Type"
                : "Add Toilets & Tentage Type"}
            </div>
            <div className="text-xs">All * marks fields are mandatory</div>
          </div>
        </div>
        <Divider className="bg-d9 h-2/3 mt-1"></Divider>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 mb-3">
            <CustomSelect
              name={"asset_main_type_id"}
              label={"Category"}
              rules={[
                {
                  required: true,
                  message: "Please select category", // Customize the error message
                },
              ]}
              placeholder={"Select Category"}
              options={AssetMainTypeDrop || []}
            />
            <CustomInput
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
              placeholder="Enter Toilets & Tentage Type Name"
            />
            <CustomInput
              name="name_hi"
              label={<div className="font-semibold">Hindi</div>}
              rules={[
                {
                  required: true,
                  message: "Please enter hindi text",
                },
              ]}
              placeholder="Enter hindi text"
            />
            <CustomSelect
              name={"slas"}
              label={"Select SLAS Type"}
              rules={[
                {
                  required: true,
                  message: "Please select slas type",
                },
              ]}
              placeholder="Select SLA Type"
              options={SLATypeDrop || []}
            />
            <CustomSelect
              name={"questions"}
              label={"Select Questions"}
              placeholder="Select Questions"
              options={QuestionDrop || []}
              mode="multiple"
            />
            <CustomInput
              type="textarea"
              name="description"
              label={<div className="font-semibold">Description</div>}
              placeholder="Toilets & Tentage Type Description"
            />
          </div>
          <div className="flex justify-end">
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-fit rounded-none bg-5c"
                loading={loading} // Show loading spinner during API call
              >
                {key === "UpdateKey" ? "Update" : "Add"}
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default AssetTypeForm;
