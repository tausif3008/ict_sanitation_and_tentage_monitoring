import React from "react";
import { useSelector } from "react-redux";

const AssetTypeSelectors = () => {
  const AssetMainType = useSelector((state) => state?.assetTypeUpdateEl.name); // asset main type data
  const AssetType = useSelector((state) => state?.assetTypeUpdateEl.type_data); // asset type data
  const loading = useSelector((state) => state?.assetTypeUpdateEl.loading);
  const SlaData = useSelector((state) => state?.assetTypeUpdateEl.sla_data); // Sla Data
  const VendorListAssetType = useSelector(
    (state) => state?.assetTypeUpdateEl.vendor_assetType
  ); // asset type wise vendor list

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
  const SLATypeDrop = SlaData?.data?.slatypes?.map((data) => {
    // Sla dropdown
    return (
      {
        value: data?.sla_type_id,
        label: data?.name,
      } || []
    );
  });

  return {
    AssetMainType,
    loading,
    AssetMainTypeDrop,
    AssetTypeDrop,
    SLATypeDrop,
    VendorListAssetType,
  };
};

export default AssetTypeSelectors;
