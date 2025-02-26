import React, { useEffect, useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import { Collapse, Form, Button, Row, Col } from "antd";
import moment from "moment";
import dayjs from "dayjs";
import CommonDivider from "../../commonComponents/CommonDivider";
import URLS from "../../urils/URLS";
import search from "../../assets/Dashboard/icon-search.png";
import AssetTypeSelectors from "../../register/AssetType/assetTypeSelectors";
import { getAssetMainTypes } from "../../register/AssetType/AssetTypeSlice";
import {
  dateWeekOptions,
  fiveTypes,
  getFormatedNumber,
  getValueLabel,
} from "../../constant/const";
import CustomSelect from "../../commonComponents/CustomSelect";
import CustomDatepicker from "../../commonComponents/CustomDatepicker";
import { getFormData } from "../../urils/getFormData";
import ExportToPDF from "../reportFile";
import SectorReportSelectors from "../SectorSlice/sectorSelector";
import { getSectorTypeRegData } from "../SectorSlice/sectorSlice";
import CustomTable from "../../commonComponents/CustomTable";
import VendorSelectors from "../VendorwiseReports/vendorSelectors";
import { getVendorCategoryTypeDrop } from "../VendorwiseReports/vendorslice";
import ExportToExcel from "../ExportToExcel";

const SectorTypeReport = () => {
  const [showDateRange, setShowDateRange] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [totalCount, setTotalCount] = useState({});
  const [vendorData, setVendorData] = useState({
    list: [],
    pageLength: 25,
    currentPage: 1,
  });

  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const formValue = form.getFieldsValue();
  const { AssetMainTypeDrop } = AssetTypeSelectors(); // asset main type
  const { SectorReport_Loading, SectorTypeRegReport_data } =
    SectorReportSelectors(); // Sector-type Wise Report data
  const { VendorCatTypeDrop } = VendorSelectors(); // vendor dropdown & Reports
  const valuesArray = Object.values(totalCount);

  const catTypeName = getValueLabel(
    formValue?.asset_main_type_id,
    AssetMainTypeDrop,
    null
  );
  const vendorName = getValueLabel(
    formValue?.vendor_id,
    VendorCatTypeDrop,
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
    let name = "Sector & Type";
    if (vendorName) {
      name = `${vendorName} Sector & Type`;
    }
    if (catTypeName) {
      name += `- ${catTypeName}`;
    }
    if (formValue?.asset_type_ids) {
      name += `- Asset Type 1 to 5`;
    }
    name += ` - ${fileDateName} `;
    name += `Report`;
    return name;
  };

  const pdfTitleParam = [
    ...(formValue?.vendor_id
      ? [
          {
            label: `Vendor Name : ${vendorName || "Combined"}`,
          },
        ]
      : []),
    {
      label: `Category : ${catTypeName || "Combined"}`,
    },
    ...(formValue?.asset_type_ids
      ? [
          {
            label: `Asset Type :  Asset Type 1 to 5`,
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
      ...(values?.vendor_id && { vendor_id: values?.vendor_id }),
      ...(values?.asset_type_ids && { asset_type_ids: values?.asset_type_ids }),
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
    dispatch(getSectorTypeRegData(formData)); // Fetch the data
  };

  // reset form
  const resetForm = () => {
    form.resetFields();
    setShowDateRange(false);
    getData();
  };

  // handle category
  const handleSelect = (value) => {
    form.setFieldsValue({
      asset_type_id: null,
      vendor_id: null,
      asset_type_ids: null,
    });
    // const url = URLS?.assetType?.path + value;
    // dispatch(getAssetTypes(url)); // get assset type
    if (value) {
      const paramData = {
        asset_main_type_id: value,
      };
      dispatch(getVendorCategoryTypeDrop(paramData)); // vendor list
    }
  };

  // const handleTypeSelect = (value) => {
  //   form.setFieldsValue({
  //     vendor_id: null,
  //   });
  //   if (value) {
  //     const paramData = {
  //       asset_main_type_id: formValue?.asset_main_type_id,
  //       asset_type_id: value,
  //     };
  //     dispatch(getVendorCategoryTypeDrop(paramData)); // vendor list
  //   }
  // };

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
    const finalData = {
      asset_main_type_id: "1",
      asset_type_ids: fiveTypes?.[0]?.value,
    };
    dispatch(getSectorTypeRegData(finalData)); // Fetch the data
    handleSelect("1");
    form.setFieldsValue({
      asset_main_type_id: "1",
      asset_type_ids: fiveTypes?.[0]?.value,
    });
  };

  useEffect(() => {
    getData();
    const assetMainTypeUrl = URLS?.assetMainTypePerPage?.path;
    dispatch(getAssetMainTypes(assetMainTypeUrl)); // asset main type
  }, []);

  // Use useMemo to calculate dynamic columns
  const memoizedColumns = useMemo(() => {
    if (!SectorTypeRegReport_data?.data?.listings) return [];
    const columnNames =
      SectorTypeRegReport_data?.data?.listings?.[0]?.asset_types?.map(
        (item, index) => {
          return {
            title: `${item?.asset_type_name}`,
            dataIndex: `dataIndex${index}`,
            key: `${item?.asset_type_id}`,
            width: 70,
            sorter: (a, b) => a[`dataIndex${index}`] - b[`dataIndex${index}`], // Sorting by the dynamic column
          };
        }
      );

    return [
      {
        title: "Sector Name",
        dataIndex: "sector_name",
        key: "sector_name",
        width: 60,
      },
      ...columnNames,
      {
        title: "Sector Total",
        dataIndex: "sector_total",
        key: "sector_total",
        width: 60,
      },
    ];
  }, [SectorTypeRegReport_data]); // Only recompute when SectorTypeRegReport_data changes

  useEffect(() => {
    if (SectorTypeRegReport_data) {
      let sectorCount = {};
      const tableData = SectorTypeRegReport_data?.data?.listings?.map(
        (item) => {
          const sectorData = {
            id: item?.sector_id,
            sector_name: item?.sector_name,
          };
          item?.asset_types?.forEach((element, index) => {
            sectorData[`dataIndex${index}`] = element?.tagging_units;
          });
          const count = item?.asset_types.reduce((total, data) => {
            return total + (Number(data?.tagging_units) || 0);
          }, 0);
          sectorData[`sector_total`] = count;
          sectorCount[item?.sector_name] = count;
          return sectorData;
        }
      );

      let myCount = {};
      SectorTypeRegReport_data?.data?.listings?.forEach((item) => {
        item?.asset_types.forEach((data) => {
          const assetType = data?.asset_type_name;
          const taggingUnits = Number(data?.tagging_units) || 0;

          if (myCount[assetType]) {
            myCount[assetType] += taggingUnits;
          } else {
            myCount[assetType] = taggingUnits;
          }
        });
      });
      setTotalCount(myCount);

      setVendorData((prevDetails) => ({
        ...prevDetails,
        list: tableData || [],
        pageLength: SectorTypeRegReport_data?.data?.paging?.[0]?.length || 0,
        currentPage:
          SectorTypeRegReport_data?.data?.paging?.[0]?.currentpage || 1,
        totalRecords:
          SectorTypeRegReport_data?.data?.paging?.[0]?.totalrecords || 0,
      }));
      // const myexcelData = SectorTypeRegReport_data?.data?.listings?.map(
      //   (data, index) => {
      //     return {
      //       Sr: index + 1,
      //       "Sector name": data?.sectors_name,
      //       Unit: Number(data?.tagging_units) || 0,
      //     };
      //   }
      // );
      // setExcelData(myexcelData);
    }
  }, [SectorTypeRegReport_data]);

  const pdfHeader = useMemo(() => {
    return memoizedColumns?.map((data, index) => data?.title);
  }, [memoizedColumns]);

  const pdfData = useMemo(() => {
    return vendorData?.list?.map((item, index) => {
      const row = [index + 1, item?.sector_name]; // Start with the row number (index + 1)
      Object.keys(item).forEach((key) => {
        if (key.startsWith("dataIndex")) {
          row.push(item[key]); // Add the value to the row
        } else if (key.startsWith("sector_total")) {
          row.push(item["sector_total"]); // Add the value to the row
        }
      });

      return row;
    });
  }, [vendorData]);
  const columnPercentages = [5, 10];

  const result =
    pdfData?.map((valueArray) => {
      return ["Sr no", ...pdfHeader]?.reduce((acc, key, index) => {
        acc[key] = valueArray[index]; // Assign corresponding value to each key
        return acc;
      }, {});
    }) || [];

  const dynamicArray =
    Object.entries(totalCount)?.map((data, index) => {
      return {
        name: data[0],
        value: data[1],
        colIndex: index + 3, // Start with column index 2 (Sector Name and Sector Total)
      };
    }) || [];

  return (
    <>
      <CommonDivider label={"Sector & Type Wise Registration Report"} />
      <div className="flex justify-end gap-2 font-semibold">
        <ExportToPDF
          titleName={`Sector & Type Wise Registration Report (${fileDateName})`}
          pdfName={
            fileName ? fileName : "Sector & Type Wise Registration Report"
          }
          tableTitles={pdfTitleParam || []}
          headerData={["Sr no", ...pdfHeader] || []}
          landscape={true}
          IsLastLineBold={true}
          IsLastColumnBold={true}
          columnPercentages={columnPercentages}
          rows={[
            ...pdfData,
            ["Total", vendorData?.list?.length, ...valuesArray],
          ]}
        />
        <ExportToExcel
          excelData={result || []}
          IsLastColumnBold={true}
          fileName={
            fileName ? fileName : "Sector & Type Wise Registration Report"
          }
          dynamicArray={dynamicArray || []}
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
                      options={AssetMainTypeDrop || []}
                      onSelect={handleSelect}
                      allowClear={false}
                    />
                  </Col>
                  <Col key="vendor_id" xs={24} sm={12} md={6} lg={5}>
                    <CustomSelect
                      name={"vendor_id"}
                      label={"Select Vendor"}
                      placeholder={"Select Vendor"}
                      options={VendorCatTypeDrop || []}
                    />
                  </Col>
                  {formValue?.asset_main_type_id === "1" && (
                    <Col key="asset_type_ids" xs={24} sm={12} md={6} lg={5}>
                      <CustomSelect
                        name={"asset_type_ids"}
                        label={"Select Type"}
                        placeholder={"Select Type"}
                        options={fiveTypes || []}
                      />
                    </Col>
                  )}
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
                    <Button
                      loading={SectorReport_Loading}
                      type="button"
                      htmlType="submit"
                      className="w-fit rounded-none text-white bg-blue-500 hover:bg-blue-600"
                    >
                      Search
                    </Button>
                    <Button
                      loading={SectorReport_Loading}
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
        loading={SectorReport_Loading}
        columns={memoizedColumns || []}
        bordered
        dataSource={vendorData || []}
        scroll={{ x: 1800, y: 400 }}
        tableSubheading={{
          "Total Records": getFormatedNumber(vendorData?.list?.length) || 0,
        }}
      />
    </>
  );
};

export default SectorTypeReport;
