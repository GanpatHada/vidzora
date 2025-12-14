import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { supabase } from "../supabaseClient";
import { getUserProfile } from "../services/userService";

interface Profile {
  full_name: string;
  profile_picture: number;
}

interface UserStore {
  user: any;
  profile: Profile | null;
  isLoading: boolean;
  error: any;
  fetchUser: () => Promise<void>;
  fetchProfile: (userId: string) => Promise<void>;
  signOut: () => Promise<void>;
  setUser: (user: any) => void;
  setProfile: (profile: Profile | null) => void;
}

export const useUserStore = create<UserStore>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        profile: null,
        isLoading: true,
        error: null,

        setUser: (user) => set({ user }),
        setProfile: (profile) => set({ profile }),

        fetchUser: async () => {
          set({ isLoading: true, error: null });
          try {
            const {
              data: { user },
              error,
            } = await supabase.auth.getUser();
            if (error) throw error;
            if (user) {
              const profileData = await getUserProfile(user.id);
              set({ user, profile: profileData, isLoading: false });
            } else {
              set({ user: null, profile: null, isLoading: false });
            }
          } catch (error) {
            set({ error, isLoading: false });
          }
        },

        fetchProfile: async (userId: string) => {
          try {
            const profileData = await getUserProfile(userId);
            set({ profile: profileData });
          } catch (error) {
            console.error("Failed to fetch profile in store", error);
          }
        },

        signOut: async () => {
          await supabase.auth.signOut();
          set({ user: null, profile: null });
        },
      }),
      {
        name: "user-storage",
      }
    )
  )
);
