import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { Form, Button, Divider, message } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import CustomInput from "../../commonComponents/CustomInput";
import ParkingSelector from "./parkingSelector";
import { getFormData } from "../../urils/getFormData";
import { addParkingData } from "./parkingSlice";
import CustomSelect from "../../commonComponents/CustomSelect";
import VendorSectorSelectors from "../../vendor-section-allocation/vendor-sector/Slice/vendorSectorSelectors";
import { getSectorsList } from "../../vendor-section-allocation/vendor-sector/Slice/vendorSectorSlice";
import URLS from "../../urils/URLS";

const AddParkingForm = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const key = location.state?.key;
  const record = location.state?.record;

  const { loading } = ParkingSelector(); // parking selector
  const { SectorListDrop } = VendorSectorSelectors(); // all sector dropdown

  // API
  const onFinish = async (values) => {
    const finalData = {
      ...values,
      ...(key === "UpdateKey" && { parking_id: Number(record?.parking_id) }),
    };

    const formData = getFormData(finalData);
    const res = await dispatch(
      addParkingData(
        key === "UpdateKey" ? URLS.editParking.path : URLS?.addParking?.path,
        formData
      )
    ); // Add API
    if (res?.success) {
      message.success(
        key === "UpdateKey"
          ? "Parking Update Successfully"
          : "Parking Added Successfully"
      );
      navigate("/parking");
    } else {
      message.error("Something Went Wrong");
    }
  };

  useEffect(() => {
    dispatch(getSectorsList()); // all sectors
  }, []);

  // set value
  useEffect(() => {
    if (key === "UpdateKey") {
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
              onClick={() => navigate("/parking")}
            >
              <ArrowLeftOutlined />
            </Button>
            <div className="text-d9 text-2xl w-full flex items-end justify-between">
              <div className="font-bold">
                {key === "UpdateKey" ? "Update Parking" : "Add Parking"}
              </div>
              <div className="text-xs">All * marked fields are mandatory</div>
            </div>
          </div>
          <Divider className="bg-d9 h-2/3 mt-1" />
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              <CustomInput
                name="name"
                label="Parking Name"
                placeholder="Parking Name"
                rules={[
                  {
                    required: true,
                    message: "Please enter the Parking Name",
                  },
                ]}
              />
              <CustomSelect
                name={"mapped_sector_id"}
                label={"Select Sector"}
                placeholder={"Select Sector"}
                options={
                  [{ value: "0", label: "City Parking" }, ...SectorListDrop] ||
                  []
                }
              />
            </div>
            <div className="flex w-full justify-end">
              <Button
                loading={loading}
                type="primary"
                htmlType="submit"
                className="w-fit rounded-none bg-5c"
              >
                {key === "UpdateKey" ? "Update Parking" : "Add Parking"}
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
};

export default AddParkingForm;
