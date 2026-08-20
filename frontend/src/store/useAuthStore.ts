import { api } from "../utils/axios";
import { create } from 'zustand'
import { toast } from 'sonner'

interface AuthStore {
  authUser: any;
  isCheckingAuth: boolean;
  checkAuth: () => Promise<void>;
  login: (data: any) => Promise<void>;
  signup: (data: any) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  authUser: null,
  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      set({ isCheckingAuth: true });
      const res = await api.get("/auth/authUser");
      set({ authUser: res.data.data });
    } catch (error) {
      console.error(error);
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  login: async (data: any) => {
    try {
      await api.post("/auth/login", data);
      const userRes = await api.get("/auth/authUser");
      set({ authUser: userRes.data.data });
      toast.success(`Welcome, ${userRes.data.data?.email || "User"}`);
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Login failed");
      throw error;
    }
  },

  signup: async (data: any) => {
    try {
      await api.post("/auth/register", data);
    //   set({ authUser: res.data.data });
      toast.success("Account created successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Registration failed");
      throw error;
    }
  },

  logout:async()=>{
    try{
      await api.post("/auth/logout");
      set({authUser:null});
      toast.success("Logged out!");
    }catch(err:any){
      toast.error(err.response?.data?.message || "Logout failed");
    }
  }
}));