import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";

import CommonDivider from "../../commonComponents/CommonDivider";
import URLS from "../../urils/URLS";
import { basicUrl } from "../../Axios/commonAxios";
import { getVendorReports } from "./vendorslice";
import VendorSelectors from "./vendorSelectors";
import CommonTable from "../../commonComponents/CommonTable";
import ExportToPDF from "../reportFile";
import ExportToExcel from "../ExportToExcel";

const VendorReports = () => {
  const dispatch = useDispatch();
  const { loading, vendorReports } = VendorSelectors();
  const params = useParams();
  const [excelData, setExcelData] = useState([]);

  const [vendorDetails, setVendorDetails] = useState({
    list: [],
    pageLength: 25,
    currentPage: 1,
  });

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
          sr: index + 1,
          name: data?.name,
          // email: data?.email,
          // phone: data?.phone,
          // address: data?.address,
          // pin: data?.pin,
          // company: data?.company,
          // language: data?.language,
          total: data?.total,
          registered: data?.registered,
          clean: data?.clean,
          unclean: data?.unclean,
        };
      });
      setExcelData(myexcelData);
    }
  }, [vendorReports]);

  useEffect(() => {
    let uri = URLS.vendorReporting.path + "?";
    if (params.page) {
      uri = uri + params.page;
    } else if (params.per_page) {
      uri = uri + "&" + params.per_page;
    } else {
      uri = URLS.vendorReporting.path;
    }
    dispatch(getVendorReports(basicUrl + uri));
    return () => {};
  }, [params]);

  const columns = [
    {
      title: "Vendor Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
    },
    {
      title: "Registered",
      dataIndex: "registered",
      key: "registered",
    },
    {
      title: "Clean",
      dataIndex: "clean",
      key: "clean",
    },
    {
      title: "Unclean",
      dataIndex: "unclean",
      key: "unclean",
    },
    // {
    //   title: "Address",
    //   dataIndex: "address",
    //   key: "address",
    //   render: (text, record) => {
    //     return `${text}, Pincode -${record?.pin}`;
    //   },
    // },
    // {
    //   title: "Email",
    //   dataIndex: "email",
    //   key: "email",
    // },
    // {
    //   title: "Company",
    //   dataIndex: "company",
    //   key: "company",
    // },
  ];

  // pdf header
  const pdfHeader = [
    "Sr No",
    "Vendor Name",
    "Total",
    "Registered",
    "Clean",
    "Unclean",
  ];

  // pdf data
  const pdfData = excelData?.map((opt) => [
    opt?.sr,
    opt?.name,
    opt?.total,
    opt?.registered,
    opt?.clean,
    opt?.unclean,
  ]);

  return (
    <div>
      <CommonDivider label={"Vendor-Wise Report"} />
      <div className="flex justify-end gap-2 mb-4 font-semibold">
        <div>
          <ExportToPDF
            titleName={"Vendor-Wise Report"}
            pdfName={"Vendor-Wise-Report"}
            headerData={pdfHeader}
            rows={pdfData}
          />
        </div>
        <div>
          <ExportToExcel
            excelData={excelData || []}
            fileName={"Vendor-Wise-Report"}
          />
        </div>
      </div>
      <CommonTable
        loading={loading}
        uri={`vendor-wise-report`}
        columns={columns || []}
        details={vendorDetails || []}
        scroll={{ x: 300, y: 400 }}
      ></CommonTable>
    </div>
  );
};

export default VendorReports;
