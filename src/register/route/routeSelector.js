import React, { useMemo } from "react";
import { useSelector } from "react-redux";

const RouteSelector = () => {
  const loading = useSelector((state) => state?.routeSlice.loading);
  const RouteLists = useSelector((state) => state?.routeSlice.name);
  const PickUpPoint = useSelector((state) => state?.routeSlice.point);
  const PickUpPointDropData = useSelector(
    (state) => state?.routeSlice.dropdown_data
  );

  const PickUpPointDropdownData = useMemo(() => {
    return PickUpPointDropData?.data?.pickuppoints?.map((data) => ({
      value: data?.pickup_point_id,
      label: data?.point_name,
    }));
  }, [PickUpPointDropData]);

  return { RouteLists, loading, PickUpPoint, PickUpPointDropdownData };
};

export default RouteSelector;
