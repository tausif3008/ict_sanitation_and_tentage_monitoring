import React from "react";
import { Modal, Table } from "antd";

const ViewVendorsSectors = ({
  title,
  openModal,
  loading = false,
  handleCancel,
  tableData = [],
  footer = false,
  width = 800,
  scroll,
  column = [],
  tableHeaderData = [],
  IsLastRowBold = false,
}) => {
  const rowClassName = (record, index) => {
    return index === tableData?.length - 1
      ? "bg-green-100 text-black font-bold"
      : "";
  };

  return (
    <>
      <Modal
        title={
          <div>
            <h5>{title} :</h5>
          </div>
        }
        loading={loading}
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
            scroll={scroll || { x: 800, y: 400 }}
            columns={column || []}
            rowClassName={IsLastRowBold ? rowClassName : null}
          />
        ) : (
          <p>No vendors found for this type.</p>
        )}
      </Modal>
    </>
  );
};

export default ViewVendorsSectors;
