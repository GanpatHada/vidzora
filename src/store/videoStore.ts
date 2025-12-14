import { create } from "zustand";
import { fetchPopularVideos, searchVideos } from "../services/videoService";
import categories from "../data/Categories.json";

/* ---------------- Utilities ---------------- */

const getCategoryFromTags = (tags: string): string => {
  const tagList = tags.split(", ");
  for (const tag of tagList) {
    const foundCategory = categories.find(
      (cat: { id: number; name: string }) =>
        cat.name.toLowerCase() === tag.toLowerCase()
    );
    if (foundCategory) return foundCategory.name;
  }
  return "Misc";
};

/* ---------------- Types ---------------- */

interface VideoAsset {
  url: string;
  thumbnail?: string;
}

interface VideoDetails {
  small: VideoAsset;
  tiny: VideoAsset;
}

export interface Video {
  db_id: string;
  id: string;
  title: string;
  category: string;
  user: string;
  userImageURL: string;
  tags: string;
  views: number;
  likes: number;
  videos: VideoDetails;
}

interface PexelsHit {
  id: string;
  tags: string;
  user: string;
  userImageURL: string;
  views: number;
  likes: number;
  videos: VideoDetails;
  picture_id: string;
}

/* ---------------- Store Interface ---------------- */

interface VideoStore {
  videos: Video[];
  currentCategory: string;
  isInitialLoading: boolean;
  error: string | null;
  page: number;
  hasMore: boolean;
  fetchVideos: () => Promise<void>;
  setCategory: (category: string) => Promise<void>;
  fetchMoreVideos: () => Promise<void>;
}

/* ---------------- Store ---------------- */

export const useVideoStore = create<VideoStore>((set, get) => ({
  videos: [],
  currentCategory: "All",

  isInitialLoading: false,
  isFetchingMore: false,

  error: null,
  page: 1,
  hasMore: true,

  /* ---------- Initial Fetch ---------- */
  fetchVideos: async () => {
    set({
      isInitialLoading: true,
      error: null,
      page: 1,
      hasMore: true,
      videos: [],
    });

    try {
      const result = await fetchPopularVideos(1);

      if (!result.success) {
        throw new Error(result.error as string);
      }

     const mappedVideos: Video[] = result.data.hits.map((hit: PexelsHit) => ({
  id: hit.id,
  title: hit.tags,
  category: getCategoryFromTags(hit.tags),
  user: hit.user,
  userImageURL: hit.userImageURL,
  tags: hit.tags,
  views: hit.views,
  likes: hit.likes,
  videos: {
    ...hit.videos
  },
}));

      set({
        videos: mappedVideos,
        isInitialLoading: false,
        hasMore: mappedVideos.length > 0,
      });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Unknown error",
        isInitialLoading: false,
      });
    }
  },

  /* ---------- Category Change ---------- */
  setCategory: async (category: string) => {
    set({
      currentCategory: category,
      isInitialLoading: true,
      error: null,
      page: 1,
      hasMore: true,
      videos: [],
    });

    try {
      const result =
        category === "All"
          ? await fetchPopularVideos(1)
          : await searchVideos(category, 1);

      if (!result.success) {
        throw new Error(result.error as string);
      }

      const mappedVideos: Video[] = result.data.hits.map((hit: PexelsHit) => ({
        id: hit.id,
        title: hit.tags,
        category: getCategoryFromTags(hit.tags),
        user: hit.user,
        userImageURL: hit.userImageURL,
        tags: hit.tags,
        views: hit.views,
        likes: hit.likes,
        videos: {
         ...hit.videos
        },
      }));

      set({
        videos: mappedVideos,
        isInitialLoading: false,
        hasMore: mappedVideos.length > 0,
      });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Unknown error",
        isInitialLoading: false,
      });
    }
  },

  /* ---------- Pagination ---------- */
  fetchMoreVideos: async () => {
    const { currentCategory, page} = get();
    const nextPage = page + 1;
    try {
      const result =
        currentCategory === "All"
          ? await fetchPopularVideos(nextPage)
          : await searchVideos(currentCategory, nextPage);

      if (!result.success) {
        throw new Error(result.error as string);
      }

      const newVideos: Video[] = result.data.hits.map((hit: PexelsHit) => ({
        id: hit.id,
        title: hit.tags,
        category: getCategoryFromTags(hit.tags),
        user: hit.user,
        userImageURL: hit.userImageURL,
        tags: hit.tags,
        views: hit.views,
        likes: hit.likes,
        videos: {
          ...hit.videos
        },
      }));

      set((state) => ({
        videos: [...state.videos, ...newVideos],
        page: nextPage,
        isFetchingMore: false,
        hasMore: newVideos.length > 0,
      }));
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Unknown error",
        
      });
    }
  },
}));
