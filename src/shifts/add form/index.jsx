import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router";
import dayjs from "dayjs";
import { Form, Button, Divider } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { postData } from "../../Fetch/Axios";
import URLS from "../../urils/URLS";
import CustomTimepicker from "../../commonComponents/CustomTimePicker";
import CustomSelect from "../../commonComponents/CustomSelect";
import CustomInput from "../../commonComponents/CustomInput";
import { statusOptions } from "../../constant/const";

const AddShiftForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const key = location.state?.key;
  const record = location.state?.record;

  // API
  const onFinish = async (values) => {
    setLoading(true);
    const from_time = dayjs(values?.from_time);
    const to_time = dayjs(values?.to_time);
    const fromTimeFormatted = from_time.format("HH:mm:ss"); // 24-hour format
    const toTimeFormatted = to_time.format("HH:mm:ss"); // 24-hour format

    const finalData = {
      ...values,
      from_time: fromTimeFormatted,
      to_time: toTimeFormatted,
      ...(key === "UpdateKey" && { shift_id: Number(record?.shift_id) }),
    };

    const res = await postData(
      finalData,
      key === "UpdateKey" ? URLS.shiftEdit.path : URLS.shiftAdd.path,
      { version: URLS.shiftEdit.version }
    );
    setLoading(false);
    if (res.data.success) {
      form.resetFields();
      navigate("/shift");
    }
  };

  // set value
  useEffect(() => {
    if (key === "UpdateKey") {
      form.setFieldsValue({
        shift_id: Number(record?.shift_id),
        name: record?.name,
        status: Number(record?.status) === 2 ? "Deactive" : "Active",
        from_time: dayjs(record?.from_time, "HH:mm:ss"), // Convert to dayjs object
        to_time: dayjs(record?.to_time, "HH:mm:ss"), // Convert to dayjs object
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
              onClick={() => navigate("/shift")}
            >
              <ArrowLeftOutlined />
            </Button>
            <div className="text-d9 text-2xl w-full flex items-end justify-between">
              <div className="font-bold">
                {key === "UpdateKey" ? "Update Shift" : "Add Shift"}
              </div>
              <div className="text-xs">All * marked fields are mandatory</div>
            </div>
          </div>
          <Divider className="bg-d9 h-2/3 mt-1" />
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              <CustomInput
                name="name"
                label="Shift Name"
                placeholder="Shift Name"
                rules={[
                  {
                    required: true,
                    message: "Please enter the Shift Name",
                  },
                ]}
              />
              <CustomTimepicker
                label="Start Time"
                name="from_time"
                className="w-full"
                placeholder={"Date"}
                rules={[
                  {
                    required: true,
                    message: "Please select a start time!",
                  },
                ]}
              />
              <CustomTimepicker
                label="End Time"
                name="to_time"
                className="w-full"
                placeholder={"Date"}
                rules={[
                  {
                    required: true,
                    message: "Please select a end time!",
                  },
                ]}
              />
              <CustomSelect
                name={"status"}
                label={"Select Status"}
                placeholder={"Select Status"}
                options={statusOptions || []}
                rules={[{ required: true, message: "Please select an option" }]}
              />
            </div>
            <Form.Item>
              <div className="flex w-full justify-end">
                <Button
                  loading={loading}
                  type="primary"
                  htmlType="submit"
                  className="w-fit rounded-none bg-5c"
                >
                  {key === "UpdateKey" ? "Update Shift" : "Add Shift"}
                </Button>
              </div>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
};

export default AddShiftForm;
