import { useEffect, useState } from "react";
import {
  User,
  Phone,
  Briefcase,
  FileText,
  UploadCloud,
  Loader,
} from "lucide-react";
import { useProfileStore } from "../store/useProfileStore";

interface CandidateProfileFormProps {
  profile: any;
  userId?: string;
}

export default function CandidateProfileForm({
  profile,
  userId,
}: CandidateProfileFormProps) {
  const { updateCandidateProfile, submitting } = useProfileStore();

  const [candidateForm, setCandidateForm] = useState({
    full_name: "",
    phone: "",
    bio: "",
    skills: "",
    experience_years: "",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [edit, setEdit] = useState<Boolean>(false);
  useEffect(() => {
    if (profile) {
      setCandidateForm({
        full_name: profile.full_name || "",
        phone: profile.phone || "",
        bio: profile.bio || "",
        skills: Array.isArray(profile.skills)
          ? profile.skills.join(", ")
          : profile.skills || "",
        experience_years: profile.experience_years
          ? String(profile.experience_years)
          : "",
      });
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    try {
      const data = new FormData();
      data.append("full_name", candidateForm.full_name);
      data.append("phone", candidateForm.phone);
      data.append("bio", candidateForm.bio);
      data.append("skills", candidateForm.skills);
      data.append("experience_years", candidateForm.experience_years);
      if (avatarFile) {
        data.append("avatar", avatarFile);
      }
      if (resumeFile) {
        data.append("resume", resumeFile);
      }

      await updateCandidateProfile(userId, data);
      setAvatarFile(null);
      setResumeFile(null);
    } catch (err) {
      // Handled inside store with toast
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
      {/* Avatar Photo Upload Box */}
      <div className="flex flex-col sm:flex-row items-center sm:space-x-6 space-y-4 sm:space-y-0">
        <div className="w-20 h-20 bg-indigo-50 border border-indigo-100 rounded-full flex items-center justify-center font-bold text-2xl text-indigo-600 shrink-0 overflow-hidden relative">
          {avatarFile ? (
            <img
              src={URL.createObjectURL(avatarFile)}
              className="w-full h-full object-cover"
              alt="Avatar preview"
            />
          ) : profile?.avatar_url ? (
            <img
              src={profile.avatar_url}
              className="w-full h-full object-cover"
              alt="Avatar"
            />
          ) : (
            <User className="w-8 h-8 text-indigo-600" />
          )}
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900">Profile Photo</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            JPEG or PNG. Max size 2MB.
          </p>
          <div className="mt-2 relative">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
              className="hidden"
              id="avatar-upload"
            />
            <label
              htmlFor="avatar-upload"
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 cursor-pointer shadow-sm transition-all"
            >
              <UploadCloud className="w-4 h-4 text-slate-400" />
              <span>Choose Image</span>
            </label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Full Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 block">
            Full Name
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              required
              placeholder="e.g. Jane Doe"
              value={candidateForm.full_name}
              onChange={(e) =>
                setCandidateForm({
                  ...candidateForm,
                  full_name: e.target.value,
                })
              }
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-600 focus:outline-none"
            />
          </div>
        </div>

        {/* Phone */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 block">
            Phone Number
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="tel"
              placeholder="e.g. +1 555-0100"
              value={candidateForm.phone}
              onChange={(e) =>
                setCandidateForm({
                  ...candidateForm,
                  phone: e.target.value,
                })
              }
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-600 focus:outline-none"
            />
          </div>
        </div>

        {/* Experience Years */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 block">
            Years of Experience
          </label>
          <div className="relative">
            <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="number"
              min="0"
              placeholder="e.g. 3"
              value={candidateForm.experience_years}
              onChange={(e) =>
                setCandidateForm({
                  ...candidateForm,
                  experience_years: e.target.value,
                })
              }
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-600 focus:outline-none"
            />
          </div>
        </div>

        {/* Skills */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 block">
            Skills
          </label>
          <div className="relative">
            <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="e.g. React, Node.js, SQL"
              value={candidateForm.skills}
              onChange={(e) =>
                setCandidateForm({
                  ...candidateForm,
                  skills: e.target.value,
                })
              }
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-600 focus:outline-none"
            />
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-1.5 md:col-span-2">
          <label className="text-xs font-semibold text-slate-700 block">
            Short Bio
          </label>
          <textarea
            rows={3}
            placeholder="Share a brief summary about your background and goals..."
            value={candidateForm.bio}
            onChange={(e) =>
              setCandidateForm({
                ...candidateForm,
                bio: e.target.value,
              })
            }
            className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-600 focus:outline-none focus:ring-offset-0"
          />
        </div>

        {/* Resume Upload Box */}
        <div className="space-y-1.5 md:col-span-2">
          <label className="text-xs font-semibold text-slate-700 block">
            Resume Attachment
          </label>
          <div className="border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-xl p-5 text-center bg-slate-50/50 cursor-pointer transition-colors relative">
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <div className="space-y-1.5 flex flex-col items-center pointer-events-none">
              <UploadCloud className="w-7 h-7 text-slate-400" />
              <p className="text-xs font-semibold text-slate-700">
                {resumeFile ? resumeFile.name : "Upload new resume (PDF only)"}
              </p>
              <p className="text-[10px] text-slate-400">
                PDF format. Max file size: 5MB
              </p>
            </div>
          </div>

          {profile?.resume_url && (
            <div className="mt-2.5 p-3 bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2 text-slate-700">
                <FileText className="w-4 h-4 text-indigo-600" />
                <span className="font-medium">Active Profile Resume</span>
              </div>
              <a
                href={profile.resume_url}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-semibold text-indigo-600 hover:underline"
              >
                View Resume
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Edit Button*/}
      <button
        onClick={() => setEdit(!edit)}
        className="w-full py-3 bg-gray-600 hover:bg-gray-700 text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center space-x-2 shadow-sm cursor-pointer"
      >
        {edit ? "Cancel" : "Edit"}
      </button>
      {/* Submit button */}
      {edit && (
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center space-x-2 shadow-sm cursor-pointer"
        >
          {submitting ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              <span>Saving Profile Changes...</span>
            </>
          ) : (
            <span>Save Profile Changes</span>
          )}
        </button>
      )}
    </form>
  );
}
