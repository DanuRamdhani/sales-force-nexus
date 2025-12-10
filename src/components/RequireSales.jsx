import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { clearSession, fetchCurrentUser, getStoredUser } from "../lib/auth";

const RequireSales = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;

    const verifySales = async () => {
      const cachedUser = getStoredUser();
      if (cachedUser?.role === "sales") {
        return;
      }

      const user = await fetchCurrentUser();
      if (!active) return;

      if (!user || user.role !== "sales") {
        clearSession();
        navigate("/login", { replace: true });
        return;
      }
    };

    verifySales();

    return () => {
      active = false;
    };
  }, [navigate]);
  return children;
};

export default RequireSales;
