import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Collapse, Form, Button, Row, Col, message } from "antd";
import dayjs from "dayjs";
import moment from "moment/moment";

import { getMonitoringDailyReport } from "./monitoringSlice";
import search from "../assets/Dashboard/icon-search.png";
import { dateDayOptions, getValueLabel } from "../constant/const";
import CommonDivider from "../commonComponents/CommonDivider";
import CustomSelect from "../commonComponents/CustomSelect";
import CustomDatepicker from "../commonComponents/CustomDatepicker";
import MonitoringSelector from "./monitoringSelector";
import { revertMonitoringSlice } from "../Redux/action";
import { MonitoringDailyReportPdf } from "./DailyReport";
import URLS from "../urils/URLS";
import VendorSelectors from "../Reports/VendorwiseReports/vendorSelectors";
import { getVendorCategoryTypeDrop } from "../Reports/VendorwiseReports/vendorslice";

const MonitoringDailyReport = () => {
  const [startDate, setStartDate] = useState(null);
  const [showDateRange, setShowDateRange] = useState(false);
  const [showDate, setShowDate] = useState(false);
  const [filesName, setFilesName] = useState(null); // files Name

  const { DailyReport, loading } = MonitoringSelector(); // daily report
  const { VendorCatTypeDrop } = VendorSelectors(); // vendor dropdown & Reports

  const userRoleId = localStorage.getItem("role_id");
  const userId = localStorage.getItem("userId");

  const dispatch = useDispatch();
  const [form] = Form.useForm();

  // fiter finish
  const onFinishForm = async (values) => {
    const finalData = {
      vendor_id: userRoleId === "8" ? userId : values?.vendor_id,
    };
    const name = getValueLabel(values?.vendor_id, VendorCatTypeDrop, "");
    if (values?.form_date || values?.to_date) {
      const dayjsObjectFrom = dayjs(values?.form_date?.$d);
      const dayjsObjectTo = dayjs(values?.to_date?.$d);

      // Format the date as 'YYYY-MM-DD'
      const start = dayjsObjectFrom.format("YYYY-MM-DD");
      const end = dayjsObjectTo.format("YYYY-MM-DD");
      finalData.form_date = values?.form_date ? start : end;
      finalData.to_date = values?.to_date ? end : start;
    } else if (values?.date_format === "Today") {
      finalData.form_date = moment().format("YYYY-MM-DD");
      finalData.to_date = moment().format("YYYY-MM-DD");
    } else if (values?.date_format === "date") {
      finalData.form_date = dayjs(values?.date).format("YYYY-MM-DD");
      finalData.to_date = dayjs(values?.date).format("YYYY-MM-DD");
    }

    setFilesName(name);
    const url = URLS?.monitoringDailyReport?.path;
    dispatch(getMonitoringDailyReport(url, finalData));
  };

  // reset form
  const resetForm = () => {
    form.resetFields();
    setShowDateRange(false);
    setShowDate(false);
    setFilesName(null);
    setValue();
    dispatch(revertMonitoringSlice());
  };

  const handleDateSelect = (value) => {
    if (value === "Date Range") {
      setShowDateRange(true);
      setShowDate(false);
    } else if (value === "date") {
      setShowDate(true);
      form.setFieldsValue({
        date: null,
      });
    } else {
      form.setFieldsValue({
        form_date: null,
        to_date: null,
      });
      setShowDateRange(false);
      setShowDate(false);
    }
  };

  const disabledDate = (current) => {
    const maxDate = moment(startDate).clone().add(8, "days");
    return (
      current &&
      (current.isBefore(startDate, "day") || current.isAfter(maxDate, "day"))
    );
  };

  const setValue = () => {
    form.setFieldValue("date_format", "Today");
  };

  useEffect(() => {
    if (DailyReport?.success) {
      MonitoringDailyReportPdf(
        DailyReport?.data,
        "Daily Monitoring Report",
        filesName
          ? `${filesName}- Daily Monitoring Report`
          : "Daily Monitoring Report",
        false,
        false
      );
      // const element = document.createElement("div");
      // element.innerHTML = DailyReport;
      // // element.innerHTML = DailyReport?.data?.html;
      // // Use html2pdf to generate the PDF with custom styles
      // html2pdf().from(element).save("Monitoring-Daily-Report.pdf");
      resetForm();
    } else if (DailyReport) {
      message.error("Report Not Available");
      resetForm();
    }
  }, [DailyReport]);

  useEffect(() => {
    userRoleId !== "8" &&
      dispatch(
        getVendorCategoryTypeDrop({
          asset_main_type_id: 1,
        })
      ); // vendor list
    setValue();
  }, []);

  return (
    <>
      <CommonDivider label={"Daily Monitoring Report"}></CommonDivider>
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
                  {userRoleId !== "8" && (
                    <Col key="vendor_id" xs={24} sm={12} md={6} lg={5}>
                      <CustomSelect
                        name={"vendor_id"}
                        label={"Select Vendor"}
                        placeholder={"Select Vendor"}
                        options={VendorCatTypeDrop || []}
                        rules={[
                          {
                            required: true,
                            message: "Please select Vendor!",
                          },
                        ]}
                      />
                    </Col>
                  )}
                  <Col key="date_format" xs={24} sm={12} md={6} lg={5}>
                    <CustomSelect
                      name={"date_format"}
                      label={"Select Date Type"}
                      placeholder={"Select Date Type"}
                      onSelect={handleDateSelect}
                      options={dateDayOptions || []}
                      rules={[
                        {
                          required: true,
                          message: "Please select Date Type!",
                        },
                      ]}
                    />
                  </Col>
                  {showDateRange && (
                    <>
                      <Col key="form_date" xs={24} sm={12} md={6} lg={5}>
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
                      </Col>
                      <Col key="to_date" xs={24} sm={12} md={6} lg={5}>
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
                      </Col>
                    </>
                  )}
                  {showDate && (
                    <Col key="date" xs={24} sm={12} md={6} lg={5}>
                      <CustomDatepicker
                        name={"date"}
                        label={"Date"}
                        className="w-full"
                        placeholder={"Date"}
                        rules={[
                          {
                            required: true,
                            message: "Please select a end date!",
                          },
                        ]}
                      />
                    </Col>
                  )}
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
    </>
  );
};

export default MonitoringDailyReport;
