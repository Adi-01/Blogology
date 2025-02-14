import React, { useContext, useEffect, useState, useCallback } from "react";
import styled from "styled-components";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import FabMenu from "../components/FabMenu";
import { ShimmerPlaceholderProfilePage } from "../styles/ShimmerEffects";
import axiosInstance from "../utils/AxiosInstance";
import PostsBySpecificUser from "./PostsBySpecificUser";
import { useParams } from "react-router-dom";

const ErrorMessage = styled.div`
  color: red;
  text-align: center;
  margin-top: 70px;
`;

const Container = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 50px auto;
  font-family: Arial, sans-serif;

  @media (max-width: 480px) {
    width: 95%;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  font-size: 20px;
  margin-bottom: -10px;
  cursor: pointer;
  width: max-content;
`;

const BackArrow = styled.span`
  margin-right: 10px;
`;

const Title = styled.h1`
  font-size: 18px;
  color: var(--date-color);
  font-weight: 600;
  margin-left: -5px;
  margin-top: 12px;
`;

const CoverPhoto = styled.div`
  width: 100%;
  height: 120px;
  background: linear-gradient(to right, #a2d2ff, #3a86ff);
  border-radius: 10px 10px 0 0;
`;

const ProfileSection = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  padding: 10px;
  justify-content: space-between;
`;

const ProfileImage = styled.img`
  width: 90px;
  height: 90px;
  border-radius: 50%;
  position: absolute;
  top: -50px;
  left: 50%;
  transform: translateX(-50%);
  border: 3px solid var(--background-color);
  object-fit: cover;
`;

const UserInfo = styled.div`
  margin-top: 30px;
  padding: 10px;
  border-bottom: 1px solid var(--text-color);
  text-align: center;
`;

const UserName = styled.h2`
  margin: 0;
`;

const UserHandle = styled.p`
  color: var(--read-more-color);
  margin: 10px 0;
`;

const AboutMe = styled.p`
  font-size: 14px;
  color: var(--text-color);
  width: 85%;
  margin: 0 auto;
  text-align: center !important;
  margin-top: 20px;
  margin-bottom: 30px;
`;

const Stats = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
  justify-content: space-evenly;
  gap: 10px;
  margin-bottom: 5px;

  @media (max-width: 480px) {
    gap: 5px;
  }
`;

const Stat = styled.span`
  color: var(--text-color);
  font-size: 15px;
  @media (max-width: 480px) {
    font-size: 13px;
  }
`;

const FollowButton = styled.button`
  background-color: transparent;
  color: var(--following-button);
  padding: 2px 8px;
  border-radius: 30px;
  cursor: pointer;
  font-weight: 600;
  width: 100px;
  border: 2px solid var(--following-button);
  font-size: 14px;

  &:disabled {
    cursor: not-allowed;
  }
`;

const UnfollowButton = styled.button`
  background-color: transparent;
  color: var(--following-button);
  padding: 2px 8px;
  border-radius: 30px;
  cursor: pointer;
  font-weight: 600;
  width: 100px;
  border: 2px solid var(--following-button);
  font-size: 14px;

  &:disabled {
    cursor: not-allowed;
  }
`;

const PostsTitle = styled.h3`
  margin-top: 30px;
  margin-bottom: 20px;
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--text-color);
  text-align: center;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5); // Semi-transparent black background
  display: ${({ $isProcessing }) => ($isProcessing ? "flex" : "none")};
  justify-content: center;
  align-items: center;
  z-index: 9999; // Ensures overlay appears on top of everything
`;

const Spinner = styled.div`
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left: 4px solid #fff;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const ProfileOfSpecificUser = () => {
  const { authToken, refreshAccessToken, logout, isAuthenticated } =
    useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchProfile = useCallback(
    async (token) => {
      try {
        const response = await axiosInstance.get(`/api/user/profile/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Ensure token is sent
          },
        });

        setProfile(response.data);
        setIsLoading(false);
        console.log(response.data.is_following);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          const newAccessToken = await refreshAccessToken();

          if (newAccessToken) {
            fetchProfile(newAccessToken);
          } else {
            setError("Failed to refresh token. Please log in again.");
            setIsLoading(false);
          }
        } else {
          setError("Failed to fetch profile. Please try again later.");
          setIsLoading(false);
        }
      }
    },
    [refreshAccessToken, id]
  );

  useEffect(() => {
    if (!authToken) {
      navigate("/login");
    } else {
      fetchProfile(authToken);
    }
  }, [fetchProfile, authToken, navigate]);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (authToken) {
        await refreshAccessToken();
      }
    }, 10 * 60 * 1000); // 10 minutes in ms

    return () => clearInterval(interval);
  }, [authToken, refreshAccessToken]);

  if (error) {
    return (
      <ErrorMessage>
        <p>{error}</p>
        <button onClick={logout}>Log Out</button>
      </ErrorMessage>
    );
  }

  const handleBack = () => {
    navigate("/posts");
  };

  const handleFollow = async () => {
    if (!isAuthenticated) {
      alert("Please log in to follow a user");
      return;
    }

    setIsProcessing(true);

    try {
      let tokenToUse = authToken;

      if (!tokenToUse) {
        const newAccessToken = await refreshAccessToken();
        if (!newAccessToken) {
          alert("Failed to refresh token. Please log in again.");
          setIsProcessing(false);
          return;
        }
        tokenToUse = newAccessToken;
      }

      const response = await axiosInstance.post(
        `/api/user/follow/${profile.id}/`,
        {},
        { headers: { Authorization: `Bearer ${tokenToUse}` } }
      );

      // ✅ Use API response to update profile state
      setProfile((prevProfile) => ({
        ...prevProfile,
        is_following: response.data.is_following, // ✅ Use backend response
        followers_count: response.data.followers_count, // ✅ Update count
      }));
      fetchProfile(tokenToUse);
    } catch (error) {
      console.error(
        "Error following user:",
        error.response ? error.response.data : error
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUnfollow = async () => {
    setIsProcessing(true);

    try {
      let tokenToUse = authToken;

      if (!tokenToUse) {
        const newAccessToken = await refreshAccessToken();
        if (!newAccessToken) {
          alert("Failed to refresh token. Please log in again.");
          setIsProcessing(false);
          return;
        }
        tokenToUse = newAccessToken;
      }

      const response = await axiosInstance.post(
        `/api/user/unfollow/${profile.id}/`,
        {},
        { headers: { Authorization: `Bearer ${tokenToUse}` } }
      );

      // ✅ Use API response to update profile state
      setProfile((prevProfile) => ({
        ...prevProfile,
        is_following: response.data.is_following, // ✅ Use backend response
        followers_count: response.data.followers_count, // ✅ Update count
      }));
      fetchProfile(tokenToUse);
    } catch (error) {
      console.error(
        "Error unfollowing user:",
        error.response ? error.response.data : error
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Overlay $isProcessing={isProcessing}>
        <Spinner />
      </Overlay>

      {isLoading ? (
        <ShimmerPlaceholderProfilePage />
      ) : profile ? (
        <Container>
          <Header>
            <BackArrow onClick={handleBack}>&larr;</BackArrow>
            <Title>Back to Posts</Title>
          </Header>
          <CoverPhoto />
          <ProfileSection>
            <ProfileImage src={profile.image} alt={profile.username} />
          </ProfileSection>
          <UserInfo>
            <UserName>{profile.username}</UserName>
            <UserHandle>{profile.email}</UserHandle>
            <AboutMe>{profile.about_me}</AboutMe>
            <Stats>
              <Stat>
                <strong>{profile.followers_count || 0}</strong> Followers
              </Stat>
              <Stat>
                <strong>{profile.post_count || 0}</strong> Posts
              </Stat>

              {profile?.is_following ? (
                <UnfollowButton
                  onClick={handleUnfollow}
                  disabled={isProcessing}
                >
                  Following
                </UnfollowButton>
              ) : (
                <FollowButton onClick={handleFollow} disabled={isProcessing}>
                  Follow
                </FollowButton>
              )}
            </Stats>
          </UserInfo>

          <PostsTitle>Posts by {profile.username}</PostsTitle>
          <PostsBySpecificUser
            id={profile.id}
            posts={profile.posts}
            isLoading={isLoading}
            error={error}
          />
          <FabMenu />
        </Container>
      ) : (
        <p>No profile data available. Please try again later!</p>
      )}
    </>
  );
};

export default ProfileOfSpecificUser;
