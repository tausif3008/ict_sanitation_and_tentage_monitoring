import React from "react";
import { Modal, Table } from "antd";
import CommonTable from "../CommonTable";

const ViewTableData = ({
  title,
  openModal,
  handleCancel,
  tableData = [],
  footer = 0,
  width = 800,
  noDataFound = "No data found.",
  uri = "",
  loading = false,
  column = [],
}) => {
  return (
    <>
      <Modal
        title={title}
        open={openModal}
        onCancel={handleCancel}
        footer={footer}
        width={width}
      >
        {tableData?.list?.length > 0 ? (
          <Table
            columns={column || []}
            // uri={uri}
            dataSource={tableData?.list || []}
            loading={loading}
            scroll={{ x: 800, y: 400 }}
          ></Table>
        ) : (
          //   <CommonTable
          //     columns={column || []}
          //     uri={uri}
          //     dataSource={tableData}
          //     loading={loading}
          //     scroll={{ x: 800, y: 400 }}
          //   ></CommonTable>
          //   <CommonTable
          //     columns={column || []}
          //     uri={uri}
          //     dataSource={tableData}
          //     loading={loading}
          //     scroll={{ x: 800, y: 400 }}
          //   ></CommonTable>
          <p>{noDataFound}</p>
        )}
      </Modal>
    </>
  );
};

export default ViewTableData;
