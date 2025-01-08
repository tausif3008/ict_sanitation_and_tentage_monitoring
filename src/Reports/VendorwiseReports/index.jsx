import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { Table, Collapse, Form, Button, Row, Col } from "antd";
import moment from "moment";
import dayjs from "dayjs";

import CommonDivider from "../../commonComponents/CommonDivider";
import URLS from "../../urils/URLS";
import { getVendorReports } from "./vendorslice";
import VendorSelectors from "./vendorSelectors";
import ExportToPDF from "../reportFile";
import ExportToExcel from "../ExportToExcel";
import AssetTypeSelectors from "../../register/AssetType/assetTypeSelectors";
import VendorSupervisorSelector from "../../vendor/VendorSupervisorRegistration/Slice/VendorSupervisorSelector";
import { getValueLabel, VendorWiseReportcolumns } from "../../constant/const";
import { getFormData } from "../../urils/getFormData";
import {
  getAssetMainTypes,
  getAssetTypes,
} from "../../register/AssetType/AssetTypeSlice";
import { getAssetTypeWiseVendorList } from "../../vendor/VendorSupervisorRegistration/Slice/VendorSupervisorSlice";
import CustomSelect from "../../commonComponents/CustomSelect";
import search from "../../assets/Dashboard/icon-search.png";
import CustomDatepicker from "../../commonComponents/CustomDatepicker";

const VendorReports = () => {
  const [count, setCount] = useState({
    total: 0,
    registered: 0,
    // clean: 0,
    // maintenance: 0,
    // unclean: 0,
    monitoring: 0,
  });

  const [excelData, setExcelData] = useState([]);
  const [filesName, setFilesName] = useState(null); // files Name
  const [vendorDetails, setVendorDetails] = useState({
    list: [],
    pageLength: 25,
    currentPage: 1,
  });

  const dateFormat = "YYYY-MM-DD";
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { loading, vendorReports } = VendorSelectors(); // vendor reports
  const vendorsData = vendorReports?.data?.vendors || [];

  const { AssetMainTypeDrop, AssetTypeDrop } = AssetTypeSelectors(); // asset main type & asset type
  const { AssetTypeVendorDrop } = VendorSupervisorSelector(); // asset type wise vendor
  const categoryType = form.getFieldValue("asset_main_type_id");
  const asset_type_id_name = form.getFieldValue("asset_type_id");
  const vendor_id_name = form.getFieldValue("vendor_id");

  // handle category
  const handleSelect = (value) => {
    form.setFieldsValue({
      asset_type_id: null,
      vendor_id: null,
    });
    const url = URLS?.assetType?.path + value;
    dispatch(getAssetTypes(url)); // get assset type
  };

  // handle asset type
  const handleTypeSelect = (value) => {
    form.setFieldsValue({
      vendor_id: null,
    });
    value && dispatch(getAssetTypeWiseVendorList(value)); // asset type wise vendor list
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
    form.setFieldsValue({
      date: dayjs(newDate, dateFormat),
      asset_main_type_id: "1",
    });
    const url = URLS?.assetType?.path + "1";
    dispatch(getAssetTypes(url)); // get assset type
    const finalValues = {
      date: newDate,
      asset_main_type_id: "1",
    };
    callApi(finalValues);
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
      // const totalClean = vendorsData?.reduce(
      //   (acc, circle) => acc + Number(circle?.clean),
      //   0
      // );
      // const totalUnclean = vendorsData?.reduce(
      //   (acc, circle) => acc + Number(circle?.unclean),
      //   0
      // );
      // const totalMaintenance = vendorsData?.reduce(
      //   (acc, circle) => acc + Number(circle?.maintenance) || 0,
      //   0
      // );
      const totalMonitoring = vendorsData?.reduce(
        (acc, circle) => acc + Number(circle?.todaysmonitaring) || 0,
        0
      );
      setCount({
        total: total,
        registered: totalReg,
        // clean: totalClean,
        // maintenance: totalMaintenance,
        // unclean: totalUnclean,
        monitoring: totalMonitoring,
      });
    }
  }, [vendorReports]);

  // file name
  const getReportName = () => {
    const catTypeName = getValueLabel(categoryType, AssetMainTypeDrop, "");
    const assetTypeName = getValueLabel(asset_type_id_name, AssetTypeDrop, "");
    const vendorName = getValueLabel(vendor_id_name, AssetTypeVendorDrop, "");

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

  // useEffect(() => {
  //   if (categoryType || asset_type_id_name || vendor_id_name) {
  //     const catTypeName = getValueLabel(categoryType, AssetMainTypeDrop, "");
  //     const assetTypeName = getValueLabel(
  //       asset_type_id_name,
  //       AssetTypeDrop,
  //       ""
  //     );
  //     const vendorName = getValueLabel(vendor_id_name, AssetTypeVendorDrop, "");
  //     if (vendor_id_name) {
  //       if (asset_type_id_name) {
  //         const name = `${vendorName} Wise ${assetTypeName} Report`;
  //         setFilesName(name);
  //       } else {
  //         const name = `${vendorName} Wise ${catTypeName} Report`;
  //         setFilesName(name);
  //       }
  //     } else if (asset_type_id_name) {
  //       const name = `Vendor Wise ${catTypeName} (${assetTypeName}) Report`;
  //       setFilesName(name);
  //     } else {
  //       const name = `Vendor Wise ${catTypeName} Report`;
  //       setFilesName(name);
  //     }
  //   } else {
  //     setFilesName("");
  //   }
  // }, [categoryType, asset_type_id_name, vendor_id_name, AssetMainTypeDrop]);

  useEffect(() => {
    getCurrentData(); // current data
    const assetMainTypeUrl = URLS?.assetMainTypePerPage?.path;
    dispatch(getAssetMainTypes(assetMainTypeUrl)); // asset main type
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
          Total: Number(data?.total),
          Registered: Number(data?.registered),
          // Clean: Number(data?.clean),
          // Maintenance: Number(data?.maintenance),
          // Unclean: Number(data?.unclean),
          Monitoring: Number(data?.todaysmonitaring),
        };
      });
      setExcelData(myexcelData);
    }
  }, [vendorReports]);

  // pdf header
  const pdfHeader = [
    "Sr No",
    "Vendor Name",
    "Total",
    "Registered",
    // "Clean",
    // "Maintenance",
    // "Unclean",
    "Monitoring",
  ];

  // pdf data
  const pdfData = useMemo(() => {
    return (
      excelData?.map((opt) => [
        opt?.Sr,
        opt?.Name,
        opt?.Total,
        opt?.Registered,
        // opt?.Clean,
        // opt?.Maintenance,
        // opt?.Unclean,
        opt?.Monitoring,
      ]) || []
    );
  }, [excelData]);

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
            rows={[
              ...pdfData,
              [
                "",
                "Total",
                count?.total,
                count?.registered,
                count?.monitoring,
                // count?.clean,
                // count?.maintenance,
                // count?.unclean,
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
              // {
              //   name: "Clean",
              //   value: count?.clean,
              //   colIndex: 5,
              // },
              // {
              //   name: "Maintenance",
              //   value: count?.maintenance,
              //   colIndex: 6,
              // },
              // {
              //   name: "Unclean",
              //   value: count?.unclean,
              //   colIndex: 7,
              // },
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
                        options={AssetTypeVendorDrop || []}
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
      </div>

      <Table
        loading={loading}
        columns={VendorWiseReportcolumns || []}
        dataSource={vendorDetails?.list || []}
        rowKey="sector_id"
        pagination={{ pageSize: 50 }}
        bordered
        footer={() => (
          <div className="flex justify-between">
            <strong>Total Vendors: {vendorsData?.length}</strong>
            <strong>Total : {count?.total || 0}</strong>
            <strong>Total Registered: {count?.registered || 0}</strong>
            <strong>Total Monitoring : {count?.monitoring || 0}</strong>
            {/* <strong>Total Clean : {count?.clean || 0}</strong>
            <strong>Total Maintenance : {count?.maintenance || 0}</strong>
            <strong>Total Unclean: {count?.unclean || 0}</strong> */}
          </div>
        )}
      />
    </div>
  );
};

export default VendorReports;
