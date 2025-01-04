import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Collapse, Form, Button, Row, Col, message } from "antd";

import search from "../../assets/Dashboard/icon-search.png";
import { EditOutlined } from "@ant-design/icons";
import CommonTable from "../../commonComponents/CommonTable";
import CommonDivider from "../../commonComponents/CommonDivider";
import VendorSupervisorSelector from "../../vendor/VendorSupervisorRegistration/Slice/VendorSupervisorSelector";
import CustomSelect from "../../commonComponents/CustomSelect";
import CustomInput from "../../commonComponents/CustomInput";
import { getVendorList } from "../../vendor/VendorSupervisorRegistration/Slice/VendorSupervisorSlice";
import { vehicleType } from "../../constant/const";
import { getVehicleList } from "./Slice/vehicleSlice";
import VehicleSelectors from "./Slice/vehicleSelector";

const VehicleList = () => {
  const [details, setDetails] = useState({
    list: [],
    pageLength: 25,
    currentPage: 1,
  });

  const navigate = useNavigate();
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

  // param
  const getCurrentParam = () => {
    const newParams = new URLSearchParams(params?.page);
    let result = {};
    for (const [key, value] of newParams.entries()) {
      result[key] = value;
    }
    return result;
  };

  const getUsers = async () => {
    const myParam = getCurrentParam();
    const newParam = {
      ...myParam,
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
      title: "Sr. No", // Asset main type
      dataIndex: "sr",
      key: "sr",
      width: 80,
    },
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
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      fixed: "right",
      width: 100,
      render: (text, record) => (
        <>
          <div className="flex justify-between">
            <Button
              className="bg-blue-100 border-blue-500 focus:ring-blue-500 hover:bg-blue-200 rounded-full"
              onClick={() => {
                navigate(`/vehicle-registration`, {
                  state: {
                    key: "UpdateKey",
                    record: record, // Pass the record as part of the state
                  },
                });
              }}
            >
              <EditOutlined />
            </Button>
          </div>
        </>
      ),
    },
  ];

  return (
    <div className="container mx-auto px-4">
      <CommonDivider
        label={"Vehicle List"}
        compo={
          <Button
            onClick={() => navigate("/vehicle-registration")}
            className="bg-orange-300 mb-1"
          >
            Add Vehicle
          </Button>
        }
      />
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
                  <Row gutter={[16, 16]} align="middle">
                    <Col key="user_id" xs={24} sm={12} md={6} lg={5}>
                      <CustomSelect
                        name={"user_id"}
                        label={"Select Vendor"}
                        placeholder={"Select Vendor"}
                        options={VendorListDrop || []}
                      />
                    </Col>
                    <Col key="type" xs={24} sm={12} md={6} lg={5}>
                      <CustomSelect
                        label="Vehicle Type"
                        name="type"
                        placeholder={"Select Vehicle Type"}
                        options={vehicleType || []}
                      />
                    </Col>
                    <Col key="number" xs={24} sm={12} md={6} lg={5}>
                      <CustomInput
                        label="Vehicle Number"
                        name="number"
                        placeholder="Enter Vehicle Number"
                      />
                    </Col>
                    <Col key="imei" xs={24} sm={12} md={6} lg={5}>
                      <CustomInput
                        label="IMEI Number"
                        name="imei"
                        placeholder="Enter IMEI Number"
                      />
                    </Col>
                    <Col key="chassis_no" xs={24} sm={12} md={6} lg={5}>
                      <CustomInput
                        label="Chassis Number"
                        name="chassis_no"
                        placeholder="Enter Chassis Number"
                      />
                    </Col>
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
                  </Row>
                </Form>
              ),
            },
          ]}
        />
      </div>

      <CommonTable
        loading={loading}
        uri={"vehicle"}
        columns={columns || []}
        details={details}
        scroll={{ x: 1200, y: 400 }}
        tableSubheading={{
          "Total Records": details?.totalRecords || 0,
        }}
      />
    </div>
  );
};

export default VehicleList;
