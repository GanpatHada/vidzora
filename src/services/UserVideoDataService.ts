import { supabase } from "../supabaseClient";

export const isVideoInWatchLater = async (
  userId: string,
  videoId: string
): Promise<boolean> => {
  const { data, error } = await supabase
    .from("watch_later")
    .select("id")
    .eq("user_id", userId)
    .eq("video_id", videoId)
    .maybeSingle();

  if (error) {
    console.error("Error checking watch later:", error);
    return false;
  }

  return !!data;
};

export const addToWatchLater = async (userId: string, videoId: string) => {
  const { data, error } = await supabase
    .from("watch_later")
    .insert([{ user_id: userId, video_id: videoId }]);

  if (error) throw error;
  return data;
};

export const removeFromWatchLater = async (userId: string, videoId: string) => {
  const { data, error } = await supabase
    .from("watch_later")
    .delete()
    .eq("user_id", userId)
    .eq("video_id", videoId);

  if (error) throw error;
  return data;
};

// == Favorites Functions ==
export const isVideoInFavorites = async (
  userId: string,
  videoId: string
): Promise<boolean> => {
  const { data, error } = await supabase
    .from("favourites")
    .select("id")
    .eq("user_id", userId)
    .eq("video_id", videoId)
    .maybeSingle(); // fixed .single()

  if (error) {
    console.error("Error checking favorites:", error);
    return false;
  }

  return !!data;
};

export const addToFavorites = async (userId: string, videoId: string) => {
  const { data, error } = await supabase
    .from("favourites")
    .insert([{ user_id: userId, video_id: videoId }]);

  if (error) throw error;
  return data;
};

export const removeFromFavorites = async (userId: string, videoId: string) => {
  const { data, error } = await supabase
    .from("favourites")
    .delete()
    .eq("user_id", userId)
    .eq("video_id", videoId);

  if (error) throw error;
  return data;
};

export const addToHistory = async (userId: string, videoId: string) => {
  const { data, error } = await supabase
    .from("history")
    .insert([{ user_id: userId, video_id: videoId }]);
  if (error) throw error;
  return data;
};


