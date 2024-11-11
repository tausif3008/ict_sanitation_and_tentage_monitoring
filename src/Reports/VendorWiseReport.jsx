// import React, { useEffect, useState } from "react";
// import { Table, Button } from "antd";
// import { useNavigate } from "react-router-dom";
// import { getData } from "../../Fetch/Axios";
// import URLS from "../../urils/URLS";
// import CommonDivider from "../../commonComponents/CommonDivider";

// const columns = [
//   {
//     title: "Sr. No",
//     dataIndex: "sr",
//     key: "sr",
//     width: 80,
//   },
//   {
//     title: "Circle Name",
//     dataIndex: "name",
//     key: "name",
//   },
//   {
//     title: "Sector ID",
//     dataIndex: "sector_id",
//     key: "sector_id",
//   },
//   {
//     title: "Registered",
//     dataIndex: "registered",
//     key: "registered",
//   },
//   {
//     title: "Clean",
//     dataIndex: "clean",
//     key: "clean",
//   },
//   {
//     title: "Unclean",
//     dataIndex: "unclean",
//     key: "unclean",
//   },
// ];

// const VendorWiseReport = () => {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [circleDetails, setCircleDetails] = useState({
//     list: [],
//     pageLength: 25,
//     currentPage: 1,
//   });

//   const getCircleData = async () => {
//     setLoading(true);
//     const uri = URLS.circleReport.path; // Assuming URLS.circleReport is defined
//     const res = await getData(uri);

//     if (res && res.data && res.data.circles) {
//       const data = res.data;
//       const list = data.circles.map((circle, index) => ({
//         ...circle,
//         sr: index + 1,
//       }));

//       setCircleDetails({
//         list,
//         pageLength: data.paging[0].length,
//         currentPage: data.paging[0].currentpage,
//         totalRecords: data.paging[0].totalrecords,
//       });
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     getCircleData();
//   }, []);

//   return (
//     <div>
//       <CommonDivider
//         label={"Circle Report"}
//         compo={
//           <Button
//             onClick={() => navigate("/circle-registration")}
//             className="bg-orange-300 mb-1"
//           >
//             Add Circle
//           </Button>
//         }
//       />
//       <div className="h-3"></div>
//       <Table
//         loading={loading}
//         columns={columns}
//         dataSource={circleDetails.list}
//         pagination={{
//           pageSize: circleDetails.pageLength,
//           current: circleDetails.currentPage,
//           total: circleDetails.totalRecords,
//         }}
//         rowKey="circle_id"
//       />
//     </div>
//   );
// };

// export default VendorWiseReport;
