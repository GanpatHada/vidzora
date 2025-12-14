import React from "react";

const MyProfileSkeleton: React.FC = () => {
  return (
    <div className="w-full text-white p-5 pt-[120px] max-w-[1080px] m-auto">
      <h1 className="text-3xl font-bold mb-10">My Profile</h1>
      <div className="bg-slate-800 p-6 rounded-lg shadow-lg">
        <div className="flex items-center space-x-4 animate-pulse">
          {/* Skeleton for profile picture */}
          <div className="w-24 h-24 bg-gray-700 rounded-full"></div>
          <div>
            {/* Skeleton for name */}
            <div className="h-7 w-48 bg-gray-700 rounded mb-2"></div>
            {/* Skeleton for email */}
            <div className="h-5 w-64 bg-gray-700 rounded"></div>
          </div>
        </div>

        <div className="mt-6 animate-pulse">
          {/* Skeleton for Edit Profile button */}
          <div className="h-10 w-32 bg-gray-700 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default MyProfileSkeleton;
