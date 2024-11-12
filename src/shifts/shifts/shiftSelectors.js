import React from "react";
import { useSelector } from "react-redux";

const ShiftSelectors = () => {
  const ShiftData = useSelector((state) => state?.shiftSlice.name);
  const loading = useSelector((state) => state?.shiftSlice.loading);

  return { ShiftData, loading };
};

export default ShiftSelectors;
