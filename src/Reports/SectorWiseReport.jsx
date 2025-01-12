import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import dayjs from "dayjs";
import moment from "moment";
import { Table, Collapse, Form, Button, Row, Col } from "antd";

import CommonDivider from "../commonComponents/CommonDivider";
import ExportToPDF from "./reportFile";
import ExportToExcel from "./ExportToExcel";
import { getSectorReports } from "./SectorSlice/sectorSlice";
import URLS from "../urils/URLS";
import SectorReportSelectors from "./SectorSlice/sectorSelector";
import search from "../assets/Dashboard/icon-search.png";
import CustomSelect from "../commonComponents/CustomSelect";
import {
  getAssetMainTypes,
  getAssetTypes,
} from "../register/AssetType/AssetTypeSlice";
import AssetTypeSelectors from "../register/AssetType/assetTypeSelectors";
import { getFormData } from "../urils/getFormData";
import {
  getPercentage,
  getValueLabel,
  renderMonitoringSorting,
  renderSorting,
  VendorWiseReportcolumns,
} from "../constant/const";
import CustomDatepicker from "../commonComponents/CustomDatepicker";
import {
  getVendorCategoryTypeDrop,
  getVendorReports,
} from "./VendorwiseReports/vendorslice";
import VendorSelectors from "./VendorwiseReports/vendorSelectors";
import ViewVendorsSectors from "../register/AssetType/viewVendors";

const SectorWiseReport = () => {
  const [filesName, setFilesName] = useState(null); // files Name
  const [showModal, setShowModal] = useState(null);
  const [totalQuantity, setTotalQuantity] = useState({
    totalQnty: 0,
    registered: 0,
    monitoring: 0,
    total: 0,
    partially_compliant: 0,
    compliant: 0,
    not_compliant: 0,
    toiletunclean: 0,
    toiletclean: 0,
  });
  const [count, setCount] = useState({
    total: 0,
    registered: 0,
    monitoring: 0,
    partially_compliant: 0,
    compliant: 0,
    not_compliant: 0,
    toiletunclean: 0,
    toiletclean: 0,
  });

  const dateFormat = "YYYY-MM-DD";
  const [form] = Form.useForm();
  const formValue = form.getFieldsValue();
  const dispatch = useDispatch();
  const { sectorData, SectorReport_Loading } = SectorReportSelectors(); // sector reports
  const { AssetMainTypeDrop, AssetTypeDrop } = AssetTypeSelectors(); // asset main type & asset type
  const { VendorReport_Loading, vendorReports, VendorCatTypeDrop } =
    VendorSelectors(); // vendor dropdown & Reports
  const vendorsData = vendorReports?.data?.vendors || [];

  const userRoleId = localStorage.getItem("role_id");
  const sessionDataString = localStorage.getItem("sessionData");
  const sessionData = sessionDataString ? JSON.parse(sessionDataString) : null;
  const categoryType = form.getFieldValue("asset_main_type_id");
  const asset_type_id_name = form.getFieldValue("asset_type_id");
  const vendor_id_name = form.getFieldValue("vendor_id");

  useEffect(() => {
    if (vendorReports) {
      const total = vendorsData?.reduce(
        (acc, circle) => acc + Number(circle?.total),
        0
      );
      const totalReg = vendorsData?.reduce(
        (acc, circle) => acc + Number(circle?.registered),
        0
      );
      const totalMonitoring = vendorsData?.reduce(
        (acc, circle) => acc + Number(circle?.todaysmonitaring) || 0,
        0
      );
      const partially_compliant = vendorsData?.reduce(
        (acc, circle) => acc + Number(circle?.partially_compliant) || 0,
        0
      );
      const compliant = vendorsData?.reduce(
        (acc, circle) => acc + Number(circle?.compliant) || 0,
        0
      );
      const not_compliant = vendorsData?.reduce(
        (acc, circle) => acc + Number(circle?.not_compliant) || 0,
        0
      );
      const toiletunclean = vendorsData?.reduce(
        (acc, circle) => acc + Number(circle?.toiletunclean) || 0,
        0
      );
      const toiletclean = vendorsData?.reduce(
        (acc, circle) => acc + Number(circle?.toiletclean) || 0,
        0
      );

      setCount({
        total: total,
        registered: totalReg,
        monitoring: totalMonitoring,
        partially_compliant: partially_compliant,
        compliant: compliant,
        not_compliant: not_compliant,
        toiletunclean: toiletunclean,
        toiletclean: toiletclean,
      });
    }
  }, [vendorReports]);

  // close module
  const handleCancel = () => {
    setShowModal(null);
    setCount({
      total: 0,
      registered: 0,
      monitoring: 0,
      partially_compliant: 0,
      compliant: 0,
      not_compliant: 0,
      toiletunclean: 0,
    });
  };

  // vendor click
  const handleClick = (record) => {
    const finalValues = {
      ...(formValue?.asset_main_type_id && {
        asset_main_type_id: formValue?.asset_main_type_id,
      }),
      ...(formValue?.asset_type_id && {
        asset_type_id: formValue?.asset_type_id,
      }),
      ...(formValue?.vendor_id && { vendor_id: formValue?.vendor_id }),
      sector_id: record?.sector_id,
      ...(formValue?.date && {
        date: dayjs(formValue?.date).format("YYYY-MM-DD"),
      }),
    };
    setShowModal(record);
    const url = URLS?.vendorReporting?.path;
    dispatch(getVendorReports(url, finalValues)); // vendor reports
  };

  // handle category
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
    dispatch(getVendorCategoryTypeDrop(paramData)); // vendor list
  };

  // handle asset type
  const handleTypeSelect = (value) => {
    form.setFieldsValue({
      vendor_id: null,
    });
    if (userRoleId !== "8" && value) {
      const paramData = {
        asset_main_type_id: formValue?.asset_main_type_id,
        asset_type_id: value,
      };
      dispatch(getVendorCategoryTypeDrop(paramData)); // vendor list
    }
  };

  // fiter finish
  const onFinishForm = async (values) => {
    const dayjsDate = new Date(values?.date);
    const formattedDate = moment(dayjsDate).format("YYYY-MM-DD");
    const finalValues = {
      ...(values?.asset_main_type_id && {
        asset_main_type_id: values?.asset_main_type_id,
      }),
      ...(values?.asset_type_id && { asset_type_id: values?.asset_type_id }),
      ...(values?.vendor_id && { vendor_id: values?.vendor_id }),
      date: values?.date ? formattedDate : moment().format("YYYY-MM-DD"),
      ...(userRoleId === "8" && {
        vendor_id: sessionData?.id,
      }),
    };
    callApi(finalValues);
  };

  const callApi = async (data) => {
    const formData = await getFormData(data);
    const url = URLS?.sector_wise_report?.path;
    dispatch(getSectorReports(url, formData)); // sector reports
  };

  // reset form
  const resetForm = () => {
    form.resetFields();
    getCurrentData();
    setFilesName(null);
  };

  // file name
  const getReportName = () => {
    const catTypeName = getValueLabel(categoryType, AssetMainTypeDrop, "");
    const assetTypeName = getValueLabel(asset_type_id_name, AssetTypeDrop, "");
    const vendorName = getValueLabel(vendor_id_name, VendorCatTypeDrop, "");

    if (vendor_id_name && asset_type_id_name) {
      return `${vendorName} - ( ${assetTypeName} ) -Sector Report`;
    }
    if (vendor_id_name) {
      return `${vendorName} - ${catTypeName} -Sector Report`;
    }
    if (asset_type_id_name) {
      return `Sector Wise ${catTypeName} (${assetTypeName}) Report`;
    }
    if (categoryType) {
      return `Sector Wise ${catTypeName} Report`;
    }
    return "Sector Wise Report";
  };

  useEffect(() => {
    setFilesName(getReportName()); // file name
  }, [categoryType, asset_type_id_name, vendor_id_name, AssetMainTypeDrop]);

  useEffect(() => {
    if (sectorData) {
      const totalQty = sectorData?.reduce(
        (acc, sector) => acc + Number(sector?.total) || 0,
        0
      );
      const totalRegister = sectorData?.reduce(
        (acc, sector) => acc + Number(sector?.registered) || 0,
        0
      );
      const monitoring = sectorData?.reduce(
        (acc, sector) => acc + Number(sector?.todaysmonitaring) || 0,
        0
      );
      const partially_compliant = sectorData?.reduce(
        (acc, sector) => acc + Number(sector?.partially_compliant) || 0,
        0
      );
      const compliant = sectorData?.reduce(
        (acc, sector) => acc + Number(sector?.compliant) || 0,
        0
      );
      const not_compliant = sectorData?.reduce(
        (acc, sector) => acc + Number(sector?.not_compliant) || 0,
        0
      );
      const toiletunclean = sectorData?.reduce(
        (acc, sector) => acc + Number(sector?.toiletunclean) || 0,
        0
      );
      const toiletclean = sectorData?.reduce(
        (acc, sector) => acc + Number(sector?.toiletclean) || 0,
        0
      );

      setTotalQuantity({
        totalQnty: totalQty,
        registered: totalRegister,
        monitoring: monitoring,
        partially_compliant: partially_compliant,
        compliant: compliant,
        not_compliant: not_compliant,
        toiletunclean: toiletunclean,
        toiletclean: toiletclean,
      });
    }
  }, [sectorData]);

  // current data
  const getCurrentData = () => {
    let newDate = dayjs().format("YYYY-MM-DD");
    form.setFieldsValue({
      date: dayjs(newDate, dateFormat),
      asset_main_type_id: "1",
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
      ...(userRoleId === "8" && {
        vendor_id: sessionData?.id,
      }),
    };
    callApi(finalValues);
  };

  useEffect(() => {
    getCurrentData(); // current data
    const assetMainTypeUrl = URLS?.assetMainTypePerPage?.path;
    dispatch(getAssetMainTypes(assetMainTypeUrl)); // asset main type
  }, []);

  // Create a reusable render function
  const renderColumn = (text, record) => {
    return (
      <span
        onClick={() => handleClick(record)}
        className="cursor-pointer hover:text-blue-500 hover:underline"
      >
        {text ? text : 0}
      </span>
    );
  };

  const columns = [
    {
      title: "Sector Name",
      dataIndex: "name",
      key: "name",
      width: 90,
      render: renderColumn,
      sorter: (a, b) => {
        const nameA = a?.name ? a?.name?.toString() : "";
        const nameB = b?.name ? b?.name?.toString() : "";
        return nameA?.localeCompare(nameB);
      },
    },
    {
      title: "Total Quantity",
      dataIndex: "total",
      key: "total",
      render: renderColumn,
      sorter: (a, b) => a?.total - b?.total,
      width: 50,
    },
    {
      title: "Registered",
      dataIndex: "registered",
      key: "registered",
      width: 50,
      render: renderColumn,
      sorter: (a, b) => a?.total - b?.total,
    },
    {
      title: "Monitoring",
      dataIndex: "todaysmonitaring",
      key: "todaysmonitaring",
      width: 50,
      render: renderColumn,
      sorter: (a, b) => a?.todaysmonitaring - b?.todaysmonitaring,
    },
    renderMonitoringSorting(
      "Monitoring (%)",
      "todaysmonitaring",
      "todaysmonitaring%"
    ),
    {
      title: "Partially Compliant",
      dataIndex: "partially_compliant",
      key: "partially_compliant",
      width: 50,
      render: renderColumn,
      sorter: (a, b) => a?.partially_compliant - b?.partially_compliant,
    },
    // renderSorting(
    //   "Partially Compliant (%)",
    //   "partially_compliant",
    //   "partially_compliant%"
    // ),
    {
      title: "Compliant",
      dataIndex: "compliant",
      key: "compliant",
      width: 50,
      render: renderColumn,
      sorter: (a, b) => a?.compliant - b?.compliant,
    },
    // renderSorting("Compliant (%)", "compliant", "compliant%"),
    {
      title: "Not Compliant",
      dataIndex: "not_compliant",
      key: "not_compliant",
      width: 50,
      render: renderColumn,
      sorter: (a, b) => a?.not_compliant - b?.not_compliant,
    },
    // renderSorting("Not Compliant (%)", "not_compliant", "not_compliant%"),
    {
      title: "Toilet Unclean",
      dataIndex: "toiletunclean",
      key: "toiletunclean",
      width: 50,
      render: renderColumn,
      sorter: (a, b) => a?.toiletunclean - b?.toiletunclean,
    },
    // renderSorting("Toilet Unclean (%)", "toiletunclean", "toiletunclean%"),
    {
      title: "Toilet Clean",
      dataIndex: "toiletclean",
      key: "toiletclean",
      width: 50,
      render: renderColumn,
      sorter: (a, b) => a?.toiletclean - b?.toiletclean,
    },
    // renderSorting("Toilet Clean (%)", "toiletclean", "toiletclean%"),
  ];

  const pdfHeader = [
    "Sr No",
    "Sector Name",
    "Total",
    "Registered",
    "Monitoring",
    "Monitoring (%)",
    "Partially Compliant",
    // "Partially Compliant%",
    "Compliant",
    // "Compliant%",
    "Not Compliant",
    // "Not Compliant%",
    "Toilet Unclean",
    // "Toilet Unclean%",
    "Toilet Clean",
    // "Toilet Clean%",
  ];

  // pdf data
  const pdfData = sectorData?.map((sector, index) => [
    index + 1,
    sector?.name,
    Number(sector?.total) || 0,
    Number(sector?.registered) || 0,
    Number(sector?.todaysmonitaring) || 0,
    getPercentage(
      Number(sector?.todaysmonitaring) || 0,
      Number(sector?.registered) || 1
    ) + " %",
    Number(sector?.partially_compliant) || 0,
    // getPercentage(
    //   Number(sector?.partially_compliant) || 0,
    //   (Number(sector?.toiletunclean) || 0) + (Number(sector?.toiletclean) || 0)
    // ) + " %",
    Number(sector?.compliant) || 0,
    // getPercentage(
    //   Number(sector?.compliant) || 0,
    //   (Number(sector?.toiletunclean) || 0) + (Number(sector?.toiletclean) || 0)
    // ) + " %",
    Number(sector?.not_compliant) || 0,
    // getPercentage(
    //   Number(sector?.not_compliant) || 0,
    //   (Number(sector?.toiletunclean) || 0) + (Number(sector?.toiletclean) || 0)
    // ) + " %",
    Number(sector?.toiletunclean) || 0,
    // getPercentage(
    //   Number(sector?.toiletunclean) || 0,
    //   (Number(sector?.toiletunclean) || 0) + (Number(sector?.toiletclean) || 0)
    // ) + " %",
    Number(sector?.toiletclean) || 0,
    // getPercentage(
    //   Number(sector?.toiletclean) || 0,
    //   (Number(sector?.toiletunclean) || 0) + (Number(sector?.toiletclean) || 0)
    // ) + " %",
  ]);

  // excel data
  const myexcelData = useMemo(() => {
    return sectorData?.map((data, index) => ({
      Sr: index + 1,
      Name: data?.name,
      Quantity: Number(data?.total),
      Registered: Number(data?.registered),
      Monitoring: Number(data?.todaysmonitaring) || 0,
      "Monitoring (%)":
        getPercentage(
          Number(data?.todaysmonitaring) || 0,
          Number(data?.registered) || 1
        ) + " %",
      "Partially Compliant": Number(data?.partially_compliant) || 0,
      // "Partially Compliant (%)":
      //   getPercentage(
      //     Number(data?.partially_compliant) || 0,
      //     (Number(data?.toiletunclean) || 0) + (Number(data?.toiletclean) || 0)
      //   ) + " %",
      Compliant: Number(data?.compliant) || 0,
      // "Compliant (%)":
      //   getPercentage(
      //     Number(data?.compliant) || 0,
      //     (Number(data?.toiletunclean) || 0) + (Number(data?.toiletclean) || 0)
      //   ) + " %",
      "Not Compliant": Number(data?.not_compliant) || 0,
      // "Not Compliant (%)":
      //   getPercentage(
      //     Number(data?.not_compliant) || 0,
      //     (Number(data?.toiletunclean) || 0) + (Number(data?.toiletclean) || 0)
      //   ) + " %",
      "Toilet Unclean": Number(data?.toiletunclean) || 0,
      // "Toilet Unclean (%)":
      //   getPercentage(
      //     Number(data?.toiletunclean) || 0,
      //     (Number(data?.toiletunclean) || 0) + (Number(data?.toiletclean) || 0)
      //   ) + " %",
      "Toilet Clean": Number(data?.toiletclean) || 0,
      // "Toilet Clean (%)":
      //   getPercentage(
      //     Number(data?.toiletclean) || 0,
      //     (Number(data?.toiletunclean) || 0) + (Number(data?.toiletclean) || 0)
      //   ) + " %",
    }));
  }, [sectorData]);

  const rowClassName = (record, index) => {
    return index === sectorData?.length
      ? "bg-green-100 text-black font-bold"
      : "";
  };

  const lastTableRow = [
    {
      name: sectorData?.length,
      total: totalQuantity?.totalQnty,
      registered: totalQuantity?.registered,
      todaysmonitaring: totalQuantity?.monitoring,
      partially_compliant: totalQuantity?.partially_compliant,
      compliant: totalQuantity?.compliant,
      not_compliant: totalQuantity?.not_compliant,
      toiletunclean: totalQuantity?.toiletunclean,
      toiletclean: totalQuantity?.toiletclean,
    },
  ];

  const lastTableModalRow = [
    {
      name: vendorsData?.length,
      total: count?.total,
      registered: count?.registered,
      todaysmonitaring: count?.monitoring,
      partially_compliant: count?.partially_compliant,
      compliant: count?.compliant,
      not_compliant: count?.not_compliant,
      toiletunclean: count?.toiletunclean,
      toiletclean: count?.toiletclean,
    },
  ];

  return (
    <div>
      <CommonDivider label={"Sector-Wise Report"} />
      <div className="flex justify-end gap-2 mb-4 font-semibold">
        <div>
          <ExportToPDF
            titleName={filesName ? filesName : `Sector-Wise Report`}
            pdfName={filesName ? filesName : `Sector-Wise-Report`}
            headerData={pdfHeader}
            IsLastLineBold={true}
            landscape={true}
            // applyTableStyles={true}
            // IsNoBold={true}
            rows={[
              ...pdfData,
              [
                "",
                "Total",
                totalQuantity?.totalQnty,
                totalQuantity?.registered,
                totalQuantity?.monitoring,
                "",
                totalQuantity?.partially_compliant,
                // "",
                totalQuantity?.compliant,
                // "",
                totalQuantity?.not_compliant,
                // "",
                totalQuantity?.toiletunclean,
                // "",
                totalQuantity?.toiletclean,
                // "",
              ],
            ]}
          />
        </div>
        <div>
          <ExportToExcel
            excelData={myexcelData || []}
            // fileName={filesName ? filesName : `Sector-Wise-Report`}
            fileName={
              filesName
                ? `${filesName} (${dayjs(formValue?.date).format(
                    "DD-MMM-YYYY"
                  )})`
                : `Vendor-Wise Report`
            }
            dynamicArray={[
              {
                name: "Total",
                value: totalQuantity?.totalQnty,
                colIndex: 3,
              },
              {
                name: "Register Unit",
                value: totalQuantity?.registered,
                colIndex: 4,
              },
              {
                name: "Monitoring",
                value: totalQuantity?.monitoring,
                colIndex: 5,
              },
              {
                name: "Partialy Compliant",
                value: totalQuantity?.partially_compliant,
                colIndex: 7,
              },
              {
                name: "Compliant",
                value: totalQuantity?.compliant,
                colIndex: 8,
              },
              {
                name: "Not Compliant",
                value: totalQuantity?.not_compliant,
                colIndex: 9,
              },
              {
                name: "Unclean",
                value: totalQuantity?.toiletunclean,
                colIndex: 10,
              },
              {
                name: "Clean",
                value: totalQuantity?.toiletclean,
                colIndex: 11,
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
                    {userRoleId != "8" && (
                      <Col key="vendor_id" xs={24} sm={12} md={6} lg={5}>
                        <CustomSelect
                          name={"vendor_id"}
                          label={"Select Vendor"}
                          placeholder={"Select Vendor"}
                          options={VendorCatTypeDrop || []}
                        />
                      </Col>
                    )}
                    <Col key="to_date" xs={24} sm={12} md={6} lg={5}>
                      <CustomDatepicker
                        name={"date"}
                        label={"Date"}
                        className="w-full"
                        placeholder={"Date"}
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
      </div>
      <Table
        loading={SectorReport_Loading || VendorReport_Loading}
        columns={columns}
        // dataSource={sectorData || []}
        dataSource={[...sectorData, ...lastTableRow] || []}
        rowKey="sector_id"
        pagination={{ pageSize: 30 }}
        // scroll={{ x: 2000, y: 400 }}
        bordered
        rowClassName={rowClassName}
      />

      {/* total quantity */}
      <ViewVendorsSectors
        width={1200}
        title={`Vendor Wise Report`}
        openModal={showModal && !VendorReport_Loading}
        handleCancel={handleCancel}
        tableData={[...vendorsData, ...lastTableModalRow] || []}
        // scroll={{ x: 1200, y: 400 }}
        tableHeaderData={[
          {
            label: "Sector Name",
            value: `${showModal?.name}`,
          },
        ]}
        column={VendorWiseReportcolumns || []}
        IsLastRowBold={true}
      />
    </div>
  );
};

export default SectorWiseReport;
