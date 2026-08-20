import { api } from "../utils/axios";
import { create } from "zustand";
import { toast } from "sonner";

export interface Company {
  id?: string;
  company_name: string;
  website?: string;
  logo_url?: string;
  location?: string;
}

export interface Job {
  id: string;
  company_id: string;
  title: string;
  description: string;
  job_type: string;
  salary_min: number | string;
  salary_max: number | string;
  location: string;
  created_at: string;
  company: Company;
  skills?: string[];
}

interface JobStore {
  jobs: Job[];
  job: Job | null;
  recruiterJobs: Job[];
  loading: boolean;
  submitting: boolean;
  error: string | null;

  applications: any[];
  applicationsLoading: boolean;
  appliedJobs: any[];

  fetchJobs: (searchParams?: { title?: string; location?: string; salary?: string }) => Promise<void>;
  fetchJob: (id: string) => Promise<void>;
  postJob: (data: any) => Promise<void>;
  updateJob: (id: string, data: any) => Promise<void>;
  deleteJob: (id: string) => Promise<void>;
  fetchRecruiterJobs: (companyId: string) => Promise<void>;
  applyToJob: (
    jobId: string,
    coverNote: string,
    useExistingResume: boolean,
    newResumeFile: File | null
  ) => Promise<void>;
  fetchApplicationsOfJob: (jobId: string) => Promise<void>;
  updateApplicationStatus: (applicationId: string, status: string) => Promise<void>;
  fetchAppliedJobs: () => Promise<void>;
}

export const useJobStore = create<JobStore>((set) => ({
  jobs: [],
  job: null,
  recruiterJobs: [],
  loading: false,
  submitting: false,
  error: null,
  applications: [],
  applicationsLoading: false,
  appliedJobs: [],

  fetchJobs: async (searchParams) => {
    try {
      set({ loading: true, error: null });
      const queryStr = searchParams
        ? `?${new URLSearchParams(
            Object.entries(searchParams).reduce((acc, [key, val]) => {
              if (val !== undefined && val !== null && val !== "") {
                acc[key] = String(val);
              }
              return acc;
            }, {} as Record<string, string>)
          )}`
        : "";

      const res = await api.get(`/jobs${queryStr}`);
      set({ jobs: res.data.data });
    } catch (error: any) {
      const errMsg = error.response?.data?.message || "Failed to fetch jobs";
      set({ error: errMsg });
      toast.error(errMsg);
    } finally {
      set({ loading: false });
    }
  },

  fetchJob: async (id) => {
    try {
      set({ loading: true, error: null });
      const res = await api.get(`/jobs/${id}`);
      set({ job: res.data.data });
    } catch (error: any) {
      const errMsg = error.response?.data?.message || "Failed to fetch job details";
      set({ error: errMsg });
      toast.error(errMsg);
    } finally {
      set({ loading: false });
    }
  },

  postJob: async (data) => {
    try {
      set({ submitting: true, error: null });
      const res = await api.post("/jobs", data);
      set((state) => ({ jobs: [res.data.data, ...state.jobs] }));
      toast.success("Job posted successfully!");
    } catch (error: any) {
      const errMsg = error.response?.data?.message || "Failed to post job";
      toast.error(errMsg);
      throw error;
    } finally {
      set({ submitting: false });
    }
  },

  updateJob: async (id, data) => {
    try {
      set({ submitting: true, error: null });
      const res = await api.put(`/jobs/${id}`, data);
      set((state) => ({
        jobs: state.jobs.map((j) => (j.id === id ? res.data.data : j)),
        job: state.job && state.job.id === id ? res.data.data : state.job,
      }));
      toast.success("Job updated successfully!");
    } catch (error: any) {
      const errMsg = error.response?.data?.message || "Failed to update job";
      toast.error(errMsg);
      throw error;
    } finally {
      set({ submitting: false });
    }
  },

  deleteJob: async (id) => {
    try {
      set({ submitting: true, error: null });
      await api.delete(`/jobs/${id}`);
      set((state) => ({
        jobs: state.jobs.filter((j) => j.id !== id),
        recruiterJobs: state.recruiterJobs.filter((j) => j.id !== id),
        job: state.job && state.job.id === id ? null : state.job,
      }));
      toast.success("Job deleted successfully!");
    } catch (error: any) {
      const errMsg = error.response?.data?.message || "Failed to delete job";
      toast.error(errMsg);
      throw error;
    } finally {
      set({ submitting: false });
    }
  },

  fetchRecruiterJobs: async (companyId) => {
    try {
      set({ loading: true, error: null });
      const res = await api.get(`/jobs/${companyId}/my-jobs`);
      set({ recruiterJobs: res.data.data });
    } catch (error: any) {
      const errMsg = error.response?.data?.message || "Failed to fetch recruiter jobs";
      set({ error: errMsg });
      toast.error(errMsg);
    } finally {
      set({ loading: false });
    }
  },

  applyToJob: async (jobId, coverNote, useExistingResume, newResumeFile) => {
    try {
      set({ submitting: true, error: null });
      const formData = new FormData();
      formData.append("job_id", jobId);
      formData.append("coverNote", coverNote);

      if (!useExistingResume && newResumeFile) {
        formData.append("resume", newResumeFile);
      }

      await api.post("/applications/apply", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Application submitted successfully!");
    } catch (error: any) {
      const errMsg = error.response?.data?.message || "Failed to submit application";
      toast.error(errMsg);
      throw error;
    } finally {
      set({ submitting: false });
    }
  },

  fetchApplicationsOfJob: async (jobId) => {
    try {
      set({ applicationsLoading: true });
      const res = await api.get(`/applications/${jobId}`);
      set({ applications: res.data.data });
    } catch (error: any) {
      const errMsg = error.response?.data?.message || "Failed to fetch applications";
      toast.error(errMsg);
    } finally {
      set({ applicationsLoading: false });
    }
  },

  updateApplicationStatus: async (applicationId, status) => {
    try {
      set({ submitting: true });
      await api.patch("/applications", { application_id: applicationId, status });
      set((state) => ({
        applications: state.applications.map((app) =>
          app.id === applicationId ? { ...app, status } : app
        ),
      }));
      toast.success("Application status updated!");
    } catch (error: any) {
      const errMsg = error.response?.data?.message || "Failed to update status";
      toast.error(errMsg);
      throw error;
    } finally {
      set({ submitting: false });
    }
  },

  fetchAppliedJobs: async () => {
    try {
      set({ loading: true, error: null });
      const res = await api.get("/applications/candidate");
      set({ appliedJobs: res.data.data });
    } catch (error: any) {
      const errMsg = error.response?.data?.message || "Failed to fetch applied jobs";
      set({ error: errMsg });
      toast.error(errMsg);
    } finally {
      set({ loading: false });
    }
  },
}));
