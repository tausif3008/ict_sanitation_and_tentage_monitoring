import React, { useEffect, useState } from "react";
import { Form, Input, Button, Select, Divider } from "antd";
import { postData } from "../../Fetch/Axios";
import URLS from "../../urils/URLS";
import { getFormData } from "../../urils/getFormData";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { setQuestionListIsUpdated } from "./questionSlice";

const QuestionRegistrationForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const questionUpdateElSelector = useSelector(
    (state) => state.questionSlice?.questionUpdateEl
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (questionUpdateElSelector) {
      form.setFieldsValue(questionUpdateElSelector);
    }
  }, [questionUpdateElSelector, form]);

  const onFinish = async (values) => {
    setLoading(true);

    values.status = 1;

    if (questionUpdateElSelector) {
      values.question_id = questionUpdateElSelector.question_id;
    }

    const res = await postData(
      getFormData(values),
      questionUpdateElSelector
        ? URLS.editQuestionsEntry.path
        : URLS.questionsEntry.path,
      {
        version: URLS.register.version,
      }
    );

    if (res) {
      setLoading(false);
      dispatch(setQuestionListIsUpdated({ isUpdated: true }));

      if (res.data.success) {
        form.resetFields();

        if (questionUpdateElSelector) {
          navigate("/questions");
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
              navigate("/questions");
            }}
          >
            <ArrowLeftOutlined />
          </Button>
          <div className="text-d9 text-2xl w-full flex items-end justify-between">
            <div className="font-bold">
              {questionUpdateElSelector ? "Update Question" : "Add Question"}
            </div>
            <div className="text-xs">All * marked fields are mandatory</div>
          </div>
        </div>

        <Divider className="bg-d9 h-2/3 mt-1" />
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Question (English)"
            name="question_en"
            rules={[
              {
                required: true,
                message: "Please enter the question in English",
              },
            ]}
          >
            <Input
              placeholder="Enter question in English"
              className="rounded-none"
            />
          </Form.Item>
          <Form.Item label="Question (Hindi)" name="question_hi">
            <Input
              placeholder="Enter question in Hindi"
              className="rounded-none"
            />
          </Form.Item>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <Form.Item
              label="Is Image"
              name="is_image"
              rules={[{ required: true, message: "Please select an option" }]}
            >
              <Select
                placeholder="Select if image is required"
                className="rounded-none"
              >
                <Select.Option value={0}>No</Select.Option>
                <Select.Option value={1}>Yes</Select.Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please enter a description" }]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Enter description"
              className="rounded-none"
            />
          </Form.Item>

          <Form.Item>
            <div className="flex w-full justify-end">
              <Button
                loading={loading}
                type="primary"
                htmlType="submit"
                className="w-fit rounded-none bg-5c"
              >
                {questionUpdateElSelector ? "Update Question" : "Add Question"}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default QuestionRegistrationForm;
