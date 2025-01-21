import React, { useEffect, useState } from "react";
import { Form, Button, Divider } from "antd";
import { useLocation, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { ArrowLeftOutlined } from "@ant-design/icons";
import URLS from "../../urils/URLS";
import { getFormData } from "../../urils/getFormData";
import CustomSelect from "../../commonComponents/CustomSelect";
import { getMonitoringAgent } from "../../complaince/monitoringSlice";
import MonitoringSelector from "../../complaince/monitoringSelector";
import CustomInput from "../../commonComponents/CustomInput";
import { postData } from "../../Fetch/Axios";

// assing sector to user type
const AssetAllocationForm = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const key = location.state?.key;
  const record = location.state?.record;
  const [form] = Form.useForm();
  const { monitoringAgentDrop } = MonitoringSelector(); // monitoring agent drop

  const onFinish = async (values) => {
    const finalData = {
      phone: values.allocated_phone,
      assets_code: values.asset_code,
      //   ...(key === "UpdateKey" && {
      //     allocation_id: record?.allocation_id,
      //   }),
    };
    setLoading(true);
    const res = await postData(
      getFormData(finalData),
      key === "UpdateKey"
        ? URLS.reAllocate_Asset.path
        : URLS.addAllocate_Sector.path,
      {
        version: URLS.reAllocate_Asset.version,
      }
    );
    if (res) {
      if (res.data.success) {
        form.resetFields();
        navigate("/asset-allocation");
      }
    }
    setLoading(false);
  };

  // set value
  useEffect(() => {
    if (key === "UpdateKey") {
      if (record?.user_id) {
        const urls =
          URLS?.monitoringAgent?.path +
          `&keywords=${record?.allocated_user?.split(" ")[0]}`;
        dispatch(getMonitoringAgent(urls)); // monitoring agent list
      }
      form.setFieldsValue(record);
    }
  }, [record, key]);

  return (
    <>
      <div className="mt-3">
        <div className="mx-auto p-3 bg-white shadow-md rounded-lg mt-3 w-full">
          <div className="flex gap-2 items-center">
            <Button
              className="bg-gray-200 rounded-full w-9 h-9"
              onClick={() => {
                navigate("/asset-allocation");
              }}
            >
              <ArrowLeftOutlined />
            </Button>
            <div className="text-d9 text-2xl w-full flex items-end justify-between ">
              <div className="font-bold">
                {key === "UpdateKey"
                  ? "Re-Allocation of Asset"
                  : "Add Allocation of Asset"}
              </div>
              <div className="text-xs">All * marks fields are mandatory</div>
            </div>
          </div>
          <Divider className="bg-d9 h-2/3 mt-1" />
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-5">
              <CustomSelect
                name={"user_id"}
                label={"Select GSD"}
                disabled={true}
                placeholder={"Select GSD"}
                options={monitoringAgentDrop || []}
                isOnSearchFind={true}
                allowClear={false}
                apiAction={getMonitoringAgent}
                onSearchUrl={`${URLS?.monitoringAgent?.path}&keywords=`}
              />
              <CustomInput
                name={"allocated_phone"}
                label={"Phone"}
                placeholder={"Phone"}
                rules={[
                  {
                    required: true,
                    message: "Please Add Phone Number!",
                  },
                ]}
              />
              <CustomInput
                name={"asset_code"}
                label={"Asset Code"}
                placeholder={"Asset Code"}
                rules={[
                  {
                    required: true,
                    message: "Please Add Asset Code!",
                  },
                ]}
              />
            </div>
            <div className="flex justify-end">
              <Button
                loading={loading}
                type="primary"
                htmlType="submit"
                className="w-fit rounded-none bg-5c"
              >
                {key === "UpdateKey" ? "Reallocate" : "Register"}
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
};

export default AssetAllocationForm;
