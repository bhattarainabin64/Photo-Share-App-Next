"use client";

import React from "react";
import { useDispatch } from "react-redux";
import { logout } from "@/lib/redux/slices/authSlice"; 
import { useRouter } from "next/navigation";
import { User, LogOut, Edit, Settings } from "lucide-react";
import { useGetUserDetailsQuery } from "@/lib/services/auth";

export default function ProfilePage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { data: user, error, isLoading } = useGetUserDetailsQuery();

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  const handleEditProfile = () => {
    router.push("/profile/edit");
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-red-600 h-24 relative">
          <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 border-4 border-white rounded-full">
            <User className="w-24 h-24 text-gray-300 bg-white rounded-full p-4" />
          </div>
        </div>

        <div className="pt-16 p-6 text-center">
          {isLoading ? (
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
          ) : error ? (
            <p className="text-red-500 text-center">Failed to load profile</p>
          ) : (
            user && (
              <>
                <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
                <p className="text-gray-500 mb-6">{user.email}</p>

                <div className="flex justify-center space-x-4 mb-6">
                  <button 
                    onClick={handleEditProfile}
                    className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg flex items-center hover:bg-blue-100 transition"
                  >
                    <Edit className="w-5 h-5 mr-2" />
                    Edit Profile
                  </button>
                  <button 
                    onClick={() => router.push("/settings")}
                    className="bg-gray-50 text-gray-600 px-4 py-2 rounded-lg flex items-center hover:bg-gray-100 transition"
                  >
                    <Settings className="w-5 h-5 mr-2" />
                    Settings
                  </button>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition flex items-center justify-center"
                >
                  <LogOut className="w-5 h-5 mr-2" />
                  Logout
                </button>
              </>
            )
          )}
        </div>
      </div>
    </div>
  );
}