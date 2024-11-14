import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router";
import { Form, Button, Divider, Checkbox } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { postData } from "../../../Fetch/Axios";
import URLS from "../../../urils/URLS";

const UpdateUserTypePermisssion = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const key = location.state?.key;
  const record = location.state?.record;

  // API
  const onFinish = async (values) => {
    const finalData = {
      ...values,
      create: values?.create ? "1" : "0",
      read: values?.read ? "1" : "0",
      update: values?.update ? "1" : "0",
      delete: values?.delete ? "1" : "0",
      ...(key === "UpdateKey" && {
        module_permission_id: Number(record?.module_permission_id),
      }),
    };

    const res = await postData(
      finalData,
      key === "UpdateKey" ? URLS?.ModulePermissionEdit?.path : "",
      { version: URLS?.ModulePermissionEdit?.version }
    );
    setLoading(false);
    if (res?.data?.success) {
      form.resetFields();
      navigate("/user-type-permission");
    }
  };

  // set value
  useEffect(() => {
    if (key === "UpdateKey") {
      form.setFieldsValue({
        module_permission_id: record?.module_permission_id,
        create: Number(record?.create) === 1 ? true : false,
        read: Number(record?.read) === 1 ? true : false,
        update: Number(record?.update) === 1 ? true : false,
        delete: Number(record?.delete) === 1 ? true : false,
      });
    }
  }, [record, key]);

  return (
    <>
      <div className="mt-3">
        <div className="mx-auto p-3 bg-white shadow-md rounded-lg mt-3 w-full">
          <div className="flex gap-2 items-center">
            <Button
              className="bg-gray-200 rounded-full w-9 h-9"
              onClick={() => navigate("/user-type-permission")}
            >
              <ArrowLeftOutlined />
            </Button>
            <div className="text-d9 text-2xl w-full flex items-end justify-between">
              <div className="font-bold">
                {key === "UpdateKey"
                  ? "Update User Type Permission"
                  : "Add User Type Permission"}
              </div>
              {/* <div className="text-xs">All * marked fields are mandatory</div> */}
            </div>
          </div>
          <Divider className="bg-d9 h-2/3 mt-1" />
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <Form.Item label="Create" name="create" valuePropName="checked">
                <Checkbox />
              </Form.Item>
              <Form.Item label="Read" name="read" valuePropName="checked">
                <Checkbox />
              </Form.Item>
              <Form.Item label="Update" name="update" valuePropName="checked">
                <Checkbox />
              </Form.Item>
              <Form.Item label="Delete" name="delete" valuePropName="checked">
                <Checkbox />
              </Form.Item>
            </div>
            <Form.Item>
              <div className="flex w-full justify-end">
                <Button
                  loading={loading}
                  type="primary"
                  htmlType="submit"
                  className="w-fit rounded-none bg-5c"
                >
                  {key === "UpdateKey" ? "Update Permission" : "Add Permission"}
                </Button>
              </div>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
};

export default UpdateUserTypePermisssion;
