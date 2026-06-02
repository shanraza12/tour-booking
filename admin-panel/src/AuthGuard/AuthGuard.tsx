import { Navigate, Outlet } from "react-router";
import { getLocalItem } from "../helpers/storageUtils";
const AuthGuard = ({ requiredRole }:{requiredRole:string}) => {
  const token = getLocalItem("token"); 
  if (!token) return <Navigate to="/signin" replace />;
  if (requiredRole) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
    
      if (payload.role !== requiredRole) return <Navigate to="/signin" replace />;
    } catch (err) {
      return <Navigate to="/signin" replace />; 
    }
  }
  return <Outlet />;
};

export default AuthGuard;
