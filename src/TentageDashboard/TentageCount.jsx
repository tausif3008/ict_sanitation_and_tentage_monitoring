import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router";
import { useDispatch } from "react-redux";
import TentageSelector from "./Slice/tentageSelector";
import ViewVendorsSectors from "../register/AssetType/viewVendors";
import URLS from "../urils/URLS";
import { getAssetTypes } from "../register/AssetType/AssetTypeSlice";
import AssetTypeSelectors from "../register/AssetType/assetTypeSelectors";
import UserCard from "../commonComponents/DashboardCard/UserCard";
import TotalRegister from "../commonComponents/DashboardCard/TotalRegister";
import TotalToilte from "../commonComponents/DashboardCard/TotalToilte";
import UnderMonitoring from "../commonComponents/DashboardCard/UnderMonitoring";
import OffMonitoring from "../commonComponents/DashboardCard/OffMonitoring";
import { registerColumn, tableColumn } from "../constant/const";

const TentageCount = () => {
  const [dict, lang] = useOutletContext();
  const [showTable, setShowTable] = useState(false); // total quantity
  const [showRegisterTable, setShowRegisterTable] = useState(false); // register quantity
  const [showTableList, setTableList] = useState({ list: [] }); // vendor list

  const dispatch = useDispatch();
  const { AssetType } = AssetTypeSelectors(); // asset type

  const { TentageDash_data } = TentageSelector(); // tentage dashboard
  const {
    total = 0,
    registered = 0,
    under_monitoring = 0,
    off_monitoring = 0,
    todays_registered = 0,
    todays_monitaring = 0,
    todays_allocated = 0,
  } = TentageDash_data?.data?.asset_counts || {};

  const userId = localStorage.getItem("userId");
  const url = URLS?.assetType?.path + 2 + `&vendor_id=${userId || ""}`;

  // total quantity
  const handleTotal = async () => {
    dispatch(getAssetTypes(url)); // get assset type
    setShowTable(true);
  };

  // register quantity
  const handleRegister = async () => {
    dispatch(getAssetTypes(url)); // get assset type
    setShowRegisterTable(true);
  };

  // close module
  const handleCancel = () => {
    setShowTable(false);
    setShowRegisterTable(false);
  };

  const allQuantity = showTableList?.list?.reduce((data, data2) => {
    return data + (Number(data2?.total_quantity) || 0);
  }, 0); // total quantity

  const RegisteredQuantity = showTableList?.list?.reduce((data, data2) => {
    return data + (Number(data2?.registered) || 0);
  }, 0); // register quantity

  useEffect(() => {
    if (AssetType) {
      setTableList({ list: AssetType.data.assettypes });
    }
  }, [AssetType]);

  return (
    <>
      <UserCard />
      <div className="p-3 mx-auto bg-white rounded-xl space-y-4">
        <div className="text-xl font-bold mb-4">{dict.tentage_count[lang]}</div>
        <div className="grid grid-cols-1 lg:grid-cols-1 md:grid-cols-2 sm:grid-cols-2 gap-4">
          <TotalToilte handleTotal={handleTotal} total={total} />
          <TotalRegister
            handleRegister={handleRegister}
            registered={registered}
            today={todays_registered}
          />
          <UnderMonitoring total={under_monitoring} today={todays_monitaring} />
          <OffMonitoring total={off_monitoring} />
        </div>
        {/* total quantity */}
        <ViewVendorsSectors
          title={"Total Tentage List"}
          openModal={showTable}
          handleCancel={handleCancel}
          tableData={showTableList?.list || []}
          column={tableColumn || []}
          footer={`Total Quantity : ${allQuantity}`}
        />

        {/* Register quantity */}
        <ViewVendorsSectors
          title={"Register Tentage List"}
          openModal={showRegisterTable}
          handleCancel={handleCancel}
          tableData={showTableList?.list || []}
          column={registerColumn || []}
          footer={`Register Quantity : ${RegisteredQuantity}`}
        />
      </div>
    </>
  );
};

export default TentageCount;
