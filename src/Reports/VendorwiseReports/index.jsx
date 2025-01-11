import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { Table, Collapse, Form, Button, Row, Col } from "antd";
import moment from "moment";
import dayjs from "dayjs";

import CommonDivider from "../../commonComponents/CommonDivider";
import URLS from "../../urils/URLS";
import { getVendorCategoryTypeDrop, getVendorReports } from "./vendorslice";
import VendorSelectors from "./vendorSelectors";
import ExportToPDF from "../reportFile";
import ExportToExcel from "../ExportToExcel";
import AssetTypeSelectors from "../../register/AssetType/assetTypeSelectors";
import { getValueLabel } from "../../constant/const";
import { getFormData } from "../../urils/getFormData";
import {
  getAssetMainTypes,
  getAssetTypes,
} from "../../register/AssetType/AssetTypeSlice";
import CustomSelect from "../../commonComponents/CustomSelect";
import search from "../../assets/Dashboard/icon-search.png";
import CustomDatepicker from "../../commonComponents/CustomDatepicker";
import { getSectorsList } from "../../vendor-section-allocation/vendor-sector/Slice/vendorSectorSlice";
import VendorSectorSelectors from "../../vendor-section-allocation/vendor-sector/Slice/vendorSectorSelectors";
import ViewVendorsSectors from "../../register/AssetType/viewVendors";
import { getSectorReports } from "../SectorSlice/sectorSlice";
import SectorReportSelectors from "../SectorSlice/sectorSelector";

const VendorReports = () => {
  const [excelData, setExcelData] = useState([]);
  const [showModal, setShowModal] = useState(null);
  const [filesName, setFilesName] = useState(null); // files Name
  const [count, setCount] = useState({
    total: 0,
    registered: 0,
    monitoring: 0,
    partially_compliant: 0,
    compliant: 0,
    not_compliant: 0,
    toiletunclean: 0,
  });
  const [modalQuantity, setModalQuantity] = useState({
    total: 0,
    monitoring: 0,
    registered: 0,
    clean: 0,
    unclean: 0,
  });
  const [vendorDetails, setVendorDetails] = useState({
    list: [],
    pageLength: 25,
    currentPage: 1,
  });

  const dateFormat = "YYYY-MM-DD";
  const [form] = Form.useForm();
  const formValue = form.getFieldsValue();
  const dispatch = useDispatch();
  const { VendorReport_Loading, vendorReports, VendorCatTypeDrop } =
    VendorSelectors(); // vendor dropdown & Reports
  const vendorsData = vendorReports?.data?.vendors || [];
  const { SectorListDrop } = VendorSectorSelectors(); // all sector dropdown
  const { sectorData, SectorReport_Loading } = SectorReportSelectors(); // sector reports
  const { AssetMainTypeDrop, AssetTypeDrop } = AssetTypeSelectors(); // asset main type & asset type
  const categoryType = form.getFieldValue("asset_main_type_id");
  const asset_type_id_name = form.getFieldValue("asset_type_id");
  const vendor_id_name = form.getFieldValue("vendor_id");

  // close module
  const handleCancel = () => {
    setShowModal(null);
    setModalQuantity({
      total: 0,
      registered: 0,
      clean: 0,
      maintenance: 0,
      unclean: 0,
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
      ...(formValue?.sector_id && { sector_id: formValue?.sector_id }),
      vendor_id: record?.user_id,
      ...(formValue?.date && {
        date: dayjs(formValue?.date).format("YYYY-MM-DD"),
      }),
    };
    const url = URLS?.sector_wise_report?.path;
    dispatch(getSectorReports(url, finalValues)); // sector reports
    setShowModal(record);
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
      ...(values?.sector_id && { sector_id: values?.sector_id }),
      date: values?.date ? formattedDate : moment().format("YYYY-MM-DD"),
    };
    callApi(finalValues);
  };

  const callApi = async (data) => {
    const formData = await getFormData(data);
    const url = URLS?.vendorReporting?.path;
    dispatch(getVendorReports(url, formData)); // vendor reports
  };

  // current data
  const getCurrentData = () => {
    let newDate = dayjs().format("YYYY-MM-DD");
    const finalValues = {
      date: newDate,
      asset_main_type_id: "1",
    };
    callApi(finalValues);
    form.setFieldsValue({
      date: dayjs(newDate, dateFormat),
      asset_main_type_id: "1",
    });
    const url = URLS?.assetType?.path + "1";
    const paramData = {
      asset_main_type_id: 1,
    };
    dispatch(getVendorCategoryTypeDrop(paramData)); // vendor list
    dispatch(getAssetTypes(url)); // get assset type
  };

  // reset form
  const resetForm = () => {
    form.resetFields();
    form.setFieldsValue({
      asset_type_id: null,
    });
    getCurrentData();
    setFilesName(null);
  };

  // table quantity
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

      setCount({
        total: total,
        registered: totalReg,
        monitoring: totalMonitoring,
        partially_compliant: partially_compliant,
        compliant: compliant,
        not_compliant: not_compliant,
        toiletunclean: toiletunclean,
      });
    }
  }, [vendorReports]);

  // modal quantity
  useEffect(() => {
    if (sectorData) {
      const totalQty = sectorData?.reduce(
        (acc, sector) => acc + Number(sector?.total),
        0
      );
      const totalRegister = sectorData?.reduce(
        (acc, sector) => acc + Number(sector?.registered),
        0
      );
      const totalClean = sectorData?.reduce(
        (acc, sector) => acc + Number(sector?.clean),
        0
      );
      const totalUnclean = sectorData?.reduce(
        (acc, sector) => acc + Number(sector?.unclean),
        0
      );
      const monitaring = sectorData?.reduce(
        (acc, sector) => acc + Number(sector?.todaysmonitaring),
        0
      );
      setModalQuantity({
        totalQnty: totalQty,
        monitoring: monitaring,
        registered: totalRegister,
        clean: totalClean,
        unclean: totalUnclean,
      });
    }
  }, [sectorData]);

  // file name
  const getReportName = () => {
    const catTypeName = getValueLabel(categoryType, AssetMainTypeDrop, "");
    const assetTypeName = getValueLabel(asset_type_id_name, AssetTypeDrop, "");
    const vendorName = getValueLabel(vendor_id_name, VendorCatTypeDrop, "");

    if (vendor_id_name && asset_type_id_name) {
      return `${vendorName} - ${assetTypeName} Report`;
    }
    if (vendor_id_name) {
      return `${vendorName} - ${catTypeName} Report`;
    }
    if (asset_type_id_name) {
      return `Vendor Wise ${catTypeName} (${assetTypeName}) Report`;
    }
    if (categoryType) {
      return `Vendor Wise ${catTypeName} Report`;
    }
    return "Vendor Wise Report";
  };

  useEffect(() => {
    setFilesName(getReportName()); // file name
  }, [categoryType, asset_type_id_name, vendor_id_name, AssetMainTypeDrop]);

  useEffect(() => {
    getCurrentData(); // current data
    const assetMainTypeUrl = URLS?.assetMainTypePerPage?.path;
    dispatch(getAssetMainTypes(assetMainTypeUrl)); // asset main type
    dispatch(getSectorsList()); // all sectors
    return () => {};
  }, []);

  useEffect(() => {
    if (vendorReports) {
      setVendorDetails((prevDetails) => ({
        ...prevDetails,
        list: vendorReports?.data?.vendors || [],
        pageLength: vendorReports?.data?.paging?.[0]?.length || 0,
        currentPage: vendorReports?.data?.paging?.[0]?.currentpage || 1,
        totalRecords: vendorReports?.data?.paging?.[0]?.totalrecords || 0,
      }));

      const myexcelData = vendorReports?.data?.vendors?.map((data, index) => {
        return {
          Sr: index + 1,
          Name: data?.name,
          Total: Number(data?.total) || 0,
          Registered: Number(data?.registered) || 0,
          Monitoring: Number(data?.todaysmonitaring) || 0,
          Compliant: Number(data?.compliant) || 0,
          "Partially Compliant": Number(data?.partially_compliant) || 0,
          "Not Compliant": Number(data?.not_compliant) || 0,
          "Toilet Unclean": Number(data?.toiletunclean) || 0,
        };
      });
      setExcelData(myexcelData);
    }
  }, [vendorReports]);

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

  const VendorWiseReportcolumn = [
    {
      title: "Vendor Name",
      dataIndex: "name",
      key: "name",
      width: 350,
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
      width: 50,
      render: renderColumn,
      sorter: (a, b) => a?.total - b?.total,
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
    {
      title: "Partially Compliant",
      dataIndex: "partially_compliant",
      key: "partially_compliant",
      width: 50,
      render: renderColumn,
      sorter: (a, b) => a?.partially_compliant - b?.partially_compliant,
    },
    {
      title: "Compliant",
      dataIndex: "compliant",
      key: "compliant",
      width: 50,
      render: renderColumn,
      sorter: (a, b) => a?.compliant - b?.compliant,
    },
    {
      title: "Not Compliant",
      dataIndex: "not_compliant",
      key: "not_compliant",
      width: 50,
      render: renderColumn,
      sorter: (a, b) => a?.not_compliant - b?.not_compliant,
    },
    {
      title: "Toilet Unclean",
      dataIndex: "toiletunclean",
      key: "toiletunclean",
      width: 50,
      render: renderColumn,
      sorter: (a, b) => a?.toiletunclean - b?.toiletunclean,
    },
  ];

  // Modal columns
  const columns = [
    {
      title: "Sector Name",
      dataIndex: "name",
      key: "name",
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
      sorter: (a, b) => a?.total - b?.total,
    },
    {
      title: "Total Registered",
      dataIndex: "registered",
      key: "registered",
      sorter: (a, b) => a?.registered - b?.registered,
    },
    {
      title: "Monitoring",
      dataIndex: "todaysmonitaring",
      key: "todaysmonitaring",
      sorter: (a, b) => a?.todaysmonitaring - b?.todaysmonitaring,
    },
    {
      title: "Clean",
      dataIndex: "clean",
      key: "clean",
      sorter: (a, b) => a?.clean - b?.clean,
    },
    {
      title: "Unclean",
      dataIndex: "unclean",
      key: "unclean",
      sorter: (a, b) => a?.unclean - b?.unclean,
    },
  ];

  // pdf header
  const pdfHeader = [
    "Sr No",
    "Vendor Name",
    "Total",
    "Registered",
    "Monitoring",
    "Compliant",
    "Partially Compliant",
    "Not Compliant",
    "Toilet Unclean",
  ];

  // pdf data
  const pdfData = useMemo(() => {
    return (
      excelData?.map((opt) => [
        opt?.Sr,
        opt?.Name,
        opt?.Total,
        opt?.Registered,
        opt?.Monitoring,
        opt?.Compliant,
        opt?.["Partially Compliant"],
        opt?.["Not Compliant"],
        opt?.["Toilet Unclean"],
      ]) || []
    );
  }, [excelData]);

  const rowClassName = (record, index) => {
    return index === vendorDetails?.list?.length
      ? "bg-green-100 text-black font-bold"
      : "";
  };

  const lastTableRow = [
    {
      name: vendorsData?.length,
      total: count?.total,
      registered: count?.registered,
      todaysmonitaring: count?.monitoring,
      partially_compliant: count?.partially_compliant,
      compliant: count?.compliant,
      not_compliant: count?.not_compliant,
      toiletunclean: count?.toiletunclean,
    },
  ];

  const lastTableModalRow = [
    {
      name: sectorData?.length,
      total: modalQuantity?.totalQnty,
      registered: modalQuantity?.registered,
      todaysmonitaring: modalQuantity?.monitoring,
      // partially_compliant: modalQuantity?.partially_compliant,
      // compliant: modalQuantity?.compliant,
      // not_compliant: modalQuantity?.not_compliant,
      // toiletunclean: modalQuantity?.toiletunclean,
      clean: modalQuantity?.clean,
      unclean: modalQuantity?.unclean,
    },
  ];

  return (
    <div>
      <CommonDivider label={"Vendor-Wise Report"} />
      <div className="flex justify-end gap-2 mb-4 font-semibold">
        <div>
          <ExportToPDF
            titleName={filesName ? filesName : `Vendor-Wise Report`}
            pdfName={filesName ? filesName : `Vendor-Wise-Report`}
            headerData={pdfHeader}
            IsLastLineBold={true}
            landscape={true}
            rows={[
              ...pdfData,
              [
                "",
                "Total",
                count?.total,
                count?.registered,
                count?.monitoring,
                count?.compliant,
                count?.partially_compliant,
                count?.not_compliant,
                count?.toiletunclean,
              ],
            ]}
          />
        </div>
        <div>
          <ExportToExcel
            excelData={excelData || []}
            fileName={filesName ? filesName : `Vendor-Wise Report`}
            dynamicArray={[
              {
                name: "Total",
                value: count?.total,
                colIndex: 3,
              },
              {
                name: "Register Unit",
                value: count?.registered,
                colIndex: 4,
              },
              {
                name: "Monitoring",
                value: count?.monitoring,
                colIndex: 5,
              },
              {
                name: "Compliant",
                value: count?.compliant,
                colIndex: 6,
              },
              {
                name: "Partialy Compliant",
                value: count?.partially_compliant,
                colIndex: 7,
              },
              {
                name: "Not Compliant",
                value: count?.not_compliant,
                colIndex: 8,
              },
              {
                name: "Unclean",
                value: count?.toiletunclean,
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
                    <Col key="vendor_id" xs={24} sm={12} md={6} lg={5}>
                      <CustomSelect
                        name={"vendor_id"}
                        label={"Select Vendor"}
                        placeholder={"Select Vendor"}
                        options={VendorCatTypeDrop || []}
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
                          loading={VendorReport_Loading}
                          type="button"
                          htmlType="submit"
                          className="w-fit rounded-none text-white bg-blue-500 hover:bg-blue-600"
                        >
                          Search
                        </Button>
                      </div>
                      <div>
                        <Button
                          loading={VendorReport_Loading}
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
        loading={VendorReport_Loading || SectorReport_Loading}
        columns={VendorWiseReportcolumn || []}
        dataSource={[...vendorDetails?.list, ...lastTableRow] || []}
        rowKey="sector_id"
        pagination={{ pageSize: 50 }}
        rowClassName={rowClassName}
        bordered
        // footer={() => (
        //   <div className="flex justify-between">
        //     <strong>Vendors: {vendorsData?.length}</strong>
        //     <strong>Total: {count?.total || 0}</strong>
        //     <strong>Registered: {count?.registered || 0}</strong>
        //     <strong>Monitoring : {count?.monitoring || 0}</strong>
        //     <strong>
        //       Partialy Compliant : {count?.partially_compliant || 0}
        //     </strong>
        //     <strong>Compliant : {count?.compliant || 0}</strong>
        //     <strong>Not Compliant: {count?.not_compliant || 0}</strong>
        //     <strong>Unclean: {count?.toiletunclean || 0}</strong>
        //   </div>
        // )}
      />

      {/* total quantity */}
      <ViewVendorsSectors
        width={900}
        title={`Sector Wise Report`}
        openModal={showModal && !SectorReport_Loading}
        handleCancel={handleCancel}
        // tableData={sectorData || []}
        tableData={[...sectorData, ...lastTableModalRow] || []}
        tableHeaderData={[
          {
            label: "Vendor Name",
            value: `${showModal?.name}`,
          },
        ]}
        column={columns || []}
        IsLastRowBold={true}
        // footer={() => (
        //   <div className="flex justify-between">
        //     <strong>Total Sectors: {sectorData?.length}</strong>
        //     <strong>Total Quantity: {modalQuantity?.totalQnty}</strong>
        //     <strong>Total Register: {modalQuantity?.registered}</strong>
        //     <strong>Total Monitoring: {modalQuantity?.monitoring}</strong>
        //     <strong>Total Clean: {modalQuantity?.clean}</strong>
        //     <strong>Total Unclean: {modalQuantity?.unclean}</strong>
        //   </div>
        // )}
      />
    </div>
  );
};

export default VendorReports;
