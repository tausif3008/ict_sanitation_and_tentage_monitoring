import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import dayjs from "dayjs";
import moment from "moment";
import { Collapse, Form, Button, message } from "antd";

import VehicleSelectors from "../../register/vehicle/Slice/vehicleSelector";
import VendorSelectors from "../VendorwiseReports/vendorSelectors";
import { getVehicleList } from "../../register/vehicle/Slice/vehicleSlice";
import { getVendorCategoryTypeDrop } from "../VendorwiseReports/vendorslice";
import CustomSelect from "../../commonComponents/CustomSelect";
import CustomInput from "../../commonComponents/CustomInput";
import CustomDatepicker from "../../commonComponents/CustomDatepicker";
import CustomTable from "../../commonComponents/CustomTable";
import {
  getFormatedNumber,
  getValueLabel,
  vehicleType,
} from "../../constant/const";
import search from "../../assets/Dashboard/icon-search.png";
import CommonDivider from "../../commonComponents/CommonDivider";
import { getPdfExcelData } from "../../register/asset/AssetsSlice";
import URLS from "../../urils/URLS";
import { exportToExcel } from "../ExportExcelFuntion";
import { ExportPdfFunction } from "../ExportPdfFunction";
import { getSectorsList } from "../../vendor-section-allocation/vendor-sector/Slice/vendorSectorSlice";
import VendorSectorSelectors from "../../vendor-section-allocation/vendor-sector/Slice/vendorSectorSelectors";

const VehicleReports = ({ modalName = "Vehicle Report", showPdf = true }) => {
  const [details, setDetails] = useState({
    list: [],
    pageLength: 25,
    currentPage: 1,
  });

  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const formValue = form.getFieldsValue();

  const { VehicleData, loading } = VehicleSelectors(); // vehicle
  const { paging, vehicles } = VehicleData?.data || {};
  const { VendorCatTypeDrop } = VendorSelectors(); // vendor dropdown & Reports
  const { SectorListDrop } = VendorSectorSelectors(); // all sector dropdown

  // fiter finish
  const onFinishForm = (values) => {
    const allUndefined = Object.values(values).every(
      (value) => value === undefined
    );
    if (allUndefined) {
      message.error("Please Select any search field");
      return;
    }
    const dayjsDate = new Date(values?.date);
    const formattedDate = moment(dayjsDate).format("YYYY-MM-DD");
    const finalValues = {
      ...(values?.user_id && { user_id: `${values?.user_id}` }),
      ...(values?.type && { type: `${values?.type}` }),
      ...(values?.number && { number: `${values?.number}` }),
      ...(values?.chassis_no && { chassis_no: `${values?.chassis_no}` }),
      ...(values?.imei && { imei: `${values?.imei}` }),
      ...(values?.sector_id && { sector_id: values?.sector_id }),
      date: values?.date ? formattedDate : moment().format("YYYY-MM-DD"),
      page: "1",
      per_page: "25",
    };
    dispatch(getVehicleList(finalValues)); // get vehicle list
  };

  // reset form
  const resetForm = () => {
    let newDate = dayjs().format("YYYY-MM-DD");
    form.resetFields();
    form.setFieldsValue({
      date: dayjs(newDate, "YYYY-MM-DD"),
    });
    const myParam = {
      page: "1",
      per_page: "25",
      date: moment().format("YYYY-MM-DD"),
    };
    dispatch(getVehicleList(myParam));
  };

  const getUsers = async (dataObj = {}) => {
    const dayjsDate = new Date(formValue?.date);
    const formattedDate = moment(dayjsDate).format("YYYY-MM-DD");
    const newParam = {
      page: dataObj?.page || "1",
      per_page: dataObj?.size || "25",
      ...form.getFieldsValue(),
      date: formValue?.date ? formattedDate : moment().format("YYYY-MM-DD"),
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
    let newDate = dayjs().format("YYYY-MM-DD");
    form.setFieldsValue({
      date: dayjs(newDate, "YYYY-MM-DD"),
    });
    getUsers();
    const paramData = {
      asset_main_type_id: 5,
    };
    dispatch(getVendorCategoryTypeDrop(paramData)); // asset type wise vendor list
    dispatch(getSectorsList()); // all sectors
  }, []);

  const fileName = "Vehicle Report";
  const vehicleTypefileName = formValue?.type;
  const vendorfileName = getValueLabel(
    formValue?.user_id,
    VendorCatTypeDrop,
    undefined
  );
  const sector_idfileName = getValueLabel(
    formValue?.sector_id,
    SectorListDrop,
    undefined
  );
  const fileDateName = dayjs(formValue?.date).format("DD-MMM-YYYY");
  let finalFileName = fileName;
  if (vehicleTypefileName || vendorfileName || fileDateName) {
    const parts = [];
    if (vendorfileName) parts.push(vendorfileName);
    if (sector_idfileName) parts.push(sector_idfileName);
    if (vehicleTypefileName) parts.push(vehicleTypefileName);
    if (fileDateName) parts.push(fileDateName);
    finalFileName += `-${parts.join(" - ")}`;
  }

  // vehicles reports
  const vehicleColumns = [
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
      title: "Sector",
      dataIndex: "sector_id",
      key: "sector_id",
      render: (text, record) => {
        return text ? getValueLabel(text, SectorListDrop, "Sector") : "-";
      },
    },
    {
      title: "Routes",
      dataIndex: "route_name",
      key: "route_name",
      render: (text, record) => {
        return record?.route_name ? record : "-";
      },
    },
    {
      title: "Runnable (Kilometer)",
      dataIndex: "distance_run",
      key: "distance_run",
      render: (text, record) => {
        return record?.distance_run ? text : "0 Km";
      },
    },
  ];

  // pdf header
  const pdfHeader = useMemo(() => {
    return [
      "Sr No",
      ...(formValue?.user_id ? [] : ["Vendor Name"]),
      ...(formValue?.type ? [] : ["Vehicle Type"]),
      "Vehicle Number",
      "IMEI Number",
      "Chassis Number",
      ...(formValue?.sector_id ? [] : ["Sector Name"]),
      "Routes",
      "Kilometer",
    ];
  }, [formValue]);

  // const columnPercentages = [
  //   4, // Sr No (10%)
  //   13, // User Type (15%)
  //   15, // Name (20%)
  //   10, // Phone (15%)
  //   20, // Email (20%)
  //   20, // Address (10%)
  //   9, // City (9%)
  //   9, // State (5%)
  //   // 0   // Country (0%) – if unused, no space is allocated for this column
  // ];

  // excel && pdf file

  const exportToFile = async (isExcel) => {
    const dayjsDate = new Date(formValue?.date);
    const formattedDate = moment(dayjsDate).format("YYYY-MM-DD");
    const param = {
      page: "1",
      per_page: "5000",
      ...(formValue?.user_id && { user_id: formValue?.user_id }),
      ...(formValue?.type && { type: formValue?.type }),
      ...(formValue?.number && { number: formValue?.number }),
      ...(formValue?.imei && { imei: formValue?.imei }),
      ...(formValue?.sector_id && { sector_id: formValue?.sector_id }),
      ...(formValue?.chassis_no && { chassis_no: formValue?.chassis_no }),
      date: formValue?.date ? formattedDate : moment().format("YYYY-MM-DD"),
    };
    try {
      const url = URLS?.vehicles?.path;
      const res = await dispatch(getPdfExcelData(`${url}`, param));
      if (!res?.data?.vehicles) {
        throw new Error("No vehicles found in the response data.");
      }

      // Map data for Excel
      const myexcelData =
        isExcel &&
        res?.data?.vehicles?.map((data, index) => {
          return {
            Sr: index + 1,
            ...(!formValue?.user_id && {
              "Vendor Name": data?.user_name || "",
            }),
            ...(!formValue?.type && {
              "Vehicle Type": data?.type || "",
            }),
            "Vehicle Number": data?.number || "",
            "IMEI Number": Number(data?.imei) || "",
            "Chassis Number": data?.chassis_no || "",
            ...(!formValue?.sector_id && {
              "Sector Name":
                getValueLabel(data?.sector_id, SectorListDrop, "Sector") || "",
            }),
            Routes: data?.route_name || "-",
            Kilometers: data?.distance_run || "0 Km",
          };
        });

      const pdfData =
        !isExcel &&
        res?.data?.vehicles?.map((data, index) => [
          index + 1,
          ...(formValue?.user_id ? [] : [data?.user_name || ""]),
          ...(formValue?.type ? [] : [data?.type || ""]),
          data?.number || "",
          Number(data?.imei) || "",
          data?.chassis_no || "",
          ...(formValue?.sector_id
            ? []
            : [getValueLabel(data?.sector_id, SectorListDrop, "Sector") || ""]),
          data?.route_name || "-",
          data?.distance_run || "0 Km",
        ]);

      // Call the export function
      isExcel && exportToExcel(myexcelData, `${finalFileName}`);

      // Call the export function
      !isExcel &&
        ExportPdfFunction(
          `${finalFileName}`,
          `${finalFileName}`,
          pdfHeader,
          pdfData,
          true,
          false
          // columnPercentages
        );
    } catch (error) {
      message.error(`Error occurred: ${error.message || "Unknown error"}`);
    }
  };

  return (
    <>
      <CommonDivider className="ml-10-" label={`${modalName}`} />
      <div className="flex justify-end gap-2 font-semibold">
        {showPdf && (
          <>
            <Button
              type="primary"
              onClick={() => {
                exportToFile(false);
              }}
            >
              Download Pdf
            </Button>
            <Button
              type="primary"
              onClick={() => {
                exportToFile(true);
              }}
            >
              Download Excel
            </Button>
          </>
        )}
      </div>
      <div className="rounded-md w-full">
        <div className="mx-4 mb-6">
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4">
                      <CustomSelect
                        name={"user_id"}
                        label={"Select Vendor"}
                        placeholder={"Select Vendor"}
                        options={VendorCatTypeDrop || []}
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
                        placeholder="eg. AA00AA0000"
                        maxLength={10}
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
                      <CustomSelect
                        name={"sector_id"}
                        label={"Select Sector"}
                        placeholder={"Select Sector"}
                        options={SectorListDrop || []}
                      />
                      <CustomDatepicker
                        name={"date"}
                        label={"Date"}
                        className="w-full"
                        placeholder={"Date"}
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
          <CustomTable
            loading={loading}
            columns={vehicleColumns || []}
            bordered
            dataSource={details || []}
            scroll={{ x: 100, y: 400 }}
            tableSubheading={{
              "Total Records": getFormatedNumber(details?.totalRecords) || 0,
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
    </>
  );
};

export default VehicleReports;
