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
  const VendorCategoryType = useSelector(
    (state) => state?.assetTypeUpdateEl.vendor_categoryType
  ); // asset main type wise vendor list

  console.log("VendorCategoryType", VendorCategoryType);

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

  // asset main type vendor list dropdown
  const VendorListCategoryType = useMemo(() => {
    return (
      VendorCategoryType?.data?.userdetails?.map((data) => {
        return {
          value: data?.user_id,
          label: data?.user_name,
        };
      }) || []
    );
  }, [VendorCategoryType]);

  return {
    AssetMainType,
    loading,
    AssetMainTypeDrop,
    AssetTypeDrop,
    AssetType,
    SLATypeDrop,
    VendorListAssetType,
    VendorCategoryType,
    VendorListCategoryType,
  };
};

export default AssetTypeSelectors;
