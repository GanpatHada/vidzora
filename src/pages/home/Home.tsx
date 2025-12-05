import React, { useEffect, useState, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchPopularVideos } from "../../services/VideoService";
import { GoDotFill } from "react-icons/go";

const Home: React.FC = () => {
  const [videos, setVideos] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadMoreVideos = async () => {
    const result = await fetchPopularVideos(page);

    if (result.success) {
      const newVideos = result.data.hits;
      setVideos((prev) => [...prev, ...newVideos]);
      setPage((prev) => prev + 1);

      if (newVideos.length === 0) {
        setHasMore(false);
      }
    } else {
      setHasMore(false);
      console.error(result.error);
    }
  };

  useEffect(() => {
    loadMoreVideos();
  }, []);

  return (
    <div id="home-page" className="text-white p-4">
      <InfiniteScroll
        dataLength={videos.length}
        next={loadMoreVideos}
        hasMore={hasMore}
        loader={<span className="loader"></span>}
        endMessage={
          <p className="text-center py-4 text-gray-400">🎉 You have seen it all!</p>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
};

type VideoCardProps = {
  video: any;
};

const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => videoRef.current?.play();
  const handleMouseLeave = () => {
    if (!videoRef.current) return;
    videoRef.current.pause();
    videoRef.current.currentTime = 0;
  };

  return (
    <div
      className="
        group cursor-pointer relative rounded-lg overflow-hidden
        p-4
        transition-all duration-300
        before:content-[''] before:absolute before:inset-0
        before:rounded-xl before:bg-gray-400/30
        before:opacity-0 before:scale-90
        before:transition-all before:duration-500 before:origin-center
        hover:before:scale-100 hover:before:opacity-100
        before:z-0
      "
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* VIDEO CONTAINER */}
      <div className="relative w-full aspect-3/2 bg-gray-500/20 rounded-xl overflow-hidden duration-500 group-hover:rounded-none">
        <video
          ref={videoRef}
          className="w-full h-full object-cover transition-all "
          poster={video.videos.small.thumbnail || video.userImageURL}
          muted
          controls={false}
          preload="metadata"
        >
          <source src={video.videos.tiny.url} type="video/mp4" />
        </video>
      </div>

      {/* TEXT INFO */}
      <div className="mt-2 flex gap-4 relative z-10">
        <img
          className="h-10 w-10 shrink-0 rounded-full object-cover"
          src={video.userImageURL}
          alt={video.user}
        />
        <div className="flex flex-col gap-2">
          <h1 className="text-base font-semibold line-clamp-1 text-white">
            {video.tags || "Untitled Video"}
          </h1>
          <div className="flex flex-col gap-0.5">
          <p className="text-sm text-gray-400">{video.user}</p>
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <span>{video.views?.toLocaleString()} views</span>
            <GoDotFill />
            <span>{video.likes?.toLocaleString()} likes</span>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default Home;
