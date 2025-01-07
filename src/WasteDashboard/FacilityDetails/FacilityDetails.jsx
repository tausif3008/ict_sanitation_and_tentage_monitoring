import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Collapse, Form, Button, message } from "antd";

import CustomSelect from "../../commonComponents/CustomSelect";
import DashboardTitle from "../DashboardTitle";
import VendorSupervisorSelector from "../../vendor/VendorSupervisorRegistration/Slice/VendorSupervisorSelector";
import { getVendorList } from "../../vendor/VendorSupervisorRegistration/Slice/VendorSupervisorSlice";
import VehicleSelectors from "../../register/vehicle/Slice/vehicleSelector";
import { getVehicleList } from "../../register/vehicle/Slice/vehicleSlice";
import CustomInput from "../../commonComponents/CustomInput";
import { vehicleType } from "../../constant/const";
import search from "../../assets/Dashboard/icon-search.png";
import CustomTable from "../../commonComponents/CustomTable";

const FacilityDetails = ({ title }) => {
  const [details, setDetails] = useState({
    list: [],
    pageLength: 25,
    currentPage: 1,
  });

  const dispatch = useDispatch();
  const params = useParams();
  const [form] = Form.useForm();

  const { VendorListDrop } = VendorSupervisorSelector(); // vendor
  const { VehicleData, loading } = VehicleSelectors(); // vehicle
  const { paging, vehicles } = VehicleData?.data || {};

  // fiter finish
  const onFinishForm = (values) => {
    const allUndefined = Object.values(values).every(
      (value) => value === undefined
    );
    if (allUndefined) {
      message.error("Please Select any search field");
      return;
    }
    const finalValues = {
      ...(values?.user_id && { user_id: `${values?.user_id}` }),
      ...(values?.type && { type: `${values?.type}` }),
      ...(values?.number && { number: `${values?.number}` }),
      ...(values?.chassis_no && { chassis_no: `${values?.chassis_no}` }),
      ...(values?.imei && { imei: `${values?.imei}` }),
      page: "1",
      per_page: "25",
    };
    dispatch(getVehicleList(finalValues)); // get vehicle list
  };

  // reset form
  const resetForm = () => {
    form.resetFields();
    const myParam = {
      page: "1",
      per_page: "25",
    };
    dispatch(getVehicleList(myParam));
  };

  const getUsers = async (dataObj = {}) => {
    const newParam = {
      page: dataObj?.page || "1",
      per_page: dataObj?.size || "25",
      ...form.getFieldsValue(),
    };
    dispatch(getVehicleList(newParam));
  };

  useEffect(() => {
    if (VehicleData?.success) {
      setDetails(() => {
        return {
          list: vehicles || [],
          pageLength: vehicles?.length || 1,
          currentPage: paging[0].currentpage || 1,
          totalRecords: paging[0].totalrecords || 1,
        };
      });
    } else {
      setDetails(() => {
        return {
          list: [],
          pageLength: 0,
          currentPage: 1,
          totalRecords: 0,
        };
      });
    }
  }, [VehicleData]);

  useEffect(() => {
    getUsers();
  }, [params]);

  useEffect(() => {
    dispatch(getVendorList()); // vendor list
  }, []);

  const columns = [
    {
      title: "Vendor Name",
      dataIndex: "user_name",
      key: "user_name",
    },
    {
      title: "Vehicle Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Vehicle Number",
      dataIndex: "number",
      key: "number",
    },
    {
      title: "IMEI Number",
      dataIndex: "imei",
      key: "imei",
    },
    {
      title: "Chassis Number",
      dataIndex: "chassis_no",
      key: "chassis_no",
    },
  ];

  return (
    <div className="rounded-md w-full">
      <DashboardTitle title={title || "Vehicles Details"}></DashboardTitle>
      {/* <div className="p-2">
        <FacilityDetailsForm></FacilityDetailsForm>
      </div>
      <div>
        <FacilityDetailsTable
          columnss={columns}
          dataSourcee={dataSource}
        ></FacilityDetailsTable>
      </div> */}
      <div className="mx-4 mb-6">
        <div>
          <Collapse
            defaultActiveKey={["1"]}
            size="small"
            className="rounded-none mt-3"
            items={[
              {
                key: 1,
                label: (
                  <div className="flex items-center h-full">
                    <img src={search} className="h-5" alt="Search Icon" />
                  </div>
                ),
                children: (
                  <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinishForm}
                    key="form1"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                      <CustomSelect
                        name={"user_id"}
                        label={"Select Vendor"}
                        placeholder={"Select Vendor"}
                        options={VendorListDrop || []}
                      />
                      <CustomSelect
                        label="Vehicle Type"
                        name="type"
                        placeholder={"Select Vehicle Type"}
                        options={vehicleType || []}
                      />
                      <CustomInput
                        label="Vehicle Number"
                        name="number"
                        placeholder="Enter Vehicle Number"
                      />
                      <CustomInput
                        label="IMEI Number"
                        name="imei"
                        placeholder="Enter IMEI Number"
                      />
                      <CustomInput
                        label="Chassis Number"
                        name="chassis_no"
                        placeholder="Enter Chassis Number"
                      />
                      <div className="flex justify-start my-4 space-x-2 ml-3">
                        <div>
                          <Button
                            loading={loading}
                            type="button"
                            htmlType="submit"
                            className="w-fit rounded-none text-white bg-blue-500 hover:bg-blue-600"
                          >
                            Search
                          </Button>
                        </div>
                        <div>
                          <Button
                            loading={loading}
                            type="button"
                            className="w-fit rounded-none text-white bg-orange-300 hover:bg-orange-600"
                            onClick={resetForm}
                          >
                            Reset
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Form>
                ),
              },
            ]}
          />
        </div>

        <CustomTable
          loading={loading}
          columns={columns || []}
          bordered
          dataSource={details || []}
          scroll={{ x: 100, y: 400 }}
          tableSubheading={{
            "Total Records": details?.totalRecords,
          }}
          onPageChange={(page, size) => {
            const obj = {
              page: page,
              size: size,
            };
            getUsers(obj);
          }}
        />
      </div>
    </div>
  );
};

export default FacilityDetails;
