import React, { useEffect, useState } from "react";
import { Form, Button, Divider, Select } from "antd";
import { useLocation, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { ArrowLeftOutlined } from "@ant-design/icons";
import URLS from "../../urils/URLS";
import { postData } from "../../Fetch/Axios";
import { getFormData } from "../../urils/getFormData";
import { getVendorList } from "../../vendor/VendorSupervisorRegistration/Slice/VendorSupervisorSlice";
import VendorSupervisorSelector from "../../vendor/VendorSupervisorRegistration/Slice/VendorSupervisorSelector";
import { getVendorWiseSupervisorList } from "./Slice/vendorSectorSlice";
import VendorSectorSelectors from "./Slice/vendorSectorSelectors";

const VendorSectorForm = () => {
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const key = location.state?.key;
  const record = location.state?.record;

  const [form] = Form.useForm();
  const { VendorListDrop } = VendorSupervisorSelector();
  const { SuperwiseListDrop } = VendorSectorSelectors();

  // select vendor dropdwon
  const handleSelect = async (value) => {
    form.setFieldsValue({
      supervisor_id: null,
    });
    const url = `${URLS?.vendorwiseSupervisor?.path}?vendor_id=${value}`;
    dispatch(getVendorWiseSupervisorList(url));
  };

  const onFinish = async (values) => {
    const finalData = {
      ...values,
      user_type_id: 13,
      status: 1,
      password: values?.phone,
      ...(key === "UpdateKey" && { user_id: record?.user_id }),
    };
    setLoading(true);

    const res = await postData(
      getFormData(finalData),
      key === "UpdateKey"
        ? URLS.editAllocate_Supervisor.path
        : URLS.addAllocate_Supervisor.path,
      {
        version: URLS.addAllocate_Supervisor.version,
      }
    );

    if (res) {
      if (res.data.success) {
        form.resetFields();
        navigate("/vendor-sector-allocation");
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    dispatch(getVendorList()); // vendor list

    return () => {};
  }, []);

  // set value
  useEffect(() => {
    if (key === "UpdateKey") {
      console.log("record", record);
      form.setFieldsValue({
        vendor_id: Number(record?.vendor_id) === 0 ? null : record?.vendor_id,
        name: record?.name,
        phone: record?.phone,
        email: record?.email,
        address: record?.address,
        user_type_id: record?.user_type_id,
        password: record?.password,
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
              onClick={() => {
                navigate("/vendor-sector-allocation");
              }}
            >
              <ArrowLeftOutlined />
            </Button>
            <div className="text-d9 text-2xl w-full flex items-end justify-between ">
              <div className="font-bold">
                {key === "UpdateKey"
                  ? "Update Vendor to Sector"
                  : "Assign Vendor to Sector"}
              </div>
              <div className="text-xs">All * marks fields are mandatory</div>
            </div>
          </div>
          <Divider className="bg-d9 h-2/3 mt-1" />

          <Form form={form} layout="vertical" onFinish={onFinish}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-5">
              <Form.Item
                name={"vendor_id"}
                label={"Select Vendor"}
                rules={[
                  {
                    required: true,
                    message: "Please select vendor", // Customize the error message
                  },
                ]}
              >
                <Select
                  placeholder="Select Vendor"
                  className="rounded-none"
                  onSelect={handleSelect}
                >
                  {VendorListDrop?.map((option) => (
                    <Select.Option key={option?.value} value={option?.value}>
                      {option?.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name={"supervisor_id"}
                label={"Select Supervisor"}
                rules={[
                  {
                    required: true,
                    message: "Please select an asset main type", // Customize the error message
                  },
                ]}
              >
                <Select placeholder="Select Vendor" className="rounded-none">
                  {SuperwiseListDrop?.map((option) => (
                    <Select.Option key={option?.value} value={option?.value}>
                      {option?.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name={"asset_id"}
                label={"Select Asset Type"}
                rules={[
                  {
                    required: true,
                    message: "Please select an asset type", // Customize the error message
                  },
                ]}
              >
                <Select placeholder="Select Vendor" className="rounded-none">
                  {SuperwiseListDrop?.map((option) => (
                    <Select.Option key={option?.value} value={option?.value}>
                      {option?.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name={"sector_id"}
                label={"Select Sector"}
                rules={[
                  {
                    required: true,
                    message: "Please select sector",
                  },
                ]}
              >
                <Select placeholder="Select Vendor" className="rounded-none">
                  {SuperwiseListDrop?.map((option) => (
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
                  loading={loading}
                  type="primary"
                  htmlType="submit"
                  className="w-fit rounded-none bg-5c"
                >
                  {key === "UpdateKey" ? "Update" : "Register"}
                </Button>
              </Form.Item>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
};

export default VendorSectorForm;
