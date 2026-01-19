import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { Context } from "../Context/Context";

const AdminRoute = ({ children }) => {
  const { user } = useContext(Context);

  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
