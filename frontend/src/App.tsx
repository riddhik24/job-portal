import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import AuthPage from "./pages/Auth";
import HomePage from "./pages/Home";
import JobsPage from "./pages/Jobs";
import ProfilePage from "./pages/Profile";
import PostJobPage from "./pages/PostJob";
import Navbar from "./components/Navbar";
import { Toaster } from "sonner";
import JobApplyPage from "./pages/Apply";
import ScrollToTop from "./components/ScrollToTop";

function Logout() {
  const { logout } = useAuthStore();
  useEffect(() => {
    logout();
  }, [logout]);
  return <Navigate to="/auth" />;
}

function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  const excludedPages = ["/jobs"];
  return (
    <Router>
      <ScrollToTop excludedRoutes={excludedPages} />
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <Navbar />
        <Routes>
          <Route
            path="/auth"
            element={!authUser ? <AuthPage /> : <Navigate to="/" />}
          />
          <Route
            path="/logout"
            element={authUser ? <Logout /> : <Navigate to={"/auth"} />}
          />
          <Route
            path="/"
            element={authUser ? <HomePage /> : <Navigate to="/auth" />}
          />
          <Route
            path="/jobs"
            element={authUser ? <JobsPage /> : <Navigate to="/auth" />}
          />
          <Route
            path="/profile"
            element={authUser ? <ProfilePage /> : <Navigate to="/auth" />}
          />
          <Route
            path="/post-job"
            element={
              authUser && authUser.role === "recruiter" ? (
                <PostJobPage />
              ) : (
                <Navigate to="/auth" />
              )
            }
          />
          <Route
            path="/apply/:id"
            element={authUser ? <JobApplyPage /> : <Navigate to="/auth" />}
          />
        </Routes>
        <Toaster position="top-center" />
      </div>
    </Router>
  );
}

export default App;
