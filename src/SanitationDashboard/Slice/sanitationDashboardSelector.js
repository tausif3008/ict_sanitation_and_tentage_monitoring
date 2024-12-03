import React, { useMemo } from "react";
import { useSelector } from "react-redux";

const SanitationDashSelector = () => {
  const SanitationDash_data = useSelector(
    (state) => state?.sanitationDashboard.name
  ); // sanitation dashboard
  const DashboardData = useSelector(
    (state) => state?.sanitationDashboard.dash_data
  ); //  dashboard
  const loading = useSelector((state) => state?.sanitationDashboard.loading);

  // dashboard Dropdown
  const Dash_Drop = useMemo(() => {
    return (
      DashboardData?.data?.asset_count?.map(({ asset_type_id, type }) => ({
        value: asset_type_id,
        label: type,
      })) || []
    );
  }, [DashboardData]);

  return { SanitationDash_data, loading, DashboardData, Dash_Drop };
};

export default SanitationDashSelector;
