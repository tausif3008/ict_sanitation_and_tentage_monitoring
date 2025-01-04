import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Form, Button, Divider } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { postData } from "../../Fetch/Axios";
import URLS from "../../urils/URLS";
import { getFormData } from "../../urils/getFormData";
import { QuestionType, yesNoType } from "../../constant/const";
import CustomSelect from "../../commonComponents/CustomSelect";
import CustomInput from "../../commonComponents/CustomInput";

const QuestionRegistrationForm = () => {
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const key = location.state?.key;
  const record = location.state?.record;

  // set value
  useEffect(() => {
    if (key === "UpdateKey") {
      form.setFieldsValue(record);
    } else {
      form.setFieldValue("type", "C");
    }
  }, [record, key]);

  const onFinish = async (values) => {
    setLoading(true);
    values.status = 1;
    if (key === "UpdateKey") {
      values.question_id = record?.question_id;
    }
    const res = await postData(
      getFormData(values),
      key === "UpdateKey"
        ? URLS.editQuestionsEntry.path
        : URLS.questionsEntry.path,
      { version: URLS.register.version }
    );

    if (res) {
      if (res.data.success) {
        form.resetFields();
        navigate("/questions");
      }
    }
    setLoading(false);
  };

  return (
    <div className="mt-3">
      <div className="mx-auto p-3 bg-white shadow-md rounded-lg mt-3 w-full">
        <div className="flex gap-2 items-center">
          <Button
            className="bg-gray-200 rounded-full w-9 h-9"
            onClick={() => navigate("/questions")}
          >
            <ArrowLeftOutlined />
          </Button>
          <div className="text-d9 text-2xl w-full flex items-end justify-between">
            <div className="font-bold">
              {key === "UpdateKey" ? "Update Question" : "Add Question"}
            </div>
            <div className="text-xs">All * marked fields are mandatory</div>
          </div>
        </div>
        <Divider className="bg-d9 h-2/3 mt-1" />
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <CustomInput
            label="Question (English)"
            name="question_en"
            rules={[
              {
                required: true,
                message: "Please enter the question in English",
              },
            ]}
            placeholder="Enter question in English"
          />
          <CustomInput
            label="Question (Hindi)"
            name="question_hi"
            placeholder="Enter question in Hindi"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <CustomSelect
              label="Is Image"
              name="is_image"
              rules={[{ required: true, message: "Please select an option" }]}
              placeholder="Select if image is required"
              options={yesNoType || []}
            />
            <CustomSelect
              label="Is Image On"
              name="is_image_on"
              rules={[{ required: true, message: "Please select an option" }]}
              placeholder="Select if image is active"
              options={yesNoType || []}
            />
            <CustomSelect
              label="Is Primary"
              name="is_primary"
              rules={[{ required: true, message: "Please select an option" }]}
              placeholder="Select if primary"
              options={yesNoType || []}
            />
            <CustomSelect
              label="Question Type"
              name="type"
              rules={[{ required: true, message: "Please select an Type" }]}
              placeholder="Select type"
              options={QuestionType || []}
            />
          </div>
          <CustomInput
            type="textarea"
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please enter a description" }]}
            placeholder="Enter description"
          />
          <Form.Item>
            <div className="flex w-full justify-end">
              <Button
                loading={loading}
                type="primary"
                htmlType="submit"
                className="w-fit rounded-none bg-5c"
              >
                {key === "UpdateKey" ? "Update Question" : "Add Question"}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default QuestionRegistrationForm;
