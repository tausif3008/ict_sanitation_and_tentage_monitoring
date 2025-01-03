import React, { useCallback, useEffect, useState } from "react";
import { useOutletContext } from "react-router";
import { useDispatch } from "react-redux";
import SanitationDashSelector from "./Slice/sanitationDashboardSelector";
import URLS from "../urils/URLS";
import { getAssetTypes } from "../register/AssetType/AssetTypeSlice";
import AssetTypeSelectors from "../register/AssetType/assetTypeSelectors";
import ViewVendorsSectors from "../register/AssetType/viewVendors";
import UserCard from "../commonComponents/DashboardCard/UserCard";
import TotalToilte from "../commonComponents/DashboardCard/TotalToilte";
import TotalRegister from "../commonComponents/DashboardCard/TotalRegister";
import UnderMonitoring from "../commonComponents/DashboardCard/UnderMonitoring";
import OffMonitoring from "../commonComponents/DashboardCard/OffMonitoring";

const ToiletsCount = () => {
  const [dict, lang] = useOutletContext();
  const [showTable, setShowTable] = useState(false); // total quantity
  const [showRegisterTable, setShowRegisterTable] = useState(false); // register quantity
  const [showTableList, setTableList] = useState({ list: [] }); // vendor list

  const dispatch = useDispatch();
  const { SanitationDash_data, loading } = SanitationDashSelector(); // sanitation dashboard ( api call in details page of vendor dashboard)
  const { AssetType } = AssetTypeSelectors(); // asset type

  useEffect(() => {
    if (AssetType) {
      setTableList({ list: AssetType.data.assettypes });
    }
  }, [AssetType]);

  const {
    off_monitoring = 0,
    under_monitoring = 0,
    total = 0,
    registered = 0,
    todays_registered = 0,
    todays_under_monitoring = 0,
    todays_allocated = 0,
  } = SanitationDash_data?.data?.asset_counts || {};

  const url = URLS?.assetType?.path + 1;

  // total quantity
  const handleTotal = useCallback(async () => {
    dispatch(getAssetTypes(url)); // get assset type
    setShowTable(true);
  }, [url]);

  // register quantity
  const handleRegister = useCallback(async () => {
    dispatch(getAssetTypes(url)); // get assset type
    setShowRegisterTable(true);
  }, [url]);

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

  const nameColumn = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      // width: "60%",
    },
  ];

  // total quantity
  const tableColumn = [
    ...nameColumn,
    {
      title: "Total Quantity",
      dataIndex: "total_quantity",
      key: "total_quantity",
      width: "20%",
    },
  ];

  // register quantity
  const registerColumn = [
    ...nameColumn,
    {
      title: "Registered Quantity",
      dataIndex: "registered",
      key: "registered",
      width: "20%",
      render: (text) => {
        return text ? text : 0;
      },
    },
  ];

  return (
    <>
      <UserCard />
      <div className="p-3 mx-auto bg-white rounded-xl space-y-4">
        <div className="text-xl font-bold mb-4">
          {dict.sanitation_toilets_count[lang]}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-1 md:grid-cols-2 sm:grid-cols-2 gap-4">
          <TotalToilte handleTotal={handleTotal} total={total} />
          <TotalRegister
            handleRegister={handleRegister}
            registered={registered}
            today={todays_registered}
          />
          <UnderMonitoring
            total={under_monitoring}
            today={todays_under_monitoring}
          />
          <OffMonitoring total={off_monitoring} />
        </div>

        {/* total quantity */}
        <ViewVendorsSectors
          title={"Toilet List"}
          openModal={showTable}
          handleCancel={handleCancel}
          tableData={showTableList?.list || []}
          column={tableColumn || []}
          footer={`Total Quantity : ${allQuantity}`}
        />

        {/* Register quantity */}
        <ViewVendorsSectors
          title={"Register Toilet List"}
          openModal={showRegisterTable}
          handleCancel={handleCancel}
          tableData={showTableList?.list || []}
          column={registerColumn || []}
          footer={`Register Quantity : ${RegisteredQuantity}`}
          // footer={`Register Quantity : ${RegisteredQuantity} Register Quantity : ${RegisteredQuantity}`}
        />
      </div>
    </>
  );
};

export default ToiletsCount;
