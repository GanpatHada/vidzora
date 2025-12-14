import React from "react";

const UserPageSkeleton:React.FC= () => {
  return (
    <div className="w-full">
      <div className="h-8 w-48 bg-gray-700 animate-pulse mb-5"></div>
      <div className="flex flex-col gap-5">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex gap-4">
            <div className="w-40 h-24 bg-gray-700 rounded-lg animate-pulse shrink-0"></div>
            <div className="flex-1">
              <div className="h-6 w-full bg-gray-700 rounded animate-pulse"></div>
              <div className="h-4 w-1/2 bg-gray-700 mt-2 rounded animate-pulse"></div>
              <div className="h-4 w-1/3 bg-gray-700 mt-1 rounded animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserPageSkeleton;
