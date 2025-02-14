import "./RecentPostViewSection.css";
import formatDate from "../../../utils/truncateDescription";
import truncateDescription from "../../../utils/truncateDescription";
import { useNavigate } from "react-router-dom";
import {
  ShimmerPlaceholderMainPost,
  ShimmerPlaceholderOtherPost,
} from "../../../styles/ShimmerEffects";

const RecentPostViewSection = ({ posts, isLoading }) => {
  const mainPost = posts[0];
  const otherPosts = posts.slice(1, 4);
  const navigate = useNavigate();

  const stripHtmlTags = (content) => content.replace(/<\/?[^>]+(>|$)/g, "");

  return (
    <section className="py-5 featured-section">
      <div className="container">
        <h2 className="text-start mt-4 mb-5 custom-border">
          {isLoading ? "" : "Recent Posts"}
        </h2>
        <div className="row gx-5">
          {/* Main Featured Post */}
          {isLoading ? (
            <div className="col-lg-6 mb-5">
              <ShimmerPlaceholderMainPost />
            </div>
          ) : (
            mainPost && (
              <div className="col-lg-6 mb-5">
                <div
                  className="featured-article"
                  onClick={() => navigate(`/posts/${mainPost.id}`)}
                >
                  <img
                    src={mainPost.image_url}
                    alt={mainPost.title}
                    className="img-fluid rounded"
                  />
                  <div className="mt-3">
                    <div className="author-info d-flex align-items-center">
                      <img
                        src={
                          mainPost.author.image || "placeholder-avatar-url.jpg"
                        }
                        alt={mainPost.author.username}
                        className="rounded-circle me-2"
                        style={{
                          width: "23px",
                          height: "23px",
                          objectFit: "cover",
                        }}
                      />
                      <span className="fw-semibold small">
                        {mainPost.author.username}
                      </span>
                    </div>
                    <h3 className="article-title">{mainPost.title}</h3>
                    <p>
                      {truncateDescription(stripHtmlTags(mainPost.content), 50)}
                    </p>
                    <div className="date-container">
                      <p
                        className="small mb-0 me-3"
                        style={{ color: "var(--date-color)" }}
                      >
                        {formatDate(mainPost.date_posted)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}

          {/* Other Recent Posts */}
          <div className="col-lg-6 col-md-12">
            <div className="other-recent-posts">
              {isLoading
                ? Array(3)
                    .fill(0)
                    .map((_, index) => (
                      <ShimmerPlaceholderOtherPost key={index} index={index} />
                    ))
                : otherPosts.map((post) => (
                    <div
                      key={post.id}
                      className="recent-article d-flex mb-4"
                      onClick={() => navigate(`/posts/${post.id}`)}
                      style={{ maxWidth: "100%", wordWrap: "break-word" }}
                    >
                      <img
                        src={post.image_url}
                        alt={post.title}
                        className="img-fluid rounded me-3 other-recent-custom-img"
                        style={{
                          width: "135px",
                          height: "145px",
                          objectFit: "cover",
                        }}
                      />
                      <div
                        className="flex-grow-1"
                        style={{ maxWidth: "calc(100% - 150px)" }}
                      >
                        <div className="d-flex align-items-center justify-content-between mb-2">
                          <div className="author-info d-flex align-items-center">
                            <img
                              src={
                                post.author.image ||
                                "placeholder-avatar-url.jpg"
                              }
                              alt={post.author.username}
                              className="rounded-circle me-2 other-recent-author-img"
                              style={{
                                width: "23px",
                                height: "23px",
                                objectFit: "cover",
                              }}
                            />
                            <span className=" fw-semibold small">
                              {post.author.username}
                            </span>
                          </div>
                        </div>
                        <h6
                          className="recent-article-title text-truncate"
                          style={{ maxWidth: "100%" }}
                        >
                          {post.title}
                        </h6>
                        <p
                          className="small text-truncate"
                          style={{ maxWidth: "100%" }}
                        >
                          {truncateDescription(stripHtmlTags(post.content), 10)}
                        </p>
                        <div className="d-flex justify-content-start">
                          <p
                            className="small mb-0 mt-4"
                            style={{ color: "var(--date-color)" }}
                          >
                            {formatDate(post.date_posted)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecentPostViewSection;
