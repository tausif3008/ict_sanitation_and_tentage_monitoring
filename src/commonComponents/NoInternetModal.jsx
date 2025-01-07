import React from "react";

const NoInternetModal = ({ isOpen }) => {
  if (!isOpen) return null; // Don't render if the modal isn't open

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <h2 className="text-xl font-semibold text-center text-red-600">
          No Internet Connection
        </h2>
        <p className="text-center text-gray-600 mt-4">
          Please check your internet connection and try again.
        </p>
        <div className="flex justify-center mt-4">
          <button
            className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg"
            onClick={() => {
              window.location.reload(); // Refresh the page
            }}
          >
            Refresh Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoInternetModal;
