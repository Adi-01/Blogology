import { useState, useEffect, useCallback, useContext } from "react";
import axiosInstance from "../utils/AxiosInstance";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/ProfilePage.css";
import FabMenu from "../components/FabMenu";
import { ShimmerPlaceholderProfilePage } from "../styles/ShimmerEffects";

function EditUserProfile() {
  const { authToken, refreshAccessToken, logout } = useContext(AuthContext);
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    image: "",
    about_me: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchProfile = useCallback(
    async (token) => {
      try {
        const response = await axiosInstance.get("/api/user/update-profile/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(response.data);
        setIsLoading(false);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          const newAccessToken = await refreshAccessToken();
          if (newAccessToken) {
            fetchProfile(newAccessToken);
          } else {
            setError("Failed to refresh token. Please log in again.");
            logout();
            navigate("/login");
            setIsLoading(false);
          }
        } else {
          setError("Failed to fetch profile. Please try again later.");
          setIsLoading(false);
        }
      }
    },
    [refreshAccessToken, logout, navigate]
  );

  // Fetch the profile on component mount
  useEffect(() => {
    if (authToken) {
      fetchProfile(authToken);
    } else {
      setIsLoading(false);
    }
  }, [authToken, fetchProfile]);

  //Refreshin every 10 mins
  useEffect(() => {
    const interval = setInterval(async () => {
      if (authToken) {
        await refreshAccessToken();
      }
    }, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, [authToken, refreshAccessToken]);

  // Handling form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handling form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await axiosInstance.patch("/api/user/update-profile/", userData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      alert("Profile updated successfully!");
      navigate("/profile");
    } catch (err) {
      if (err.response) {
        // Check for 401 error and handle token refresh logic
        if (err.response.status === 401) {
          const newAccessToken = await refreshAccessToken();
          if (newAccessToken) {
            // If token refresh is successful, retry the form submission with the new token
            // Set the new token in the headers and submit again
            await axiosInstance.patch("/api/user/update-profile/", userData, {
              headers: {
                Authorization: `Bearer ${newAccessToken}`, // Use the refreshed token
              },
            });

            alert("Profile updated successfully!");
            navigate("/profile");
          } else {
            setError("Failed to refresh token. Please log in again.");
            logout();
            navigate("/login");
          }
        }
        // Check for 400 error and handle email uniqueness validation
        else if (err.response.status === 400) {
          const errorMessages = err.response.data;
          if (errorMessages.email) {
            setError(errorMessages.email[0]);
          } else {
            setError("Failed to update profile. Please try again later.");
          }
        }
      } else {
        setError("Failed to update profile. Please try again later.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {isLoading ? (
        <ShimmerPlaceholderProfilePage />
      ) : (
        <div className="profile-page">
          <div className="col-md-9 profile-content">
            <div className="text-center mb-5">
              <img
                src={userData.image}
                alt={userData.username}
                className="rounded-circle profile-img"
              />
              <h4 className="mt-2" style={{ color: "var(--text-color)" }}>
                {userData.username}
              </h4>
              <span style={{ color: "var(--read-more-color)" }}>
                {userData.email}
              </span>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Profile Image</label>
                  <input
                    type="text"
                    name="image"
                    value={userData.image}
                    className="form-control input-field border-0"
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">User Name</label>
                  <input
                    type="text"
                    name="username"
                    value={userData.username}
                    className="form-control input-field border-0"
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={userData.email}
                    className="form-control input-field border-0"
                    onChange={handleChange}
                  />
                  {error && <p className="text-danger mt-2">{error}</p>}
                </div>
                <div className="col-md-12 mb-3">
                  <label className="form-label">About Me</label>
                  <textarea
                    id="about-me"
                    name="about_me"
                    className="form-control input-field border-0"
                    value={userData.about_me}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <button
                className="custom-profile-page-btn mt-3"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Updating..." : "Update Profile"}
              </button>
            </form>
            <FabMenu />
          </div>
        </div>
      )}
    </>
  );
}

export default EditUserProfile;
