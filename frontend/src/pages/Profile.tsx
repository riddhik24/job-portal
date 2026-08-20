import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useProfileStore } from "../store/useProfileStore";
import { Loader } from "lucide-react";
import CandidateProfileForm from "../components/CandidateProfileForm";
import RecruiterProfileForm from "../components/RecruiterProfileForm";
import ProfileJobsList from "../components/ProfileJobsList";

export default function ProfilePage() {
  const { authUser } = useAuthStore();
  const { profile, loading, fetchProfile } = useProfileStore();

  useEffect(() => {
    if (authUser?.id) {
      fetchProfile(authUser.id);
    }
  }, [authUser?.id, fetchProfile]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 space-y-3">
        <Loader className="w-10 h-10 text-indigo-600 animate-spin" />
        <span className="text-sm font-medium text-slate-500">
          Loading profile details...
        </span>
      </div>
    );
  }

  const isRecruiter = authUser?.role === "recruiter";

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          {/* Cover Header */}
          <div className="h-32 bg-gradient-to-r from-indigo-800 to-slate-900 flex items-center px-8 text-white relative">
            <h2 className="text-xl font-bold tracking-wide">
              {isRecruiter
                ? "Company Profile Settings"
                : "Candidate Profile Settings"}
            </h2>
          </div>

          <div className="p-6">
            {!profile && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs font-medium mb-6">
                You haven't initialized your profile details yet. Fill out the
                form below to get started!
              </div>
            )}

            {isRecruiter ? (
              <RecruiterProfileForm profile={profile} userId={authUser?.id} />
            ) : (
              <CandidateProfileForm profile={profile} userId={authUser?.id} />
            )}
          </div>
        </div>

        {profile && (
          <ProfileJobsList
            role={isRecruiter ? "recruiter" : "candidate"}
            companyId={isRecruiter ? profile.id : undefined}
          />
        )}
      </div>
    </div>
  );
}
