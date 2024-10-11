import { Pagination, Table } from "antd";
import React from "react";
import { useNavigate } from "react-router";

const CommonTable = ({ columns, uri, details, loading, scroll }) => {
  const navigate = useNavigate();

  const handlePageChange = (pageNumber, page) => {
    if (isNaN(pageNumber)) {
      pageNumber = 1;
    }

    let path = "/" + uri + "/page=" + pageNumber + "&per_page=" + page;
    navigate(path);
  };

  return (
    <div>
      <Table
        loading={loading}
        columns={columns}
        bordered
        scroll={scroll || { x: 1600, y: 400 }}
        dataSource={details.list || []}
        pagination={false}
      />

      <div className="mt-2 flex justify-between items-center">
        {<div>Total: {details.totalRecords}</div>}
        <Pagination
          align="end"
          showSizeChanger
          showQuickJumper
          current={details.currentPage}
          total={details.totalRecords}
          pageSize={details.pageLength}
          onChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default CommonTable;
