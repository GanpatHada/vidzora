import React from "react";

const VideoSkeleton: React.FC = () => {
  return (
    <div className="text-white pt-20 px-4 md:px-8 lg:px-16 xl:px-20 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <div
          className="relative w-full overflow-hidden"
          style={{ paddingTop: "56.25%" }}
        >
          <div className="absolute top-0 left-0 w-full h-full bg-gray-700 animate-pulse"></div>
        </div>
        <div className="mt-4">
          <div className="h-10 w-3/4 bg-gray-700 animate-pulse"></div>

          <div className="flex items-center gap-4 mt-4">
            <div className="w-12 h-12 rounded-full bg-gray-700 animate-pulse"></div>
            <div className="h-6 w-1/4 bg-gray-700 rounded-full animate-pulse"></div>
          </div>

          <div className="flex items-center flex-wrap gap-x-6 gap-y-2 mt-4">
            <div className="h-5 w-24 bg-gray-700 rounded-full animate-pulse"></div>
            <div className="h-5 w-20 bg-gray-700 rounded-full animate-pulse"></div>
            <div className="h-5 w-28 bg-gray-700 rounded-full animate-pulse"></div>
            <div className="h-5 w-24 bg-gray-700 rounded-full animate-pulse"></div>
          </div>

          <div className="flex items-center gap-4 mt-6">
            <div className="h-10 w-32 bg-gray-700 rounded-full animate-pulse"></div>
            <div className="h-10 w-24 bg-gray-700 rounded-full animate-pulse"></div>
            <div className="h-10 w-28 bg-gray-700 rounded-full animate-pulse"></div>
          </div>
          <div className="mt-4 p-4 bg-gray-800 rounded-lg">
            <div className="h-8 w-1/2 bg-gray-700 animate-pulse"></div>
            <div className="h-24 w-full bg-gray-700 mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
      <div className="lg:col-span-1">
        <h2 className="text-2xl font-bold mb-4">Suggested Videos</h2>
        <div className="flex flex-col gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-4">
              <div className="w-40 h-24 bg-gray-700 rounded-lg animate-pulse flex-shrink-0"></div>
              <div className="flex-1">
                <div className="h-6 w-full bg-gray-700 rounded animate-pulse"></div>
                <div className="h-4 w-1/2 bg-gray-700 mt-2 rounded animate-pulse"></div>
                <div className="h-4 w-1/3 bg-gray-700 mt-1 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoSkeleton;
