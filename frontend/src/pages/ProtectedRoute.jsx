import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import { verifyTokenHandler } from "../services/rest";

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          await verifyTokenHandler({
            headers: {
              "x-auth-token": token,
            },
          });
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Token verification failed:", error);
        }
      }
      setIsLoading(false);
    };

    verifyToken();
  }, []);

  function logOut() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <nav className="d-flex justify-content-end">
        <button className="btn btn-danger m-2" onClick={logOut}>
          Log Out
        </button>
      </nav>
      <div>{isAuthenticated ? children : <Navigate to="/login" />}</div>
    </div>
  );
};

export default ProtectedRoute;
