import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPlaylistVideos, deletePlaylist, deleteVideoFromPlaylist } from "../../services/playlistService";
import PlaylistVideoCard from "./PlaylistVideoCard";
import UserPageSkeleton from "../user/UserPageSkeleton";
import type { Video } from "../../store/videoStore";
import ConfirmationModal from "../../components/ConfirmationModal";
import toast from "react-hot-toast";
import { RiDeleteBin6Line } from "react-icons/ri";

const PlaylistPage: React.FC = () => {
  const { playlistId } = useParams<{ playlistId: string }>();
  const navigate = useNavigate();
  const [playlist, setPlaylist] = useState<any>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (playlistId) {
      const fetchPlaylistData = async () => {
        setLoading(true);
        try {
          const { playlist: playlistData, videos: videoData } = await getPlaylistVideos(playlistId);
          if (playlistData) {
            setPlaylist(playlistData);
            setVideos(videoData);
          } else {
            setError("Playlist not found.");
          }
        } catch (err) {
          setError("Failed to fetch playlist data.");
        } finally {
          setLoading(false);
        }
      };
      fetchPlaylistData();
    }
  }, [playlistId]);

  const handleDeletePlaylist = async () => {
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!playlistId) return;
    setIsDeleting(true);
    try {
      const success = await deletePlaylist(playlistId);
      if (success) {
        toast.success("Playlist deleted successfully");
        navigate("/my-list");
      } else {
        toast.error("Failed to delete playlist");
      }
    } catch (err) {
      toast.error("Failed to delete playlist");
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  const handleDeleteVideo = async (videoId: string) => {
    if (!playlistId) return;
    const success = await deleteVideoFromPlaylist(playlistId, videoId);
    if (success) {
      toast.success("Video removed from playlist");
      setVideos(videos.filter(v => v.id !== videoId));
    } else {
      toast.error("Failed to remove video from playlist");
    }
  };

  if (loading) {
    return (
      <div className="w-full p-5 pt-[120px] max-w-[1080px] m-auto">
        <UserPageSkeleton />
      </div>
    );
  }
  
  if (error) {
    return <div className="text-white p-5 pt-[120px] max-w-[1080px] m-auto">{error}</div>;
  }

  return (
    <>
      <div className="w-full text-white p-5 pt-[120px] max-w-[1080px] m-auto">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-3xl font-bold">{playlist.name}</h1>
          <button
            onClick={handleDeletePlaylist}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            <RiDeleteBin6Line />
            Delete Playlist
          </button>
        </div>
        <p className="text-gray-400 mb-10">{playlist.description}</p>
        
        {videos.length > 0 ? (
          <div className="flex flex-col gap-5">
            {videos.map((video) => (
              <PlaylistVideoCard key={video.id} video={video} onDelete={() => handleDeleteVideo(video.id)} />
            ))}
          </div>
        ) : (
          <p className="text-gray-400">This playlist has no videos yet.</p>
        )}
      </div>
      <ConfirmationModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Playlist"
        message={`Are you sure you want to delete the playlist "${playlist?.name}"? This action cannot be undone.`}
        loading={isDeleting}
      />
    </>
  );
};

export default PlaylistPage;
