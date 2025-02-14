import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeProvider";
import PrivateRoute from "./utils/PrivateRoute";
import HomeNavbar from "./components/Sections/HomeNavbar";
import Navbar from "./components/Layout/Navbar";
import HeroSection from "./components/Sections/HeroSection";
import {
  PostViewSection,
  DetailedPostViewSection,
} from "./components/Sections/PostView";
import Footer from "./components/Layout/Footer";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CreatePostPage from "./pages/CreatePostPage";
import ProfilePage from "./pages/ProfilePage";
import RequestPasswordReset from "./pages/RequestPasswordReset";
import ResetPassword from "./pages/ResetPassword";
import UpdateUserProfile from "./pages/UpdateUserProfile";
import EditPostPage from "./pages/EditPostPage";
import AboutUs from "./pages/AboutusPage";
import ProfileOfSpecificUser from "./pages/ProfileOfSpecificUser";
function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <HomeNavbar />
                  <HeroSection />
                </>
              }
            />
            <Route
              path="/about"
              element={
                <>
                  <Navbar />
                  <AboutUs />
                </>
              }
            />
            <Route
              path="/login"
              element={
                <>
                  <Navbar />
                  <LoginPage />
                </>
              }
            />
            <Route
              path="/register"
              element={
                <>
                  <Navbar />
                  <RegisterPage />
                </>
              }
            />
            <Route
              path="/profile"
              element={
                <>
                  <Navbar />
                  <PrivateRoute>
                    <ProfilePage />
                  </PrivateRoute>
                </>
              }
            />
            <Route
              path="/posts"
              element={
                <>
                  <Navbar />
                  <PrivateRoute>
                    <PostViewSection />
                  </PrivateRoute>
                </>
              }
            />
            <Route
              path="/newpost"
              element={
                <>
                  <Navbar />
                  <PrivateRoute>
                    <CreatePostPage />
                  </PrivateRoute>
                </>
              }
            />

            <Route
              path="/posts/:id"
              element={
                <>
                  <Navbar />
                  <DetailedPostViewSection />
                </>
              }
            />

            <Route
              path="/request-password-reset"
              element={
                <>
                  <Navbar />
                  <RequestPasswordReset />
                </>
              }
            />

            <Route
              path="/reset-your-password"
              element={
                <>
                  <Navbar />
                  <ResetPassword />
                </>
              }
            />

            <Route
              path="/edit-your-profile"
              element={
                <>
                  <Navbar />
                  <UpdateUserProfile />
                </>
              }
            />
            <Route
              path="/posts/:id/edit"
              element={
                <>
                  <Navbar />
                  <EditPostPage />
                </>
              }
            />
            <Route
              path="/profile/:id"
              element={
                <>
                  <Navbar />
                  <ProfileOfSpecificUser />
                </>
              }
            />

            <Route path="*" element={<div>404 - Page Not Found</div>} />
          </Routes>
          <Footer />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
