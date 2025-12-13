import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { clearSession, fetchCurrentUser, getStoredUser } from "../lib/auth";

const RequireSuperAdmin = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;

    const verifySuperAdmin = async () => {
      const cachedUser = getStoredUser();
      if (cachedUser?.role === "super_admin") {
        return;
      }

      const user = await fetchCurrentUser();
      if (!active) return;

      if (!user || user.role !== "super_admin") {
        clearSession();
        navigate("/login", { replace: true });
        return;
      }
    };

    verifySuperAdmin();

    return () => {
      active = false;
    };
  }, [navigate]);

  return children;
};

export default RequireSuperAdmin;
