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
import { getValueLabel, VendorWiseReportcolumns } from "../constant/const";
import CustomDatepicker from "../commonComponents/CustomDatepicker";
import {
  getVendorCategoryTypeDrop,
  getVendorReports,
} from "./VendorwiseReports/vendorslice";
import VendorSelectors from "./VendorwiseReports/vendorSelectors";
import ViewVendorsSectors from "../register/AssetType/viewVendors";

const SectorWiseReport = () => {
  const [totalQuantity, setTotalQuantity] = useState({
    totalQnty: 0,
    registered: 0,
    clean: 0,
    unclean: 0,
    monitoring: 0,
    total: 0,
    partially_compliant: 0,
    compliant: 0,
    not_compliant: 0,
    toiletclean: 0,
  });
  const [filesName, setFilesName] = useState(null); // files Name
  const [count, setCount] = useState({
    total: 0,
    registered: 0,
    monitoring: 0,
    partially_compliant: 0,
    compliant: 0,
    not_compliant: 0,
    toiletclean: 0,
  });
  const [showModal, setShowModal] = useState(null);

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
      toiletclean: 0,
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
      const totalClean = sectorData?.reduce(
        (acc, sector) => acc + Number(sector?.clean) || 0,
        0
      );
      const totalUnclean = sectorData?.reduce(
        (acc, sector) => acc + Number(sector?.unclean) || 0,
        0
      );
      const monitoring = sectorData?.reduce(
        (acc, sector) => acc + Number(sector?.todaysmonitaring) || 0,
        0
      );
      setTotalQuantity({
        totalQnty: totalQty,
        registered: totalRegister,
        clean: totalClean,
        unclean: totalUnclean,
        monitoring: monitoring,
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
    return <span onClick={() => handleClick(record)}>{text ? text : ""}</span>;
  };

  const columns = [
    {
      title: "Sector Name",
      dataIndex: "name",
      key: "name",
      render: renderColumn, // Reuse the render function
    },
    {
      title: "Total Quantity",
      dataIndex: "total",
      key: "total",
      render: renderColumn,
    },
    {
      title: "Total Registered",
      dataIndex: "registered",
      key: "registered",
      render: renderColumn,
    },
    {
      title: "Monitoring",
      dataIndex: "todaysmonitaring",
      key: "todaysmonitaring",
      render: renderColumn,
    },
    {
      title: "Partially Compliant",
      dataIndex: "partially_compliant",
      key: "partially_compliant",
      width: 50,
      render: renderColumn, // Reuse the render function
    },
    {
      title: "Compliant",
      dataIndex: "compliant",
      key: "compliant",
      width: 50,
      render: renderColumn, // Reuse the render function
    },
    {
      title: "Not Compliant",
      dataIndex: "not_compliant",
      key: "not_compliant",
      width: 50,
      render: renderColumn, // Reuse the render function
    },
    {
      title: "Toilet Clean",
      dataIndex: "toiletclean",
      key: "toiletclean",
      width: 50,
      render: renderColumn, // Reuse the render function
    },
  ];

  // pdf header
  const pdfHeader = [
    "Sr No",
    "Sector Name",
    "Total",
    "Registered",
    "Monitoring",
    "Partially Compliant",
    "Compliant",
    "Not Compliant",
    "Toilet Clean",
  ];

  // pdf data
  const pdfData = sectorData?.map((sector, index) => [
    index + 1,
    sector?.name,
    Number(sector?.total) || 0,
    Number(sector?.registered) || 0,
    Number(sector?.todaysmonitaring) || 0,
    Number(sector?.partially_compliant) || 0,
    Number(sector?.compliant) || 0,
    Number(sector?.not_compliant) || 0,
    Number(sector?.toiletclean) || 0,
  ]);

  // excel data
  const myexcelData = useMemo(() => {
    return sectorData?.map((data, index) => ({
      Sr: index + 1,
      Name: data?.name,
      Quantity: Number(data?.total),
      Registered: Number(data?.registered),
      Monitoring: Number(data?.todaysmonitaring) || 0,
      "Partially Compliant": Number(data?.partially_compliant) || 0,
      Compliant: Number(data?.compliant) || 0,
      "Not Compliant": Number(data?.not_compliant) || 0,
      "Toilet Clean": Number(data?.toiletclean) || 0,
    }));
  }, [sectorData]);

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
            IsNoBold={true}
            rows={[
              ...pdfData,
              [
                "",
                "Total",
                totalQuantity?.totalQnty,
                totalQuantity?.registered,
                totalQuantity?.monitoring,
                totalQuantity?.partially_compliant,
                totalQuantity?.compliant,
                totalQuantity?.not_compliant,
                totalQuantity?.toiletclean,
              ],
            ]}
          />
        </div>
        <div>
          <ExportToExcel
            excelData={myexcelData || []}
            fileName={filesName ? filesName : `Sector-Wise-Report`}
            dynamicArray={[
              {
                name: "Total",
                value: totalQuantity?.total,
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
                colIndex: 6,
              },
              {
                name: "Compliant",
                value: totalQuantity?.compliant,
                colIndex: 7,
              },
              {
                name: "Not Compliant",
                value: totalQuantity?.not_compliant,
                colIndex: 8,
              },
              {
                name: "Clean",
                value: totalQuantity?.toiletclean,
                colIndex: 9,
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
        dataSource={sectorData || []}
        rowKey="sector_id"
        pagination={{ pageSize: 30 }}
        bordered
        footer={() => (
          <div className="flex justify-between">
            <strong>Vendors: {sectorData?.length}</strong>
            <strong>Total: {totalQuantity?.total || 0}</strong>
            <strong>Registered: {totalQuantity?.registered || 0}</strong>
            <strong>Monitoring : {totalQuantity?.monitoring || 0}</strong>
            <strong>
              Partialy Compliant : {totalQuantity?.partially_compliant || 0}
            </strong>
            <strong>Compliant : {totalQuantity?.compliant || 0}</strong>
            <strong>Not Compliant: {totalQuantity?.not_compliant || 0}</strong>
            <strong>Clean: {totalQuantity?.toiletclean || 0}</strong>
          </div>
        )}
      />

      {/* total quantity */}
      <ViewVendorsSectors
        width={1200}
        title={`Vendor Wise Report`}
        openModal={showModal && !VendorReport_Loading}
        handleCancel={handleCancel}
        tableData={vendorsData || []}
        tableHeaderData={[
          {
            label: "Sector Name",
            value: `${showModal?.name}`,
          },
        ]}
        column={VendorWiseReportcolumns || []}
        footer={() => (
          <div className="flex justify-between">
            <strong>Vendors: {vendorsData?.length}</strong>
            <strong>Total: {count?.total || 0}</strong>
            <strong>Monitoring : {count?.monitoring || 0}</strong>
            <strong>Registered: {count?.registered || 0}</strong>
            <strong>
              Partialy Compliant : {count?.partially_compliant || 0}
            </strong>
            <strong>Compliant : {count?.compliant || 0}</strong>
            <strong>Not Compliant: {count?.not_compliant || 0}</strong>
            <strong>Clean: {count?.toiletclean || 0}</strong>
          </div>
        )}
      />
    </div>
  );
};

export default SectorWiseReport;
