import React, { useEffect, useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import { Collapse, Form, Button, Row, Col } from "antd";
import moment from "moment";
import dayjs from "dayjs";
import CommonDivider from "../../commonComponents/CommonDivider";
import URLS from "../../urils/URLS";
import { basicUrl } from "../../Axios/commonAxios";
import search from "../../assets/Dashboard/icon-search.png";
import AssetTypeSelectors from "../../register/AssetType/assetTypeSelectors";
import {
  getAssetMainTypes,
  getAssetTypes,
} from "../../register/AssetType/AssetTypeSlice";
import {
  AllCountOptions,
  dateWeekOptions,
  getFormatedNumber,
  getValueLabel,
} from "../../constant/const";
import ExportToExcel from "../ExportToExcel";
import CustomSelect from "../../commonComponents/CustomSelect";
import CustomDatepicker from "../../commonComponents/CustomDatepicker";
import { getVendorReportData } from "../GSDWiseRegistrationReport/Slice/gsdWiseRegistrationReport";
import GsdRegistrationSelector from "../GSDWiseRegistrationReport/Slice/gsdRegistrationSelector";
import { getFormData } from "../../urils/getFormData";
import ExportToPDF from "../reportFile";
import CustomTable from "../../commonComponents/CustomTable";

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
  const formValue = form.getFieldsValue();
  const catTypeName = getValueLabel(
    formValue?.asset_main_type_id,
    AssetMainTypeDrop,
    null
  );
  const assetTypeName = getValueLabel(
    formValue?.asset_type_id,
    AssetTypeDrop,
    null
  );

  const fileDateName =
    formValue?.date_format === "Today"
      ? moment().format("DD-MMM-YYYY")
      : formValue?.date_format === "Date Range"
      ? `${dayjs(formValue?.form_date).format("DD-MMM-YYYY")} to ${dayjs(
          formValue?.to_date
        ).format("DD-MMM-YYYY")}`
      : "All Dates";

  // file name
  const getReportName = () => {
    let name = "Vendor Wise";
    if (catTypeName) {
      name += `- ${catTypeName}`;
    }
    if (assetTypeName) {
      name += `- ${assetTypeName}`;
    }
    name += ` - ${
      formValue?.date_format === "Today"
        ? moment().format("DD-MMM-YYYY")
        : formValue?.date_format === "Date Range"
        ? `${dayjs(formValue?.form_date).format("DD-MMM-YYYY")} to ${dayjs(
            formValue?.to_date
          ).format("DD-MMM-YYYY")}`
        : ""
    } `;
    name += `Registration Report`;
    return name;
  };
  const fileName = getReportName();

  const pdfTitleParam = [
    ...(formValue?.asset_main_type_id
      ? [
          {
            label: `Category : ${catTypeName || "Combined"}`,
          },
        ]
      : []),
    ...(formValue?.asset_type_id
      ? [
          {
            label: `Type : ${assetTypeName || "Combined"}`,
          },
        ]
      : []),
  ];

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
    getData(formData);
    // dispatch(getVendorReportData(uri, formData)); // Fetch the data
  };

  // reset form
  const resetForm = () => {
    form.resetFields();
    currentData();
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

  const getData = async (data = null) => {
    dispatch(getVendorReportData(uri, data)); // Fetch the data
  };

  const currentData = async () => {
    form.setFieldsValue({
      total_counts: AllCountOptions?.[0]?.value,
      asset_main_type_id: "1",
    });
    getData({ asset_main_type_id: 1 }); // get current data
    handleSelect(1);
  };

  useEffect(() => {
    currentData(); // get current data
    const assetMainTypeUrl = URLS?.assetMainTypePerPage?.path;
    dispatch(getAssetMainTypes(assetMainTypeUrl)); // asset main type
  }, []);

  useEffect(() => {
    if (VendorReport_data) {
      const unitCount = VendorReport_data?.data?.listings?.reduce(
        (total, item) => {
          return total + Number(item?.tagging_units) || 0;
        },
        0
      );
      const totalCounts = VendorReport_data?.data?.listings?.reduce(
        (total, item) => {
          return total + Number(item?.total_quantity) || 0;
        },
        0
      );
      setVendorData((prevDetails) => ({
        ...prevDetails,
        list: VendorReport_data?.data?.listings || [],
        pageLength: VendorReport_data?.data?.paging?.[0]?.length || 0,
        currentPage: VendorReport_data?.data?.paging?.[0]?.currentpage || 1,
        totalRecords: VendorReport_data?.data?.paging?.[0]?.totalrecords || 0,
        totalUnits: unitCount || 0,
        totalCount: totalCounts || 0,
      }));
      const myexcelData = VendorReport_data?.data?.listings?.map(
        (data, index) => {
          return {
            Sr: index + 1,
            "Vendor name": data?.vendor_name,
            "Total Units": Number(data?.total_quantity) || 0,
            "Register Unit": Number(data?.tagging_units) || 0,
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
      sorter: (a, b) => a?.vendor_name?.localeCompare(b?.vendor_name || ""),
    },
    ...(formValue?.total_counts
      ? [
          {
            title: "Total Units",
            dataIndex: "total_quantity",
            key: "total_quantity",
            sorter: (a, b) => a?.total_quantity - b?.total_quantity,
          },
        ]
      : []),
    {
      title: "Register Units",
      dataIndex: "tagging_units",
      key: "tagging_units",
      sorter: (a, b) => a?.tagging_units - b?.tagging_units,
    },
  ];

  const pdfHeader = [
    "Sr No",
    "Vendor Name",
    ...(formValue?.total_counts ? ["Total Units"] : []),
    "Register Unit",
  ];

  const pdfData = useMemo(() => {
    return excelData?.map((sector, index) => [
      index + 1,
      sector["Vendor name"],
      ...(formValue?.total_counts
        ? [Number(sector?.["Total Units"]) || 0]
        : []),
      Number(sector?.["Register Unit"]) || 0,
    ]);
  }, [excelData]);

  return (
    <div>
      <CommonDivider label={"Vendor Wise Registration Report"} />
      <div className="flex justify-end gap-2 font-semibold">
        <ExportToPDF
          titleName={
            fileName
              ? `Vendor Wise Registration Report (${fileDateName})`
              : "Vendor Wise Registration Report"
          }
          pdfName={fileName ? fileName : "Vendor Wise Registration Report"}
          headerData={pdfHeader}
          IsLastLineBold={true}
          rows={[
            ...pdfData,
            [
              "",
              "Total",
              ...(formValue?.total_counts ? [vendorData?.totalCount || 0] : []),
              vendorData?.totalUnits,
            ],
          ]}
          tableTitles={pdfTitleParam || []}
        />
        <ExportToExcel
          excelData={excelData || []}
          fileName={fileName ? fileName : "Vendor Wise Registration Report"}
          dynamicArray={[
            {
              name: "Total Units",
              value: vendorData?.totalCount,
              colIndex: 3,
            },
            {
              name: "Total Register Units",
              value: vendorData?.totalUnits,
              colIndex: 4,
            },
          ]}
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
                <Row gutter={[16, 16]} align="middle">
                  <Col key="asset_main_type_id" xs={24} sm={12} md={6} lg={5}>
                    <CustomSelect
                      name={"asset_main_type_id"}
                      label={"Select Category"}
                      placeholder={"Select Category"}
                      options={AssetMainTypeDrop.slice(0, 2) || []}
                      onSelect={handleSelect}
                      allowClear={false}
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
                      onChange={(value) => {
                        if (!value) {
                          setShowDateRange(false);
                        }
                      }}
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
                  <Col key="total_counts" xs={24} sm={12} md={6} lg={5}>
                    <CustomSelect
                      name={"total_counts"}
                      label={"Select Show Total Counts"}
                      placeholder={"Select Show Total Counts"}
                      options={AllCountOptions || []}
                    />
                  </Col>
                  <div className="flex justify-start my-4 space-x-2 ml-3">
                    <Button
                      loading={loading}
                      type="button"
                      htmlType="submit"
                      className="w-fit rounded-none text-white bg-blue-500 hover:bg-blue-600"
                    >
                      Search
                    </Button>
                    <Button
                      loading={loading}
                      type="button"
                      className="w-fit rounded-none text-white bg-orange-300 hover:bg-orange-600"
                      onClick={resetForm}
                    >
                      Reset
                    </Button>
                  </div>
                </Row>
              </Form>
            ),
          },
        ]}
      />
      <CustomTable
        loading={loading}
        columns={columns || []}
        bordered
        dataSource={vendorData || []}
        scroll={{ x: 100, y: 400 }}
        tableSubheading={{
          "Total Records": getFormatedNumber(vendorData?.list?.length) || 0,
          "Total Units": getFormatedNumber(vendorData?.totalCount) || 0,
          "Total Register Units":
            getFormatedNumber(vendorData?.totalUnits) || 0,
        }}
      />
    </div>
  );
};

export default VendorRegistrationReport;
