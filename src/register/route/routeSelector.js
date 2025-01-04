import React from "react";
import { useSelector } from "react-redux";

const RouteSelector = () => {
  const loading = useSelector((state) => state?.routeSlice.loading);
  const RouteList = useSelector((state) => state?.routeSlice.name);
  const PickUpPoint = useSelector((state) => state?.routeSlice.point);

  return { RouteList, loading, PickUpPoint };
};

export default RouteSelector;
