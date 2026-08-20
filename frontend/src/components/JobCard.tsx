import { Link } from "react-router-dom";
import { Building2, MapPin, DollarSign, Clock } from "lucide-react";
import type { Job } from "../store/useJobStore";

interface JobCardProps {
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
  return (
    <div className="p-6 bg-white border border-slate-200 rounded-2xl hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 rounded-xl bg-slate-900 text-white font-bold flex items-center justify-center text-lg shrink-0">
          {job?.company?.company_name?.charAt(0) || "?"}
        </div>
        <div>
          <h3 className="font-semibold text-lg text-slate-900 hover:text-indigo-600 transition-colors cursor-pointer">
            {job.title}
          </h3>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1.5">
            <span className="flex items-center">
              <Building2 className="w-3.5 h-3.5 mr-1 text-slate-400" />
              {job?.company?.company_name}
            </span>
            <span className="flex items-center">
              <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
              {job.location}
            </span>
            <span className="flex items-center">
              <DollarSign className="w-3.5 h-3.5 mr-1 text-slate-400" />
              {job.salary_min && job.salary_max
                ? `$${Number(job.salary_min).toLocaleString()} - $${Number(job.salary_max).toLocaleString()}`
                : "N/A"}
            </span>
            <span className="flex items-center">
              <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
              {job?.created_at
                ? new Date(job.created_at).toLocaleDateString()
                : ""}
            </span>
          </div>
          {Array.isArray(job.skills) && job.skills.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-3">
              {job.skills.map((skill: string, i: number) => (
                <span
                  key={i}
                  className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 text-xs font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex md:flex-col items-center md:items-end justify-between gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-0 border-slate-100">
        <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold">
          {job.job_type
            .toLowerCase()
            .replace(/(^|\s)\S/g, (match) => match.toUpperCase())}
        </span>
        <Link to={`/apply/${job.id}`}>
          <button className="px-4 py-2 bg-slate-900 hover:bg-indigo-600 text-white text-xs font-medium rounded-lg transition-colors cursor-pointer">
            Apply Now
          </button>
        </Link>
      </div>
    </div>
  );
}
