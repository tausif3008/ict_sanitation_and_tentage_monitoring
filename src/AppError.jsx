import React from "react";
import { Link } from "react-router-dom";
import { Button } from "antd";

const AppError = () => {
  // return (
  //   <div className="flex h-screen w-screen justify-center items-center">
  //     <div className="p-3 flex justify-center items-center border rounded flex-col flex-wrap ">
  //       <span className="mb-2">Page Not Found</span>
  //       <Link to="/">
  //         <Button className="bg-lime-500 font-semibold">Go Back</Button>
  //       </Link>
  //     </div>
  //   </div>
  // );
  return (
    <div className="flex h-screen w-screen justify-center items-center bg-gray-100">
      <div className="p-6 flex justify-center items-center border rounded-lg shadow-lg bg-white flex-col space-y-4">
        <h1 className="text-2xl font-bold text-center text-gray-800">
          Something Went Wrong!
        </h1>
        <p className="text-center text-gray-600">
          Oops! Something went wrong on our end. Please try again later, and if
          the issue persists, contact our support team for assistance. We're
          here to help!
        </p>
        <Link to="/">
          <Button className="bg-blue-500 text-black font-semibold py-2 px-4 rounded-lg">
            Back to Home Page
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default AppError;
