import React from "react";
import { useSelector } from "react-redux";

const SanitationDashSelector = () => {
  const SanitationDash_data = useSelector(
    (state) => state?.sanitationDashboard.name
  ); // sanitation dashboard
  const loading = useSelector((state) => state?.sanitationDashboard.loading);

  return { SanitationDash_data, loading };
};

export default SanitationDashSelector;
