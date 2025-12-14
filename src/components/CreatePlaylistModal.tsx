import { useState, useRef, useEffect } from "react";
import{ useClickOutside} from "../hooks/useClickOutside";
import { IoMdClose } from "react-icons/io";

interface CreatePlaylistModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (name: string, description: string) => void;
  loading: boolean;
}

const CreatePlaylistModal = ({ open, onClose, onSubmit, loading }: CreatePlaylistModalProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);

  const NAME_MAX_LENGTH = 50;
  const DESCRIPTION_MAX_LENGTH = 200;

  useClickOutside(modalRef as React.RefObject<HTMLElement>, onClose);

  useEffect(() => {
    if (open) {
      setName("");
      setDescription("");
    }
  }, [open]);

  const handleOk = () => {
    onSubmit(name, description);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75">
      <div ref={modalRef} className="bg-zinc-800 rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Create new playlist</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <IoMdClose size={24} />
          </button>
        </div>
        <div className="flex flex-col gap-4">
          <div>
            <input
              type="text"
              placeholder="Playlist name"
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, NAME_MAX_LENGTH))}
              className="w-full p-2 bg-zinc-700 text-white rounded-md border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-right text-xs text-gray-400 mt-1">
              {NAME_MAX_LENGTH - name.length} characters remaining
            </p>
          </div>
          <div>
            <textarea
              placeholder="Playlist description"
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, DESCRIPTION_MAX_LENGTH))}
              rows={4}
              className="w-full resize-none p-2 bg-zinc-700 text-white rounded-md border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-right text-xs text-gray-400 mt-1">
              {DESCRIPTION_MAX_LENGTH - description.length} characters remaining
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleOk}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePlaylistModal;
