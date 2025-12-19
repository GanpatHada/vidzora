import React, { useState, useEffect } from "react";
import Logo from "../assets/vidzora_max.svg";
import { IoMdSearch } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import Menu from "./Menu";
import { useUserStore } from "../store/userStore";
import { avatars } from "../data/avatars";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, profile, fetchUser, isLoading } = useUserStore();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const avatarUrl =
    profile?.profile_picture &&
    avatars.find((a) => a.id === Number(profile.profile_picture))?.url;

  return (
    <nav className="bg-black text-white fixed top-0 z-30 w-full py-4 px-4 sm:px-8 flex justify-between items-center">
      <ul className="">
        <li className="flex items-center">
          <Link to="/">
            <img className="h-8" src={Logo} alt="VidZora" />
          </Link>
        </li>
      </ul>
      <ul className="flex items-center gap-2 sm:gap-8">
        <li className="flex items-center">
          <Link
            to="/search"
            aria-label="Search videos"
            className="flex items-center justify-center h-8 w-8 text-2xl hover:text-blue-500 cursor-pointer rounded-full"
          >
            <IoMdSearch />
          </Link>
        </li>
        <li className="flex items-center">
          {isLoading ? (
            <div className="h-8 w-8 bg-gray-700 rounded-full animate-pulse" />
          ) : user ? (
            <>
              <button
                onClick={toggleMenu}
                className="flex items-center justify-center h-8 w-8 rounded-full text-white text-md cursor-pointer "
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="User Avatar"
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full w-full bg-orange-500 border-orange-200 border-2 rounded-full">
                    {user.email?.[0].toUpperCase()}
                  </div>
                )}
              </button>
              {isMenuOpen && <Menu closeMenu={closeMenu} />}
            </>
          ) : (
            <button
              className="flex items-center h-8 px-3 hover:text-blue-500 cursor-pointer rounded-full"
              onClick={() => navigate("/auth")}
            >
              Login
            </button>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
