import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
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
  dateWeekOptions,
  getValueLabel,
  vehicleReportsColumns,
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

const VehicleReports = () => {
  const [showDateRange, setShowDateRange] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [details, setDetails] = useState({
    list: [],
    pageLength: 25,
    currentPage: 1,
  });

  const dispatch = useDispatch();
  const params = useParams();
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
    const finalValues = {
      ...(values?.user_id && { user_id: `${values?.user_id}` }),
      ...(values?.type && { type: `${values?.type}` }),
      ...(values?.number && { number: `${values?.number}` }),
      ...(values?.chassis_no && { chassis_no: `${values?.chassis_no}` }),
      ...(values?.imei && { imei: `${values?.imei}` }),
      ...(values?.sector_id && { sector_id: values?.sector_id }),
      page: "1",
      per_page: "25",
    };
    if (values?.date_format === "Today") {
      finalValues.form_date = moment().format("YYYY-MM-DD");
      finalValues.to_date = moment().format("YYYY-MM-DD");
    } else if (values?.form_date || values?.to_date) {
      const dayjsObjectFrom = dayjs(values?.form_date?.$d);
      const dayjsObjectTo = dayjs(values?.to_date?.$d);

      // Format the date as 'YYYY-MM-DD'
      const start = dayjsObjectFrom.format("YYYY-MM-DD");
      const end = dayjsObjectTo.format("YYYY-MM-DD");
      finalValues.form_date = values?.form_date ? start : end;
      finalValues.to_date = values?.to_date ? end : start;
    }
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
    setShowDateRange(false);
  };

  const handleDateSelect = (value) => {
    if (value === "Date Range") {
      setShowDateRange(true);
    } else {
      form.setFieldsValue({
        form_date: null,
        to_date: null,
      });
      setShowDateRange(false);
    }
  };

  const getUsers = async (dataObj = {}) => {
    const newParam = {
      page: dataObj?.page || "1",
      per_page: dataObj?.size || "25",
      ...form.getFieldsValue(),
    };
    dispatch(getVehicleList(newParam));
  };

  const disabledDate = (current) => {
    const maxDate = moment(startDate).clone().add(8, "days");
    return (
      current &&
      (current.isBefore(startDate, "day") || current.isAfter(maxDate, "day"))
    );
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
    "Vendor Name"
  );

  const fileDateName =
    formValue?.date_format === "Today"
      ? moment().format("DD-MMM-YYYY")
      : formValue?.date_format === "Date Range"
      ? `${dayjs(formValue?.form_date).format("DD-MMM-YYYY")} to ${dayjs(
          formValue?.to_date
        ).format("DD-MMM-YYYY")}`
      : null;

  // Dynamically build the file name
  let finalFileName = fileName;

  if (vehicleTypefileName || vendorfileName || fileDateName) {
    const parts = [];
    if (vendorfileName) parts.push(vendorfileName);
    if (vehicleTypefileName) parts.push(vehicleTypefileName);
    if (fileDateName) parts.push(fileDateName);

    finalFileName += `-${parts.join(" - ")}`;
  }

  // pdf header
  const pdfHeader = useMemo(() => {
    return [
      "Sr No",
      // Conditionally add "Vendor Name" if user_id is not present in formValue
      ...(formValue?.user_id ? [] : ["Vendor Name"]),
      // Conditionally add "Vehicle Type" if type is not present in formValue
      ...(formValue?.type ? [] : ["Vehicle Type"]),
      "Vehicle Number",
      "IMEI Number",
      "Chassis Number",
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
    const todayDate = moment().format("YYYY-MM-DD");
    const param = {
      page: "1",
      per_page: "5000",
      ...(formValue?.user_id && { user_id: formValue?.user_id }),
      ...(formValue?.type && { type: formValue?.type }),
      ...(formValue?.number && { number: formValue?.number }),
      ...(formValue?.imei && { imei: formValue?.imei }),
      ...(formValue?.chassis_no && { chassis_no: formValue?.chassis_no }),
      ...(formValue?.date_format === "Today" && {
        to_date: todayDate,
        form_date: todayDate,
      }),
      ...(formValue?.date_format === "Date Range" && {
        form_date: dayjs(formValue?.form_date).format("YYYY-MM-DD"),
        to_date: dayjs(formValue?.to_date).format("YYYY-MM-DD"),
      }),
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
      <CommonDivider label={"Vehicle Report"} />
      <div className="flex justify-end gap-2 font-semibold">
        <div>
          <Button
            type="primary"
            onClick={() => {
              exportToFile(false);
            }}
          >
            Download Pdf
          </Button>
        </div>
        <div>
          <Button
            type="primary"
            onClick={() => {
              exportToFile(true);
            }}
          >
            Download Excel
          </Button>
        </div>
      </div>
      <div className="rounded-md w-full">
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
                        {/* <CustomSelect
                          name={"date_format"}
                          label={"Select Date Type"}
                          placeholder={"Select Date Type"}
                          onSelect={handleDateSelect}
                          options={dateWeekOptions || []}
                        />
                        {showDateRange && (
                          <>
                            <CustomDatepicker
                              name={"form_date"}
                              label={"From Date"}
                              className="w-full"
                              placeholder={"From Date"}
                              rules={[
                                {
                                  required: true,
                                  message: "Please select a start date!",
                                },
                              ]}
                              onChange={(date) => {
                                const dayjsObjectFrom = dayjs(date?.$d);
                                const startDate = dayjsObjectFrom;

                                const dayjsObjectTo = dayjs(
                                  form.getFieldValue("to_date")?.$d
                                );
                                const endDate = dayjsObjectTo;

                                // Condition 1: If startDate is after endDate, set end_time to null
                                if (startDate.isAfter(endDate)) {
                                  form.setFieldValue("to_date", null);
                                }

                                // Condition 2: If startDate is more than 7 days before endDate, set end_time to null
                                const daysDifference = endDate.diff(
                                  startDate,
                                  "days"
                                );
                                if (daysDifference > 7) {
                                  form.setFieldValue("to_date", null);
                                } else {
                                  // If the difference is within the allowed range, you can keep the value or process further if needed.
                                }

                                setStartDate(startDate.format("YYYY-MM-DD"));
                              }}
                            />
                            <CustomDatepicker
                              name={"to_date"}
                              label={"To Date"}
                              className="w-full"
                              placeholder={"To Date"}
                              rules={[
                                {
                                  required: true,
                                  message: "Please select a end date!",
                                },
                              ]}
                              disabledDate={disabledDate}
                            />
                          </>
                        )} */}
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
            columns={vehicleReportsColumns || []}
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
    </>
  );
};

export default VehicleReports;
