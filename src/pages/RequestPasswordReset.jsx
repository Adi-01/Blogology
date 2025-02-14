import React, { useState } from "react";
import styled from "styled-components";
import axiosInstance from "../utils/AxiosInstance";
import { Link } from "react-router-dom";

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

  h2 {
    margin-bottom: 10px;
    font-size: 28px;
    color: #333333;
    font-weight: 600;
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
  margin-bottom: 20px;

  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: #333333;
  }

  @media (max-width: 480px) {
    margin-bottom: 15px;
  }
`;

const FormInput = styled.input`
  width: 100%;
  padding: 12px;
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
    padding: 10px;
    font-size: 14px;
  }
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

  @media (max-width: 480px) {
    padding: 12px;
    font-size: 14px;
    margin-bottom: 15px;
  }
`;

const LinkContainer = styled.div`
  margin-top: 20px;

  a {
    color: #333333;
    text-decoration: none;
    display: block;
    margin-bottom: 10px;
    font-size: 16px;

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

const SuccessMessage = styled.p`
  color: #008000; /* Green color for success */
  font-size: 14px;
  margin-top: 30px;
  margin-bottom: -15px;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 30px;
  background: none;
  border: none;
  font-size: 24px;
  color: #333333;
  cursor: pointer;
  padding: 5px;
  line-height: 1;

  &:hover {
    color: #000000;
  }
`;

const LoadingBoxWrapper = styled.div`
  position: relative;
  max-width: 400px;
  width: 90%;
  margin: 20px;
`;

const LoadingBox = styled.div`
  color: ${(props) => (props.$isSuccess ? "#28a745" : "#000000")};
  background: white;
  padding: 30px 50px;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  text-align: center;
  font-size: 18px;
  max-width: 400px;
  width: 90%;
  line-height: 1.5;
  margin: 20px;

  @media (max-width: 480px) {
    padding: 20px 30px;
    font-size: 16px;
    width: 85%;
  }
`;

const WarningMessage = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  background: #ffebee;
  color: #d32f2f;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 14px;
  line-height: 1.5;

  @media (max-width: 480px) {
    padding: 12px;
    font-size: 13px;
    margin-bottom: 15px;
  }
`;

const WarningIcon = styled.span`
  margin-top: 6px;
  margin-right: 5px;
  color: #d32f2f;
  font-size: 20px;
`;

const RequestPasswordReset = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordResetRequest = async () => {
    if (!email) {
      setError("Email is required");
      return;
    }

    setError("");
    setMessage("");

    try {
      setIsLoading(true);
      const response = await axiosInstance.post(
        "/api/user/request-password-reset/",
        {
          email,
        }
      );

      if (response.status === 200) {
        setMessage(
          "If the email exists, a password reset link will be sent to your inbox."
        );
      }
    } catch (error) {
      setError(
        error.response?.data?.detail || "Email is not registered with us."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseOverlay = () => {
    setError("");
    setEmail("");
    setMessage("");
    setIsLoading(false);
  };

  return (
    <PageContainer>
      {(isLoading || message) && (
        <Overlay>
          <LoadingBoxWrapper>
            <LoadingBox $isSuccess={!!message}>
              {isLoading
                ? "Please wait while we process your request..."
                : message}
            </LoadingBox>
            {!isLoading && (
              <CloseButton onClick={handleCloseOverlay}>×</CloseButton>
            )}
          </LoadingBoxWrapper>
        </Overlay>
      )}
      <FormContainer>
        <h2>Reset your password</h2>
        <p>
          Type your email address to send instructions to reset your password to
          your inbox
        </p>

        <WarningMessage>
          <WarningIcon>⚠</WarningIcon>
          <span className="mt-1">
            You need to have an account with us to reset your password.
          </span>
        </WarningMessage>

        <FormInputContainer>
          <label>Email</label>
          <FormInput
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormInputContainer>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <FormButton onClick={handlePasswordResetRequest}>
          Reset Password
        </FormButton>
        <LinkContainer>
          <Link to="/login">Back to Login?</Link>
        </LinkContainer>
      </FormContainer>
    </PageContainer>
  );
};

export default RequestPasswordReset;
