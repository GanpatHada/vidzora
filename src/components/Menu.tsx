import React, { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdManageAccounts, MdOutlineWatchLater } from "react-icons/md";
import { AiOutlinePlus } from "react-icons/ai";
import { WiTime3 } from "react-icons/wi";
import { BiLogOut } from "react-icons/bi";
import { IoMdVideocam } from "react-icons/io";
import { useClickOutside } from "../hooks/useClickOutside";
import { useUserStore } from "../store/userStore";
import { supabase } from "../supabaseClient";

interface MenuProps {
  closeMenu: () => void;
}

const Menu: React.FC<MenuProps> = ({ closeMenu }) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const { user, setUser, signOut } = useUserStore();
  const navigate = useNavigate();

  useClickOutside(menuRef as React.RefObject<HTMLElement>, closeMenu);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      await signOut?.();
      closeMenu();
      navigate("/auth");
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  return (
    <div
      ref={menuRef}
      className="fixed w-64 top-16 right-4 bg-black/60 backdrop-blur border-gray-200/40 border-l-2 border-t-2 rounded-lg z-40"
    >
      <ul className="flex flex-col gap-6 p-6 text-white">
        {user ? (
          <>
            <li>
              <Link
                className="flex items-center gap-3 hover:text-blue-500"
                to="/my-profile"
              >
                <MdManageAccounts size={20} /> My Profile
              </Link>
            </li>

  
            <li>
              <Link
                className="flex items-center gap-3 hover:text-blue-500"
                to="/my-list"
              >
                <AiOutlinePlus size={20} /> My List
              </Link>
            </li>
            <li>
              <Link
                className="flex items-center gap-3 hover:text-blue-500"
                to="/history"
              >
                <WiTime3 size={20} /> History
              </Link>
            </li>

            <li>
              <Link
                className="flex items-center gap-3 hover:text-blue-500"
                to="/favourites"
              >
                <IoMdVideocam size={20} /> Favourites
              </Link>
            </li>

            <li>
              <Link
                className="flex items-center gap-3 hover:text-blue-500"
                to="/watch-later"
              >
                <MdOutlineWatchLater size={20} /> Watch Later
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
          </>
        ) : (
          <li>
            <Link
              className="flex items-center gap-3 hover:text-blue-500"
              to="/auth"
            >
              <MdManageAccounts size={20} /> Login
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Menu;
