import React, { useContext, useEffect, useState, useCallback } from "react";
import styled from "styled-components";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import FabMenu from "../components/FabMenu";
import { ShimmerPlaceholderProfilePage } from "../styles/ShimmerEffects";
import axiosInstance from "../utils/AxiosInstance";
import UserPosts from "./UserPosts";

const ProfilePage = () => {
  const { authToken, refreshAccessToken, logout } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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

  const EditButton = styled.button`
    background-color: transparent;
    color: var(--edit-button-bg);
    padding: 2px 8px;
    border-radius: 30px;
    cursor: pointer;
    font-weight: 500;
    width: 100px;
    border: 1px solid var(--edit-button-bg);
    font-size: 14px;

    &:hover {
      background-color: var(--edit-button-bg);
      color: var(--background-color);
    }
  `;

  const PostsTitle = styled.h3`
    margin-top: 30px;
    margin-bottom: 20px;
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--text-color);
    text-align: center;
  `;

  const fetchProfile = useCallback(
    async (token) => {
      try {
        const response = await axiosInstance.get("/api/user/profile/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfile(response.data);
        setIsLoading(false);
        console.log(response.data);
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
    [refreshAccessToken]
  );

  useEffect(() => {
    if (authToken) {
      fetchProfile(authToken);
    } else {
      setError("You are not logged in. Please log in to view your profile.");
      setIsLoading(false);
    }
  }, [authToken, fetchProfile]);

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

  const handleEdit = () => {
    navigate("/edit-your-profile");
  };

  const handleBack = () => {
    navigate("/posts");
  };

  return (
    <>
      {isLoading ? (
        <ShimmerPlaceholderProfilePage />
      ) : profile ? (
        <Container>
          <Header onClick={handleBack}>
            <BackArrow>&larr;</BackArrow>
            <Title>Back to Posts</Title>
          </Header>
          <CoverPhoto />
          <ProfileSection>
            <ProfileImage src={profile.image} alt={profile.username} />
          </ProfileSection>
          <UserInfo>
            <UserName>{profile.username}</UserName>
            <UserHandle>{profile.email}</UserHandle>
            <AboutMe className="text-center">{profile.about_me}</AboutMe>
            <Stats>
              <Stat>
                <strong>{profile.followers_count || 0}</strong> Followers
              </Stat>
              <Stat>
                <strong>{profile.post_count || 0}</strong> Posts
              </Stat>
              <EditButton onClick={handleEdit}>Edit Profile</EditButton>
            </Stats>
          </UserInfo>
          <PostsTitle>Posts by you</PostsTitle>
          <UserPosts
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

export default ProfilePage;
