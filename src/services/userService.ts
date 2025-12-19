import { supabase } from "../supabaseClient";

export const isVideoInWatchLater = async (
  userId: string,
  videoId: string,
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
  videoId: string,
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
  const { data: lastHistoryItem, error: fetchError } = await supabase
    .from("history")
    .select("video_id")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (fetchError) {
    console.error("Error fetching last history item:", fetchError);
    return;
  }

  if (lastHistoryItem && lastHistoryItem.video_id.toString() === videoId) {
    return;
  }

  const { data, error } = await supabase
    .from("history")
    .insert([{ user_id: userId, video_id: videoId }]);
  if (error) throw error;
  return data;
};

export const removeFromHistory = async (userId: string, videoId: string) => {
  const { data, error } = await supabase
    .from("history")
    .delete()
    .eq("user_id", userId)
    .eq("video_id", videoId);

  if (error) throw error;
  return data;
};

export const removeFromHistoryById = async (historyId: number) => {
  const { data, error } = await supabase
    .from("history")
    .delete()
    .eq("id", historyId);

  if (error) throw error;
  return data;
};

export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from("users")
    .select("full_name, profile_picture")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
  return data;
};

export const updateUserProfile = async (
  userId: string,
  email: string,
  fullName: string,
  profilePictureId: number,
) => {
  const { data, error } = await supabase
    .from("users")
    .upsert({
      id: userId,
      email,
      full_name: fullName,
      profile_picture: profilePictureId,
    })
    .select();

  if (error) {
    console.error("Error updating user profile:", error);
  }
  return { data, error };
};
