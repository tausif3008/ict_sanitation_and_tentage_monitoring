import React from "react";
import { Modal, Table } from "antd";

const ViewVendorsSectors = ({
  title,
  openModal,
  handleCancel,
  tableData,
  footer = 0,
  width = 800,
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
        {tableData?.length > 0 ? (
          <Table
            bordered
            dataSource={tableData}
            rowKey="question_id"
            pagination={false}
            scroll={{ x: 800, y: 400 }}
            columns={column || []}
          />
        ) : (
          <p>No vendors found for this type.</p>
        )}
      </Modal>
    </>
  );
};

export default ViewVendorsSectors;
