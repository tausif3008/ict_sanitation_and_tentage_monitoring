import React, { useMemo } from "react";
import { useSelector } from "react-redux";

const AssetTypeSelectors = () => {
  const AssetMainType = useSelector((state) => state?.assetTypeUpdateEl.name); // asset main type data
  const AssetType = useSelector((state) => state?.assetTypeUpdateEl.type_data); // asset type data
  const loading = useSelector((state) => state?.assetTypeUpdateEl.loading);
  const SlaData = useSelector((state) => state?.assetTypeUpdateEl.sla_data); // Sla Data
  const VendorListAssetType = useSelector(
    (state) => state?.assetTypeUpdateEl.vendor_assetType
  ); // asset type wise vendor list

  // asset main type dropdown
  const AssetMainTypeDrop = useMemo(() => {
    return (
      AssetMainType?.data?.assetmaintypes?.map((data) => {
        return {
          value: data?.asset_main_type_id,
          label: data?.name,
        };
      }) || []
    );
  }, [AssetMainType]);

  // asset type dropdown
  const AssetTypeDrop = useMemo(() => {
    return (
      AssetType?.data?.assettypes?.map((data) => {
        return {
          value: data?.asset_type_id,
          label: data?.name,
        };
      }) || []
    );
  }, [AssetType]);

  // SLA dropdown
  const SLATypeDrop = useMemo(() => {
    return (
      SlaData?.data?.slatypes?.map((data) => {
        return {
          value: data?.sla_type_id,
          label: data?.name,
        };
      }) || []
    );
  }, [SlaData]);

  return {
    AssetMainType,
    loading,
    AssetMainTypeDrop,
    AssetTypeDrop,
    AssetType,
    SLATypeDrop,
    VendorListAssetType,
  };
};

export default AssetTypeSelectors;
