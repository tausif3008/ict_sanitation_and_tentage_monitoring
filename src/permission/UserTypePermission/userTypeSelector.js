import React from "react";
import { useSelector } from "react-redux";

const UserTypeSelector = () => {
  const allModulePermission = useSelector((state) => state?.userTypeSlice.name);
  const loading = useSelector((state) => state?.userTypeSlice.loading);
  const UserList = useSelector((state) => state?.userTypeSlice.user_list || []); // user type list
  const ModuleList = useSelector(
    (state) => state?.userTypeSlice.module_list || []
  ); // module list


  const UserListDrop = UserList?.data?.user_type?.map((data) => {
    return (
      {
        label: data?.user_type,
        value: data?.user_type_id,
      } || []
    );
  });
  const ModuleListDrop = ModuleList?.data?.modules?.map((data) => {
    return (
      {
        label: data?.name,
        value: data?.module_id,
      } || []
    );
  });

  return {
    UserList,
    loading,
    UserListDrop,
    allModulePermission,
    ModuleListDrop,
  };
};

export default UserTypeSelector;
