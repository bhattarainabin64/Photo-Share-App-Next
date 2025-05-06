"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Upload, Bell, User, Menu, X, Camera, Heart, LogOut } from "lucide-react";
import LoadingIndicator from "./LoadingIndicator";
import { useDispatch } from 'react-redux';

import { logout } from "@/lib/redux/slices/authSlice";

const Navbar = ({ isLoggedIn = false, userRole = "user", unreadNotifications = 0 }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dispatch = useDispatch(); 


  const handleSignOut = () => {
    dispatch(logout());
    router.push("/");
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const textColor = scrolled ? "text-gray-900" : "text-white"; 
  const bgColor = scrolled ? "bg-white" : "bg-[#0F172A]"; 
  const hoverColor = scrolled ? "hover:bg-gray-100" : "hover:bg-white/10"; 

  return (
    <>

      <nav
        className={`fixed top-0 left-0 w-full z-50 p-4 transition-all duration-300 ${bgColor} ${scrolled ? "shadow-lg" : ""}`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-3">
              <div className={`rounded-full p-2 ${scrolled ? "bg-indigo-500" : "bg-white"}`}>
                <Camera className={`h-5 w-5 ${scrolled ? "text-white" : "text-indigo-600"}`} />
              </div>
              <h1 className={`text-2xl font-bold ${textColor}`}>
                Photo<span className="text-indigo-500">Share</span>
              </h1>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/explore" className={`px-4 py-2 rounded-full ${hoverColor} ${textColor}`}>
              Explore
            </Link>

            {isLoggedIn ? (
              <>
                {userRole === "creator" && (
                  <Link
                    href="/photos/upload"
                    className={`flex items-center gap-2 px-4 py-2 rounded-full ${hoverColor} ${textColor}`}
                  >
                    <Upload className="h-4 w-4" />
                    Create
                  </Link>
                )}


                <div className="relative group">
                  <button className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${scrolled ? "border-gray-200" : "border-white/20"} ${textColor}`}>
                    <User className="h-5 w-5" />
                    <span>Profile</span>
                  </button>

                  <div className="absolute right-0 mt-2 w-48 rounded-xl shadow-lg bg-[#0F172A] ring-1 ring-black ring-opacity-5 hidden group-hover:block">
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 px-4 py-2 hover:bg-[#0F172A] text-white"
                    >
                      <User className="h-4 w-4" />
                      My Profile
                    </Link>
                    <Link
                      href="/saved"
                      className="flex items-center gap-3 px-4 py-2 hover:bg-[#0F172A] text-white"
                    >
                      <Heart className="h-4 w-4" />
                      Saved Photos
                    </Link>
                    <div className="border-t border-gray-100 my-1"></div>
                    <Link
                     onClick={handleSignOut}
                      href="/"
                      className="flex items-center gap-3 px-4 py-2 text-red-500 hover:bg-[#0F172A] hover:text-white"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </Link>
                  </div>


                </div>
              </>
            ) : (
              <div className="flex gap-3">
                <Link href="/account/login" className={`px-4 py-2 rounded-full ${textColor} ${hoverColor}`}>
                  Login
                </Link>
                <Link href="/account/register" className="px-5 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:opacity-90 transition-all font-medium shadow-md">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          <button
            className={`md:hidden p-2 rounded-full ${hoverColor} ${textColor}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div
            className={`absolute top-full left-0 w-full p-4 flex flex-col gap-4 ${scrolled ? "bg-white shadow-lg" : "bg-[#0F172A] backdrop-blur-lg"}`}
          >
            <div className={`flex items-center ${scrolled ? "bg-gray-100" : "bg-white/10"} rounded-full px-4 py-3`}>
              <Search className={`h-4 w-4 ${scrolled ? "text-gray-800" : "text-white"}`} />
              <input
                type="text"
                placeholder="Search..."
                className={`bg-transparent border-none focus:outline-none w-full px-3 ${scrolled ? "text-gray-800 placeholder-gray-400" : "text-white placeholder-white/70"}`}
              />
            </div>

            <Link href="/explore" className={`py-3 ${scrolled ? "text-gray-800" : "text-white"} hover:opacity-80`}>
              Explore
            </Link>

            {isLoggedIn ? (
              <>
                {userRole === "creator" && (
                  <Link href="/upload" className={`flex items-center gap-3 py-3 ${scrolled ? "text-gray-800" : "text-white"} hover:opacity-80`}>
                    <Upload className="h-5 w-5" />
                    Create New Post
                  </Link>
                )}

                <Link href="/notifications" className={`flex items-center gap-3 py-3 ${scrolled ? "text-gray-800" : "text-white"} hover:opacity-80`}>
                  <Bell className="h-5 w-5" />
                  Notifications
                </Link>
              </>
            ) : (
              <div className="flex flex-col gap-3">
                <Link href="/login" className={`py-3 ${scrolled ? "text-gray-800" : "text-white"} hover:opacity-80`}>
                  Login
                </Link>
                <Link href="/signup" className={`py-3 ${scrolled ? "text-gray-800" : "text-white"} hover:opacity-80`}>
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
