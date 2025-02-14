import { Link } from "react-router-dom";
import formatDate from "../../../utils//formatDate";
import truncateDescription from "../../../utils/truncateDescription";
import { ShimmerPlaceholderAllPosts } from "../../../styles/ShimmerEffects";

const Posts = ({ posts, isLoading }) => {
  const stripHtmlTags = (content) => {
    return content.replace(/<\/?[^>]+(>|$)/g, "");
  };

  return (
    <>
      {isLoading ? (
        [...Array(6)].map((_, index) => (
          <ShimmerPlaceholderAllPosts key={index} index={index} />
        ))
      ) : posts.length === 0 ? (
        <p>No posts available at the moment. Check back later!</p>
      ) : (
        posts.map((post) => {
          return (
            <div className="col-md-4 mb-4" key={post.id}>
              <div className="card h-100 border-0 rounded-4 posts-page-theme">
                <img
                  src={post.image_url || "placeholder-image-url.jpg"}
                  alt={post.title}
                  className="card-img-top rounded-top-4"
                  style={{
                    height: "200px",
                    objectFit: "cover",
                    width: "100%",
                  }}
                />
                <div className="card-body d-flex flex-column">
                  <div className="d-flex align-items-center mb-3">
                    <img
                      src={post.author.image || "placeholder-avatar-url.jpg"}
                      alt={post.author.username}
                      className="rounded-circle me-2"
                      style={{
                        width: "20px",
                        height: "20px",
                        objectFit: "cover",
                      }}
                    />
                    <span
                      className="fw-semibold"
                      style={{ fontSize: "12px", marginBottom: "2px" }}
                    >
                      {post.author.username}
                    </span>
                  </div>
                  <h5
                    className="card-title fw-bold"
                    style={{ fontSize: "14px" }}
                  >
                    {post.title}
                  </h5>
                  <p style={{ fontSize: "13px" }}>
                    {truncateDescription(stripHtmlTags(post.content), 13)}
                  </p>
                  <div
                    className="d-flex align-items-center justify-content-between mt-auto"
                    style={{
                      marginTop: "auto",
                      borderTop: "1px solid var(--text-color)",
                      paddingTop: "10px",
                    }}
                  >
                    <p
                      className="small mb-0"
                      style={{ color: "var(--date-color)" }}
                    >
                      {formatDate(post.date_posted)}
                    </p>
                    <Link
                      style={{ color: "var(--read-more-color)" }}
                      to={`/posts/${post.id}`}
                    >
                      Read More
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}
    </>
  );
};

export default Posts;
