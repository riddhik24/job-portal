import { useEffect, useState } from "react";
import { AlertCircle, FileText, UploadCloud, Loader } from "lucide-react";
import { useProfileStore } from "../store/useProfileStore";
import { useJobStore } from "../store/useJobStore";

interface ApplyFormProps {
  jobId: string;
  onSuccess: () => void;
}

export default function ApplyForm({ jobId, onSuccess }: ApplyFormProps) {
  const { profile: candidateProfile } = useProfileStore();
  const { applyToJob, submitting } = useJobStore();

  const [useExistingResume, setUseExistingResume] = useState(true);
  const [newResumeFile, setNewResumeFile] = useState<File | null>(null);
  const [coverNote, setCoverNote] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If user has no existing resume, default to upload tab
    if (candidateProfile && !candidateProfile.resume_url) {
      setUseExistingResume(false);
    }
  }, [candidateProfile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file && file.type !== "application/pdf") {
      setError("Please select a PDF file");
      setNewResumeFile(null);
    } else {
      setError(null);
      setNewResumeFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate
    if (!useExistingResume && !newResumeFile) {
      setError("Please upload a resume to submit application");
      return;
    }

    try {
      await applyToJob(jobId, coverNote, useExistingResume, newResumeFile);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to submit application");
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Submit Your Application</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Complete the form below to apply directly.
        </p>
      </div>

      {error && (
        <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* RESUME SELECTION */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-slate-700 block">
            Resume Attachment
          </label>

          {candidateProfile?.resume_url && (
            <div className="grid grid-cols-2 gap-2 text-xs font-medium">
              <button
                type="button"
                onClick={() => setUseExistingResume(true)}
                className={`p-3 border rounded-xl flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                  useExistingResume
                    ? "border-indigo-600 bg-indigo-50 text-indigo-700 font-semibold"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Profile Resume</span>
              </button>
              <button
                type="button"
                onClick={() => setUseExistingResume(false)}
                className={`p-3 border rounded-xl flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                  !useExistingResume
                    ? "border-indigo-600 bg-indigo-50 text-indigo-700 font-semibold"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <UploadCloud className="w-4 h-4" />
                <span>Upload New</span>
              </button>
            </div>
          )}

          {/* Show File Upload if no existing profile resume or if "Upload New" selected */}
          {(!candidateProfile?.resume_url || !useExistingResume) && (
            <div className="border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-xl p-6 text-center bg-slate-50/50 cursor-pointer transition-colors relative">
              <input
                type="file"
                accept=".pdf"
                required={!candidateProfile?.resume_url || !useExistingResume}
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <div className="space-y-1.5 flex flex-col items-center pointer-events-none">
                <UploadCloud className="w-7 h-7 text-slate-400" />
                <p className="text-xs font-medium text-slate-700">
                  {newResumeFile
                    ? newResumeFile.name
                    : "Click or drag resume (PDF only)"}
                </p>
                <p className="text-[11px] text-slate-400">Maximum file size: 5MB</p>
              </div>
            </div>
          )}

          {useExistingResume && candidateProfile?.resume_url && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2 text-slate-700">
                <FileText className="w-4 h-4 text-indigo-600" />
                <span>Saved Profile Resume.pdf</span>
              </div>
              <span className="text-[11px] text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-md">
                Attached
              </span>
            </div>
          )}
        </div>

        {/* COVER NOTE / MESSAGE */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 flex justify-between">
            <span>Cover Note (Optional)</span>
            <span className="text-[11px] text-slate-400">Introduce yourself</span>
          </label>
          <textarea
            rows={4}
            value={coverNote}
            onChange={(e) => setCoverNote(e.target.value)}
            placeholder="Highlight relevant experience, recent projects, or why you're a great fit..."
            className="w-full text-xs p-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 placeholder-slate-400"
          />
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center space-x-2 shadow-sm cursor-pointer"
        >
          {submitting ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              <span>Sending Application...</span>
            </>
          ) : (
            <span>Submit Application</span>
          )}
        </button>
      </form>
    </div>
  );
}
