const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export const getToken = () => localStorage.getItem("token") || "";

export const getStoredUser = () => {
  const userRaw = localStorage.getItem("user");
  if (!userRaw) return null;
  try {
    return JSON.parse(userRaw);
  } catch (error) {
    clearSession();
    return null;
  }
};

export const setSession = (token, user) => {
  if (token) {
    localStorage.setItem("token", token);
  }
  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
  }
};

export const clearSession = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

const buildUrl = (path) => `${API_BASE_URL}${path}`;

export const authFetch = async (path, options = {}) => {
  const token = getToken();
  const headers = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(buildUrl(path), {
    ...options,
    headers,
  });

  if (response.status === 401) {
    clearSession();
  }

  return response;
};

export const login = async (email, password) => {
  const response = await fetch(buildUrl("/api/auth/login"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    let message = "Login gagal";
    try {
      const errorBody = await response.json();
      message = errorBody?.message || message;
    } catch (_) {
      // keep default message
    }
    throw new Error(message);
  }

  const data = await response.json();
  setSession(data.token, data.user);
  return data;
};

export const fetchCurrentUser = async () => {
  const token = getToken();
  if (!token) return null;

  const response = await authFetch("/api/me", {
    method: "GET",
  });

  if (!response.ok) {
    clearSession();
    return null;
  }

  const data = await response.json();
  if (data?.user) {
    setSession(token, data.user);
    return data.user;
  }

  return null;
};
