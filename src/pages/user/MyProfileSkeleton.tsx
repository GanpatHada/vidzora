import React from "react";

const MyProfileSkeleton: React.FC = () => {
  return (
    <div className="w-full text-white p-5 pt-[120px] max-w-[1080px] m-auto">
      <h1 className="text-3xl font-bold mb-10">My Profile</h1>
      <div className="bg-slate-800 p-6 rounded-lg shadow-lg">
        <div className="flex items-center space-x-4 animate-pulse">
    
          <div className="w-24 h-24 bg-gray-500/40 rounded-full"></div>
          <div>
      
            <div className="h-7 w-48 bg-gray-500/40 rounded mb-2"></div>
      
            <div className="h-5 w-64 bg-gray-500/40 rounded"></div>
          </div>
        </div>

        <div className="mt-6 animate-pulse">
    
          <div className="h-10 w-32 bg-gray-500/40 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default MyProfileSkeleton;
