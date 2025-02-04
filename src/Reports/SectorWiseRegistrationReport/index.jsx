import React, { useEffect, useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import { Collapse, Form, Button, Row, Col } from "antd";
import moment from "moment";
import dayjs from "dayjs";
import CommonDivider from "../../commonComponents/CommonDivider";
import URLS from "../../urils/URLS";
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
import { getFormData } from "../../urils/getFormData";
import ExportToPDF from "../reportFile";
import SectorReportSelectors from "../SectorSlice/sectorSelector";
import { getSectorWiseRegData } from "../SectorSlice/sectorSlice";
import CustomTable from "../../commonComponents/CustomTable";

const SectorWiseRegistrationReport = () => {
  const [excelData, setExcelData] = useState([]);
  const [showDateRange, setShowDateRange] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [vendorData, setVendorData] = useState({
    list: [],
    pageLength: 25,
    currentPage: 1,
  });

  const dispatch = useDispatch();
  const { AssetMainTypeDrop, AssetTypeDrop } = AssetTypeSelectors(); // asset main type
  const { SectorReport_Loading, SectorRegReport_data } =
    SectorReportSelectors(); // Sector Wise Report data

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
    let name = "Sector Wise";
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
  const fileName = getReportName();

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
    } else if (values?.form_date || values?.to_date) {
      const dayjsObjectFrom = dayjs(values?.form_date?.$d);
      const dayjsObjectTo = dayjs(values?.to_date?.$d);
      const start = dayjsObjectFrom.format("YYYY-MM-DD");
      const end = dayjsObjectTo.format("YYYY-MM-DD");
      finalData.form_date = values?.form_date ? start : end;
      finalData.to_date = values?.to_date ? end : start;
    }
    const formData = getFormData(finalData);
    getData(formData);
  };

  // reset form
  const resetForm = () => {
    form.resetFields();
    setShowDateRange(false);
    form.setFieldsValue({
      total_counts: AllCountOptions?.[0]?.value,
    });
    getData();
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
    const uri = URLS?.sector_wise_reg_report?.path;
    dispatch(getSectorWiseRegData(uri, data)); // Fetch the data
  };

  useEffect(() => {
    getData(); // get current data
    const assetMainTypeUrl = URLS?.assetMainTypePerPage?.path;
    dispatch(getAssetMainTypes(assetMainTypeUrl)); // asset main type
    form.setFieldsValue({
      total_counts: AllCountOptions?.[0]?.value,
    });
  }, []);

  useEffect(() => {
    if (SectorRegReport_data) {
      const unitCount = SectorRegReport_data?.data?.listings?.reduce(
        (total, item) => {
          return total + Number(item?.tagging_units);
        },
        0
      );
      const totalCounts = SectorRegReport_data?.data?.listings?.reduce(
        (total, item) => {
          return total + Number(item?.total);
        },
        0
      );
      setVendorData((prevDetails) => ({
        ...prevDetails,
        list: SectorRegReport_data?.data?.listings || [],
        pageLength: SectorRegReport_data?.data?.paging?.[0]?.length || 0,
        currentPage: SectorRegReport_data?.data?.paging?.[0]?.currentpage || 1,
        totalRecords:
          SectorRegReport_data?.data?.paging?.[0]?.totalrecords || 0,
        totalUnits: unitCount,
        totalCount: totalCounts,
      }));
      const myexcelData = SectorRegReport_data?.data?.listings?.map(
        (data, index) => {
          return {
            Sr: index + 1,
            "Sector name": data?.sectors_name,
            "Total Units": Number(data?.total) || 0,
            "Register Units": Number(data?.tagging_units) || 0,
          };
        }
      );
      setExcelData(myexcelData);
    }
  }, [SectorRegReport_data]);

  const columns = [
    {
      title: "Sector Name",
      dataIndex: "sectors_name",
      key: "sectors_name",
      render: (text, record) => {
        return text ? text : "GSD";
      },
    },
    ...(formValue?.total_counts
      ? [
          {
            title: "Total Units",
            dataIndex: "total",
            key: "total",
            sorter: (a, b) => a?.total - b?.total,
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
    "Sector Name",
    ...(formValue?.total_counts ? ["Total Units"] : []),
    "Register Units",
  ];
  const pdfData = useMemo(() => {
    return excelData?.map((sector, index) => [
      index + 1,
      sector["Sector name"],
      ...(formValue?.total_counts
        ? [Number(sector?.["Total Units"]) || 0]
        : []),
      Number(sector?.["Register Units"]) || 0,
    ]);
  }, [excelData]);

  // const fileName =
  //   formValue?.date_format === "Today"
  //     ? moment().format("DD-MMM-YYYY")
  //     : formValue?.date_format === "Date Range"
  //     ? `${dayjs(formValue?.form_date).format("DD-MMM-YYYY")} to ${dayjs(
  //         formValue?.to_date
  //       ).format("DD-MMM-YYYY")}`
  //     : null;

  return (
    <div>
      <CommonDivider label={"Sector Wise Registration Report"} />
      <div className="flex justify-end gap-2 font-semibold">
        <ExportToPDF
          titleName={
            fileName
              ? `Sector Wise Registration Report (${fileDateName})`
              : "Sector Wise Registration Report"
          }
          pdfName={fileName ? fileName : "Sector Wise Registration Report"}
          tableTitles={pdfTitleParam || []}
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
        />
        <ExportToExcel
          excelData={excelData || []}
          fileName={fileName ? fileName : "Sector Wise Registration Report"}
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
                      options={AssetMainTypeDrop?.slice(0, 2) || []}
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
                      // onSelect={handleDateSelect}
                      // onChange={(value) => {
                      //   if (!value) {
                      //     setShowDateRange(false);
                      //   }
                      // }}
                    />
                  </Col>
                  <div className="flex justify-start my-4 space-x-2 ml-3">
                    <div>
                      <Button
                        loading={SectorReport_Loading}
                        type="button"
                        htmlType="submit"
                        className="w-fit rounded-none text-white bg-blue-500 hover:bg-blue-600"
                      >
                        Search
                      </Button>
                    </div>
                    <div>
                      <Button
                        loading={SectorReport_Loading}
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

      <CustomTable
        loading={SectorReport_Loading}
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

export default SectorWiseRegistrationReport;
