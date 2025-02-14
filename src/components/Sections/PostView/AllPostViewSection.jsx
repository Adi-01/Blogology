import { useState, useEffect, useCallback } from "react";
import Posts from "./Posts";

const AllPostViewSection = ({ allPosts, isLoading }) => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  // Define the page change logic
  const handlePageChange = useCallback(
    (page) => {
      if (page >= 1 && page <= Math.ceil(allPosts.length / postsPerPage)) {
        setCurrentPage(page);
        const startIndex = (page - 1) * postsPerPage;
        const selectedPosts = allPosts.slice(
          startIndex,
          startIndex + postsPerPage
        );
        setPosts(selectedPosts);
      }
    },
    [allPosts]
  );

  useEffect(() => {
    handlePageChange(1);
  }, [handlePageChange]);

  return (
    <section className="py-5 all-posts-section">
      <div className="container">
        <h2 className="text-start mb-5 custom-border">
          {isLoading ? "" : "All Posts"}
        </h2>
        <div className="row">
          <Posts posts={posts} isLoading={isLoading} />
        </div>

        {/* Pagination Controls */}
        <div className="pagination d-flex justify-content-center align-items-center mt-3">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="btn btn-primary mx-2"
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {Math.ceil(allPosts.length / postsPerPage)}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === Math.ceil(allPosts.length / postsPerPage)}
            className="btn btn-primary mx-2"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
};

export default AllPostViewSection;
