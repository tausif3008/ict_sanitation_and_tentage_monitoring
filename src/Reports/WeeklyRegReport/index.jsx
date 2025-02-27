import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { Collapse, Form, Button, Row, Col, message } from "antd";
import dayjs from "dayjs";
import moment from "moment/moment";
import { getValueLabel } from "../../constant/const";
import CustomDatepicker from "../../commonComponents/CustomDatepicker";
import CustomSelect from "../../commonComponents/CustomSelect";
import CommonDivider from "../../commonComponents/CommonDivider";
import URLS from "../../urils/URLS";
import MonitoringSelector from "../../complaince/monitoringSelector";
import search from "../../assets/Dashboard/icon-search.png";
import { getMonitoringDailyReport } from "../../complaince/monitoringSlice";
import { revertMonitoringSlice } from "../../Redux/action";
import { getVendorCategoryTypeDrop } from "../VendorwiseReports/vendorslice";
import VendorSelectors from "../VendorwiseReports/vendorSelectors";
import { ExportPdfFunction } from "../ExportPdfFunction";

const WeeklyRegistrationReport = () => {
  const [startDate, setStartDate] = useState(null);
  const [filesName, setFilesName] = useState(null); // files Name

  const { DailyReport, loading } = MonitoringSelector(); // daily report
  const { VendorCatTypeDrop } = VendorSelectors(); // vendor dropdown & Reports

  const userRoleId = localStorage.getItem("role_id");
  const userId = localStorage.getItem("userId");

  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const formValue = form.getFieldsValue();

  const fileDateName = useMemo(() => {
    if (formValue?.form_date || formValue?.to_date) {
      return `${dayjs(formValue?.form_date).format("DD-MMM-YYYY")} to ${dayjs(
        formValue?.to_date
      ).format("DD-MMM-YYYY")}`;
    }
    return null;
  }, [formValue?.form_date, formValue?.to_date]);

  // filter finish
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
    }

    setFilesName(name);
    const url = URLS?.weeklyRegReport?.path;
    dispatch(getMonitoringDailyReport(url, finalData));
  };

  // reset form
  const resetForm = () => {
    form.resetFields();
    setFilesName(null);
    setValue();
    dispatch(revertMonitoringSlice());
  };

  const disabledDate = (current) => {
    const maxDate = moment(startDate).clone().add(8, "days");
    const minDate = moment(startDate).clone().add(1, "day"); // Set minimum date to one day after startDate

    return (
      current &&
      (current.isBefore(minDate, "day") || current.isAfter(maxDate, "day"))
    );
  };

  const setValue = () => {
    form.setFieldValue("date_format", "Today");
  };

  const pdfHeader = ["Sr No", "Toilet Type", "Registration Count"];
  const fileName = "Weekly Registration Report";

  useEffect(() => {
    if (DailyReport?.success) {
      let sum = 0;
      const pdfData = DailyReport?.data?.response?.map((data, index) => {
        sum += Number(data?.total_units) || 0;
        return [index + 1, data?.asset_name, data?.total_units];
      });

      ExportPdfFunction(
        fileName,
        `${filesName}-${fileName}-${fileDateName}`,
        pdfHeader,
        [...pdfData, ...[["", "Total Registration Count", sum]]],
        false,
        true,
        [],
        [
          {
            label: `Vendor Name : ${filesName || "Combined"}`,
          },
          {
            label: `Date Range : ${fileDateName || "Combined"}`,
          },
        ]
      );
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
      <CommonDivider label={"Weekly Registration Report"}></CommonDivider>
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
                        if (startDate.isSame(endDate, "day")) {
                          form.setFieldValue("to_date", null);
                        }

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

export default WeeklyRegistrationReport;
