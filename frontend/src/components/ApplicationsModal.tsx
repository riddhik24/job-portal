import { X, Loader, FileText } from "lucide-react";
import { useJobStore } from "../store/useJobStore";

interface ApplicationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobTitle: string;
}

export default function ApplicationsModal({
  isOpen,
  onClose,
  jobTitle,
}: ApplicationsModalProps) {
  const {
    applications,
    applicationsLoading,
    updateApplicationStatus,
    submitting,
  } = useJobStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Applications for <span className="text-indigo-600 font-extrabold">{jobTitle}</span>
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Review candidates who applied for this role.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {applicationsLoading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-2">
              <Loader className="w-8 h-8 text-indigo-600 animate-spin" />
              <span className="text-sm text-slate-500">Loading applications...</span>
            </div>
          ) : applications && applications.length > 0 ? (
            <div className="space-y-4">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="p-5 border border-slate-150 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col md:flex-row md:items-start justify-between gap-4"
                >
                  {/* Left Block: Candidate details */}
                  <div className="space-y-3 flex-1">
                    <div className="flex items-start space-x-3.5">
                      {/* Avatar */}
                      <div className="w-11 h-11 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-base uppercase shrink-0">
                        {app.avatar_url ? (
                          <img src={app.avatar_url} className="w-full h-full rounded-full object-cover" alt="" />
                        ) : (
                          app.full_name?.charAt(0) || "?"
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">{app.full_name || "Anonymous Candidate"}</h4>
                        <p className="text-[11px] text-slate-500 font-medium">{app.candidate_email}</p>
                        {app.phone && (
                          <p className="text-[10px] text-slate-400 mt-0.5">Phone: {app.phone}</p>
                        )}
                        {app.experience_years && (
                          <p className="text-[10px] text-slate-500 font-semibold mt-1">
                            {app.experience_years} {Number(app.experience_years) === 1 ? "year" : "years"} of experience
                          </p>
                        )}
                      </div>
                    </div>

                    {app.bio && (
                      <div className="bg-white border border-slate-100 rounded-lg p-2.5 text-xs text-slate-600 leading-relaxed max-w-2xl">
                        {app.bio}
                      </div>
                    )}

                    {/* Skills */}
                    {Array.isArray(app.skills) && app.skills.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5">
                        {app.skills.map((skill: string, idx: number) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-slate-100 border border-slate-200/60 rounded text-[10px] font-semibold text-slate-600"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Resume */}
                    {app.resume_url && (
                      <div>
                        <a
                          href={app.resume_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center space-x-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline cursor-pointer bg-indigo-50 px-2.5 py-1 rounded-md"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>View Candidate Resume</span>
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Right Block: Status & Status Actions */}
                  <div className="shrink-0 flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between md:justify-start gap-4">
                    {/* Status badge */}
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        app.status === "shortlisted"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-250"
                          : app.status === "interviewing"
                          ? "bg-amber-50 text-amber-700 border border-amber-250"
                          : app.status === "rejected"
                          ? "bg-rose-50 text-rose-700 border border-rose-250"
                          : "bg-slate-100 text-slate-700 border border-slate-250"
                      }`}
                    >
                      {app.status}
                    </span>

                    {/* Status Changer Dropdown */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-slate-400 block md:text-right">
                        Update Status
                      </label>
                      <select
                        value={app.status}
                        onChange={(e) => updateApplicationStatus(app.id, e.target.value)}
                        disabled={submitting}
                        className="text-xs bg-white border border-slate-350 rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-indigo-600 focus:outline-none cursor-pointer"
                      >
                        <option value="applied">Applied</option>
                        <option value="shortlisted">Shortlist</option>
                        <option value="interviewing">Interviewing</option>
                        <option value="rejected">Reject</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed border-slate-200 rounded-xl space-y-2">
              <p className="text-slate-500 text-xs font-semibold">No applications yet</p>
              <p className="text-slate-400 text-[11px]">
                Candidates who apply to this role will appear here.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-white bg-slate-100 transition-colors cursor-pointer"
          >
            Close View
          </button>
        </div>
      </div>
    </div>
  );
}
