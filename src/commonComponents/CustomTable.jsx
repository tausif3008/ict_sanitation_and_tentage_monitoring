import { Pagination, Table } from "antd";
import React from "react";

const CustomTable = ({
  loading,
  scroll,
  columns = [],
  dataSource,
  onPageChange,
  tableSubheading = [],
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
        pagination={false}
      />

      <div className="mt-2 flex justify-between items-center">
        {tableSubheadingEntries?.length > 0 &&
          tableSubheadingEntries?.map(([key, value]) => (
            <div key={key}>
              {key} : {value}
            </div>
          ))}
        <Pagination
          className="mt-4"
          align="end"
          showSizeChanger
          showQuickJumper
          current={dataSource?.currentPage}
          total={dataSource?.totalRecords}
          pageSize={dataSource?.pageLength}
          onChange={handlePageChange}
        />{" "}
      </div>
    </>
  );
};

export default CustomTable;
