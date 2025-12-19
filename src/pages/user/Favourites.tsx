import React, { useEffect } from "react";
import { useUserPageStore } from "../../store/userPageStore";
import UserPageSkeleton from "./UserPageSkeleton";
import FavouriteVideoCard from "./FavouriteVideoCard";
import { useUserStore } from "../../store/userStore";
import { motion, AnimatePresence } from "framer-motion";

const Favourites: React.FC = () => {
  const { fetchFavourites, videos, isLoading, error, clearVideos } =
    useUserPageStore();
  const { isLoading: isUserLoading, user } = useUserStore();

  useEffect(() => {
    if (user) {
      fetchFavourites();
    }
    return () => {
      clearVideos();
    };
  }, [fetchFavourites, clearVideos, user]);

  if (isUserLoading) {
    return <p className="text-white">User is loading...</p>;
  }

  return (
    <div className="w-full text-white p-5 pt-[120px] max-w-[1080px] m-auto">
      <h1 className="text-3xl font-bold mb-10">Favourites</h1>
      {isLoading && <UserPageSkeleton />}
      {error && <p className="text-red-500">{error.message}</p>}
      {!isLoading && !error && (
        <div className="flex flex-col gap-5">
          <AnimatePresence>
            {videos.length > 0 ? (
              videos.map((video) => (
                <motion.div
                  key={video.db_id}
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <FavouriteVideoCard video={video} />
                </motion.div>
              ))
            ) : (
              <p className="text-gray-400">
                You have no videos in your favourites list.
              </p>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default Favourites;
