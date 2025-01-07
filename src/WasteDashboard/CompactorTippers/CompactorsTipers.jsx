import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import ReactApexChart from "react-apexcharts";

import URLS from "../../urils/URLS";
import {
  getAssetTypes,
  getVendorListAssetType,
} from "../../register/AssetType/AssetTypeSlice";
import ViewVendorsSectors from "../../register/AssetType/viewVendors";
import AssetTypeSelectors from "../../register/AssetType/assetTypeSelectors";
import { vendorColumn } from "../../constant/const";

const CompactorsTippers = () => {
  const [showVendors, setshowVendors] = useState(false);
  const [showVendorsList, setVendorsList] = useState([]); // vendor list
  const [rowRecord, setRowRecord] = useState(); // vendor list all quantity
  const [allQuantity, setAllQuantity] = useState(0); // vendor list all quantity

  const dispatch = useDispatch();
  const { VendorListAssetType, AssetType } = AssetTypeSelectors(); // asset type wise vendor list

  const CompactorsOptions = {
    chart: {
      type: "radialBar",
      offsetY: -20,
      sparkline: {
        enabled: true,
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        track: {
          background: "#F0F0F0", // Color of the non-remaining 22%
          strokeWidth: "97%",
          margin: 5, // margin is in pixels
          dropShadow: {
            enabled: true,
            top: 2,
            left: 0,
            color: "#F0F0F0	",
            opacity: 1,
            blur: 4,
          },
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            offsetY: -2,
            fontSize: "22px",
          },
        },
      },
    },
    grid: {
      padding: {
        top: -10,
      },
    },
    fill: {
      colors: ["#ff9900"], // Set the color of the radial bar to orange
    },
    labels: ["Average Results"],
  };

  const CompactorsSeries = [90]; // Percentage value for the radial bar

  const tippersOptions = {
    chart: {
      type: "radialBar",
      offsetY: -20,
      sparkline: {
        enabled: true,
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        track: {
          background: "#F0F0F0", // Color of the non-remaining 22%
          strokeWidth: "97%",
          margin: 5, // margin is in pixels
          dropShadow: {
            enabled: true,
            top: 2,
            left: 0,
            color: "#F0F0F0	",
            opacity: 1,
            blur: 4,
          },
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            offsetY: -2,
            fontSize: "22px",
          },
        },
      },
    },
    grid: {
      padding: {
        top: -10,
      },
    },
    fill: {
      colors: ["#ff9900"], // Set the color of the radial bar to orange
    },
    labels: ["Average Results"],
  };
  const tippersSeries = [78];

  // get vendors data
  const handleShowVendors = (value) => {
    setRowRecord(value);
    setVendorsList([]);
    setAllQuantity(0);
    dispatch(getVendorListAssetType(value?.asset_type_id));
    setshowVendors(true);
  };

  // close list
  const handleCancel = () => {
    setshowVendors(false);
    setRowRecord(null);
  };

  useEffect(() => {
    if (VendorListAssetType) {
      const myData = VendorListAssetType?.data?.userdetails?.map(
        (data, index) => {
          return {
            sr_no: index + 1,
            ...data,
          };
        }
      );
      let totalQuantity = VendorListAssetType?.data?.userdetails?.reduce(
        (accumulator, data) => {
          return accumulator + Number(data?.total_allotted_quantity || 0);
        },
        0
      );
      setAllQuantity(totalQuantity);
      setVendorsList(myData); // asset type wise vendor list
    }
  }, [VendorListAssetType]);

  useEffect(() => {
    const url = URLS?.assetType?.path + 5;
    dispatch(getAssetTypes(url)); // get assset type
  }, []);

  return (
    <>
      <div className="flex  flex-col gap-3 p-2 w-full">
        <div className="flex justify-between gap-3 w-full">
          <div
            className="border flex justify-center text-start p-2 flex-col w-full"
            onClick={() => {
              handleShowVendors(AssetType?.data?.assettypes?.[0]);
            }}
          >
            <div className=" font-semibold -mt-0">
              {AssetType?.data?.assettypes?.[0]?.total_quantity}
            </div>
            <div className="text-lg">Compactors</div>
            <ReactApexChart
              options={CompactorsOptions}
              series={CompactorsSeries}
              type="radialBar"
              height={160}
            />
            <div className="text-sm text-gray-400  -mt-2 text-center">
              40 Compactors are fully functional
            </div>
          </div>
          {/* <Compactors></Compactors> */}
          {/* <Tippers></Tippers> */}
          <div
            className="w-full border flex justify-center text-start p-2 flex-col"
            onClick={() => {
              handleShowVendors(AssetType?.data?.assettypes?.[1]);
            }}
          >
            <div className=" font-semibold -mt-0">
              {AssetType?.data?.assettypes?.[1]?.total_quantity}
            </div>
            <div className="text-lg">Tippers</div>
            <ReactApexChart
              options={tippersOptions}
              series={tippersSeries}
              type="radialBar"
              height={160}
            />
            <div className="text-sm text-gray-400 -mt-2 text-center">
              108 Tippers are fully functional
            </div>
          </div>
        </div>
      </div>

      <ViewVendorsSectors
        title={"Vendor List"}
        openModal={showVendors}
        handleCancel={handleCancel}
        tableData={showVendorsList || []}
        tableHeaderData={
          [
            {
              label: "Category",
              value: rowRecord?.asset_main_type_name,
            },
            {
              label: "Toilets & Tentage Type",
              value: rowRecord?.name,
            },
          ] || []
        }
        column={vendorColumn || []}
        footer={`Total Allotted Quantity : ${allQuantity}`}
      />
    </>
  );
};

export default CompactorsTippers;
