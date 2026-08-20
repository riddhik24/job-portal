import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useProfileStore } from "../store/useProfileStore";
import { useJobStore } from "../store/useJobStore";
import {
  Briefcase,
  MapPin,
  DollarSign,
  FileText,
  Loader,
  Building2,
  ArrowRight,
} from "lucide-react";

export default function PostJobPage() {
  const { authUser } = useAuthStore();
  const { profile, loading: profileLoading, fetchProfile } = useProfileStore();
  const { postJob, submitting } = useJobStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    job_type: "Full-time",
    location: "",
    salary_min: "",
    salary_max: "",
    description: "",
    skills: "",
  });

  useEffect(() => {
    if (authUser?.id) {
      fetchProfile(authUser.id);
    }
  }, [authUser?.id, fetchProfile]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.id) return;

    try {
      const payload = {
        company_id: profile.id,
        title: formData.title,
        job_type: formData.job_type.toLowerCase(),
        location: formData.location,
        salary_min: Number(formData.salary_min),
        salary_max: Number(formData.salary_max),
        description: formData.description,
        skills: formData.skills,
      };

      await postJob(payload);
      navigate("/jobs");
    } catch (err) {
      // Handled inside store with toast
    }
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 space-y-3">
        <Loader className="w-10 h-10 text-indigo-600 animate-spin" />
        <span className="text-sm font-medium text-slate-500">
          Checking organization details...
        </span>
      </div>
    );
  }

  // Enforce company profile check
  if (!profile || !profile.id) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-6 shadow-sm">
          <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto">
            <Building2 className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-900">
              Set Up Company Profile
            </h2>
            <p className="text-slate-500 text-xs leading-relaxed">
              Before posting an open role, please set up your recruiter company
              details (Company Name, Location, Logo) so candidates know who you
              are.
            </p>
          </div>
          <Link to="/profile" className="block">
            <button className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center space-x-2 shadow-sm">
              <span>Go to Profile Settings</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-800 to-slate-900 p-6 sm:p-8 text-white">
            <h2 className="text-xl font-bold tracking-wide">
              Create New Job Listing
            </h2>
            <p className="text-slate-300 text-xs mt-1">
              Hiring for{" "}
              <span className="font-semibold text-white">
                {profile.company_name}
              </span>
              . Fill out details to list the opening.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Job Title */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-slate-700 block">
                  Job Title
                </label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    name="title"
                    required
                    placeholder="e.g. Senior Frontend Engineer"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Job Type */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">
                  Job Type
                </label>
                <select
                  name="job_type"
                  required
                  value={formData.job_type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>

              {/* Location */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    name="location"
                    required
                    placeholder="e.g. Remote, San Francisco, CA"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Min Salary */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">
                  Minimum Salary (USD / yr)
                </label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="number"
                    name="salary_min"
                    required
                    min="0"
                    placeholder="e.g. 80000"
                    value={formData.salary_min}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Max Salary */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">
                  Maximum Salary (USD / yr)
                </label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="number"
                    name="salary_max"
                    required
                    min="0"
                    placeholder="e.g. 120000"
                    value={formData.salary_max}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Required Skills */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-slate-700 block">
                  Required Skills
                </label>
                <div className="relative">
                  <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    name="skills"
                    placeholder="e.g. React, Node.js, SQL, TypeScript (comma separated)"
                    value={formData.skills}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Job Description */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-slate-700 block">
                  Job Description
                </label>
                <div className="relative">
                  <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <textarea
                    name="description"
                    required
                    rows={6}
                    placeholder="Describe the responsibilities, qualifications, requirements, and day-to-day role expectations..."
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center space-x-2 shadow-sm cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  <span>Publishing Listing...</span>
                </>
              ) : (
                <span>Publish Job Listing</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
