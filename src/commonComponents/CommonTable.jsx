import React from "react";
import { useNavigate } from "react-router";
import { Pagination, Table } from "antd";

const CommonTable = ({
  columns,
  uri,
  details,
  loading,
  scroll,
  totalName = "Total",
  subtotalName = undefined,
  subtotalCount = 0,
  tableSubheading = [],
  ...paginationRest
}) => {
  const navigate = useNavigate();

  const handlePageChange = (pageNumber, page) => {
    if (isNaN(pageNumber)) {
      pageNumber = 1;
    }

    let path = "/" + uri + "/page=" + pageNumber + "&per_page=" + page;
    navigate(path);
  };

  const tableSubheadingEntries = Object.entries(tableSubheading);

  return (
    <div>
      <Table
        loading={loading}
        columns={columns || []}
        bordered
        scroll={scroll || { x: 1600, y: 400 }}
        dataSource={details?.list || []}
        pagination={false}
      />

      {details?.pageLength && (
        <div className="mt-2 flex justify-between items-center">
          <div>
            {totalName} : {details?.totalRecords}
          </div>
          {subtotalName && (
            <div>
              {subtotalName} : {subtotalCount}
            </div>
          )}
          {tableSubheadingEntries?.length > 0 &&
            tableSubheadingEntries?.map(([key, value]) => (
              <div key={key}>
                {key} : {value}
              </div>
            ))}

          <Pagination
            align="end"
            showSizeChanger
            showQuickJumper
            current={details?.currentPage}
            total={details?.totalRecords}
            pageSize={details?.pageLength}
            onChange={handlePageChange}
            {...paginationRest}
          />
        </div>
      )}
    </div>
  );
};

export default CommonTable;
