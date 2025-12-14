import React from "react";
import { Link } from "react-router-dom";
import type { Video } from "../../store/videoStore";
import VideoMenu from "../../components/VideoMenu";
import { useUserPageStore } from "../../store/userPageStore";

type HistoryVideoCardProps = {
  video: Video;
};

const HistoryVideoCard: React.FC<HistoryVideoCardProps> = ({ video }) => {
  console.log(video);
  const {
    addToFavorite,
    addToWatchLater,
    deleteHistory,
    isFavorite,
    isInWatchLater,
  } = useUserPageStore();

  return (
    <div className="flex gap-4 p-2 rounded-lg hover:bg-gray-700/50 transition-colors duration-200">
      <Link to={`/video/${video.id}`} className="shrink-0">
        <video
          src={video.videos.tiny.url}
          className="w-40 h-24 object-cover rounded-lg"
        />
      </Link>
      <div className="flex flex-col grow">
        <Link to={`/video/${video.id}`}>
          <h3 className="text-white text-base font-semibold line-clamp-2">
            {video.tags || "Untitled Video"}
          </h3>
          <p className="text-gray-400 text-sm mt-1">{video.user}</p>
          <p className="text-gray-400 text-sm">
            {video.views?.toLocaleString()} views
          </p>
        </Link>
      </div>
      <div className="shrink-0 ml-20">
        <VideoMenu
          video={video}
          isFavorite={isFavorite(String(video.id))}
          isInWatchLater={isInWatchLater(String(video.id))}
          onToggleFavorite={() => addToFavorite(String(video.id))}
          onToggleWatchLater={() => addToWatchLater(String(video.id))}
          onDeleteFromHistory={() => deleteHistory(video.db_id)}
        />
      </div>
    </div>
  );
};

export default HistoryVideoCard;
