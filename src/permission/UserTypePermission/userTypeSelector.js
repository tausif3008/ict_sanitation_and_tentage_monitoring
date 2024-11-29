import React, { useMemo } from "react";
import { useSelector } from "react-redux";

const UserTypeSelector = () => {
  const allModulePermission = useSelector((state) => state?.userTypeSlice.name);
  const loading = useSelector((state) => state?.userTypeSlice.loading);
  const UserList = useSelector((state) => state?.userTypeSlice.user_list || []); // user type list
  const ModuleList = useSelector(
    (state) => state?.userTypeSlice.module_list || []
  ); // module list

  const UserListDrop = useMemo(() => {
    return (
      UserList?.data?.user_type?.map((data) => ({
        label: data?.user_type,
        value: data?.user_type_id,
      })) || []
    );
  }, [UserList]);

  const ModuleListDrop = useMemo(() => {
    return (
      ModuleList?.data?.modules?.map((data) => ({
        label: data?.name,
        value: data?.module_id,
      })) || []
    );
  }, [ModuleList]);

  return {
    UserList,
    loading,
    UserListDrop,
    allModulePermission,
    ModuleListDrop,
  };
};

export default UserTypeSelector;
