import { useEffect, useState, useContext } from "react";
import styled from "styled-components";
import { AuthContext } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import FabMenu from "../components/FabMenu";
import axiosInstance from "../utils/AxiosInstance";

const CreatePostContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  min-height: 100vh;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const BackLink = styled(Link)`
  color: var(--date-color);
  text-decoration: none;
  font-family: "Roboto", sans-serif;
  cursor: pointer;
  display: block;
  width: 100%;
  max-width: 1000px;
  margin-top: 40px;
  margin-bottom: -50px;

  &:hover {
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    max-width: 100%;
    margin: 50px auto 10px;
    padding: 0 20px;
  }

  @media (max-width: 480px) {
    padding: 0 15px;
  }
`;

const FormWrapper = styled.div`
  background: #ffffff;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
  width: 100%;
  max-width: 1000px;
  text-align: left;
  margin-top: 70px;
  font-family: "Roboto", sans-serif;

  @media (max-width: 768px) {
    max-width: 100%;
    padding: 20px;
    margin-top: 3rem;
  }

  @media (max-width: 480px) {
    padding: 15px;
    margin-top: 2rem;
  }
`;

const PageTitle = styled.h2`
  color: #000000;
  text-align: center;
  margin-bottom: 20px;
  font-size: 28px;

  @media (max-width: 768px) {
    font-size: 24px;
  }

  @media (max-width: 480px) {
    font-size: 20px;
  }
`;

const InputLabel = styled.label`
  font-weight: bold;
  color: #000000;
  display: block;
  margin-bottom: 8px;

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

const FormInput = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 20px;
  border: 1px solid #000000;
  border-radius: 5px;
  background: #f8f8f8;
  color: #000000;
  font-size: 14px;

  &:focus {
    border-color: #666666;
    outline: none;
  }

  &::placeholder {
    color: #999999;
  }

  @media (max-width: 768px) {
    padding: 10px;
  }

  @media (max-width: 480px) {
    font-size: 12px;
  }
`;

const QuillWrapper = styled.div`
  margin-bottom: 20px;

  .ql-container {
    height: 400px;
    color: #000;
  }

  @media (max-width: 768px) {
    .ql-container {
      height: 300px;
    }
  }

  @media (max-width: 480px) {
    .ql-container {
      height: 250px;
    }
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 12px;
  background: linear-gradient(90deg, #000000, #666666);
  color: #ffffff;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: linear-gradient(90deg, #666666, #000000);
  }

  &:disabled {
    background: #cccccc;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    padding: 10px;
    font-size: 14px;
  }

  @media (max-width: 480px) {
    font-size: 12px;
  }
`;

const Message = styled.div.attrs((props) => ({}))`
  margin-top: 20px;
  color: ${(props) => (props.$success ? "#4caf50" : "#f44336")};
  text-align: center;

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

const CreatePostPage = () => {
  const { authToken, refreshAccessToken } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  //Refreshin every 10 mins
  useEffect(() => {
    const interval = setInterval(async () => {
      if (authToken) {
        await refreshAccessToken();
      }
    }, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, [authToken, refreshAccessToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!authToken) {
      setMessage("You must be logged in to create a post.");
      setIsSuccess(false);
      return;
    }

    const postData = {
      title,
      content,
      image_url: imageUrl,
    };

    setIsLoading(true);
    setButtonDisabled(true);

    let retryInProgress = false;

    try {
      const response = await axiosInstance.post(
        "/api/blog/posts/create/",
        postData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.status === 201) {
        setMessage("Post created successfully!");
        setIsSuccess(true);
        setTitle("");
        setContent("");
        setImageUrl("");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        const newToken = await refreshAccessToken();
        if (newToken && !retryInProgress) {
          retryInProgress = true;
          const retryResponse = await axiosInstance.post(
            "/api/blog/posts/create/",
            postData,
            {
              headers: {
                Authorization: `Bearer ${newToken}`,
              },
            }
          );

          if (retryResponse.status === 201) {
            setMessage("Post created successfully!");
            setIsSuccess(true);
            setTitle("");
            setContent("");
            setImageUrl("");
          } else {
            setMessage("Failed to create post after token refresh.");
            setIsSuccess(false);
          }
        } else {
          setMessage("Session expired. Please log in again.");
          setIsSuccess(false);
        }
      } else {
        setMessage("Failed to create post. Please try again.");
        setIsSuccess(false);
      }
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        setShowMessage(true);
        setButtonDisabled(false);
      }, 3000);
    }
  };

  return (
    <CreatePostContainer>
      <BackLink to="/posts">← Back to Reading</BackLink>
      <FormWrapper>
        <PageTitle>Create a New Post</PageTitle>
        <form onSubmit={handleSubmit}>
          <InputLabel htmlFor="imageUrl">Image URL</InputLabel>
          <FormInput
            id="imageUrl"
            type="url"
            placeholder="Enter an image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            disabled={isLoading}
            required
          />
          <InputLabel htmlFor="title">Title</InputLabel>
          <FormInput
            id="title"
            type="text"
            placeholder="Enter post title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isLoading}
            required
          />
          <InputLabel htmlFor="content">Content</InputLabel>
          <QuillWrapper>
            <ReactQuill
              value={content}
              onChange={setContent}
              placeholder="Write your post content here"
              theme="snow"
              readOnly={isLoading}
              required
            />
          </QuillWrapper>
          <SubmitButton type="submit" disabled={isLoading || buttonDisabled}>
            {isLoading ? "Creating..." : "Create Post"}
          </SubmitButton>
        </form>
        {showMessage && message && (
          <Message $success={isSuccess}>{message}</Message>
        )}
      </FormWrapper>
      <FabMenu />
    </CreatePostContainer>
  );
};

export default CreatePostPage;
