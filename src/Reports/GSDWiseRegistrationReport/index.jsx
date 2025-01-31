import React, { useEffect, useMemo, useState } from "react";
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
  dateWeekOptions,
  getFormatedNumber,
  getValueLabel,
} from "../../constant/const";
import ExportToExcel from "../ExportToExcel";
import CustomSelect from "../../commonComponents/CustomSelect";
import CustomDatepicker from "../../commonComponents/CustomDatepicker";
import { getGSDReportData } from "./Slice/gsdWiseRegistrationReport";
import GsdRegistrationSelector from "./Slice/gsdRegistrationSelector";
import { getFormData } from "../../urils/getFormData";
import ExportToPDF from "../reportFile";
import { getSectorsList } from "../../vendor-section-allocation/vendor-sector/Slice/vendorSectorSlice";
import VendorSectorSelectors from "../../vendor-section-allocation/vendor-sector/Slice/vendorSectorSelectors";
import CustomTable from "../../commonComponents/CustomTable";

const GsdRegistrationReport = () => {
  const [excelData, setExcelData] = useState([]);
  const [showDateRange, setShowDateRange] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [gsdData, setGsdData] = useState({
    list: [],
    pageLength: 25,
    currentPage: 1,
  });

  const dispatch = useDispatch();
  const { GSDReport_data, loading } = GsdRegistrationSelector(); // gsd selector
  const { AssetMainTypeDrop, AssetTypeDrop } = AssetTypeSelectors(); // asset main type
  const { SectorListDrop } = VendorSectorSelectors(); // all sector dropdown

  let uri = URLS?.gsdRegistrationReport?.path;
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
  const sectorName = getValueLabel(formValue?.sector_id, SectorListDrop, null);

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
    ...(formValue?.sector_id
      ? [
          {
            label: `Sector Name : ${sectorName || "Combined"}`,
          },
        ]
      : []),
  ];
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
    let name = "GSD Wise";
    if (catTypeName) {
      name += `- ${catTypeName}`;
    }
    if (assetTypeName) {
      name += `- ${assetTypeName}`;
    }
    if (sectorName) {
      name += `- ${sectorName}`;
    }
    name += `- Registration Report ${fileDateName}`;
    return name;
  };
  const fileName = getReportName();

  // fiter finish
  const onFinishForm = (values) => {
    const finalData = {
      ...(values?.asset_main_type_id && {
        asset_main_type_id: values?.asset_main_type_id,
      }),
      ...(values?.date_format && { date_format: values?.date_format }),
      ...(values?.asset_type_id && { asset_type_id: values?.asset_type_id }),
      ...(values?.sector_id && { sector_id: values?.sector_id }),
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
    dispatch(getGSDReportData(basicUrl + uri, formData)); // Fetch the data
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

  // handle asset type
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

  // get current data
  const getData = async () => {
    dispatch(getGSDReportData(basicUrl + uri)); // Fetch the data
  };

  useEffect(() => {
    getData();
    const assetMainTypeUrl = URLS?.assetMainTypePerPage?.path;
    dispatch(getAssetMainTypes(assetMainTypeUrl)); // asset main type
    dispatch(getSectorsList()); // all sectors
  }, []);

  useEffect(() => {
    if (GSDReport_data) {
      const unitCount = GSDReport_data?.data?.listings?.reduce(
        (total, item) => {
          return total + Number(item?.tagging_units);
        },
        0
      );

      setGsdData((prevDetails) => ({
        ...prevDetails,
        list: GSDReport_data?.data?.listings || [],
        pageLength: GSDReport_data?.data?.paging?.[0]?.length || 0,
        currentPage: GSDReport_data?.data?.paging?.[0]?.currentpage || 1,
        totalRecords: GSDReport_data?.data?.paging?.[0]?.totalrecords || 0,
        totalUnits: unitCount,
      }));

      const myexcelData = GSDReport_data?.data?.listings?.map((data, index) => {
        return {
          Sr: index + 1,
          "GSD name": data?.agent_name,
          "GSD Phone": data?.agent_phone,
          Unit: Number(data?.tagging_units),
          "Sector Name":
            getValueLabel(data?.sector_id, SectorListDrop, null) || "-",
        };
      });
      setExcelData(myexcelData);
    }
  }, [GSDReport_data]);

  const columns = [
    {
      title: "GSD Name",
      dataIndex: "agent_name",
      key: "agent_name",
      render: (text, record) => {
        return text ? text : "GSD";
      },
    },
    {
      title: "Phone",
      dataIndex: "agent_phone",
      key: "agent_phone",
    },
    {
      title: "Units",
      dataIndex: "tagging_units",
      key: "tagging_units",
    },
    {
      title: "Sector",
      dataIndex: "sector_id",
      render: (text) => {
        return text ? getValueLabel(text, SectorListDrop, "-") : "-";
      },
    },
  ];

  // pdf header
  const pdfHeader = [
    "Sr no",
    "GSD Name",
    "GSD Phone",
    "Unit",
    ...(!formValue?.sector_id ? ["Sector Name"] : []),
    ,
  ];
  // pdf data
  const pdfData = useMemo(() => {
    return (
      excelData?.map((data, index) => [
        index + 1,
        data?.["GSD name"],
        data?.["GSD Phone"],
        Number(data?.Unit) || 0,
        ...(!formValue?.sector_id ? [data?.["Sector Name"] || "-"] : []),
      ]) || []
    );
  }, [excelData]);

  return (
    <div>
      <CommonDivider label={"GSD Wise Registration Report"} />
      <div className="flex justify-end gap-2 font-semibold">
        <ExportToPDF
          titleName={`GSD Wise Registration Report (${fileDateName})`}
          pdfName={fileName ? fileName : "GSD Wise Registration Report"}
          headerData={pdfHeader}
          rows={[...pdfData, ["", "Total", "", gsdData?.totalUnits]]}
          IsLastLineBold={true}
          tableTitles={pdfTitleParam || []}
        />
        <ExportToExcel
          excelData={excelData || []}
          fileName={fileName ? fileName : "GSD Wise Registration Report"}
          dynamicArray={[
            {
              name: "Total Unit",
              value: gsdData?.totalUnits,
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
                <Row gutter={[16, 0]} align="middle">
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
                  <Col key="sector_id" xs={24} sm={12} md={6} lg={5}>
                    <CustomSelect
                      name={"sector_id"}
                      label={"Select Sector"}
                      placeholder={"Select Sector"}
                      options={SectorListDrop || []}
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
      <CustomTable
        loading={loading}
        columns={columns || []}
        bordered
        dataSource={gsdData || []}
        scroll={{ x: 300, y: 400 }}
        pagination={true}
        tableSubheading={{
          "Total Records": getFormatedNumber(gsdData?.list?.length) || 0,
          "Total Units": getFormatedNumber(gsdData?.totalUnits) || 0,
        }}
      />
    </div>
  );
};

export default GsdRegistrationReport;
