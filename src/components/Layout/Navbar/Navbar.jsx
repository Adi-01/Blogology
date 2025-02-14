import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import "@fortawesome/fontawesome-free/css/all.min.css";
import UserAvatar from "./UserAvatar";

const NavbarContainer = styled.nav`
  color: #fff;
  background: #131010 !important;
  padding: 5px 16px;
  border: none;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
`;

const Brand = styled(Link)`
  color: #efe5ff;
  font-size: 24px;
  transition: font-size 0.3s ease;

  &:hover,
  &:focus {
    color: #fff;
  }

  @media (max-width: 768px) {
    font-size: 20px;
  }

  @media (max-width: 480px) {
    font-size: 18px;
  }
`;

const NavItemsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: 768px) {
    gap: 4px;
  }
`;

const NavItem = styled(Link)`
  color: #ffffff;
  font-size: 18px;
  position: relative;
  padding: 8px 12px;

  &:hover,
  &:focus {
    color: #fff;
  }

  @media (max-width: 768px) {
    font-size: 16px;
    padding: 6px 10px;
  }

  /* Tooltip styles */
  &[data-tooltip]:hover::after {
    content: attr(data-tooltip);
    position: absolute;
    bottom: -25px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.8);
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    white-space: nowrap;
    z-index: 1002;
  }
`;

const Navbar = () => {
  const location = useLocation();

  // Determine what to render based on the route
  const renderNavItems = () => {
    const route = location.pathname;

    if (route === "/login") {
      return (
        <>
          <NavItem to="/" className="nav-item nav-link" data-tooltip="Home">
            <i className="fas fa-home"></i>
          </NavItem>
          <NavItem
            to="/register"
            className="nav-item nav-link"
            data-tooltip="Register"
          >
            <i className="fas fa-user-plus"></i>
          </NavItem>
        </>
      );
    } else if (route === "/register") {
      return (
        <>
          <NavItem to="/" className="nav-item nav-link" data-tooltip="Home">
            <i className="fas fa-home"></i>
          </NavItem>
          <NavItem
            to="/login"
            className="nav-item nav-link"
            data-tooltip="Login"
          >
            <i className="fas fa-sign-in-alt"></i>
          </NavItem>
        </>
      );
    } else if (route === "/posts") {
      return (
        <>
          <NavItem
            to="/profile"
            className="nav-item nav-link d-flex align-items-center"
            data-tooltip="Profile"
          >
            <UserAvatar />
          </NavItem>
        </>
      );
    } else if (route === "/newpost") {
      return (
        <>
          <NavItem
            to="/posts"
            className="nav-item nav-link"
            data-tooltip="Posts"
          >
            <i className="fas fa-book-open"></i>
          </NavItem>
          <NavItem
            to="/profile"
            className="nav-item nav-link d-flex align-items-center"
            data-tooltip="Profile"
          >
            <UserAvatar />
          </NavItem>
        </>
      );
    } else if (route.startsWith("/posts/")) {
      return (
        <>
          <NavItem
            to="/posts"
            className="nav-item nav-link"
            data-tooltip="Posts"
          >
            <i className="fas fa-book-open"></i>
          </NavItem>
          <NavItem
            to="/profile"
            className="nav-item nav-link d-flex align-items-center"
            data-tooltip="Profile"
          >
            <UserAvatar />
          </NavItem>
        </>
      );
    } else if (
      route === "/request-password-reset" ||
      route === "/reset-your-password" ||
      route === "/about"
    ) {
      return (
        <>
          <NavItem to="/" className="nav-item nav-link" data-tooltip="Home">
            <i className="fas fa-home"></i>
          </NavItem>
        </>
      );
    } else if (route === "/profile" || route === "/edit-your-profile") {
      return (
        <>
          <NavItem
            to="/posts"
            className="nav-item nav-link"
            data-tooltip="Posts"
          >
            <i className="fas fa-book-open"></i>
          </NavItem>
        </>
      );
    }
    return null;
  };

  return (
    <NavbarContainer className="navbar fixed-top">
      <div className="container-fluid">
        <Brand to="/" className="navbar-brand">
          <b>Blogology</b>
        </Brand>

        <NavItemsContainer>{renderNavItems()}</NavItemsContainer>
      </div>
    </NavbarContainer>
  );
};

export default Navbar;
