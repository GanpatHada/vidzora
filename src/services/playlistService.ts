import { supabase } from "../supabaseClient";
import { getVideoById } from "./videoService";

export const createPlaylist = async (
  name: string,
  description: string,
  user_id: string,
) => {
  const { data, error } = await supabase
    .from("playlists")
    .insert([{ name, description, user_id }])
    .select();
  if (error) {
    console.error("Error creating playlist:", error);
    return null;
  }
  return data;
};

export const getPlaylistsByUserId = async (user_id: string) => {
  const { data, error } = await supabase
    .from("playlists")
    .select("*")
    .eq("user_id", user_id);
  if (error) {
    console.error("Error fetching playlists:", error);
    return [];
  }
  return data;
};

export const isVideoInPlaylist = async (
  playlist_id: string,
  video_id: string,
) => {
  const { data, error } = await supabase
    .from("playlist_videos")
    .select("id")
    .eq("playlist_id", playlist_id)
    .eq("video_id", video_id)
    .single();

  if (error && error.code !== "PGRST116") {
    // PGRST116 = no rows found
    console.error("Error checking if video is in playlist:", error);
  }

  return data ? true : false;
};

export const addVideoToPlaylist = async (
  playlist_id: string,
  video_id: string,
) => {
  const { data, error } = await supabase
    .from("playlist_videos")
    .insert([{ playlist_id, video_id }])
    .select();

  if (error) {
    console.error("Error adding video to playlist:", error);
    return null;
  }
  return data;
};

export const getPlaylistById = async (playlist_id: string) => {
  const { data, error } = await supabase
    .from("playlists")
    .select("*")
    .eq("id", playlist_id)
    .single();

  if (error) {
    console.error("Error fetching playlist:", error);
    return null;
  }
  return data;
};

export const getPlaylistVideos = async (playlist_id: string) => {
  const { data: playlistData, error: playlistError } = await supabase
    .from("playlists")
    .select("*")
    .eq("id", playlist_id)
    .single();

  if (playlistError) {
    console.error("Error fetching playlist:", playlistError);
    return { playlist: null, videos: [] };
  }

  const { data: videoIds, error: videoIdsError } = await supabase
    .from("playlist_videos")
    .select("video_id, created_at")
    .eq("playlist_id", playlist_id)
    .order("created_at", { ascending: false });

  if (videoIdsError) {
    console.error("Error fetching playlist videos:", videoIdsError);
    return { playlist: playlistData, videos: [] };
  }

  const videoPromises = videoIds.map((item) => getVideoById(item.video_id));
  const videoResults = await Promise.all(videoPromises);

  const videos = videoResults
    .filter((result) => result.success)
    .map((result) => result.data);

  return { playlist: playlistData, videos };
};

export const deletePlaylist = async (playlist_id: string) => {
  // First, delete all videos associated with the playlist
  const { error: videosError } = await supabase
    .from("playlist_videos")
    .delete()
    .eq("playlist_id", playlist_id);

  if (videosError) {
    console.error("Error deleting videos from playlist:", videosError);
    return false;
  }

  // Then, delete the playlist itself
  const { error: playlistError } = await supabase
    .from("playlists")
    .delete()
    .eq("id", playlist_id);

  if (playlistError) {
    console.error("Error deleting playlist:", playlistError);
    return false;
  }

  return true;
};

export const deleteVideoFromPlaylist = async (
  playlist_id: string,
  video_id: string,
) => {
  const { error } = await supabase
    .from("playlist_videos")
    .delete()
    .eq("playlist_id", playlist_id)
    .eq("video_id", video_id);

  if (error) {
    console.error("Error deleting video from playlist:", error);
    return false;
  }

  return true;
};
