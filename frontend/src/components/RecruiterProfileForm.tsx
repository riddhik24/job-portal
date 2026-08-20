import { useEffect, useState } from "react";
import { Building2, Globe, MapPin, Loader, UploadCloud } from "lucide-react";
import { useProfileStore } from "../store/useProfileStore";

interface RecruiterProfileFormProps {
  profile: any;
  userId?: string;
}

export default function RecruiterProfileForm({ profile, userId }: RecruiterProfileFormProps) {
  const { updateRecruiterProfile, submitting } = useProfileStore();

  const [recruiterForm, setRecruiterForm] = useState({
    company_name: "",
    website: "",
    location: "",
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);

  useEffect(() => {
    if (profile) {
      setRecruiterForm({
        company_name: profile.company_name || "",
        website: profile.website || "",
        location: profile.location || "",
      });
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    try {
      const data = new FormData();
      data.append("company_name", recruiterForm.company_name);
      data.append("website", recruiterForm.website);
      data.append("location", recruiterForm.location);
      if (logoFile) {
        data.append("logo", logoFile);
      }
      await updateRecruiterProfile(userId, data);
      setLogoFile(null);
    } catch (err) {
      // Handled inside store with toast
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
      {/* Company Logo Upload Box */}
      <div className="flex flex-col sm:flex-row items-center sm:space-x-6 space-y-4 sm:space-y-0">
        <div className="w-20 h-20 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center font-bold text-2xl text-indigo-600 shrink-0 overflow-hidden relative">
          {logoFile ? (
            <img
              src={URL.createObjectURL(logoFile)}
              className="w-full h-full object-cover"
              alt="Logo preview"
            />
          ) : profile?.logo_url ? (
            <img
              src={profile.logo_url}
              className="w-full h-full object-cover"
              alt="Company Logo"
            />
          ) : (
            recruiterForm.company_name.charAt(0) || (
              <Building2 className="w-8 h-8" />
            )
          )}
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900">Company Logo</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            JPG or PNG format. Max size 2MB.
          </p>
          <div className="mt-2 relative">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
              className="hidden"
              id="logo-upload"
            />
            <label
              htmlFor="logo-upload"
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 cursor-pointer shadow-sm transition-all"
            >
              <UploadCloud className="w-4 h-4 text-slate-400" />
              <span>Choose Image</span>
            </label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Company Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 block">
            Company Name
          </label>
          <div className="relative">
            <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              required
              placeholder="e.g. Acme Tech Inc."
              value={recruiterForm.company_name}
              onChange={(e) =>
                setRecruiterForm({
                  ...recruiterForm,
                  company_name: e.target.value,
                })
              }
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-600 focus:outline-none"
            />
          </div>
        </div>

        {/* Company Website */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 block">
            Company Website
          </label>
          <div className="relative">
            <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="url"
              placeholder="e.g. https://acme.co"
              value={recruiterForm.website}
              onChange={(e) =>
                setRecruiterForm({
                  ...recruiterForm,
                  website: e.target.value,
                })
              }
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-600 focus:outline-none"
            />
          </div>
        </div>

        {/* Location */}
        <div className="space-y-1.5 md:col-span-2">
          <label className="text-xs font-semibold text-slate-700 block">
            Location
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="e.g. San Francisco, CA (or Remote)"
              value={recruiterForm.location}
              onChange={(e) =>
                setRecruiterForm({
                  ...recruiterForm,
                  location: e.target.value,
                })
              }
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-600 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center space-x-2 shadow-sm cursor-pointer"
      >
        {submitting ? (
          <>
            <Loader className="w-4 h-4 animate-spin" />
            <span>Saving Company Details...</span>
          </>
        ) : (
          <span>Save Company Details</span>
        )}
      </button>
    </form>
  );
}
