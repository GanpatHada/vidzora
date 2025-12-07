import React from "react";
import { Link } from "react-router-dom";
import type { Video } from "../../store/videoStore";

type SuggestedVideoCardProps = {
  video: Video;
};

const SuggestedVideoCard: React.FC<SuggestedVideoCardProps> = ({ video }) => {
  return (
    <Link to={`/video/${video.id}`} className="flex gap-4 p-2 rounded-lg hover:bg-gray-700/50 transition-colors duration-200">
      <img
        src={video.videos.tiny.thumbnail || video.userImageURL}
        alt={video.tags}
        className="w-40 h-24 object-cover rounded-lg flex-shrink-0"
      />
      <div className="flex flex-col">
        <h3 className="text-white text-base font-semibold line-clamp-2">
          {video.tags || "Untitled Video"}
        </h3>
        <p className="text-gray-400 text-sm mt-1">{video.user}</p>
        <p className="text-gray-400 text-sm">{video.views?.toLocaleString()} views</p>
      </div>
    </Link>
  );
};

export default SuggestedVideoCard;
