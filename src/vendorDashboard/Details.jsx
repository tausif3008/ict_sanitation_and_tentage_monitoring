import React, { useState, useEffect } from "react";
import { Tooltip, Button } from "antd";
import { useDispatch } from "react-redux";
import { useOutletContext } from "react-router";
import lines from "../assets/Dashboard/lines.png";
import {
  priorityToiletTypes_Id,
  VendorWiseReportcolumns,
} from "../constant/const";
import { getFormData } from "../urils/getFormData";
import { getSanitationDashData } from "../SanitationDashboard/Slice/sanitationDashboard";
import SanitationDashSelector from "../SanitationDashboard/Slice/sanitationDashboardSelector";
import ViewVendorsSectors from "../register/AssetType/viewVendors";
import URLS from "../urils/URLS";
import { getVendorReports } from "../Reports/VendorwiseReports/vendorslice";
import VendorSelectors from "../Reports/VendorwiseReports/vendorSelectors";

const Details = () => {
  const [dict, lang] = useOutletContext();
  const [assetData, setAssetData] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [showData, setShowData] = useState(null);
  const [count, setCount] = useState({
    total: 0,
    registered: 0,
    clean: 0,
    maintenance: 0,
    unclean: 0,
  });
  const [vendorDetails, setVendorDetails] = useState({
    list: [],
    pageLength: 25,
    currentPage: 1,
  });

  const dispatch = useDispatch();
  const { SanitationDash_data, loading } = SanitationDashSelector(); // sanitation dashboard
  const { vendorReports } = VendorSelectors(); // vendor Reports
  const vendorsData = vendorReports?.data?.vendors || [];
  const toiletData = assetData?.asset_types || [];
  const RoleId = localStorage.getItem("role_id");
  const userId = localStorage.getItem("userId");

  // close module
  const handleCancel = () => {
    setShowData(null);
    setCount({
      total: 0,
      registered: 0,
      clean: 0,
      maintenance: 0,
      unclean: 0,
    });
  };

  // show module
  const handleCleanData = async (data) => {
    const finalData = {
      asset_main_type_id: data?.asset_main_type_id,
      asset_type_id: data?.asset_type_id,
      vendor_id: userId,
    };

    const formData = await getFormData(finalData);
    const url = URLS?.vendorReporting?.path;
    dispatch(getVendorReports(url, formData)); // vendor reports
    setTimeout(() => {
      setShowData(data);
    }, 500);
  };

  useEffect(() => {
    if (vendorReports) {
      const total = vendorsData?.reduce(
        (acc, circle) => acc + Number(circle?.total) || 0,
        0
      );
      const totalReg = vendorsData?.reduce(
        (acc, circle) => acc + Number(circle?.registered) || 0,
        0
      );
      const totalClean = vendorsData?.reduce(
        (acc, circle) => acc + Number(circle?.clean) || 0,
        0
      );
      const totalUnclean = vendorsData?.reduce(
        (acc, circle) => acc + Number(circle?.unclean) || 0,
        0
      );
      const totalMaintenance = vendorsData?.reduce(
        (acc, circle) => acc + Number(circle?.maintenance) || 0,
        0
      );
      setCount({
        total: total,
        registered: totalReg,
        clean: totalClean,
        maintenance: totalMaintenance,
        unclean: totalUnclean,
      });
    }
  }, [vendorReports]);

  useEffect(() => {
    if (vendorReports) {
      setVendorDetails((prevDetails) => ({
        ...prevDetails,
        list: vendorReports?.data?.vendors || [],
        pageLength: vendorReports?.data?.paging?.[0]?.length || 0,
        currentPage: vendorReports?.data?.paging?.[0]?.currentpage || 1,
        totalRecords: vendorReports?.data?.paging?.[0]?.totalrecords || 0,
      }));
    }
  }, [vendorReports]);

  useEffect(() => {
    if (RoleId === "8") {
      const finalData = {
        vendor_id: userId,
      };
      const formData = getFormData(finalData);
      dispatch(getSanitationDashData(formData));
    } else {
      dispatch(getSanitationDashData());
    }
  }, [RoleId, userId]);

  useEffect(() => {
    if (SanitationDash_data) {
      setAssetData(SanitationDash_data?.data); // sanitation data
    }
  }, [SanitationDash_data]);

  const sortedArray =
    toiletData
      ?.map((item) => ({
        ...item,
        asset_type_id: Number(item?.asset_type_id),
      }))
      ?.sort((a, b) => a?.asset_type_id - b?.asset_type_id) || []; // Sort in ascending order

  return (
    <>
      <div className="p-4 bg-white rounded-xl space-y-4">
        <div className="text-xl font-bold">
          {dict.sanitation_toilet_details[lang]}
        </div>

        <div className="flex justify-start items-center space-x-6 mb-1">
          <div className="flex items-center mb-4 mr-6">
            <div className="flex items-center mr-6">
              <div className="h-3 w-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm">{dict.clean[lang]}</span>
            </div>
            <div className="flex items-center mr-6">
              <div className="h-3 w-3 bg-red-500 rounded-full mr-2"></div>
              <span className="text-sm">{dict.unclean[lang]}</span>
            </div>
          </div>
        </div>
        <div
          className={`grid ${
            showAll
              ? "grid-cols-2 sm:grid-cols-2 md:grid-cols-4"
              : "sm:grid-cols-2 xl:grid-cols-3 md:grid-cols-3"
          } gap-2 sm:gap-3 md:gap-4 lg:gap-4`}
        >
          {sortedArray?.length > 0 ? (
            sortedArray
              ?.filter((data) =>
                showAll
                  ? true
                  : priorityToiletTypes_Id?.includes(
                      data?.asset_type_id?.toString()
                    )
              )
              ?.map((item, index) => (
                <Tooltip
                  key={index}
                  title={
                    <div>
                      <strong>
                        {lang === "en" ? item?.name : item?.name_hi}
                      </strong>
                      <div>Total Quantity: {item.total}</div>
                      <div>Registered Quantity: {item.registered}</div>
                    </div>
                  }
                  placement="top"
                  // arrowPointAtCenter
                  arrow={{ pointAtCenter: true }}
                >
                  <div
                    className={`relative p-3 border rounded-md shadow-md flex flex-col justify-between bg-gray-50 ${
                      showAll ? "" : "h-40"
                    }`}
                    style={{
                      minHeight: "100px",
                    }}
                    onClick={(e) => {
                      handleCleanData(item);
                    }}
                  >
                    <div className="text-start flex-1">
                      <div className="text-sm text-gray-500 font-bold">
                        {lang === "en" ? item?.name : item?.name_hi}
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-3 right-3 flex justify-between">
                      <div className="flex items-center">
                        <div className="h-3 w-3 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-sm font-semibold">
                          {item.clean}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <div className="h-3 w-3 bg-red-500 rounded-full mr-2"></div>
                        <span className="text-sm font-semibold">
                          {item.unclean}
                        </span>
                      </div>
                    </div>
                    <img
                      src={lines}
                      alt="Card Icon"
                      className="absolute bottom-0 right-0 h-full w-auto"
                    />
                  </div>
                </Tooltip>
              ))
          ) : (
            <div className="col-span-full flex justify-center items-center h-32">
              {dict.no_data_available[lang]}
            </div>
          )}
        </div>

        {toiletData?.length > 0 ? (
          !showAll ? (
            <Button
              size="medium"
              type="primary"
              onClick={() => setShowAll(true)}
              className="w-32 bg-orange-400 font-semibold"
              style={{ flexShrink: 0 }}
            >
              {dict.see_more[lang]}
            </Button>
          ) : (
            <Button
              size="medium"
              type="primary"
              onClick={() => setShowAll(false)}
              className="w-32 bg-orange-400 font-semibold"
              style={{ flexShrink: 0 }}
            >
              {dict.show_less[lang]}
            </Button>
          )
        ) : null}
      </div>
      {/* total quantity */}
      <ViewVendorsSectors
        title={`${lang === "en" ? showData?.name : showData?.name_hi}`}
        openModal={showData && !loading}
        handleCancel={handleCancel}
        tableData={vendorDetails?.list || []}
        column={VendorWiseReportcolumns || []}
        footer={() => (
          <div className="flex justify-between">
            <strong>Total : {count?.total || 0}</strong>
            <strong>Total Registered: {count?.registered || 0}</strong>
            <strong>Total Clean : {count?.clean || 0}</strong>
            <strong>Total Maintenance : {count?.maintenance || 0}</strong>
            <strong>Total Unclean: {count?.unclean || 0}</strong>
          </div>
        )}
      />
    </>
  );
};

export default Details;
