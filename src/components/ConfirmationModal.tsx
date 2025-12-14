import { useRef } from "react";
import {useClickOutside} from "../hooks/useClickOutside";
import { IoMdClose } from "react-icons/io";

interface ConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  loading: boolean;
}

const ConfirmationModal = ({ open, onClose, onConfirm, title, message, loading }: ConfirmationModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useClickOutside(modalRef as React.RefObject<HTMLElement>, onClose);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75">
      <div ref={modalRef} className="bg-zinc-800 rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <IoMdClose size={24} />
          </button>
        </div>
        <p className="text-gray-300">{message}</p>
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
