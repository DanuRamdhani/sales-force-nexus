import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RequireAdmin = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      navigate("/admin/login", { replace: true });
      return;
    }

    try {
      const user = JSON.parse(userStr);

      if (user.role !== "admin") {
        navigate("/login", { replace: true });
        return;
      }
    } catch (error) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/admin/login", { replace: true });
      return;
    }
  }, [navigate]);
  return children;
};

export default RequireAdmin;
