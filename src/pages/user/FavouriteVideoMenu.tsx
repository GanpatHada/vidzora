import React, { useState, useRef } from "react";
import { HiDotsVertical } from "react-icons/hi";
import { MdOutlineWatchLater, MdWatchLater, MdFavorite } from "react-icons/md";
import { useClickOutside } from "../../hooks/useClickOutside";

type FavouriteVideoMenuProps = {
  video: any;
  isInWatchLater: boolean;
  onAddToWatchLater: () => void;
  onRemoveFromFavorite: () => void;
};

const FavouriteVideoMenu: React.FC<FavouriteVideoMenuProps> = ({
  isInWatchLater,
  onAddToWatchLater,
  onRemoveFromFavorite,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useClickOutside(menuRef as React.RefObject<HTMLElement>, () => setIsOpen(false));

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
                onRemoveFromFavorite();
                setIsOpen(false);
              }}
            >
              <MdFavorite size={24} />
              <span>Remove from Favourites</span>
            </li>
            <li
              className="flex items-center gap-4 p-3 hover:bg-gray-700 cursor-pointer"
              onClick={() => {
                onAddToWatchLater();
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
          </ul>
        </div>
      )}
    </div>
  );
};

export default FavouriteVideoMenu;
