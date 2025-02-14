import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DOMPurify from "dompurify";
import styled from "styled-components";
import FabMenu from "../../FabMenu";
import formatDate from "../../../utils/formatDate";
import { AuthContext } from "../../../contexts/AuthContext";
import { ShimmerPlaceholderDetailedPostView } from "../../../styles/ShimmerEffects/ShimmerEffects";
import axiosInstance from "../../../utils/AxiosInstance";

const PostContent = styled.div`
  font-size: 1.1rem;
  width: 90%;
  max-width: 800px;
  margin: 30px auto;
`;

const PostImage = styled.img`
  width: 90%;
  max-width: 800px;
  height: 500px;
  object-fit: cover;
  margin: 0 auto;
  display: block;

  @media (max-width: 768px) {
    height: 300px;
    width: 90%;
  }
`;

const AuthorProfile = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 auto 1.5rem;
  width: 90%;
  max-width: 800px;

  .author-info {
    display: flex;
    align-items: center;
  }

  .author-image {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    margin-right: 1rem;
    object-fit: cover;
  }

  .author-details {
    display: flex;
    flex-direction: column;
  }

  .author-name {
    font-weight: bold;
    font-size: 1rem;
  }

  .author-email {
    font-size: 0.9rem;
    color: var(--read-more-color);
    text-transform: lowercase;
  }

  @media (max-width: 480px) {
    .author-name {
      font-size: 0.8rem;
    }
    .author-email {
      font-size: 0.7rem;
    }
  }
`;

const ViewProfileButton = styled.button`
  padding: 8px 16px;
  background: transparent;
  color: var(--text-color);
  border: 2px solid var(--text-color);
  border-radius: 30px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
  font-weight: 500;

  &:hover {
    background: var(--text-color);
    color: var(--background-color);
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const PostTitle = styled.h1`
  width: 90%;
  max-width: 800px;
  margin: 1.5rem auto;
  font-size: 2.2rem;
`;

const PostDate = styled.p`
  width: 90%;
  max-width: 800px;
  margin: 1rem auto;
  color: var(--date-color);
`;

const ButtonContainer = styled.div`
  width: 90%;
  max-width: 800px;
  margin: 1rem auto;
`;

const EditButton = styled.button`
  padding: 10px 20px;
  background: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  margin-top: 10px;

  &:hover {
    background: #0056b3;
  }
`;

const DeleteButton = styled.button`
  padding: 10px 20px;
  background: #dc3545;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  margin-top: 10px;
  margin-left: 10px;

  &:hover {
    background: #c82333;
  }
`;

const CommentSection = styled.div`
  width: 90%;
  max-width: 800px;
  margin: 5rem auto;
`;

const CommentForm = styled.form`
  display: flex;
  flex-direction: column;
  margin-bottom: 2rem;
`;

const CommentInput = styled.textarea`
  background-color: var(--background-color);
  color: var(--text-color);
  width: 100%;
  padding: 12px;
  font-size: 1rem;
  border: 1px solid var(--text-color);
  border-radius: 5px;
  margin-bottom: 10px;
  resize: vertical;
`;

const CommentButton = styled.button`
  align-self: flex-start;
  padding: 8px 16px;
  background: #563a9c;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
`;
const LoginToCommentButton = styled.button`
  align-self: flex-start;
  padding: 8px 16px;
  background: #563a9c;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
`;

const CommentList = styled.div`
  margin-top: 2rem;
`;

const CommentItem = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid var(--text-color);
  padding-bottom: 1rem;
`;

const CommentAvatar = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 1rem;
`;

const CommentContent = styled.div`
  width: 100%;
`;

const CommentAuthor = styled.div`
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const CommentText = styled.p`
  font-size: 1rem;
  color: var(--text-color);
`;

const CommentDate = styled.span`
  font-size: 0.85rem;
  color: var(--date-color);
`;

const DeleteCommentButton = styled.button`
  padding: 5px 10px;
  background: #dc3545;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 12px;
  margin-top: 5px;
  margin-left: 20px;

  &:hover {
    background: #c82333;
  }
`;
const ImageSource = styled.a`
  color: #007bff;
  text-decoration: none;
  font-size: 0.8rem;
  margin-top: 0.5rem;
  display: block;
  text-align: center;
  &:hover {
    color: #0056b3;
  }
`;

export const DetailedPostViewSection = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, authToken, refreshAccessToken, isAuthenticated } =
    useContext(AuthContext);
  const navigate = useNavigate();

  const isAuthor = user?.id === post?.author?.id;

  const handleEdit = () => {
    navigate(`/posts/${post.id}/edit`);
  };

  const handleDelete = async () => {
    if (!authToken) {
      alert("You are not authorized to delete this post.");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post? This action cannot be undone."
    );

    if (confirmDelete) {
      try {
        const response = await axiosInstance.delete(
          `/api/blog/posts/${id}/delete/`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        if (response.status === 204) {
          alert("Post deleted successfully");
          setPost(null);
          navigate("/posts");
          return;
        } else {
          setError("Failed to delete the post. Please try again.");
        }
      } catch (err) {
        if (err.response && err.response.status === 401) {
          try {
            const refreshedToken = await refreshAccessToken();

            if (refreshedToken) {
              const retryResponse = await axiosInstance.delete(
                `/api/blog/posts/${id}/delete/`,
                {
                  headers: {
                    Authorization: `Bearer ${refreshedToken}`,
                  },
                }
              );

              if (retryResponse.status === 204) {
                alert("Post deleted successfully after token refresh");
                setPost(null);
                navigate("/posts");
              }
            } else {
              setError("Unable to refresh token. Please log in again.");
            }
          } catch (refreshError) {
            setError("Failed to refresh token. Please log in again.");
          }
        } else {
          setError("Failed to delete the post. Please try again.");
        }
      }
    } else {
      console.log("Post deletion canceled");
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!newComment.trim()) return;

    try {
      const response = await axiosInstance.post(
        `/api/blog/posts/${id}/comments/add/`,
        { content: newComment },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      setComments([...comments, response.data]);
      setNewComment("");
    } catch (err) {
      setError("Failed to add comment.");
    }
  };

  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        const response = await axiosInstance.get(`/api/blog/posts/${id}`);
        setPost(response.data);
      } catch (err) {
        setError("Failed to fetch post details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    const fetchComments = async () => {
      try {
        const response = await axiosInstance.get(
          `/api/blog/posts/${id}/comments/`
        );
        setComments(response.data.reverse());
      } catch (err) {
        setError("Failed to fetch comments.");
      }
    };

    fetchPostDetail();
    fetchComments();
  }, [id]);

  const handleCommentDelete = async (commentId) => {
    if (!authToken) {
      alert("You are not authorized to delete this comment.");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this comment? This action cannot be undone."
    );

    if (confirmDelete) {
      try {
        const response = await axiosInstance.delete(
          `/api/blog/comments/${commentId}/delete/`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        if (response.status === 204) {
          setComments(comments.filter((comment) => comment.id !== commentId));
          alert("Comment deleted successfully");
        } else {
          setError("Failed to delete the comment. Please try again.");
        }
      } catch (err) {
        if (err.response && err.response.status === 401) {
          try {
            const refreshedToken = await refreshAccessToken();

            if (refreshedToken) {
              const retryResponse = await axiosInstance.delete(
                `/api/blog/posts/${id}/comments/${commentId}/delete/`,
                {
                  headers: {
                    Authorization: `Bearer ${refreshedToken}`,
                  },
                }
              );

              if (retryResponse.status === 204) {
                setComments(
                  comments.filter((comment) => comment.id !== commentId)
                );
                alert("Comment deleted successfully after token refresh");
              }
            } else {
              setError("Unable to refresh token. Please log in again.");
            }
          } catch (refreshError) {
            setError("Failed to refresh token. Please log in again.");
          }
        } else {
          setError("Failed to delete the comment. Please try again.");
        }
      }
    }
  };

  // Refreshing every 10 mins
  useEffect(() => {
    const interval = setInterval(async () => {
      if (authToken) {
        await refreshAccessToken();
      }
    }, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, [authToken, refreshAccessToken]);

  if (loading) return <ShimmerPlaceholderDetailedPostView />;
  if (error) return <div className="mt-5 pt-5">{error}</div>;

  const handleViewProfile = (authorId) => {
    if (authorId === user.id) {
      navigate("/profile");
      return;
    }
    navigate(`/profile/${authorId}`);
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-9 col-md-10 col-12">
          <PostTitle>{post.title}</PostTitle>

          {/* Author Profile */}
          <AuthorProfile>
            <div className="author-info">
              <img
                src={post.author.image || "default-author-image.png"}
                alt={post.author.username}
                className="author-image"
              />
              <div className="author-details">
                <span className="author-name">{post.author.username}</span>
                <span className="author-email">{post.author.email}</span>
              </div>
            </div>
            <ViewProfileButton
              onClick={() => handleViewProfile(post.author.id)}
            >
              View Profile
            </ViewProfileButton>
          </AuthorProfile>

          {/* Post Image */}
          <PostImage
            src={post.image_url}
            alt={post.title}
            className="rounded"
          ></PostImage>
          <ImageSource
            href={post.image_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Click to view full image
          </ImageSource>

          {/* Post Content */}
          <PostContent
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(post.content),
            }}
          />

          <PostDate>Posted on: {formatDate(post.date_posted)}</PostDate>

          {isAuthor && (
            <ButtonContainer>
              <EditButton onClick={handleEdit}>Edit Post</EditButton>
              <DeleteButton onClick={handleDelete}>Delete Post</DeleteButton>
            </ButtonContainer>
          )}

          {/* Comment Section */}
          <CommentSection>
            <h2 className="mt-5 mb-3">Add a Comment</h2>
            {isAuthenticated ? (
              <CommentForm onSubmit={handleCommentSubmit}>
                <CommentInput
                  placeholder="Add a public comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <CommentButton type="submit">Post Comment</CommentButton>
              </CommentForm>
            ) : (
              <LoginToCommentButton onClick={() => navigate("/login")}>
                Login to comment
              </LoginToCommentButton>
            )}

            <CommentList>
              <h2 className="mt-5 mb-5">
                Comment{comments.length !== 1 ? "s" : ""} ({comments.length})
              </h2>
              {comments.length === 0 && (
                <p className="mt-5">
                  No comments yet. Be the first to comment!
                </p>
              )}
              {comments.map((comment) => (
                <CommentItem key={comment.id}>
                  <CommentAvatar
                    src={comment.image_url || "default-author-image.png"}
                    alt={comment.author_username}
                  />
                  <CommentContent>
                    <CommentAuthor>{comment.author_username}</CommentAuthor>
                    <CommentText>{comment.content}</CommentText>
                    <CommentDate>{formatDate(comment.date_posted)}</CommentDate>
                    {comment.author === user?.id && (
                      <DeleteCommentButton
                        onClick={() => handleCommentDelete(comment.id)}
                      >
                        Delete
                      </DeleteCommentButton>
                    )}
                  </CommentContent>
                </CommentItem>
              ))}
            </CommentList>
          </CommentSection>

          <FabMenu />
        </div>
      </div>
    </div>
  );
};
