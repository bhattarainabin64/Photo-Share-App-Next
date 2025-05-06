import React, { useEffect } from "react";
import { Heart, MessageCircle, Share2, X, Bookmark, SendHorizontal } from "lucide-react";

const PhotoModal = ({ selectedPhoto, closeModal, likes, comments, saved, toggleLike, toggleSave, addComment, commentInputRef }) => {
  useEffect(() => {
    // Focus on the comment input when the modal opens
    if (selectedPhoto && commentInputRef?.current) {
      commentInputRef.current.focus();
    }
  }, [selectedPhoto, commentInputRef]);

  if (!selectedPhoto) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden bg-black/90 backdrop-blur-sm flex items-center justify-center" onClick={closeModal}>
      <div
        className="max-w-5xl w-full bg-[#0F172A] rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="md:w-7/12 bg-black flex items-center justify-center">
          <div className="relative w-full">
            <img
              src={selectedPhoto.src}
              alt={selectedPhoto.caption}
              className="w-full h-auto max-h-[80vh] object-contain"
            />
          </div>
        </div>

        <div className="md:w-5/12 flex flex-col">
          <div className="p-5 border-b border-slate-700 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center ring-2 ring-slate-600">
                <span className="text-white text-sm font-bold">{selectedPhoto.username.charAt(0).toUpperCase()}</span>
              </div>
              <div>
                <p className="font-medium text-base">{selectedPhoto.username}</p>
                <p className="text-gray-400 text-xs">{selectedPhoto.timestamp}</p>
              </div>
            </div>
            <button
              onClick={closeModal}
              className="rounded-full p-2 hover:bg-slate-700 transition-colors"
            >
              <X size={20} className="text-gray-300" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 max-h-[350px] bg-slate-800/50">
            <div className="flex space-x-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex-shrink-0 flex items-center justify-center">
                <span className="text-white text-xs font-bold">{selectedPhoto.username.charAt(0).toUpperCase()}</span>
              </div>
              <div>
                <p className="text-sm text-gray-100">
                  <span className="font-medium">{selectedPhoto.username}</span>
                  {selectedPhoto.caption}
                </p>
                <p className="text-gray-400 text-xs mt-1">{selectedPhoto.timestamp}</p>
              </div>
            </div>

            <div className="space-y-5">
              {(comments[selectedPhoto.id] || []).map((comment, index) => (
                <div key={index} className="flex space-x-3">
                  <div className="w-8 h-8 rounded-full bg-slate-700 flex-shrink-0 flex items-center justify-center">
                    {/* <span className="text-gray-300 text-xs font-bold">{comment?.username?.charAt(0).toUpperCase()}</span> */}
                  </div>
                  <div>
                    <p className="text-sm text-gray-100">
                      <span className="font-medium">{comment.username}</span>
                      {comment.text}
                    </p>
                    <p className="text-gray-400 text-xs mt-1">{comment.timestamp}</p>
                  </div>
                </div>
              ))}</div>
          </div>

          <div className="p-5 border-t border-slate-700 bg-slate-900">
            <div className="flex justify-between items-center mb-4">
              <div className="flex space-x-4">
                <button
                  onClick={() => toggleLike(selectedPhoto.id)}
                  className="focus:outline-none transform active:scale-90 transition-transform"
                >
                  <Heart
                    size={24}
                    className={likes[selectedPhoto.id] ? "text-red-500 fill-red-500" : "text-gray-300"}
                  />
                </button>

                <button className="focus:outline-none transform active:scale-90 transition-transform">
                  <MessageCircle size={24} className="text-gray-300" />
                </button>

                <button
                  onClick={() => shareImage(selectedPhoto.src)}
                  className="focus:outline-none transform active:scale-90 transition-transform"
                >
                  <Share2 size={24} className="text-gray-300" />
                </button>
              </div>

              <button
                onClick={() => toggleSave(selectedPhoto.id)}
                className="focus:outline-none transform active:scale-90 transition-transform"
              >
                <Bookmark
                  size={24}
                  className={saved[selectedPhoto.id] ? "text-blue-500 fill-blue-500" : "text-gray-300"}
                />
              </button>
            </div>

            <p className="text-sm font-medium mb-4 text-gray-200">
              {selectedPhoto.likes + (likes[selectedPhoto.id] ? 1 : 0)} likes
            </p>

            <div className="relative">
              <input
                ref={commentInputRef}
                type="text"
                placeholder="Share your thoughts..."
                className="w-full bg-slate-800 text-gray-100 rounded-full py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder-gray-500"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    addComment(selectedPhoto.id, e.target.value);
                    e.target.value = "";
                  }
                }}
              />
              <button
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                onClick={(e) => {
                  const input = e.target.parentNode.querySelector('input');
                  addComment(selectedPhoto.id, input.value);
                  input.value = "";
                  input.focus();
                }}
              >
                <SendHorizontal size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoModal;
