import React from "react";

const SkeletonCard = () => {
  return (
    <div
      className="
        animate-pulse p-4 rounded-lg overflow-hidden
      "
    >
      <div className="w-full aspect-3/2 bg-gray-500/40 rounded-xl"></div>
      <div className="mt-2 flex gap-4">
        <div className="h-10 w-10 rounded-full bg-gray-500/40"></div>
        <div className="flex flex-col gap-2 w-full">
          <div className="h-4 bg-gray-500/40 rounded w-3/4"></div>
          <div className="h-3 bg-gray-500/40 rounded w-1/2"></div>

          <div className="flex items-center gap-2">
            <div className="h-3 bg-gray-500/40 rounded w-16"></div>
            <div className="h-3 bg-gray-500/40 rounded w-10"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const HomeSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
      {Array.from({ length: 10 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
};

export default HomeSkeleton;
