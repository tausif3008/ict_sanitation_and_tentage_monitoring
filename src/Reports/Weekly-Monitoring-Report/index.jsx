import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Collapse, Form, Button, Row, Col, message } from "antd";
import dayjs from "dayjs";
import moment from "moment/moment";
import { getValueLabel } from "../../constant/const";
import CustomDatepicker from "../../commonComponents/CustomDatepicker";
import CustomSelect from "../../commonComponents/CustomSelect";
import CommonDivider from "../../commonComponents/CommonDivider";
import URLS from "../../urils/URLS";
import { getVendorList } from "../../vendor/VendorSupervisorRegistration/Slice/VendorSupervisorSlice";
import VendorSupervisorSelector from "../../vendor/VendorSupervisorRegistration/Slice/VendorSupervisorSelector";
import MonitoringSelector from "../../complaince/monitoringSelector";
import search from "../../assets/Dashboard/icon-search.png";
import { getMonitoringDailyReport } from "../../complaince/monitoringSlice";
import { MonitoringDailyReportPdf } from "../../complaince/DailyReport";

const WeeklyMonitoringReport = () => {
  const [startDate, setStartDate] = useState(null);
  const [filesName, setFilesName] = useState(null); // files Name

  const { VendorListDrop } = VendorSupervisorSelector(); // vendor
  const { DailyReport, loading } = MonitoringSelector(); // daily report

  const userRoleId = localStorage.getItem("role_id");
  const userId = localStorage.getItem("userId");

  const dispatch = useDispatch();
  const [form] = Form.useForm();

  // fiter finish
  const onFinishForm = async (values) => {
    const finalData = {
      vendor_id: values?.vendor_id,
    };
    const name = getValueLabel(values?.vendor_id, VendorListDrop, "");
    if (values?.form_date || values?.to_date) {
      const dayjsObjectFrom = dayjs(values?.form_date?.$d);
      const dayjsObjectTo = dayjs(values?.to_date?.$d);

      // Format the date as 'YYYY-MM-DD'
      const start = dayjsObjectFrom.format("YYYY-MM-DD");
      const end = dayjsObjectTo.format("YYYY-MM-DD");
      finalData.form_date = values?.form_date ? start : end;
      finalData.to_date = values?.to_date ? end : start;
    }

    setFilesName(name);
    const url = URLS?.monitoringDailyReport?.path;

    // dispatch(
    //   getMonitoringDailyReport(
    //     "/reporting/daily-monitoring-email-vendor?vendor_id=142&date=2024-12-24"
    //     // "/reporting/daily-monitoring-email-vendor?vendor_id=136&date=2024-12-25"
    //   )
    // );
    dispatch(getMonitoringDailyReport(url, finalData));
  };

  // reset form
  const resetForm = () => {
    form.resetFields();
    setFilesName(null);
    setValue();
    // dispatch(revertMonitoringSlice());
  };

  const disabledDate = (current) => {
    const maxDate = moment(startDate).clone().add(8, "days");
    return (
      current &&
      (current.isBefore(startDate, "day") || current.isAfter(maxDate, "day"))
    );
  };

  const setValue = () => {
    if (userRoleId === "8") {
      form.setFieldValue("vendor_id", userId);
    }
    form.setFieldValue("date_format", "Today");
  };

  useEffect(() => {
    if (DailyReport?.success) {
      MonitoringDailyReportPdf(
        DailyReport?.data,
        "Weekly Monitoring Report",
        filesName
          ? `${filesName}- Weekly Monitoring Report`
          : "Weekly Monitoring Report",
        false,
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
    dispatch(getVendorList()); // vendor list
    setValue();
  }, []);

  return (
    <div className="">
      <CommonDivider label={"Weekly Monitoring Report"}></CommonDivider>
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
                    <Col key="vendor_id" xs={24} sm={12} md={6} lg={5}>
                      <CustomSelect
                        name={"vendor_id"}
                        label={"Select Vendor"}
                        disabled={userRoleId === "8" ? true : false}
                        placeholder={"Select Vendor"}
                        options={VendorListDrop || []}
                        rules={[
                          {
                            required: true,
                            message: "Please select Vendor!",
                          },
                        ]}
                      />
                    </Col>
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
                    <div className="flex justify-start my-4 space-x-2 ml-3">
                      <div>
                        <Button
                          loading={loading}
                          type="button"
                          className="w-fit rounded-none text-white bg-orange-400 hover:bg-orange-600"
                          onClick={resetForm}
                        >
                          Reset
                        </Button>
                      </div>
                      <div>
                        <Button
                          loading={loading}
                          type="button"
                          htmlType="submit"
                          className="w-fit rounded-none text-white bg-blue-500 hover:bg-blue-600"
                        >
                          Get Report
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
    </div>
  );
};

export default WeeklyMonitoringReport;
