import { Link } from "react-router-dom";
import "./HomeNavbar.css";

const HomeNavbar = () => {
  return (
    <nav className={"navbar navbar-expand-lg navbar-dark fixed-top"}>
      <div className="container">
        <Link className="navbar-brand">BLOGOLOGY</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="text-light nav-link" to="/about-author">
                About
              </Link>
            </li>
            <li className="nav-item">
              <Link className="text-light nav-link" to="/login">
                Login
              </Link>
            </li>
            <li className="nav-item">
              <Link className="text-light nav-link" to="/register">
                Register
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default HomeNavbar;
