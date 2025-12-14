import React, { useEffect } from "react";
import { useUserPageStore } from "../../store/userPageStore";
import HistoryVideoCard from "./HistoryVideoCard";
import UserPageSkeleton from "./UserPageSkeleton";
import { useUserStore } from "../../store/userStore";
import { motion, AnimatePresence } from "framer-motion";

const History:React.FC = () => {
  const { fetchHistory, videos, isLoading, error, clearVideos } =
    useUserPageStore();
  const { isLoading: isUserLoading, user } = useUserStore();

  useEffect(() => {
    if (user) {
      fetchHistory();
    }
    return () => {
      clearVideos();
    };
  }, [fetchHistory, clearVideos, user]);

  if (isUserLoading) {
    return <p className="text-white">User is loading...</p>;
  }

  return (
    <div className="w-full text-white p-5 pt-[120px] max-w-[1080px] m-auto">
      <h1 className="text-3xl font-bold mb-10">Watch History</h1>
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
                  <HistoryVideoCard video={video} />
                </motion.div>
              ))
            ) : (
              <p className="text-gray-400">
                You have no videos in your history.
              </p>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default History;