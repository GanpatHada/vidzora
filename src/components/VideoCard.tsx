import React, { useRef, useState } from "react";
import { GoDotFill } from "react-icons/go";
import { Link } from "react-router-dom";

import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

import type { Video } from "../store/videoStore";

type VideoCardProps = {
  video: Video;
};

const VideoCard: React.FC<VideoCardProps> = React.memo(({ video }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const duration = videoRef.current.duration;
    const percent = (current / duration) * 100;
    setProgress(percent);
  };

  const handleMouseEnter = () => videoRef.current?.play();
  const handleMouseLeave = () => {
    if (!videoRef.current) return;
    videoRef.current.pause();
    videoRef.current.currentTime = 0;
    setProgress(0);
  };

  return (
    <Link to={`/video/${video.id}`}>
      <div
        className="
          group cursor-pointer relative sm:rounded-lg overflow-hidden
          sm:p-4 transition-all duration-300
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
        <div className="relative w-full aspect-3/2 bg-gray-500/20 sm:rounded-xl overflow-hidden duration-500 group-hover:rounded-none">
          <video
            ref={videoRef}
            className="w-full h-full object-cover transition-all"
            poster={video.videos.small.thumbnail || video.userImageURL}
            muted
            controls={false}
            preload="metadata"
            onTimeUpdate={handleTimeUpdate}
          >
            <source src={video.videos.tiny.url} type="video/mp4" />
          </video>

          <div className="pointer-events-none absolute bottom-0 left-0 w-full h-1 bg-gray-700/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div
              className="h-full bg-white transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="mt-2 p-2 sm:p-0 flex gap-4 relative z-10">
          <div className="mt-2 p-2 sm:p-0 flex gap-4 relative z-10 items-center">
            <div className="relative h-10 w-10 shrink-0 rounded-full overflow-hidden">
              <LazyLoadImage
                src={video.userImageURL || undefined}
                alt={video.user}
                effect="blur"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
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
    </Link>
  );
});

export default VideoCard;
