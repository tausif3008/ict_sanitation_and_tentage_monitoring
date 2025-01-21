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
import {
  fiveTypes,
  getValueLabel,
  OrderBy,
  renderMonitoringSorting,
  renderSorting,
} from "../../constant/const";
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
  const [showTypeOption, setShowTypeOption] = useState(null);
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
  const [modalQuantity, setModalQuantity] = useState({
    total: 0,
    registered: 0,
    todaysmonitaring: 0,
    partially_compliant: 0,
    compliant: 0,
    not_compliant: 0,
    toiletunclean: 0,
    toiletclean: 0,
  });
  const [vendorDetails, setVendorDetails] = useState({
    list: [],
    pageLength: 25,
    currentPage: 1,
  });
  const vendorRemoveArray = ["132", "141", "148"];

  const dateFormat = "YYYY-MM-DD";
  const [form] = Form.useForm();
  const formValue = form.getFieldsValue();
  const dispatch = useDispatch();
  const { VendorReport_Loading, vendorReports, VendorCatTypeDrop } =
    VendorSelectors(); // vendor dropdown & Reports
  const { SectorListDrop } = VendorSectorSelectors(); // all sector dropdown
  const { sectorData, SectorReport_Loading } = SectorReportSelectors(); // sector reports
  const { AssetMainTypeDrop, AssetTypeDrop } = AssetTypeSelectors(); // asset main type & asset type

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
  const vendorName = getValueLabel(
    formValue?.vendor_id,
    VendorCatTypeDrop,
    null
  );
  const sectorName = getValueLabel(formValue?.sector_id, SectorListDrop, null);
  const orderByName = getValueLabel(formValue?.order_by, OrderBy, null);
  const fiveTypeIdName = getValueLabel(
    formValue?.asset_type_ids,
    fiveTypes,
    null
  );

  const pdfTitleData = {
    type: formValue?.asset_type_ids ? "Type 1 to Type 5" : "All Asset Types",
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
    {
      label: `Type : ${assetTypeName || pdfTitleData?.type || "Combined"}`,
    },
    ...(formValue?.sector_id
      ? [
          {
            label: `Sector Name : ${sectorName || "Combined"}`,
          },
        ]
      : []),
    {
      label: `Sort By : ${orderByName || "Combined"}`,
    },
  ];

  // close module
  const handleCancel = () => {
    setShowModal(null);
    setModalQuantity({
      total: 0,
      registered: 0,
      todaysmonitaring: 0,
      partially_compliant: 0,
      compliant: 0,
      not_compliant: 0,
      toiletunclean: 0,
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
      asset_type_ids: null,
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
      ...(values?.order_by && { order_by: values?.order_by }),
      ...(values?.asset_type_ids && { asset_type_ids: values?.asset_type_ids }),
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
      order_by: "monitaring_per",
    };
    callApi(finalValues);
    form.setFieldsValue({
      date: dayjs(newDate, dateFormat),
      asset_main_type_id: "1",
      order_by: "monitaring_per",
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
    if (vendorDetails?.list) {
      const total = vendorDetails?.list?.reduce(
        (acc, circle) => acc + Number(circle?.total),
        0
      );
      const totalReg = vendorDetails?.list?.reduce(
        (acc, circle) => acc + Number(circle?.registered),
        0
      );
      const totalMonitoring = vendorDetails?.list?.reduce(
        (acc, circle) => acc + Number(circle?.todaysmonitaring) || 0,
        0
      );
      const partially_compliant = vendorDetails?.list?.reduce(
        (acc, circle) => acc + Number(circle?.partially_compliant) || 0,
        0
      );
      const compliant = vendorDetails?.list?.reduce(
        (acc, circle) => acc + Number(circle?.compliant) || 0,
        0
      );
      const not_compliant = vendorDetails?.list?.reduce(
        (acc, circle) => acc + Number(circle?.not_compliant) || 0,
        0
      );
      const toiletunclean = vendorDetails?.list?.reduce(
        (acc, circle) => acc + Number(circle?.toiletunclean) || 0,
        0
      );
      const toiletclean = vendorDetails?.list?.reduce(
        (acc, circle) => acc + Number(circle?.toiletclean) || 0,
        0
      );

      setCount({
        total: total,
        registered: totalReg,
        todaysmonitaring: totalMonitoring,
        partially_compliant: partially_compliant,
        compliant: compliant,
        not_compliant: not_compliant,
        toiletunclean: toiletunclean,
        toiletclean: toiletclean,
      });
    }
  }, [vendorDetails?.list]);

  // modal quantity
  useEffect(() => {
    if (sectorData) {
      const totalQty = sectorData?.reduce(
        (acc, sector) => acc + Number(sector?.total),
        0
      );
      const registered = sectorData?.reduce(
        (acc, sector) => acc + Number(sector?.registered),
        0
      );
      const todaysmonitaring = sectorData?.reduce(
        (acc, sector) => acc + Number(sector?.todaysmonitaring),
        0
      );
      const partially_compliant = sectorData?.reduce(
        (acc, sector) => acc + Number(sector?.partially_compliant),
        0
      );
      const compliant = sectorData?.reduce(
        (acc, sector) => acc + Number(sector?.compliant),
        0
      );
      const not_compliant = sectorData?.reduce(
        (acc, sector) => acc + Number(sector?.not_compliant),
        0
      );
      const toiletunclean = sectorData?.reduce(
        (acc, sector) => acc + Number(sector?.toiletunclean),
        0
      );
      const toiletclean = sectorData?.reduce(
        (acc, sector) => acc + Number(sector?.toiletclean),
        0
      );
      setModalQuantity({
        total: totalQty,
        registered: registered,
        todaysmonitaring: todaysmonitaring,
        partially_compliant: partially_compliant,
        compliant: compliant,
        not_compliant: not_compliant,
        toiletunclean: toiletunclean,
        toiletclean: toiletclean,
      });
    }
  }, [sectorData]);

  // file name
  const getReportName = () => {
    let name = "Vendor Wise";
    if (vendorName) {
      name = `${vendorName}`;
    }
    if (catTypeName) {
      name += `- ${catTypeName}`;
    }
    if (assetTypeName) {
      name += `- ${assetTypeName}`;
    }
    if (fiveTypeIdName) {
      name += `- ${fiveTypeIdName}`;
    }
    if (sectorName) {
      name += `- ${sectorName}`;
    }
    if (orderByName) {
      name += `- ${orderByName}`;
    }
    name += ` (${dayjs(formValue?.date).format("DD-MMM-YYYY")})`;
    return name;
  };

  useEffect(() => {
    setFilesName(getReportName()); // file name
  }, [formValue]);

  useEffect(() => {
    getCurrentData(); // current data
    const assetMainTypeUrl = URLS?.assetMainTypePerPage?.path;
    dispatch(getAssetMainTypes(assetMainTypeUrl)); // asset main type
    dispatch(getSectorsList()); // all sectors
    return () => {};
  }, []);

  useEffect(() => {
    if (vendorReports) {
      const myFilterArray =
        vendorReports?.data?.vendors?.filter(
          (item) => !vendorRemoveArray.includes(item?.user_id)
        ) || [];
      setVendorDetails((prevDetails) => ({
        ...prevDetails,
        list: myFilterArray || [],
        pageLength: vendorReports?.data?.paging?.[0]?.length || 0,
        currentPage: vendorReports?.data?.paging?.[0]?.currentpage || 1,
        totalRecords: vendorReports?.data?.paging?.[0]?.totalrecords || 0,
      }));

      const myexcelData = myFilterArray?.map((data, index) => {
        return {
          Sr: index + 1,
          Name: data?.name,
          Total: Number(data?.total) || 0,
          Registered: Number(data?.registered) || 0,
          Monitoring: Number(data?.todaysmonitaring) || 0,
          "Monitoring (%)":
            data?.monitaring_per != null
              ? `${Math.round(Number(data?.monitaring_per) || 0)}%`
              : "00%",
          Compliant: Number(data?.compliant) || 0,
          "Partially Compliant": Number(data?.partially_compliant) || 0,
          "Not Compliant": Number(data?.not_compliant) || 0,
          "Not Compliant (%)":
            data?.not_compliant_per != null
              ? `${Math.round(Number(data?.not_compliant_per) || 0)}%`
              : "00%",
          "Toilet Unclean": Number(data?.toiletunclean) || 0,
          "Toilet Unclean (%)":
            data?.toiletunclean_per != null
              ? `${Math.round(Number(data?.toiletunclean_per) || 0)}%`
              : "00%",
          "Toilet Clean": Number(data?.toiletclean) || 0,
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

  // table column
  const VendorWiseReportcolumn = [
    {
      title: "Vendor Name",
      dataIndex: "name",
      key: "name",
      width: 250,
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
      title: "Monitoring (%)",
      dataIndex: "monitaring_per",
      key: "monitaring_per",
      width: 50,
      render: (text, record) => {
        const roundedText = text ? `${Math.round(text)}%` : "00";
        return renderColumn(roundedText, record);
      },
      sorter: (a, b) => a?.monitaring_per - b?.monitaring_per,
    },
    ,
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
      title: "Not Compliant (%)",
      dataIndex: "not_compliant_per",
      key: "not_compliant_per",
      width: 50,
      render: (text, record) => {
        const roundedText = text ? `${Math.round(text)}%` : "00";
        return renderColumn(roundedText, record);
      },
      sorter: (a, b) => a?.not_compliant_per - b?.not_compliant_per,
    },
    {
      title: "Toilet Unclean",
      dataIndex: "toiletunclean",
      key: "toiletunclean",
      width: 50,
      render: renderColumn,
      sorter: (a, b) => a?.toiletunclean - b?.toiletunclean,
    },
    {
      title: "Toilet Unclean (%)",
      dataIndex: "toiletunclean_per",
      key: "toiletunclean_per",
      width: 50,
      render: (text, record) => {
        const roundedText = text ? `${Math.round(text)}%` : "00";
        return renderColumn(roundedText, record);
      },
      sorter: (a, b) => a?.toiletunclean_per - b?.toiletunclean_per,
    },
    {
      title: "Toilet Clean",
      dataIndex: "toiletclean",
      key: "toiletclean",
      width: 50,
      render: renderColumn,
      sorter: (a, b) => a?.toiletclean - b?.toiletclean,
    },
  ];

  // Modal columns
  const columns = [
    {
      title: "Sector Name",
      dataIndex: "name",
      key: "name",
      width: 90,
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
      width: 50,
    },
    {
      title: "Registered",
      dataIndex: "registered",
      key: "registered",
      width: 50,
      sorter: (a, b) => a?.total - b?.total,
    },
    {
      title: "Monitoring",
      dataIndex: "todaysmonitaring",
      key: "todaysmonitaring",
      width: 50,
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
      sorter: (a, b) => a?.partially_compliant - b?.partially_compliant,
    },
    {
      title: "Compliant",
      dataIndex: "compliant",
      key: "compliant",
      width: 50,
      sorter: (a, b) => a?.compliant - b?.compliant,
    },
    {
      title: "Not Compliant",
      dataIndex: "not_compliant",
      key: "not_compliant",
      width: 50,
      sorter: (a, b) => a?.not_compliant - b?.not_compliant,
    },
    renderSorting("Not Compliant (%)", "not_compliant", "not_compliant%"),
    {
      title: "Toilet Unclean",
      dataIndex: "toiletunclean",
      key: "toiletunclean",
      width: 50,
      sorter: (a, b) => a?.toiletunclean - b?.toiletunclean,
    },
    renderSorting("Toilet Unclean (%)", "toiletunclean", "toiletunclean%"),
    {
      title: "Toilet Clean",
      dataIndex: "toiletclean",
      key: "toiletclean",
      width: 50,
      sorter: (a, b) => a?.toiletclean - b?.toiletclean,
    },
  ];

  // pdf header
  const pdfHeader = [
    "Sr No",
    "Vendor Name",
    "Total",
    "Registered",
    "Monitoring",
    "Monitoring (%)",
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
        opt?.Total,
        opt?.Registered,
        opt?.Monitoring,
        opt?.["Monitoring (%)"],
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

  return (
    <div>
      <CommonDivider label={"Vendor-Wise Report"} />
      <div className="flex justify-end gap-2 mb-4 font-semibold">
        <div>
          <ExportToPDF
            titleName={`Vendor-Wise Report`}
            // titleName={filesName ? filesName : `Vendor-Wise Report`}
            pdfName={filesName ? filesName : `Vendor-Wise Report`}
            headerData={pdfHeader}
            IsLastLineBold={true}
            landscape={true}
            tableTitles={pdfTitleParam || []}
            columnProperties={
              formValue?.order_by === "monitaring_per" ? [5] : []
            } // 6 columns
            redToGreenProperties={
              formValue?.order_by === "not_compliant_per"
                ? [9]
                : formValue?.order_by === "toiletunclean_per"
                ? [11]
                : []
            } // 10, 12 columns  100 to 0
            rows={[
              ...pdfData,
              [
                "",
                "Total",
                count?.total,
                count?.registered,
                count?.todaysmonitaring,
                "",
                count?.compliant,
                // "",
                count?.partially_compliant,
                // "",
                count?.not_compliant,
                "",
                count?.toiletunclean,
                "",
                count?.toiletclean,
                // "",
              ],
            ]}
          />
        </div>
        <div>
          <ExportToExcel
            excelData={excelData || []}
            columnProperties={
              formValue?.order_by === "monitaring_per" ? [6] : []
            } // 6 columns
            redToGreenProperties={
              formValue?.order_by === "not_compliant_per"
                ? [10]
                : formValue?.order_by === "toiletunclean_per"
                ? [12]
                : []
            }
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
                value: count?.todaysmonitaring,
                colIndex: 5,
              },
              {
                name: "Compliant",
                value: count?.compliant,
                colIndex: 7,
              },
              {
                name: "Partialy Compliant",
                value: count?.partially_compliant,
                colIndex: 8,
              },
              {
                name: "Not Compliant",
                value: count?.not_compliant,
                colIndex: 9,
              },
              {
                name: "Unclean",
                value: count?.toiletunclean,
                colIndex: 11,
              },
              {
                name: "Clean",
                value: count?.toiletclean,
                colIndex: 13,
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
                  <Row gutter={[16, 0]} align="middle">
                    <Col key="asset_main_type_id" xs={24} sm={12} md={6} lg={5}>
                      <CustomSelect
                        name={"asset_main_type_id"}
                        allowClear={false}
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
                        onChange={(value) => {
                          setShowTypeOption(value);
                        }}
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
                    <Col key="date" xs={24} sm={12} md={6} lg={5}>
                      <CustomDatepicker
                        name={"date"}
                        label={"Date"}
                        className="w-full"
                        placeholder={"Date"}
                      />
                    </Col>
                    <Col key="order_by" xs={24} sm={12} md={6} lg={5}>
                      <CustomSelect
                        name={"order_by"}
                        label={"Order By"}
                        allowClear={false}
                        placeholder={"Select Order By"}
                        options={OrderBy || []}
                      />
                    </Col>
                    {formValue?.asset_main_type_id === "1" &&
                      !showTypeOption && (
                        <Col key="asset_type_ids" xs={24} sm={12} md={6} lg={5}>
                          <CustomSelect
                            name={"asset_type_ids"}
                            label={"Select Type"}
                            placeholder={"Select Type"}
                            options={fiveTypes || []}
                          />
                        </Col>
                      )}
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
        dataSource={vendorDetails?.list || []}
        rowKey="sector_id"
        pagination={{ pageSize: 50 }}
        scroll={{ x: 1800, y: 400 }}
        bordered
        footer={() => (
          <div className="flex justify-between">
            <strong>Total Quantity: {count?.total || 0}</strong>
            <strong>Registered: {count?.registered || 0}</strong>
            <strong>Monitoring: {count?.todaysmonitaring || 0}</strong>
            <strong>
              Partially Compliant: {count?.partially_compliant || 0}
            </strong>
            <strong>Compliant : {count?.compliant || 0}</strong>
            <strong>Not Compliant : {count?.not_compliant || 0}</strong>
            <strong>Toilet Unclean : {count?.toiletunclean || 0}</strong>
            <strong>Toilet Clean : {count?.toiletclean || 0}</strong>
          </div>
        )}
      />

      {/* total quantity */}
      <ViewVendorsSectors
        width={1200}
        title={`Sector Wise Report`}
        openModal={showModal && !SectorReport_Loading}
        handleCancel={handleCancel}
        tableData={sectorData || []}
        tableHeaderData={[
          {
            label: "Vendor Name",
            value: `${showModal?.name}`,
          },
        ]}
        column={columns || []}
        footer={() => (
          <div className="flex justify-between">
            <strong>Total: {sectorData?.length || 0}</strong>
            <strong>Quantity: {modalQuantity?.total || 0}</strong>
            <strong>Registered: {modalQuantity?.registered || 0}</strong>
            <strong>Monitoring: {modalQuantity?.todaysmonitaring || 0}</strong>
            <strong>
              Partially Compliant: {modalQuantity?.partially_compliant || 0}
            </strong>
            <strong>Compliant : {modalQuantity?.compliant || 0}</strong>
            <strong>Not Compliant : {modalQuantity?.not_compliant || 0}</strong>
            <strong>
              Toilet Unclean : {modalQuantity?.toiletunclean || 0}
            </strong>
            <strong>Toilet Clean : {modalQuantity?.toiletclean || 0}</strong>
          </div>
        )}
      />
    </div>
  );
};

export default VendorReports;
