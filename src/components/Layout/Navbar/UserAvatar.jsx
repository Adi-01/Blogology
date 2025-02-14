import { useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import styled from "styled-components";
import axiosInstance from "../../../utils/AxiosInstance";

const Avatar = styled.img`
  width: 18px;
  height: 18px;
  border-radius: 50%;
  object-fit: cover;
  vertical-align: middle;

  @media (max-width: 768px) {
    width: 16px;
    height: 16px;
  }
`;

const UserAvatar = () => {
  const { authToken, refreshAccessToken } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(
    async (token) => {
      try {
        const response = await axiosInstance.get("/api/user/profile/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfile(response.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
        if (err.response?.status === 401) {
          try {
            const newAccessToken = await refreshAccessToken();
            if (newAccessToken) {
              await fetchProfile(newAccessToken);
            } else {
              setError("Please log in again.");
            }
          } catch (refreshError) {
            console.error("Error refreshing token:", refreshError);
            setError("Failed to refresh token. Log in again.");
          }
        } else {
          setError("Failed to load profile.");
        }
      }
    },
    [refreshAccessToken]
  );

  useEffect(() => {
    if (authToken) {
      fetchProfile(authToken);
    } else {
      setError("Please log in.");
    }
  }, [authToken, fetchProfile]);

  return (
    <>
      {error ? (
        <span title={error}>
          <i className="fas fa-sign-in-alt"></i>
        </span>
      ) : profile ? (
        <Avatar
          src={profile.image}
          alt={profile.username}
          title={profile.username}
        />
      ) : (
        <i className="fas fa-user"></i>
      )}
    </>
  );
};

export default UserAvatar;
