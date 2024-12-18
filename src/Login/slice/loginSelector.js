import React from "react";
import { useSelector } from "react-redux";

const LoginSelectors = () => {
  const sliceToken = useSelector((state) => state?.loginSlice.token_data); // token
  const loading = useSelector((state) => state?.loginSlice.loading);

  return {
    sliceToken,
    loading,
  };
};

export default LoginSelectors;
