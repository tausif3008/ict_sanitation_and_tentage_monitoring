import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { Icon } from "@iconify/react/dist/iconify.js";
// import ReactApexChart from "react-apexcharts";

import URLS from "../../urils/URLS";
import {
  getAssetTypes,
  getVendorListAssetType,
} from "../../register/AssetType/AssetTypeSlice";
import ViewVendorsSectors from "../../register/AssetType/viewVendors";
import AssetTypeSelectors from "../../register/AssetType/assetTypeSelectors";
import { vendorColumn } from "../../constant/const";
// import { icon } from "leaflet";

const CompactorsTippers = () => {
  const [showVendors, setshowVendors] = useState(false);
  const [showVendorsList, setVendorsList] = useState([]); // vendor list
  const [rowRecord, setRowRecord] = useState(); // vendor list all quantity
  const [allQuantity, setAllQuantity] = useState(0); // vendor list all quantity

  const dispatch = useDispatch();
  const { VendorListAssetType, AssetType } = AssetTypeSelectors(); // asset type wise vendor list
  const { assettypes } = AssetType?.data || [];

  // const CompactorsOptions = {
  //   chart: {
  //     type: "radialBar",
  //     offsetY: -20,
  //     sparkline: {
  //       enabled: true,
  //     },
  //   },
  //   plotOptions: {
  //     radialBar: {
  //       startAngle: -90,
  //       endAngle: 90,
  //       track: {
  //         background: "#F0F0F0", // Color of the non-remaining 22%
  //         strokeWidth: "97%",
  //         margin: 5, // margin is in pixels
  //         dropShadow: {
  //           enabled: true,
  //           top: 2,
  //           left: 0,
  //           color: "#F0F0F0	",
  //           opacity: 1,
  //           blur: 4,
  //         },
  //       },
  //       dataLabels: {
  //         name: {
  //           show: false,
  //         },
  //         value: {
  //           offsetY: -2,
  //           fontSize: "22px",
  //         },
  //       },
  //     },
  //   },
  //   grid: {
  //     padding: {
  //       top: -10,
  //     },
  //   },
  //   fill: {
  //     colors: ["#ff9900"], // Set the color of the radial bar to orange
  //   },
  //   labels: ["Average Results"],
  // };

  // const CompactorsSeries = [90]; // Percentage value for the radial bar

  // const tippersOptions = {
  //   chart: {
  //     type: "radialBar",
  //     offsetY: -20,
  //     sparkline: {
  //       enabled: true,
  //     },
  //   },
  //   plotOptions: {
  //     radialBar: {
  //       startAngle: -90,
  //       endAngle: 90,
  //       track: {
  //         background: "#F0F0F0", // Color of the non-remaining 22%
  //         strokeWidth: "97%",
  //         margin: 5, // margin is in pixels
  //         dropShadow: {
  //           enabled: true,
  //           top: 2,
  //           left: 0,
  //           color: "#F0F0F0	",
  //           opacity: 1,
  //           blur: 4,
  //         },
  //       },
  //       dataLabels: {
  //         name: {
  //           show: false,
  //         },
  //         value: {
  //           offsetY: -2,
  //           fontSize: "22px",
  //         },
  //       },
  //     },
  //   },
  //   grid: {
  //     padding: {
  //       top: -10,
  //     },
  //   },
  //   fill: {
  //     colors: ["#ff9900"], // Set the color of the radial bar to orange
  //   },
  //   labels: ["Average Results"],
  // };
  // const tippersSeries = [78];

  // get vendors data
  const handleShowVendors = (value) => {
    setRowRecord(value);
    setVendorsList([]);
    setAllQuantity(0);
    value?.asset_type_id &&
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

  const vehicleArray = [
    {
      name: "Compactor",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
      icon: (
        <Icon
          icon="uil:compress-arrows"
          width="30"
          height="30"
          className="text-green absolute right-[5px]"
        />
      ),
    },
    {
      name: "Tipper",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600",
      icon: (
        <Icon
          icon="mdi:tipper-lorry"
          width="30"
          height="30"
          className="text-green absolute right-[5px]"
        />
      ),
    },
    {
      name: "Dustbin",
      bgColor: "bg-red-50",
      textColor: "text-red-600",
      icon: (
        <Icon
          icon="icomoon-free:bin2"
          width="30"
          height="30"
          className="text-green absolute right-[5px]"
        />
      ),
    },
    {
      name: "Leaner Bag",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
      icon: (
        <Icon
          icon="bxs:shopping-bags"
          width="30"
          height="30"
          className="text-green absolute right-[5px]"
        />
      ),
    },
  ];

  const mergedArray = useMemo(() => {
    return vehicleArray?.map((item, index) => {
      const match = assettypes?.[index];
      return { ...item, ...match };
    });
  }, [vehicleArray, assettypes]);

  return (
    <>
      <div className="flex  flex-col p-4 w-full  h-full">
        {/* <div className="flex justify-between gap-3 w-full">
          <div
            className="border flex justify-center text-start p-2 flex-col w-full"
            onClick={() => {
              handleShowVendors(AssetType?.data?.assettypes?.[0]);
            }}
          >
            <div className=" font-semibold -mt-0">
              {AssetType?.data?.assettypes?.[0]?.total_quantity || 0}
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
          <div
            className="w-full border flex justify-center text-start p-2 flex-col"
            onClick={() => {
              handleShowVendors(AssetType?.data?.assettypes?.[1]);
            }}
          >
            <div className=" font-semibold -mt-0">
              {AssetType?.data?.assettypes?.[1]?.total_quantity || 0}
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
        </div> */}
        <div className="grid lg:grid-cols-2 h-full gap-4">
          {mergedArray?.map((data) => {
            return (
              <div
                className={`relative p-3 border rounded-md shadow-md bg-blue-50  h-full ${data?.bgColor}`}
                onClick={() => {
                  handleShowVendors(data);
                }}
              >
                <div className="text-start">
                  <div
                    className={`${data?.textColor} font-semibold flex flex-col gap-2 items-start relative`}
                  >
                    <div className="flex items-center gap-2">
                      {data?.icon}
                      <span className={`${data?.textColor}`}>
                        {" "}
                        {data?.name}
                      </span>
                    </div>
                    <h2 className="text-2xl text-blue-500 font-bold">
                      {data?.total_quantity || 0}
                    </h2>
                  </div>
                </div>
              </div>
            );
          })}
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
