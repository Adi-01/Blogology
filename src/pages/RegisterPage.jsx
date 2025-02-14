import { useState, useEffect } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/AxiosInstance";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

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
  border: 1px solid
    ${(props) => {
      if (props.$isPassword) {
        if (props.$passwordStrength === 0) return "#000000";
        if (props.$passwordStrength <= 40) return "#FF3333"; // Bright red
        if (props.$passwordStrength <= 80) return "#FFD000"; // Bright orange-yellow
        return "#00FF00"; // Bright green
      }
      return "#dddddd";
    }};
  border-radius: 8px;
  font-size: 16px;
  color: #333333;

  &:focus {
    outline: none;
    border-color: ${(props) => {
      if (props.$isPassword) {
        if (props.$passwordStrength === 0) return "#666666";
        if (props.$passwordStrength <= 40) return "#FF3333"; // Bright red
        if (props.$passwordStrength <= 80) return "#FFD000"; // Bright orange-yellow
        return "#00FF00"; // Bright green
      }
      return "#666666";
    }};
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

  @media (max-width: 480px) {
    padding: 12px;
    font-size: 14px;
    margin-bottom: 15px;
  }
`;

const LinkContainer = styled.div`
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

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordRequirements, setPasswordRequirements] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const navigate = useNavigate();

  const USERNAME_REGEX = /^[a-zA-Z0-9@.+_\- ]+$/;

  const validateUsername = (value) => {
    if (!USERNAME_REGEX.test(value)) {
      setUsernameError(
        "Enter a valid username. This value may contain only letters, numbers, spaces, and @/./+/-/_ characters."
      );
    } else {
      setUsernameError("");
    }
  };

  const checkPasswordStrength = (password) => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    setPasswordRequirements(requirements);

    const strength = Object.values(requirements).filter(Boolean).length * 20;
    setPasswordStrength(strength);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Add validation for empty fields
    if (!username.trim()) {
      setError("Username is required.");
      return;
    }

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (passwordStrength !== 100) {
      setError("Your password is too weak. Please make it stronger.");
      return;
    }

    const registerData = { username, email, password };

    try {
      setIsLoading(true);
      const response = await axiosInstance.post(
        "/api/user/register/",
        registerData
      );

      if (response.status === 201) {
        setUsername("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setError("");
        setUsernameError("");
        setSuccessMessage("Your account has been registered successfully!");
        setCountdown(3); // Reset countdown

        // Start countdown
        const timer = setInterval(() => {
          setCountdown((prev) => prev - 1);
        }, 1000);

        // Auto-navigate after 3 seconds
        setTimeout(() => {
          clearInterval(timer);
          navigate("/login");
        }, 3000);
      }
    } catch (err) {
      if (err.response) {
        const { data } = err.response;

        // Display email already taken error
        if (data.email && data.email.includes("already exists")) {
          setError("An account with this email already exists.");
        } else {
          setError(
            data.username || data.email || data.password || "An error occurred."
          );
        }
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer>
      {(isLoading || successMessage) && (
        <Overlay>
          <LoadingBoxWrapper>
            <LoadingBox $isSuccess={!!successMessage}>
              {isLoading ? (
                "Please wait while we register you with us..."
              ) : (
                <>
                  {successMessage}
                  <br />
                  <small style={{ fontSize: "14px", color: "#000000" }}>
                    Redirecting to login page in {countdown} seconds...
                  </small>
                </>
              )}
            </LoadingBox>
          </LoadingBoxWrapper>
        </Overlay>
      )}
      <FormContainer>
        <h2>Create your account</h2>
        <p>Fill in your details to create your account</p>

        <form onSubmit={handleSubmit}>
          <FormInputContainer>
            <IconWrapper>
              <FaEnvelope />
            </IconWrapper>
            <FormInput
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormInputContainer>

          <FormInputContainer>
            <IconWrapper>
              <FaUser />
            </IconWrapper>
            <FormInput
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                validateUsername(e.target.value);
              }}
            />
          </FormInputContainer>
          {usernameError && <ErrorMessage>{usernameError}</ErrorMessage>}

          <FormInputContainer>
            <IconWrapper>
              <FaLock />
            </IconWrapper>
            <FormInput
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                checkPasswordStrength(e.target.value);
              }}
              $isPassword={true}
              $passwordStrength={passwordStrength}
            />
            <TogglePasswordIcon onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </TogglePasswordIcon>
          </FormInputContainer>

          {passwordStrength !== 100 && (
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
          )}

          <FormInputContainer>
            <IconWrapper>
              <FaLock />
            </IconWrapper>
            <FormInput
              autoComplete="off"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <TogglePasswordIcon
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </TogglePasswordIcon>
          </FormInputContainer>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <FormButton>Register</FormButton>
        </form>

        <LinkContainer>
          <Link to="/login">Already have an account?</Link>
        </LinkContainer>
      </FormContainer>
    </PageContainer>
  );
};

export default RegisterPage;
