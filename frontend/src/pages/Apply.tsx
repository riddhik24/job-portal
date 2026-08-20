import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { CheckCircle2, ArrowLeft, Loader } from "lucide-react";
import { useJobStore } from "../store/useJobStore";
import { useAuthStore } from "../store/useAuthStore";
import { useProfileStore } from "../store/useProfileStore";
import { toast } from "sonner";
import JobDetailsSidebar from "../components/JobDetailsSidebar";
import ApplyForm from "../components/ApplyForm";

export default function JobApplyPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authUser } = useAuthStore();
  const { profile, fetchProfile } = useProfileStore();
  const { job, fetchJob } = useJobStore();
  const [success, setSuccess] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setChecking(true);
      try {
        if (id) {
          await fetchJob(id);
        }
        if (authUser?.id) {
          await fetchProfile(authUser.id);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setChecking(false);
      }
    };
    loadData();
  }, [id, authUser?.id, fetchJob, fetchProfile]);

  useEffect(() => {
    if (!checking && !profile) {
      toast.error("Please update your profile details first before applying!");
      navigate("/profile");
    }
  }, [profile, checking, navigate]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back Link */}
        <Link
          to="/jobs"
          className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back to all jobs
        </Link>

        {success ? (
          /* Application Submitted Success State */
          <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center space-y-4 shadow-sm">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              Application Submitted!
            </h2>
            <p className="text-slate-500 text-sm max-w-md mx-auto">
              Your application for{" "}
              <span className="font-semibold text-slate-800">{job?.title}</span>{" "}
              at{" "}
              <span className="font-semibold text-slate-800">
                {job?.company?.company_name}
              </span>{" "}
              has been sent to the recruiter.
            </p>
            <div className="pt-4 flex justify-center gap-3">
              <button
                onClick={() => navigate("/profile")}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Go to Profile
              </button>
              <button
                onClick={() => navigate("/jobs")}
                className="px-5 py-2.5 border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Explore More Jobs
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* LEFT COLUMN: Job Overview Summary */}
            <div className="lg:col-span-5 space-y-6">
              <JobDetailsSidebar job={job} />
            </div>

            {/* RIGHT COLUMN: Application Submission Form */}
            <div className="lg:col-span-7">
              {id && (
                <ApplyForm jobId={id} onSuccess={() => setSuccess(true)} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
