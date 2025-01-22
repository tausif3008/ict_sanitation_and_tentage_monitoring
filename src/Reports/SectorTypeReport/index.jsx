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
import { dateWeekOptions } from "../../constant/const";
import CustomSelect from "../../commonComponents/CustomSelect";
import CustomDatepicker from "../../commonComponents/CustomDatepicker";
import { getFormData } from "../../urils/getFormData";
// import ExportToExcel from "../ExportToExcel";
// import ExportToPDF from "../reportFile";
import SectorReportSelectors from "../SectorSlice/sectorSelector";
import { getSectorTypeRegData } from "../SectorSlice/sectorSlice";
import CustomTable from "../../commonComponents/CustomTable";
import VendorSelectors from "../VendorwiseReports/vendorSelectors";
import { getVendorCategoryTypeDrop } from "../VendorwiseReports/vendorslice";

const SectorTypeReport = () => {
  // const [excelData, setExcelData] = useState([]);
  const [showDateRange, setShowDateRange] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [vendorData, setVendorData] = useState({
    list: [],
    pageLength: 25,
    currentPage: 1,
  });

  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const formValue = form.getFieldsValue();
  const { AssetMainTypeDrop, AssetTypeDrop } = AssetTypeSelectors(); // asset main type
  const { SectorReport_Loading, SectorTypeRegReport_data } =
    SectorReportSelectors(); // Sector-type Wise Report data
  const { VendorCatTypeDrop } = VendorSelectors(); // vendor dropdown & Reports

  // fiter finish
  const onFinishForm = (values) => {
    const finalData = {
      ...(values?.asset_main_type_id && {
        asset_main_type_id: values?.asset_main_type_id,
      }),
      ...(values?.date_format && { date_format: values?.date_format }),
      ...(values?.asset_type_id && { asset_type_id: values?.asset_type_id }),
      ...(values?.vendor_id && { vendor_id: values?.vendor_id }),
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
    getData();
    setShowDateRange(false);
  };

  // handle category
  const handleSelect = (value) => {
    form.setFieldsValue({
      asset_type_id: null,
      vendor_id: null,
    });
    const url = URLS?.assetType?.path + value;
    dispatch(getAssetTypes(url)); // get assset type
    if (value) {
      const paramData = {
        asset_main_type_id: value,
      };
      dispatch(getVendorCategoryTypeDrop(paramData)); // vendor list
    }
  };

  const handleTypeSelect = (value) => {
    form.setFieldsValue({
      vendor_id: null,
    });
    if (value) {
      const paramData = {
        asset_main_type_id: formValue?.asset_main_type_id,
        asset_type_id: value,
      };
      dispatch(getVendorCategoryTypeDrop(paramData)); // vendor list
    }
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

  const getData = async () => {
    dispatch(getSectorTypeRegData()); // Fetch the data
  };

  useEffect(() => {
    getData();
    dispatch(getVendorCategoryTypeDrop()); // vendor list
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
            width: 250,
            sorter: (a, b) => a[`dataIndex${index}`] - b[`dataIndex${index}`], // Sorting by the dynamic column
          };
        }
      );

    return [
      {
        title: "Sector Name",
        dataIndex: "sector_name",
        key: "sector_name",
        width: 100,
      },
      ...columnNames,
    ];
  }, [SectorTypeRegReport_data]); // Only recompute when SectorTypeRegReport_data changes

  useEffect(() => {
    if (SectorTypeRegReport_data) {
      const tableData = SectorTypeRegReport_data?.data?.listings?.map(
        (item) => {
          const sectorData = {
            id: item?.sector_id,
            sector_name: item?.sector_name,
          };
          item?.asset_types?.forEach((element, index) => {
            sectorData[`dataIndex${index}`] = element?.tagging_units;
          });
          return sectorData;
        }
      );

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

  // const pdfHeader = ["Sr No", "Sector Name", "Unit"];
  // const pdfData = useMemo(() => {
  //   return excelData?.map((sector, index) => [
  //     index + 1,
  //     sector["Sector name"],
  //     Number(sector?.Unit) || 0,
  //   ]);
  // }, [excelData]);

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
      <CommonDivider label={"Sector-Type Registration Report"} />
      {/* <div className="flex justify-end gap-2 font-semibold">
        <div>
          <ExportToPDF
            titleName={
              fileName
                ? `Sector-Type Registration Report (${fileName})`
                : "Sector-Type Registration Report"
            }
            pdfName={
              fileName
                ? `Sector-Type Registration Report (${fileName})`
                : "Sector-Type Registration Report"
            }
            headerData={pdfHeader}
            IsLastLineBold={true}
            rows={[...pdfData, ["", "Total", vendorData?.totalUnits]]}
          />
        </div>
        <div>
          <ExportToExcel
            excelData={excelData || []}
            fileName={
              fileName
                ? `Sector-Type Registration Report ${fileName}`
                : "Sector-Type Registration Report"
            }
            dynamicArray={[
              {
                name: "Total",
                value: vendorData?.totalUnits,
                colIndex: 3,
              },
            ]}
          />
        </div>
      </div> */}
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
                      onSelect={handleTypeSelect}
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
        columns={memoizedColumns || []}
        bordered
        dataSource={vendorData || []}
        scroll={{ x: 2000, y: 400 }}
        tableSubheading={{
          "Total Records": vendorData?.list?.length,
        }}
      />
    </div>
  );
};

export default SectorTypeReport;
