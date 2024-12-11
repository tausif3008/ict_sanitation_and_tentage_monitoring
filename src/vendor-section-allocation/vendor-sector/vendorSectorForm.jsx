import React, { useEffect, useMemo, useState } from "react";
import { Form, Button, Divider } from "antd";
import { useLocation, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { ArrowLeftOutlined } from "@ant-design/icons";
import URLS from "../../urils/URLS";
import { postData } from "../../Fetch/Axios";
import { getFormData } from "../../urils/getFormData";
import {
  getSectorsList,
  getUserTypeWiseUserList,
  getVendorWiseSupervisorList,
} from "./Slice/vendorSectorSlice";
import VendorSectorSelectors from "./Slice/vendorSectorSelectors";
import { getUserTypeList } from "../../permission/UserTypePermission/userTypeSlice";
import UserTypeSelector from "../../permission/UserTypePermission/userTypeSelector";
import CustomSelect from "../../commonComponents/CustomSelect";

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
        user_id: record?.user_id,
        vendor_id: record?.vendor_id,
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
              <CustomSelect
                name={"user_type_id"}
                label={"Select User Type"}
                placeholder="Select User Type"
                onSelect={handleSelect}
                options={userType || []}
                rules={[
                  {
                    required: true,
                    message: "Please select User Type", // Customize the error message
                  },
                ]}
              />
              <CustomSelect
                name={formValues === "8" ? "vendor_id" : "user_id"}
                label={
                  formValues === "8" ? "Select Vendor" : "Select Supervisor"
                }
                placeholder={
                  formValues === "8" ? "Select Vendor" : "Select Supervisor"
                }
                onSelect={handleUserSelect}
                options={UsersDropTypeWise || []}
                rules={[
                  {
                    required: true,
                    message:
                      formValues === "8"
                        ? "Please select Vendor"
                        : "Please select Supervisor", // Customize the error message
                  },
                ]}
              />
              {formValues === "8" && (
                <CustomSelect
                  name={"user_id"}
                  label={"Select Supervisor"}
                  placeholder={"Select Supervisor"}
                  options={SuperwiseListDrop || []}
                  rules={[
                    {
                      required: true,
                      message: "Please select Supervisor", // Customize the error message
                    },
                  ]}
                />
              )}
              <CustomSelect
                name={"sector_id"}
                label={"Select Sector"}
                placeholder={"Select Sector"}
                mode="multiple"
                rules={[
                  {
                    required: true,
                    message: "Please select sector",
                  },
                ]}
                options={SectorListDrop || []}
              />
            </div>
            <div className="flex justify-end">
              <Button
                loading={loading}
                type="primary"
                htmlType="submit"
                className="w-fit rounded-none bg-5c"
              >
                {key === "UpdateKey" ? "Update" : "Register"}
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
};

export default VendorSectorForm;
