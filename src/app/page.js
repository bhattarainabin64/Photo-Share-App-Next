"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Heart, MessageCircle, Share2, X, Camera, Bookmark, MoreHorizontal, Search,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import PhotoModal from "@/components/PhotoModal";
import { useSelector } from "react-redux";
import moment from "moment";
import {
  useLazyGetPhotosQuery,
  useLikePhotoMutation,
  useCommentPhotoMutation,
} from "@/lib/services/upload";

const Home = () => {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [userLikedPhotos, setUserLikedPhotos] = useState({});
  const [likesCounts, setLikesCounts] = useState({});
  const [comments, setComments] = useState({});
  const [saved, setSaved] = useState({});
  const [searchActive, setSearchActive] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [photos, setPhotos] = useState([]);
  const commentInputRef = useRef(null);

  const token = useSelector((state) => state?.auth?.token);
  const user = useSelector((state) => state?.auth?.user);

  const [triggerGetPhotos, { data, isLoading }] = useLazyGetPhotosQuery();
  const [likePhoto] = useLikePhotoMutation();
  const [commentPhoto] = useCommentPhotoMutation();

  useEffect(() => {
    triggerGetPhotos({ page: 1, limit: 20, search: "", sortBy: "createdAt" });
  }, [triggerGetPhotos]);

  useEffect(() => {
    if (data?.photos?.length) {
      const transformed = data.photos.map((photo) => ({
        id: photo._id,
        src: photo.imageUrl,
        caption: photo.caption,
        username: photo.creator?.email || "unknown",
        likes: photo.likes?.length || 0,
        timestamp: moment(photo.createdAt).fromNow(),
        raw: photo,
      }));
      setPhotos(transformed);

      const initialUserLikes = {};
      const initialLikesCounts = {};
      const initialComments = {};

      transformed.forEach((photo) => {
        const hasUserLiked = photo.raw.likes?.some(
          (like) => like.userId === user?.id || like.user === user?.id
        );
        initialUserLikes[photo.id] = hasUserLiked || false;
        initialLikesCounts[photo.id] = photo.raw.likes?.length || 0;
        initialComments[photo.id] = photo.raw.comments || [];
      });

      setUserLikedPhotos(initialUserLikes);
      setLikesCounts(initialLikesCounts);
      setComments(initialComments);
    }
  }, [data, user?.id]);

  const openModal = (photo) => {
    document.body.style.overflow = "hidden";
    setSelectedPhoto(photo);
    setTimeout(() => commentInputRef.current?.focus(), 300);
  };

  const closeModal = () => {
    document.body.style.overflow = "auto";
    setSelectedPhoto(null);
  };

  const toggleLike = async (id, e) => {
    e?.stopPropagation();
    const currentlyLiked = userLikedPhotos[id];
    const currentCount = likesCounts[id];
    const newCount = currentlyLiked ? Math.max(0, currentCount - 1) : currentCount + 1;

    setUserLikedPhotos((prev) => ({ ...prev, [id]: !currentlyLiked }));
    setLikesCounts((prev) => ({ ...prev, [id]: newCount }));

    try {
      const response = await likePhoto(id).unwrap();
      if (response && typeof response.likesCount === "number") {
        setLikesCounts((prev) => ({ ...prev, [id]: response.likesCount }));
      }
    } catch (err) {
      console.error("Like failed:", err);
      setUserLikedPhotos((prev) => ({ ...prev, [id]: currentlyLiked }));
      setLikesCounts((prev) => ({ ...prev, [id]: currentCount }));
    }
  };

  const toggleSave = (id, e) => {
    e?.stopPropagation();
    setSaved((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const addComment = async (id, text) => {
    if (!text.trim()) return;
    try {
      const response = await commentPhoto({ photoId: id, text }).unwrap();
      const latestComments = response?.comments || [];
      setComments((prev) => ({
        ...prev,
        [id]: latestComments,
      }));
    } catch (err) {
      console.error("Comment failed:", err);
    }
  };

  const shareImage = (url, e) => {
    e?.stopPropagation();
    navigator.clipboard.writeText(url);
    const toast = document.createElement("div");
    toast.className =
      "fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-80 text-white px-4 py-2 rounded-full text-sm z-50";
    toast.textContent = "Link copied to clipboard!";
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transition = "opacity 0.5s ease";
      setTimeout(() => document.body.removeChild(toast), 500);
    }, 2000);
  };

  const toggleSearchBar = () => setSearchActive(!searchActive);
  const toggleView = () => setViewMode(viewMode === "grid" ? "feed" : "grid");

  return (
    <div className="bg-[#0F172A] min-h-screen text-gray-100">
      <Navbar userRole={user?.role} isLoggedIn={!!token} />

      <div className={`fixed inset-0 bg-[#0F172A] z-40 transform transition-transform duration-300 ${searchActive ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="container mx-auto p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search photos, users, or tags..."
                className="w-full pl-10 pr-4 py-3 bg-slate-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus={searchActive}
              />
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            </div>
            <button className="ml-4 p-2" onClick={toggleSearchBar}>
              <X size={24} className="text-gray-300" />
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-4 pb-20">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-100">Discover</h1>
          <div className="flex items-center space-x-3">
            <button onClick={toggleSearchBar} className="p-2 rounded-full hover:bg-slate-800 text-gray-300">
              <Search size={20} />
            </button>
            <button onClick={toggleView} className="p-2 rounded-full hover:bg-slate-800 text-gray-300">
              <div className="relative w-5 h-5">
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-2 gap-0.5">{[...Array(4)].map((_, i) => <div key={i} className="bg-gray-300 rounded-sm"></div>)}</div>
                ) : (
                  <div className="flex flex-col justify-between h-full">{[...Array(3)].map((_, i) => <div key={i} className="h-1 bg-gray-300 rounded-sm"></div>)}</div>
                )}
              </div>
            </button>
          </div>
        </div>

        {isLoading ? (
          <p className="text-center text-gray-400">Loading photos...</p>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="group relative rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-slate-800"
                onClick={() => openModal(photo)}
              >
                <div className="aspect-square overflow-hidden">
                  <img src={photo.src} alt={photo.caption} className="w-full h-full object-cover transition duration-500 group-hover:scale-105" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                  <p className="text-white text-sm font-medium truncate">{photo.caption}</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center">
                      <Heart size={16} className={`${userLikedPhotos[photo.id] ? "text-red-500 fill-red-500" : "text-white"} mr-1`} onClick={(e) => toggleLike(photo.id, e)} />
                      <span className="text-white text-xs">{likesCounts[photo.id] || 0}</span>
                    </div>
                    <span className="text-white text-xs">@{photo.username}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {photos.map((photo) => (
              <div key={photo.id} className="bg-slate-800 rounded-xl shadow-md overflow-hidden">
                <div className="flex items-center justify-between p-3 border-b border-slate-700">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{photo.username.charAt(0).toUpperCase()}</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">{photo.username}</p>
                      <p className="text-gray-400 text-xs">{photo.timestamp}</p>
                    </div>
                  </div>
                  <button><MoreHorizontal size={20} className="text-gray-400" /></button>
                </div>
                <div className="relative cursor-pointer" onClick={() => openModal(photo)}>
                  <img src={photo.src} alt={photo.caption} className="w-full h-auto" />
                  <div className="absolute inset-0" onDoubleClick={() => toggleLike(photo.id)}></div>
                </div>
                <div className="p-3">
                  <div className="flex justify-between mb-2">
                    <div className="flex space-x-4">
                      <button onClick={(e) => toggleLike(photo.id, e)}>
                        <Heart size={24} className={userLikedPhotos[photo.id] ? "text-red-500 fill-red-500" : "text-gray-300"} />
                      </button>
                      <button onClick={() => openModal(photo)}><MessageCircle size={24} className="text-gray-300" /></button>
                      <button onClick={(e) => shareImage(photo.src, e)}><Share2 size={24} className="text-gray-300" /></button>
                    </div>
                    <button onClick={(e) => toggleSave(photo.id, e)}>
                      <Bookmark size={24} className={saved[photo.id] ? "text-blue-500 fill-blue-500" : "text-gray-300"} />
                    </button>
                  </div>
                  <p className="text-sm font-medium mb-1">{likesCounts[photo.id] || 0} likes</p>
                  <p className="text-sm"><span className="font-medium">{photo.username}</span> {photo.caption}</p>
                  {comments[photo.id]?.length > 0 && (
                    <button className="text-gray-400 text-sm mt-1" onClick={() => openModal(photo)}>
                      View all {comments[photo.id].length} comments
                    </button>
                  )}
                  <div className="flex items-center mt-3 border-t border-slate-700 pt-3">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      className="flex-1 text-sm bg-transparent outline-none text-gray-300 placeholder-gray-500"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          addComment(photo.id, e.target.value);
                          e.target.value = "";
                        }
                      }}
                    />
                    <button className="text-blue-400 font-medium text-sm" onClick={(e) => {
                      const input = e.target.previousSibling;
                      addComment(photo.id, input.value);
                      input.value = "";
                    }}>Post</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <button className="fixed right-6 bottom-6 w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-violet-500 text-white shadow-lg flex items-center justify-center">
          <Camera size={24} />
        </button>
      </div>

      {selectedPhoto && (
        <PhotoModal
          selectedPhoto={selectedPhoto}
          closeModal={closeModal}
          likes={userLikedPhotos}
          comments={comments}
          saved={saved}
          toggleLike={toggleLike}
          toggleSave={toggleSave}
          addComment={addComment}
          commentInputRef={commentInputRef}
          likesCounts={likesCounts}
        />
      )}
    </div>
  );
};

export default Home;
