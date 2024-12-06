import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Collapse, Form, Button, Row, Col } from "antd";
import moment from "moment";
import dayjs from "dayjs";
import CommonDivider from "../../commonComponents/CommonDivider";
import CommonTable from "../../commonComponents/CommonTable";
import URLS from "../../urils/URLS";
import { basicUrl } from "../../Axios/commonAxios";
import search from "../../assets/Dashboard/icon-search.png";
import AssetTypeSelectors from "../../register/AssetType/assetTypeSelectors";
import {
  getAssetMainTypes,
  getAssetTypes,
} from "../../register/AssetType/AssetTypeSlice";
import { dateWeekOptions } from "../../constant/const";
import ExportToExcel from "../ExportToExcel";
import CustomSelect from "../../commonComponents/CustomSelect";
import CustomDatepicker from "../../commonComponents/CustomDatepicker";
import { getVendorReportData } from "../GSDWiseRegistrationReport/Slice/gsdWiseRegistrationReport";
import GsdRegistrationSelector from "../GSDWiseRegistrationReport/Slice/gsdRegistrationSelector";
import { getFormData } from "../../urils/getFormData";

const VendorRegistrationReport = () => {
  const [excelData, setExcelData] = useState([]);
  const [showDateRange, setShowDateRange] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [vendorData, setVendorData] = useState({
    list: [],
    pageLength: 25,
    currentPage: 1,
  });

  const dispatch = useDispatch();
  const { VendorReport_data, loading } = GsdRegistrationSelector(); // vendor Report selector ( GSD )
  const { AssetMainTypeDrop, AssetTypeDrop } = AssetTypeSelectors(); // asset main type

  let uri = URLS?.vendorRegistrationReport?.path;
  const [form] = Form.useForm();

  // fiter finish
  const onFinishForm = (values) => {
    const finalData = {
      ...(values?.asset_main_type_id && {
        asset_main_type_id: values?.asset_main_type_id,
      }),
      ...(values?.date_format && { date_format: values?.date_format }),
      ...(values?.asset_type_id && { asset_type_id: values?.asset_type_id }),
    };

    if (values?.date_format === "Today") {
      finalData.form_date = moment().format("YYYY-MM-DD");
      finalData.to_date = moment().format("YYYY-MM-DD");
    }
    //  else if (values?.date_format === "Week") {
    //   finalData.form_date = moment()
    //     .subtract(8, "days")
    //     .format("YYYY-MM-DD");
    //   finalData.to_date = moment().format("YYYY-MM-DD");
    // } else

    if (values?.form_date || values?.to_date) {
      const dayjsObjectFrom = dayjs(values?.form_date?.$d);
      const dayjsObjectTo = dayjs(values?.to_date?.$d);

      // Format the date as 'YYYY-MM-DD'
      const start = dayjsObjectFrom.format("YYYY-MM-DD");
      const end = dayjsObjectTo.format("YYYY-MM-DD");
      finalData.form_date = values?.form_date ? start : end;
      finalData.to_date = values?.to_date ? end : start;
    }

    const formData = getFormData(finalData);
    dispatch(getVendorReportData(basicUrl + uri, formData)); // Fetch the data
  };

  // reset form
  const resetForm = () => {
    form.resetFields();
    getData();
    setShowDateRange(false);
  };

  // handle asset main type
  const handleSelect = (value) => {
    form.setFieldsValue({
      asset_type_id: null,
      to_user_id: null,
    });
    const url = URLS?.assetType?.path + value;
    dispatch(getAssetTypes(url)); // get assset type
  };

  //   // handle asset type
  //   const handleTypeSelect = (value) => {
  //     form.setFieldsValue({
  //       to_user_id: null,
  //     });
  //     value && dispatch(getAssetTypeWiseVendorList(value)); // asset type wise vendor list
  //   };

  // handle date select
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

  const disabledDate = (current) => {
    const maxDate = moment(startDate).clone().add(8, "days");
    return (
      current &&
      (current.isBefore(startDate, "day") || current.isAfter(maxDate, "day"))
    );
  };

  const getData = async () => {
    dispatch(getVendorReportData(basicUrl + uri)); // Fetch the data
  };

  useEffect(() => {
    getData(); // get current data
    const assetMainTypeUrl = URLS?.assetMainTypePerPage?.path;
    dispatch(getAssetMainTypes(assetMainTypeUrl)); // asset main type
  }, []);

  useEffect(() => {
    if (VendorReport_data) {
      const unitCount = VendorReport_data?.data?.listings?.reduce(
        (total, item) => {
          return total + Number(item?.tagging_units);
        },
        0
      );

      setVendorData((prevDetails) => ({
        ...prevDetails,
        list: VendorReport_data?.data?.listings || [],
        pageLength: VendorReport_data?.data?.paging?.[0]?.length || 0,
        currentPage: VendorReport_data?.data?.paging?.[0]?.currentpage || 1,
        totalRecords: VendorReport_data?.data?.paging?.[0]?.totalrecords || 0,
        totalUnits: unitCount,
      }));

      const myexcelData = VendorReport_data?.data?.listings?.map(
        (data, index) => {
          return {
            Sr: index + 1,
            "Vendor name": data?.vendor_name,
            Unit: Number(data?.tagging_units),
          };
        }
      );
      setExcelData(myexcelData);
    }
  }, [VendorReport_data]);

  const columns = [
    {
      title: "Vendor Name",
      dataIndex: "vendor_name",
      key: "vendor_name",
      render: (text, record) => {
        return text ? text : "GSD";
      },
    },
    {
      title: "Units",
      dataIndex: "tagging_units",
      key: "tagging_units",
    },
  ];

  return (
    <div>
      <CommonDivider label={"Vendor Wise Registration Report"} />
      <div className="flex justify-end gap-2 font-semibold">
        <div>
          <ExportToExcel
            excelData={excelData || []}
            fileName={"Vendor Wise Registration Report"}
            dynamicFields={{ "Total Units": vendorData?.totalUnits }}
          />
        </div>
      </div>
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
                    <Col key="asset_main_type_id" xs={24} sm={12} md={6} lg={5}>
                      <CustomSelect
                        name={"asset_main_type_id"}
                        label={"Select Category"}
                        placeholder={"Select Category"}
                        options={AssetMainTypeDrop || []}
                        onSelect={handleSelect}
                      />
                    </Col>
                    <Col key="asset_type_id" xs={24} sm={12} md={6} lg={5}>
                      <CustomSelect
                        name={"asset_type_id"}
                        label={"Select Type"}
                        placeholder={"Select Type"}
                        options={AssetTypeDrop || []}
                        // onSelect={handleTypeSelect}
                      />
                    </Col>
                    <Col key="date_format" xs={24} sm={12} md={6} lg={5}>
                      <CustomSelect
                        name={"date_format"}
                        label={"Select Date Type"}
                        placeholder={"Select Date Type"}
                        options={dateWeekOptions || []}
                        onSelect={handleDateSelect}
                      />
                    </Col>
                    {showDateRange && (
                      <>
                        <Col key="form_date" xs={24} sm={12} md={6} lg={5}>
                          <CustomDatepicker
                            name={"form_date"}
                            label={"From Date"}
                            className="w-full"
                            placeholder={"Date"}
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
                            rules={[
                              {
                                required: true,
                                message: "Please select a end date!",
                              },
                            ]}
                            className="w-full"
                            placeholder={"Date"}
                            disabledDate={disabledDate}
                          />
                        </Col>
                      </>
                    )}

                    <Col
                      xs={24}
                      sm={12}
                      md={6}
                      lg={4}
                      className="flex justify-end gap-2"
                    >
                      <Button
                        type="primary"
                        className="rounded-none bg-5c"
                        onClick={resetForm}
                      >
                        Reset
                      </Button>
                      <Button
                        type="primary"
                        htmlType="submit"
                        className="rounded-none bg-green-300 text-black"
                      >
                        Search
                      </Button>
                    </Col>
                  </Row>
                </Form>
              ),
            },
          ]}
        />
      </div>
      <CommonTable
        loading={loading}
        uri={`gsd-wise-registration-report`}
        columns={columns || []}
        details={vendorData || []}
        subtotalName={"Total Units"}
        subtotalCount={vendorData?.totalUnits}
        scroll={{ x: 300, y: 400 }}
      ></CommonTable>
    </div>
  );
};

export default VendorRegistrationReport;