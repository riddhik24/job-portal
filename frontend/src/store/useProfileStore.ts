import { create } from "zustand";
import { api } from "../utils/axios";
import { toast } from "sonner";

interface ProfileStore {
  profile: any;
  loading: boolean;
  submitting: boolean;
  error: string | null;

  fetchProfile: (userId: string) => Promise<void>;
  updateCandidateProfile: (userId: string, formData: FormData) => Promise<void>;
  updateRecruiterProfile: (userId: string, formData: FormData) => Promise<void>;
}

export const useProfileStore = create<ProfileStore>((set) => ({
  profile: null,
  loading: false,
  submitting: false,
  error: null,

  fetchProfile: async (userId) => {
    try {
      set({ loading: true, error: null });
      const res = await api.get(`/profile/${userId}`);
      set({ profile: res.data.data });
    } catch (error: any) {
      const errMsg = error.response?.data?.message || "Failed to fetch profile details";
      set({ error: errMsg });
      toast.error(errMsg);
    } finally {
      set({ loading: false });
    }
  },

  updateCandidateProfile: async (userId, formData) => {
    try {
      set({ submitting: true, error: null });
      const res = await api.put(`/profile/candidate/${userId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      set({ profile: res.data.data });
      toast.success("Candidate profile updated successfully!");
    } catch (error: any) {
      const errMsg = error.response?.data?.message || "Failed to update profile";
      toast.error(errMsg);
      throw error;
    } finally {
      set({ submitting: false });
    }
  },

  updateRecruiterProfile: async (userId, formData) => {
    try {
      set({ submitting: true, error: null });
      const res = await api.put(`/profile/recruiter/${userId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      set({ profile: res.data.data });
      toast.success("Company profile updated successfully!");
    } catch (error: any) {
      const errMsg = error.response?.data?.message || "Failed to update profile";
      toast.error(errMsg);
      throw error;
    } finally {
      set({ submitting: false });
    }
  },
}));
