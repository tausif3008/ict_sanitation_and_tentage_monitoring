import React, { useEffect, useState } from "react";
import { Form, Input, Button, Select, Divider } from "antd";
import { postData } from "../../Fetch/Axios";
import URLS from "../../urils/URLS";
import { getFormData } from "../../urils/getFormData";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import CommonFormDropDownMaker from "../../commonComponents/CommonFormDropDownMaker";
import { setRouteListIsUpdated } from "./assignRouteSlice";

const AssignRouteForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const assignRouteUpdateElSelector = useSelector(
    (state) => state.assignRouteSlice?.routeUpdate
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (assignRouteUpdateElSelector) {
      form.setFieldsValue(assignRouteUpdateElSelector);
    }
  }, [assignRouteUpdateElSelector, form]);

  const onFinish = async (values) => {
    setLoading(true);

    values.status = 1;

    if (assignRouteUpdateElSelector) {
      values.vehicle_id = assignRouteUpdateElSelector.vehicle_id;
    }

    const res = await postData(
      getFormData(values),
      assignRouteUpdateElSelector ? URLS.editAssignRoute.path : URLS.assignRoute.path,
      {
        version: URLS.assignRoute.version,
      }
    );

    if (res) {
      setLoading(false);
        dispatch(setRouteListIsUpdated({ isUpdated: true }));

      if (res.data.success) {
        form.resetFields();

        if (assignRouteUpdateElSelector) {
          navigate("/assigned-routelist");
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
              navigate("/assigned-routelist");
            }}
          >
            <ArrowLeftOutlined></ArrowLeftOutlined>
          </Button>
          <div className="text-d9 text-2xl  w-full flex items-end justify-between ">
            <div className="font-bold">
              {assignRouteUpdateElSelector ? "Update Route" : "Assign Route"}
            </div>
            <div className="text-xs">All * marks fields are mandatory</div>
          </div>
        </div>

        <Divider className="bg-d9 h-2/3 mt-1"></Divider>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-3">
            <CommonFormDropDownMaker
              uri={"vendors"}
              responseListName="users"
              responseLabelName="name"
              responseIdName="user_id"
              selectLabel={"Vendor"}
              selectName={"user_id"}
              RequiredMessage={"Main type is required!"}
            />

            <Form.Item label="Vehicle Number" name="rc">
              <Input placeholder="select Vehicle" className="rounded-none" />
            </Form.Item>

            <Form.Item label="Route Name" name="name">
              <Input placeholder="Route Name" className="rounded-none" />
            </Form.Item>
          </div>
          <div className="flex justify-end">
            <Form.Item>
              <Button
                loading={loading}
                type="primary"
                htmlType="submit"
                className="w-fit rounded-none bg-5c"
              >
                {assignRouteUpdateElSelector ? "Update Route" : "Assign Route"}
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default AssignRouteForm;
