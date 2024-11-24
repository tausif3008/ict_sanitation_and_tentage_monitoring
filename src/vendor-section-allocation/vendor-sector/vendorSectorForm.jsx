import React, { useEffect, useMemo, useState } from "react";
import { Form, Button, Divider, Select } from "antd";
import { useLocation, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { ArrowLeftOutlined } from "@ant-design/icons";
import URLS from "../../urils/URLS";
import { postData } from "../../Fetch/Axios";
import { getFormData } from "../../urils/getFormData";
import { getVendorList } from "../../vendor/VendorSupervisorRegistration/Slice/VendorSupervisorSlice";
import VendorSupervisorSelector from "../../vendor/VendorSupervisorRegistration/Slice/VendorSupervisorSelector";
import {
  getSectorsList,
  getUserTypeWiseUserList,
  getVendorWiseSupervisorList,
} from "./Slice/vendorSectorSlice";
import VendorSectorSelectors from "./Slice/vendorSectorSelectors";
import { getUserTypeList } from "../../permission/UserTypePermission/userTypeSlice";
import UserTypeSelector from "../../permission/UserTypePermission/userTypeSelector";

// assing sector to user type
const VendorSectorForm = () => {
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const key = location.state?.key;
  const record = location.state?.record;

  const [form] = Form.useForm();
  const { VendorListDrop } = VendorSupervisorSelector();
  const { SectorListDrop, UsersDropTypeWise, SuperwiseListDrop } =
    VendorSectorSelectors(); // sector
  const { UserListDrop } = UserTypeSelector(); // user type list
  const userTypeArray = ["8", "9", "14"]; // vendor, smo, naib tahsildar
  const formValues = form.getFieldValue("user_type_id");

  const filteredUserType = useMemo(() => {
    return (
      UserListDrop?.filter((data) => {
        return userTypeArray.includes(String(data?.value));
      }) || []
    );
  }, [UserListDrop]);

  useEffect(() => {
    if (JSON.stringify(filteredUserType) !== JSON.stringify(userType)) {
      setUserType(filteredUserType);
    }
  }, [filteredUserType, userType]);

  // select user dropdwon
  const handleSelect = async (value) => {
    form.setFieldsValue({
      user_id: null,
      Supervisor_id: null,
    });
    const url = `${URLS?.TypeWiseUserList?.path}${value}`;
    dispatch(getUserTypeWiseUserList(url));
  };

  // select vendor wise supervisor dropdwon
  const handleUserSelect = async (value) => {
    form.setFieldsValue({
      Supervisor_id: null,
    });
    const url = `${URLS?.vendorwiseSupervisor?.path}${value}`;
    formValues === "8" && dispatch(getVendorWiseSupervisorList(url));
  };

  const onFinish = async (values) => {
    const finalData = {
      ...values,
      user_id:
        values?.user_type_id === "8" ? values?.Supervisor_id : values?.user_id,
      vendor_id: values?.user_type_id === "8" ? values?.user_id : null,
      ...(key === "UpdateKey" && {
        allocation_sector_id: record?.allocation_sector_id,
      }),
    };
    setLoading(true);

    const res = await postData(
      getFormData(finalData),
      key === "UpdateKey"
        ? URLS.editAllocate_Sector.path
        : URLS.addAllocate_Sector.path,
      {
        version: URLS.addAllocate_Sector.version,
      }
    );

    if (res) {
      if (res.data.success) {
        form.resetFields();
        navigate("/sector-allocation");
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    dispatch(getVendorList()); // vendor list
    const uri = URLS?.allUserType?.path;
    dispatch(getUserTypeList(uri)); //  user type
    dispatch(getSectorsList()); // all sectors list

    return () => {};
  }, []);

  // set value
  useEffect(() => {
    if (key === "UpdateKey") {
      const url = `${URLS?.TypeWiseUserList?.path}${record?.user_type_id}`;
      dispatch(getUserTypeWiseUserList(url)); // user list

      const myUrl = `${URLS?.vendorwiseSupervisor?.path}${record?.vendor_id}`;
      record?.user_type_id === "8" &&
        dispatch(getVendorWiseSupervisorList(myUrl)); // vendor list

      form.setFieldsValue({
        user_id:
          record?.user_type_id === "8" ? record?.vendor_id : record?.user_id,
        Supervisor_id: record?.user_type_id === "8" ? record?.user_id : null,
        user_type_id: record?.user_type_id,
        sector_id: record?.sector_id,
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
                navigate("/sector-allocation");
              }}
            >
              <ArrowLeftOutlined />
            </Button>
            <div className="text-d9 text-2xl w-full flex items-end justify-between ">
              <div className="font-bold">
                {key === "UpdateKey"
                  ? "Update Allocation of Sector"
                  : "Add Allocation of Sector"}
              </div>
              <div className="text-xs">All * marks fields are mandatory</div>
            </div>
          </div>
          <Divider className="bg-d9 h-2/3 mt-1" />

          <Form form={form} layout="vertical" onFinish={onFinish}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-5">
              <Form.Item
                name={"user_type_id"}
                label={"Select User Type"}
                rules={[
                  {
                    required: true,
                    message: "Please select User Type", // Customize the error message
                  },
                ]}
              >
                <Select
                  placeholder="Select User Type"
                  className="rounded-none"
                  onSelect={handleSelect}
                >
                  {userType?.map((option) => (
                    <Select.Option key={option?.value} value={option?.value}>
                      {option?.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name={"user_id"}
                label={"Select User"}
                rules={[
                  {
                    required: true,
                    message: "Please select an User", // Customize the error message
                  },
                ]}
              >
                <Select
                  placeholder="Select User"
                  className="rounded-none"
                  onSelect={handleUserSelect}
                >
                  {UsersDropTypeWise?.map((option) => (
                    <Select.Option key={option?.value} value={option?.value}>
                      {option?.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              {formValues === "8" && (
                <Form.Item
                  name={"Supervisor_id"}
                  label={"Select Supervisor"}
                  rules={[
                    {
                      required: true,
                      message: "Please select Supervisor", // Customize the error message
                    },
                  ]}
                >
                  <Select
                    placeholder="Select Supervisor"
                    className="rounded-none"
                  >
                    {SuperwiseListDrop?.map((option) => (
                      <Select.Option key={option?.value} value={option?.value}>
                        {option?.label}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              )}

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
                <Select
                  placeholder="Select sector"
                  className="rounded-none"
                  mode="multiple"
                >
                  {SectorListDrop?.map((option) => (
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
