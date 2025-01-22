import React from "react";
import { Modal, Table } from "antd";
import ExportToPDF from "../../Reports/reportFile";
import ExportToExcel from "../../Reports/ExportToExcel";

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

  showPdfbutton = false,
  showExcelbutton = false,
  pdfTitleName = "pdf title",
  pdfName = "pdf name",
  pdfHeader = [],
  tablePdfData = [],
  ...rest
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
        {...rest}
      >
        <div className="grid grid-cols-2">
          {tableHeaderData?.length > 0 && (
            <div className="mb-4">
              {tableHeaderData?.map((data, index) => (
                <p key={index}>
                  <strong>{data?.label}:</strong> {data?.value}
                </p>
              ))}
            </div>
          )}
          {(showExcelbutton || showPdfbutton) && (
            <div className="flex justify-end gap-2 font-semibold">
              {showPdfbutton && (
                <ExportToPDF
                  titleName={pdfTitleName}
                  pdfName={pdfName}
                  headerData={pdfHeader}
                  IsLastLineBold={true}
                  rows={tablePdfData}
                />
              )}
              {/* <div>
              <ExportToExcel
              // excelData={excelData || []}
              // fileName={
              //   fileName
              //     ? `Sector Wise Registration Report ${fileName}`
              //     : "Sector Wise Registration Report"
              // }
              // dynamicArray={[
              //   {
              //     name: "Total",
              //     value: vendorData?.totalUnits,
              //     colIndex: 3,
              //   },
              // ]}
              />
            </div> */}
            </div>
          )}
        </div>
        {tableData?.length > 0 ? (
          <Table
            bordered
            dataSource={tableData}
            rowKey="question_id"
            pagination={false}
            scroll={scroll || { x: 500, y: 400 }}
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
