import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import dayjs from "dayjs";
import moment from "moment";
import { Table, Collapse, Form, Button, Row, Col } from "antd";

import search from "../../assets/Dashboard/icon-search.png";
import {
  fiveTypes,
  getValueLabel,
  OrderBy,
  parkingType,
} from "../../constant/const";
import ExportToPDF from "../reportFile";
import ExportToExcel from "../ExportToExcel";
import CommonDivider from "../../commonComponents/CommonDivider";
import URLS from "../../urils/URLS";
import AssetTypeSelectors from "../../register/AssetType/assetTypeSelectors";
import VendorSelectors from "../VendorwiseReports/vendorSelectors";
import CustomDatepicker from "../../commonComponents/CustomDatepicker";
import CustomSelect from "../../commonComponents/CustomSelect";
import {
  getAssetMainTypes,
  getAssetTypes,
} from "../../register/AssetType/AssetTypeSlice";
import { getVendorCategoryTypeDrop } from "../VendorwiseReports/vendorslice";
import { getFormData } from "../../urils/getFormData";
import { getSectorsList } from "../../vendor-section-allocation/vendor-sector/Slice/vendorSectorSlice";
import VendorSectorSelectors from "../../vendor-section-allocation/vendor-sector/Slice/vendorSectorSelectors";
import { getParkingReports } from "../../register/parking/parkingSlice";
import ParkingSelector from "../../register/parking/parkingSelector";

const ParkingMonitoringReport = () => {
  const [filesName, setFilesName] = useState(null); // files Name
  const [showTypeOption, setShowTypeOption] = useState(null);
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

  const dateFormat = "YYYY-MM-DD";
  const [form] = Form.useForm();
  const formValue = form.getFieldsValue();
  const dispatch = useDispatch();
  const { AssetMainTypeDrop, AssetTypeDrop } = AssetTypeSelectors(); // asset main type & asset type
  const { VendorReport_Loading, VendorCatTypeDrop } = VendorSelectors(); // vendor dropdown & Reports
  const { SectorListDrop } = VendorSectorSelectors(); // all sector dropdown
  const { ParkingsData, loading } = ParkingSelector(); // parking report data

  const userRoleId = localStorage.getItem("role_id");
  const Category_mainType_id = localStorage.getItem("category_mainType_id");
  const sessionDataString = localStorage.getItem("sessionData");
  const sessionData = sessionDataString ? JSON.parse(sessionDataString) : null;

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
  const sectorName = getValueLabel(
    formValue?.mapped_sector_id,
    SectorListDrop,
    null
  );
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
    ...(formValue?.mapped_sector_id
      ? [
          {
            label: `Mapped Sector Name : ${sectorName || "Combined"}`,
          },
        ]
      : []),
    {
      label: `Sort By : ${orderByName || "Combined"}`,
    },
  ];

  // handle category
  const handleSelect = (value) => {
    form.setFieldsValue({
      asset_type_id: null,
      vendor_id: null,
    });
    const url = URLS?.assetType?.path + value;
    dispatch(getAssetTypes(url)); // get assset type
    if (userRoleId !== "8" && value) {
      const paramData = {
        asset_main_type_id: value,
      };
      dispatch(getVendorCategoryTypeDrop(paramData)); // vendor list
    }
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
      ...(values?.mapped_sector_id && {
        mapped_sector_id: values?.mapped_sector_id,
      }),
      ...(values?.vendor_id && { vendor_id: values?.vendor_id }),
      ...(values?.order_by && { order_by: values?.order_by }),
      ...(values?.asset_type_ids && { asset_type_ids: values?.asset_type_ids }),
      date: values?.date ? formattedDate : moment().format("YYYY-MM-DD"),
      ...(userRoleId === "8" && {
        vendor_id: sessionData?.id,
      }),
      ...(userRoleId === "8" && {
        asset_main_type_id: Category_mainType_id,
      }),
    };
    callApi(finalValues);
  };

  const callApi = async (data) => {
    const formData = await getFormData(data);
    dispatch(getParkingReports(formData)); // sector reports
  };

  // reset form
  const resetForm = () => {
    form.resetFields();
    getCurrentData();
    setFilesName(null);
  };

  // file name
  const getReportName = () => {
    let name = "Parking Wise";
    if (vendorName) {
      name += `- ${vendorName}`;
    }
    if (catTypeName) {
      name += `- ${catTypeName}`;
    }
    if (assetTypeName) {
      name += `- ${assetTypeName}`;
    }
    if (sectorName) {
      name += `- ${sectorName}`;
    }
    if (fiveTypeIdName) {
      name += `- ${fiveTypeIdName}`;
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
    if (ParkingsData) {
      const myCountsData = ParkingsData;
      const totalQty = myCountsData?.reduce(
        (acc, sector) => acc + Number(sector?.total) || 0,
        0
      );
      const totalRegister = myCountsData?.reduce(
        (acc, sector) => acc + Number(sector?.registered) || 0,
        0
      );
      const monitoring = myCountsData?.reduce(
        (acc, sector) => acc + Number(sector?.todaysmonitaring) || 0,
        0
      );
      const partially_compliant = myCountsData?.reduce(
        (acc, sector) => acc + Number(sector?.partially_compliant) || 0,
        0
      );
      const compliant = myCountsData?.reduce(
        (acc, sector) => acc + Number(sector?.compliant) || 0,
        0
      );
      const not_compliant = myCountsData?.reduce(
        (acc, sector) => acc + Number(sector?.not_compliant) || 0,
        0
      );
      const toiletunclean = myCountsData?.reduce(
        (acc, sector) => acc + Number(sector?.toiletunclean) || 0,
        0
      );
      const toiletclean = myCountsData?.reduce(
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
  }, [ParkingsData]);

  const getCurrentData = () => {
    let newDate = dayjs().format("YYYY-MM-DD");
    let mainTypeIdLocal = "1";
    if (userRoleId === "8") {
      mainTypeIdLocal = Category_mainType_id || "1";
    }
    form.setFieldsValue({
      date: dayjs(newDate, dateFormat),
      asset_main_type_id: mainTypeIdLocal,
      order_by: "monitaring_per",
    });
    const url = URLS?.assetType?.path + mainTypeIdLocal;
    dispatch(getAssetTypes(url)); // get assset type
    if (userRoleId !== "8") {
      const paramData = {
        asset_main_type_id: mainTypeIdLocal,
      };
      dispatch(getVendorCategoryTypeDrop(paramData)); // vendor list
    }
    const finalValues = {
      date: newDate,
      order_by: "monitaring_per",
      asset_main_type_id: mainTypeIdLocal,
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
    dispatch(getSectorsList()); // all sectors
  }, []);

  // Create a reusable render function
  const renderColumn = (text, record) => {
    return (
      <span
      // onClick={() => handleClick(record)}
      // className="cursor-pointer hover:text-blue-500 hover:underline"
      >
        {text ? text : 0}
      </span>
    );
  };

  // table column
  const columns = [
    {
      title: "Parking Name",
      dataIndex: "name",
      key: "name",
      width: 90,
      sorter: (a, b) => {
        return a?.name?.localeCompare(b?.name);
      },
    },
    {
      title: "Mapped Sector",
      dataIndex: "mapped_sector_id",
      key: "mapped_sector_id",
      width: 50,
      render: (text) => {
        return text ? getValueLabel(text, SectorListDrop, null) || "-" : "-";
      },
      sorter: (a, b) => a?.total - b?.total,
    },
    // {
    //   title: "Parking Name",
    //   dataIndex: "name",
    //   key: "name",
    //   width: 90,
    //   render: renderColumn,
    //   sorter: (a, b) => {
    //     const extractNumber = (str) => {
    //       const match = str?.match(/\d+/); // Matches digits in the string
    //       return match ? parseInt(match[0], 10) : 0; // Return the numeric part or 0 if not found
    //     };
    //     const numA = extractNumber(a?.name);
    //     const numB = extractNumber(b?.name);
    //     return numA - numB; // Numeric sorting
    //   },
    // },
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

  const pdfHeader = [
    "Sr No",
    "Parking Name",
    "Mapped Sector",
    "Total",
    "Registered",
    "Monitoring",
    "Monitoring (%)",
    "Partially Compliant",
    // "Partially Compliant%",
    "Compliant",
    // "Compliant%",
    "Not Compliant",
    "Not Compliant (%)",
    "Toilet Unclean",
    "Toilet Unclean (%)",
    "Toilet Clean",
    // "Toilet Clean%",
  ];

  // pdf data
  const pdfData = ParkingsData?.map((sector, index) => [
    index + 1,
    sector?.name,
    getValueLabel(sector?.mapped_sector_id, SectorListDrop, null) || "-",
    Number(sector?.total) || 0,
    Number(sector?.registered) || 0,
    Number(sector?.todaysmonitaring) || 0,
    sector?.monitaring_per != null
      ? `${Math.round(Number(sector?.monitaring_per) || 0)}%`
      : "00%",
    Number(sector?.partially_compliant) || 0,
    Number(sector?.compliant) || 0,
    Number(sector?.not_compliant) || 0,
    sector?.not_compliant_per != null
      ? `${Math.round(Number(sector?.not_compliant_per) || 0)}%`
      : "00%",
    Number(sector?.toiletunclean) || 0,
    sector?.toiletunclean_per != null
      ? `${Math.round(Number(sector?.toiletunclean_per) || 0)}%`
      : "00%",
    Number(sector?.toiletclean) || 0,
  ]);

  // excel data
  const myexcelData = useMemo(() => {
    return ParkingsData?.map((data, index) => ({
      Sr: index + 1,
      Name: data?.name,
      "Mapped Sector":
        getValueLabel(data?.mapped_sector_id, SectorListDrop, null) || "-",
      Quantity: Number(data?.total),
      Registered: Number(data?.registered),
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
    }));
  }, [ParkingsData]);

  return (
    <div>
      <CommonDivider label={"Parking-Wise Monitoring Report"} />
      <div className="flex justify-end gap-2 mb-4 font-semibold">
        <ExportToPDF
          // titleName={filesName ? filesName : `Parking-Wise Monitoring Report`}
          titleName={`Parking-Wise Monitoring Report (${dayjs(
            formValue?.date
          ).format("DD-MMM-YYYY")})`}
          pdfName={filesName ? filesName : `Parking-Wise Monitoring Report`}
          headerData={pdfHeader}
          IsLastLineBold={true}
          landscape={true}
          tableTitles={pdfTitleParam || []}
          columnProperties={formValue?.order_by === "monitaring_per" ? [5] : []} // 6 columns
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
              "",
              totalQuantity?.totalQnty,
              totalQuantity?.registered,
              totalQuantity?.monitoring,
              "",
              totalQuantity?.partially_compliant,
              // "",
              totalQuantity?.compliant,
              // "",
              totalQuantity?.not_compliant,
              "",
              totalQuantity?.toiletunclean,
              "",
              totalQuantity?.toiletclean,
              // "",
            ],
          ]}
        />
        <ExportToExcel
          excelData={myexcelData || []}
          columnProperties={formValue?.order_by === "monitaring_per" ? [6] : []} // 6 columns
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
              value: totalQuantity?.totalQnty,
              colIndex: 3,
            },
            {
              name: "Register Unit",
              value: totalQuantity?.registered,
              colIndex: 5,
            },
            {
              name: "Monitoring",
              value: totalQuantity?.monitoring,
              colIndex: 6,
            },
            {
              name: "Partialy Compliant",
              value: totalQuantity?.partially_compliant,
              colIndex: 8,
            },
            {
              name: "Compliant",
              value: totalQuantity?.compliant,
              colIndex: 9,
            },
            {
              name: "Not Compliant",
              value: totalQuantity?.not_compliant,
              colIndex: 10,
            },
            {
              name: "Unclean",
              value: totalQuantity?.toiletunclean,
              colIndex: 12,
            },
            {
              name: "Clean",
              value: totalQuantity?.toiletclean,
              colIndex: 14,
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
                  {userRoleId !== "8" && (
                    <Col key="asset_main_type_id" xs={24} sm={12} md={6} lg={5}>
                      <CustomSelect
                        name={"asset_main_type_id"}
                        label={"Select Category"}
                        placeholder={"Select Category"}
                        onSelect={handleSelect}
                        options={AssetMainTypeDrop?.slice(0, 2) || []}
                        allowClear={false}
                      />
                    </Col>
                  )}
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
                  <Col key="mapped_sector_id" xs={24} sm={12} md={6} lg={5}>
                    <CustomSelect
                      name={"mapped_sector_id"}
                      label={"Sector Name"}
                      placeholder={"Select Sector Name"}
                      options={SectorListDrop || []}
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
                  <Col key="parkingType" xs={24} sm={12} md={6} lg={5}>
                    <CustomSelect
                      name={"parkingType"}
                      label={"Parking Type"}
                      placeholder={"Parking Type"}
                      options={parkingType || []}
                    />
                  </Col>
                  {formValue?.asset_main_type_id === "1" && !showTypeOption && (
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

      <Table
        loading={loading || VendorReport_Loading}
        columns={columns}
        dataSource={ParkingsData || []}
        // dataSource={[...ParkingsData, ...lastTableRow] || []}
        rowKey="mapped_sector_id"
        pagination={{ pageSize: 30 }}
        scroll={{ x: 1700, y: 400 }}
        bordered
        // rowClassName={rowClassName}
        footer={() => (
          <div className="flex justify-between">
            <strong>Total Quantity: {totalQuantity?.totalQnty || 0}</strong>
            <strong>Registered: {totalQuantity?.registered || 0}</strong>
            <strong>Monitoring: {totalQuantity?.monitoring || 0}</strong>
            <strong>
              Partially Compliant: {totalQuantity?.partially_compliant || 0}
            </strong>
            <strong>Compliant : {totalQuantity?.compliant || 0}</strong>
            <strong>Not Compliant : {totalQuantity?.not_compliant || 0}</strong>
            <strong>
              Toilet Unclean : {totalQuantity?.toiletunclean || 0}
            </strong>
            <strong>Toilet Clean : {totalQuantity?.toiletclean || 0}</strong>
          </div>
        )}
      />
    </div>
  );
};

export default ParkingMonitoringReport;
