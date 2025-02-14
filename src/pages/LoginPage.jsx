import { useState, useContext, useEffect } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import axiosInstance from "../utils/AxiosInstance";

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  background: #ffffff;

  @media (max-width: 480px) {
    padding: 15px;
  }
`;

const FormContainer = styled.div`
  background: #ffffff;
  padding: 40px;
  max-width: 450px;
  width: 100%;
  font-family: sans-serif;
  margin-top: 40px;

  h2 {
    margin-bottom: 10px;
    font-size: 28px;
    color: #333333;
    font-weight: 600;
    text-transform: none;
  }

  p {
    color: #666666;
    margin-bottom: 30px;
    font-size: 16px;
    line-height: 1.5;
  }

  @media (max-width: 480px) {
    padding: 20px;

    h2 {
      font-size: 24px;
    }

    p {
      font-size: 14px;
      margin-bottom: 20px;
    }
  }
`;

const FormInputContainer = styled.div`
  position: relative;
  margin-bottom: 20px;

  @media (max-width: 480px) {
    margin-bottom: 15px;
  }
`;

const IconWrapper = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #666666;
  font-size: 16px;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 12px 40px;
  border: 1px solid #dddddd;
  border-radius: 8px;
  font-size: 16px;
  color: #333333;

  &:focus {
    outline: none;
    border-color: #666666;
  }

  &::placeholder {
    color: #999999;
  }

  @media (max-width: 480px) {
    padding: 10px 35px;
    font-size: 14px;
  }
`;

const TogglePasswordIcon = styled.div`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #666666;
  font-size: 16px;
`;

const FormButton = styled.button`
  width: 100%;
  padding: 14px;
  background: #333333;
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 16px;
  cursor: pointer;
  margin-bottom: 20px;

  &:hover {
    background: #444444;
  }

  &:disabled {
    background: #666666;
    cursor: not-allowed;
  }

  @media (max-width: 480px) {
    padding: 12px;
    font-size: 14px;
    margin-bottom: 15px;
  }
`;

const Message = styled.div`
  margin-top: 10px;

  a {
    color: #333333;
    text-decoration: none;
    display: block;
    margin-bottom: 10px;
    font-size: 16px;
    max-width: max-content;

    &:hover {
      text-decoration: underline;
    }
  }

  @media (max-width: 480px) {
    margin-top: 15px;

    a {
      font-size: 14px;
      margin-bottom: 8px;
    }
  }
`;

const ErrorMessage = styled.div`
  background: #ffebee;
  color: #d32f2f;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 14px;
`;

const AlreadyLoggedInContainer = styled.div`
  text-align: center;

  h3 {
    margin-bottom: 20px;
    color: #333333;
    font-size: 24px;
  }
`;

const LoadingText = styled.span`
  @keyframes ellipsis {
    0% {
      content: "";
    }
    25% {
      content: ".";
    }
    50% {
      content: "..";
    }
    75% {
      content: "...";
    }
    100% {
      content: "";
    }
  }

  &::after {
    content: "";
    animation: ellipsis 1.5s infinite;
  }
`;

const LoginPage = () => {
  const { login, isAuthenticated, logout } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axiosInstance.post("/api/user/login/", {
        username,
        password,
      });
      await login(data.access, data.refresh);
      navigate("/posts", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.detail || "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    setError("");
  };

  const handleNavigateToPosts = () => {
    navigate("/posts", { replace: true });
  };

  return (
    <PageContainer>
      <FormContainer>
        {isAuthenticated ? (
          <AlreadyLoggedInContainer>
            <h3>You are already logged in!</h3>
            <FormButton onClick={handleNavigateToPosts}>Go to Posts</FormButton>
            <FormButton onClick={handleLogout}>Logout</FormButton>
          </AlreadyLoggedInContainer>
        ) : (
          <>
            <h2>Welcome Back!</h2>
            <p>Sign in to continue to your account</p>
            <form onSubmit={handleSubmit}>
              <FormInputContainer>
                <IconWrapper>
                  <FaUser />
                </IconWrapper>
                <FormInput
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </FormInputContainer>
              <FormInputContainer>
                <IconWrapper>
                  <FaLock />
                </IconWrapper>
                <FormInput
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <TogglePasswordIcon
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </TogglePasswordIcon>
              </FormInputContainer>
              {error && <ErrorMessage>{error}</ErrorMessage>}
              <FormButton type="submit" disabled={loading}>
                {loading ? <LoadingText>Logging in</LoadingText> : "Login"}
              </FormButton>
              <Message>
                <Link to="/register">Don&apos;t have an account?</Link>
                <Link to="/request-password-reset">Forgot Password?</Link>
              </Message>
            </form>
          </>
        )}
      </FormContainer>
    </PageContainer>
  );
};

export default LoginPage;
