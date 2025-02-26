import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import dayjs from "dayjs";
import moment from "moment";
import { Collapse, Form, Button, Row, Col } from "antd";

import search from "../../assets/Dashboard/icon-search.png";
import {
  fiveTypes,
  getFormatedNumber,
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
import { getAssetTypes } from "../../register/AssetType/AssetTypeSlice";
import { getVendorCategoryTypeDrop } from "../VendorwiseReports/vendorslice";
import { getFormData } from "../../urils/getFormData";
import { getSectorsList } from "../../vendor-section-allocation/vendor-sector/Slice/vendorSectorSlice";
import VendorSectorSelectors from "../../vendor-section-allocation/vendor-sector/Slice/vendorSectorSelectors";
import { getParkingReports } from "../../register/parking/parkingSlice";
import ParkingSelector from "../../register/parking/parkingSelector";
import CustomTable from "../../commonComponents/CustomTable";

const ParkingMonitoringReport = () => {
  const [details, setDetails] = useState({
    list: [],
    pageLength: 25,
    currentPage: 1,
  });
  const [filesName, setFilesName] = useState(null); // files Name
  const [showTypeOption, setShowTypeOption] = useState(null);
  const [parkingTypeOption, setParkingTypeOption] = useState(null);
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
  const { AssetTypeDrop } = AssetTypeSelectors(); // asset main type & asset type
  const { VendorCatTypeDrop } = VendorSelectors(); // vendor dropdown & Reports
  const { SectorListDrop } = VendorSectorSelectors(); // all sector dropdown
  const parkingDropdown =
    [{ value: "0", label: "City Parking" }, ...SectorListDrop] || [];
  const { ParkingsData, loading } = ParkingSelector(); // parking report data

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
  const ParkingTypeName = getValueLabel(
    formValue?.parking_type,
    parkingType,
    null
  );
  const sectorName = getValueLabel(
    formValue?.mapped_sector_id,
    parkingDropdown,
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
      label: `Parking Type : ${ParkingTypeName || sectorName || "Combined"}`,
    },
    {
      label: `Type : ${assetTypeName || pdfTitleData?.type || "Combined"}`,
    },
    {
      label: `Sort By : ${orderByName || "Combined"}`,
    },
  ];

  // handle asset type
  const handleTypeSelect = (value) => {
    form.setFieldsValue({
      vendor_id: null,
      asset_type_ids: null,
    });
    if (value) {
      const paramData = {
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
      ...(values?.asset_type_id && { asset_type_id: values?.asset_type_id }),
      ...(values?.mapped_sector_id && {
        mapped_sector_id: values?.mapped_sector_id,
      }),
      ...(values?.parking_type && { parking_type: values?.parking_type }),
      ...(values?.vendor_id && { vendor_id: values?.vendor_id }),
      ...(values?.order_by && { order_by: values?.order_by }),
      ...(values?.asset_type_ids && { asset_type_ids: values?.asset_type_ids }),
      date: values?.date ? formattedDate : moment().format("YYYY-MM-DD"),
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
    setParkingTypeOption(null);
  };

  // file name
  const getReportName = () => {
    let name = "Parking Wise";
    if (vendorName) {
      name += `- ${vendorName}`;
    }
    if (assetTypeName) {
      name += `- ${assetTypeName}`;
    }
    if (sectorName) {
      name += `- ${sectorName}`;
    }
    if (ParkingTypeName) {
      name += `- ${ParkingTypeName}`;
    }
    if (fiveTypeIdName) {
      name += `- ${fiveTypeIdName}`;
    }
    if (orderByName) {
      name += `- ${orderByName}`;
    }
    name += ` (${dayjs(formValue?.date).format("DD-MMM-YYYY")})`;
    return `${name} Monitoring Report`;
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
    handleTypeSelect(1);
    form.setFieldsValue({
      date: dayjs(newDate, dateFormat),
      order_by: "monitaring_per",
      asset_type_ids: fiveTypes?.[0]?.value,
    });
    const finalValues = {
      asset_type_ids: fiveTypes?.[0]?.value,
      date: newDate,
      order_by: "monitaring_per",
    };
    callApi(finalValues);
  };

  useEffect(() => {
    getCurrentData(); // current data
    const url = URLS?.assetType?.path + 1;
    dispatch(getAssetTypes(url)); // get assset type
    dispatch(getSectorsList()); // all sectors
  }, []);

  useEffect(() => {
    if (ParkingsData) {
      setDetails(() => {
        return {
          list: ParkingsData,
        };
      });
    } else {
      setDetails({
        list: [],
        pageLength: 25,
        currentPage: 1,
      });
    }
  }, [ParkingsData]);

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
        return text ? getValueLabel(text, parkingDropdown, null) || "-" : "-";
      },
      sorter: (a, b) => a?.total - b?.total,
    },
    // {
    //   title: "Parking Name",
    //   dataIndex: "name",
    //   key: "name",
    //   width: 90,

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
      sorter: (a, b) => a?.total - b?.total,
    },
    {
      title: "Registered",
      dataIndex: "registered",
      key: "registered",
      width: 50,
      sorter: (a, b) => a?.registered - b?.registered,
    },
    {
      title: "Monitoring",
      dataIndex: "todaysmonitaring",
      key: "todaysmonitaring",
      width: 50,
      sorter: (a, b) => a?.todaysmonitaring - b?.todaysmonitaring,
    },
    {
      title: "Monitoring (%)",
      dataIndex: "monitaring_per",
      key: "monitaring_per",
      width: 50,
      render: (text) => {
        const roundedText = text ? `${Math.round(text)}%` : "00";
        return roundedText;
      },
      sorter: (a, b) => a?.monitaring_per - b?.monitaring_per,
    },
    ,
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
    {
      title: "Not Compliant (%)",
      dataIndex: "not_compliant_per",
      key: "not_compliant_per",
      width: 50,
      render: (text, record) => {
        const roundedText = text ? `${Math.round(text)}%` : "00";
        return roundedText;
      },
      sorter: (a, b) => a?.not_compliant_per - b?.not_compliant_per,
    },
    {
      title: "Toilet Unclean",
      dataIndex: "toiletunclean",
      key: "toiletunclean",
      width: 50,
      sorter: (a, b) => a?.toiletunclean - b?.toiletunclean,
    },
    {
      title: "Toilet Unclean (%)",
      dataIndex: "toiletunclean_per",
      key: "toiletunclean_per",
      width: 50,
      render: (text, record) => {
        const roundedText = text ? `${Math.round(text)}%` : "00";
        return roundedText;
      },
      sorter: (a, b) => a?.toiletunclean_per - b?.toiletunclean_per,
    },
    {
      title: "Toilet Clean",
      dataIndex: "toiletclean",
      key: "toiletclean",
      width: 50,
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
    getValueLabel(sector?.mapped_sector_id, parkingDropdown, null) || "-",
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
        getValueLabel(data?.mapped_sector_id, parkingDropdown, null) || "-",
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
    <>
      <CommonDivider label={"Parking-Wise Monitoring Report"} />
      <div className="flex justify-end gap-2 mb-4 font-semibold">
        <ExportToPDF
          titleName={`Parking-Wise Monitoring Report (${dayjs(
            formValue?.date
          ).format("DD-MMM-YYYY")})`}
          pdfName={filesName ? filesName : `Parking-Wise Monitoring Report`}
          headerData={pdfHeader}
          IsLastLineBold={true}
          landscape={true}
          tableTitles={pdfTitleParam || []}
          columnProperties={formValue?.order_by === "monitaring_per" ? [6] : []} // 7 columns
          redToGreenProperties={
            formValue?.order_by === "not_compliant_per"
              ? [10]
              : formValue?.order_by === "toiletunclean_per"
              ? [12]
              : []
          } // 11, 13 columns  100 to 0
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
          columnProperties={formValue?.order_by === "monitaring_per" ? [7] : []} // 6 columns
          redToGreenProperties={
            formValue?.order_by === "not_compliant_per"
              ? [11]
              : formValue?.order_by === "toiletunclean_per"
              ? [13]
              : []
          }
          fileName={filesName ? filesName : `Vendor-Wise Report`}
          dynamicArray={[
            {
              name: "Total",
              value: totalQuantity?.totalQnty,
              colIndex: 4,
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
                      onChange={(value) => {
                        setParkingTypeOption(value);
                        form.setFieldsValue({
                          parking_type: null,
                        });
                      }}
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
                  {!parkingTypeOption && (
                    <Col key="parking_type" xs={24} sm={12} md={6} lg={5}>
                      <CustomSelect
                        name={"parking_type"}
                        label={"Parking Type"}
                        placeholder={"Parking Type"}
                        options={parkingType || []}
                      />
                    </Col>
                  )}
                  {!showTypeOption && (
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
                    <Button
                      loading={loading}
                      type="button"
                      htmlType="submit"
                      className="w-fit rounded-none text-white bg-blue-500 hover:bg-blue-600"
                    >
                      Search
                    </Button>
                    <Button
                      loading={loading}
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
        loading={loading}
        columns={columns || []}
        bordered
        dataSource={details || []}
        scroll={{ x: 1000, y: 400 }}
        pagination={true}
        tableSubheading={{
          "Total Records": details?.list?.length,
        }}
        footer={() => (
          <div className="flex justify-between">
            <strong>
              Total Quantity: {getFormatedNumber(totalQuantity?.totalQnty) || 0}
            </strong>
            <strong>
              Registered: {getFormatedNumber(totalQuantity?.registered) || 0}
            </strong>
            <strong>
              Monitoring: {getFormatedNumber(totalQuantity?.monitoring) || 0}
            </strong>
            <strong>
              Partially Compliant:{" "}
              {getFormatedNumber(totalQuantity?.partially_compliant) || 0}
            </strong>
            <strong>
              Compliant: {getFormatedNumber(totalQuantity?.compliant) || 0}
            </strong>
            <strong>
              Not Compliant:{" "}
              {getFormatedNumber(totalQuantity?.not_compliant) || 0}
            </strong>
            <strong>
              Toilet Unclean:{" "}
              {getFormatedNumber(totalQuantity?.toiletunclean) || 0}
            </strong>
            <strong>
              Toilet Clean: {getFormatedNumber(totalQuantity?.toiletclean) || 0}
            </strong>
          </div>
        )}
      />
    </>
  );
};

export default ParkingMonitoringReport;
