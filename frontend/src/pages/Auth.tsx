import { useState } from "react";
import {
  User,
  Briefcase,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import AuthSidebar from "../components/AuthSidebar";
import { toast } from "sonner";

export default function AuthPage() {
  const [isSignup, setIsSignup] = useState(true);
  const [role, setRole] = useState("candidate"); // 'candidate' | 'recruiter'
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const { login, signup } = useAuthStore();
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isSignup) {
        if (formData.password !== formData.confirmPassword) {
          toast.error("Passwords do not match!");
          return;
        }
        await signup({
          email: formData.email,
          password: formData.password,
          role,
        });
      } else {
        await login({
          email: formData.email,
          password: formData.password,
        });
      }
      navigate("/");
    } catch (err) {
      // Caught error to prevent navigation
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-slate-50 dark:bg-slate-950">
      {/* LEFT PANEL: Hero Banner & Testimonial */}
      <AuthSidebar role={role} />

      {/* RIGHT PANEL: Form Container */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-6">
          {/* Header */}
          <div className="space-y-2 text-center sm:text-left">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              {isSignup ? "Create an account" : "Welcome back"}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {isSignup
                ? "Enter your details below to create your account"
                : "Enter your email and password to access your dashboard"}
            </p>
          </div>

          {/* Role Selection Tabs (Candidate vs Recruiter) */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-200/60 dark:bg-slate-800 rounded-lg text-sm font-medium">
            <button
              type="button"
              onClick={() => setRole("candidate")}
              className={`flex items-center justify-center space-x-2 py-2.5 rounded-md transition-all ${
                role === "candidate"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              <User className="h-4 w-4" />
              <span>Candidate</span>
            </button>

            <button
              type="button"
              onClick={() => setRole("recruiter")}
              className={`flex items-center justify-center space-x-2 py-2.5 rounded-md transition-all ${
                role === "recruiter"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              <Briefcase className="h-4 w-4" />
              <span>Recruiter</span>
            </button>
          </div>

          {/* Main Auth Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-4 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:text-slate-100"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                {!isSignup && (
                  <a
                    href="#forgot"
                    className="text-xs text-indigo-600 hover:underline"
                  >
                    Forgot password?
                  </a>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:text-slate-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {isSignup && (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:text-slate-100"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full mt-2 py-2.5 px-4 bg-slate-900 dark:bg-slate-50 text-white dark:text-slate-900 rounded-md text-sm font-medium hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors flex items-center justify-center space-x-2"
            >
              <span>
                {isSignup
                  ? `Sign Up as ${role === "candidate" ? "Candidate" : "Recruiter"}`
                  : "Sign In"}
              </span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Toggle between Login and Register */}
          <div className="text-center text-sm text-slate-500 pt-2">
            {isSignup ? (
              <p>
                Already have an account?{" "}
                <button
                  onClick={() => setIsSignup(false)}
                  className="font-semibold text-indigo-600 hover:underline"
                >
                  Sign in
                </button>
              </p>
            ) : (
              <p>
                Don't have an account?{" "}
                <button
                  onClick={() => setIsSignup(true)}
                  className="font-semibold text-indigo-600 hover:underline"
                >
                  Sign up
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
