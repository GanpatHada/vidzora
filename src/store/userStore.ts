import {create} from "zustand";
import { supabase } from "../supabaseClient";
import type { User } from "@supabase/supabase-js";

interface UserState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  fetchUser: () => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  fetchUser: async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      set({ user });
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
