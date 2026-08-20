import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { Briefcase, User, Home, LogOut, PlusCircle } from "lucide-react";

export default function Navbar() {
  const { authUser, logout } = useAuthStore();
  const location = useLocation();

  if (!authUser) return null;

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Brand */}
          <Link to="/" className="flex items-center space-x-3 text-lg font-bold tracking-tight">
            <div className="h-9 w-9 rounded-lg bg-indigo-600 flex items-center justify-center font-extrabold text-white">
              JP
            </div>
            <span className="hidden sm:inline">JobPortal</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-1 sm:space-x-4">
            <Link
              to="/"
              className={`flex items-center px-3 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                isActive("/")
                  ? "bg-indigo-600 text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Home className="w-4 h-4 sm:mr-1.5" />
              <span className="hidden sm:inline">Home</span>
            </Link>

            <Link
              to="/jobs"
              className={`flex items-center px-3 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                isActive("/jobs")
                  ? "bg-indigo-600 text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Briefcase className="w-4 h-4 sm:mr-1.5" />
              <span className="hidden sm:inline">Jobs</span>
            </Link>

            <Link
              to="/profile"
              className={`flex items-center px-3 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                isActive("/profile")
                  ? "bg-indigo-600 text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <User className="w-4 h-4 sm:mr-1.5" />
              <span className="hidden sm:inline">Profile</span>
            </Link>

            {authUser?.role === "recruiter" && (
              <Link
                to="/post-job"
                className={`flex items-center px-3 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                  isActive("/post-job")
                    ? "bg-indigo-600 text-white"
                    : "text-indigo-400 hover:bg-indigo-500/10 hover:text-indigo-300"
                }`}
              >
                <PlusCircle className="w-4 h-4 sm:mr-1.5" />
                <span className="hidden sm:inline">Post Job</span>
              </Link>
            )}

            {/* Logout Button */}
            <button
              onClick={() => logout()}
              className="flex items-center px-3 py-2 rounded-xl text-xs font-semibold tracking-wide text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4 sm:mr-1.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
