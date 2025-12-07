import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/home/Home";
import Auth from "./pages/auth/Auth";
import Video from "./pages/video/Video";
import Search from "./pages/search/Search";

const App = () => {
  const location=useLocation()
  return (
    <>
      {location.pathname!=="/auth"&&<Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/video/:videoId" element={<Video />} />
        <Route path="/search" element={<Search />} />
      </Routes>
    </>
  );
};

export default App;
