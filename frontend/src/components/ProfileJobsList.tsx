import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Clock, Trash2 } from "lucide-react";
import { useJobStore } from "../store/useJobStore";
import ApplicationsModal from "./ApplicationsModal";

interface ProfileJobsListProps {
  role: "candidate" | "recruiter";
  companyId?: string;
}

export default function ProfileJobsList({ role, companyId }: ProfileJobsListProps) {
  const isRecruiter = role === "recruiter";

  const {
    recruiterJobs,
    appliedJobs,
    fetchRecruiterJobs,
    fetchAppliedJobs,
    deleteJob,
    fetchApplicationsOfJob,
    loading,
  } = useJobStore();

  const [isApplicationsModalOpen, setIsApplicationsModalOpen] = useState(false);
  const [selectedJobTitle, setSelectedJobTitle] = useState("");

  useEffect(() => {
    if (isRecruiter && companyId) {
      fetchRecruiterJobs(companyId);
    } else if (!isRecruiter) {
      fetchAppliedJobs();
    }
  }, [isRecruiter, companyId, fetchRecruiterJobs, fetchAppliedJobs]);

  const handleViewApplications = async (jobId: string, jobTitle: string) => {
    setSelectedJobTitle(jobTitle);
    setIsApplicationsModalOpen(true);
    await fetchApplicationsOfJob(jobId);
  };

  const title = isRecruiter ? "My Posted Jobs" : "My Applications";
  const subtitle = isRecruiter
    ? "Manage the job listings you have published for candidate applications."
    : "Track the status of the job positions you have applied for.";

  const items = isRecruiter ? recruiterJobs : appliedJobs;

  return (
    <>
      <div className="mt-8 bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900">{title}</h2>
          <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
        </div>

        <div className="space-y-4">
          {loading && items.length === 0 ? (
            <div className="text-center py-6 text-slate-500 text-xs font-semibold animate-pulse">
              Retrieving listings...
            </div>
          ) : items && items.length > 0 ? (
            items.map((item) => {
              if (isRecruiter) {
                // Render Recruiter Job Row
                return (
                  <div
                    key={item.id}
                    className="p-4 border border-slate-100 rounded-xl flex items-center justify-between hover:bg-slate-50 transition-colors"
                  >
                    <div>
                      <h4 className="font-semibold text-sm text-slate-900">{item.title}</h4>
                      <p className="text-[11px] text-slate-500 capitalize mt-0.5">
                        {item.job_type} &bull; {item.location} &bull; ${item.salary_min} - {item.salary_max} &bull;{" "}
                        <Clock className="w-3 h-2.5 inline-block align-middle" />{" "}
                        {item.created_at ? new Date(item.created_at).toLocaleDateString() : ""}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewApplications(item.id, item.title)}
                        className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                      >
                        Applications
                      </button>
                      <button
                        onClick={() => deleteJob(item.id)}
                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete Job Listing"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              } else {
                // Render Candidate Application Row
                return (
                  <div
                    key={item.id}
                    className="p-4 border border-slate-100 rounded-xl flex items-center justify-between hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3.5">
                      <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 font-bold flex items-center justify-center text-sm uppercase shrink-0">
                        {item.company_logo ? (
                          <img
                            src={item.company_logo}
                            className="w-full h-full object-cover rounded-lg"
                            alt=""
                          />
                        ) : (
                          item.company_name?.charAt(0) || "?"
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">{item.job_title}</h4>
                        <p className="text-[11px] text-slate-500 font-medium capitalize mt-0.5">
                          {item.company_name} &bull; {item.job_location}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1 flex items-center">
                          <Clock className="w-3 h-3 mr-1 inline-block" />
                          Applied on {new Date(item.applied_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          item.status === "shortlisted"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-250"
                            : item.status === "interviewing"
                            ? "bg-amber-50 text-amber-700 border border-amber-250"
                            : item.status === "rejected"
                            ? "bg-rose-50 text-rose-700 border border-rose-250"
                            : "bg-slate-150 text-slate-700 border border-slate-250"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                  </div>
                );
              }
            })
          ) : (
            <div className="text-center py-8 border border-dashed border-slate-200 rounded-xl space-y-2">
              <p className="text-slate-500 text-xs font-semibold">
                {isRecruiter ? "No jobs posted yet" : "No applications yet"}
              </p>
              <p className="text-slate-400 text-[10px]">
                {isRecruiter ? (
                  <Link to="/post-job" className="text-indigo-600 hover:underline font-semibold">
                    Post your first job opening
                  </Link>
                ) : (
                  "Positions you apply to will appear here with real-time status tracking."
                )}
              </p>
            </div>
          )}
        </div>
      </div>

      <ApplicationsModal
        isOpen={isApplicationsModalOpen}
        onClose={() => setIsApplicationsModalOpen(false)}
        jobTitle={selectedJobTitle}
      />
    </>
  );
}
