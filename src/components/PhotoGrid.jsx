import React from "react";
import { Heart, Bookmark } from "lucide-react";

const PhotoGrid = ({ photos, likes, saved, openModal, toggleLike, toggleSave }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {photos.map((photo) => (
        <div
          key={photo.id}
          className="group relative rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-slate-800"
          onClick={() => openModal(photo)}
        >
          <div className="aspect-square overflow-hidden">
            <img
              src={photo.src}
              alt={photo.caption}
              className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
            />
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
            <p className="text-white text-sm font-medium truncate">{photo.caption}</p>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center">
                <Heart
                  size={16}
                  className={`${likes[photo.id] ? "text-red-500 fill-red-500" : "text-white"} mr-1`}
                  onClick={(e) => toggleLike(photo.id, e)}
                />
                <span className="text-white text-xs">{photo.likes + (likes[photo.id] ? 1 : 0)}</span>
              </div>
              <span className="text-white text-xs">@{photo.username}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PhotoGrid;
