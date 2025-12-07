import React, { useState, useEffect } from "react";
import Logo from "../assets/vidzora_max.svg";
import { IoMdSearch } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import Menu from "./Menu";
import { useUserStore } from "../store/userStore";


const Navbar: React.FC = () => {
  const navigate=useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, fetchUser, isLoading } = useUserStore();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-black text-white fixed top-0 z-30 w-screen py-4 px-8 flex justify-between items-center">
      <ul className="">
        <li className="flex items-center">
          <Link to="/">
            <img className="h-8" src={Logo} alt="VidZora" />
          </Link>
        </li>
      </ul>
      <ul className="flex items-center gap-8">
        <li className="flex items-center">
          <Link to="/search" className="flex items-center justify-center h-8 w-8 text-2xl hover:text-blue-500 cursor-pointer rounded-full">
            <IoMdSearch />
          </Link>
        </li>
        <li className="flex items-center">
          {isLoading ? (
            <div className="h-8 w-8 bg-gray-700 rounded-full animate-pulse" />
          ) : user ? (
            <>
              <button onClick={toggleMenu} className="flex items-center justify-center h-8 w-8 bg-yellow-300 rounded-full text-black text-2xl cursor-pointer ">
                {user.email?.[0].toUpperCase()}
              </button>
              {isMenuOpen && <Menu closeMenu={closeMenu} />}
            </>
          ) : (
            <button className="flex items-center h-8 px-3 hover:text-blue-500 cursor-pointer rounded-full" onClick={()=>navigate("/auth")}>
              Login
            </button>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
