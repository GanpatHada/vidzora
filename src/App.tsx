import { Suspense, lazy } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";
import Spinner from "./components/Spinner";

// Lazy-loaded components
const Home = lazy(() => import("./pages/home/Home"));
const Auth = lazy(() => import("./pages/auth/Auth"));
const Video = lazy(() => import("./pages/video/Video"));
const Search = lazy(() => import("./pages/search/Search"));
const History = lazy(() => import("./pages/user/History"));
const Favourites = lazy(() => import("./pages/user/Favourites"));
const WatchLater = lazy(() => import("./pages/user/WatchLater"));
const MyProfile = lazy(() => import("./pages/user/MyProfile"));
const MyList = lazy(() => import("./pages/myList/MyList"));
const PlaylistPage = lazy(() => import("./pages/myList/PlaylistPage"));

const App = () => {
  const location = useLocation();

  const fullScreenSpinner = (
    <div className="w-full h-screen flex justify-center items-center">
      <Spinner />
    </div>
  );

  return (
    <>
      {location.pathname !== "/auth" && <Navbar />}
      <Toaster position="top-center" reverseOrder={false} />
      <Suspense fallback={fullScreenSpinner}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/video/:videoId" element={<Video />} />
          <Route path="/search" element={<Search />} />
          <Route path="/history" element={<History />} />
          <Route path="/favourites" element={<Favourites />} />
          <Route path="/watch-later" element={<WatchLater />} />
          <Route path="/my-profile" element={<MyProfile />} />
          <Route path="/my-list" element={<MyList />} />
          <Route path="/my-list/:playlistId" element={<PlaylistPage />} />
        </Routes>
      </Suspense>
    </>
  );
};

export default App;
