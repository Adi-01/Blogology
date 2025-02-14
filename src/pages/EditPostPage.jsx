import { useEffect, useState, useContext } from "react";
import styled from "styled-components";
import { AuthContext } from "../contexts/AuthContext";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate, useParams } from "react-router-dom";
import FabMenu from "../components/FabMenu";
import axiosInstance from "../utils/AxiosInstance";
import { Link } from "react-router-dom";
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

const EditPostPage = () => {
  const { authToken, refreshAccessToken, user } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [buttonText, setButtonText] = useState("Update Post");
  const [retryPost, setRetryPost] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const { id } = useParams(); // Get the post ID from the URL
  const navigate = useNavigate();

  //Refreshin every 10 mins
  useEffect(() => {
    const interval = setInterval(async () => {
      if (authToken) {
        await refreshAccessToken();
      }
    }, 10 * 60 * 1000); // 10 minutes in ms

    return () => clearInterval(interval);
  }, [authToken, refreshAccessToken]);

  // Fetch the post data when the component mounts and check if the user is the author
  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const response = await axiosInstance.get(`/api/blog/posts/${id}/`);

        if (response.status === 200) {
          const { title, content, image_url, author } = response.data;
          setTitle(title);
          setContent(content);
          setImageUrl(image_url);

          // Check if the logged-in user is the author of the post
          if (user?.id !== author.id) {
            navigate(`/posts`);
          }
        }
      } catch (error) {
        setMessage("Failed to load post data. Please try again.");
      }
    };

    fetchPostData();
  }, [authToken, id, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!authToken) {
      setMessage("You must be logged in to edit a post.");
      setIsSuccess(false);
      return;
    }

    const postData = {
      title,
      content,
      image_url: imageUrl,
    };

    setIsLoading(true);
    setButtonText("Updating...");
    setButtonDisabled(true);

    try {
      const response = await axiosInstance.put(
        `/api/blog/posts/${id}/edit/`,
        postData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.status === 200) {
        setMessage("Post updated successfully!");
        setIsSuccess(true);
        navigate(`/posts/${id}`); // Navigate to the updated post page
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // Token expired, refresh it and retry the put request
        await refreshAccessToken();
        setRetryPost(true);
      } else {
        setMessage("Failed to update post. Please try again.");
        setIsSuccess(false);
      }
    } finally {
      if (retryPost) {
        try {
          const retryResponse = await axiosInstance.put(
            `/api/blog/posts/${id}/edit/`,
            postData,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
              },
            }
          );

          if (retryResponse.status === 200) {
            setMessage("Post updated successfully!");
            setIsSuccess(true);
            navigate(`/posts/${id}`);
          } else {
            setMessage("Failed to update post after token refresh.");
            setIsSuccess(false);
          }
        } catch (retryError) {
          setMessage("Failed to update post after token refresh.");
          setIsSuccess(false);
        }
      }

      setIsLoading(false);
      setButtonText("Update Post");
      setButtonDisabled(false);
    }
  };

  return (
    <CreatePostContainer>
      <BackLink to="/posts">← Back to Reading</BackLink>
      <FormWrapper>
        <PageTitle>Edit Post</PageTitle>
        <form onSubmit={handleSubmit}>
          <InputLabel htmlFor="imageUrl">Image URL</InputLabel>
          <FormInput
            id="imageUrl"
            type="url"
            placeholder="Enter an image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            required
          />
          <InputLabel htmlFor="title">Title</InputLabel>
          <FormInput
            id="title"
            type="text"
            placeholder="Enter post title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <InputLabel htmlFor="content">Content</InputLabel>
          <QuillWrapper>
            <ReactQuill
              value={content}
              onChange={setContent} // Handle content change from Quill
              placeholder="Write your post content here"
              theme="snow"
              required
            />
          </QuillWrapper>
          <SubmitButton type="submit" disabled={buttonDisabled}>
            {buttonText}
          </SubmitButton>
        </form>
        {message && <Message $success={isSuccess}>{message}</Message>}
      </FormWrapper>
      <FabMenu />
    </CreatePostContainer>
  );
};

export default EditPostPage;
