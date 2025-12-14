import React from "react";
import { CgPlayList } from "react-icons/cg";
import { Link } from "react-router-dom";

interface MyListCardProps {
  playlist: {
    id: string;
    name: string;
    description: string;
    created_at: string;
  };
}

const MyListCard: React.FC<MyListCardProps> = ({ playlist }) => {
  return (
    <Link to={`/my-list/${playlist.id}`}>
      <div className="relative cursor-pointer transition-all duration-300 hover:scale-104 w-full flex flex-col justify-between p-4 aspect-video rounded-lg shadow-lg bg-zinc-800 hover:bg-zinc-700/80 hover:shadow-xl">
        <div>
          <h2 className="text-xl text-gray-200 font-bold">{playlist.name}</h2>
          <p className="text-gray-400 text-sm">
            {playlist.description}
          </p>
        </div>

        <div className="bg-gray-700/80 flex align-middle w-fit pt-1 px-2 rounded-sm text-xs">
          <span><CgPlayList size={20} /></span> 
          <span>Created at: {new Date(playlist.created_at).toLocaleDateString()}</span>
        </div>
      </div>
    </Link>
  );
};

export default MyListCard;
