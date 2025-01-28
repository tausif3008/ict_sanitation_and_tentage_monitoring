import React from "react";
import { useSelector } from "react-redux";

const AttendanceSelector = () => {
  const AttendanceData = useSelector((state) => state?.attendanceSlice.name);
  const loading = useSelector((state) => state?.attendanceSlice.loading);

  return { AttendanceData, loading };
};

export default AttendanceSelector;
