import React from "react";
import { useSelector } from "react-redux";

const UserSelectors = () => {
  const UsersData = useSelector((state) => state?.userSlice.nameList);
  const loading = useSelector((state) => state?.userSlice.loading);

  const UsersDropdown = UsersData?.data?.users?.map((data) => {
    // users dropdown
    return (
      {
        value: data?.user_id,
        label: data?.name,
      } || []
    );
  });

  return {
    UsersData,
    loading,
    UsersDropdown,
  };
};

export default UserSelectors;
