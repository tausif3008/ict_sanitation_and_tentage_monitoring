import React from "react";
import { useSelector } from "react-redux";

const AssetTypeSelectors = () => {
  const AssetMainType = useSelector((state) => state?.assetTypeUpdateEl.name); // asset main type data
  const AssetType = useSelector((state) => state?.assetTypeUpdateEl.type_data); // asset type data
  const loading = useSelector((state) => state?.assetTypeUpdateEl.loading);

  const AssetMainTypeDrop = AssetMainType?.data?.assetmaintypes?.map((data) => {
    // asset main type dropdown
    return (
      {
        value: data?.asset_main_type_id,
        label: data?.name,
      } || []
    );
  });
  const AssetTypeDrop = AssetType?.data?.assettypes?.map((data) => {
    // asset type dropdown
    return (
      {
        value: data?.asset_type_id,
        label: data?.name,
      } || []
    );
  });

  // console.log("AssetType", AssetType);
  // console.log("AssetTypeDrop", AssetTypeDrop);

  return { AssetMainType, loading, AssetMainTypeDrop, AssetTypeDrop };
};

export default AssetTypeSelectors;
