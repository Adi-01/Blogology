import { createContext, useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie"; // Import js-cookie
import axiosInstance from "../utils/AxiosInstance";

// Create context
const AuthContext = createContext();

// Provider component
const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(Cookies.get("access_token"));
  const [refreshToken, setRefreshToken] = useState(
    Cookies.get("refresh_token")
  );
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null); // Store user details

  // Refresh access token
  const refreshAccessToken = useCallback(async () => {
    if (!refreshToken) {
      console.error("No refresh token available");
      logout();
      return null;
    }

    try {
      const response = await axiosInstance.post("/api/user/token/refresh/", {
        refresh: refreshToken,
      });

      const newAccessToken = response.data.access;
      Cookies.set("access_token", newAccessToken, {
        expires: 0.0208,
        secure: true,
        sameSite: "Strict",
      }); // Set cookie with expiration
      setAuthToken(newAccessToken);
      return newAccessToken;
    } catch (error) {
      console.error("Failed to refresh token:", error.response?.data || error);
      logout();
      return null;
    }
  }, [refreshToken]);

  // Fetch user details using the access token
  const fetchUserDetails = useCallback(
    async (token) => {
      if (!token) return;

      try {
        const response = await axiosInstance.get("/api/user/profile/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data); // Store user details
      } catch (error) {
        if (error.response?.status === 401) {
          // Attempt to refresh token and retry
          const newToken = await refreshAccessToken();
          if (newToken) {
            await fetchUserDetails(newToken);
          }
        } else {
          console.error(
            "Failed to fetch user details:",
            error.response?.data || error
          );
          logout(); // Logout if fetching user fails
        }
      }
    },
    [refreshAccessToken] // Added refreshAccessToken as a dependency
  );

  const login = async (accessToken, refreshToken) => {
    try {
      Cookies.set("access_token", accessToken, {
        expires: 0.0208,
        secure: true,
        sameSite: "Strict",
      });
      Cookies.set("refresh_token", refreshToken, {
        expires: 7,
        secure: true,
        sameSite: "Strict",
      });
      setAuthToken(accessToken);
      setRefreshToken(refreshToken);
      setIsAuthenticated(true);
      await fetchUserDetails(accessToken);
    } catch (error) {
      console.error("Login failed:", error.response?.data || error);
      logout(); // Ensure cleanup on failure
    }
  };

  const logout = () => {
    Cookies.remove("access_token"); // Remove access token from cookies
    Cookies.remove("refresh_token"); // Remove refresh token from cookies
    setAuthToken(null);
    setRefreshToken(null);
    setIsAuthenticated(false);
    setUser(null); // Clear user details
  };

  // Initialize state with cookies tokens and fetch user details
  useEffect(() => {
    const token = Cookies.get("access_token");
    const refresh = Cookies.get("refresh_token");

    if (refresh) {
      setAuthToken(token);
      setRefreshToken(refresh);
      setIsAuthenticated(true);
      fetchUserDetails(token);
    } else {
      logout();
    }
  }, [fetchUserDetails]);

  return (
    <AuthContext.Provider
      value={{
        authToken,
        refreshToken,
        login,
        logout,
        refreshAccessToken,
        isAuthenticated,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
