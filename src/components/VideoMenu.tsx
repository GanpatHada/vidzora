import React, { useState, useRef } from "react";
import { HiDotsVertical } from "react-icons/hi";
import {
  MdOutlineWatchLater,
  MdWatchLater,
  MdFavoriteBorder,
  MdFavorite,
  MdDelete,
} from "react-icons/md";
import { FaHistory } from "react-icons/fa";
import { useClickOutside } from "../hooks/useClickOutside";

type VideoMenuProps = {
  video: any;
  isFavorite?: boolean;
  isInWatchLater?: boolean;
  onToggleFavorite?: () => void;
  onToggleWatchLater?: () => void;
  onDeleteFromHistory?: () => void;
  onDeleteFromPlaylist?: () => void;
};

const VideoMenu: React.FC<VideoMenuProps> = ({
  isFavorite,
  isInWatchLater,
  onToggleFavorite,
  onToggleWatchLater,
  onDeleteFromHistory,
  onDeleteFromPlaylist,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useClickOutside(menuRef as React.RefObject<HTMLElement>, () =>
    setIsOpen(false)
  );

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-white focus:outline-none hover:bg-gray-50/20 rounded-full p-2 cursor-pointer"
      >
        <HiDotsVertical size={18} />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-60 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10 overflow-hidden">
          <ul>
            {onToggleFavorite && (
              <li
                className="flex items-center gap-4 p-3 hover:bg-gray-700 cursor-pointer"
                onClick={() => {
                  onToggleFavorite();
                  setIsOpen(false);
                }}
              >
                {isFavorite ? (
                  <MdFavorite size={24} />
                ) : (
                  <MdFavoriteBorder size={24} />
                )}
                <span>Add to Favourites</span>
              </li>
            )}
            {onToggleWatchLater && (
              <li
                className="flex items-center gap-4 p-3 hover:bg-ray-700 cursor-pointer"
                onClick={() => {
                  onToggleWatchLater();
                  setIsOpen(false);
                }}
              >
                {isInWatchLater ? (
                  <MdWatchLater size={24} />
                ) : (
                  <MdOutlineWatchLater size={24} />
                )}
                <span>Add to Watch Later</span>
              </li>
            )}
            {onDeleteFromHistory && (
              <li
                className="flex items-center gap-4 p-3 hover:bg-gray-700 cursor-pointer"
                onClick={() => {
                  onDeleteFromHistory();
                  setIsOpen(false);
                }}
              >
                <FaHistory size={24} />
                <span>Delete from History</span>
              </li>
            )}
            {onDeleteFromPlaylist && (
              <li
                className="flex items-center gap-4 p-3 hover:bg-gray-700 cursor-pointer"
                onClick={() => {
                  onDeleteFromPlaylist();
                  setIsOpen(false);
                }}
              >
                <MdDelete size={24} />
                <span>Delete from Playlist</span>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default VideoMenu;
