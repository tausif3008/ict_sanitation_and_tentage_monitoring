import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ condition, component: Component }) => {
  const sessionDataString = localStorage.getItem("sessionData");
  const sessionData = sessionDataString ? JSON.parse(sessionDataString) : null;

  if (!condition) {
    if (sessionData) {
      if (sessionData?.user_type_id === "8") {
        if (sessionData?.allocatedmaintype?.[0]?.asset_main_type_id === "2") {
          return <Navigate to="/tentage-dashboard" />;
        } else {
          return <Navigate to="/vendor-dashboard" />;
        }
      } else {
        return <Navigate to="/sanitation-dashboard" />;
      }
    }
    return <Navigate to="/login" />;
  }
  return <Component />;
};

export default ProtectedRoute;
