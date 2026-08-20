import { useEffect } from "react";
import { useJobStore } from "../store/useJobStore";
import Filter from "../components/Filter";
import { Loader } from "lucide-react";
import JobCard from "../components/JobCard";

export default function JobsPage() {
  const { jobs, loading, fetchJobs } = useJobStore();

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Title */}
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Explore All Job Opportunities
          </h1>
          <p className="max-w-2xl mx-auto text-sm text-slate-500">
            Search for positions across multiple locations, salary levels, and
            job titles.
          </p>
        </div>

        {/* Filter component */}
        <div className="max-w-4xl mx-auto">
          <Filter />
        </div>

        {/* Job Listings */}
        <div className="space-y-4 max-w-4xl mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-3">
              <Loader className="w-10 h-10 text-indigo-600 animate-spin" />
              <span className="text-sm font-medium text-slate-500">
                Retrieving latest jobs...
              </span>
            </div>
          ) : jobs && jobs.length > 0 ? (
            jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center space-y-2 shadow-sm">
              <p className="text-slate-500 font-medium">
                No matching jobs found
              </p>
              <p className="text-xs text-slate-400">
                Try widening your search terms or adjusting filters.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
