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

  const fileDateName = `${dayjs(formValue?.form_date).format(
    "DD-MMM-YYYY"
  )} to ${dayjs(formValue?.to_date).format("DD-MMM-YYYY")}`;
  // file name
  const getReportName = () => {
    let name = "Vehicle IMEI";
    // if (agentName) {
    //   name += `- ${agentName}`;
    // }
    // if (sectorName) {
    //   name += `- ${sectorName}`;
    // }
    name += `- Report ${fileDateName}`;
    return name;
  };
  const fileName = getReportName();

  const pdfTitleParam = [
    {
      label: `IMEI Number :  ${formValue?.imei}`,
    },
    // {
    //   label: `(-) : No Record`,
    // },
    // {
    //   label: `A :  Absent`,
    // },
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
  };

  const callApi = async (data) => {
    dispatch(getVehicleImeiReportData(data)); // vendor reports
  };

  useEffect(() => {
    resetForm();
  }, []);

  useEffect(() => {
    const imei_details =
      VehicleReportData?.data?.vehicles_data?.[formValue?.imei]?.imei_details ||
      {};
    if (!imei_details) return [];

    setTableData((prevDetails) => ({
      ...prevDetails,
      list: Object.keys(imei_details)?.length === 0 ? [] : [imei_details] || [],
    }));
  }, [VehicleReportData, formValue?.imei]);

  // table column
  const dynamicColumn = useMemo(() => {
    const imei_details =
      VehicleReportData?.data?.vehicles_data?.[formValue?.imei]?.imei_details;

    if (!imei_details) return [];
    const keys = Object.keys(imei_details);
    const sortedKeys = keys.sort() || [];
    return sortedKeys?.map((item) => {
      return {
        title: moment(item, "YYYY-MM-DD", true).isValid()
          ? moment(item, "YYYY-MM-DD").format("DD-MMM-YYYY")
          : item,
        dataIndex: item,
        key: item,
        width: 100,
      };
    });
  }, [VehicleReportData, formValue?.imei]);

  // excel data
  const myExcelItems = useMemo(() => {
    if (!tableData?.list || tableData.list.length === 0) return []; // Return empty object if no data

    const firstObject = tableData.list[0];

    if (!firstObject) return {};

    // Step 1: Extract keys and sort them
    const sortedKeys = Object.keys(firstObject).sort((a, b) => {
      const dateA = moment(a, "YYYY-MM-DD");
      const dateB = moment(b, "YYYY-MM-DD");
      return dateA.isBefore(dateB) ? -1 : 1; // Ascending order
    });

    // Step 2: Reconstruct the object with sorted keys
    const sortedObject = sortedKeys.reduce((acc, key) => {
      const formattedDate = moment(key, "YYYY-MM-DD").format("DD-MMM-YYYY");
      acc[formattedDate] = firstObject[key]; // Add the key-value pair
      return acc;
    }, {});

    const myObj = {
      "Sr No": 1,
      ...sortedObject,
    };

    return [myObj];
  }, [tableData]);

  // pdf header
  const pdfHeader = useMemo(() => {
    return Object.keys(myExcelItems?.[0] || []); // This will return the keys as an array
  }, [myExcelItems]);

  // pdf data
  const pdfData = useMemo(() => {
    return myExcelItems?.map((item) => {
      return Object.values(item);
    });
  }, [myExcelItems]);

  return (
    <>
      <CommonDivider label={"Vehicle IMEI Wise Report"} />
      <div className="flex justify-end gap-2 font-semibold">
        <ExportToPDF
          titleName={`${fileName}`}
          pdfName={fileName}
          headerData={pdfHeader}
          landscape={true}
          tableTitles={pdfTitleParam || []}
          rows={pdfData || []}
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
                  <CustomInput
                    label="IMEI Number"
                    name="imei"
                    placeholder="Enter IMEI Number"
                    rules={[
                      {
                        required: true,
                        message: "Please Enter IMEI Number!",
                      },
                    ]}
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
        scroll={{ x: 1400, y: 500 }}
        tableSubheading={{
          "Total Records": 1,
        }}
        pagination={true}
      />
    </>
  );
};

export default VehicleImeiReport;
