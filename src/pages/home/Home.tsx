import React, { useEffect } from "react";
import HomeSkeleton from "./HomeSkeleton";
import Categories from "./Categories";
import { useVideoStore } from "../../store/videoStore";
import Spinner from "../../components/Spinner";
import InfiniteScroll from "react-infinite-scroll-component";
import VideoCard from "../../components/VideoCard";

const Home: React.FC = () => {
  const { videos, isLoading, error, fetchVideos, fetchMoreVideos, hasMore } =
    useVideoStore();

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  if (error)
    return <div className="text-white p-4 pt-[120px]">Error: {error}</div>;

  return (
    <div id="home-page" className="text-white p-4 pt-[120px]">
      <Categories />
      {videos.length === 0 && isLoading && <HomeSkeleton />}
      <InfiniteScroll
        dataLength={videos.length}
        next={fetchMoreVideos}
        hasMore={hasMore}
        loader={<Spinner />}
        endMessage={
          <div className="text-center text-gray-500 py-4">No more videos</div>
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

export default Home;
