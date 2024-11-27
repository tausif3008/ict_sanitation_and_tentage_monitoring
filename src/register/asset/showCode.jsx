import React, { useState } from "react";
import { Modal, Table } from "antd";

const ShowCode = ({ showData, tableData = [] }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(!open);
  const closeModal = () => setOpen(false);

  const column = [
    {
      title: "Unit",
      dataIndex: "unit_no",
      key: "unit_no",
    },
    {
      title: "Unit Code",
      dataIndex: "unit_code",
      key: "unit_code",
    },
  ];

  return (
    <>
      <div
        className="hover:text-blue-500 text-blue-500 cursor-pointer flex justify-evenly"
        onClick={handleOpen}
      >
        {showData}
      </div>
      <Modal
        open={open}
        onCancel={closeModal}
        footer={null}
        title="Show Code"
        width={400}
        height={600}
      >
        <Table
          columns={column || []}
          bordered
          scroll={{ y: 400 }}
          dataSource={tableData || []}
          pagination={false}
        />
      </Modal>
    </>
  );
};

export default ShowCode;
