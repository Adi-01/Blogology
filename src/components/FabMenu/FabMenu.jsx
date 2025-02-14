import React, { useContext, useState } from "react";
import "./FabMenu.css";
import { AuthContext } from "../../contexts/AuthContext";
import { ThemeContext } from "../../contexts/ThemeContext"; // Import ThemeContext
import { useNavigate } from "react-router-dom";

const FabMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout, isAuthenticated } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleCreatePost = () => {
    navigate("/newpost");
  };

  const handleLogout = () => {
    logout();
    navigate("/login"); // Redirect to login after logout
  };

  return (
    <div className={`fab-wrapper ${theme}`}>
      {" "}
      {/* Apply theme class */}
      <button className="fab" onClick={toggleMenu}>
        <span className="material-icons">{isOpen ? "close" : "add"}</span>
      </button>
      {isOpen && (
        <div className="fab-options">
          {isAuthenticated && (
            <button
              className="fab-option2"
              title="Logout"
              onClick={handleLogout}
            >
              <span className="material-icons">power_settings_new</span>
            </button>
          )}
          <button
            className="fab-option"
            title="Create"
            onClick={handleCreatePost}
          >
            <span className="material-icons">edit</span>
          </button>
          <button
            className="fab-option"
            title={theme === "light" ? "Dark Mode" : "Light Mode"}
            onClick={toggleTheme}
          >
            <span className="material-icons">
              {theme === "light" ? "dark_mode" : "light_mode"}
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default FabMenu;
