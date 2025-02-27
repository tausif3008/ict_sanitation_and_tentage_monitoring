import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { Collapse, Form, Button } from "antd";
import moment from "moment";
import dayjs from "dayjs";
import CommonDivider from "../../commonComponents/CommonDivider";
import search from "../../assets/Dashboard/icon-search.png";
import CustomDatepicker from "../../commonComponents/CustomDatepicker";
import CustomTable from "../../commonComponents/CustomTable";
import ExportToExcel from "../ExportToExcel";
import ExportToPDF from "../reportFile";
import CustomInput from "../../commonComponents/CustomInput";
import { getVehicleImeiReportData } from "./Slice/vehicleReport";
import VehicleReportSelector from "./Slice/vehicleReportSelector";
import { getVendorCategoryTypeDrop } from "../VendorwiseReports/vendorslice";
import VendorSelectors from "../VendorwiseReports/vendorSelectors";
import CustomSelect from "../../commonComponents/CustomSelect";
import { getValueLabel, vehicleType } from "../../constant/const";

const VehicleImeiReport = () => {
  const [startDate, setStartDate] = useState(null);
  const [tableData, setTableData] = useState({
    list: [],
    pageLength: 25,
    currentPage: 1,
  });

  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const formValue = form.getFieldsValue();
  const { VehicleReportData, VehicleReportLoader } = VehicleReportSelector(); // vehicle report
  const { VendorCatTypeDrop } = VendorSelectors(); // vendor dropdown & Reports
  const vehicleData = VehicleReportData?.data?.vehicles_data || [];

  const fileDateName = `${dayjs(formValue?.form_date).format(
    "DD-MMM-YYYY"
  )} to ${dayjs(formValue?.to_date).format("DD-MMM-YYYY")}`;

  const vendorfileName = getValueLabel(
    formValue?.vendor_id,
    VendorCatTypeDrop,
    undefined
  );

  // file name
  const getReportName = () => {
    let name = "Vehicle Tracking";
    if (vendorfileName) {
      name += `- ${vendorfileName}`;
    }
    if (formValue?.vehicle_type) {
      name += `- ${formValue?.vehicle_type}`;
    }
    name += `- Report ${fileDateName}`;
    return name;
  };
  const fileName = getReportName();

  // const pdfTitleParam = [
  //   {
  //     label: `Vendor Name : ${vendorfileName} || All Vendors`,
  //   },
  //   {
  //     label: `Vehicle Type : ${formValue?.vehicle_type} || Compactor & `,
  //   },
  //   // ...(vendorfileName
  //   //   ? [
  //   //       {
  //   //         label: `Vendor Name : ${vendorfileName}`,
  //   //       },
  //   //     ]
  //   //   : []),
  //   // ...(formValue?.vehicle_type
  //   //   ? [
  //   //       {
  //   //         label: `Vehicle Type : ${formValue?.vehicle_type}`,
  //   //       },
  //   //     ]
  //   //   : []),
  //   ...(formValue?.imei
  //     ? [
  //         {
  //           label: `IMEI Number : ${formValue?.imei}`,
  //         },
  //       ]
  //     : []),
  // ];

  const pdfTitleParam = [
    {
      label: `Vendor Name : ${vendorfileName || "All Vendors"}`,
    },
    {
      label: `Vehicle Type : ${
        formValue?.vehicle_type || "Compactor & Tipper"
      }`,
    },
    ...(formValue?.imei
      ? [
          {
            label: `IMEI Number : ${formValue?.imei}`,
          },
        ]
      : []),
    {
      label: `Note : Data in Kilometer(Km)`,
    },
  ];

  const disabledDate = (current) => {
    const maxDate = moment(startDate).clone().add(9, "days");
    return (
      current &&
      (current.isBefore(startDate, "day") || current.isAfter(maxDate, "day"))
    );
  };

  const onFinishForm = (values) => {
    const startDate = dayjs(values?.form_date).format("YYYY-MM-DD");
    const endDate = dayjs(values?.to_date).format("YYYY-MM-DD");
    const finalData = {
      ...values,
      date_format: "Date Range",
      form_date: startDate,
      to_date: endDate,
    };
    callApi(finalData);
  };

  // reset form
  const resetForm = () => {
    form.resetFields();
    setTableData((prevDetails) => ({
      ...prevDetails,
      list: [] || [],
    }));
  };

  const callApi = async (data) => {
    dispatch(getVehicleImeiReportData(data)); // vendor reports
  };

  useEffect(() => {
    const paramData = {
      asset_main_type_id: 5,
    };
    dispatch(getVendorCategoryTypeDrop(paramData)); // asset type wise vendor list
    resetForm();
  }, []);

  // table Data
  useEffect(() => {
    if (VehicleReportData?.success) {
      const transformedData = vehicleData.map(({ imei_details, ...rest }) => ({
        ...rest,
        ...imei_details,
      }));
      setTableData((prevDetails) => ({
        ...prevDetails,
        list: transformedData || [],
      }));
    } else {
      setTableData((prevDetails) => ({
        ...prevDetails,
        list: [] || [],
      }));
    }
  }, [VehicleReportData]);

  // table column
  const dynamicColumn = useMemo(() => {
    const imeiDetails = vehicleData?.[0]?.imei_details || {};
    const columns =
      Object.keys(imeiDetails || {})
        ?.map((item, index) => {
          const isValidDate = moment(item, "YYYY-MM-DD", true).isValid();
          return {
            title: isValidDate
              ? moment(item, "YYYY-MM-DD").format("DD-MMM-YYYY")
              : item,
            dataIndex: item,
            key: item,
            width: 100,
            render: (text) => {
              return text != null && !isNaN(text) ? Math.round(text) : "";
            },
          };
        })
        .reverse() || [];

    const Columns = [
      {
        title: "Vendor Name",
        dataIndex: "vendor_name",
        key: "vendor_name",
      },
      {
        title: "Vehicle Type",
        dataIndex: "vehicle_type",
        key: "vehicle_type",
      },
      {
        title: "Vehicle Number",
        dataIndex: "vehicle_no",
        key: "vehicle_no",
      },
      {
        title: "IMEI Number",
        dataIndex: "imei",
        key: "imei",
      },
    ];
    return [...Columns, ...columns];
  }, [VehicleReportData, formValue?.imei]);

  // excel data
  const myExcelItems = useMemo(() => {
    if (!tableData?.list || tableData.list.length === 0) return []; // Return empty object if no data

    const excelObject = tableData?.list || [];

    return excelObject?.map((item, index) => {
      const dateData = {};
      const otherData = {};

      Object.entries(item || {}).forEach(([key, value]) => {
        // Check if the key follows the YYYY-MM-DD format
        if (/^\d{4}-\d{2}-\d{2}$/.test(key)) {
          // Round value if it's a valid number, otherwise set an empty string
          dateData[key] =
            value != null && !isNaN(value) ? Math.round(value) : "";
        }
      });

      Object.entries(dateData).forEach(([key, value]) => {
        const myKey = moment(key, "YYYY-MM-DD").format("DD-MMM");
        otherData[myKey] = value ? Number(value) || 0 : 0; // Update the otherData object with the formatted key
      });

      const sortedData = Object.fromEntries(
        Object.entries(otherData).sort(([a], [b]) => a.localeCompare(b))
      );

      return {
        "Sr No": index + 1,
        "Vendor Name": item?.vendor_name,
        "Vehicle Type": item?.vehicle_type,
        "Vehicle Number": item?.vehicle_no,
        "IMEI Number": item?.imei,
        ...sortedData,
      };
    });

    return [];
  }, [tableData]);

  // pdf header
  // const pdfHeader = useMemo(() => {
  //   return Object.keys(myExcelItems?.[0] || []); // This will return the keys as an array
  // }, [myExcelItems]);

  const pdfHeader = useMemo(() => {
    return Object.keys(myExcelItems?.[0] || {}).filter(
      (key) => key !== "Vendor Name" && key !== "Vehicle Type"
    ); // Exclude 'vendor_name' key
  }, [myExcelItems]);

  // pdf data
  // const pdfData = useMemo(() => {
  //   return myExcelItems?.map((item) => {
  //     return Object.values(item);
  //   });
  // }, [myExcelItems]);

  const pdfData = useMemo(() => {
    return myExcelItems?.map((item) => {
      // Filter out 'vendor_name' key and return values of the remaining properties
      const filteredItem = Object.entries(item)
        .filter(([key]) => key !== "Vendor Name" && key !== "Vehicle Type") // Exclude 'vendor_name'
        .map(([_, value]) => value); // Get the values of the remaining properties
      return filteredItem;
    });
  }, [myExcelItems]);

  return (
    <>
      <CommonDivider label={"Vehicle Tracking Report"} />
      <div className="flex justify-end gap-2 font-semibold">
        <ExportToPDF
          titleName={`${fileName}`}
          pdfName={fileName}
          headerData={pdfHeader}
          landscape={true}
          tableTitles={pdfTitleParam || []}
          rows={pdfData || []}
          tableFont={5}
        />
        <ExportToExcel
          excelData={myExcelItems || []}
          titleName={fileName}
          fileName={fileName}
        />
      </div>
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
                    name={"vendor_id"}
                    label={"Select Vendor"}
                    placeholder={"Select Vendor"}
                    options={VendorCatTypeDrop || []}
                  />
                  <CustomSelect
                    label="Vehicle Type"
                    name="vehicle_type"
                    placeholder={"Select Vehicle Type"}
                    options={vehicleType || []}
                  />
                  <CustomInput
                    label="IMEI Number"
                    name="imei"
                    placeholder="Enter IMEI Number"
                    // rules={[
                    //   {
                    //     required: true,
                    //     message: "Please Enter IMEI Number!",
                    //   },
                    // ]}
                  />
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
                      const daysDifference = endDate.diff(startDate, "days");
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
                  <div className="flex justify-start my-4 space-x-2 ml-3">
                    <Button
                      loading={VehicleReportLoader}
                      type="button"
                      htmlType="submit"
                      className="w-fit rounded-none text-white bg-blue-500 hover:bg-blue-600"
                    >
                      Search
                    </Button>
                    <Button
                      loading={VehicleReportLoader}
                      type="button"
                      className="w-fit rounded-none text-white bg-orange-300 hover:bg-orange-600"
                      onClick={resetForm}
                    >
                      Reset
                    </Button>
                  </div>
                </div>
              </Form>
            ),
          },
        ]}
      />
      <CustomTable
        loading={VehicleReportLoader}
        columns={dynamicColumn || []}
        bordered
        dataSource={tableData || []}
        scroll={{ x: 1600, y: 500 }}
        tableSubheading={{
          "Total Records": tableData?.list?.length || 0,
        }}
        pagination={true}
      />
    </>
  );
};

export default VehicleImeiReport;
