import { Pagination, Table } from "antd";
import React, { useState } from "react";

const CustomTable = ({
  loading,
  scroll,
  columns = [],
  dataSource,
  onPageChange,
  tableSubheading = [],
  pagination = false,
  pageSize = 10,
  ...rest
}) => {
  const [curPage, setCurPage] = useState({
    pageNo: 1,
    pageSize: pageSize,
  });

  const handleCurrentPageChange = (pageNumber, size) => {
    setCurPage({
      pageNo: pageNumber,
      pageSize: size,
    });
  };

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
        // pagination={pagination}
        pagination={
          pagination
            ? {
                current: curPage?.pageNo || 1, // current page
                total: dataSource?.list?.length || 0, // total records
                pageSize: curPage?.pageSize, // page size
                onChange: handleCurrentPageChange, // handle page change
                showSizeChanger: true, // option to change page size
                pageSizeOptions: ["10", "20", "50", "100"], // page size options
              }
            : false
        }
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
