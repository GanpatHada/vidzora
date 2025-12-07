import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { getVideoById, fetchPopularVideos } from "../../services/VideoService";
import {
  isVideoInWatchLater,
  addToWatchLater,
  removeFromWatchLater,
  isVideoInFavorites,
  addToFavorites,
  removeFromFavorites,
  addToHistory // <-- import the new function
} from "../../services/UserVideoDataService";
import VideoSkeleton from "./VideoSkeleton";
import { MdOutlineWatchLater, MdWatchLater, MdPlaylistAdd } from "react-icons/md";
import { FaHeart, FaEye, FaDownload, FaComment, FaRegHeart } from "react-icons/fa";
import { useUserStore } from "../../store/userStore";
import toast from "react-hot-toast";
import SuggestedVideoCard from "./SuggestedVideoCard";

const Video: React.FC = () => {
  const { videoId } = useParams();
  const [video, setVideo] = useState<any>(null);
  const [suggestedVideos, setSuggestedVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isInWatchLater, setIsInWatchLater] = useState(false);
  const [isInFavorites, setIsInFavorites] = useState(false);
  const [isTogglingWatchLater, setIsTogglingWatchLater] = useState(false);
  const [isTogglingFavorites, setIsTogglingFavorites] = useState(false);

  const { user } = useUserStore();

  const checkStatus = useCallback(async () => {
    if (!user || !videoId) return;
    try {
      setIsInWatchLater(await isVideoInWatchLater(user.id, videoId));
      setIsInFavorites(await isVideoInFavorites(user.id, videoId));
    } catch (err) {
      console.error("Error checking video status:", err);
    }
  }, [user, videoId]);

  useEffect(() => {
    if (videoId) {
      const fetchVideoAndSuggestions = async () => {
        setLoading(true);
        try {
          const videoResult = await getVideoById(videoId);
          if (videoResult.success) {
            setVideo(videoResult.data);
            if (user) {
              await addToHistory(user.id, videoId);
            }
          } else {
            throw new Error("Failed to fetch video");
          }

          const suggestionsResult = await fetchPopularVideos();
          if (suggestionsResult.success && suggestionsResult.data.hits) {
            const filteredSuggestions = suggestionsResult.data.hits.filter(
              (v: any) => v.id.toString() !== videoId
            );
            setSuggestedVideos(filteredSuggestions);
          }
        } catch (err: any) {
          setError(err.message || "An error occurred.");
        } finally {
          setLoading(false);
        }
      };

      fetchVideoAndSuggestions();
    }
  }, [videoId, user]);

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  const handleToggleWatchLater = async () => {
    if (!user || !videoId) {
      toast.error("Please log in to use this feature.");
      return;
    }
    setIsTogglingWatchLater(true);
    try {
      if (isInWatchLater) {
        await removeFromWatchLater(user.id, videoId);
        toast.success("Removed from Watch Later");
      } else {
        await addToWatchLater(user.id, videoId);
        toast.success("Added to Watch Later");
      }
      setIsInWatchLater(!isInWatchLater);
    } catch {
      toast.error("Failed to update Watch Later");
    } finally {
      setIsTogglingWatchLater(false);
    }
  };

  const handleToggleFavorites = async () => {
    if (!user || !videoId) {
      toast.error("Please log in to use this feature.");
      return;
    }
    setIsTogglingFavorites(true);
    try {
      if (isInFavorites) {
        await removeFromFavorites(user.id, videoId);
        toast.success("Removed from Favorites");
      } else {
        await addToFavorites(user.id, videoId);
        toast.success("Added to Favorites");
      }
      setIsInFavorites(!isInFavorites);
    } catch {
      toast.error("Failed to update Favorites");
    } finally {
      setIsTogglingFavorites(false);
    }
  };

  const handlePlaylistAction = () => {
    if (!user) {
      toast.error("Please log in to use this feature.");
      return;
    }
    toast.success("Playlist feature coming soon!");
  };

  if (loading) return <VideoSkeleton />;
  if (error) return <div className="text-white p-4 pt-20">Error: {error}</div>;
  if (!video) return <div className="text-white p-4 pt-20">Video not found.</div>;

  return (
    <div className="text-white pt-20 px-4 md:px-8 lg:px-16 xl:px-20 grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
      <div className="lg:col-span-2">
        <div className="relative w-full overflow-hidden" style={{ paddingTop: "56.25%" }}>
          <video
            src={video.videos.large.url}
            controls
            autoPlay
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
        </div>

        <div className="mt-4">
          <h1 className="text-3xl font-bold">{video.tags}</h1>

          <div className="flex items-center gap-4 mt-4">
            <img src={video.userImageURL} alt={video.user} className="w-12 h-12 rounded-full object-cover" />
            <p className="text-gray-200 text-lg font-semibold">{video.user}</p>
          </div>

          <div className="flex items-center flex-wrap gap-x-6 gap-y-2 mt-4 text-gray-300">
            <span className="flex items-center gap-2"><FaEye /> {video.views?.toLocaleString()} views</span>
            <span className="flex items-center gap-2"><FaHeart /> {video.likes?.toLocaleString()} likes</span>
            <span className="flex items-center gap-2"><FaDownload /> {video.downloads?.toLocaleString()} downloads</span>
            <span className="flex items-center gap-2"><FaComment /> {video.comments?.toLocaleString()} comments</span>
          </div>

          <div className="flex items-center gap-4 mt-6">
            <button
              onClick={handleToggleWatchLater}
              disabled={isTogglingWatchLater}
              className="flex items-center gap-1 px-3 py-2 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors disabled:opacity-50"
            >
              {isInWatchLater ? <MdWatchLater size={22} /> : <MdOutlineWatchLater size={22} />}
              Watch Later
            </button>

            <button
              onClick={handleToggleFavorites}
              disabled={isTogglingFavorites}
              className="flex items-center gap-1 px-3 py-2 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors disabled:opacity-50"
            >
              {isInFavorites ? <FaHeart size={20} className="text-red-500" /> : <FaRegHeart size={20} />}
              Favorite
            </button>

            <button
              onClick={handlePlaylistAction}
              className="flex items-center gap-1 px-3 py-2 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors"
            >
              <MdPlaylistAdd size={22} />
              Playlist
            </button>
          </div>

          <div className="mt-4 p-4 bg-gray-800 rounded-lg">
            <h2 className="text-xl font-bold">Description</h2>
            <p className="mt-2 text-gray-300">{video.tags}</p>
          </div>
        </div>
      </div>

      <div className="lg:col-span-1">
        <h2 className="text-2xl font-bold mb-4">Suggested Videos</h2>
        <div className="flex flex-col gap-4">
          {suggestedVideos.map((vid) => (
            <SuggestedVideoCard key={vid.id} video={vid} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Video;
