import React, { useMemo } from "react";
import { useSelector } from "react-redux";

const UserSelectors = () => {
  const UsersData = useSelector((state) => state?.userSlice.nameList);
  const loading = useSelector((state) => state?.userSlice.loading);

  const UsersDropdown = useMemo(() => {
    return (
      UsersData?.data?.users?.map((data) => {
        return {
          value: data?.user_id,
          label: data?.name,
        };
      }) || []
    );
  }, [UsersData]);

  return {
    UsersData,
    loading,
    UsersDropdown,
  };
};

export default UserSelectors;
