import "./ShimmerEffects.css";
import "../../styles/ProfilePage.css";

export const ShimmerPlaceholderProfilePage = () => {
  return (
    <div className="profile-page">
      <div className="col-md-9 profile-content">
        {/* Profile Image and Info */}
        <div className="text-center mb-5">
          {/* Circular Profile Image Skeleton */}
          <div
            className="skeleton-item shimmer rounded-circle mt-5"
            style={{
              width: "100px",
              height: "100px",
              margin: "0 auto",
              objectFit: "cover",
              marginTop: "40px",
            }}
          ></div>
          {/* Username Skeleton */}
          <div
            className="skeleton-item shimmer"
            style={{
              width: "150px",
              height: "20px",
              margin: "20px auto 10px auto",
              borderRadius: "4px",
            }}
          ></div>
          {/* Email Skeleton */}
          <div
            className="skeleton-item shimmer"
            style={{
              width: "200px",
              height: "15px",
              margin: "10px auto",
              borderRadius: "4px",
            }}
          ></div>
        </div>

        {/* Form Skeleton */}
        <form>
          <div className="row">
            {/* Repeated Input Field Skeletons */}

            {Array(3)
              .fill(0)
              .map((_, index) => (
                <div className="col-md-6 mb-4" key={index}>
                  <div
                    className="skeleton-item shimmer"
                    style={{
                      width: "30%",
                      height: "20px",
                      marginBottom: "8px",
                      borderRadius: "4px",
                    }}
                  ></div>
                  <div
                    className="skeleton-item shimmer"
                    style={{
                      width: "100%",
                      height: "35px",
                      borderRadius: "4px",
                    }}
                  ></div>
                </div>
              ))}
            {/* Textarea Skeleton */}
            <div className="col-md-12 mb-3">
              <div
                className="skeleton-item shimmer"
                style={{
                  width: "109px",
                  height: "20px",
                  marginBottom: "8px",
                  borderRadius: "4px",
                }}
              ></div>
              <div
                className="skeleton-item shimmer"
                style={{
                  width: "100%",
                  height: "120px",
                  borderRadius: "4px",
                }}
              ></div>
            </div>
          </div>
        </form>

        {/* Button Skeleton */}
        <div
          className="skeleton-item shimmer mt-3"
          style={{
            width: "120px",
            height: "44px",
            borderRadius: "4px",
          }}
        ></div>
      </div>
    </div>
  );
};

export const ShimmerPlaceholderOtherPost = ({ index }) => {
  return (
    <div
      key={index}
      className="recent-article d-flex mb-4"
      style={{ maxWidth: "100%", wordWrap: "break-word" }}
    >
      {/* Image Skeleton */}
      <div
        className="skeleton-item shimmer"
        style={{
          width: "135px",
          height: "146px",
          borderRadius: "4px",
        }}
      ></div>
      {/* Content Skeleton */}
      <div
        className="flex-grow-1"
        style={{
          maxWidth: "calc(100% - 150px)",
          marginLeft: "10px",
        }}
      >
        {/* Author Skeleton */}
        <div className="d-flex align-items-center mb-2">
          <div
            className="skeleton-item shimmer"
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              marginRight: "10px",
            }}
          ></div>
          <div
            className="skeleton-item shimmer"
            style={{
              width: "100px",
              height: "15px",
              borderRadius: "4px",
            }}
          ></div>
        </div>
        {/* Title Skeleton */}
        <div
          className="skeleton-item shimmer"
          style={{
            width: "80%",
            height: "20px",
            marginBottom: "10px",
            borderRadius: "4px",
          }}
        ></div>
        {/* Content Skeleton */}
        <div
          className="skeleton-item shimmer"
          style={{
            width: "70%",
            height: "10px",
            marginBottom: "10px",
            borderRadius: "4px",
          }}
        ></div>
        {/* Date Skeleton */}
        <div
          className="skeleton-item shimmer mt-5"
          style={{
            width: "80px",
            height: "13px",
            borderRadius: "4px",
          }}
        ></div>
      </div>
    </div>
  );
};

export const ShimmerPlaceholderMainPost = () => {
  return (
    <div className="skeleton">
      <div className="skeleton-item shimmer skeleton-main-post-img" />

      <div className="d-flex align-items-center mb-2">
        <div
          className="skeleton-item shimmer"
          style={{
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            marginRight: "10px",
          }}
        ></div>
        <div
          className="skeleton-item shimmer"
          style={{
            width: "100px",
            height: "20px",
            borderRadius: "4px",
          }}
        ></div>
      </div>
      <div className="skeleton-item shimmer skeleton-main-post-title" />
      <div className="skeleton-item shimmer skeleton-main-post-content" />
      <div className="skeleton-item shimmer skeleton-main-post-content" />
      <div className="skeleton-item shimmer skeleton-main-post-content" />
      <div className="skeleton-item shimmer skeleton-main-post-content" />
      <div className="skeleton-item shimmer skeleton-main-post-content" />

      <div
        className="skeleton-item shimmer mt-4"
        style={{
          width: "80px",
          height: "13px",
          borderRadius: "4px",
        }}
      ></div>
    </div>
  );
};

export const ShimmerPlaceholderAllPosts = ({ index }) => {
  return (
    <div
      key={index}
      className="col-md-4 mb-4"
      style={{ maxWidth: "100%", wordWrap: "break-word" }}
    >
      <div className="card h-100 shadow-sm border-0 rounded-4">
        {/* Image Skeleton */}
        <div
          className="skeleton-item shimmer rounded-top-4"
          style={{
            height: "200px",
            objectFit: "cover",
          }}
        ></div>

        <div className="card-body d-flex flex-column">
          {/* Author Skeleton */}
          <div className="d-flex align-items-center mb-3">
            <div
              className="skeleton-item shimmer"
              style={{
                width: "25px",
                height: "25px",
                borderRadius: "50%",
                marginRight: "10px",
              }}
            ></div>
            <div
              className="skeleton-item shimmer"
              style={{
                width: "60%",
                height: "10px",
                borderRadius: "4px",
              }}
            ></div>
          </div>
          {/* Title Skeleton */}
          <div
            className="skeleton-item shimmer"
            style={{
              width: "90%",
              height: "15px",
              marginBottom: "10px",
              borderRadius: "4px",
            }}
          ></div>
          {/* Content Skeleton */}
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <div
                key={index}
                className="skeleton-item shimmer"
                style={{
                  width: "96%",
                  height: "8px",
                  marginBottom: "10px",
                  borderRadius: "4px",
                }}
              />
            ))}
          ;{/* Date Skeleton */}
          <div
            className="d-flex align-items-center justify-content-between mt-auto"
            style={{
              marginTop: "auto",
              borderTop: "1px solid #eee",
              paddingTop: "10px",
            }}
          >
            <div
              className="skeleton-item shimmer"
              style={{
                width: "80px",
                height: "13px",
                borderRadius: "4px",
              }}
            ></div>
            <div
              className="skeleton-item shimmer"
              style={{
                width: "50px",
                height: "13px",
                borderRadius: "4px",
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ShimmerPlaceholderDetailedPostView = () => {
  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-9 col-md-10 col-12">
          {/* Title Skeleton */}
          <div
            className="skeleton-item shimmer mb-4 mt-4"
            style={{
              width: "100%",
              height: "36px",
              borderRadius: "4px",
            }}
          ></div>

          {/* Author Info Skeleton */}
          <div className="d-flex align-items-center mb-4">
            <div
              className="skeleton-item shimmer"
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                marginRight: "16px",
              }}
            ></div>
            <div>
              <div
                className="skeleton-item shimmer mb-2"
                style={{
                  width: "120px",
                  height: "24px",
                  borderRadius: "4px",
                }}
              ></div>
              <div
                className="skeleton-item shimmer"
                style={{
                  width: "150px",
                  height: "18px",
                  borderRadius: "4px",
                }}
              ></div>
            </div>
          </div>

          {/* Main Image Skeleton */}
          <div
            className="skeleton-item shimmer mb-4"
            style={{
              width: "100%",
              height: "500px",
              borderRadius: "8px",
              objectFit: "cover",
            }}
          ></div>

          {/* Content Paragraphs Skeleton */}
          {Array(3)
            .fill(0)
            .map((_, index) => (
              <div key={index} className="mb-3">
                <div
                  className="skeleton-item shimmer mb-2"
                  style={{
                    width: "100%",
                    height: "16px",
                    borderRadius: "4px",
                  }}
                ></div>
                <div
                  className="skeleton-item shimmer mb-2"
                  style={{
                    width: "100%",
                    height: "16px",
                    borderRadius: "4px",
                  }}
                ></div>
                <div
                  className="skeleton-item shimmer"
                  style={{
                    width: "100%",
                    height: "16px",
                    borderRadius: "4px",
                  }}
                ></div>
              </div>
            ))}

          {/* Date Posted Skeleton */}
          <div
            className="skeleton-item shimmer mt-3"
            style={{
              width: "150px",
              height: "16px",
              borderRadius: "4px",
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};
