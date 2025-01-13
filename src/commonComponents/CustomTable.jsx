import { Pagination, Table } from "antd";
import React from "react";

const CustomTable = ({
  loading,
  scroll,
  columns = [],
  dataSource,
  onPageChange,
  tableSubheading = [],
  pagination = false,
  ...rest
}) => {
  const handlePageChange = (pageNumber, size) => {
    if (onPageChange) {
      onPageChange(pageNumber, size);
    }
  };

  const tableSubheadingEntries = Object.entries(tableSubheading);

  return (
    <>
      <Table
        loading={loading}
        columns={columns || []}
        bordered
        scroll={scroll || { x: 1600, y: 400 }}
        dataSource={dataSource?.list || []}
        pagination={pagination}
        {...rest}
      />

      <div className="mt-2 flex justify-between items-center">
        {tableSubheadingEntries?.length > 0 &&
          tableSubheadingEntries?.map(([key, value]) => (
            <div key={key}>
              {key} : {value}
            </div>
          ))}
        {!pagination && (
          <Pagination
            className="mt-4"
            align="end"
            showSizeChanger
            showQuickJumper
            current={dataSource?.currentPage}
            total={dataSource?.totalRecords}
            pageSize={dataSource?.pageLength}
            onChange={handlePageChange}
          />
        )}
      </div>
    </>
  );
};

export default CustomTable;
