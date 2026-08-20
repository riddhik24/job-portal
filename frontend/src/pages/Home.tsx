import { useEffect } from "react";
import {
  Building2,
  TrendingUp,
  Code,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Loader,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useJobStore } from "../store/useJobStore";
import Filter from "../components/Filter";
import JobCard from "../components/JobCard";

export default function HomePage() {
  const { jobs, loading, fetchJobs } = useJobStore();

  useEffect(() => {
    fetchJobs();
  }, []);
  // Mock Job Categories
  const categories = [
    { icon: Code, name: "Software & Tech", openJobs: "1,240+" },
    { icon: TrendingUp, name: "Marketing & Growth", openJobs: "850+" },
    { icon: Building2, name: "Finance & Sales", openJobs: "620+" },
    { icon: Sparkles, name: "UI/UX Design", openJobs: "410+" },
  ];
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* 1. HERO SECTION */}
      <section className="relative bg-slate-900 text-white pt-20 pb-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/30 via-slate-900 to-slate-950 z-0" />

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold tracking-wide border border-indigo-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Over 10,000+ active tech job listings</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
            Find the <span className="text-indigo-500">Perfect Job</span> <br />
            You Truly Deserve.
          </h1>

          <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Search thousands of remote and local job opportunities from top
            engineering teams. Connect directly with recruiters today.
          </p>

          {/* Search Bar Form */}
          <div className="mt-8">
            <Filter />
          </div>
        </div>
      </section>

      {/* 2. CATEGORIES SECTION */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Explore by Category
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Find job opportunities grouped by specialization
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat, index) => {
            const Icon = cat.icon;
            return (
              <div
                key={index}
                className="p-5 bg-white border border-slate-200 rounded-xl hover:shadow-md hover:border-indigo-500/50 transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {cat.openJobs} Open Positions
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. FEATURED RECENT JOBS SECTION */}
      <section className="py-12 px-6 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Featured Jobs</h2>
            <p className="text-sm text-slate-500 mt-1">
              Hand-picked listings from verified recruiters
            </p>
          </div>
          <a
            href="#all-jobs"
            className="text-sm font-semibold text-indigo-600 hover:underline flex items-center space-x-1"
          >
            <span>View all jobs</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-2">
              <Loader className="w-8 h-8 text-indigo-600 animate-spin" />
              <span className="text-sm text-slate-500">Loading jobs...</span>
            </div>
          ) : jobs && jobs.length > 0 ? (
            jobs.slice(0, 6).map((job) => <JobCard key={job.id} job={job} />)
          ) : (
            <p className="text-center text-slate-500 py-8">No jobs found</p>
          )}
        </div>
      </section>

      {/* 4. RECRUITER CTA BANNER */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white rounded-2xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>For Employers</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold">
              Hiring for your team?
            </h2>
            <p className="text-slate-300 text-sm max-w-md">
              Post your open roles to thousands of skilled tech candidates and
              manage applications effortlessly.
            </p>
          </div>
          <Link to="/post-job">
            <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-xl transition-colors shadow-lg shadow-indigo-600/30 whitespace-nowrap cursor-pointer">
              Post a Job Now
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
