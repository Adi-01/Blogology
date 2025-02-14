import { FaFacebookF, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer
      className="py-5 mt-auto"
      style={{
        backgroundColor: "var(--footer-bg)",
        color: "var(--footer-text)",
      }}
    >
      <div className="container">
        <div className="row gy-5 gx-md-5">
          {/* About Column */}
          <div className="col-md-4">
            <h5 className="mb-4">BLOGOLOGY | INDEPENDENT.</h5>
            <p className="mb-4">
              We create amazing content with passion and dedication. No
              investors, no suits, just authentic stories and a deep love for
              what we do.
            </p>
            <p className="mb-3">Contact Us:</p>
            <a href="mailto:info@blogology.com" className="footer-link">
              info@blogology.com
            </a>
          </div>

          {/* Quick Links Column */}
          <div className="col-md-4">
            <h5 className="mb-4">QUICK LINKS</h5>
            <ul className="list-unstyled">
              <li className="mb-3">
                <a href="/terms" className="footer-link">
                  Terms of Service
                </a>
              </li>
              <li className="mb-3">
                <a href="/privacy" className="footer-link">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Stay in Touch Column */}
          <div className="col-md-4">
            <h5 className="mb-4">STAY IN TOUCH</h5>
            <p className="mb-4">
              Subscribe to receive updates, access to exclusive content, and
              more.
            </p>
            <div className="d-flex mb-4">
              <input
                type="email"
                className="form-control me-2"
                placeholder="Enter your email address"
                aria-label="Email address"
              />
              <button
                className="btn btn-dark px-4"
                type="button"
                style={{ whiteSpace: "nowrap" }}
              >
                SUBSCRIBE
              </button>
            </div>
            <div className="d-flex">
              <a href="https://facebook.com" className="footer-link me-3">
                <FaFacebookF size={18} />
              </a>
              <a href="https://instagram.com" className="footer-link">
                <FaInstagram size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div
          className="row mt-5 pt-4 border-top"
          style={{ borderColor: "var(--footer-text)" }}
        >
          <div className="col-12 text-center">
            <p className="mb-0">
              &copy; 2024 BLOGOLOGY |{" "}
              <a href="/terms" className="footer-link">
                TERMS OF SERVICE
              </a>{" "}
              |{" "}
              <a href="/privacy" className="footer-link">
                PRIVACY POLICY
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
