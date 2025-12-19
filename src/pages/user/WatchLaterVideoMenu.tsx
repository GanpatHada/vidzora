import React, { useState, useRef } from "react";
import { HiDotsVertical } from "react-icons/hi";
import { MdWatchLater, MdFavoriteBorder, MdFavorite } from "react-icons/md";
import { useClickOutside } from "../../hooks/useClickOutside";

type WatchLaterVideoMenuProps = {
  video: any;
  isFavorite: boolean;
  onAddToFavorite: () => void;
  onRemoveFromWatchLater: () => void;
};

const WatchLaterVideoMenu: React.FC<WatchLaterVideoMenuProps> = ({
  isFavorite,
  onAddToFavorite,
  onRemoveFromWatchLater,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useClickOutside(menuRef as React.RefObject<HTMLElement>, () =>
    setIsOpen(false),
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
            <li
              className="flex items-center gap-4 p-3 hover:bg-gray-700 cursor-pointer"
              onClick={() => {
                onRemoveFromWatchLater();
                setIsOpen(false);
              }}
            >
              <MdWatchLater size={24} />
              <span>Remove from Watch Later</span>
            </li>
            <li
              className="flex items-center gap-4 p-3 hover:bg-gray-700 cursor-pointer"
              onClick={() => {
                onAddToFavorite();
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
          </ul>
        </div>
      )}
    </div>
  );
};

export default WatchLaterVideoMenu;
