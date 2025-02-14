import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
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

const EmailDisplay = styled.div`
  background: #f5f5f5;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 20px;
  color: #666666;
  font-size: 14px;

  span {
    color: #333333;
    font-weight: 500;
  }
`;

const FormInputContainer = styled.div`
  position: relative;
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

const IconWrapper = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #666666;
  font-size: 16px;
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
  margin-top: 20px;

  &:hover {
    background: #444444;
  }

  @media (max-width: 480px) {
    padding: 12px;
    font-size: 14px;
    margin-bottom: 15px;
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

const PasswordRequirements = styled.ul`
  text-align: left;
  font-size: 13px;
  color: #666;
  margin: 5px 0 15px 0;
  padding-left: 18px;
`;

const RequirementItem = styled.li`
  color: ${(props) => (props.$met ? "green" : "#666")};
  margin-bottom: 5px;
  &::marker {
    content: ${(props) => (props.$met ? '"✓ "' : '"• "')};
  }
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
  line-height: 1.5;

  @media (max-width: 480px) {
    padding: 20px 30px;
    font-size: 16px;
  }
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

const PasswordReset = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordRequirements, setPasswordRequirements] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenParam = urlParams.get("token");
    const emailParam = urlParams.get("email");

    if (tokenParam && emailParam) {
      setToken(tokenParam);
      setEmail(emailParam);
    } else {
      navigate("/request-password-reset");
    }
  }, [navigate]);

  const checkPasswordRequirements = (password) => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    setPasswordRequirements(requirements);
    return Object.values(requirements).every(Boolean);
  };

  const handlePasswordReset = async () => {
    setError("");
    setMessage("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!checkPasswordRequirements(newPassword)) {
      setError("Please meet all password requirements.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axiosInstance.post("/api/user/reset-password/", {
        token,
        email,
        new_password: newPassword,
      });

      if (response.status === 200) {
        setMessage("Your password has been reset successfully!");
      }
    } catch (error) {
      setError(error.response?.data?.error || "Failed to reset password.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseOverlay = () => {
    setMessage("");
    navigate("/login");
  };

  return (
    <PageContainer>
      {(isLoading || message) && (
        <Overlay>
          <LoadingBoxWrapper>
            <LoadingBox $isSuccess={!!message}>
              {isLoading
                ? "Please wait while we reset your password..."
                : message}
            </LoadingBox>
            {!isLoading && (
              <CloseButton onClick={handleCloseOverlay}>×</CloseButton>
            )}
          </LoadingBoxWrapper>
        </Overlay>
      )}
      <FormContainer>
        <h2>Reset Your Password</h2>
        <p>Enter your new password below</p>

        <EmailDisplay>
          Resetting password for: <span>{email}</span>
        </EmailDisplay>

        <FormInputContainer>
          <IconWrapper>
            <FaLock />
          </IconWrapper>
          <FormInput
            type={showPassword ? "text" : "password"}
            placeholder="Enter your new password"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              checkPasswordRequirements(e.target.value);
            }}
          />
          <TogglePasswordIcon onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </TogglePasswordIcon>
        </FormInputContainer>

        <PasswordRequirements>
          <RequirementItem $met={passwordRequirements.length}>
            At least 8 characters long
          </RequirementItem>
          <RequirementItem $met={passwordRequirements.uppercase}>
            Contains at least one uppercase letter
          </RequirementItem>
          <RequirementItem $met={passwordRequirements.lowercase}>
            Contains at least one lowercase letter
          </RequirementItem>
          <RequirementItem $met={passwordRequirements.number}>
            Contains at least one number
          </RequirementItem>
          <RequirementItem $met={passwordRequirements.special}>
            Contains at least one special character
          </RequirementItem>
        </PasswordRequirements>

        <FormInputContainer>
          <IconWrapper>
            <FaLock />
          </IconWrapper>
          <FormInput
            type={showPassword ? "text" : "password"}
            placeholder="Confirm your new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <TogglePasswordIcon onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </TogglePasswordIcon>
        </FormInputContainer>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <FormButton onClick={handlePasswordReset}>Reset Password</FormButton>
      </FormContainer>
    </PageContainer>
  );
};

export default PasswordReset;
