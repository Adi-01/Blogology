import { Link } from "react-router-dom";
import "./HeroSection.css";

const HeroSection = () => {
  return (
    <header className="hero-section d-flex align-items-center">
      <div className="container d-flex flex-column flex-lg-row align-items-center justify-content-between mt-5">
        <div className="text-content text-white">
          <h1 className="display-4 fw-bold">Create a blog with Blogology.</h1>
          <p className="lead">Everything you need to get started is here!</p>
          <div className="d-flex justify-content-center gap-2 mt-3">
            <Link
              to="/register"
              className="btn btn-outline-light px-4 py-2 hero-section-btn"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeroSection;
