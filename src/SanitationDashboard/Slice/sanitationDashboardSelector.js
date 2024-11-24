import React from "react";
import { useSelector } from "react-redux";

const SanitationDashSelector = () => {
  const SanitationDash_data = useSelector(
    (state) => state?.sanitationDashboard.name
  ); // sanitation dashboard
  const DashboardData = useSelector(
    (state) => state?.sanitationDashboard.dash_data
  ); //  dashboard
  const loading = useSelector((state) => state?.sanitationDashboard.loading);

  const Dash_Drop = DashboardData?.data?.asset_count?.map((data) => {
    // dashboard Dropdown
    return (
      {
        value: data?.asset_type_id,
        label: data?.type,
      } || []
    );
  });

  return { SanitationDash_data, loading, DashboardData,Dash_Drop };
};

export default SanitationDashSelector;
