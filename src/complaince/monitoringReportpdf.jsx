import React from "react";
// import html2pdf from "html2pdf.js";
import moment from "moment";
import { IMAGELIST } from "../assets/Images/exportImages";

export const DownloadPDF = ({ assetDetails, details = [] }) => {
  const tableHTML = `
          <div style="padding: 20px; margin-bottom: 30px;">
            <img 
              src="${IMAGELIST?.govt_logo}" 
              style="position: absolute; left: 20px; top: 5px; height: 90px; width: 90px; margin-left: 20px; margin-top: 20px;" 
            />
        
            <img 
              src="${IMAGELIST?.kumbhMela}" 
              style="position: absolute; right: 20px; top: 5px; height: 90px; width: 90px; margin-right: 20px; margin-top: 20px;" 
            />
        
            <h3 style="text-align: center; margin-bottom: 30px;">Maha Kumbh 2025</h3>
            <h5 style="text-align: center; margin-bottom: 30px;">ICT Sanitation and Tentage Monitoring System</h5>
        
            <!-- Vendor Info Table -->
            <div style="margin: 20px;">
              <table style="width: 100%; border: 1px solid #ddd; border-collapse: collapse; margin-bottom: 20px;">
                <tbody>
                  <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd; width: 50%;"><strong>Category</strong></td>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">${
                      assetDetails?.asset_main_type_name
                    }</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd; width: 50%;"><strong>Type</strong></td>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">${
                      assetDetails?.asset_type_name
                    }</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd; width: 50%;"><strong>Vendor Name</strong></td>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">${
                      assetDetails?.vendor_name
                    }</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Sector</strong></td>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">${
                      assetDetails?.sector_name
                    }</td>
                  </tr>
                  ${
                    assetDetails?.asset_main_type_id === "2"
                      ? `
                    <tr>
                      <td style="padding: 8px; border-bottom: 1px solid #ddd;">
                        <strong>Sanstha Name</strong>
                      </td>
                      <td style="padding: 8px; border-bottom: 1px solid #ddd;">
                        ${assetDetails?.sanstha_name_hi || ""}
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 8px; border-bottom: 1px solid #ddd;">
                        <strong>Mela Patri Name</strong>
                      </td>
                      <td style="padding: 8px; border-bottom: 1px solid #ddd;">
                        ${assetDetails?.mela_patri_name || ""}
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 8px; border-bottom: 1px solid #ddd;">
                        <strong>Mela Road Name</strong>
                      </td>
                      <td style="padding: 8px; border-bottom: 1px solid #ddd;">
                        ${assetDetails?.mela_road_name || ""}
                      </td>
                    </tr>
                  `
                      : `
                    <tr>
                      <td style="padding: 8px; border-bottom: 1px solid #ddd;">
                        <strong>Circle</strong>
                      </td>
                      <td style="padding: 8px; border-bottom: 1px solid #ddd;">
                        ${assetDetails?.circle_name}
                      </td>
                    </tr>
                  `
                  }
                  
                  <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>${
                      assetDetails?.asset_main_type_id === "2"
                        ? "TAF ID"
                        : "PTC ID"
                    }</strong></td>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">${`${assetDetails?.code}-${assetDetails?.unit_no}`}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Submitted Date</strong></td>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">${moment(
                      assetDetails?.submitted_date
                    ).format("DD-MMM-YYYY  hh:mm A")}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Remark</strong></td>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">${
                      assetDetails?.remark
                    }</td>
                  </tr>
                </tbody>
              </table>
            </div>
        
            <!-- Monitoring Report Table -->
            <div style="margin: 20px;">
              <h3 style="text-align: center; margin-bottom: 30px;">Monitoring Report</h3>
              <table style="width: 100%; border: 1px solid #ddd; border-collapse: collapse; margin-bottom: 20px;">
                <thead>
                  <tr style="background-color: #187bcd; color:white">
                    <th style=" padding: 8px; text-align: center; border-bottom: 2px solid #ddd;">Sr.</th>
                    <th style=" padding: 8px; text-align: center; border-bottom: 2px solid #ddd;">Question (English)</th>
                    <th style=" padding: 8px; text-align: center; border-bottom: 2px solid #ddd;">Question (Hindi)</th>
                    <th style=" padding: 8px; text-align: center; border-bottom: 2px solid #ddd;">Answer</th>
                  </tr>
                </thead>
                <tbody>
                  ${details
                    .map(
                      (item, index) => `
                        <tr style="background-color: ${
                          index % 2 === 0 ? "#f0f0f0" : "white"
                        };">
                          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${
                            index + 1
                          }</td>
                          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${
                            item?.question_en || "N/A"
                          }</td>
                          <td style="padding: 8px; border-bottom: 1px solid #ddd; font-family: 'Noto Sans Devanagari', sans-serif;">${
                            item?.question_hi || "N/A"
                          }</td>
                          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${
                            item?.answer === "1" ? "Yes" : "No"
                          }</td>
                        </tr>`
                    )
                    .join("")}
                </tbody>
              </table>
            </div>
      
           <!-- Instructions Section (Focused part) -->
            <div style="margin-top: 30px; font-size: 14px; line-height: 1.6; background-color: #f0f0f0; padding: 15px; border-radius: 5px;">
              <strong>Instructions:</strong>
              <p>If non-compliance with Operation & Maintenance is found and not resolved within the specified TAT, then a penalty would be imposed as mentioned in RFP.</p>
            </div>
        
            <!-- Footer Text -->
            <div style="margin-top: 40px;">
              <hr style="border: 0; border-top: 2px solid black; margin-bottom: 10px;">
              <div style="text-align: center; font-size: 14px; color: #333;">
                Copyright © 2024-2025 Prayagraj Mela Authority. All Rights Reserved.
                <br>
                Hosted by Prayagraj Mela Authority.
              </div>
            </div>
          </div>
        `;

  // Create a hidden div for the content to be exported as PDF
  const element = document.createElement("div");
  element.innerHTML = tableHTML;

  // Set some general margin and padding styles for better spacing
  const styles = `
          @page {
            margin: 20mm;
          }
      
          .table-container {
            margin-bottom: 20px;
          }
      
          table {
            border-collapse: collapse;
            width: 100%;
            margin-bottom: 20px;
          }
      
          td, th {
            border: 1px solid #ddd;
          }
      
          h1 {
            text-align: center;
          }
      
          .page-break {
            page-break-before: always;
          }
      
          /* Styling to ensure instructions section is not hidden or cut off */
        //   div {
        //     page-break-inside: avoid;
        //   }
        `;

  // Add styles to the page to handle margins, breaks, and other layout issues
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);

  // Use html2pdf to generate the PDF with custom styles
  // html2pdf().from(element).save("MonitoringReport.pdf");
};
