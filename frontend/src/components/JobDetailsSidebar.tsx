import { Building2, MapPin, DollarSign, Clock } from "lucide-react";
import type { Job } from "../store/useJobStore";

interface JobDetailsSidebarProps {
  job: Job | null;
}

export default function JobDetailsSidebar({ job }: JobDetailsSidebarProps) {
  if (!job) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
      <div className="space-y-2">
        <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full capitalize">
          {job.job_type
            .toLowerCase()
            .replace(/(^|\s)\S/g, (match) => match.toUpperCase())}
        </span>
        <h1 className="text-xl font-bold text-slate-900">{job.title}</h1>
        <p className="text-sm font-medium text-slate-600 flex items-center">
          <Building2 className="w-4 h-4 mr-1 text-slate-400" />
          {job.company?.company_name}
        </p>
      </div>

      <div className="space-y-2.5 pt-3 border-t border-slate-100 text-xs text-slate-600">
        <div className="flex items-center">
          <MapPin className="w-4 h-4 mr-2 text-slate-400" />
          <span>{job.location}</span>
        </div>
        <div className="flex items-center">
          <DollarSign className="w-4 h-4 mr-2 text-slate-400" />
          <span>
            {job.salary_min ? `$${Number(job.salary_min).toLocaleString()}` : "N/A"}
            {job.salary_max ? ` - $${Number(job.salary_max).toLocaleString()}` : ""}
          </span>
        </div>
        <div className="flex items-center">
          <Clock className="w-4 h-4 mr-2 text-slate-400" />
          <span>
            Posted {job.created_at ? new Date(job.created_at).toLocaleDateString() : ""}
          </span>
        </div>
      </div>

      {job.description && (
        <div className="pt-3 border-t border-slate-100 space-y-2">
          <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
            Job Summary
          </h3>
          <p className="text-xs text-slate-500 line-clamp-4 leading-relaxed">
            {job.description}
          </p>
        </div>
      )}

      {job.skills && Array.isArray(job.skills) && job.skills.length > 0 && (
        <div className="pt-3 border-t border-slate-100 space-y-2">
          <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
            Required Skills
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {job.skills.map((skill: string, i: number) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-xs font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
