import React from "react";
import { useSelector } from "react-redux";

const RouteSelector = () => {
  const RouteList = useSelector((state) => state?.routeSlice.name);
  const loading = useSelector((state) => state?.routeSlice.loading);
  return { RouteList, loading };
};

export default RouteSelector;
