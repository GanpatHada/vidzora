import React, { useState, useEffect } from "react";
import MyListCard from "./MyListCard";
import { IoMdAdd } from "react-icons/io";
import { useUserStore } from "../../store/userStore";
import {
  getPlaylistsByUserId,
  createPlaylist,
} from "../../services/playlistService";
import CreatePlaylistModal from "../../components/CreatePlaylistModal";
import toast from "react-hot-toast";

const MyList: React.FC = () => {
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false);
  const { user } = useUserStore();

  const fetchPlaylists = async () => {
    if (!user) return;
    setLoading(true);
    const userPlaylists = await getPlaylistsByUserId(user.id);

    setPlaylists(userPlaylists);
    setLoading(false);
  };

  useEffect(() => {
    fetchPlaylists();
  }, [user]);

  const handleOpenPlaylistModal = () => {
    if (playlists.length >= 5) {
      toast.error("You have reached the maximum number of playlists.");
      return;
    }
    setIsPlaylistModalOpen(true);
  };

  const handleCreatePlaylist = async (name: string, description: string) => {
    if (!user) return;
    setIsCreatingPlaylist(true);
    try {
      await createPlaylist(name, description, user.id);
      toast.success("Playlist created successfully");
      setIsPlaylistModalOpen(false);
      fetchPlaylists();
    } catch (error) {
      toast.error("Failed to create playlist");
    } finally {
      setIsCreatingPlaylist(false);
    }
  };

  return (
    <div className="p-5 text-white pt-[120px] max-w-[1500px] m-auto">
      <header className="flex justify-between mb-10">
        <h1 className="text-3xl font-bold">My list</h1>
        <button
          onClick={handleOpenPlaylistModal}
          className="text-gray-200 bg-gray-50/20 text-sm flex items-center cursor-pointer gap-1 p-2 px-4 rounded-full"
        >
          <IoMdAdd size={25} />
          Create new
        </button>
      </header>
      <main className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
        {loading ? (
          <p>Loading playlists...</p>
        ) : playlists.length > 0 ? (
          playlists.map((playlist) => (
            <MyListCard key={playlist.id} playlist={playlist} />
          ))
        ) : (
          <p>You haven't created any playlists yet.</p>
        )}
      </main>
      <CreatePlaylistModal
        open={isPlaylistModalOpen}
        onClose={() => setIsPlaylistModalOpen(false)}
        onSubmit={handleCreatePlaylist}
        loading={isCreatingPlaylist}
      />
    </div>
  );
};

export default MyList;
