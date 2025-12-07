import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { MdManageAccounts, MdOutlineWatchLater } from "react-icons/md";
import { AiOutlinePlus } from "react-icons/ai";
import { WiTime3 } from "react-icons/wi";
import { BiLogOut } from "react-icons/bi";
import { useClickOutside } from "../hooks/useClickOutside";
import { useUserStore } from "../store/userStore";
import { supabase } from "../supabaseClient";
import { IoMdVideocam } from "react-icons/io";

interface MenuProps {
  closeMenu: () => void;
}

const Menu: React.FC<MenuProps> = ({ closeMenu }) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const { setUser } = useUserStore();
  useClickOutside(menuRef as React.RefObject<HTMLElement>, closeMenu);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    closeMenu();
  };

  return (
    <div
      ref={menuRef}
      className="fixed w-64 top-16 right-4 bg-black/60 backdrop-blur border-gray-200/40 border-l-2 border-t-2 rounded-lg z-40"
    >
      <ul className="flex flex-col gap-6 p-6 text-white">
        <li>
          <Link className="flex items-center gap-3 hover:text-blue-500" to="/">
            <MdManageAccounts size={20} /> My Account
          </Link>
        </li>
        <li>
          <Link className="flex items-center gap-3 hover:text-blue-500" to="/">
            <MdOutlineWatchLater size={20} /> Watch Later
          </Link>
        </li>
        <li>
          <Link className="flex items-center gap-3 hover:text-blue-500" to="/">
            <AiOutlinePlus size={20} />My List
          </Link>
        </li>
        <li>
          <Link className="flex items-center gap-3 hover:text-blue-500" to="/">
            <WiTime3 size={20} /> Watch History
          </Link>
        </li>
        
        <li>
          <Link className="flex items-center gap-3 hover:text-blue-500" to="/">
            <IoMdVideocam size={20

            } />My Favourites
          </Link>
        </li>
        <li>
          <button
            className="flex items-center gap-3 hover:text-blue-500"
            onClick={handleLogout}
          >
            <BiLogOut size={20} /> Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Menu;
