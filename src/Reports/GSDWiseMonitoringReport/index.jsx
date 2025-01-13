import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { Collapse, Form, Button, Row, Col } from "antd";
import dayjs from "dayjs";
import CommonDivider from "../../commonComponents/CommonDivider";
import URLS from "../../urils/URLS";
import search from "../../assets/Dashboard/icon-search.png";
import AssetTypeSelectors from "../../register/AssetType/assetTypeSelectors";
import {
  getAssetMainTypes,
  getAssetTypes,
} from "../../register/AssetType/AssetTypeSlice";
import { getPercentage, gsdWiseMonitoringcolumns } from "../../constant/const";
import CustomSelect from "../../commonComponents/CustomSelect";
import CustomDatepicker from "../../commonComponents/CustomDatepicker";
import { getFormData } from "../../urils/getFormData";
import MonitoringSelector from "../../complaince/monitoringSelector";
import { getMonitoringAgent } from "../../complaince/monitoringSlice";
import { getSectorsList } from "../../vendor-section-allocation/vendor-sector/Slice/vendorSectorSlice";
import VendorSectorSelectors from "../../vendor-section-allocation/vendor-sector/Slice/vendorSectorSelectors";
import { getVendorCategoryTypeDrop } from "../VendorwiseReports/vendorslice";
import VendorSelectors from "../VendorwiseReports/vendorSelectors";
import GSDMonitoringSelector from "./Slice/GSDMonitoringSelector";
import { getGSDMonitoringData } from "./Slice/GSDMonitoringReport";
import CustomTable from "../../commonComponents/CustomTable";
import ExportToExcel from "../ExportToExcel";
import ExportToPDF from "../reportFile";

const GsdWiseMonitoringReport = () => {
  const [excelData, setExcelData] = useState([]);
  const [gsdData, setGsdData] = useState({
    list: [],
    pageLength: 25,
    currentPage: 1,
  });
  const [count, setCount] = useState({
    total: 0,
    registered: 0,
    todaysmonitaring: 0,
    partially_compliant: 0,
    compliant: 0,
    not_compliant: 0,
    toiletunclean: 0,
    toiletclean: 0,
  });

  const dispatch = useDispatch();
  const { AssetMainTypeDrop, AssetTypeDrop } = AssetTypeSelectors(); // asset main type
  const { monitoringAgentDrop } = MonitoringSelector(); // monitoring agent drop
  const { SectorListDrop } = VendorSectorSelectors(); // all sector dropdown
  const { VendorCatTypeDrop } = VendorSelectors(); // vendor dropdown & Reports
  const { GSDMonitoring_data, gsd_monitoringLoader } = GSDMonitoringSelector();

  const dateFormat = "YYYY-MM-DD";
  const [form] = Form.useForm();
  const formValue = form.getFieldsValue();

  // fiter finish
  const onFinishForm = (values) => {
    const finalData = {
      page: values?.page || "1",
      per_page: values?.size || "25",
      date: dayjs(values?.date).format("YYYY-MM-DD"),
      ...(values?.sector_id && {
        sector_id: values?.sector_id,
      }),
      ...(values?.vendor_id && { vendor_id: values?.vendor_id }),
      ...(values?.asset_type_id && { asset_type_id: values?.asset_type_id }),
      ...(values?.asset_main_type_id && {
        asset_main_type_id: values?.asset_main_type_id,
      }),
      ...(values?.user_id && { user_id: values?.user_id }),
    };
    callApi(finalData);
  };

  // reset form
  const resetForm = () => {
    form.resetFields();
    getCurrentData();
    // setShowDateRange(false);
  };

  // handle asset main type
  const handleSelect = (value) => {
    form.setFieldsValue({
      asset_type_id: null,
      vendor_id: null,
    });
    const url = URLS?.assetType?.path + value;
    dispatch(getAssetTypes(url)); // get assset type

    const paramData = {
      asset_main_type_id: value,
    };
    dispatch(getVendorCategoryTypeDrop(paramData)); // asset type wise vendor list
  };

  // handle asset type
  const handleTypeSelect = (value) => {
    form.setFieldsValue({
      vendor_id: null,
    });
    if (value) {
      const paramData = {
        asset_main_type_id: formValue?.asset_main_type_id,
        asset_type_id: value,
      };
      dispatch(getVendorCategoryTypeDrop(paramData)); // asset type wise vendor list
    }
  };

  // current data
  const getCurrentData = () => {
    let newDate = dayjs().format("YYYY-MM-DD");
    form.setFieldsValue({
      date: dayjs(newDate, dateFormat),
      asset_main_type_id: "1",
      sector_id: "1",
    });
    const url = URLS?.assetType?.path + "1";
    dispatch(getAssetTypes(url)); // get assset type
    const paramData = {
      asset_main_type_id: "1",
    };
    dispatch(getVendorCategoryTypeDrop(paramData)); // vendor list
    const finalValues = {
      date: newDate,
      asset_main_type_id: "1",
      sector_id: "1",
      page: "1",
      per_page: "25",
    };
    callApi(finalValues);
  };

  const callApi = async (data) => {
    const formData = await getFormData(data);
    dispatch(getGSDMonitoringData(formData)); // vendor reports
  };

  useEffect(() => {
    const urls = URLS?.monitoringAgent?.path;
    dispatch(getMonitoringAgent(urls)); // monitoring agent list
    getCurrentData();
    const assetMainTypeUrl = URLS?.assetMainTypePerPage?.path;
    dispatch(getAssetMainTypes(assetMainTypeUrl)); // asset main type
    dispatch(getSectorsList()); // all sectors
  }, []);

  const getUsers = async (dataObj = {}) => {
    const newParam = {
      page: dataObj?.page || "1",
      per_page: dataObj?.size || "25",
      ...form.getFieldsValue(),
    };
    onFinishForm(newParam);
  };

  useEffect(() => {
    if (GSDMonitoring_data) {
      const myData = GSDMonitoring_data?.data?.gsd;

      const totalMonitoring = myData?.reduce(
        (acc, circle) => acc + Number(circle?.todaysmonitaring) || 0,
        0
      );
      const partially_compliant = myData?.reduce(
        (acc, circle) => acc + Number(circle?.partially_compliant) || 0,
        0
      );
      const compliant = myData?.reduce(
        (acc, circle) => acc + Number(circle?.compliant) || 0,
        0
      );
      const not_compliant = myData?.reduce(
        (acc, circle) => acc + Number(circle?.not_compliant) || 0,
        0
      );
      const toiletunclean = myData?.reduce(
        (acc, circle) => acc + Number(circle?.toiletunclean) || 0,
        0
      );
      const toiletclean = myData?.reduce(
        (acc, circle) => acc + Number(circle?.toiletclean) || 0,
        0
      );
      const lastTableRow = [
        {
          name: gsdData?.list?.length,
          todaysmonitaring: totalMonitoring,
          partially_compliant: partially_compliant,
          compliant: compliant,
          not_compliant: not_compliant,
          toiletunclean: toiletunclean,
          toiletclean: toiletclean,
        },
      ];

      setGsdData((prevDetails) => ({
        ...prevDetails,
        list: [...GSDMonitoring_data?.data?.gsd, ...lastTableRow] || [],
        pageLength: GSDMonitoring_data?.data?.paging?.[0]?.length || 0,
        currentPage: GSDMonitoring_data?.data?.paging?.[0]?.currentpage || 1,
        totalRecords: GSDMonitoring_data?.data?.paging?.[0]?.totalrecords || 0,
      }));

      setCount({
        todaysmonitaring: totalMonitoring,
        partially_compliant: partially_compliant,
        compliant: compliant,
        not_compliant: not_compliant,
        toiletunclean: toiletunclean,
        toiletclean: toiletclean,
      });

      const myexcelData = GSDMonitoring_data?.data?.gsd?.map((data, index) => {
        return {
          Sr: index + 1,
          Name: data?.name,
          Monitoring: Number(data?.todaysmonitaring) || 0,
          Compliant: Number(data?.compliant) || 0,
          "Partially Compliant": Number(data?.partially_compliant) || 0,
          "Not Compliant": Number(data?.not_compliant) || 0,
          "Not Compliant (%)":
            getPercentage(
              Number(data?.not_compliant) || 0,
              (Number(data?.toiletunclean) || 0) +
                (Number(data?.toiletclean) || 0)
            ) + " %",
          "Toilet Unclean": Number(data?.toiletunclean) || 0,
          "Toilet Unclean (%)":
            getPercentage(
              Number(data?.toiletunclean) || 0,
              (Number(data?.toiletunclean) || 0) +
                (Number(data?.toiletclean) || 0)
            ) + " %",
          "Toilet Clean": Number(data?.toiletclean) || 0,
        };
      });
      setExcelData(myexcelData);
    }
  }, [GSDMonitoring_data]);

  // pdf header
  const pdfHeader = [
    "Sr No",
    "GSD Name",
    "Monitoring",
    "Compliant",
    // "Compliant (%)",
    "Partially Compliant",
    // "Partially Compliant (%)",
    "Not Compliant",
    "Not Compliant (%)",
    "Toilet Unclean",
    "Toilet Unclean (%)",
    "Toilet Clean",
    // "Toilet Clean (%)",
  ];

  // pdf data
  const pdfData = useMemo(() => {
    return (
      excelData?.map((opt) => [
        opt?.Sr,
        opt?.Name,
        opt?.Monitoring,
        opt?.Compliant,
        // opt?.["Compliant (%)"],
        opt?.["Partially Compliant"],
        // opt?.["Partially Compliant (%)"],
        opt?.["Not Compliant"],
        opt?.["Not Compliant (%)"],
        opt?.["Toilet Unclean"],
        opt?.["Toilet Unclean (%)"],
        opt?.["Toilet Clean"],
        // opt?.["Toilet Clean (%)"],
      ]) || []
    );
  }, [excelData]);

  const pdfNames = `GSD Wise Monitoring Report (${dayjs(formValue?.date).format(
    "DD-MMM-YYYY"
  )})`;

  return (
    <div>
      <CommonDivider label={"GSD Wise Monitoring Report"} />
      <div className="flex justify-end gap-2 font-semibold">
        <div>
          <ExportToPDF
            titleName={pdfNames}
            pdfName={pdfNames}
            headerData={pdfHeader}
            IsLastLineBold={true}
            landscape={true}
            // applyTableStyles={true}
            rows={[
              ...pdfData,
              [
                "",
                "Total",
                count?.todaysmonitaring,
                count?.compliant,
                count?.partially_compliant,
                count?.not_compliant,
                "",
                count?.toiletunclean,
                "",
                count?.toiletclean,
              ],
            ]}
          />
        </div>
        <div>
          <ExportToExcel
            excelData={excelData || []}
            titleName={pdfNames}
            fileName={pdfNames}
            dynamicArray={[
              {
                name: "Total",
                value: count?.total,
                colIndex: 2,
              },
              {
                name: "Monitoring",
                value: count?.todaysmonitaring,
                colIndex: 3,
              },
              {
                name: "Compliant",
                value: count?.compliant,
                colIndex: 4,
              },
              {
                name: "Partialy Compliant",
                value: count?.partially_compliant,
                colIndex: 5,
              },
              {
                name: "Not Compliant",
                value: count?.not_compliant,
                colIndex: 6,
              },
              {
                name: "Unclean",
                value: count?.toiletunclean,
                colIndex: 8,
              },
              {
                name: "Clean",
                value: count?.toiletclean,
                colIndex: 10,
              },
            ]}
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
                        onSelect={handleSelect}
                        options={AssetMainTypeDrop?.slice(0, 2) || []}
                      />
                    </Col>
                    <Col key="asset_type_id" xs={24} sm={12} md={6} lg={5}>
                      <CustomSelect
                        name={"asset_type_id"}
                        label={"Select Asset Type"}
                        placeholder={"Select Asset Type"}
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
                    <Col key="user_id" xs={24} sm={12} md={6} lg={5}>
                      <CustomSelect
                        name={"user_id"}
                        label={"Select GSD"}
                        placeholder={"Select GSD"}
                        options={monitoringAgentDrop || []}
                        // search dropdown
                        isOnSearchFind={true}
                        apiAction={getMonitoringAgent}
                        onSearchUrl={`${URLS?.monitoringAgent?.path}&keywords=`}
                      />
                    </Col>
                    <Col key="sector_id" xs={24} sm={12} md={6} lg={5}>
                      <CustomSelect
                        name={"sector_id"}
                        label={"Select Sector"}
                        placeholder={"Select Sector"}
                        options={SectorListDrop || []}
                      />
                    </Col>
                    {/* <Col key="asset_main_type_id" xs={24} sm={12} md={6} lg={5}>
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
                    </Col> */}
                    <Col key="date" xs={24} sm={12} md={6} lg={5}>
                      <CustomDatepicker
                        name={"date"}
                        label={"Date"}
                        className="w-full"
                        placeholder={"Date"}
                      />
                    </Col>
                    {/* <Col key="date_format" xs={24} sm={12} md={6} lg={5}>
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
                    )} */}
                    <div className="flex justify-start my-4 space-x-2 ml-3">
                      <div>
                        <Button
                          loading={gsd_monitoringLoader}
                          type="button"
                          htmlType="submit"
                          className="w-fit rounded-none text-white bg-blue-500 hover:bg-blue-600"
                        >
                          Search
                        </Button>
                      </div>
                      <div>
                        <Button
                          loading={gsd_monitoringLoader}
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
      </div>
      <CustomTable
        loading={gsd_monitoringLoader}
        columns={gsdWiseMonitoringcolumns || []}
        bordered
        dataSource={gsdData || []}
        // dataSource={[...gsdData?.list, ...lastTableRow] || []}
        scroll={{ x: 1500, y: 400 }}
        tableSubheading={{
          "Total Records": gsdData?.totalRecords,
        }}
        pagination={true}
        // onPageChange={(page, size) => {
        //   const obj = {
        //     page: page,
        //     size: size,
        //   };
        //   getUsers(obj);
        // }}
      />
      {/* <CommonTable
        loading={gsd_monitoringLoader}
        uri={`gsd-wise-monitoring-report`}
        columns={gsdWiseMonitoringcolumns || []}
        details={gsdData || []}
        // subtotalName={"Total Units"}
        // subtotalCount={gsdData?.totalUnits}
        scroll={{ x: 1000, y: 400 }}
      ></CommonTable> */}
    </div>
  );
};

export default GsdWiseMonitoringReport;
