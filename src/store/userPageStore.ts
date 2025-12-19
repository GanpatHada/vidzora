import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { supabase } from "../supabaseClient";
import { useUserStore } from "./userStore";
import { getVideoById } from "../services/videoService";
import {
  addToFavorites,
  addToWatchLater,
  removeFromFavorites,
  removeFromHistoryById,
  removeFromWatchLater,
} from "../services/userService";
import toast from "react-hot-toast";

interface UserPageStore {
  videos: any[];
  isLoading: boolean;
  error: any;
  favourites: string[];
  watchLater: string[];
  fetchWatchLater: () => Promise<void>;
  fetchFavourites: () => Promise<void>;
  fetchHistory: () => Promise<void>;
  clearVideos: () => void;
  isFavorite: (videoId: string) => boolean;
  isInWatchLater: (videoId: string) => boolean;
  addToFavorite: (videoId: string) => Promise<void>;
  addToWatchLater: (videoId: string) => Promise<void>;
  deleteHistory: (historyId: string) => Promise<void>;
  removeFromFavorite: (videoId: string) => Promise<void>;
  removeFromWatchLater: (videoId: string) => Promise<void>;
}

export const useUserPageStore = create<UserPageStore>()(
  devtools((set, get) => ({
    videos: [],
    isLoading: false,
    error: null,
    favourites: [],
    watchLater: [],
    clearVideos: () => set({ videos: [], favourites: [], watchLater: [] }),
    isFavorite: (videoId) => get().favourites.includes(videoId),
    isInWatchLater: (videoId) => get().watchLater.includes(videoId),
    addToFavorite: async (videoId) => {
      const { favourites } = get();
      const userId = useUserStore.getState().user?.id;
      if (!userId) return;

      if (favourites.includes(videoId)) {
        toast.error("Video is already in favourites");
      } else {
        await addToFavorites(userId, videoId);
        set({ favourites: [...favourites, videoId] });
        toast.success("Video added to favourites");
      }
    },
    addToWatchLater: async (videoId) => {
      const { watchLater } = get();
      const userId = useUserStore.getState().user?.id;
      if (!userId) return;

      if (watchLater.includes(videoId)) {
        toast.error("Video is already in watch later");
      } else {
        await addToWatchLater(userId, videoId);
        set({ watchLater: [...watchLater, videoId] });
        toast.success("Video added to watch later");
      }
    },
    deleteHistory: async (historyId: number) => {
      await removeFromHistoryById(historyId);
      set((state) => ({
        videos: state.videos.filter((video) => video.db_id !== historyId),
      }));
      toast.success("Video removed from history");
    },
    removeFromFavorite: async (videoId) => {
      const { favourites, videos } = get();
      const userId = useUserStore.getState().user?.id;
      if (!userId) return;

      if (favourites.includes(videoId)) {
        await removeFromFavorites(userId, videoId);
        set({
          favourites: favourites.filter((id) => id !== videoId),
          videos: videos.filter((video) => String(video.id) !== videoId),
        });
        toast.success("Video removed from favourites");
      }
    },
    removeFromWatchLater: async (videoId) => {
      const { watchLater, videos } = get();
      const userId = useUserStore.getState().user?.id;
      if (!userId) return;

      if (watchLater.includes(videoId)) {
        await removeFromWatchLater(userId, videoId);
        set({
          watchLater: watchLater.filter((id) => id !== videoId),
          videos: videos.filter((video) => String(video.id) !== videoId),
        });
        toast.success("Video removed from watch later");
      }
    },
    fetchWatchLater: async () => {
      set({ isLoading: true, error: null });
      try {
        const userId = useUserStore.getState().user?.id;
        if (!userId) {
          throw new Error("User not logged in");
        }
        const [
          { data: watchLaterData, error: watchLaterError },
          { data: favouritesData, error: favouritesError },
        ] = await Promise.all([
          supabase
            .from("watch_later")
            .select("id, video_id, created_at")
            .eq("user_id", userId)
            .order("created_at", { ascending: false }),
          supabase
            .from("favourites")
            .select("id, video_id")
            .eq("user_id", userId),
        ]);

        if (watchLaterError || favouritesError) {
          throw watchLaterError || favouritesError;
        }

        const videoIds = watchLaterData.map((item: any) => item.video_id);
        const videoPromises = videoIds.map((id: string) => getVideoById(id));
        const videosData = await Promise.all(videoPromises);

        const videosById = new Map();
        for (const videoResult of videosData) {
          if (videoResult.success && videoResult.data) {
            videosById.set(String(videoResult.data.id), videoResult.data);
          }
        }

        const videos = watchLaterData
          .map((watchLaterItem) => {
            const videoData = videosById.get(String(watchLaterItem.video_id));
            if (videoData) {
              return {
                ...videoData,
                db_id: watchLaterItem.id,
              };
            }
            return null;
          })
          .filter(Boolean);

        set({
          videos,
          isLoading: false,
          watchLater: videoIds.map(String),
          favourites: favouritesData.map((item: any) => String(item.video_id)),
        });
      } catch (error) {
        set({ error, isLoading: false });
      }
    },
    fetchFavourites: async () => {
      set({ isLoading: true, error: null });
      try {
        const userId = useUserStore.getState().user?.id;
        if (!userId) {
          throw new Error("User not logged in");
        }
        const [
          { data: favouritesData, error: favouritesError },
          { data: watchLaterData, error: watchLaterError },
        ] = await Promise.all([
          supabase
            .from("favourites")
            .select("id, video_id, created_at")
            .eq("user_id", userId)
            .order("created_at", { ascending: false }),
          supabase
            .from("watch_later")
            .select("id, video_id")
            .eq("user_id", userId),
        ]);

        if (favouritesError || watchLaterError) {
          throw favouritesError || watchLaterError;
        }

        const videoIds = favouritesData.map((item: any) => item.video_id);
        const videoPromises = videoIds.map((id: string) => getVideoById(id));
        const videosData = await Promise.all(videoPromises);

        const videosById = new Map();
        for (const videoResult of videosData) {
          if (videoResult.success && videoResult.data) {
            videosById.set(String(videoResult.data.id), videoResult.data);
          }
        }

        const videos = favouritesData
          .map((favouriteItem) => {
            const videoData = videosById.get(String(favouriteItem.video_id));
            if (videoData) {
              return {
                ...videoData,
                db_id: favouriteItem.id,
              };
            }
            return null;
          })
          .filter(Boolean);

        set({
          videos,
          isLoading: false,
          favourites: videoIds.map(String),
          watchLater: watchLaterData.map((item: any) => String(item.video_id)),
        });
      } catch (error) {
        set({ error, isLoading: false });
      }
    },
    fetchHistory: async () => {
      set({ isLoading: true, error: null });
      try {
        const userId = useUserStore.getState().user?.id;
        if (!userId) {
          throw new Error("User not logged in");
        }

        const [
          { data: historyData, error: historyError },
          { data: favouritesData, error: favouritesError },
          { data: watchLaterData, error: watchLaterError },
        ] = await Promise.all([
          supabase
            .from("history")
            .select("id, video_id, created_at")
            .eq("user_id", userId)
            .order("created_at", { ascending: false }),
          supabase
            .from("favourites")
            .select("id, video_id")
            .eq("user_id", userId),
          supabase
            .from("watch_later")
            .select("id, video_id")
            .eq("user_id", userId),
        ]);

        if (historyError || favouritesError || watchLaterError) {
          throw historyError || favouritesError || watchLaterError;
        }

        const videoIds = historyData.map((item: any) => item.video_id);
        const videoPromises = videoIds.map((id: string) => getVideoById(id));
        const videosData = await Promise.all(videoPromises);

        const videosById = new Map();
        for (const videoResult of videosData) {
          if (videoResult.success && videoResult.data) {
            videosById.set(String(videoResult.data.id), videoResult.data);
          }
        }

        const videos = historyData
          .map((historyItem) => {
            const videoData = videosById.get(String(historyItem.video_id));
            if (videoData) {
              return {
                ...videoData,
                db_id: historyItem.id,
              };
            }
            return null;
          })
          .filter(Boolean);

        set({
          videos,
          isLoading: false,
          favourites: favouritesData.map((item: any) => String(item.video_id)),
          watchLater: watchLaterData.map((item: any) => String(item.video_id)),
        });
      } catch (error) {
        set({ error, isLoading: false });
      }
    },
  })),
);
