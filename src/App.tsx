import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/home/Home";
import Auth from "./pages/auth/Auth";
import Video from "./pages/video/Video";
import Search from "./pages/search/Search";
import History from "./pages/user/History";
import Favourites from "./pages/user/Favourites";
import WatchLater from "./pages/user/WatchLater";
import MyProfile from "./pages/user/MyProfile"; // Import MyProfile
import { Toaster } from "react-hot-toast";
import MyList from "./pages/myList/MyList";
import PlaylistPage from "./pages/myList/PlaylistPage";

const App = () => {
  const location = useLocation();
  return (
    <>
      {location.pathname !== "/auth" && <Navbar />}
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/video/:videoId" element={<Video />} />
        <Route path="/search" element={<Search />} />
        <Route path="/history" element={<History />} />
        <Route path="/favourites" element={<Favourites />} />
        <Route path="/watch-later" element={<WatchLater />} />
        <Route path="/my-profile" element={<MyProfile />} /> {/* Add new route */}
        <Route path="/my-list" element={<MyList />} />
        <Route path="/my-list/:playlistId" element={<PlaylistPage />} />
      </Routes>
    </>
  );
};

export default App;
