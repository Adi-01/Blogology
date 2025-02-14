import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

const PrivateRoute = ({ children }) => {
  const { authToken } = useContext(AuthContext);

  if (!authToken) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;
