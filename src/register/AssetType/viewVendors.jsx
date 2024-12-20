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
  tableHeaderData = [],
}) => {
  return (
    <>
      <Modal
        title={
          <div>
            <h5>{title} :</h5>
          </div>
        }
        open={openModal}
        onCancel={handleCancel}
        footer={footer}
        width={width}
      >
        {tableHeaderData?.length > 0 && (
          <div className="mb-4">
            {tableHeaderData?.map((data, index) => (
              <p key={index}>
                <strong>{data?.label}:</strong> {data?.value}
              </p>
            ))}
          </div>
        )}
        {tableData?.length > 0 ? (
          <Table
            bordered
            dataSource={tableData}
            rowKey="question_id"
            pagination={false}
            // scroll={{ x: 800, y: 400 }}
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
