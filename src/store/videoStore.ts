import { create } from "zustand";
import { fetchPopularVideos, searchVideos } from "../services/VideoService";
import categories from "../data/Categories.json";

const getCategoryFromTags = (tags: string): string => {
  const tagList = tags.split(", ");
  for (const tag of tagList) {
    const foundCategory = categories.find(
      (cat:{id:number,name:string}) => cat.name.toLowerCase() === tag.toLowerCase(),
    );
    if (foundCategory) {
      return foundCategory.name;
    }
  }
  return "Misc";
};

interface VideoAsset {
  url: string;
  thumbnail?: string;
}

interface VideoDetails {
  small: VideoAsset;
  tiny: VideoAsset;
}

export interface Video {
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

interface VideoStore {
  videos: Video[];
  currentCategory: string;
  isLoading: boolean;
  error: string | null;
  page: number;
  hasMore: boolean;
  fetchVideos: () => Promise<void>;
  setCategory: (category: string) => Promise<void>;
  fetchMoreVideos: () => Promise<void>;
}

interface PexelsHit {
  id: string;
  tags: string;
  user: string;
  userImageURL: string;
  views: number;
  likes: number;
  videos: VideoDetails;
}

export const useVideoStore = create<VideoStore>((set, get) => ({
  videos: [],
  currentCategory: "All",
  isLoading: false,
  error: null,
  page: 1,
  hasMore: true,

  fetchVideos: async () => {
    set({ isLoading: true, error: null, page: 1, hasMore: true, videos: [] });
    try {
      const result = await fetchPopularVideos(1);
      if (result.success) {
        const mappedVideos = result.data.hits.map((hit: PexelsHit) => ({
          id: hit.id,
          title: hit.tags,
          category: getCategoryFromTags(hit.tags),
          user: hit.user,
          userImageURL: hit.userImageURL,
          tags: hit.tags,
          views: hit.views,
          likes: hit.likes,
          videos: hit.videos,
        }));
        set({
          videos: mappedVideos,
          isLoading: false,
          hasMore: result.data.hits.length > 0,
        });
      } else {
        throw new Error((result.error as string) || "Failed to fetch videos.");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        set({ error: err.message, isLoading: false });
      } else {
        set({ error: "An unknown error occurred", isLoading: false });
      }
    }
  },

  setCategory: async (category: string) => {
    set({
      isLoading: true,
      error: null,
      currentCategory: category,
      page: 1,
      hasMore: true,
      videos: [],
    });
    try {
      const result =
        category === "All"
          ? await fetchPopularVideos(1)
          : await searchVideos(category, 1);

      if (result.success) {
        const mappedVideos = result.data.hits.map((hit: PexelsHit) => ({
          id: hit.id,
          title: hit.tags,
          category: getCategoryFromTags(hit.tags),
          user: hit.user,
          userImageURL: hit.userImageURL,
          tags: hit.tags,
          views: hit.views,
          likes: hit.likes,
          videos: hit.videos,
        }));
        set({
          videos: mappedVideos,
          isLoading: false,
          hasMore: result.data.hits.length > 0,
        });
      } else {
        throw new Error(
          (result.error as string) ||
            `Failed to fetch videos for category: ${category}`,
        );
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        set({ error: err.message, isLoading: false });
      } else {
        set({ error: "An unknown error occurred", isLoading: false });
      }
    }
  },

  fetchMoreVideos: async () => {
    const { currentCategory, page, videos, isLoading, hasMore } = get();
    if (isLoading || !hasMore) return;

    set({ isLoading: true });
    const nextPage = page + 1;

    try {
      const result =
        currentCategory === "All"
          ? await fetchPopularVideos(nextPage)
          : await searchVideos(currentCategory, nextPage);

      if (result.success) {
        const newVideos = result.data.hits.map((hit: PexelsHit) => ({
          id: hit.id,
          title: hit.tags,
          category: getCategoryFromTags(hit.tags),
          user: hit.user,
          userImageURL: hit.userImageURL,
          tags: hit.tags,
          views: hit.views,
          likes: hit.likes,
          videos: hit.videos,
        }));
        set({
          videos: [...videos, ...newVideos],
          page: nextPage,
          isLoading: false,
          hasMore: newVideos.length > 0,
        });
      } else {
        throw new Error(
          (result.error as string) || "Failed to fetch more videos.",
        );
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        set({ error: err.message, isLoading: false });
      } else {
        set({ error: "An unknown error occurred", isLoading: false });
      }
    }
  },
}));
