import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import DOMPurify from "dompurify";
import formatDate from "../utils/formatDate";
import truncateDescription from "../utils/truncateDescription";

const PostsSection = styled.div`
  padding: 20px;
  height: auto;
  width: auto;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  justify-items: center;
  align-items: start;
  margin: 0 auto;

  @media (max-width: 480px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

const PostCard = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 20px;
  border: 1px solid var(--text-color);
`;

const PostImage = styled.img`
  width: 100%;
  object-fit: cover;
  object-position: center;
  cursor: pointer;
`;

const PostContent = styled.div`
  padding: 10px;
  flex: 1;
`;

const PostTitle = styled.h4`
  margin: 0;
  font-size: 16px;
  color: var(--text-color);
  font-weight: 600;
`;

const PostDescription = styled.p`
  margin: 5px 0 0;
  font-size: 12px;
  color: var(--text-color);
`;

const PostDate = styled.p`
  margin: 10px 0 0;
  font-size: 12px;
  color: var(--date-color);
`;

const ErrorMessage = styled.div`
  color: red;
  text-align: center;
  margin-top: 70px;
`;

const NoPostsFound = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 10vh;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const PageButton = styled.button`
  background-color: transparent;
  border: 2px solid var(--text-color);
  padding: 5px 10px;
  margin: 0 5px;
  font-size: 14px;
  cursor: pointer;
  color: var(--text-color);
  border-radius: 5px;
  transition: background-color 0.3s ease;

  &.active {
    background-color: var(--text-color);
    color: var(--background-color);
    font-weight: bold;
  }
`;

const PostsBySpecificUser = ({ posts }) => {
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 4;

  const indexOfLastPost = currentPage * postsPerPage;

  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePostClick = (postId) => {
    navigate(`/posts/${postId}`);
  };

  const totalPages = Math.ceil(posts.length / postsPerPage);

  if (posts.length === 0) {
    return <NoPostsFound>User has no posts</NoPostsFound>;
  }

  return (
    <>
      <PostsSection>
        {currentPosts.map((post) => (
          <PostCard key={post.id}>
            <PostImage
              src={post.image_url}
              alt={post.title}
              onClick={() => handlePostClick(post.id)}
            />
            <PostContent>
              <PostTitle>{post.title}</PostTitle>
              <PostDescription
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(
                    truncateDescription(post.content, 10)
                  ),
                }}
              />
              <PostDate>
                <span>{formatDate(post.date_posted)}</span>
              </PostDate>
            </PostContent>
          </PostCard>
        ))}
      </PostsSection>
      <Pagination>
        {Array.from({ length: totalPages }, (_, index) => (
          <PageButton
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={currentPage === index + 1 ? "active" : ""}
          >
            {index + 1}
          </PageButton>
        ))}
      </Pagination>
    </>
  );
};

export default PostsBySpecificUser;
