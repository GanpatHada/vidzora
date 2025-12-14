import { useState, useEffect, useRef } from "react";
import { useUserStore } from "../store/userStore";
import { getPlaylistsByUserId, isVideoInPlaylist, addVideoToPlaylist, createPlaylist } from "../services/playlistService";
import {useClickOutside} from "../hooks/useClickOutside";
import { IoMdClose, IoMdAdd } from "react-icons/io";
import CreatePlaylistModal from "./CreatePlaylistModal";
import toast from "react-hot-toast";
import Spinner from "./Spinner";

interface AddToPlaylistModalProps {
  open: boolean;
  onClose: () => void;
  videoId: string;
}

const AddToPlaylistModal = ({ open, onClose, videoId }: AddToPlaylistModalProps) => {
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreatePlaylistModalOpen, setIsCreatePlaylistModalOpen] = useState(false);
  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false);
  const [isAddingVideo, setIsAddingVideo] = useState<string | null>(null);
  const { user } = useUserStore();
  const modalRef = useRef<HTMLDivElement>(null);

  useClickOutside(modalRef as React.RefObject<HTMLElement>, onClose);

  const fetchPlaylists = async () => {
    if (!user) return;
    setLoading(true);
    const userPlaylists = await getPlaylistsByUserId(user.id);
    setPlaylists(userPlaylists);
    setLoading(false);
  };

  useEffect(() => {
    if (open) {
      fetchPlaylists();
      setIsCreatePlaylistModalOpen(false); // Reset state when modal opens
    }
  }, [open]);

  const handlePlaylistClick = async (playlistId: string) => {
    setIsAddingVideo(playlistId);
    try {
      console.log("Adding video to playlist:", { videoId, playlistId });
      const videoAlreadyInPlaylist = await isVideoInPlaylist(playlistId, videoId);
      if (videoAlreadyInPlaylist) {
        toast.error("Video is already in this playlist.");
      }
      else {
        const result = await addVideoToPlaylist(playlistId, videoId);
        if (result) {
          toast.success("Video added to playlist!");
          onClose();
        } else {
          toast.error("Failed to add video to playlist.");
        }
      }
    } finally {
      setIsAddingVideo(null);
    }
  };

  const handleOpenCreatePlaylistModal = () => {
    if (playlists.length >= 5) {
      toast.error("You have reached the maximum number of playlists.");
      return;
    }
    setIsCreatePlaylistModalOpen(true);
  };

  const handleCreatePlaylist = async (name: string, description: string) => {
    if (!user) return;
    setIsCreatingPlaylist(true);
    try {
      await createPlaylist(name, description, user.id);
      setIsCreatePlaylistModalOpen(false);
      fetchPlaylists();
    } finally {
      setIsCreatingPlaylist(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
      <div
        ref={modalRef}
        className="bg-zinc-800 rounded-lg shadow-xl w-full max-w-md max-h-[80vh] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-zinc-700">
          <h2 className="text-xl font-bold text-white">Add to playlist</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <IoMdClose size={24} />
          </button>
        </div>

        {/* Scrollable playlist list */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
          {loading ? (
            <div className="flex justify-center">
              <Spinner />
            </div>
          ) : playlists.length > 0 ? (
            playlists.map((playlist) => (
              <div
                key={playlist.id}
                onClick={() =>
                  isAddingVideo !== playlist.id && handlePlaylistClick(playlist.id)
                }
                className="p-2 rounded-md hover:bg-zinc-700 cursor-pointer text-white flex items-center justify-between"
              >
                <span>{playlist.name}</span>
                {isAddingVideo === playlist.id && <Spinner size="h-4 w-4" />}
              </div>
            ))
          ) : (
            <p className="text-white text-center">No playlists found.</p>
          )}
        </div>

        {/* Footer: Create new playlist */}
        <div className="p-4 border-t border-zinc-700">
          <button
            onClick={handleOpenCreatePlaylistModal}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <IoMdAdd size={20} />
            Create new playlist
          </button>
        </div>

        {/* Create Playlist Modal */}
        <CreatePlaylistModal
          open={isCreatePlaylistModalOpen}
          onClose={() => setIsCreatePlaylistModalOpen(false)}
          onSubmit={handleCreatePlaylist}
          loading={isCreatingPlaylist}
        />
      </div>
    </div>
  );
};

export default AddToPlaylistModal;
